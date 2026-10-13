import { AUTHENTICITY, RESPONSE_SCHEMA, SYSTEM_PROMPT, VERDICTS, type AnalysisResult } from './schema';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public code = 'error',
    /** İsteğe bağlı teşhis bilgisi (ör. Gemini model hata kodları); yanıtta `detail` olarak döner. */
    public detail?: string,
  ) {
    super(message);
  }
}

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export type ImagePart = { image: string; mimeType: string };
export type AnalyzeRequest = ImagePart & {
  note?: string;
  /** Pro: ayrıntılı rapor isteği (yalnızca doğrulanmış Pro abonede uygulanır) */
  detail?: boolean;
  /** Pro: aynı objenin ek fotoğrafları (arka yüz, yan, ölçek), en fazla 2 */
  extraImages?: ImagePart[];
};

const MAX_BASE64 = 6 * 1024 * 1024;
const MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic']);

/** İstemciden gelen gövdeyi doğrular. */
export function parseAnalyzeRequest(body: unknown): AnalyzeRequest {
  if (!body || typeof body !== 'object') throw new HttpError(400, 'Geçersiz istek.', 'bad_request');
  const { image, mimeType, note, detail, extraImages } = body as Record<string, unknown>;
  const main = parseImage(image, mimeType);
  const n = typeof note === 'string' ? note.trim().slice(0, 400) : undefined;
  const extras = Array.isArray(extraImages)
    ? extraImages.slice(0, 2).map((x) => parseImage((x as ImagePart)?.image, (x as ImagePart)?.mimeType))
    : [];
  return { ...main, note: n || undefined, detail: detail === true, extraImages: extras.length ? extras : undefined };
}

function parseImage(image: unknown, mimeType: unknown): ImagePart {
  if (typeof image !== 'string' || image.length < 100) throw new HttpError(400, 'Fotoğraf bulunamadı.', 'no_image');
  if (image.length > MAX_BASE64) throw new HttpError(413, 'Fotoğraf çok büyük.', 'too_large');
  if (!/^[A-Za-z0-9+/=\r\n]+$/.test(image.slice(0, 2000))) throw new HttpError(400, 'Fotoğraf verisi bozuk.', 'bad_image');
  const mt = typeof mimeType === 'string' && MIME_TYPES.has(mimeType) ? mimeType : 'image/jpeg';
  return { image, mimeType: mt };
}

const s = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const arr = (v: unknown, max = 8) =>
  Array.isArray(v) ? v.map(s).filter(Boolean).slice(0, max) : typeof v === 'string' && v.trim() ? [v.trim()] : [];

/** Model çıktısını uygulamanın beklediği biçime zorlar (eksik alanlara varsayılan verir). */
export function normalizeResult(raw: unknown): AnalysisResult {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, any>;
  const verdict = (VERDICTS as readonly string[]).includes(r.verdict) ? r.verdict : 'unclear';
  const auth = (r.authenticity ?? {}) as Record<string, unknown>;
  const assessment = (AUTHENTICITY as readonly string[]).includes(auth.assessment as string)
    ? (auth.assessment as AnalysisResult['authenticity']['assessment'])
    : 'undetermined';
  const conf = Number(r.confidence);
  return {
    verdict,
    title: s(r.title) || 'Tanımlanamayan obje',
    category: s(r.category),
    summary: s(r.summary),
    period: s(r.period),
    civilization: s(r.civilization),
    dateRange: s(r.dateRange),
    material: s(r.material),
    origin: s(r.origin),
    description: s(r.description),
    features: arr(r.features),
    inscriptions: s(r.inscriptions),
    authenticity: { assessment, notes: arr(auth.notes, 6) },
    similarExamples: arr(r.similarExamples, 4),
    preservationTips: arr(r.preservationTips, 5),
    photoTips: arr(r.photoTips, 5),
    confidence: Number.isFinite(conf) ? Math.max(0, Math.min(100, Math.round(conf <= 1 && conf > 0 ? conf * 100 : conf))) : 0,
  };
}

/** Pro "ayrıntılı rapor": aynı şema, daha derin içerik. */
const DETAIL_INSTRUCTIONS = `
AYRINTILI RAPOR istendi. Şunlara özellikle dikkat et:
- description: en az 3 paragraf; üretim tekniği, kullanım amacı, dönemin tarihsel bağlamı ve benzer buluntularla karşılaştırma.
- inscriptions: yazı, lejant, monogram veya sembolleri harf harf okumaya çalış; okunamayan kısımları [...] ile belirt, varsa çevirisini ver.
- similarExamples: Türkiye'deki ve dünyadaki müzelerden somut, bilinen benzer örnekler ve tip adları.
- features ve authenticity.notes: her gözlemi fotoğraftaki somut bir ayrıntıya dayandır.
- photoTips: kesin tanım için eksik kalan bilgileri (ölçü, ağırlık, arka yüz, kenar) açıkça belirt.`;

/** Toplam süre bütçesi: en fazla 50 sn; her model en fazla 30 sn; 8 sn'den az kaldıysa yeni model denenmez. */
export const DEFAULT_BUDGET = { totalMs: 50_000, perModelMs: 30_000, minAttemptMs: 8_000 };
/** Pro ayrıntılı rapor / çok fotoğraflı analiz daha uzun sürer (istemci 85 sn bekler). */
export const DETAIL_BUDGET = { totalMs: 68_000, perModelMs: 45_000, minAttemptMs: 10_000 };

/** Bu durum kodlarında sıradaki modele geçilir (yoğunluk, kota, geçici hata, model yok). */
const RETRYABLE = new Set([404, 408, 429, 500, 502, 503, 504]);

/** Tek bir modele istek atar; başarıda sonucu, geçici hatada null döndürür. */
async function callModel(
  req: AnalyzeRequest,
  apiKey: string,
  model: string,
  timeoutMs: number,
  fails: string[] = [],
): Promise<AnalysisResult | null> {
  const extras = req.extraImages ?? [];
  const userText =
    (extras.length
      ? `Bu ${extras.length + 1} fotoğraf AYNI objenin farklı yüzleridir (ön, arka, yan veya ölçekli). Hepsini birlikte değerlendirerek objeyi tanımla.`
      : 'Bu fotoğraftaki objeyi tanımla.') +
    (req.detail ? DETAIL_INSTRUCTIONS : '') +
    (req.note ? `\nKullanıcının ek notu (boyut, bulunduğu yer vb.): """${req.note}"""` : '');

  let res: Response;
  try {
    res = await fetch(`${GEMINI_BASE}/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      signal: AbortSignal.timeout(timeoutMs),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType: req.mimeType, data: req.image } },
              ...extras.map((x) => ({ inlineData: { mimeType: x.mimeType, data: x.image } })),
              { text: userText },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.4,
          maxOutputTokens: 8192,
        },
      }),
    });
  } catch (e) {
    console.error('Gemini fetch failed', model, String(e));
    fails.push(/timeout|abort/i.test(String(e)) ? 'timeout' : 'network');
    return null;
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('Gemini error', model, res.status, detail.slice(0, 500));
    fails.push(String(res.status));
    if (RETRYABLE.has(res.status)) return null;
    if (res.status === 400 && /image|inline/i.test(detail))
      throw new HttpError(400, 'Fotoğraf işlenemedi. Farklı bir fotoğraf deneyin.', 'bad_image');
    throw new HttpError(502, 'Analiz servisine şu anda ulaşılamadı. Lütfen tekrar deneyin.', `upstream_${res.status}`);
  }

  const data = (await res.json()) as any;
  if (data?.promptFeedback?.blockReason) {
    throw new HttpError(422, 'Bu fotoğraf analiz edilemedi. Lütfen yalnızca eserin fotoğrafını gönderin.', 'blocked');
  }
  const cand = data?.candidates?.[0];
  const text: string = (cand?.content?.parts ?? [])
    .filter((p: any) => typeof p?.text === 'string' && !p.thought)
    .map((p: any) => p.text)
    .join('');
  if (!text) {
    console.error('Gemini empty', model, JSON.stringify(data).slice(0, 500));
    fails.push('empty');
    return null;
  }
  try {
    return normalizeResult(JSON.parse(text));
  } catch {
    console.error('Gemini bad JSON', model, cand?.finishReason, text.slice(0, 300));
    fails.push('json');
    return null;
  }
}

/**
 * Gemini'ye fotoğrafı ve yapılandırılmış çıktı şemasını gönderir. Model yoğunsa (503/429 vb.)
 * sıradaki yedek modeli dener; hepsi başarısız olursa "yoğun" hatası verir.
 */
export async function analyzeWithGemini(
  req: AnalyzeRequest,
  apiKey: string,
  models: string[],
  budget: { totalMs: number; perModelMs: number; minAttemptMs: number } = DEFAULT_BUDGET,
): Promise<{ result: AnalysisResult; model: string }> {
  const list = [...new Set(models.map((m) => m.trim()).filter(Boolean))];
  // İstemci en fazla ~70 sn bekler; sunucu her durumda bundan önce anlamlı bir yanıt vermeli.
  const deadline = Date.now() + budget.totalMs;
  // Her modelin başarısızlık nedeni (durum kodu, timeout, empty...): "çok yoğun" hatasının teşhisi için.
  const fails: string[] = [];
  for (const [i, model] of list.entries()) {
    if (i > 0) await new Promise((r) => setTimeout(r, 300));
    const left = deadline - Date.now();
    if (left < budget.minAttemptMs) {
      fails.push('süre');
      break;
    }
    const result = await callModel(req, apiKey, model, Math.min(budget.perModelMs, left), fails);
    if (result) return { result, model };
  }
  console.error('Gemini hepsi başarısız', fails.join(','));
  throw new HttpError(503, 'Analiz servisi şu anda çok yoğun. Lütfen birkaç dakika sonra tekrar deneyin.', 'busy', fails.join(','));
}

/** MOCK_GEMINI=1 iken kullanılan örnek sonuç (anahtar olmadan test için). */
export const MOCK_RESULT: AnalysisResult = normalizeResult({
  verdict: 'artifact',
  title: 'Bizans Bronz Sikkesi (Anonim Follis)',
  category: 'Sikke',
  summary:
    'Fotoğraftaki obje, 10-11. yüzyıla ait anonim bir Bizans bronz sikkesine (follis) benziyor. Ön yüzdeki İsa büstü ve arka yüzdeki dört satırlık yazı bu tipin tipik özellikleridir.',
  period: 'Orta Bizans',
  civilization: 'Bizans İmparatorluğu',
  dateRange: 'MS 976 – 1092',
  material: 'Bronz',
  origin: 'Konstantinopolis darphanesi',
  description:
    'Anonim folliseler, imparator adı yerine İsa tasviri taşıyan bronz sikkelerdir. Anadolu’da en sık bulunan Bizans sikke tiplerindendir. Yeşil patina, uzun süre toprak altında kaldığını gösterir.',
  features: ['Ön yüzde haleli İsa büstü', 'Arka yüzde dört satır Grekçe yazı', 'Düzensiz kenar ve yeşil patina'],
  inscriptions: 'Arka yüzde "IS XS bASILEU bASILE" (İsa Mesih, Kralların Kralı) yazısı okunuyor olabilir.',
  authenticity: { assessment: 'likely_original', notes: ['Patina doğal görünüyor', 'Döküm izi görülmüyor'] },
  similarExamples: ['İstanbul Arkeoloji Müzeleri sikke kabinesi', 'Dumbarton Oaks Bizans sikke koleksiyonu'],
  preservationTips: ['Sikkeyi temizlemeyin', 'Kuru ve asitsiz bir zarfta saklayın'],
  photoTips: ['Arka yüzün yandan ışıkla çekilmiş fotoğrafını ekleyin', 'Yanına cetvel koyarak çap gösterin'],
  confidence: 72,
});
