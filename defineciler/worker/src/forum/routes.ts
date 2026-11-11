// Forum istek yönlendirmesi ve iş kuralları (onay akışı, şikâyet, hız sınırı, fotoğraf, yönetim).
import {
  COOKIE, cookie, createSession, getSession, googleCallback, googleEnabled, googleStart, hashPassword, isAdmin,
  randomToken, sameOrigin, sha256, verifyPassword, verifyTurnstile, type Session,
} from './auth';
import { flagReason } from './filters';
import {
  banner, bar, catLabel, esc, fotoField, layout, pics, postCard, qaJsonLd, sideBox, topicRow, topicUrl, turnstile,
  turnstileHead, uploaderScript, wrap,
} from './render';
import { CATEGORIES, type ForumEnv, type Post, type Topic, type User } from './types';

const APPROVALS_NEEDED = 3; // Yeni üyenin ilk 3 gönderisi onaya düşer
const REPORTS_TO_HIDE = 3;
const PAGE = 20;
const LIMITS = { newbie: { topic: 3, post: 20 }, member: { topic: 10, post: 60 }, register: 3 };

type Ctx = { req: Request; env: ForumEnv; url: URL; s: Session | null; db: D1Database };

const html = (body: string, status = 200, headers: Record<string, string> = {}) =>
  new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', ...headers } });
const redirect = (to: string, setCookie?: string | string[]) => {
  const h = new Headers({ Location: to, 'Cache-Control': 'no-store' });
  for (const c of [setCookie ?? []].flat()) h.append('Set-Cookie', c);
  return new Response(null, { status: 303, headers: h });
};
const jsonRes = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
const today = () => new Date().toISOString().slice(0, 10);
const slugify = (s: string) =>
  s.toLocaleLowerCase('tr-TR').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70) || 'konu';
const ip = (req: Request) => req.headers.get('CF-Connecting-IP') ?? '0.0.0.0';

/** Günlük sayaç; sınırı aşarsa false döner. */
async function bump(db: D1Database, key: string, max: number): Promise<boolean> {
  const day = today();
  const row = await db.prepare('SELECT n, day FROM counters WHERE key = ?').bind(key).first<{ n: number; day: string }>();
  const n = row && row.day === day ? row.n : 0;
  if (n >= max) return false;
  await db.prepare('INSERT INTO counters (key, n, day) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET n = excluded.n, day = excluded.day')
    .bind(key, n + 1, day).run();
  return true;
}

async function pendingCount(c: Ctx) {
  if (c.s?.user.role !== 'admin') return 0;
  const a = await c.db.prepare("SELECT COUNT(*) AS n FROM posts WHERE status = 'pending'").first<{ n: number }>();
  const b = await c.db.prepare('SELECT COUNT(DISTINCT post_id) AS n FROM reports WHERE resolved = 0').first<{ n: number }>();
  return (a?.n ?? 0) + (b?.n ?? 0);
}

async function page(c: Ctx, o: { title: string; desc: string; path?: string; robots?: string; head?: string; active?: string } & Omit<Parameters<typeof wrap>[0], 'bar'>) {
  const body = wrap({ ...o, bar: bar(c.s, await pendingCount(c), o.active) });
  return html(layout({ title: o.title, desc: o.desc, path: o.path ?? c.url.pathname, robots: o.robots, head: o.head, body }));
}

const form = async (req: Request) => (await req.formData()) as unknown as { get(k: string): string | null; getAll(k: string): string[] };

/** Oturum gerektiren ve durum değiştiren istekler için CSRF + köken kontrolü. */
async function guard(c: Ctx): Promise<Response | { f: Awaited<ReturnType<typeof form>>; s: Session }> {
  if (!c.s) return redirect(`/forum/giris?d=${encodeURIComponent(c.url.pathname)}`);
  if (!sameOrigin(c.req)) return html('İstek reddedildi.', 403);
  const f = await form(c.req);
  if (f.get('csrf') !== c.s.csrf) return html('Oturum doğrulanamadı. Sayfayı yenileyip tekrar deneyin.', 403);
  return { f, s: c.s };
}

// ---------- listeler ----------
const topicSelect = `SELECT t.*, u.username, u.display_name FROM topics t JOIN users u ON u.id = t.user_id`;
const visible = (c: Ctx) =>
  c.s?.user.role === 'admin' ? "t.status != 'hidden'" : c.s ? `(t.status = 'published' OR t.user_id = ${c.s.user.id})` : "t.status = 'published'";

async function home(c: Ctx) {
  const latest = (await c.db.prepare(`${topicSelect} WHERE ${visible(c)} ORDER BY t.last_post_at DESC LIMIT 15`).all<Topic>()).results;
  const open = (await c.db.prepare(`${topicSelect} WHERE t.status = 'published' AND t.reply_count = 0 ORDER BY t.created_at DESC LIMIT 5`).all<Topic>()).results;
  const counts = (await c.db.prepare("SELECT category, COUNT(*) AS n FROM topics WHERE status = 'published' GROUP BY category").all<{ category: string; n: number }>()).results;
  const n = (id: string) => counts.find((x) => x.category === id)?.n ?? 0;
  return page(c, {
    title: 'Defineciler Forum: eser tanıma, define işaretleri ve tarih soru-cevap', active: 'forum',
    desc: 'Sikke ve eser tanıma, define işaretlerinin anlamları, Anadolu tarihi, müzeler ve yasal süreç üzerine soru-cevap forumu.',
    h1: 'Defineciler Forum', lead: 'Eserler, sikkeler, define işaretleri ve Anadolu tarihi üzerine soru sorun, cevap verin. Yer tarifi ve alım-satım yoktur; bilgi paylaşımı vardır.',
    content: `<h2 style="margin-top:0">Kategoriler</h2><div class="cards">${CATEGORIES.map((k) => `<a class="feat" href="/forum/k/${k.id}"><h3>${esc(k.label)}</h3><p>${esc(k.desc)}</p><span class="more">${n(k.id)} konu →</span></a>`).join('')}</div>
${banner(0)}
<h2>Son konular</h2>${latest.length ? latest.map(topicRow).join('') : '<div class="card"><p>Henüz konu yok. <a href="/forum/yeni">İlk soruyu siz sorun →</a></p></div>'}
${open.length ? `<h2>Cevap bekleyen sorular</h2>${open.map(topicRow).join('')}` : ''}`,
    side: sideBox(),
  });
}

async function category(c: Ctx, id: string) {
  const cat = CATEGORIES.find((k) => k.id === id);
  if (!cat) return notFound(c);
  const p = Math.max(1, Number(c.url.searchParams.get('s')) || 1);
  const rows = (await c.db.prepare(`${topicSelect} WHERE t.category = ? AND ${visible(c)} ORDER BY t.last_post_at DESC LIMIT ? OFFSET ?`)
    .bind(id, PAGE + 1, (p - 1) * PAGE).all<Topic>()).results;
  const list = rows.slice(0, PAGE).map((t, i) => topicRow(t) + ((i + 1) % 8 === 0 ? banner(i) : '')).join('');
  return page(c, {
    title: `${cat.label} | Defineciler Forum`, desc: cat.desc, crumbs: [[cat.label]], h1: cat.label, lead: cat.desc,
    robots: rows.length ? undefined : 'noindex, follow',
    content: `<p><a class="btn" href="/forum/yeni?k=${id}">＋ Bu kategoride soru sor</a></p>${list || '<div class="card"><p>Bu kategoride henüz konu yok.</p></div>'}
<div class="pager">${p > 1 ? `<a class="pill" href="?s=${p - 1}">← Önceki</a>` : ''}${rows.length > PAGE ? `<a class="pill" href="?s=${p + 1}">Sonraki →</a>` : ''}</div>`,
    side: sideBox(),
  });
}

async function imagesFor(c: Ctx, postIds: number[]) {
  if (!postIds.length) return new Map<number, string[]>();
  const rows = (await c.db.prepare(`SELECT key, post_id FROM images WHERE post_id IN (${postIds.map(() => '?').join(',')}) ORDER BY created_at`)
    .bind(...postIds).all<{ key: string; post_id: number }>()).results;
  const m = new Map<number, string[]>();
  for (const r of rows) m.set(r.post_id, [...(m.get(r.post_id) ?? []), r.key]);
  return m;
}

async function topic(c: Ctx, id: number) {
  const t = await c.db.prepare(`${topicSelect} WHERE t.id = ?`).bind(id).first<Topic>();
  const admin = c.s?.user.role === 'admin';
  if (!t || (t.status === 'hidden' && !admin) || (t.status === 'pending' && !admin && c.s?.user.id !== t.user_id)) return notFound(c);
  if (c.url.pathname !== topicUrl(t)) return redirect(topicUrl(t));
  const all = (await c.db.prepare(`SELECT p.*, u.username, u.display_name FROM posts p JOIN users u ON u.id = p.user_id WHERE p.topic_id = ? ORDER BY p.is_first DESC, p.created_at LIMIT 300`)
    .bind(id).all<Post>()).results;
  const shown = all.filter((p) => p.status === 'published' || admin || (p.status === 'pending' && p.user_id === c.s?.user.id));
  const first = shown.find((p) => p.is_first) ?? all.find((p) => p.is_first);
  if (!first) return notFound(c);
  const answers = shown.filter((p) => !p.is_first).sort((a, b) => (a.id === t.accepted_post_id ? -1 : b.id === t.accepted_post_id ? 1 : 0));
  const imgs = await imagesFor(c, shown.map((p) => p.id));
  c.req.method === 'GET' && t.status === 'published' && (await c.db.prepare('UPDATE topics SET views = views + 1 WHERE id = ?').bind(id).run());
  const card = (p: Post) => postCard(p, { s: c.s, acceptedId: t.accepted_post_id, ownerId: t.user_id, images: imgs.get(p.id) ?? [], topicId: t.id });
  const replyForm = c.s
    ? `<h2>Cevap yazın</h2><form class="form" method="post" action="/forum/konu/${t.id}/cevap"><input type="hidden" name="csrf" value="${c.s.csrf}">
<textarea name="body" required minlength="10" maxlength="8000" placeholder="Bildiklerinizi paylaşın. Yer tarifi, fiyat ya da iletişim bilgisi yazmayın."></textarea>
${fotoField(Boolean(c.env.FORUM_IMG))}<button class="btn">Cevabı gönder</button></form>${c.env.FORUM_IMG ? uploaderScript(c.s.csrf) : ''}`
    : `<div class="card"><p>Cevap yazmak için <a href="/forum/giris?d=${encodeURIComponent(topicUrl(t))}">giriş yapın</a> ya da <a href="/forum/kayit">üye olun</a>.</p></div>`;
  return page(c, {
    title: `${t.title} | Defineciler Forum`, desc: first.body.replace(/\s+/g, ' ').slice(0, 155),
    robots: t.status === 'published' ? undefined : 'noindex, nofollow',
    head: t.status === 'published' ? qaJsonLd(t, first, answers.filter((a) => a.status === 'published'), t.accepted_post_id) : '',
    crumbs: [[catLabel(t.category), `/forum/k/${t.category}`], [t.title]], h1: t.title,
    content: `${card(first)}
<div class="note"><b>Elinizdeki eseri tanımak mı istiyorsunuz?</b> Fotoğrafını çekin; <a href="https://play.google.com/store/apps/details?id=online.defineciler.app&utm_source=forum&utm_medium=topic">Defineciler uygulaması</a> dönemini ve uygarlığını değerlendirsin.</div>
<h2>${answers.length} cevap</h2>${answers.map((p, i) => card(p) + (i === 0 || (i + 1) % 5 === 0 ? banner(i + 1) : '')).join('')}
${replyForm}`,
    side: sideBox(),
  });
}

async function member(c: Ctx, name: string) {
  const u = await c.db.prepare('SELECT * FROM users WHERE username = ?').bind(name).first<User>();
  if (!u) return notFound(c);
  const topics = (await c.db.prepare(`${topicSelect} WHERE t.user_id = ? AND t.status = 'published' ORDER BY t.created_at DESC LIMIT 30`).bind(u.id).all<Topic>()).results;
  const stats = await c.db.prepare("SELECT COUNT(*) AS n, COALESCE(SUM(helpful),0) AS h FROM posts WHERE user_id = ? AND status = 'published'").bind(u.id).first<{ n: number; h: number }>();
  return page(c, {
    title: `${u.display_name} | Defineciler Forum`, desc: `${u.display_name} adlı üyenin forum konuları.`, robots: 'noindex, follow', active: 'uye',
    crumbs: [[u.display_name]], h1: u.display_name,
    lead: `@${u.username} · ${new Date(u.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })} tarihinden beri üye · ${stats?.n ?? 0} gönderi · ${stats?.h ?? 0} faydalı oy`,
    content: topics.length ? topics.map(topicRow).join('') : '<div class="card"><p>Henüz yayımlanmış konu yok.</p></div>',
  });
}

// ---------- konu açma, cevap, oy, şikâyet ----------
async function attachImages(c: Ctx, userId: number, postId: number, keys: string[]) {
  for (const k of keys.slice(0, 4)) {
    if (!/^[A-Za-z0-9_-]{20,40}$/.test(k)) continue;
    await c.db.prepare('UPDATE images SET post_id = ? WHERE key = ? AND user_id = ? AND post_id IS NULL').bind(postId, k, userId).run();
  }
}

/** Gönderinin yayın durumuna karar verir: yönetici → yayında; yeni üye ya da filtre eşleşmesi → onay bekler. */
function decide(u: User, text: string): { status: 'published' | 'pending'; reason: string | null } {
  if (u.role === 'admin') return { status: 'published', reason: null };
  const reason = flagReason(text);
  if (reason) return { status: 'pending', reason };
  return { status: u.approved_posts < APPROVALS_NEEDED ? 'pending' : 'published', reason: null };
}

async function newTopicForm(c: Ctx, err = '', v: { k?: string; title?: string; body?: string } = {}) {
  if (!c.s) return redirect('/forum/giris?d=/forum/yeni');
  const k = v.k ?? c.url.searchParams.get('k') ?? '';
  return page(c, {
    title: 'Yeni soru | Defineciler Forum', desc: 'Forumda yeni konu açın.', robots: 'noindex', active: 'yeni', crumbs: [['Yeni soru']], h1: 'Yeni soru sor',
    head: turnstileHead(c.env.TURNSTILE_SITE_KEY),
    content: `${err ? `<div class="err">${esc(err)}</div>` : ''}
${c.s.user.approved_posts < APPROVALS_NEEDED && c.s.user.role !== 'admin' ? `<div class="note">Yeni üyelerin ilk ${APPROVALS_NEEDED} gönderisi yönetici onayından sonra yayımlanır. Onay genellikle aynı gün içinde verilir.</div>` : ''}
<form class="form" method="post" action="/forum/yeni"><input type="hidden" name="csrf" value="${c.s.csrf}">
<label for="k">Kategori</label><select id="k" name="k" required>${CATEGORIES.map((x) => `<option value="${x.id}"${x.id === k ? ' selected' : ''}>${esc(x.label)}</option>`).join('')}</select>
<label for="t">Başlık</label><input type="text" id="t" name="title" required minlength="10" maxlength="140" value="${esc(v.title)}" placeholder="Örn. Bu sikke hangi döneme ait olabilir?">
<label for="b">Sorunuz</label><textarea id="b" name="body" required minlength="20" maxlength="8000" placeholder="Eserin boyutu, malzemesi, üzerindeki yazı ya da figürler… Yer tarifi, fiyat ya da iletişim bilgisi yazmayın.">${esc(v.body)}</textarea>
${fotoField(Boolean(c.env.FORUM_IMG))}
${turnstile(c.env.TURNSTILE_SITE_KEY)}
<p class="hint">Göndererek <a href="/forum/kurallar">forum kurallarına</a> uymayı kabul edersiniz.</p>
<button class="btn">Soruyu gönder</button></form>${c.env.FORUM_IMG ? uploaderScript(c.s.csrf) : ''}`,
  });
}

async function createTopic(c: Ctx) {
  const g = await guard(c);
  if (g instanceof Response) return g;
  const { f, s } = g;
  const k = f.get('k') ?? '', title = (f.get('title') ?? '').trim(), body = (f.get('body') ?? '').trim();
  const back = (e: string) => newTopicForm(c, e, { k, title, body });
  if (!CATEGORIES.some((x) => x.id === k)) return back('Kategori seçin.');
  if (title.length < 10 || title.length > 140) return back('Başlık 10–140 karakter olmalı.');
  if (body.length < 20 || body.length > 8000) return back('Soru metni 20–8000 karakter olmalı.');
  if (f.get('website')) return back('Gönderilemedi.');
  if (!(await verifyTurnstile(c.env, f.get('cf-turnstile-response'), ip(c.req)))) return back('Robot doğrulaması başarısız. Tekrar deneyin.');
  const lim = s.user.approved_posts < APPROVALS_NEEDED ? LIMITS.newbie : LIMITS.member;
  if (s.user.role !== 'admin' && !(await bump(c.db, `topic:${s.user.id}`, lim.topic))) return back('Bugünkü konu açma sınırına ulaştınız. Yarın tekrar deneyin.');
  const d = decide(s.user, `${title}\n${body}`);
  const now = Date.now();
  const t = await c.db.prepare('INSERT INTO topics (category, user_id, title, slug, status, created_at, last_post_at) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id')
    .bind(k, s.user.id, title, slugify(title), d.status, now, now).first<{ id: number }>();
  const p = await c.db.prepare('INSERT INTO posts (topic_id, user_id, is_first, body, status, flag_reason, created_at) VALUES (?, ?, 1, ?, ?, ?, ?) RETURNING id')
    .bind(t!.id, s.user.id, body, d.status, d.reason, now).first<{ id: number }>();
  await attachImages(c, s.user.id, p!.id, f.getAll('img'));
  return redirect(`/forum/konu/${t!.id}-${slugify(title)}`);
}

async function reply(c: Ctx, topicId: number) {
  const g = await guard(c);
  if (g instanceof Response) return g;
  const { f, s } = g;
  const t = await c.db.prepare('SELECT * FROM topics WHERE id = ?').bind(topicId).first<Topic>();
  if (!t || t.status === 'hidden') return notFound(c);
  const body = (f.get('body') ?? '').trim();
  if (body.length < 10 || body.length > 8000) return redirect(topicUrl(t));
  const lim = s.user.approved_posts < APPROVALS_NEEDED ? LIMITS.newbie : LIMITS.member;
  if (s.user.role !== 'admin' && !(await bump(c.db, `post:${s.user.id}`, lim.post))) return html('Bugünkü cevap sınırına ulaştınız.', 429);
  const d = decide(s.user, body);
  const now = Date.now();
  const p = await c.db.prepare('INSERT INTO posts (topic_id, user_id, is_first, body, status, flag_reason, created_at) VALUES (?, ?, 0, ?, ?, ?, ?) RETURNING id')
    .bind(topicId, s.user.id, body, d.status, d.reason, now).first<{ id: number }>();
  await attachImages(c, s.user.id, p!.id, f.getAll('img'));
  if (d.status === 'published') await c.db.prepare('UPDATE topics SET reply_count = reply_count + 1, last_post_at = ? WHERE id = ?').bind(now, topicId).run();
  return redirect(`${topicUrl(t)}#g${p!.id}`);
}

async function postAction(c: Ctx, postId: number, action: 'faydali' | 'sikayet') {
  const g = await guard(c);
  if (g instanceof Response) return g;
  const { f, s } = g;
  const p = await c.db.prepare("SELECT p.*, t.slug FROM posts p JOIN topics t ON t.id = p.topic_id WHERE p.id = ? AND p.status = 'published'")
    .bind(postId).first<Post & { slug: string }>();
  if (!p || p.user_id === s.user.id) return notFound(c);
  if (action === 'faydali') {
    const r = await c.db.prepare('INSERT OR IGNORE INTO votes (post_id, user_id) VALUES (?, ?)').bind(postId, s.user.id).run();
    if (r.meta.changes) await c.db.prepare('UPDATE posts SET helpful = helpful + 1 WHERE id = ?').bind(postId).run();
  } else {
    await c.db.prepare('INSERT OR IGNORE INTO reports (post_id, user_id, reason, created_at) VALUES (?, ?, ?, ?)')
      .bind(postId, s.user.id, (f.get('reason') ?? 'Diğer').slice(0, 60), Date.now()).run();
    const n = await c.db.prepare('SELECT COUNT(*) AS n FROM reports WHERE post_id = ? AND resolved = 0').bind(postId).first<{ n: number }>();
    if ((n?.n ?? 0) >= REPORTS_TO_HIDE) await setStatus(c, postId, 'hidden');
  }
  return redirect(`/forum/konu/${p.topic_id}-${p.slug}#g${postId}`);
}

async function accept(c: Ctx, topicId: number, postId: number) {
  const g = await guard(c);
  if (g instanceof Response) return g;
  const t = await c.db.prepare('SELECT * FROM topics WHERE id = ?').bind(topicId).first<Topic>();
  if (!t || t.user_id !== g.s.user.id) return notFound(c);
  await c.db.prepare("UPDATE topics SET accepted_post_id = ? WHERE id = ? AND EXISTS (SELECT 1 FROM posts WHERE id = ? AND topic_id = ? AND status = 'published' AND is_first = 0)")
    .bind(postId, topicId, postId, topicId).run();
  return redirect(`${topicUrl(t)}#g${postId}`);
}

/** Gönderi durumunu değiştirir; ilk gönderiyse konuyu, cevapsa sayaçları günceller. */
async function setStatus(c: Ctx, postId: number, status: 'published' | 'hidden') {
  const p = await c.db.prepare('SELECT * FROM posts WHERE id = ?').bind(postId).first<Post>();
  if (!p || p.status === status) return;
  await c.db.prepare('UPDATE posts SET status = ? WHERE id = ?').bind(status, postId).run();
  if (p.is_first) await c.db.prepare('UPDATE topics SET status = ? WHERE id = ?').bind(status, p.topic_id).run();
  else {
    const delta = status === 'published' ? 1 : p.status === 'published' ? -1 : 0;
    if (delta) await c.db.prepare('UPDATE topics SET reply_count = MAX(0, reply_count + ?), last_post_at = MAX(last_post_at, ?) WHERE id = ?')
      .bind(delta, status === 'published' ? Date.now() : 0, p.topic_id).run();
  }
  if (status === 'published' && p.status === 'pending')
    await c.db.prepare('UPDATE users SET approved_posts = approved_posts + 1 WHERE id = ?').bind(p.user_id).run();
}

// ---------- yönetim ----------
async function admin(c: Ctx) {
  if (c.s?.user.role !== 'admin') return notFound(c);
  if (c.req.method === 'POST') {
    const g = await guard(c);
    if (g instanceof Response) return g;
    const act = g.f.get('act'), id = Number(g.f.get('id'));
    if (act === 'approve') await setStatus(c, id, 'published');
    if (act === 'hide') await setStatus(c, id, 'hidden');
    if (act === 'approve' || act === 'hide' || act === 'resolve') await c.db.prepare('UPDATE reports SET resolved = 1 WHERE post_id = ?').bind(id).run();
    if (act === 'ban') {
      await c.db.prepare("UPDATE users SET status = 'banned' WHERE id = ?").bind(id).run();
      await c.db.prepare("UPDATE posts SET status = 'hidden' WHERE user_id = ? AND status = 'pending'").bind(id).run();
      await c.db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(id).run();
    }
    const back = c.req.headers.get('Referer');
    return redirect(back && new URL(back).pathname.startsWith('/forum/konu/') ? back : '/forum/yonetim');
  }
  const q = `SELECT p.*, u.username, u.display_name, t.title, t.slug FROM posts p JOIN users u ON u.id = p.user_id JOIN topics t ON t.id = p.topic_id`;
  const pending = (await c.db.prepare(`${q} WHERE p.status = 'pending' ORDER BY p.created_at LIMIT 50`).all<Post & { title: string; slug: string }>()).results;
  const reported = (await c.db.prepare(`${q} WHERE p.id IN (SELECT post_id FROM reports WHERE resolved = 0) LIMIT 50`).all<Post & { title: string; slug: string }>()).results;
  const reasons = (await c.db.prepare('SELECT post_id, reason, COUNT(*) AS n FROM reports WHERE resolved = 0 GROUP BY post_id, reason').all<{ post_id: number; reason: string; n: number }>()).results;
  const imgs = await imagesFor(c, [...pending, ...reported].map((p) => p.id));
  const btn = (act: string, id: number, label: string) =>
    `<form method="post" action="/forum/yonetim"><input type="hidden" name="csrf" value="${c.s!.csrf}"><input type="hidden" name="act" value="${act}"><input type="hidden" name="id" value="${id}"><button class="btn-s">${label}</button></form>`;
  const item = (p: Post & { title: string; slug: string }, extra = '') =>
    `<article class="post"><div class="who"><b>${esc(p.display_name)}</b> (@${esc(p.username)}) · <a href="/forum/konu/${p.topic_id}-${p.slug}">${esc(p.title)}</a> · ${p.is_first ? 'Konu' : 'Cevap'}${p.flag_reason ? ` · <span class="tag wait">Filtre: ${esc(p.flag_reason)}</span>` : ''}${extra}</div>
<div style="white-space:pre-wrap">${esc(p.body.slice(0, 1500))}</div>${pics(imgs.get(p.id) ?? [])}
<div class="acts">${btn('approve', p.id, '✓ Onayla')}${btn('hide', p.id, '✕ Gizle')}${extra ? btn('resolve', p.id, 'Şikâyeti kapat') : ''}${btn('ban', p.user_id, '⛔ Üyeyi yasakla')}</div></article>`;
  return page(c, {
    title: 'Yönetim | Defineciler Forum', desc: 'Forum yönetimi', robots: 'noindex, nofollow', active: 'yonetim', crumbs: [['Yönetim']], h1: 'Forum yönetimi',
    content: `<h2 style="margin-top:0">Onay bekleyenler (${pending.length})</h2>${pending.map((p) => item(p)).join('') || '<p class="muted">Bekleyen gönderi yok.</p>'}
<h2>Şikâyet edilenler (${reported.length})</h2>${reported.map((p) => item(p, ` · <span class="tag hid">${reasons.filter((r) => r.post_id === p.id).map((r) => `${esc(r.reason)} ×${r.n}`).join(', ')}</span>`)).join('') || '<p class="muted">Açık şikâyet yok.</p>'}`,
  });
}

// ---------- üyelik ----------
const USERNAME = /^[a-zA-Z0-9_.çğıöşüÇĞİÖŞÜ]{3,20}$/;
const back = (c: Ctx) => {
  const d = c.url.searchParams.get('d') ?? '';
  return d.startsWith('/forum') && !d.startsWith('//') ? d : '/forum';
};

async function authPage(c: Ctx, mode: 'giris' | 'kayit', err = '', v: { username?: string; display?: string } = {}) {
  if (c.s && !err) return redirect('/forum');
  const g = googleEnabled(c.env)
    ? `<a class="gbtn" href="/forum/auth/google?d=${encodeURIComponent(back(c))}"><svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13.5 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4-13.5-9.6l-7.8 6C6.6 42.6 14.6 48 24 48z"/></svg>Google ile ${mode === 'kayit' ? 'üye ol' : 'giriş yap'}</a>
${mode === 'kayit' ? '<p class="hint" style="text-align:center">Google ile devam ederek <a href="/forum/kurallar">forum kurallarını</a> kabul etmiş olursunuz.</p>' : ''}<div class="or">ya da</div>`
    : '';
  const reg = mode === 'kayit';
  return page(c, {
    title: `${reg ? 'Üye ol' : 'Giriş yap'} | Defineciler Forum`, desc: 'Defineciler forumuna giriş.', robots: 'noindex', active: mode,
    crumbs: [[reg ? 'Üye ol' : 'Giriş yap']], h1: reg ? 'Foruma üye olun' : 'Giriş yapın', head: turnstileHead(c.env.TURNSTILE_SITE_KEY),
    content: `<div style="max-width:440px">${err ? `<div class="err">${esc(err)}</div>` : ''}${g}
<form class="form" method="post" action="/forum/${mode}?d=${encodeURIComponent(back(c))}">
<label for="u">Kullanıcı adı</label><input type="text" id="u" name="username" required autocomplete="username" value="${esc(v.username)}" ${reg ? 'pattern="[a-zA-Z0-9_.çğıöşüÇĞİÖŞÜ]{3,20}"' : ''}>
${reg ? `<div class="hint">3–20 karakter; harf, rakam, nokta ve alt çizgi.</div><label for="dn">Görünen ad</label><input type="text" id="dn" name="display" maxlength="40" value="${esc(v.display)}" placeholder="İsteğe bağlı">` : ''}
<label for="p">Şifre</label><input type="password" id="p" name="password" required minlength="${reg ? 8 : 1}" autocomplete="${reg ? 'new-password' : 'current-password'}">
${reg ? '<div class="hint">En az 8 karakter. E-posta istemediğimiz için şifre sıfırlama yoktur; şifrenizi güvenli bir yerde saklayın.</div><label style="font-weight:400"><input type="checkbox" name="rules" value="1" required> <a href="/forum/kurallar" target="_blank">Forum kurallarını</a> ve <a href="/gizlilik" target="_blank">gizlilik politikasını</a> okudum, kabul ediyorum.</label>' : ''}
${turnstile(c.env.TURNSTILE_SITE_KEY)}
<button class="btn">${reg ? 'Üye ol' : 'Giriş yap'}</button></form>
<p class="muted" style="margin-top:18px">${reg ? 'Zaten üye misiniz? <a href="/forum/giris">Giriş yapın</a>' : 'Hesabınız yok mu? <a href="/forum/kayit">Üye olun</a>'}</p></div>`,
  });
}

async function register(c: Ctx) {
  if (!sameOrigin(c.req)) return html('İstek reddedildi.', 403);
  const f = await form(c.req);
  const username = (f.get('username') ?? '').trim();
  const display = (f.get('display') ?? '').trim().slice(0, 40) || username;
  const pw = f.get('password') ?? '';
  const again = (e: string) => authPage(c, 'kayit', e, { username, display });
  if (!USERNAME.test(username)) return again('Kullanıcı adı 3–20 karakter olmalı; harf, rakam, nokta ve alt çizgi kullanılabilir.');
  if (pw.length < 8 || pw.length > 200) return again('Şifre en az 8 karakter olmalı.');
  if (!f.get('rules')) return again('Devam etmek için kuralları kabul etmelisiniz.');
  if (f.get('website')) return again('Kayıt tamamlanamadı.');
  if (!(await verifyTurnstile(c.env, f.get('cf-turnstile-response'), ip(c.req)))) return again('Robot doğrulaması başarısız. Tekrar deneyin.');
  if (!(await bump(c.db, `reg:${await sha256(ip(c.req))}`, LIMITS.register))) return again('Bugün bu bağlantıdan çok fazla kayıt yapıldı. Yarın tekrar deneyin.');
  const exists = await c.db.prepare('SELECT 1 FROM users WHERE username = ?').bind(username).first();
  if (exists) return again('Bu kullanıcı adı alınmış.');
  const u = await c.db.prepare('INSERT INTO users (username, display_name, pass_hash, created_at) VALUES (?, ?, ?, ?) RETURNING id')
    .bind(username, display, await hashPassword(pw), Date.now()).first<{ id: number }>();
  await c.db.prepare('DELETE FROM counters WHERE day < ?').bind(new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10)).run();
  return redirect(back(c), await createSession(c.env, u!.id));
}

async function login(c: Ctx) {
  if (!sameOrigin(c.req)) return html('İstek reddedildi.', 403);
  const f = await form(c.req);
  const username = (f.get('username') ?? '').trim();
  const again = (e: string) => authPage(c, 'giris', e, { username });
  if (f.get('website')) return again('Giriş yapılamadı.');
  if (!(await bump(c.db, `login:${await sha256(ip(c.req))}`, 30))) return again('Çok fazla deneme. Daha sonra tekrar deneyin.');
  if (!(await verifyTurnstile(c.env, f.get('cf-turnstile-response'), ip(c.req)))) return again('Robot doğrulaması başarısız. Tekrar deneyin.');
  const u = await c.db.prepare('SELECT * FROM users WHERE username = ?').bind(username).first<User>();
  if (!u || !(await verifyPassword(f.get('password') ?? '', u.pass_hash))) return again('Kullanıcı adı ya da şifre hatalı.');
  if (u.status === 'banned') return again('Bu hesap kurallara aykırılık nedeniyle kapatılmış.');
  return redirect(back(c), await createSession(c.env, u.id));
}

async function google(c: Ctx) {
  if (!googleEnabled(c.env)) return notFound(c);
  if (!c.url.searchParams.get('code')) {
    const r = googleStart(c.req, c.env);
    r.headers.append('Set-Cookie', cookie('dfd', encodeURIComponent(back(c)), 600));
    return r;
  }
  const g = await googleCallback(c.req, c.env);
  if (!g) return authPage(c, 'giris', 'Google ile giriş tamamlanamadı. Tekrar deneyin.');
  let u = await c.db.prepare('SELECT * FROM users WHERE google_sub = ?').bind(g.sub).first<User>();
  if (!u) {
    const base = g.name.toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g, '').slice(0, 14) || 'uye';
    let name = base;
    for (let i = 0; i < 5 && (await c.db.prepare('SELECT 1 FROM users WHERE username = ?').bind(name).first()); i++)
      name = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
    u = await c.db.prepare('INSERT INTO users (username, display_name, google_sub, created_at) VALUES (?, ?, ?, ?) RETURNING *')
      .bind(name, g.name, g.sub, Date.now()).first<User>();
  }
  if (u!.status === 'banned') return authPage(c, 'giris', 'Bu hesap kurallara aykırılık nedeniyle kapatılmış.');
  const d = decodeURIComponent((c.req.headers.get('Cookie') ?? '').match(/(?:^|;\s*)dfd=([^;]+)/)?.[1] ?? '%2Fforum');
  return redirect(d.startsWith('/forum') ? d : '/forum', [await createSession(c.env, u!.id), cookie('dfg', '', 0), cookie('dfd', '', 0)]);
}

async function logout(c: Ctx) {
  const g = await guard(c);
  if (g instanceof Response) return g;
  await c.db.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(g.s.tokenHash).run();
  return redirect('/forum', cookie(COOKIE, '', 0));
}

async function account(c: Ctx, msg = '') {
  if (!c.s) return redirect('/forum/giris?d=/forum/hesap');
  const u = c.s.user;
  const f = (act: string, inner: string, btn: string, danger = false) =>
    `<form class="form" method="post" action="/forum/hesap"><input type="hidden" name="csrf" value="${c.s!.csrf}"><input type="hidden" name="act" value="${act}">${inner}<button class="btn${danger ? ' btn-ghost' : ''}">${btn}</button></form>`;
  return page(c, {
    title: 'Hesabım | Defineciler Forum', desc: 'Forum hesabı', robots: 'noindex', active: 'hesap', crumbs: [['Hesabım']], h1: 'Hesabım',
    lead: `@${u.username}${u.google_sub ? ' · Google ile bağlı' : ''}`,
    content: `<div style="max-width:520px">${msg ? `<div class="note">${esc(msg)}</div>` : ''}
<h2 style="margin-top:0">Görünen ad</h2>${f('name', `<input type="text" name="display" maxlength="40" required value="${esc(u.display_name)}">`, 'Kaydet')}
${u.pass_hash ? `<h2>Şifre değiştir</h2>${f('pw', '<label>Mevcut şifre</label><input type="password" name="old" required autocomplete="current-password"><label>Yeni şifre</label><input type="password" name="new" required minlength="8" autocomplete="new-password">', 'Şifreyi değiştir')}` : ''}
<h2>Oturumu kapat</h2><form method="post" action="/forum/cikis"><input type="hidden" name="csrf" value="${c.s.csrf}"><button class="btn btn-ghost">Çıkış yap</button></form>
<h2>Hesabı sil</h2><p class="muted">Hesabınız, konularınız, cevaplarınız ve fotoğraflarınız kalıcı olarak silinir. Bu işlem geri alınamaz.</p>
${f('delete', '<label style="font-weight:400"><input type="checkbox" name="sure" value="1" required> Hesabımın ve tüm içeriğimin silinmesini onaylıyorum.</label>', 'Hesabımı sil', true)}</div>`,
  });
}

async function accountPost(c: Ctx) {
  const g = await guard(c);
  if (g instanceof Response) return g;
  const { f, s } = g;
  const act = f.get('act');
  if (act === 'name') {
    const d = (f.get('display') ?? '').trim().slice(0, 40);
    if (d.length >= 2) await c.db.prepare('UPDATE users SET display_name = ? WHERE id = ?').bind(d, s.user.id).run();
    return redirect('/forum/hesap');
  }
  if (act === 'pw') {
    if (!(await verifyPassword(f.get('old') ?? '', s.user.pass_hash))) return account(c, 'Mevcut şifre hatalı.');
    const n = f.get('new') ?? '';
    if (n.length < 8) return account(c, 'Yeni şifre en az 8 karakter olmalı.');
    await c.db.prepare('UPDATE users SET pass_hash = ? WHERE id = ?').bind(await hashPassword(n), s.user.id).run();
    await c.db.prepare('DELETE FROM sessions WHERE user_id = ? AND token_hash != ?').bind(s.user.id, s.tokenHash).run();
    return account(c, 'Şifreniz değiştirildi; diğer cihazlardaki oturumlar kapatıldı.');
  }
  if (act === 'delete' && f.get('sure')) {
    const keys = (await c.db.prepare('SELECT key FROM images WHERE user_id = ?').bind(s.user.id).all<{ key: string }>()).results.map((r) => r.key);
    if (keys.length && c.env.FORUM_IMG) await c.env.FORUM_IMG.delete(keys);
    const id = s.user.id;
    // D1'de yabancı anahtarlar zorunlu değil; sırayla açıkça silinir.
    await c.db.batch([
      c.db.prepare('DELETE FROM images WHERE user_id = ?').bind(id),
      c.db.prepare('DELETE FROM votes WHERE user_id = ? OR post_id IN (SELECT id FROM posts WHERE user_id = ?)').bind(id, id),
      c.db.prepare('DELETE FROM reports WHERE user_id = ? OR post_id IN (SELECT id FROM posts WHERE user_id = ?)').bind(id, id),
      c.db.prepare('DELETE FROM posts WHERE user_id = ? OR topic_id IN (SELECT id FROM topics WHERE user_id = ?)').bind(id, id),
      c.db.prepare('DELETE FROM topics WHERE user_id = ?').bind(id),
      c.db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(id),
      c.db.prepare('DELETE FROM users WHERE id = ?').bind(id),
    ]);
    // Silinen cevapların konu sayaçları yeniden hesaplanır.
    await c.db.prepare("UPDATE topics SET reply_count = (SELECT COUNT(*) FROM posts p WHERE p.topic_id = topics.id AND p.is_first = 0 AND p.status = 'published')").run();
    return redirect('/forum', cookie(COOKIE, '', 0));
  }
  return redirect('/forum/hesap');
}

// ---------- fotoğraflar ----------
const MAX_IMG = 1_500_000;
async function upload(c: Ctx) {
  if (!c.s || !c.env.FORUM_IMG) return jsonRes({ error: 'Giriş yapın.' }, 401);
  if (!sameOrigin(c.req) || c.req.headers.get('X-CSRF') !== c.s.csrf) return jsonRes({ error: 'İstek reddedildi.' }, 403);
  const type = c.req.headers.get('Content-Type') ?? '';
  if (!['image/webp', 'image/jpeg'].includes(type)) return jsonRes({ error: 'Yalnızca fotoğraf yüklenebilir.' }, 415);
  const buf = new Uint8Array(await c.req.arrayBuffer());
  if (buf.length > MAX_IMG || buf.length < 100) return jsonRes({ error: 'Fotoğraf çok büyük.' }, 413);
  const isWebp = String.fromCharCode(...buf.slice(0, 4)) === 'RIFF' && String.fromCharCode(...buf.slice(8, 12)) === 'WEBP';
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8;
  if (!(type === 'image/webp' ? isWebp : isJpeg)) return jsonRes({ error: 'Geçersiz dosya.' }, 415);
  // Konum bilgisi taşıyabilecek meta veriyi reddet (tarayıcıdaki yeniden kodlama bunları zaten siler).
  const head = new TextDecoder('latin1').decode(buf.slice(0, Math.min(buf.length, 65536)));
  if (head.includes('Exif\0\0') || head.includes('EXIF')) return jsonRes({ error: 'Fotoğrafta konum bilgisi olabilir; lütfen sayfadaki yükleyiciyi kullanın.' }, 422);
  if (!(await bump(c.db, `img:${c.s.user.id}`, 40))) return jsonRes({ error: 'Bugünkü fotoğraf sınırına ulaştınız.' }, 429);
  const key = randomToken(18);
  await c.env.FORUM_IMG.put(key, buf, { httpMetadata: { contentType: type } });
  await c.db.prepare('INSERT INTO images (key, user_id, created_at) VALUES (?, ?, ?)').bind(key, c.s.user.id, Date.now()).run();
  return jsonRes({ key });
}

async function image(c: Ctx, key: string) {
  if (!c.env.FORUM_IMG || !/^[A-Za-z0-9_-]{20,40}$/.test(key)) return notFound(c);
  const row = await c.db.prepare('SELECT i.user_id, p.status FROM images i LEFT JOIN posts p ON p.id = i.post_id WHERE i.key = ?')
    .bind(key).first<{ user_id: number; status: string | null }>();
  if (!row) return notFound(c);
  const pub = row.status === 'published';
  if (!pub && c.s?.user.id !== row.user_id && c.s?.user.role !== 'admin') return notFound(c);
  const obj = await c.env.FORUM_IMG.get(key);
  if (!obj) return notFound(c);
  return new Response(obj.body, {
    headers: { 'Content-Type': obj.httpMetadata?.contentType ?? 'image/webp', 'Cache-Control': pub ? 'public, max-age=86400' : 'private, no-store' },
  });
}

async function sitemap(c: Ctx) {
  const rows = (await c.db.prepare("SELECT id, slug, last_post_at FROM topics WHERE status = 'published' ORDER BY last_post_at DESC LIMIT 5000")
    .all<{ id: number; slug: string; last_post_at: number }>()).results;
  const u = (p: string, d?: number) => `  <url><loc>https://defineciler.online${p}</loc>${d ? `<lastmod>${new Date(d).toISOString().slice(0, 10)}</lastmod>` : ''}</url>`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
    u('/forum'), u('/forum/kurallar'), ...CATEGORIES.map((k) => u(`/forum/k/${k.id}`)), ...rows.map((r) => u(topicUrl(r), r.last_post_at)),
  ].join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}

async function notFound(c: Ctx) {
  const r = await page(c, {
    title: 'Bulunamadı | Defineciler Forum', desc: 'Sayfa bulunamadı.', robots: 'noindex', crumbs: [['Bulunamadı']], h1: 'Sayfa bulunamadı',
    content: '<p>Aradığınız konu kaldırılmış, onay bekliyor ya da hiç var olmamış olabilir.</p><p><a class="btn" href="/forum">Foruma dön</a></p>',
  });
  return new Response(r.body, { status: 404, headers: r.headers });
}

function unavailable(url: URL) {
  return html(layout({
    title: 'Forum | Defineciler', desc: 'Defineciler forumu çok yakında.', path: url.pathname, robots: 'noindex',
    body: wrap({ h1: 'Forum çok yakında', bar: '', content: '<p>Forumumuz hazırlanıyor. Bu arada <a href="/rehber">rehberlerimize</a> ve <a href="/define-isaretleri">define işaretlerine</a> göz atabilirsiniz.</p>' }),
  }), 503);
}

// ---------- yönlendirme ----------
export async function handleForum(req: Request, env: ForumEnv): Promise<Response> {
  const url = new URL(req.url);
  if (!env.FORUM_DB) return unavailable(url);
  const c: Ctx = { req, env, url, s: await getSession(req, env), db: env.FORUM_DB };
  const p = url.pathname.replace(/\/+$/, '') || '/forum';
  const M = req.method;
  let m: RegExpMatchArray | null;
  if (p === '/forum') return home(c);
  if (p === '/forum/sitemap.xml') return sitemap(c);
  if ((m = p.match(/^\/forum\/k\/([a-z-]+)$/))) return category(c, m[1]);
  if ((m = p.match(/^\/forum\/konu\/(\d+)(?:-[a-z0-9-]*)?$/))) return topic(c, Number(m[1]));
  if ((m = p.match(/^\/forum\/konu\/(\d+)\/cevap$/)) && M === 'POST') return reply(c, Number(m[1]));
  if ((m = p.match(/^\/forum\/konu\/(\d+)\/kabul\/(\d+)$/)) && M === 'POST') return accept(c, Number(m[1]), Number(m[2]));
  if ((m = p.match(/^\/forum\/gonderi\/(\d+)\/(faydali|sikayet)$/)) && M === 'POST') return postAction(c, Number(m[1]), m[2] as 'faydali' | 'sikayet');
  if ((m = p.match(/^\/forum\/uye\/([^/]+)$/))) return member(c, decodeURIComponent(m[1]));
  if ((m = p.match(/^\/forum\/img\/([^/]+)$/))) return image(c, m[1]);
  switch (p) {
    case '/forum/yeni': return M === 'POST' ? createTopic(c) : newTopicForm(c);
    case '/forum/giris': return M === 'POST' ? login(c) : authPage(c, 'giris');
    case '/forum/kayit': return M === 'POST' ? register(c) : authPage(c, 'kayit');
    case '/forum/cikis': return M === 'POST' ? logout(c) : redirect('/forum/hesap');
    case '/forum/auth/google': return google(c);
    case '/forum/hesap': return M === 'POST' ? accountPost(c) : account(c);
    case '/forum/yonetim': return admin(c);
    case '/forum/yukle': return M === 'POST' ? upload(c) : notFound(c);
  }
  return notFound(c);
}

export { isAdmin };
