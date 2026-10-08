import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchNews } from '@/services/api';
import { hashId, mergeItems, parseFeed, type FeedItem } from '@/services/rss';

export type NewsItem = FeedItem & { id: string };

const CACHE_KEY = 'news:cache:v3';

type Cached = { items: NewsItem[]; updatedAt: string };

type Source = { name: string; url: string; filter?: RegExp };

const KEYWORDS =
  /arkeolo|kazı|antik|höyük|tarihi eser|define|lahit|mozaik|sikke|nekropol|ören yeri|müze|tümülüs|kalıntı|buluntu|tablet|heykel|roma|bizans|hitit|urartu|frig|lidya|neolitik/i;

const SOURCES: Source[] = [
  {
    name: 'Google Haberler',
    url: 'https://news.google.com/rss/search?q=arkeoloji+OR+%22arkeolojik+kaz%C4%B1%22+OR+%22antik+kent%22+OR+%22tarihi+eser%22+when:14d&hl=tr&gl=TR&ceid=TR:tr',
  },
  { name: 'Arkeofili', url: 'https://arkeofili.com/feed/' },
  { name: 'Anadolu Ajansı', url: 'https://www.aa.com.tr/tr/rss/default?cat=kultur-sanat', filter: KEYWORDS },
];

async function fetchSource(src: Source): Promise<FeedItem[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(src.url, {
      signal: controller.signal,
      headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
    });
    if (!res.ok) return [];
    const items = parseFeed(await res.text(), src.name);
    return src.filter ? items.filter((i) => src.filter!.test(`${i.title} ${i.summary}`)) : items;
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

/** Haber kaynaklarını doğrudan cihazdan okur (sunucu gerekmez). */
async function fetchDirect(): Promise<Cached> {
  const lists = await Promise.all(SOURCES.map(fetchSource));
  const items = mergeItems(lists).map((i) => ({ id: hashId(i.link), ...i }));
  if (!items.length) throw new Error('no items');
  return { items, updatedAt: new Date().toISOString() };
}

export async function getCachedNews(): Promise<Cached | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Cached) : null;
  } catch {
    return null;
  }
}

/** Haberleri önce cihazdan, olmazsa sunucudan çeker; çevrimdışı kullanım için önbelleğe yazar. */
export async function loadNews(): Promise<Cached> {
  let data: Cached;
  try {
    data = await fetchDirect();
  } catch {
    data = await fetchNews();
  }
  AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data)).catch(() => {});
  return data;
}
