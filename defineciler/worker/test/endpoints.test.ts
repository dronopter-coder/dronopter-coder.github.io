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

  it('/app-ads.txt AdMob yayıncı kimliğini döndürür', async () => {
    const res = await call('/app-ads.txt');
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/plain');
    expect(await res.text()).toBe('google.com, pub-3204109869365538, DIRECT, f08c47fec0942fa0\n');
  });

  it('ana alan adı tanıtım, gizlilik ve abonelik sayfalarını sunar', async () => {
    const get = (u: string) => worker.fetch(new Request(u), env, ctx);
    const home = await get('https://defineciler.online/');
    expect(home.status).toBe(200);
    expect(home.headers.get('Content-Type')).toContain('text/html');
    const privacy = await get('https://defineciler.online/gizlilik');
    const html = await privacy.text();
    expect(html).toContain('Gizlilik Politikası');
    expect(html).toContain('href="/abonelik"');
    expect(html).not.toContain('icon.png');
    expect(await (await get('https://defineciler.online/abonelik')).text()).toContain('href="/gizlilik"');
    // Uygulamanın kullandığı api. adresinde de sayfalar açılır, kök ise API sağlık kontrolü kalır.
    expect((await get('https://api.defineciler.online/gizlilik')).status).toBe(200);
    expect(await (await get('https://api.defineciler.online/')).json()).toMatchObject({ ok: true });
    const old = await get('https://defineciler.online/privacy.html');
    expect(old.status).toBe(301);
    expect(old.headers.get('Location')).toBe('https://defineciler.online/gizlilik');
    expect((await get('https://defineciler.online/yok')).headers.get('Location')).toBe('https://defineciler.online/');
  });
});
