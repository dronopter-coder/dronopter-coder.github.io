import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import { API_URL, APP_KEY } from '@/constants/config';
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
  if (!API_URL) {
    throw new ApiError(
      'Sunucu adresi ayarlanmamış. app.json içindeki expo.extra.apiUrl alanına Worker adresini yazın.',
      'config',
    );
  }
  const device = await getDeviceId();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), init.timeoutMs ?? 30_000);
  try {
    const res = await fetch(`${API_URL}${path}`, {
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
    // Kendi zaman aşımımız: Expo'nun fetch'i bunu "Fetch request has been canceled" olarak bildirir.
    if (controller.signal.aborted || (e as Error)?.name === 'AbortError') {
      throw new ApiError('Analiz beklenenden uzun sürdü. Lütfen birazdan tekrar deneyin.', 'timeout');
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
