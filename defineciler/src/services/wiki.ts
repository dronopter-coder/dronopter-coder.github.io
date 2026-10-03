import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Bölge ve rehber başlıklarındaki görseller ve kısa özetler Wikipedia'dan (CC BY-SA) çekilir.
 * Sonuçlar 7 gün önbelleğe alınır.
 */
export type WikiSummary = {
  title: string;
  extract: string;
  image: string | null;
  url: string;
};

const TTL = 7 * 24 * 60 * 60 * 1000;
const memory = new Map<string, WikiSummary | null>();
const inflight = new Map<string, Promise<WikiSummary | null>>();

export function getWikiSummary(title: string, lang: 'tr' | 'en' = 'tr'): Promise<WikiSummary | null> {
  const key = `${lang}:${title}`;
  if (memory.has(key)) return Promise.resolve(memory.get(key)!);
  if (inflight.has(key)) return inflight.get(key)!;

  const p = (async () => {
    const storageKey = `wiki:v1:${key}`;
    try {
      const raw = await AsyncStorage.getItem(storageKey);
      if (raw) {
        const cached = JSON.parse(raw) as { at: number; data: WikiSummary | null };
        if (Date.now() - cached.at < TTL) return cached.data;
      }
    } catch {}

    try {
      const res = await fetch(
        `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`,
        { headers: { 'Api-User-Agent': 'Defineciler/1.0 (dronopter@gmail.com)' } },
      );
      if (!res.ok) throw new Error(String(res.status));
      const json = await res.json();
      const data: WikiSummary = {
        title: json.title,
        extract: json.extract ?? '',
        image: json.originalimage?.source ?? json.thumbnail?.source ?? null,
        url: json.content_urls?.mobile?.page ?? `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`,
      };
      if (data.image && json.thumbnail?.source && json.originalimage?.width > 1600) {
        // Çok büyük orijinaller yerine 1200px küçük resim kullan.
        data.image = json.thumbnail.source.replace(/\/\d+px-/, '/1200px-');
      }
      AsyncStorage.setItem(storageKey, JSON.stringify({ at: Date.now(), data })).catch(() => {});
      return data;
    } catch {
      return null;
    }
  })();

  inflight.set(key, p);
  p.then((v) => {
    memory.set(key, v);
    inflight.delete(key);
  });
  return p;
}
