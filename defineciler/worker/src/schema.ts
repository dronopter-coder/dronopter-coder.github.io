/**
 * Gemini'den istenen yanıt şeması. Uygulamadaki src/types/analysis.ts ile birebir aynı alanlar.
 * (Gemini responseSchema: OpenAPI 3 alt kümesi)
 */
export const VERDICTS = ['artifact', 'possible', 'not_artifact', 'unclear'] as const;
export const AUTHENTICITY = ['likely_original', 'suspicious', 'likely_replica', 'undetermined'] as const;

export type Verdict = (typeof VERDICTS)[number];
export type AuthenticityAssessment = (typeof AUTHENTICITY)[number];

export interface AnalysisResult {
  verdict: Verdict;
  title: string;
  category: string;
  summary: string;
  period: string;
  civilization: string;
  dateRange: string;
  material: string;
  origin: string;
  description: string;
  features: string[];
  inscriptions: string;
  authenticity: { assessment: AuthenticityAssessment; notes: string[] };
  similarExamples: string[];
  preservationTips: string[];
  photoTips: string[];
  confidence: number;
}

const str = (description: string) => ({ type: 'STRING', description });
const strArr = (description: string) => ({ type: 'ARRAY', items: { type: 'STRING' }, description });

export const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    verdict: {
      type: 'STRING',
      enum: [...VERDICTS],
      description:
        'artifact: açıkça tarihi/arkeolojik eser; possible: eser olabilir ama emin değilsin; not_artifact: doğal taş, modern obje, çöp vb.; unclear: fotoğraf yetersiz.',
    },
    title: str('Eserin kısa Türkçe adı, ör. "Roma İmparatorluk Dönemi Bronz Sikke (Follis)". Eser değilse ne olduğu.'),
    category: str(
      'Kategori: Sikke, Seramik, Kandil, Figürin, Heykel parçası, Takı, Mühür, Silah/Alet, Cam eser, Yazıt, Kaya işareti, Mimari parça, Doğal oluşum, Modern obje vb.',
    ),
    summary: str('2-3 cümlelik özet: ne olduğu, hangi döneme ait olduğu ve neden böyle düşündüğün.'),
    period: str('Dönem, ör. "Geç Roma", "Hellenistik", "Bizans (Orta)", "Erken Tunç Çağı". Bilinmiyorsa boş.'),
    civilization: str('Uygarlık/kültür, ör. "Roma İmparatorluğu", "Lidya", "Hitit", "Anadolu Selçuklu". Bilinmiyorsa boş.'),
    dateRange: str('Tahmini tarih aralığı, ör. "MS 330 – 360" veya "MÖ 7. yüzyıl". Bilinmiyorsa boş.'),
    material: str('Malzeme, ör. "Bronz", "Pişmiş toprak", "Mermer", "Elektron (altın-gümüş alaşımı)".'),
    origin: str('Muhtemel üretim yeri veya bölgesi, ör. "Konstantinopolis darphanesi", "Batı Anadolu".'),
    description: str(
      'Ayrıntılı açıklama (1-3 paragraf): biçimi, işlevi, üzerindeki tasvirler, tarihsel bağlamı ve ilginç bilgiler.',
    ),
    features: strArr('Fotoğrafta görülen ve tespiti destekleyen ayırt edici özellikler (3-6 madde).'),
    inscriptions: str('Görülen yazı, harf, monogram veya semboller ve okunabiliyorsa anlamı/çevirisi. Yoksa boş.'),
    authenticity: {
      type: 'OBJECT',
      properties: {
        assessment: { type: 'STRING', enum: [...AUTHENTICITY] },
        notes: strArr('Orijinallik veya taklit olma ihtimaline dair gözlemler (döküm izi, patina, aşınma vb.).'),
      },
      required: ['assessment', 'notes'],
    },
    similarExamples: strArr('Benzer örneklerin bulunduğu müzeler veya bilinen benzer eser tipleri (en fazla 4).'),
    preservationTips: strArr('Eserin korunması için öneriler (temizlememe, saklama koşulları vb.).'),
    photoTips: strArr('Daha kesin sonuç için çekilmesi gereken ek fotoğraflar (ör. arka yüz, ölçek, yan ışık).'),
    confidence: { type: 'INTEGER', description: 'Tanımlamadaki güven yüzdesi, 0-100.' },
  },
  required: [
    'verdict',
    'title',
    'category',
    'summary',
    'period',
    'civilization',
    'dateRange',
    'material',
    'origin',
    'description',
    'features',
    'inscriptions',
    'authenticity',
    'similarExamples',
    'preservationTips',
    'photoTips',
    'confidence',
  ],
  propertyOrdering: [
    'verdict',
    'title',
    'category',
    'summary',
    'period',
    'civilization',
    'dateRange',
    'material',
    'origin',
    'description',
    'features',
    'inscriptions',
    'authenticity',
    'similarExamples',
    'preservationTips',
    'photoTips',
    'confidence',
  ],
} as const;

export const SYSTEM_PROMPT = `Sen Anadolu arkeolojisi, nümismatik (sikke bilimi) ve sanat tarihi konusunda uzman bir müze küratörüsün.
Kullanıcılar Türkiye'de buldukları veya ellerindeki objelerin fotoğraflarını gönderiyor. Görevin fotoğraftaki objeyi tanımlamak.

Kurallar:
- Tüm metinleri akıcı ve anlaşılır TÜRKÇE yaz.
- Anadolu'nun tarihi bağlamını (Neolitik, Tunç Çağı, Hitit, Frig, Urartu, Lidya, Grek, Pers, Hellenistik, Roma, Bizans, Selçuklu, Beylikler, Osmanlı) dikkate al.
- Dürüst ol: emin olmadığın bilgiyi uydurma; belirsizse bunu açıkça söyle ve güven puanını düşük tut.
- Obje doğal bir taş, fosil, modern bir eşya, turistik replika veya çöp ise bunu net biçimde belirt (verdict: not_artifact) ve ne olduğunu açıkla.
- Kaya üzerindeki "define işareti" sorulursa, işaretin doğal mı insan yapımı mı olduğunu ve arkeolojik olarak neyle ilişkili olabileceğini anlat; gömü vaat etme.
- Parasal değer veya satış fiyatı belirtme. Eser ticareti Türkiye'de yasa dışıdır.
- Kullanıcıyı izinsiz kazıya yönlendirme.
- Sikkelerde yazıları (lejant) okumaya çalış, hükümdar/darphane tespiti yap.
- Fotoğraf yetersizse photoTips alanında neyin çekilmesi gerektiğini belirt.
- Metinlerde kendinden "yapay zeka", "model" veya "AI" diye söz etme; gerekirse "Defineciler analizi" de.`;
