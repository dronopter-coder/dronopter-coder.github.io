// Uygulama ses efektlerini sentezler (harici dosya/lisans gerekmez): node scripts/generate-sounds.mjs
// Çıktı: assets/sounds/scan-loop.m4a, scan-done.m4a, scan-error.m4a (ffmpeg gerekir)
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';

const SR = 44100;
const OUT = new URL('../assets/sounds/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

// Tekrarlanabilir rastgelelik
let seed = 1234567;
const rand = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

/** Durum değişkenli filtre (bant geçiren). */
function svf() {
  let low = 0,
    band = 0;
  return (x, cutoff, q = 0.35) => {
    const f = 2 * Math.sin((Math.PI * Math.min(cutoff, SR / 6)) / SR);
    low += f * band;
    const high = x - low - q * band;
    band += f * high;
    return band;
  };
}

/** Basit yankı: birkaç geri beslemeli gecikme hattı. */
function reverb(buf, mix = 0.25) {
  const delays = [1557, 1617, 1491, 1422].map((d) => ({ d, line: new Float32Array(d), i: 0 }));
  const out = new Float32Array(buf.length);
  for (let n = 0; n < buf.length; n++) {
    let wet = 0;
    for (const t of delays) {
      const y = t.line[t.i];
      t.line[t.i] = buf[n] + y * 0.72;
      t.i = (t.i + 1) % t.d;
      wet += y;
    }
    out[n] = buf[n] * (1 - mix) + (wet / delays.length) * mix;
  }
  return out;
}

function normalize(buf, peak = 0.89) {
  let m = 0;
  for (const v of buf) m = Math.max(m, Math.abs(v));
  const g = m ? peak / m : 1;
  return buf.map((v) => v * g);
}

function save(name, buf) {
  const wav = `${OUT}${name}.wav`;
  const data = Buffer.alloc(44 + buf.length * 2);
  data.write('RIFF', 0);
  data.writeUInt32LE(36 + buf.length * 2, 4);
  data.write('WAVEfmt ', 8);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(1, 22);
  data.writeUInt32LE(SR, 24);
  data.writeUInt32LE(SR * 2, 28);
  data.writeUInt16LE(2, 32);
  data.writeUInt16LE(16, 34);
  data.write('data', 36);
  data.writeUInt32LE(buf.length * 2, 40);
  buf.forEach((v, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), 44 + i * 2));
  writeFileSync(wav, data);
  const m4a = `${OUT}${name}.m4a`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-c:a', 'aac', '-b:a', '128k', m4a]);
  rmSync(wav);
  console.log(`✓ ${name}.m4a (${(buf.length / SR).toFixed(2)} sn)`);
}

// ── 1) Tarama döngüsü: 3,2 sn (tarama çizgisi 1,6 sn iner + 1,6 sn çıkar) ──
{
  const LOOP = 3.2;
  const XF = 0.25; // dikişsiz döngü için çapraz geçiş
  const len = Math.round((LOOP + XF) * SR);
  const buf = new Float32Array(len);
  const bp = svf();
  const bp2 = svf();
  const bleepStep = 0.125;
  const scale = [1760, 1975.5, 2349.3, 2637, 2960, 3520];
  const bleeps = Array.from({ length: Math.ceil((LOOP + XF) / bleepStep) }, (_, k) => ({
    t: k * bleepStep,
    f: scale[Math.floor(rand() * scale.length)],
    a: k % 4 === 0 ? 0.2 : 0.11,
  }));
  let beamPhase = 0;
  for (let n = 0; n < len; n++) {
    const t = n / SR;
    const phase = (t % LOOP) / LOOP; // 0..1
    const tri = phase < 0.5 ? phase * 2 : 2 - phase * 2; // çizginin konumu
    // derin uğultu
    const hum =
      (Math.sin(2 * Math.PI * 55 * t) * 0.6 + Math.sin(2 * Math.PI * 110 * t) * 0.3) *
      (0.75 + 0.25 * Math.sin(2 * Math.PI * 2.5 * t));
    // süpüren filtreli gürültü (çizgiyle senkron)
    const noise = rand() * 2 - 1;
    const sweep = bp(noise, 350 + 2800 * tri, 0.22) * 0.9;
    const sweep2 = bp2(noise, 5200 - 1800 * tri, 0.5) * 0.04;
    // veri bipleri
    let blip = 0;
    for (const b of bleeps) {
      const dt = t - b.t;
      if (dt >= 0 && dt < 0.03) blip += Math.sin(2 * Math.PI * b.f * dt) * b.a * Math.sin((Math.PI * dt) / 0.03);
    }
    // tiz parıltı
    const shimmer = Math.sin(2 * Math.PI * 4186 * t) * 0.012 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 6 * t));
    // çizgiyle birlikte kayan "tarayıcı" tonu (faz birikimiyle pürüzsüz glissando)
    beamPhase += (2 * Math.PI * (520 + 680 * tri)) / SR;
    const beam = (Math.sin(beamPhase) + Math.sin(beamPhase * 2) * 0.25) * (0.55 + 0.45 * Math.sin(2 * Math.PI * 12 * t));
    buf[n] = hum * 0.16 + sweep * 0.16 + sweep2 + blip + shimmer + beam * 0.05;
  }
  // son XF saniyeyi başa karıştır → kesintisiz döngü
  const loopLen = Math.round(LOOP * SR);
  const xfLen = len - loopLen;
  const loop = buf.slice(0, loopLen);
  for (let k = 0; k < xfLen; k++) {
    const g = k / xfLen;
    loop[k] = loop[k] * g + buf[loopLen + k] * (1 - g);
  }
  save('scan-loop', normalize(loop, 0.6));
}

// ── 2) Sonuç: parlak, yükselen çan arpeji + parıltı kuyruğu ──
{
  const len = Math.round(1.8 * SR);
  const buf = new Float32Array(len);
  const notes = [1046.5, 1318.5, 1568, 2093];
  const partials = [
    [1, 1],
    [2, 0.35],
    [3.01, 0.18],
    [4.2, 0.1],
  ];
  notes.forEach((f, i) => {
    const start = i * 0.075;
    for (let n = Math.round(start * SR); n < len; n++) {
      const dt = n / SR - start;
      const env = Math.min(1, dt / 0.004) * Math.exp(-dt * (i === notes.length - 1 ? 2.4 : 4.2));
      let s = 0;
      for (const [m, a] of partials) s += Math.sin(2 * Math.PI * f * m * dt) * a * Math.exp(-dt * m * 0.8);
      buf[n] += s * env * (i === notes.length - 1 ? 0.55 : 0.4);
    }
  });
  // parıltı: rastgele tiz pingler
  for (let k = 0; k < 14; k++) {
    const start = 0.3 + rand() * 0.9;
    const f = 4000 + rand() * 4000;
    for (let n = Math.round(start * SR); n < Math.min(len, Math.round((start + 0.12) * SR)); n++) {
      const dt = n / SR - start;
      buf[n] += Math.sin(2 * Math.PI * f * dt) * 0.05 * Math.exp(-dt * 40);
    }
  }
  save('scan-done', normalize(reverb(buf, 0.28), 0.85));
}

// ── 3) Hata: yumuşak, alçalan iki nota ──
{
  const len = Math.round(0.6 * SR);
  const buf = new Float32Array(len);
  [
    [659.3, 0],
    [440, 0.16],
  ].forEach(([f, start]) => {
    for (let n = Math.round(start * SR); n < len; n++) {
      const dt = n / SR - start;
      const env = Math.min(1, dt / 0.01) * Math.exp(-dt * 7);
      buf[n] += (Math.sin(2 * Math.PI * f * dt) + Math.sin(2 * Math.PI * f * 2 * dt) * 0.15) * env * 0.5;
    }
  });
  save('scan-error', normalize(reverb(buf, 0.2), 0.7));
}
