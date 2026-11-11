// node:sqlite kullanır; tsconfig (yalnızca Workers türleri) bu dosyayı dışarıda bırakır, vitest çalıştırır.
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

import { beforeEach, describe, expect, it } from 'vitest';

import { flagReason } from '../src/forum/filters';
import worker from '../src/index';

// --- node:sqlite üzerinde küçük bir D1 benzeri ve bellek içi R2 ---
function d1(): D1Database {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../migrations/0001_forum.sql', import.meta.url), 'utf8'));
  const stmt = (sql: string, args: unknown[] = []) => ({
    bind: (...a: unknown[]) => stmt(sql, a),
    first: async () => (db.prepare(sql).get(...(args as never[])) ?? null),
    all: async () => ({ results: db.prepare(sql).all(...(args as never[])) }),
    run: async () => ({ meta: { changes: Number(db.prepare(sql).run(...(args as never[])).changes) } }),
  });
  return {
    prepare: (sql: string) => stmt(sql),
    batch: async (list: { run: () => Promise<unknown> }[]) => { for (const s of list) await s.run(); return []; },
  } as unknown as D1Database;
}
function r2(): R2Bucket {
  const m = new Map<string, { data: Uint8Array; type: string }>();
  return {
    put: async (k: string, v: Uint8Array, o: { httpMetadata: { contentType: string } }) => void m.set(k, { data: v, type: o.httpMetadata.contentType }),
    get: async (k: string) => (m.has(k) ? { body: m.get(k)!.data, httpMetadata: { contentType: m.get(k)!.type } } : null),
    delete: async (ks: string[]) => ks.forEach((k) => m.delete(k)),
  } as unknown as R2Bucket;
}

let env: Parameters<typeof worker.fetch>[1];
const ctx = { waitUntil() {}, passThroughOnException() {} } as unknown as ExecutionContext;
const ORIGIN = 'https://defineciler.online';

/** Çerezleri tutan basit tarayıcı. */
let ipSeq = 0;
function browser() {
  const myIp = `10.0.0.${++ipSeq}`;
  const jar = new Map<string, string>();
  const go = async (path: string, init: RequestInit & { form?: Record<string, string | string[]> } = {}) => {
    const headers = new Headers(init.headers);
    headers.set('Cookie', [...jar].map(([k, v]) => `${k}=${v}`).join('; '));
    headers.set('CF-Connecting-IP', myIp);
    let body = init.body;
    if (init.form) {
      const fd = new FormData();
      for (const [k, v] of Object.entries(init.form)) for (const x of [v].flat()) fd.append(k, x);
      body = fd;
      headers.set('Origin', ORIGIN);
    }
    const res = await worker.fetch(new Request(ORIGIN + path, { method: init.form ? 'POST' : init.method ?? 'GET', headers, body, redirect: 'manual' }), env, ctx);
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(';');
      const [k, v] = kv.split('=');
      if (/Max-Age=0/.test(c)) jar.delete(k); else jar.set(k, v);
    }
    return res;
  };
  const csrf = async (path = '/forum/hesap') => (await (await go(path)).text()).match(/name="csrf" value="([^"]+)"/)?.[1] ?? '';
  return { go, csrf, jar };
}

async function signup(name: string) {
  const b = browser();
  const r = await b.go('/forum/kayit', { form: { username: name, password: 'gizli-sifre-1', rules: '1' } });
  expect(r.status).toBe(303);
  return b;
}

beforeEach(() => {
  env = { FORUM_DB: d1(), FORUM_IMG: r2(), FORUM_ADMINS: 'yonetici' } as typeof env;
});

describe('forum filtreleri', () => {
  it('yer tarifi, iletişim ve alım-satımı yakalar, arkeoloji metnine dokunmaz', () => {
    expect(flagReason('Konum 37.12345, 34.56789 civarı')).toBe('koordinat');
    expect(flagReason('bak https://maps.app.goo.gl/abc')).toBe('harita bağlantısı');
    expect(flagReason('beni 0532 123 45 67 den ara')).toBe('telefon numarası');
    expect(flagReason('Bu sikke SATILIK mı acaba')).toBe('alım-satım');
    expect(flagReason('Fiyatı ne olur?')).toBe('değer biçme');
    expect(flagReason('500 TL veririm')).toBe('fiyat');
    expect(flagReason('Hitit dönemi MÖ 1.650, Roma dönemi MS 1.200 civarı; ağırlığı 17,2 gram.')).toBeNull();
  });
});

describe('forum akışı', () => {
  it('kayıt → konu (onay bekler) → yönetici onaylar → cevap → oy → kabul', async () => {
    const ali = await signup('ali_kaya');
    let csrf = await ali.csrf('/forum/yeni');
    let r = await ali.go('/forum/yeni', { form: { csrf, k: 'eser-tanima', title: 'Bu sikke hangi döneme ait?', body: 'Bronz, yaklaşık 2 cm, ön yüzde bir portre var.' } });
    expect(r.status).toBe(303);
    const url = r.headers.get('Location')!;
    expect(url).toMatch(/^\/forum\/konu\/1-bu-sikke-hangi-doneme-ait$/);

    // Yeni üyenin konusu herkese görünmez, sahibine "onay bekliyor" görünür.
    expect((await browser().go(url)).status).toBe(404);
    expect(await (await ali.go(url)).text()).toContain('Onay bekliyor');

    const admin = await signup('yonetici');
    expect(await (await admin.go('/forum/yonetim')).text()).toContain('Bu sikke hangi döneme ait?');
    csrf = await admin.csrf('/forum/yonetim');
    r = await admin.go('/forum/yonetim', { form: { csrf, act: 'approve', id: '1' } });
    expect(r.status).toBe(303);
    const pub = await (await browser().go(url)).text();
    expect(pub).toContain('Bu sikke hangi döneme ait?');
    expect(pub).toContain('"@type":"QAPage"');

    // Yöneticinin cevabı doğrudan yayımlanır.
    csrf = await admin.csrf(url);
    r = await admin.go('/forum/konu/1/cevap', { form: { csrf, body: 'Portre ve boyuta göre geç Roma dönemi bir bronz olabilir.' } });
    expect(r.status).toBe(303);
    expect(await (await browser().go(url)).text()).toContain('geç Roma dönemi');

    csrf = await ali.csrf(url);
    await ali.go('/forum/gonderi/2/faydali', { form: { csrf } });
    await ali.go('/forum/konu/1/kabul/2', { form: { csrf } });
    const after = await (await browser().go(url)).text();
    expect(after).toContain('En iyi cevap');
    expect(after).toContain('"acceptedAnswer"');
  });

  it('filtreye takılan gönderi onaya düşer; 3 şikâyet gönderiyi gizler', async () => {
    const admin = await signup('yonetici');
    let csrf = await admin.csrf('/forum/yeni');
    await admin.go('/forum/yeni', { form: { csrf, k: 'tarih', title: 'Hitit başkenti hakkında', body: 'Hattuşa hakkında konuşalım, bildiklerinizi yazın.' } });
    const url = '/forum/konu/1-hitit-baskenti-hakkinda';
    const u1 = await signup('uye1');
    csrf = await u1.csrf(url);
    await u1.go('/forum/konu/1/cevap', { form: { csrf, body: 'Detay için beni whatsapp üzerinden yazın.' } });
    expect(await (await admin.go('/forum/yonetim')).text()).toContain('Filtre: iletişim uygulaması');
    expect(await (await browser().go(url)).text()).not.toContain('whatsapp');

    // Yöneticinin cevabını 3 üye şikâyet eder → gizlenir.
    csrf = await admin.csrf(url);
    await admin.go('/forum/konu/1/cevap', { form: { csrf, body: 'Hattuşa Çorum Boğazkale’dedir.' } });
    for (const n of ['sikayet1', 'sikayet2', 'sikayet3']) {
      const b = await signup(n);
      await b.go('/forum/gonderi/3/sikayet', { form: { csrf: await b.csrf(url), reason: 'Diğer' } });
    }
    expect(await (await browser().go(url)).text()).not.toContain('Boğazkale');
  });

  it('aynı bağlantıdan günde en fazla 3 kayıt', async () => {
    const b = browser();
    for (const n of ['kayit1', 'kayit2', 'kayit3']) expect((await b.go('/forum/kayit', { form: { username: n, password: 'gizli-sifre-1', rules: '1' } })).status).toBe(303);
    expect(await (await b.go('/forum/kayit', { form: { username: 'kayit4', password: 'gizli-sifre-1', rules: '1' } })).text()).toContain('çok fazla kayıt');
  });

  it('CSRF ve köken kontrolü, yanlış şifre, hız sınırı', async () => {
    const b = await signup('deneme1');
    const r = await b.go('/forum/yeni', { form: { csrf: 'yanlis', k: 'tarih', title: 'Geçerli bir başlık', body: 'x'.repeat(30) } });
    expect(r.status).toBe(403);
    const x = browser();
    expect(await (await x.go('/forum/giris', { form: { username: 'deneme1', password: 'yanlis-sifre' } })).text()).toContain('hatalı');
    // Yeni üye günde en fazla 3 konu açabilir.
    const csrf = await b.csrf('/forum/yeni');
    for (let i = 0; i < 3; i++) await b.go('/forum/yeni', { form: { csrf, k: 'tarih', title: `Deneme başlığı ${i} uzun`, body: 'y'.repeat(30) } });
    expect(await (await b.go('/forum/yeni', { form: { csrf, k: 'tarih', title: 'Dördüncü başlık deneme', body: 'z'.repeat(30) } })).text()).toContain('sınırına');
  });

  it('fotoğraf: EXIF reddedilir, WebP kabul edilir, onaysız gönderide yalnızca sahibi görür; hesap silme her şeyi siler', async () => {
    const b = await signup('fotocu');
    const csrf = await b.csrf('/forum/yeni');
    const up = (data: Uint8Array, type: string) =>
      b.go('/forum/yukle', { method: 'POST', body: data, headers: { 'Content-Type': type, 'X-CSRF': csrf, Origin: ORIGIN } });
    const jpegExif = new Uint8Array([0xff, 0xd8, 0xff, 0xe1, 0, 16, ...new TextEncoder().encode('Exif\0\0'), ...new Array(200).fill(0)]);
    expect((await up(jpegExif, 'image/jpeg')).status).toBe(422);
    const webp = new Uint8Array([...new TextEncoder().encode('RIFF'), 0, 0, 0, 0, ...new TextEncoder().encode('WEBPVP8 '), ...new Array(200).fill(1)]);
    const res = await up(webp, 'image/webp');
    expect(res.status).toBe(200);
    const { key } = (await res.json()) as { key: string };
    await b.go('/forum/yeni', { form: { csrf, k: 'eser-tanima', title: 'Fotoğraflı bir soru başlığı', body: 'Fotoğraftaki kandil hangi döneme ait?', img: key } });
    expect((await b.go(`/forum/img/${key}`)).status).toBe(200);
    expect((await browser().go(`/forum/img/${key}`)).status).toBe(404);

    const c2 = await b.csrf('/forum/hesap');
    expect((await b.go('/forum/hesap', { form: { csrf: c2, act: 'delete', sure: '1' } })).status).toBe(303);
    const admin = await signup('yonetici');
    expect(await (await admin.go('/forum/yonetim')).text()).not.toContain('Fotoğraflı bir soru');
    expect((await admin.go(`/forum/img/${key}`)).status).toBe(404);
  });

  it('veritabanı yoksa forum "yakında" gösterir; kurallar sayfası ve robots', async () => {
    const res = await worker.fetch(new Request(`${ORIGIN}/forum`), {} as typeof env, ctx);
    expect(res.status).toBe(503);
    expect(await res.text()).toContain('Forum çok yakında');
    const rules = await worker.fetch(new Request(`${ORIGIN}/forum/kurallar`), env, ctx);
    expect(rules.status).toBe(200);
    expect(await rules.text()).toContain('5651');
    expect(await (await worker.fetch(new Request(`${ORIGIN}/robots.txt`), env, ctx)).text()).toContain('/forum/sitemap.xml');
  });
});
