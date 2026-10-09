import { describe, expect, it } from 'vitest';

import worker from '../src/index';

const env = {} as Parameters<typeof worker.fetch>[1];
const ctx = { waitUntil() {}, passThroughOnException() {} } as unknown as ExecutionContext;
const call = (path: string, init?: RequestInit) => worker.fetch(new Request(`https://x.dev${path}`, init), env, ctx);

describe('bağlantı testi uç noktaları', () => {
  it('/ping sunucu saatini döndürür', async () => {
    const res = await call('/ping');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; time: string };
    expect(body.ok).toBe(true);
    expect(Date.parse(body.time)).not.toBeNaN();
  });

  it('/echo gövdenin bayt sayısını döndürür', async () => {
    const res = await call('/echo', { method: 'POST', body: 'x'.repeat(100_000) });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, bytes: 100_000 });
  });

  it('/echo çok büyük gövdeyi reddeder', async () => {
    const res = await call('/echo', {
      method: 'POST',
      body: 'x',
      headers: { 'Content-Length': String(3 * 1024 * 1024) },
    });
    expect(res.status).toBe(413);
  });
});
