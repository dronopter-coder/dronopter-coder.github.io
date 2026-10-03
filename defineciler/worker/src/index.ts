import { analyzeWithGemini, HttpError, MOCK_RESULT, parseAnalyzeRequest } from './gemini';
import { buildNews } from './news';

export interface Env {
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  APP_KEY?: string;
  DAILY_LIMIT_PER_IP?: string;
  MOCK_GEMINI?: string;
  ANALYZE_LIMITER?: RateLimit;
  USAGE?: KVNamespace;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-App-Key',
};

const json = (data: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS, ...extra },
  });

const NEWS_TTL = 30 * 60;

async function enforceLimits(req: Request, env: Env) {
  const ip = req.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (env.ANALYZE_LIMITER) {
    const { success } = await env.ANALYZE_LIMITER.limit({ key: ip });
    if (!success) throw new HttpError(429, 'Çok hızlı istek gönderildi. Lütfen bir dakika bekleyin.', 'rate_limited');
  }
  if (env.USAGE) {
    const limit = Number(env.DAILY_LIMIT_PER_IP ?? '30');
    const key = `d:${new Date().toISOString().slice(0, 10)}:${ip}`;
    const used = Number((await env.USAGE.get(key)) ?? '0');
    if (used >= limit) throw new HttpError(429, 'Bugünkü analiz sınırına ulaşıldı. Yarın tekrar deneyin.', 'daily_limit');
    await env.USAGE.put(key, String(used + 1), { expirationTtl: 60 * 60 * 48 });
  }
}

async function handleAnalyze(req: Request, env: Env) {
  if (env.APP_KEY && req.headers.get('X-App-Key') !== env.APP_KEY) {
    throw new HttpError(401, 'Yetkisiz istek.', 'unauthorized');
  }
  const len = Number(req.headers.get('Content-Length') ?? '0');
  if (len > 8 * 1024 * 1024) throw new HttpError(413, 'Fotoğraf çok büyük.', 'too_large');

  const body = parseAnalyzeRequest(await req.json().catch(() => null));

  if (env.MOCK_GEMINI === '1') return json({ result: MOCK_RESULT, mock: true });
  if (!env.GEMINI_API_KEY) throw new HttpError(500, 'Sunucu yapılandırılmamış (GEMINI_API_KEY eksik).', 'config');

  await enforceLimits(req, env);
  const result = await analyzeWithGemini(body, env.GEMINI_API_KEY, env.GEMINI_MODEL || 'gemini-flash-latest');
  return json({ result });
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

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    try {
      if (url.pathname === '/analyze' && req.method === 'POST') return await handleAnalyze(req, env);
      if (url.pathname === '/news' && req.method === 'GET') return await handleNews(req, ctx);
      if (url.pathname === '/' || url.pathname === '/health') return json({ ok: true, service: 'defineciler-api' });
      return json({ error: 'Bulunamadı', code: 'not_found' }, 404);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message, code: e.code }, e.status);
      console.error('unhandled', e);
      return json({ error: 'Sunucu hatası. Lütfen tekrar deneyin.', code: 'internal' }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
