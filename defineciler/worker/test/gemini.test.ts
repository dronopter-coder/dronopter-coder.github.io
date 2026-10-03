import { describe, expect, it } from 'vitest';

import { HttpError, MOCK_RESULT, normalizeResult, parseAnalyzeRequest } from '../src/gemini';
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
