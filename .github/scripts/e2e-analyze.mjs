// Canlı sunucuya (uygulamanın kullandığı adres) gerçek bir analiz isteği gönderir; durum, model ve süreyi yazar.
// Her çalıştırma bir analiz hakkı harcar (IP başına günlük sınır içinde).
import { appendFileSync, readFileSync } from 'node:fs';

const URLS = ['https://api.defineciler.online', 'https://defineciler-api.dronopter.workers.dev'];
const image = readFileSync(new URL('./fixtures/sikke.jpg', import.meta.url)).toString('base64');
const lines = [];
for (const base of URLS.slice(0, Number(process.env.E2E_COUNT || 1))) {
  const t0 = Date.now();
  try {
    const res = await fetch(`${base}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Key': 'defineciler-android-v1',
        'X-Device-Id': `ci-check-${Math.random().toString(36).slice(2, 14)}-test`,
      },
      signal: AbortSignal.timeout(90_000),
      body: JSON.stringify({ image, mimeType: 'image/jpeg', note: `kontrol ${Date.now()}` }),
    });
    const body = await res.json().catch(() => ({}));
    const note = res.ok
      ? `model: ${body.model} · başlık: ${body.result?.title}`
      : `${body.code ?? ''} · ${body.error ?? ''} · detay: ${body.detail ?? '-'}`;
    lines.push(`${res.ok ? '✅' : '❌'} ${base} · HTTP ${res.status} · ${((Date.now() - t0) / 1000).toFixed(1)} sn · ${note}`);
  } catch (e) {
    lines.push(`❌ ${base} · ${e} · ${((Date.now() - t0) / 1000).toFixed(1)} sn`);
  }
}
console.log(lines.join('\n'));
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Canlı analiz denemesi\n\n\`\`\`\n${lines.join('\n')}\n\`\`\`\n`);
