// Ana sayfa kahraman görselini Gemini görsel modeliyle üretir (GitHub Actions'ta çalışır).
//   GEMINI_API_KEY=... node .github/scripts/generate-hero.mjs <çıktı-klasörü> [adet]
import { mkdirSync, writeFileSync } from 'node:fs';

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error('GEMINI_API_KEY yok');
  process.exit(1);
}
const OUT = process.argv[2] ?? 'hero-out';
const COUNT = Number(process.argv[3] ?? 4);
const MODELS = (process.env.HERO_MODELS ?? 'gemini-3.1-flash-image,gemini-2.5-flash-image,gemini-3.1-flash-image-preview').split(',');

const PROMPT = `Cinematic, photorealistic macro product photograph for a mobile app home screen background, portrait 3:4.
Scene: two ancient Greek / Hellenistic coins resting on dark, rough, crumbly earth and rock in the lower half of the frame.
The larger coin is gold, slightly tilted, showing a finely detailed relief profile of a young man's head wearing a laurel wreath,
with curly hair; worn edges, natural patina, small dents. The second, smaller bronze coin with a female profile lies partly behind
and to the left of it, partly in shadow. Warm golden side light from the upper right, deep shadows, moody chiaroscuro.
Fine glowing golden dust particles and bokeh specks float in the air above the coins.
Background: very dark charcoal with a subtle deep green tint (#0E1512), smoothly fading to almost black at the top.
The upper 45% of the image must be nearly empty dark space (room for title text). Composition weighted to the lower right.
Shallow depth of field, rich detail, premium museum catalogue mood.
Strictly NO text, NO letters, NO logos, NO watermark, NO frames, NO borders, NO UI elements.`;

async function generate(model) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: PROMPT }] }],
      generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '3:4' } },
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${model}: HTTP ${res.status} ${json?.error?.message ?? ''}`.slice(0, 300));
  const part = (json.candidates?.[0]?.content?.parts ?? []).find((p) => p.inlineData?.data);
  if (!part) throw new Error(`${model}: görsel dönmedi (${json.candidates?.[0]?.finishReason ?? 'bilinmiyor'})`);
  return { bytes: Buffer.from(part.inlineData.data, 'base64'), mime: part.inlineData.mimeType };
}

mkdirSync(OUT, { recursive: true });
let made = 0;
for (let i = 1; i <= COUNT; i++) {
  for (const model of MODELS) {
    try {
      const { bytes, mime } = await generate(model.trim());
      const ext = mime?.includes('jpeg') ? 'jpg' : 'png';
      writeFileSync(`${OUT}/hero-${i}.${ext}`, bytes);
      console.log(`✓ hero-${i} (${model}, ${bytes.length} bayt)`);
      made++;
      break;
    } catch (e) {
      console.warn(`  ${e.message}`);
    }
  }
}
console.log(`${made}/${COUNT} görsel üretildi.`);
if (!made) process.exit(1);
