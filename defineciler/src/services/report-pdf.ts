import { File } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import type { ScanRecord } from '@/types/analysis';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const list = (items: string[]) => (items.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '');
const section = (title: string, body: string) => (body ? `<h2>${esc(title)}</h2>${body}` : '');
const para = (s: string) =>
  s
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((p) => `<p>${esc(p)}</p>`)
    .join('');

const AUTH: Record<string, string> = {
  likely_original: 'Orijinal olabilir',
  suspicious: 'Şüpheli',
  likely_replica: 'Muhtemelen taklit / replika',
  undetermined: 'Belirlenemedi',
};

async function imageDataUri(uri: string) {
  try {
    return `data:image/jpeg;base64,${await new File(uri).base64()}`;
  } catch {
    return null;
  }
}

/** Analiz raporunu A4 PDF olarak oluşturur ve paylaşım menüsünü açar (Pro). */
export async function shareReportPdf(scan: ScanRecord) {
  const r = scan.result;
  const img = await imageDataUri(scan.imageUri);
  const facts = [
    ['Dönem', r.period],
    ['Uygarlık', r.civilization],
    ['Tarih aralığı', r.dateRange],
    ['Malzeme', r.material],
    ['Köken', r.origin],
    ['Kategori', r.category],
    ['Güven', `%${r.confidence}`],
  ].filter(([, v]) => v);

  const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"/>
<style>
  @page { margin: 18mm 16mm; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #2a2118; font-size: 11.5pt; line-height: 1.5; }
  header { border-bottom: 2px solid #b8862f; padding-bottom: 8px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: flex-end; }
  .brand { letter-spacing: 3px; font-weight: bold; color: #8a6424; }
  .date { color: #7d705e; font-size: 9.5pt; }
  h1 { font-size: 21pt; margin: 6px 0 4px; }
  h2 { font-size: 13pt; color: #8a6424; border-bottom: 1px solid #e5d6b8; padding-bottom: 3px; margin-top: 18px; }
  .summary { font-size: 12pt; color: #4a3d2e; }
  img { max-width: 100%; max-height: 320px; display: block; margin: 10px auto; border-radius: 6px; }
  table { border-collapse: collapse; width: 100%; margin-top: 6px; }
  td { padding: 5px 8px; border-bottom: 1px solid #eee3cf; vertical-align: top; }
  td:first-child { color: #7d705e; width: 32%; }
  .note { font-size: 9pt; color: #7d705e; margin-top: 22px; border-top: 1px solid #e5d6b8; padding-top: 8px; }
</style></head><body>
<header><span class="brand">DEFİNECİLER</span><span class="date">Analiz raporu · ${new Date(scan.createdAt).toLocaleDateString('tr-TR')}</span></header>
<h1>${esc(r.title)}</h1>
<p class="summary">${esc(r.summary)}</p>
${img ? `<img src="${img}"/>` : ''}
${facts.length ? `<table>${facts.map(([k, v]) => `<tr><td>${k}</td><td>${esc(v)}</td></tr>`).join('')}</table>` : ''}
${section('Açıklama', para(r.description))}
${section('Ayırt edici özellikler', list(r.features))}
${section('Yazı ve semboller', r.inscriptions ? `<p>${esc(r.inscriptions)}</p>` : '')}
${section('Orijinallik değerlendirmesi', `<p><b>${AUTH[r.authenticity.assessment] ?? ''}</b></p>${list(r.authenticity.notes)}`)}
${section('Benzer örnekler', list(r.similarExamples))}
${section('Koruma önerileri', list(r.preservationTips))}
${section('Daha kesin sonuç için', list(r.photoTips))}
${scan.note ? section('Notunuz', `<p>${esc(scan.note)}</p>`) : ''}
<p class="note">Bu rapor Defineciler uygulaması tarafından fotoğraf üzerinden hazırlanmış tahmini bir değerlendirmedir; uzman görüşünün yerini tutmaz.
Türkiye'de kültür varlıklarının izinsiz kazısı ve ticareti 2863 sayılı Kanun'a göre suçtur; buluntular müze müdürlüğüne bildirilmelidir.</p>
</body></html>`;

  const { uri } = await Print.printToFileAsync({ html, base64: false });
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Analiz raporunu paylaş', UTI: 'com.adobe.pdf' });
}
