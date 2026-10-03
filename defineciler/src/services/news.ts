import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchNews, type NewsItem } from '@/services/api';

const CACHE_KEY = 'news:cache:v1';

type Cached = { items: NewsItem[]; updatedAt: string };

export async function getCachedNews(): Promise<Cached | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Cached) : null;
  } catch {
    return null;
  }
}

/** Haberleri sunucudan çeker; başarılı olursa çevrimdışı kullanım için önbelleğe yazar. */
export async function loadNews(): Promise<Cached> {
  const data = await fetchNews();
  AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data)).catch(() => {});
  return data;
}

export type { NewsItem };
