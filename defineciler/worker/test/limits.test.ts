import { describe, expect, it } from 'vitest';

import {
  assertWithinLimits,
  fingerprint,
  getCachedResult,
  parseDeviceId,
  putCachedResult,
  recordUsage,
  type KV,
} from '../src/limits';

const fakeKv = (): KV & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return {
    data,
    get: async (k) => data.get(k) ?? null,
    put: async (k, v) => void data.set(k, v),
  };
};

const limits = { perDevice: 2, perIp: 5, global: 6 };
const day = new Date('2026-10-09T10:00:00Z');
const nextDay = new Date('2026-10-10T00:30:00Z');

describe('günlük sınırlar', () => {
  it('cihaz sınırı dolunca 429 verir, başka cihaz etkilenmez', async () => {
    const kv = fakeKv();
    const a = { ip: '1.1.1.1', device: 'aaaaaaaaaaaaaaaa' };
    const b = { ip: '1.1.1.1', device: 'bbbbbbbbbbbbbbbb' };
    await assertWithinLimits(kv, a, limits, day);
    await recordUsage(kv, a, day);
    await recordUsage(kv, a, day);
    await expect(assertWithinLimits(kv, a, limits, day)).rejects.toMatchObject({ status: 429, code: 'daily_limit' });
    await expect(assertWithinLimits(kv, b, limits, day)).resolves.toBeUndefined();
  });

  it('IP sınırı cihaz kimliği olmayan istekleri de kapsar', async () => {
    const kv = fakeKv();
    const who = { ip: '2.2.2.2' };
    for (let i = 0; i < 5; i++) await recordUsage(kv, who, day);
    await expect(assertWithinLimits(kv, who, limits, day)).rejects.toMatchObject({ code: 'daily_limit' });
  });

  it('toplam günlük sınır dolunca 503 busy_today verir', async () => {
    const kv = fakeKv();
    for (let i = 0; i < 6; i++) await recordUsage(kv, { ip: `3.3.3.${i}`, device: `dev-${String(i).padStart(16, '0')}` }, day);
    await expect(assertWithinLimits(kv, { ip: '9.9.9.9' }, limits, day)).rejects.toMatchObject({
      status: 503,
      code: 'busy_today',
    });
  });

  it('sayaçlar ertesi gün sıfırlanır', async () => {
    const kv = fakeKv();
    const who = { ip: '4.4.4.4', device: 'cccccccccccccccc' };
    await recordUsage(kv, who, day);
    await recordUsage(kv, who, day);
    await expect(assertWithinLimits(kv, who, limits, day)).rejects.toBeDefined();
    await expect(assertWithinLimits(kv, who, limits, nextDay)).resolves.toBeUndefined();
  });

  it('cihaz kimliği biçimi doğrulanır', () => {
    expect(parseDeviceId('3f2a9c1e-7b44-4d0a-9d2e-1c5b8a7f6e10')).toBeDefined();
    expect(parseDeviceId('kısa')).toBeUndefined();
    expect(parseDeviceId('a'.repeat(200))).toBeUndefined();
    expect(parseDeviceId(null)).toBeUndefined();
  });
});

describe('sonuç önbelleği', () => {
  it('aynı fotoğraf ve not aynı parmak izini, farklı not farklı parmak izini verir', async () => {
    const a = await fingerprint('AAAA'.repeat(50), 'not');
    expect(a).toHaveLength(32);
    expect(await fingerprint('AAAA'.repeat(50), 'not')).toBe(a);
    expect(await fingerprint('AAAA'.repeat(50), 'başka')).not.toBe(a);
    expect(await fingerprint('BBBB'.repeat(50), 'not')).not.toBe(a);
  });

  it('kaydedilen sonuç geri okunur; yoksa null döner', async () => {
    const kv = fakeKv();
    expect(await getCachedResult(kv, 'abc')).toBeNull();
    await putCachedResult(kv, 'abc', { title: 'Sikke' });
    expect(await getCachedResult(kv, 'abc')).toEqual({ title: 'Sikke' });
  });
});
