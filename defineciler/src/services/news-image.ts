import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { PHOTOS, type Photo } from '@/data/photos.generated';
import { resolveArticleImage } from '@/services/news-image-core';
import { hashId } from '@/services/rss';

const CACHE_KEY = 'news:img:v1';
const MAX_ENTRIES = 300;
const CONCURRENCY = 3;

/** link-hash → görsel adresi ("" = bulunamadı, tekrar denenmez) */
let cache: Record<string, string> | null = null;
let loading: Promise<Record<string, string>> | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function loadCache() {
  if (cache) return Promise.resolve(cache);
  loading ??= AsyncStorage.getItem(CACHE_KEY)
    .then((raw) => (cache = raw ? (JSON.parse(raw) as Record<string, string>) : {}))
    .catch(() => (cache = {}));
  return loading;
}

function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    if (!cache) return;
    const keys = Object.keys(cache);
    if (keys.length > MAX_ENTRIES) for (const k of keys.slice(0, keys.length - MAX_ENTRIES)) delete cache[k];
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache)).catch(() => {});
  }, 1500);
}

// Aynı anda en fazla birkaç sayfa indirilir.
let active = 0;
const waiting: (() => void)[] = [];
async function limited<T>(job: () => Promise<T>): Promise<T> {
  if (active >= CONCURRENCY) await new Promise<void>((r) => waiting.push(r));
  active++;
  try {
    return await job();
  } finally {
    active--;
    waiting.shift()?.();
  }
}

const inflight = new Map<string, Promise<string | null>>();

/** Haberin kapak görselini bulur (önbellekli). */
export async function getArticleImage(link: string): Promise<string | null> {
  const key = hashId(link);
  const c = await loadCache();
  if (key in c) return c[key] || null;
  let p = inflight.get(key);
  if (!p) {
    p = limited(() => resolveArticleImage(link)).then((img) => {
      c[key] = img ?? '';
      scheduleSave();
      inflight.delete(key);
      return img;
    });
    inflight.set(key, p);
  }
  return p;
}

/** Beslemede görseli olmayan haber için makale sayfasındaki görseli arar. */
export function useArticleImage(link: string, feedImage: string | null) {
  const [img, setImg] = useState<string | null>(feedImage);
  useEffect(() => {
    if (feedImage) return;
    let alive = true;
    getArticleImage(link).then((u) => alive && u && setImg(u));
    return () => {
      alive = false;
    };
  }, [link, feedImage]);
  return img;
}

/** Başlıktaki konuya göre uygulamadaki temsili fotoğraflardan biri. */
const TOPICS: [RegExp, string][] = [
  [/sikke|hazine|define|altın/i, 'guide:sikkeler'],
  [/mozaik|seramik|çömlek|amfora|testi/i, 'guide:seramik'],
  [/lahit|mezar|tümülüs|nekropol|kaya mezar/i, 'place:likya'],
  [/hitit|hattuşa|boğazköy|çorum/i, 'place:hitit'],
  [/kapadokya|nevşehir|yeraltı şehri|kayseri|niğde|aksaray/i, 'place:kapadokya'],
  [/göbekli|karahan|şanlıurfa|urfa|mardin|mezopotamya|harran|diyarbakır/i, 'place:mezopotamya'],
  [/nemrut|adıyaman|kommagene|zeugma|gaziantep/i, 'place:kommagene'],
  [/urartu|\bvan\b|ağrı|\bkars\b/i, 'place:urartu'],
  [/efes|izmir|milet|iyon|bergama|smyrna/i, 'place:iyonya'],
  [/troya|truva|çanakkale|assos/i, 'place:troas'],
  [/sardes|manisa|lidya|uşak/i, 'place:lidya'],
  [/frig|gordion|midas|eskişehir|afyon/i, 'place:frigya'],
  [/çatalhöyük|konya|karaman/i, 'place:konya'],
  [/likya|antalya|patara|myra|fethiye/i, 'place:likya'],
  [/perge|aspendos|\bside\b|pamfilya/i, 'place:pamfilya'],
  [/mersin|kilikya|adana|tarsus|yumuktepe|hatay/i, 'place:kilikya'],
  [/karya|muğla|bodrum|halikarnas|aydın|stratonikeia/i, 'place:karya'],
  [/edirne|kırklareli|trakya|tekirdağ/i, 'place:trakya'],
  [/karadeniz|samsun|sinop|trabzon|amasya|kastamonu/i, 'place:karadeniz'],
  [/heykel|figür|idol|büst/i, 'guide:figurinler'],
  [/kandil|lamba/i, 'guide:kandiller'],
  [/mühür|tablet|yazıt|kitabe|kütüphane|arşiv/i, 'guide:muhurler'],
  [/takı|yüzük|bilezik|küpe|kolye/i, 'guide:takilar'],
  [/kaçak|operasyon|ele geçir|yakalan|sahte/i, 'guide:yasal'],
  [/kazı|höyük|arkeolog|buluntu|ören yeri|antik kent/i, 'guide:fotograf'],
];

const FALLBACK_POOL = Object.keys(PHOTOS).filter((k) => k.startsWith('place:'));

export function fallbackPhoto(title: string, id: string): Photo {
  for (const [re, key] of TOPICS) if (re.test(title) && PHOTOS[key]) return PHOTOS[key];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PHOTOS[FALLBACK_POOL[h % FALLBACK_POOL.length]];
}
