/**
 * Aynı olayı anlatan haberleri (farklı sitelerde, farklı başlıklarla) tek kayda indirir.
 * Saf TypeScript: uygulama, Worker ve node test betikleri tarafından ortak kullanılır.
 */

type Item = { title: string; source: string; publishedAt: string | null; image: string | null };

const STOP_WORDS = (
  've ile bir bu şu o için da de ta te mi mı mu mü ki ne olan olarak gibi daha çok en yeni son ' +
  'dakika haber haberi haberleri video foto galeri işte neler nasıl oldu etti ilk iki üç'
).split(' ');

// Arkeoloji haberlerinde çok sık geçen, tek başına "aynı haber" demeye yetmeyen kelimeler.
const GENERIC_WORDS = (
  'tarihi tarihî eser eserler arkeoloji arkeolojik arkeolog kazı kazısı kazılar antik operasyon ' +
  'operasyonu bulundu buluntu ele geçirildi kent kenti müze müzesi define defineci yakalandı ' +
  'şüpheli kaçakçılığı kaçakçılık obje ortaya çıkarıldı çalışma çalışmaları yapıldı başladı türkiye ' +
  'yıllık dönem dönemine ait gün yüzüne keşif keşfedildi il ilçe köy köyü'
).split(' ');

const stem = (w: string) => w.slice(0, 5);
const STOP = new Set(STOP_WORDS);
const GENERIC = new Set(GENERIC_WORDS.map(stem));

const lower = (s: string) => s.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase();

/** Başlığı kök kümesine çevirir ("Anamur'da tarihi eser operasyonu" → {anamu, tarih, eser, opera}). */
export function titleStems(title: string): Set<string> {
  const words = lower(title)
    .replace(/['’‘`´][a-zçğıöşü]+/g, '') // kesme ekleri: Anamur'da → anamur
    .split(/[^a-z0-9çğıöşüâîû]+/)
    .filter((w) => w && !STOP.has(w));
  return new Set(words.map(stem));
}

const DAY = 86_400_000;

/** İki başlık aynı olayı mı anlatıyor? */
export function sameStory(a: Set<string>, b: Set<string>): boolean {
  let shared = 0;
  let distinctive = 0;
  for (const s of a) {
    if (!b.has(s)) continue;
    shared++;
    if (!GENERIC.has(s)) distinctive++;
  }
  const ratio = shared / Math.max(1, Math.min(a.size, b.size));
  return (ratio >= 0.6 && distinctive >= 1) || distinctive >= 3;
}

/**
 * Haberleri olaylara göre kümeler. Her kümeden görseli olan, sonra en yeni haber seçilir;
 * diğer kaynakların adları `alsoIn` alanında döner.
 */
export function dedupeStories<T extends Item>(items: T[]): (T & { alsoIn: string[] })[] {
  const clusters: { items: T[]; stems: Set<string>[]; times: number[] }[] = [];
  for (const item of items) {
    const st = titleStems(item.title);
    const t = item.publishedAt ? Date.parse(item.publishedAt) : NaN;
    const home = clusters.find((c) =>
      c.stems.some(
        (s, i) => sameStory(s, st) && (Number.isNaN(t) || Number.isNaN(c.times[i]) || Math.abs(t - c.times[i]) <= 3 * DAY),
      ),
    );
    if (home) {
      home.items.push(item);
      home.stems.push(st);
      home.times.push(t);
    } else clusters.push({ items: [item], stems: [st], times: [t] });
  }
  const time = (i: Item) => (i.publishedAt ? Date.parse(i.publishedAt) || 0 : 0);
  return clusters.map(({ items: group }) => {
    const best = [...group].sort((a, b) => Number(!!b.image) - Number(!!a.image) || time(b) - time(a))[0];
    const alsoIn = [...new Set(group.filter((i) => i !== best).map((i) => i.source))].filter((s) => s !== best.source);
    return { ...best, alsoIn };
  });
}
