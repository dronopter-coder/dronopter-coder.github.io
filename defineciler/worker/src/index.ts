import { analyzeWithGemini, DETAIL_BUDGET, HttpError, MOCK_RESULT, parseAnalyzeRequest } from './gemini';
import {
  assertWithinLimits,
  fingerprint,
  getCachedResult,
  limitsFromEnv,
  parseDeviceId,
  putCachedResult,
  recordUsage,
  type Who,
} from './limits';
import { buildNews } from './news';
import { SITE_PAGES } from './pages.generated';
import { isProDevice } from './pro';

export interface Env {
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  GEMINI_FALLBACK_MODELS?: string;
  APP_KEY?: string;
  DAILY_LIMIT_PER_IP?: string;
  DEVICE_DAILY_LIMIT?: string;
  GLOBAL_DAILY_LIMIT?: string;
  MOCK_GEMINI?: string;
  /** RevenueCat gizli API anahtarı (Pro aboneliği doğrulama); yoksa herkes ücretsiz sınırlarla çalışır */
  REVENUECAT_SECRET?: string;
  /** Pro abone cihaz başına günlük analiz sınırı */
  PRO_DEVICE_DAILY_LIMIT?: string;
  ANALYZE_LIMITER?: RateLimit;
  USAGE?: KVNamespace;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-App-Key, X-Device-Id',
};

const json = (data: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS, ...extra },
  });

const NEWS_TTL = 30 * 60;

const whoIs = (req: Request): Who => ({
  ip: req.headers.get('CF-Connecting-IP') ?? 'unknown',
  device: parseDeviceId(req.headers.get('X-Device-Id')),
});

/** Dakikalık hız sınırı (KV gerektirmez). */
async function enforceRate(who: Who, env: Env) {
  if (!env.ANALYZE_LIMITER) return;
  const { success } = await env.ANALYZE_LIMITER.limit({ key: who.device ?? who.ip });
  if (!success) throw new HttpError(429, 'Çok hızlı istek gönderildi. Lütfen bir dakika bekleyin.', 'rate_limited');
}

async function handleAnalyze(req: Request, env: Env, ctx: ExecutionContext) {
  if (env.APP_KEY && req.headers.get('X-App-Key') !== env.APP_KEY) {
    throw new HttpError(401, 'Yetkisiz istek.', 'unauthorized');
  }
  const len = Number(req.headers.get('Content-Length') ?? '0');
  if (len > 8 * 1024 * 1024) throw new HttpError(413, 'Fotoğraf çok büyük.', 'too_large');

  const raw = parseAnalyzeRequest(await req.json().catch(() => null));

  if (env.MOCK_GEMINI === '1') return json({ result: MOCK_RESULT, mock: true });
  if (!env.GEMINI_API_KEY) throw new HttpError(500, 'Sunucu yapılandırılmamış (GEMINI_API_KEY eksik).', 'config');

  const who = whoIs(req);
  await enforceRate(who, env);

  // Pro ayrıcalıkları (ayrıntılı rapor, ek fotoğraflar, yüksek sınır) yalnızca doğrulanmış abonelere.
  const wantsPro = raw.detail || !!raw.extraImages?.length;
  const pro = await isProDevice(who.device, env.REVENUECAT_SECRET, env.USAGE);
  const body = pro || !wantsPro ? raw : { ...raw, detail: false, extraImages: undefined };
  const limits = limitsFromEnv(env);
  if (pro) limits.perDevice = Number(env.PRO_DEVICE_DAILY_LIMIT) > 0 ? Number(env.PRO_DEVICE_DAILY_LIMIT) : 35;

  // Aynı fotoğraf(lar), not ve rapor türü daha önce analiz edildiyse Gemini'ye gitmeden önceki sonuç verilir.
  const fp = env.USAGE
    ? await fingerprint(
        [body.image, ...(body.extraImages ?? []).map((x) => x.image)].join('|'),
        `${body.note ?? ''}${body.detail ? '\n#detail' : ''}`,
      )
    : null;
  if (env.USAGE && fp) {
    const hit = await getCachedResult<unknown>(env.USAGE, fp);
    if (hit) return json({ result: hit, model: 'cache', pro });
    await assertWithinLimits(env.USAGE, who, limits);
  }

  const models = [env.GEMINI_MODEL || 'gemini-flash-latest', ...(env.GEMINI_FALLBACK_MODELS ?? '').split(',')];
  const heavy = body.detail || !!body.extraImages?.length;
  const { result, model } = await analyzeWithGemini(body, env.GEMINI_API_KEY, models, heavy ? DETAIL_BUDGET : undefined);
  if (env.USAGE && fp) {
    // Sonuç dönmüşken yanıtı geciktirmeden kaydet; kayıt hatası kullanıcıya yansımaz.
    ctx.waitUntil(
      Promise.all([recordUsage(env.USAGE, who), putCachedResult(env.USAGE, fp, result)]).catch((e) => console.error('kv', e)),
    );
  }
  return json({ result, model, pro });
}

async function handleNews(req: Request, ctx: ExecutionContext) {
  const cache = caches.default;
  const cacheKey = new Request(new URL('/news?v=1', req.url).toString(), { method: 'GET' });
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const data = await buildNews();
  if (!data.items.length) throw new HttpError(502, 'Haber kaynaklarına şu anda ulaşılamıyor.', 'news_unavailable');
  const res = json(data, 200, { 'Cache-Control': `public, max-age=${NEWS_TTL}` });
  ctx.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
}

/** Bağlantı testi: sunucu saati ve telefona hizmet veren Cloudflare veri merkezi. Gemini'ye dokunmaz. */
function handlePing(req: Request) {
  const cf = (req as Request & { cf?: { colo?: string; country?: string } }).cf;
  return json({ ok: true, time: new Date().toISOString(), colo: cf?.colo ?? null, country: cf?.country ?? null });
}

/** Bağlantı testi: gövdeyi okuyup bayt sayısını döndürür (yükleme yolunu Gemini'den bağımsız sınar). */
async function handleEcho(req: Request) {
  const started = Date.now();
  const bytes = (await req.arrayBuffer()).byteLength;
  return json({ ok: true, bytes, readMs: Date.now() - started });
}

/**
 * AdMob yetkili satıcı dosyası (https://defineciler.online/app-ads.txt). Play Store'daki geliştirici web sitesinin
 * kök dizininde bulunmalıdır; AdMob bu dosyayla reklam envanterinin size ait olduğunu doğrular.
 */
const APP_ADS_TXT = 'google.com, pub-3204109869365538, DIRECT, f08c47fec0942fa0\n';
const APEX_HOSTS = new Set(['defineciler.online', 'www.defineciler.online']);
const API_PATHS = new Set(['/news', '/ping', '/health']);
/** Eski bağlantılar (GitHub Pages adları) yeni yollara yönlendirilir. */
const PAGE_ALIASES: Record<string, string> = {
  '/privacy': '/gizlilik',
  '/privacy.html': '/gizlilik',
  '/gizlilik.html': '/gizlilik',
  '/abonelik.html': '/abonelik',
  '/index.html': '/',
};

/**
 * Ana alan adı (defineciler.online): app-ads.txt, tanıtım, gizlilik ve abonelik koşulları sayfaları.
 * Gizlilik ve abonelik sayfaları her adreste (api. dahil) sunulur; uygulama ve Play Store bu adreslere bağlanır.
 */
function handleSite(url: URL): Response | null {
  if (url.pathname === '/app-ads.txt') {
    return new Response(APP_ADS_TXT, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
    });
  }
  const alias = PAGE_ALIASES[url.pathname];
  if (alias) return Response.redirect(new URL(alias, url).toString(), 301);
  const isApex = APEX_HOSTS.has(url.hostname);
  if (url.pathname === '/' && !isApex) return null; // API sağlık kontrolü
  const page = SITE_PAGES[url.pathname];
  if (page) {
    return new Response(page, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
    });
  }
  return isApex && !API_PATHS.has(url.pathname) ? Response.redirect(new URL('/', url).toString(), 302) : null;
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (req.method === 'GET') {
      const site = handleSite(url);
      if (site) return site;
    }
    try {
      if (url.pathname === '/analyze' && req.method === 'POST') return await handleAnalyze(req, env, ctx);
      if (url.pathname === '/news' && req.method === 'GET') return await handleNews(req, ctx);
      if (url.pathname === '/ping' && req.method === 'GET') return handlePing(req);
      if (url.pathname === '/echo' && req.method === 'POST') {
        const len = Number(req.headers.get('Content-Length') ?? '0');
        if (len > 2 * 1024 * 1024) throw new HttpError(413, 'Gövde çok büyük.', 'too_large');
        return await handleEcho(req);
      }
      if (url.pathname === '/' || url.pathname === '/health') return json({ ok: true, service: 'defineciler-api' });
      return json({ error: 'Bulunamadı', code: 'not_found' }, 404);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message, code: e.code }, e.status);
      console.error('unhandled', e);
      return json({ error: 'Sunucu hatası. Lütfen tekrar deneyin.', code: 'internal' }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
