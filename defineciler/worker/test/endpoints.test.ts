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
    const homeHtml = await home.text();
    expect(homeHtml).toContain('Define işaretleri ve tarihi eserler');
    expect(homeHtml).toContain('href="/gizlilik"');
    // Sayfadaki görseller Worker tarafından sunulur.
    const img = await get('https://defineciler.online/site/ekran-ana.webp');
    expect(img.status).toBe(200);
    expect(img.headers.get('Content-Type')).toBe('image/webp');
    expect((await img.arrayBuffer()).byteLength).toBeGreaterThan(1000);
    for (const m of homeHtml.matchAll(/(?:src|href)="(\/site\/[^"]+)"/g)) {
      expect((await get(`https://defineciler.online${m[1]}`)).status, m[1]).toBe(200);
    }
    const privacy = await get('https://defineciler.online/gizlilik');
    const html = await privacy.text();
    expect(html).toContain('Gizlilik Politikası');
    expect(html).toContain('href="/abonelik"');
    expect(html).not.toContain('href="icon.png"');
    expect(await (await get('https://defineciler.online/abonelik')).text()).toContain('href="/gizlilik"');
    // Uygulamanın kullandığı api. adresinde de sayfalar açılır, kök ise API sağlık kontrolü kalır.
    expect((await get('https://api.defineciler.online/gizlilik')).status).toBe(200);
    expect(await (await get('https://api.defineciler.online/')).json()).toMatchObject({ ok: true });
    // Arama motoru dosyaları ve işaret sayfaları
    const robots = await (await get('https://defineciler.online/robots.txt')).text();
    expect(robots).toContain('Sitemap: https://defineciler.online/sitemap.xml');
    const sitemap = await (await get('https://defineciler.online/sitemap.xml')).text();
    expect(sitemap).toContain('<loc>https://defineciler.online/define-isaretleri/yilan</loc>');
    const sign = await get('https://defineciler.online/define-isaretleri/yilan');
    expect(sign.status).toBe(200);
    const signHtml = await sign.text();
    expect(signHtml).toContain('<link rel="canonical" href="https://defineciler.online/define-isaretleri/yilan">');
    expect(signHtml).toContain('define işareti ne anlama gelir');
    expect(signHtml).toContain('application/ld+json');
    expect((await get('https://defineciler.online/define-isaretleri')).status).toBe(200);
    expect((await get('https://defineciler.online/define-isaretleri/')).status).toBe(301);
    expect((await get('https://api.defineciler.online/define-isaretleri/yilan')).headers.get('X-Robots-Tag')).toBe('noindex');
    // Sitemap'teki her adres gerçekten açılır
    for (const m of sitemap.matchAll(/<loc>https:\/\/defineciler\.online([^<]*)<\/loc>/g)) {
      expect((await get(`https://defineciler.online${m[1]}`)).status, m[1]).toBe(200);
    }
    const old = await get('https://defineciler.online/privacy.html');
    expect(old.status).toBe(301);
    expect(old.headers.get('Location')).toBe('https://defineciler.online/gizlilik');
    expect((await get('https://defineciler.online/yok')).headers.get('Location')).toBe('https://defineciler.online/');
  });
});
