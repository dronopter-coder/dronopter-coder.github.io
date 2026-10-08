// Haber tekrarı mantığı uygulamayla ortaktır.
import { dedupeStories } from '../../src/services/news-dedupe';

/** Workers ortamında DOMParser olmadığı için hafif, bağımlılıksız bir RSS/Atom ayrıştırıcı. */
export type FeedItem = {
  title: string;
  link: string;
  source: string;
  publishedAt: string | null;
  image: string | null;
  summary: string;
  /** Aynı haberi veren diğer kaynaklar */
  alsoIn?: string[];
};

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

export function decodeEntities(s: string) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

const unCdata = (s: string) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');

export function stripHtml(s: string) {
  // Bazı beslemeler HTML'i CDATA yerine &lt;..&gt; olarak kaçışlar; önce çöz, sonra etiketleri sil.
  const html = /&lt;[a-z/]/i.test(s) ? decodeEntities(s) : s;
  return decodeEntities(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function tag(block: string, name: string): string | null {
  const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i');
  const m = block.match(re);
  return m ? unCdata(m[1]).trim() : null;
}

function attr(block: string, name: string, attribute: string): string | null {
  const re = new RegExp(`<${name}\\s[^>]*${attribute}=["']([^"']+)["'][^>]*>`, 'i');
  const m = block.match(re);
  return m ? decodeEntities(m[1]) : null;
}

function firstImg(html: string | null) {
  if (!html) return null;
  const m = decodeEntities(html).match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function toIso(d: string | null) {
  if (!d) return null;
  const t = Date.parse(d);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

export function parseFeed(xml: string, fallbackSource: string): FeedItem[] {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/gi) ?? [];
  return blocks
    .map((b) => {
      let title = stripHtml(tag(b, 'title') ?? '');
      let link = tag(b, 'link') ?? attr(b, 'link', 'href') ?? '';
      link = decodeEntities(link).trim();
      let source = stripHtml(tag(b, 'source') ?? '') || fallbackSource;
      // Google Haberler başlıkları "Başlık - Kaynak" biçimindedir.
      const dash = title.lastIndexOf(' - ');
      if (source !== fallbackSource && dash > 0 && title.slice(dash + 3) === source) title = title.slice(0, dash);
      else if (fallbackSource === 'Google Haberler' && dash > 0) {
        source = title.slice(dash + 3);
        title = title.slice(0, dash);
      }
      const desc = tag(b, 'description') ?? tag(b, 'summary') ?? '';
      const content = tag(b, 'content:encoded') ?? tag(b, 'content') ?? '';
      const image =
        attr(b, 'media:content', 'url') ??
        attr(b, 'media:thumbnail', 'url') ??
        (/<enclosure[^>]+type=["']image/i.test(b) ? attr(b, 'enclosure', 'url') : null) ??
        firstImg(content) ??
        firstImg(desc);
      let summary = stripHtml(desc);
      if (summary.startsWith(title)) summary = '';
      return {
        title,
        link,
        source,
        publishedAt: toIso(tag(b, 'pubDate') ?? tag(b, 'published') ?? tag(b, 'updated') ?? tag(b, 'dc:date')),
        image: image && /^https?:\/\//.test(image) ? image : null,
        summary: summary.length > 280 ? summary.slice(0, 277) + '…' : summary,
      };
    })
    .filter((i) => i.title && /^https?:\/\//.test(i.link));
}

/** Aynı olayı anlatan haberleri tek kayda indirir (resimliyi tercih eder) ve tarihe göre sıralar. */
export function mergeItems(lists: FeedItem[][], limit = 60): FeedItem[] {
  return dedupeStories(lists.flat())
    .sort((a, b) => (b.publishedAt ? Date.parse(b.publishedAt) : 0) - (a.publishedAt ? Date.parse(a.publishedAt) : 0))
    .slice(0, limit);
}

export async function hashId(s: string) {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)]
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
