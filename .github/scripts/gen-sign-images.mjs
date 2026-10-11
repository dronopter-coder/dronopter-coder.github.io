// Define işaretleri için Gemini ile fotoğraf gerçekçiliğinde görsel üretir (elle tetiklenen iş akışı).
// Kullanım: GEMINI_API_KEY=... node .github/scripts/gen-sign-images.mjs [probe|all|id1,id2]
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const KEY = process.env.GEMINI_API_KEY;
const MODE = process.argv[2] ?? 'probe';
const OUT = 'defineciler/assets/signs';
const API = 'https://generativelanguage.googleapis.com/v1beta';

const { SIGNS } = await import('../../defineciler/src/data/signs.ts');
const { PROMPTS } = await import('../../defineciler/scripts/sign-prompts.ts');

async function listImageModels() {
  const res = await fetch(`${API}/models?pageSize=200`, { headers: { 'x-goog-api-key': KEY } });
  const json = await res.json();
  const models = (json.models ?? [])
    .filter((m) => /image/i.test(m.name) && (m.supportedGenerationMethods ?? []).includes('generateContent'))
    .map((m) => m.name.replace('models/', ''));
  console.log('Görsel üretebilen modeller:', models.join(', ') || '(yok)');
  return models;
}

async function generate(model, prompt) {
  const res = await fetch(`${API}/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'x-goog-api-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'], imageConfig: { aspectRatio: '3:2' } },
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${json.error?.message?.slice(0, 200)}`);
  const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  if (!part) throw new Error('Görsel dönmedi: ' + JSON.stringify(json).slice(0, 200));
  return Buffer.from(part.inlineData.data, 'base64');
}

// Cloudflare Workers AI (geçici Worker üzerinden) varsa onu, yoksa Gemini görsel modellerini kullan.
const CF_URL = process.env.CF_IMAGE_URL;
async function generateCf(model, prompt, seed) {
  const res = await fetch(CF_URL, {
    method: 'POST',
    headers: { 'x-key': process.env.CF_IMAGE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, seed, model }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.image) throw new Error(`HTTP ${res.status}: ${json.error ?? 'görsel yok'}`);
  return Buffer.from(json.image, 'base64');
}
const models = CF_URL
  ? [process.env.IMAGE_MODEL || '@cf/black-forest-labs/flux-1-schnell']
  : [process.env.IMAGE_MODEL, ...(await listImageModels())].filter(Boolean);
if (!models.length) process.exit(1);

const ids = MODE === 'probe' ? ['yilan', 'kartal', 'canak'] : MODE === 'all' ? SIGNS.map((s) => s.id) : MODE.split(',');
mkdirSync(OUT, { recursive: true });
let model = null;
const failed = [];
for (const id of ids) {
  const prompt = PROMPTS[id];
  if (!prompt) continue;
  let done = false;
  for (const m of model ? [model] : models) {
    for (let attempt = 0; attempt < 3 && !done; attempt++) {
      try {
        const img = CF_URL ? await generateCf(m, prompt, 7 + attempt + id.length * 13) : await generate(m, prompt);
        await sharp(img).resize(960, 640, { fit: 'cover' }).jpeg({ quality: 78, mozjpeg: true }).toFile(`${OUT}/${id}.jpg`);
        console.log(`✓ ${id} (${m})`);
        model = m;
        done = true;
      } catch (e) {
        console.warn(`  ${id} · ${m} · deneme ${attempt + 1}: ${e.message}`);
        if (/429|quota|RESOURCE_EXHAUSTED/i.test(e.message)) await new Promise((r) => setTimeout(r, 20000));
        else if (/404|not found|not supported|400/i.test(e.message)) break;
      }
    }
    if (done) break;
  }
  if (!done) failed.push(id);
  await new Promise((r) => setTimeout(r, 4000));
}
console.log(`\n${ids.length - failed.length}/${ids.length} görsel üretildi.` + (failed.length ? ` Başarısız: ${failed.join(', ')}` : ''));
if (failed.length === ids.length) process.exit(1);
