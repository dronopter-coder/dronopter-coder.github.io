import { hashId, mergeItems, parseFeed, type FeedItem } from './rss';

type Source = { name: string; url: string; filter?: RegExp };

const KEYWORDS =
  /arkeolo|kazı|antik|höyük|tarihi eser|define|lahit|mozaik|sikke|nekropol|ören yeri|müze|tümülüs|kalıntı|buluntu|tablet|heykel|roma|bizans|hitit|urartu|frig|lidya|neolitik/i;

export const SOURCES: Source[] = [
  {
    name: 'Google Haberler',
    url: 'https://news.google.com/rss/search?q=arkeoloji+OR+%22arkeolojik+kaz%C4%B1%22+OR+%22antik+kent%22+OR+%22tarihi+eser%22+when:14d&hl=tr&gl=TR&ceid=TR:tr',
  },
  { name: 'Arkeofili', url: 'https://arkeofili.com/feed/' },
  { name: 'Anadolu Ajansı', url: 'https://www.aa.com.tr/tr/rss/default?cat=kultur-sanat', filter: KEYWORDS },
];

async function fetchSource(src: Source): Promise<FeedItem[]> {
  try {
    const res = await fetch(src.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DefinecilerBot/1.0)',
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
      cf: { cacheTtl: 900, cacheEverything: true },
    } as RequestInit);
    if (!res.ok) return [];
    const items = parseFeed(await res.text(), src.name);
    return src.filter ? items.filter((i) => src.filter!.test(`${i.title} ${i.summary}`)) : items;
  } catch (e) {
    console.error('feed failed', src.name, String(e));
    return [];
  }
}

export async function buildNews() {
  const lists = await Promise.all(SOURCES.map(fetchSource));
  const merged = mergeItems(lists);
  const items = await Promise.all(merged.map(async (i) => ({ id: await hashId(i.link), ...i })));
  return { items, updatedAt: new Date().toISOString() };
}
