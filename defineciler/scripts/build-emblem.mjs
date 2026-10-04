// Defineciler amblemini (Lidya aslanlı altın sikke) üretir: node scripts/build-emblem.mjs
// Çıktılar: assets/source/emblem.svg, assets/source/emblem-mono.svg, src/components/emblem-xml.ts
import { writeFileSync } from 'node:fs';

const C = 50; // merkez
const f = (n) => +n.toFixed(2);
const pol = (r, a, cx = C, cy = C) => [f(cx + r * Math.cos(a)), f(cy + r * Math.sin(a))];

// Tekrarlanabilir rastgelelik (dövme sikkenin düzensiz kenarı için)
let seed = 7;
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

/** Elle dövülmüş sikke kenarı: hafif düzensiz, yumuşak kapalı eğri. */
function coinEdge(r, wobble) {
  const n = 28;
  const pts = Array.from({ length: n }, (_, i) => pol(r + (rand() - 0.5) * wobble, (i / n) * Math.PI * 2));
  let d = `M${f((pts[0][0] + pts[1][0]) / 2)} ${f((pts[0][1] + pts[1][1]) / 2)}`;
  for (let i = 1; i <= n; i++) {
    const p = pts[i % n];
    const q = pts[(i + 1) % n];
    d += `Q${p[0]} ${p[1]} ${f((p[0] + q[0]) / 2)} ${f((p[1] + q[1]) / 2)}`;
  }
  return d + 'Z';
}

/** Yelenin alev biçimli lüleleri: merkezden dışa, hafif kıvrık sivri dilimler. */
function maneTufts(count, rIn, rOut, swirl, cy) {
  let d = '';
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    const w = (Math.PI * 2) / count / 1.55;
    const len = rOut * (i % 2 ? 0.92 : 1);
    const [x1, y1] = pol(rIn, a - w, C, cy);
    const [x2, y2] = pol(rIn, a + w, C, cy);
    const [tx, ty] = pol(len, a + swirl, C, cy);
    const [c1x, c1y] = pol(len * 0.78, a - w * 1.1, C, cy);
    const [c2x, c2y] = pol(len * 0.72, a + w * 1.25, C, cy);
    d += `M${x1} ${y1}Q${c1x} ${c1y} ${tx} ${ty}Q${c2x} ${c2y} ${x2} ${y2}Z`;
  }
  return d;
}

/** Yuvarlak inci bordür noktaları. */
function beads(r, count, size) {
  return Array.from({ length: count }, (_, i) => {
    const [x, y] = pol(r, (i / count) * Math.PI * 2);
    return `<circle cx="${x}" cy="${y}" r="${size}"/>`;
  }).join('');
}

const HY = 52; // aslan başının merkezi
const edge = coinEdge(46.5, 2.2);
const maneOuter = maneTufts(22, 15, 34, 0.2, HY);
const maneInner = maneTufts(22, 13, 27, 0.26, HY + 0.5);

// Aslanın yüzü (önden): geniş alın, elmacık kemikleri, daralan çene
const face =
  'M50 32C59 32 66 37 67 45C68 52 66 57 63 61C60 66 56 70 50 71C44 70 40 66 37 61C34 57 32 52 33 45C34 37 41 32 50 32Z';
const ears =
  'M36.6 33.2C33.5 30.5 33.2 26.4 35.6 24.6C38.3 22.6 42 24.4 43.4 28.2Z' +
  'M63.4 33.2C66.5 30.5 66.8 26.4 64.4 24.6C61.7 22.6 58 24.4 56.6 28.2Z';
const earInner =
  'M37.6 31.2C36 29.6 36 27.4 37.2 26.6C38.7 25.7 40.5 26.9 41.2 28.8Z' +
  'M62.4 31.2C64 29.6 64 27.4 62.8 26.6C61.3 25.7 59.5 26.9 58.8 28.8Z';
// Kaş çıkıntıları ve gözler (bademsi, hafif çekik)
const brows = 'M38.6 43.6C41.5 40.6 45.2 40.4 47.4 42.4' + 'M61.4 43.6C58.5 40.6 54.8 40.4 52.6 42.4';
const eyes =
  'M39.6 46.6C41.6 44.6 44.6 44.4 46.6 46.2C44.4 48.4 41.6 48.4 39.6 46.6Z' +
  'M60.4 46.6C58.4 44.6 55.4 44.4 53.4 46.2C55.6 48.4 58.4 48.4 60.4 46.6Z';
const pupils = '<circle cx="43.6" cy="46.3" r="0.95"/><circle cx="56.4" cy="46.3" r="0.95"/>';
// Burun köprüsü ve geniş burun
const bridge = 'M47.6 44.8C47.8 49 47.4 52.4 46.2 55.2' + 'M52.4 44.8C52.2 49 52.6 52.4 53.8 55.2';
const nose = 'M44.4 55.4C46.4 54.2 53.6 54.2 55.6 55.4C55.4 57.8 52.6 59.6 50 60.2C47.4 59.6 44.6 57.8 44.4 55.4Z';
// Ağız: kükreyen, açık ağız ve dişler
const muzzle = 'M50 60.2C47.2 62 42.4 62.4 40.6 60.2' + 'M50 60.2C52.8 62 57.6 62.4 59.4 60.2';
const mouth = 'M43.4 63.2C45.6 62.6 54.4 62.6 56.6 63.2C55.6 67.2 53 69.2 50 69.4C47 69.2 44.4 67.2 43.4 63.2Z';
const fangs = 'M45.2 63.4L46.3 66.1L47.3 63.2Z' + 'M54.8 63.4L53.7 66.1L52.7 63.2Z';
const whiskerDots = [
  [42.6, 58.6],
  [41.2, 57.2],
  [40.4, 59.2],
  [57.4, 58.6],
  [58.8, 57.2],
  [59.6, 59.2],
]
  .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.45"/>`)
  .join('');
// Lidya aslanlarının alnındaki "güneş/siğil" yuvarlağı
const wart = '<circle cx="50" cy="37.8" r="1.6"/>';

const defs = `<defs>
<radialGradient id="coin" cx="0.38" cy="0.32" r="0.78">
  <stop offset="0" stop-color="#FFE7A6"/><stop offset="0.35" stop-color="#F0C870"/><stop offset="0.72" stop-color="#C8902E"/><stop offset="1" stop-color="#7C5418"/>
</radialGradient>
<radialGradient id="field" cx="0.42" cy="0.36" r="0.75">
  <stop offset="0" stop-color="#B98330"/><stop offset="0.6" stop-color="#8E6020"/><stop offset="1" stop-color="#5E3F10"/>
</radialGradient>
<linearGradient id="mane" x1="0.2" y1="0.1" x2="0.8" y2="0.95">
  <stop offset="0" stop-color="#FFE29A"/><stop offset="0.5" stop-color="#E0AA48"/><stop offset="1" stop-color="#9C6A1E"/>
</linearGradient>
<linearGradient id="face" x1="0.3" y1="0" x2="0.7" y2="1">
  <stop offset="0" stop-color="#FFEDB8"/><stop offset="0.55" stop-color="#F2C566"/><stop offset="1" stop-color="#C38D30"/>
</linearGradient>
</defs>`;

const INK = '#5A3A0E';
const color = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">${defs}
<path d="${edge}" fill="#4A320C" transform="translate(0.9 1.4)" opacity="0.55"/>
<path d="${edge}" fill="url(#coin)"/>
<circle cx="50" cy="50" r="40.6" fill="url(#field)"/>
<circle cx="50" cy="50" r="40.6" fill="none" stroke="${INK}" stroke-opacity="0.55" stroke-width="0.8"/>
<g fill="#FFE6A0" fill-opacity="0.9">${beads(43.4, 44, 0.95)}</g>
<path d="${maneOuter}" fill="#8C5E18" transform="translate(0.6 0.9)" opacity="0.6"/>
<path d="${maneOuter}" fill="url(#mane)" stroke="${INK}" stroke-opacity="0.55" stroke-width="0.5" stroke-linejoin="round"/>
<path d="${maneInner}" fill="#D49A3A" stroke="${INK}" stroke-opacity="0.45" stroke-width="0.4" stroke-linejoin="round"/>
<path d="${ears}" fill="url(#face)" stroke="${INK}" stroke-width="0.7" stroke-linejoin="round"/>
<path d="${earInner}" fill="${INK}" opacity="0.55"/>
<path d="${face}" fill="#7C5418" transform="translate(0.5 1)" opacity="0.5"/>
<path d="${face}" fill="url(#face)" stroke="${INK}" stroke-width="0.8" stroke-linejoin="round"/>
<g fill="${INK}" opacity="0.8">${wart}</g>
<circle cx="49.5" cy="37.1" r="0.7" fill="#FFF3CF"/>
<ellipse cx="45.4" cy="59.6" rx="5" ry="3.4" fill="#FFF0C2" stroke="${INK}" stroke-opacity="0.35" stroke-width="0.4"/>
<ellipse cx="54.6" cy="59.6" rx="5" ry="3.4" fill="#FFF0C2" stroke="${INK}" stroke-opacity="0.35" stroke-width="0.4"/>
<path d="${brows}" fill="none" stroke="${INK}" stroke-width="1.3" stroke-linecap="round"/>
<path d="${eyes}" fill="#2E1E06"/>
<g fill="#FFD77A">${pupils}</g>
<path d="${bridge}" fill="none" stroke="${INK}" stroke-opacity="0.7" stroke-width="0.7" stroke-linecap="round"/>
<path d="${nose}" fill="#3A2608"/>
<path d="${muzzle}" fill="none" stroke="${INK}" stroke-width="0.9" stroke-linecap="round"/>
<path d="${mouth}" fill="#2A1A04"/>
<path d="${fangs}" fill="#FFF1C8"/>
<g fill="${INK}">${whiskerDots}</g>
<path d="M50 20.5l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z" fill="#FFF6D8" transform="translate(28 -6) scale(0.62) translate(30 0)" opacity="0.95"/>
</svg>`;

// Android tek renkli (temalı) ikon için: yalnızca siluet ve çizgiler, alan saydam
const mono = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
<defs><mask id="cut"><rect width="100" height="100" fill="#fff"/><path d="${face}" fill="#000" transform="translate(50 52) scale(0.9) translate(-50 -52)"/></mask></defs>
<path d="${edge}" fill="none" stroke="#000" stroke-width="3"/>
<g fill="#000">${beads(42.4, 40, 1)}</g>
<g mask="url(#cut)"><path d="${maneOuter}" fill="#000"/><path d="${ears}" fill="#000"/></g>
<path d="${brows}" fill="none" stroke="#000" stroke-width="1.6" stroke-linecap="round"/>
<path d="${eyes}" fill="#000"/>
<path d="${nose}" fill="#000"/>
<path d="${muzzle}" fill="none" stroke="#000" stroke-width="1.2" stroke-linecap="round"/>
<path d="${mouth}" fill="#000"/>
<g fill="#000">${wart}</g>
</svg>`;

const root = new URL('../', import.meta.url);
writeFileSync(new URL('assets/source/emblem.svg', root), color + '\n');
writeFileSync(new URL('assets/source/emblem-mono.svg', root), mono + '\n');
writeFileSync(
  new URL('src/components/emblem-xml.ts', root),
  `// Otomatik üretildi: node scripts/build-emblem.mjs — elle düzenlemeyin.\nexport const EMBLEM_XML = ${JSON.stringify(color)};\n`,
);
console.log('Amblem üretildi.');
