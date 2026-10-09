import { HttpError } from './gemini';

/** KVNamespace'in kullandığımız küçük alt kümesi (testte sahte uygulamayla değiştirilebilir). */
export interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

export type Limits = {
  /** Cihaz başına günlük en fazla analiz */
  perDevice: number;
  /** IP başına günlük en fazla analiz (mobil operatörlerde birçok kullanıcı aynı IP'yi paylaşır; geniş tutulur) */
  perIp: number;
  /** Tüm kullanıcılar için günlük toplam: Gemini maliyetinin ve ücretsiz kotanın tavanı */
  global: number;
};

export const DEFAULT_LIMITS: Limits = { perDevice: 15, perIp: 150, global: 1500 };

const DAY_TTL = 60 * 60 * 48;
const today = (now: Date) => now.toISOString().slice(0, 10);
const num = async (kv: KV, key: string) => Number((await kv.get(key)) ?? '0') || 0;

export type Who = { device?: string; ip: string };

const keysFor = (who: Who, now: Date) => {
  const d = today(now);
  return {
    device: who.device ? `d:${d}:${who.device}` : null,
    ip: `i:${d}:${who.ip}`,
    global: `g:${d}`,
  };
};

/** Cihaz kimliği: uygulamanın ürettiği rastgele UUID; biçimi geçersizse yok sayılır. */
export const parseDeviceId = (v: string | null) => (v && /^[A-Za-z0-9-]{16,64}$/.test(v) ? v : undefined);

/** Günlük sınırlardan biri dolmuşsa hata fırlatır (sayaç artırmaz). */
export async function assertWithinLimits(kv: KV, who: Who, limits: Limits, now = new Date()) {
  const k = keysFor(who, now);
  if ((await num(kv, k.global)) >= limits.global) {
    throw new HttpError(503, 'Bugün çok fazla analiz yapıldı, servisimiz yoğun. Lütfen yarın tekrar deneyin.', 'busy_today');
  }
  if (k.device && (await num(kv, k.device)) >= limits.perDevice) {
    throw new HttpError(429, 'Bugünkü analiz sınırına ulaştınız. Yarın tekrar deneyebilirsiniz.', 'daily_limit');
  }
  if ((await num(kv, k.ip)) >= limits.perIp) {
    throw new HttpError(429, 'Bu bağlantıdan bugün çok fazla analiz yapıldı. Yarın tekrar deneyin.', 'daily_limit');
  }
}

/** Başarılı bir analizden sonra sayaçları artırır (başarısız denemeler hakkı düşürmez). */
export async function recordUsage(kv: KV, who: Who, now = new Date()) {
  const k = keysFor(who, now);
  for (const key of [k.global, k.ip, k.device]) {
    if (!key) continue;
    await kv.put(key, String((await num(kv, key)) + 1), { expirationTtl: DAY_TTL });
  }
}

/** Fotoğraf + not için kısa parmak izi (SHA-256, ilk 32 hex). Fotoğrafın kendisi saklanmaz. */
export async function fingerprint(image: string, note?: string) {
  const data = new TextEncoder().encode(`${image}\n${note ?? ''}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)]
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const CACHE_TTL = 60 * 60 * 24 * 7;

/** Aynı fotoğraf tekrar analiz edilirse Gemini'ye gitmeden önceki sonuç verilir. */
export async function getCachedResult<T>(kv: KV, fp: string): Promise<T | null> {
  const raw = await kv.get(`r:${fp}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export const putCachedResult = (kv: KV, fp: string, result: unknown) =>
  kv.put(`r:${fp}`, JSON.stringify(result), { expirationTtl: CACHE_TTL });

export function limitsFromEnv(env: {
  DEVICE_DAILY_LIMIT?: string;
  DAILY_LIMIT_PER_IP?: string;
  GLOBAL_DAILY_LIMIT?: string;
}): Limits {
  const n = (v: string | undefined, d: number) => (v && Number(v) > 0 ? Number(v) : d);
  return {
    perDevice: n(env.DEVICE_DAILY_LIMIT, DEFAULT_LIMITS.perDevice),
    perIp: n(env.DAILY_LIMIT_PER_IP, DEFAULT_LIMITS.perIp),
    global: n(env.GLOBAL_DAILY_LIMIT, DEFAULT_LIMITS.global),
  };
}
