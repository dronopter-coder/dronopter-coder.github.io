// Haber tekrarı birleştirme testi: node --experimental-strip-types scripts/test-news-dedupe.mts
import assert from 'node:assert/strict';

import { dedupeStories } from '../src/services/news-dedupe.ts';

const at = (h: number) => new Date(Date.UTC(2026, 9, 8, 12 - h)).toISOString();
const item = (title: string, source: string, h = 1, image: string | null = null) => ({
  title,
  source,
  publishedAt: at(h),
  image,
});

// Kullanıcının ekran görüntüsündeki aynı olay (6 farklı site)
const anamur = [
  item('Mersinde tarihi eser kaçakçılığı operasyonu - Anamur Haber', 'CNN Türk', 10),
  item('Anamur’da tarihi eser kaçakçılığı operasyonu', 'Mersin Haberci Gazetesi', 11),
  item('Anamur’da tarihi eser operasyonu: 6 obje ele geçirildi', 'Mersin Portal', 11, 'https://x/a.jpg'),
  item("Mersin Anamur'da tarihi eser satmak isteyen şüpheli yakalandı, 6 obje ele geçirildi", 'Son Dakika', 11),
  item("Mersin'de Tarihi Eser Operasyonu: 6 Obje Ele Geçirildi, 1 Şüpheli Yakalandı", 'Akdeniz Gerçek', 11),
  item('Anamur’da 6 tarihi obje ele geçirildi', 'Haberler.com', 12),
];
const others = [
  item("İzmir'de tarihi eser operasyonu: 3 obje ele geçirildi", 'Ege Haber', 5),
  item('Göbeklitepe’de yeni dikilitaşlar bulundu', 'AA', 3),
  item('Karahantepe kazılarında yeni dikilitaşlar gün yüzüne çıktı', 'TRT Haber', 4),
  item('Efes Antik Kenti ziyaretçi rekoru kırdı', 'Hürriyet', 6),
  item('Güney Afrika’da 2 Milyon Yıllık Homo erectus Fosili Bulundu', 'Arkeofili', 10),
  item("Gaziantep'te İlber Ortaylı Kütüphanesi açıldı", 'Pembe Pusula', 3),
  item('Gaziantep’in yeni bilim yuvası: Prof. Dr. İlber Ortaylı İhtisas Kütüphanesi kapılarını açtı', 'Gaziantep Haber', 4),
];

const out = dedupeStories([...anamur, ...others]);
const anamurOut = out.filter((o) => /anamur|mersin/i.test(o.title) || o.alsoIn.some((s) => /Mersin|Son Dakika/.test(s)));
for (const o of out) console.log(`- ${o.title}  [${o.source}${o.alsoIn.length ? ' +' + o.alsoIn.length : ''}]`);

assert.equal(anamurOut.length, 1, 'Anamur haberleri tek karta inmeli');
assert.equal(anamurOut[0].image, 'https://x/a.jpg', 'görselli haber seçilmeli');
assert.equal(anamurOut[0].alsoIn.length, 5);
assert.ok(
  out.some((o) => o.title.startsWith("İzmir'de")),
  'İzmir operasyonu ayrı kalmalı',
);
assert.ok(out.some((o) => o.title.startsWith('Efes')));
assert.equal(out.filter((o) => /Ortaylı/.test(o.title)).length, 1, 'Ortaylı kütüphanesi haberleri birleşmeli');
assert.equal(out.length, 1 + 1 + 2 + 1 + 1 + 1, 'beklenen kart sayısı');
console.log('✓ haber tekrarı testi');
