// Bölge ve rehber kapak fotoğraflarını Wikimedia Commons'tan indirir ve uygulamaya gömer.
// GitHub Actions'ta çalışır (bkz. .github/workflows/defineciler-android.yml):
//   node --experimental-strip-types scripts/fetch-photos.mts
// Zaten indirilmiş fotoğraflar atlanır. Belirli kayıtları yenilemek için:
//   PHOTO_REFRESH=place:hitit,guide:sikkeler node --experimental-strip-types scripts/fetch-photos.mts
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

import { GUIDE } from '../src/data/guide.ts';
import { PLACES } from '../src/data/places.ts';

const ROOT = new URL('../', import.meta.url);
const PHOTO_DIR = new URL('assets/photos/', ROOT);
const CREDITS = new URL('assets/photos/credits.json', ROOT);
const GENERATED = new URL('src/data/photos.generated.ts', ROOT);
const UA = 'DefinecilerBuild/1.0 (https://dronopter-coder.github.io; dronopter@gmail.com)';
const WIDTH = 1024;

type Credit = { file: string; author: string; license: string; url: string };
type Entry = { key: string; candidates: string[] };

const entries: Entry[] = [
  ...PLACES.map((p) => ({
    key: `place:${p.id}`,
    candidates: [...(p.photo ?? []), p.wiki.en && `en:${p.wiki.en}`, p.wiki.tr && `tr:${p.wiki.tr}`].filter(Boolean) as string[],
  })),
  ...GUIDE.map((g) => ({
    key: `guide:${g.id}`,
    candidates: [...(g.photo ?? []), g.wiki?.en && `en:${g.wiki.en}`, g.wiki?.tr && `tr:${g.wiki.tr}`].filter(Boolean) as string[],
  })),
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function get(url: string): Promise<Response> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } });
    if (res.status !== 429 && res.status < 500) return res;
    await sleep(2000 * (attempt + 1));
  }
  throw new Error(`İstek başarısız: ${url}`);
}

const stripHtml = (s: string) =>
  s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

/** Bir Wikipedia sayfasının ana görselinin Commons dosya adını bulur (adil kullanım görsellerini atlar). */
async function leadImageFile(candidate: string): Promise<string | null> {
  const [lang, ...rest] = candidate.split(':');
  const title = rest.join(':').replace(/ /g, '_');
  const res = await get(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
  if (!res.ok) return null;
  const json = (await res.json()) as { type?: string; originalimage?: { source: string } };
  const src = json.type === 'disambiguation' ? undefined : json.originalimage?.source;
  const m = src?.match(/\/wikipedia\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

async function commonsInfo(file: string) {
  const api =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo' +
    `&iiprop=url|extmetadata|mime&iiurlwidth=${WIDTH}&titles=${encodeURIComponent('File:' + file)}`;
  const json = (await (await get(api)).json()) as any;
  const page = Object.values(json?.query?.pages ?? {})[0] as any;
  const ii = page?.imageinfo?.[0];
  if (!ii?.thumburl) return null;
  const meta = ii.extmetadata ?? {};
  return {
    thumb: ii.thumburl as string,
    author: stripHtml(meta.Artist?.value ?? '') || 'Wikimedia Commons',
    license: stripHtml(meta.LicenseShortName?.value ?? '') || 'bkz. kaynak',
    url: (ii.descriptionurl as string) ?? `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`,
  };
}

const fileNameFor = (key: string, thumb: string) => {
  const ext = /\.png($|\?)/i.test(thumb) ? 'png' : 'jpg';
  return `${key.replace(':', '-')}.${ext}`;
};

async function main() {
  mkdirSync(PHOTO_DIR, { recursive: true });
  const credits: Record<string, Credit> = existsSync(CREDITS) ? JSON.parse(readFileSync(CREDITS, 'utf8')) : {};
  const refresh = new Set((process.env.PHOTO_REFRESH ?? '').split(',').filter(Boolean));
  const failed: string[] = [];

  for (const { key, candidates } of entries) {
    const existing = credits[key];
    if (existing && existsSync(new URL(existing.file, PHOTO_DIR)) && !refresh.has(key)) continue;
    if (existing) rmSync(new URL(existing.file, PHOTO_DIR), { force: true });
    delete credits[key];

    let done = false;
    for (const candidate of candidates) {
      try {
        const file = await leadImageFile(candidate);
        if (!file) continue;
        const info = await commonsInfo(file);
        if (!info) continue;
        const img = await get(info.thumb);
        if (!img.ok) continue;
        const name = fileNameFor(key, info.thumb);
        writeFileSync(new URL(name, PHOTO_DIR), Buffer.from(await img.arrayBuffer()));
        credits[key] = { file: name, author: info.author, license: info.license, url: info.url };
        console.log(`✓ ${key} ← ${candidate} (${file}) · ${info.author} · ${info.license}`);
        done = true;
        break;
      } catch (e) {
        console.warn(`  ${key}: ${candidate} denenemedi: ${(e as Error).message}`);
      }
      await sleep(300);
    }
    if (!done) failed.push(key);
    await sleep(300);
  }

  const keys = Object.keys(credits).sort();
  writeFileSync(CREDITS, JSON.stringify(Object.fromEntries(keys.map((k) => [k, credits[k]])), null, 2) + '\n');

  const lines = keys.map((k) => {
    const c = credits[k];
    return `  '${k}': {\n    image: require('../../assets/photos/${c.file}'),\n    author: ${JSON.stringify(c.author)},\n    license: ${JSON.stringify(c.license)},\n    url: ${JSON.stringify(c.url)},\n  },`;
  });
  writeFileSync(
    GENERATED,
    `// Bu dosya scripts/fetch-photos.mts tarafından üretilir; elle düzenlemeyin.\n` +
      `// Fotoğraflar Wikimedia Commons'tandır; her birinin yazarı ve lisansı aşağıdadır.\n\n` +
      `export type Photo = { image: number; author: string; license: string; url: string };\n\n` +
      `export const PHOTOS: Record<string, Photo> = {${lines.length ? '\n' + lines.join('\n') + '\n' : ''}};\n`,
  );

  console.log(`\n${keys.length}/${entries.length} fotoğraf hazır.`);
  if (failed.length) console.warn(`Bulunamayanlar: ${failed.join(', ')}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
