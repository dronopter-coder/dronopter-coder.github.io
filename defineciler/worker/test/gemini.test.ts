import { describe, expect, it, vi } from 'vitest';

import { analyzeWithGemini, HttpError, MOCK_RESULT, normalizeResult, parseAnalyzeRequest } from '../src/gemini';
import { RESPONSE_SCHEMA } from '../src/schema';

const IMG = 'A'.repeat(200);

describe('parseAnalyzeRequest', () => {
  it('geçerli isteği kabul eder ve notu kırpar', () => {
    const r = parseAnalyzeRequest({ image: IMG, mimeType: 'image/png', note: '  ' + 'x'.repeat(500) });
    expect(r.mimeType).toBe('image/png');
    expect(r.note).toHaveLength(400);
  });

  it('bilinmeyen mime türünü jpeg yapar, boş notu atar', () => {
    const r = parseAnalyzeRequest({ image: IMG, mimeType: 'text/html', note: '   ' });
    expect(r.mimeType).toBe('image/jpeg');
    expect(r.note).toBeUndefined();
  });

  it.each([null, {}, { image: 'kısa' }, { image: '<script>'.repeat(50) }])('hatalı isteği reddeder %#', (body) => {
    expect(() => parseAnalyzeRequest(body)).toThrow(HttpError);
  });
});

describe('normalizeResult', () => {
  it('eksik alanları doldurur ve değerleri sınırlar', () => {
    const r = normalizeResult({ verdict: 'hazine', confidence: 250, features: 'tek madde', authenticity: { assessment: 'x' } });
    expect(r.verdict).toBe('unclear');
    expect(r.confidence).toBe(100);
    expect(r.features).toEqual(['tek madde']);
    expect(r.authenticity).toEqual({ assessment: 'undetermined', notes: [] });
    expect(r.title).toBe('Tanımlanamayan obje');
  });

  it('0-1 aralığındaki güveni yüzdeye çevirir', () => {
    expect(normalizeResult({ confidence: 0.85 }).confidence).toBe(85);
  });

  it('örnek sonuç şemadaki tüm zorunlu alanlara sahip', () => {
    for (const key of RESPONSE_SCHEMA.required) expect(MOCK_RESULT).toHaveProperty(key);
  });
});

describe('analyzeWithGemini', () => {
  const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });
  const geminiBody = (r: unknown) => ({ candidates: [{ content: { parts: [{ text: JSON.stringify(r) }] } }] });

  it('yoğun modelde sıradaki yedek modele geçer', async () => {
    const calls: string[] = [];
    vi.stubGlobal('fetch', async (url: string) => {
      calls.push(url);
      if (url.includes('busy-model')) return new Response('{"error":{"message":"high demand"}}', { status: 503 });
      return ok(geminiBody({ verdict: 'artifact', title: 'Sikke', confidence: 80 }));
    });
    const { result, model } = await analyzeWithGemini({ image: IMG, mimeType: 'image/jpeg' }, 'k', ['busy-model', 'good-model']);
    expect(model).toBe('good-model');
    expect(result.title).toBe('Sikke');
    expect(calls).toHaveLength(2);
    vi.unstubAllGlobals();
  });

  it('tüm modeller yoğunsa 503 busy hatası verir', async () => {
    vi.stubGlobal('fetch', async () => new Response('busy', { status: 503 }));
    await expect(analyzeWithGemini({ image: IMG, mimeType: 'image/jpeg' }, 'k', ['a', 'b'])).rejects.toMatchObject({
      status: 503,
      code: 'busy',
    });
    vi.unstubAllGlobals();
  });

  it('kalıcı istemci hatasında yedeğe geçmeden durur', async () => {
    let n = 0;
    vi.stubGlobal('fetch', async () => {
      n++;
      return new Response('bad image inline data', { status: 400 });
    });
    await expect(analyzeWithGemini({ image: IMG, mimeType: 'image/jpeg' }, 'k', ['a', 'b'])).rejects.toMatchObject({
      code: 'bad_image',
    });
    expect(n).toBe(1);
    vi.unstubAllGlobals();
  });

  it('süre bütçesi dolunca yeni model denemeden 503 döner', async () => {
    const calls: string[] = [];
    vi.stubGlobal('fetch', async (url: string, init: RequestInit) => {
      calls.push(url);
      // Yavaş model: kendisine verilen süre dolana kadar yanıt vermez
      await new Promise((resolve, reject) => {
        const t = setTimeout(resolve, 5_000);
        init.signal?.addEventListener('abort', () => {
          clearTimeout(t);
          reject(new DOMException('timeout', 'TimeoutError'));
        });
      });
      return ok(geminiBody({ title: 'geç' }));
    });
    const started = Date.now();
    await expect(
      analyzeWithGemini({ image: IMG, mimeType: 'image/jpeg' }, 'k', ['slow-a', 'slow-b', 'slow-c'], {
        totalMs: 300,
        perModelMs: 200,
        minAttemptMs: 150,
      }),
    ).rejects.toMatchObject({ status: 503, code: 'busy' });
    expect(Date.now() - started).toBeLessThan(1_000);
    expect(calls).toHaveLength(1);
    vi.unstubAllGlobals();
  });
});
