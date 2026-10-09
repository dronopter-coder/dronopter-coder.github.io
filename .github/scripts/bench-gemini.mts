// Gerçek boyutlu bir fotoğrafla Gemini modellerinin yanıt sürelerini ölçer (sunucu testi iş akışında çalışır).
// Kullanım: GEMINI_API_KEY=... node --experimental-strip-types .github/scripts/bench-gemini.mts <foto.jpg> <model...>
import { readFileSync } from 'node:fs';

import { RESPONSE_SCHEMA, SYSTEM_PROMPT } from '../../defineciler/worker/src/schema.ts';

const [file, ...models] = process.argv.slice(2);
const key = process.env.GEMINI_API_KEY;
if (!key) throw new Error('GEMINI_API_KEY yok');
const image = readFileSync(file).toString('base64');
console.log(`Fotoğraf: ${file} (${Math.round(image.length / 1024)} KB base64)\n`);

for (const model of models) {
  const t0 = Date.now();
  let status = 0;
  let note = '';
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      signal: AbortSignal.timeout(90_000),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          { role: 'user', parts: [{ inlineData: { mimeType: 'image/jpeg', data: image } }, { text: 'Bu fotoğraftaki objeyi tanımla.' }] },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.4,
          maxOutputTokens: 8192,
        },
      }),
    });
    status = res.status;
    const data = (await res.json()) as any;
    if (res.ok) {
      const text = (data?.candidates?.[0]?.content?.parts ?? []).filter((p: any) => !p.thought).map((p: any) => p.text ?? '').join('');
      const u = data?.usageMetadata ?? {};
      note = `${JSON.parse(text).title} · giriş ${u.promptTokenCount} / çıkış ${u.candidatesTokenCount} / düşünme ${u.thoughtsTokenCount ?? 0} token`;
    } else note = String(data?.error?.message ?? '').slice(0, 120);
  } catch (e) {
    note = `HATA: ${(e as Error).message}`;
  }
  console.log(`${model.padEnd(26)} HTTP ${status}  ${((Date.now() - t0) / 1000).toFixed(1)} sn  ${note}`);
}
