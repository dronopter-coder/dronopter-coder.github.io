import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import { API_URL, APP_KEY } from '@/constants/config';
import type { AnalysisResult } from '@/types/analysis';

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string = 'error',
  ) {
    super(message);
  }
}

const MAX_SIDE = 1280;

/** Fotoğrafı yapay zekaya göndermeden önce küçültüp JPEG'e çevirir (veri ve hız tasarrufu). */
async function prepareImage(uri: string, width?: number, height?: number) {
  const ctx = ImageManipulator.manipulate(uri);
  const w = width ?? 0;
  const h = height ?? 0;
  if (w === 0 || h === 0 || Math.max(w, h) > MAX_SIDE) {
    ctx.resize(w >= h ? { width: MAX_SIDE } : { height: MAX_SIDE });
  }
  const ref = await ctx.renderAsync();
  const saved = await ref.saveAsync({ format: SaveFormat.JPEG, compress: 0.78, base64: true });
  if (!saved.base64) throw new ApiError('Fotoğraf işlenemedi.');
  return { uri: saved.uri, base64: saved.base64 };
}

async function request<T>(path: string, init: RequestInit & { timeoutMs?: number } = {}): Promise<T> {
  if (!API_URL) {
    throw new ApiError(
      'Sunucu adresi ayarlanmamış. app.json içindeki expo.extra.apiUrl alanına Worker adresini yazın.',
      'config',
    );
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), init.timeoutMs ?? 30_000);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-App-Key': APP_KEY,
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
    if ((e as Error)?.name === 'AbortError') {
      throw new ApiError('İstek zaman aşımına uğradı. İnternet bağlantınızı kontrol edip tekrar deneyin.', 'timeout');
    }
    throw new ApiError('Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin.', 'network');
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
    timeoutMs: 75_000,
    body: JSON.stringify({
      image: image.base64,
      mimeType: 'image/jpeg',
      note: input.note?.trim() || undefined,
    }),
  });
  return { result: data.result, processedUri: image.uri };
}

export type NewsItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  publishedAt: string | null;
  image: string | null;
  summary: string;
};

export function fetchNews() {
  return request<{ items: NewsItem[]; updatedAt: string }>('/news', { method: 'GET' });
}
