// Gemini anahtarını ve sunucunun kullandığı modelleri küçük bir metin isteğiyle sınar (fotoğraf yok, maliyeti ihmal edilebilir).
// Durum kodu ve hata nedenini yazar; anahtar asla yazdırılmaz. Kullanım: GEMINI_API_KEY=... node gemini-check.mjs [model...]
import { appendFileSync } from 'node:fs';

const key = process.env.GEMINI_API_KEY;
if (!key) throw new Error('GEMINI_API_KEY yok');
const BASE = 'https://generativelanguage.googleapis.com/v1beta';
const models = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['gemini-3.5-flash', 'gemini-flash-lite-latest', 'gemini-3.8-flash'];
const lines = [];
const out = (s) => {
  console.log(s);
  lines.push(s);
};

const safe = (s) => String(s).replaceAll(key, '***');

for (const model of models) {
  const t0 = Date.now();
  try {
    const res = await fetch(`${BASE}/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      signal: AbortSignal.timeout(60_000),
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Sadece "tamam" yaz.' }] }],
        generationConfig: { maxOutputTokens: 64 },
      }),
    });
    const body = await res.text();
    let note = '';
    try {
      const j = JSON.parse(body);
      if (res.ok) {
        const t = (j?.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? '').join('').trim();
        note = `yanıt: "${t.slice(0, 40)}"`;
      } else {
        const e = j?.error ?? {};
        const quota = (e.details ?? [])
          .flatMap((d) => d?.violations ?? [])
          .map((v) => `${v.quotaMetric ?? ''} ${v.quotaId ?? ''}`.trim())
          .filter(Boolean);
        const retry = (e.details ?? []).map((d) => d?.retryDelay).filter(Boolean);
        note = `${e.status ?? ''}: ${String(e.message ?? '').slice(0, 300)}${quota.length ? ` · kota: ${[...new Set(quota)].join('; ')}` : ''}${retry.length ? ` · yeniden dene: ${retry[0]}` : ''}`;
      }
    } catch {
      note = body.slice(0, 200);
    }
    out(`${res.ok ? '✅' : '❌'} ${model} · HTTP ${res.status} · ${((Date.now() - t0) / 1000).toFixed(1)} sn · ${safe(note)}`);
  } catch (e) {
    out(`❌ ${model} · ${safe(e)} · ${((Date.now() - t0) / 1000).toFixed(1)} sn`);
  }
}

try {
  const res = await fetch(`${BASE}/models?pageSize=200`, { headers: { 'x-goog-api-key': key } });
  const j = await res.json();
  if (res.ok) {
    const names = (j.models ?? [])
      .filter((m) => (m.supportedGenerationMethods ?? []).includes('generateContent') && /flash/i.test(m.name))
      .map((m) => m.name.replace('models/', ''))
      .sort();
    out(`\nGörünen flash modelleri (${names.length}): ${names.join(', ')}`);
    const missing = models.filter((m) => !names.includes(m));
    if (missing.length) out(`⚠️ Listede olmayan model(ler): ${missing.join(', ')}`);
  } else out(`\nModel listesi alınamadı: HTTP ${res.status} ${safe(JSON.stringify(j?.error?.message ?? ''))}`);
} catch (e) {
  out(`\nModel listesi hatası: ${safe(e)}`);
}

if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Gemini kontrolü\n\n\`\`\`\n${lines.join('\n')}\n\`\`\`\n`);
