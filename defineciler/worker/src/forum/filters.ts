// Otomatik denetim: yer tarifi, iletişim bilgisi ve eser alım-satımı gibi riskli içerikler onaya düşer.
// Gönderi reddedilmez; yönetici görene kadar yayımlanmaz ve kullanıcıya nedeni söylenir.

/** Kelime başında eşleşme (ekleri de yakalar: alıcı → alıcılar); Türkçe harfler kelimenin parçası sayılır. */
const w = (alts: string) => new RegExp(`(?<![\\p{L}\\p{N}])(${alts})`, 'iu');

const RULES: { re: RegExp; reason: string }[] = [
  { re: /\b\d{1,2}[.,]\d{4,}\s*[,;/ ]\s*\d{1,3}[.,]\d{4,}\b/, reason: 'koordinat' },
  { re: /\d{1,3}\s*°\s*\d{1,2}\s*['′]/, reason: 'koordinat' },
  { re: /\b[NKEDSGBW]\s?\d{1,2}[.,°]\d{3,}/i, reason: 'koordinat' },
  { re: /(maps\.app\.goo\.gl|goo\.gl\/maps|google\.[a-z.]+\/maps|maps\.google|yandex\.[a-z.]+\/maps|waze\.com|what3words)/i, reason: 'harita bağlantısı' },
  { re: /(\+?90[\s-]?)?\(?0?5\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/, reason: 'telefon numarası' },
  { re: /\bTR\s?\d{2}(\s?\d{4}){5}/i, reason: 'IBAN' },
  { re: /(whats\s?app|watsap|vatsap|telegram|t\.me\/|wa\.me\/)/i, reason: 'iletişim uygulaması' },
  { re: w('satılık|satiyorum|satıyorum|satarım|satarim|alırım|alirim|alıcı|alici|alıcısı|müşteri|musteri|takas'), reason: 'alım-satım' },
  { re: w('fiyat|fiyatı|kaç para|kac para|kaç lira|değeri ne|degeri ne|kaç eder|piyasa değeri'), reason: 'değer biçme' },
  { re: /(\d[\d.]*\s?(tl|₺|lira|dolar|\$|euro|€)\b)|₺/i, reason: 'fiyat' },
  { re: /\b(dedektör|dedektor|detektör)\s+(satılık|sat|kirala|kiralık)/i, reason: 'alet satışı' },
];

/** Eşleşen ilk kuralın nedenini döndürür; temizse null. */
export function flagReason(text: string): string | null {
  const t = text.toLocaleLowerCase('tr-TR');
  for (const r of RULES) if (r.re.test(t)) return r.reason;
  return null;
}
