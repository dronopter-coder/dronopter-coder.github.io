import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import { API_URLS, APP_KEY } from '@/constants/config';
import type { NewsItem } from '@/services/news';
import type { AnalysisResult } from '@/types/analysis';

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string = 'error',
  ) {
    super(message);
  }
}

const MAX_SIDE = 1024;

/** Fotoğrafı yapay zekaya göndermeden önce küçültüp JPEG'e çevirir (veri ve hız tasarrufu). */
async function prepareImage(uri: string, width?: number, height?: number) {
  const ctx = ImageManipulator.manipulate(uri);
  const w = width ?? 0;
  const h = height ?? 0;
  if (w === 0 || h === 0 || Math.max(w, h) > MAX_SIDE) {
    ctx.resize(w >= h ? { width: MAX_SIDE } : { height: MAX_SIDE });
  }
  const ref = await ctx.renderAsync();
  const saved = await ref.saveAsync({ format: SaveFormat.JPEG, compress: 0.72, base64: true });
  if (!saved.base64) throw new ApiError('Fotoğraf işlenemedi.');
  return { uri: saved.uri, base64: saved.base64 };
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const DEVICE_KEY = 'device:id:v1';
let deviceId: string | null = null;

/** Bu kuruluma ait rastgele kimlik; sunucuda günlük kullanım sınırı için kullanılır (kişisel veri içermez). */
async function getDeviceId() {
  if (deviceId) return deviceId;
  try {
    deviceId = await AsyncStorage.getItem(DEVICE_KEY);
    if (!deviceId) {
      const hex = () => Math.random().toString(16).slice(2, 10).padEnd(8, '0');
      deviceId = `${hex()}-${hex()}-${hex()}-${hex()}`;
      await AsyncStorage.setItem(DEVICE_KEY, deviceId);
    }
  } catch {
    deviceId = null;
  }
  return deviceId;
}

const UNREACHABLE = 'Bu bağlantıdan sunucuya ulaşılamıyor. Mobil veri sorunu olabilir; lütfen Wi-Fi ile deneyin.';
const BASE_TTL = 10 * 60_000;
let baseCache: { url: string; at: number } | null = null;

/** İlk başarılı olanı döndürür; hepsi başarısızsa null. */
function firstSuccess<T>(tasks: Promise<T | null>[]): Promise<T | null> {
  return new Promise((resolve) => {
    let pending = tasks.length;
    if (!pending) return resolve(null);
    for (const t of tasks)
      t.then((v) => {
        if (v) resolve(v);
        else if (--pending === 0) resolve(null);
      });
  });
}

async function ping(url: string, timeoutMs: number): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${url}/ping`, { signal: controller.signal });
    return res.ok ? url : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Çalışan sunucu adresini seçer: tüm adreslere aynı anda /ping atar, ilk yanıt vereni kullanır ve 10 dk saklar.
 * Hiçbiri 6 sn içinde yanıt vermezse fotoğraf gönderilmeden anlaşılır bir hata verilir.
 */
async function resolveBase(): Promise<string> {
  if (baseCache && Date.now() - baseCache.at < BASE_TTL) return baseCache.url;
  const url = await firstSuccess(API_URLS.map((u) => ping(u, 6_000)));
  if (!url) throw new ApiError(UNREACHABLE, 'unreachable');
  baseCache = { url, at: Date.now() };
  return url;
}

/** Ağ hatasında (bağlantı kurulamadıysa) bir kez daha dener. */
async function request<T>(path: string, init: RequestInit & { timeoutMs?: number } = {}): Promise<T> {
  try {
    return await requestOnce<T>(path, init);
  } catch (e) {
    if (!(e instanceof ApiError) || e.code !== 'network') throw e;
    await wait(1500);
    return requestOnce<T>(path, init);
  }
}

async function requestOnce<T>(path: string, init: RequestInit & { timeoutMs?: number } = {}): Promise<T> {
  if (!API_URLS.length) {
    throw new ApiError(
      'Sunucu adresi ayarlanmamış. app.json içindeki expo.extra.apiUrl alanına Worker adresini yazın.',
      'config',
    );
  }
  const base = await resolveBase();
  const device = await getDeviceId();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), init.timeoutMs ?? 30_000);
  const started = Date.now();
  const sizeKb = typeof init.body === 'string' ? Math.round(init.body.length / 1024) : 0;
  try {
    const res = await fetch(`${base}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-App-Key': APP_KEY,
        ...(device ? { 'X-Device-Id': device } : {}),
        ...(init.headers ?? {}),
      },
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      throw new ApiError(body?.error ?? `Sunucu hatası (${res.status})`, body?.code ?? String(res.status));
    }
    return body as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    baseCache = null; // sonraki istekte sunucu adresi yeniden seçilsin
    // Kendi zaman aşımımız: Expo'nun fetch'i bunu "Fetch request has been canceled" olarak bildirir.
    if (controller.signal.aborted || (e as Error)?.name === 'AbortError') {
      const sec = Math.round((Date.now() - started) / 1000);
      throw new ApiError(
        `Analiz beklenenden uzun sürdü. Lütfen birazdan tekrar deneyin. (Ayrıntı: ${sec} sn içinde yanıt gelmedi${sizeKb ? `, gönderilen ${sizeKb} KB` : ''})`,
        'timeout',
      );
    }
    const detail = (e as Error)?.message ? ` (Ayrıntı: ${(e as Error).message})` : '';
    throw new ApiError(`Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin.${detail}`, 'network');
  } finally {
    clearTimeout(timer);
  }
}

export type AnalyzeInput = {
  uri: string;
  width?: number;
  height?: number;
  note?: string;
};

/** Uygulamanın kalbi: fotoğrafı Worker üzerinden Gemini'ye gönderir ve yapılandırılmış sonucu döndürür. */
export async function analyzeArtifact(input: AnalyzeInput): Promise<{ result: AnalysisResult; processedUri: string }> {
  const image = await prepareImage(input.uri, input.width, input.height);
  const data = await request<{ result: AnalysisResult }>('/analyze', {
    method: 'POST',
    timeoutMs: 70_000,
    body: JSON.stringify({
      image: image.base64,
      mimeType: 'image/jpeg',
      note: input.note?.trim() || undefined,
    }),
  });
  return { result: data.result, processedUri: image.uri };
}

export function fetchNews() {
  return request<{ items: NewsItem[]; updatedAt: string }>('/news', { method: 'GET' });
}

export type ProbeResult = { label: string; ok: boolean; ms: number; detail: string };

/** Adrese GET atar; herhangi bir HTTP yanıtı "ulaşıldı" sayılır (hata kodu olsa bile). Hata fırlatmaz. */
async function reach(label: string, url: string, timeoutMs = 8_000): Promise<ProbeResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = Date.now();
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { 'X-App-Key': APP_KEY } });
    return { label, ok: true, ms: Date.now() - started, detail: `HTTP ${res.status}` };
  } catch (e) {
    return {
      label,
      ok: false,
      ms: Date.now() - started,
      detail: controller.signal.aborted ? `${timeoutMs / 1000} sn içinde yanıt yok` : String((e as Error)?.message ?? e),
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Tek bir yükleme testi: sunucuya N bayt gönderir, süreyi ve sunucunun aldığı boyutu döndürür. */
async function upload(label: string, base: string, bytes: number): Promise<ProbeResult> {
  const device = await getDeviceId();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  const started = Date.now();
  try {
    const res = await fetch(`${base}/echo`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', 'X-App-Key': APP_KEY, ...(device ? { 'X-Device-Id': device } : {}) },
      body: 'x'.repeat(bytes),
    });
    const body = (await res.json().catch(() => null)) as { bytes?: number } | null;
    const ms = Date.now() - started;
    if (!res.ok) return { label, ok: false, ms, detail: `HTTP ${res.status}` };
    return { label, ok: true, ms, detail: `sunucu ${Math.round(Number(body?.bytes ?? 0) / 1024)} KB aldı` };
  } catch (e) {
    return {
      label,
      ok: false,
      ms: Date.now() - started,
      detail: controller.signal.aborted ? '25 sn içinde yanıt gelmedi' : String((e as Error)?.message ?? e),
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Ulaşılabilirlik haritası: engelin sunucuya mı, Cloudflare'e mi, alan adına mı özgü olduğunu ayırır. */
const REACH_TARGETS: [string, string][] = [
  ['Genel internet (google.com)', 'https://www.google.com/generate_204'],
  ['Google Gemini (doğrudan)', 'https://generativelanguage.googleapis.com/'],
  ['GitHub (github.io)', 'https://dronopter-coder.github.io/'],
  ['Cloudflare (cloudflare.com)', 'https://www.cloudflare.com/cdn-cgi/trace'],
  ['workers.dev (alan adı)', 'https://workers.dev/'],
  ['vercel.app', 'https://vercel.app/'],
  ['netlify.app', 'https://netlify.app/'],
  ['run.app (Google Cloud Run)', 'https://run.app/'],
  ['deno.dev', 'https://deno.dev/'],
];

/** Ayarlar → Bağlantı testi: önce tüm adreslere paralel erişim, sonra yükleme yolu ölçülür. */
export async function runDiagnostics(onStep: (r: ProbeResult) => void) {
  const servers = API_URLS.map((u) => reach(`Sunucumuz (${u.replace(/^https?:\/\//, '')})`, `${u}/ping`));
  const others = REACH_TARGETS.map(([label, url]) => reach(label, url));
  const all = [...servers, ...others];
  // Sonuçlar tamamlandıkça gösterilir.
  const done = all.map((p) => p.then((r) => (onStep(r), r)));
  const results = await Promise.all(done);
  const firstOk = API_URLS.find((_, i) => results[i].ok);
  if (!firstOk) return;
  onStep(await upload('Yükleme 100 KB', firstOk, 100 * 1024));
  onStep(await upload('Yükleme 400 KB', firstOk, 400 * 1024));
}
