import { describe, expect, it } from 'vitest';

import { parseAnalyzeRequest } from '../src/gemini';
import type { KV } from '../src/limits';
import { isProDevice } from '../src/pro';

const memKV = (): KV & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return { data, get: async (k) => data.get(k) ?? null, put: async (k, v) => void data.set(k, v) };
};
const DEVICE = 'abcd1234-abcd1234-abcd1234';
const NOW = Date.parse('2026-10-12T12:00:00Z');
const rc =
  (entitlements: object, ok = true) =>
  async () =>
    new Response(JSON.stringify({ subscriber: { entitlements } }), { status: ok ? 200 : 500 });

describe('Pro doğrulama (RevenueCat)', () => {
  it('süresi dolmamış "pro" yetkisi Pro sayılır ve önbelleğe alınır', async () => {
    const kv = memKV();
    const ok = await isProDevice(DEVICE, 'sk', kv, rc({ pro: { expires_date: '2026-11-01T00:00:00Z' } }), NOW);
    expect(ok).toBe(true);
    expect(kv.data.get(`pro:${DEVICE}`)).toBe('1');
  });

  it('süresi dolmuş veya olmayan yetki Pro sayılmaz', async () => {
    expect(await isProDevice(DEVICE, 'sk', memKV(), rc({ pro: { expires_date: '2026-10-01T00:00:00Z' } }), NOW)).toBe(false);
    expect(await isProDevice(DEVICE, 'sk', memKV(), rc({}), NOW)).toBe(false);
  });

  it('gizli anahtar ya da cihaz yoksa RevenueCat çağrılmaz', async () => {
    let called = false;
    const f = async () => ((called = true), new Response('{}'));
    expect(await isProDevice(undefined, 'sk', memKV(), f)).toBe(false);
    expect(await isProDevice(DEVICE, undefined, memKV(), f)).toBe(false);
    expect(called).toBe(false);
  });

  it('geçici hata önbelleğe alınmaz', async () => {
    const kv = memKV();
    expect(await isProDevice(DEVICE, 'sk', kv, rc({}, false), NOW)).toBe(false);
    expect(kv.data.size).toBe(0);
  });

  it('önbellekteki sonuç kullanılır', async () => {
    const kv = memKV();
    kv.data.set(`pro:${DEVICE}`, '1');
    expect(
      await isProDevice(DEVICE, 'sk', kv, async () => {
        throw new Error('çağrılmamalı');
      }),
    ).toBe(true);
  });
});

describe('analiz isteği: Pro alanları', () => {
  const img = 'A'.repeat(200);
  it('ayrıntılı rapor ve en fazla 2 ek fotoğraf okunur', () => {
    const r = parseAnalyzeRequest({ image: img, detail: true, extraImages: [{ image: img }, { image: img }, { image: img }] });
    expect(r.detail).toBe(true);
    expect(r.extraImages).toHaveLength(2);
  });
  it('alanlar yoksa varsayılan', () => {
    const r = parseAnalyzeRequest({ image: img });
    expect(r.detail).toBe(false);
    expect(r.extraImages).toBeUndefined();
  });
});
