/**
 * Haber makalesinin kapak görselini bulur (React Native'e bağımlı değildir; node betikleriyle de test edilir).
 * Google Haberler bağlantıları önce gerçek makale adresine çözülür, ardından sayfadaki og:image okunur.
 */

const MAX_HTML = 400_000;
const TIMEOUT_MS = 8_000;
const UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36';

const decodeAmp = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&#x2F;/gi, '/')
    .replace(/&#47;/g, '/')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

let debug: ((msg: string) => void) | null = null;
/** Testlerde ara adımları görmek için. */
export const setDebug = (fn: typeof debug) => (debug = fn);

async function get(url: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: { 'User-Agent': UA, 'Accept-Language': 'tr-TR,tr;q=0.9', ...(init.headers ?? {}) },
    });
    if (!res.ok) {
      debug?.(`HTTP ${res.status} ← ${url.slice(0, 90)}`);
      return null;
    }
    return { url: res.url || url, text: await res.text() };
  } catch (e) {
    debug?.(`hata ${(e as Error).message} ← ${url.slice(0, 90)}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Bir HTML etiketinin özniteliklerini sözlüğe çevirir. */
function attrs(tag: string) {
  const out: Record<string, string> = {};
  for (const m of tag.matchAll(/([a-zA-Z:-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    out[m[1].toLowerCase()] = decodeAmp(m[3] ?? m[4] ?? m[5] ?? '');
  }
  return out;
}

/** Sayfadan kapak görselini çıkarır: og:image → twitter:image → image_src. Göreli adresleri mutlaklaştırır. */
export function extractMetaImage(html: string, pageUrl: string): string | null {
  const found: Record<string, string> = {};
  for (const m of html.matchAll(/<(meta|link)\s[^>]*>/gi)) {
    const a = attrs(m[0]);
    const key = (a.property || a.name || a.rel || '').toLowerCase();
    const val = a.content || a.href;
    if (val && !found[key]) found[key] = val;
  }
  const raw =
    found['og:image:secure_url'] ||
    found['og:image'] ||
    found['og:image:url'] ||
    found['twitter:image'] ||
    found['twitter:image:src'] ||
    found['image_src'];
  if (!raw) return null;
  try {
    const abs = new URL(raw.trim(), pageUrl).toString();
    return /^https?:\/\//.test(abs) ? abs.replace(/^http:\/\//, 'https://') : null;
  } catch {
    return null;
  }
}

const GN_RE = /^https?:\/\/news\.google\.com\/(?:rss\/)?(?:articles|read)\/([^?/#]+)/;

export const isGoogleNewsLink = (link: string) => GN_RE.test(link);

/** Google Haberler yönlendirme bağlantısını gerçek makale adresine çözer. */
export async function decodeGoogleNewsUrl(link: string): Promise<string | null> {
  const id = link.match(GN_RE)?.[1];
  if (!id) return null;
  // rss/articles sayfası daha küçüktür; imza ve zaman damgası sayfanın sonlarına doğru yer alır.
  const page = await get(`https://news.google.com/rss/articles/${id}`);
  if (!page) return null;
  // Bazı durumlarda sayfa doğrudan makaleye yönlenir.
  if (!/news\.google\.com/.test(page.url)) return page.url;
  const sig = page.text.match(/data-n-a-sg="([^"]+)"/)?.[1];
  const ts = page.text.match(/data-n-a-ts="([^"]+)"/)?.[1];
  if (!sig || !ts) {
    debug?.('imza bulunamadı');
    return null;
  }
  const inner = JSON.stringify([
    'garturlreq',
    [
      ['X', 'X', ['X', 'X'], null, null, 1, 1, 'TR:tr', null, 1, null, null, null, null, null, 0, 1],
      'X',
      'X',
      1,
      [1, 1, 1],
      1,
      1,
      null,
      0,
      0,
      null,
      0,
    ],
    id,
    Number(ts),
    sig,
  ]);
  const res = await get('https://news.google.com/_/DotsSplashUi/data/batchexecute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: 'f.req=' + encodeURIComponent(JSON.stringify([[['Fbv4je', inner]]])),
  });
  if (!res) return null;
  try {
    const chunk = res.text.split('\n\n')[1];
    const payload = JSON.parse(chunk)[0][2];
    const url = JSON.parse(payload)[1];
    return typeof url === 'string' && /^https?:\/\//.test(url) ? url : null;
  } catch (e) {
    debug?.(`yanıt çözülemedi: ${(e as Error).message} | ${res.text.slice(0, 300)}`);
    return null;
  }
}

/** Haber bağlantısından kapak görseli adresini bulur; bulunamazsa null. */
export async function resolveArticleImage(link: string): Promise<string | null> {
  const article = isGoogleNewsLink(link) ? await decodeGoogleNewsUrl(link) : link;
  if (!article) return null;
  const page = await get(article, { headers: { Accept: 'text/html,application/xhtml+xml,*/*;q=0.8' } });
  if (!page) return null;
  const img = extractMetaImage(page.text.slice(0, MAX_HTML), page.url);
  // Site logoları/varsayılan paylaşım görselleri haber görseli değildir.
  if (!img || /logo|favicon|default[-_]?(share|og)|placeholder/i.test(img)) return null;
  return img;
}
