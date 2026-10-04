// Haber görseli çözücüsünü dener: node --experimental-strip-types scripts/test-news-images.mts [--live]
// Çevrimdışı birim kontrolleri her zaman çalışır; --live ile Google Haberler/Arkeofili beslemelerinden gerçek haberler çözülür.
import assert from 'node:assert/strict';

import { decodeGoogleNewsUrl, extractMetaImage, resolveArticleImage, setDebug } from '../src/services/news-image-core.ts';

// ── Birim kontrolleri ──
assert.equal(
  extractMetaImage('<meta property="og:image" content="https://a.com/x.jpg?a=1&amp;b=2">', 'https://a.com/haber'),
  'https://a.com/x.jpg?a=1&b=2',
);
assert.equal(
  extractMetaImage(`<meta content='/img/k.jpg' property='og:image' />`, 'https://b.com/h/1'),
  'https://b.com/img/k.jpg',
);
assert.equal(extractMetaImage('<meta name="twitter:image" content="//c.com/t.png">', 'https://c.com/'), 'https://c.com/t.png');
assert.equal(extractMetaImage('<link rel="image_src" href="http://d.com/i.jpg">', 'https://d.com/'), 'https://d.com/i.jpg');
assert.equal(extractMetaImage('<title>yok</title>', 'https://e.com/'), null);
console.log('✓ birim kontrolleri');

if (process.argv.includes('--live')) {
  setDebug((m) => console.log('    · ' + m));
  const rss = await (
    await fetch('https://news.google.com/rss/search?q=arkeoloji+OR+%22antik+kent%22+when:7d&hl=tr&gl=TR&ceid=TR:tr')
  ).text();
  const links = [...rss.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>/g)].map((m) => m[1]).slice(0, 6);
  // Tanı: ilk haberin Google sayfası nasıl dönüyor?
  const id = links[0]?.match(/articles\/([^?]+)/)?.[1];
  for (const u of [`https://news.google.com/articles/${id}`, `https://news.google.com/rss/articles/${id}`]) {
    const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 14) Chrome/126.0 Mobile' } });
    const t = await r.text();
    console.log(
      `tanı ${u.slice(0, 60)}… → HTTP ${r.status}, son adres ${r.url.slice(0, 80)}, ` +
        `sg=${/data-n-a-sg=/.test(t)} ts=${/data-n-a-ts=/.test(t)} uzunluk=${t.length}`,
    );
    if (!/data-n-a-sg=/.test(t)) console.log(t.slice(0, 600).replace(/\s+/g, ' '));
  }
  let decoded = 0;
  let images = 0;
  for (const link of links) {
    const url = await decodeGoogleNewsUrl(link);
    const img = url ? await resolveArticleImage(url) : null;
    if (url) decoded++;
    if (img) images++;
    console.log(`- ${url ?? 'ÇÖZÜLEMEDİ'}\n    görsel: ${img ?? '-'}`);
  }
  console.log(`Google Haberler: ${decoded}/${links.length} adres çözüldü, ${images} görsel bulundu`);
  const ark = await (await fetch('https://arkeofili.com/feed/')).text();
  const arkLink = ark.match(/<item>[\s\S]*?<link>([^<]+)<\/link>/)?.[1];
  if (arkLink) console.log(`Arkeofili: ${arkLink}\n    görsel: ${(await resolveArticleImage(arkLink)) ?? '-'}`);
  if (!decoded) process.exitCode = 1;
}
