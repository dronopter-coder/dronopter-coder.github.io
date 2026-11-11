// Forum HTML'i. Sitenin ortak kabuğu (menü, alt bilgi, CSS) gen-seo.mjs'in ürettiği FORUM_SHELL şablonundan gelir.
import { FORUM_SHELL } from '../seo.generated';
import type { Session } from './auth';
import { CATEGORIES, type Post, type Topic } from './types';

export const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const BASE = 'https://defineciler.online';
const PLAY = 'https://play.google.com/store/apps/details?id=online.defineciler.app&utm_source=forum&utm_medium=banner';

export const catLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id;
export const topicUrl = (t: Pick<Topic, 'id' | 'slug'>) => `/forum/konu/${t.id}-${t.slug}`;
const date = (ms: number) =>
  new Date(ms).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' });
const ago = (ms: number) => {
  const m = Math.round((Date.now() - ms) / 60000);
  if (m < 60) return `${Math.max(1, m)} dk önce`;
  if (m < 1440) return `${Math.round(m / 60)} sa önce`;
  if (m < 43200) return `${Math.round(m / 1440)} gün önce`;
  return date(ms);
};

/** Düz metin → paragraflar (HTML'e izin yok, bağlantılar tıklanmaz). */
export const formatBody = (s: string) =>
  s.trim().split(/\n{2,}/).map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');

const CSS = `
.fbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin:0 0 22px}
.fbar nav{display:flex;flex-wrap:wrap;gap:8px}.fbar a.pill,.pill{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:999px;background:var(--surface);border:1px solid var(--border2);color:var(--text);text-decoration:none;font-size:.9rem}
.pill.on,.fbar a.pill:hover{border-color:var(--gold);color:var(--gold-light)}.badge{background:#c2410c;color:#fff;border-radius:999px;padding:0 7px;font-size:.75rem;font-weight:700}
.flayout{display:grid;grid-template-columns:1fr 300px;gap:28px}@media(max-width:900px){.flayout{grid-template-columns:1fr}}
.trow{display:flex;gap:14px;align-items:flex-start;padding:16px 18px;background:var(--surface);border:1px solid var(--border);border-radius:16px;margin:10px 0;text-decoration:none;color:var(--text)}
.trow:hover{border-color:var(--gold)}.trow h3{font-size:1.06rem;margin:0 0 4px;font-family:system-ui,sans-serif;color:var(--text)}.trow .meta{color:var(--muted);font-size:.84rem}
.trow .cnt{margin-left:auto;text-align:center;min-width:58px;color:var(--muted);font-size:.78rem}.trow .cnt b{display:block;color:var(--gold-light);font-size:1.15rem}
.tag{display:inline-block;padding:1px 9px;border-radius:999px;font-size:.74rem;font-weight:700;border:1px solid}.tag.ok{color:#7FB069;border-color:#7FB06988}.tag.wait{color:#E0A43A;border-color:#E0A43A88}.tag.hid{color:#D9654B;border-color:#D9654B88}
.post{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:18px 20px;margin:14px 0}.post.acc{border-color:#7FB069;box-shadow:0 0 0 1px #7FB06955}
.post .who{display:flex;gap:10px;align-items:center;margin-bottom:10px;font-size:.9rem;color:var(--muted)}.post .who b{color:var(--gold-light)}
.av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#3a2f22,#6b5536);display:flex;align-items:center;justify-content:center;color:var(--gold-light);font-weight:800}
.post .acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.post .acts form{margin:0}
.btn-s{background:transparent;border:1px solid var(--border2);color:var(--muted);border-radius:999px;padding:6px 12px;font-size:.83rem;cursor:pointer}.btn-s:hover{color:var(--gold-light);border-color:var(--gold)}
.pics{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-top:10px}.pics img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px;border:1px solid var(--border)}
.form label{display:block;font-weight:600;margin:14px 0 6px}.form input[type=text],.form input[type=password],.form textarea,.form select{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--border2);background:#120E0A;color:var(--text);font:inherit}
.form textarea{min-height:180px;resize:vertical}.form .hint{color:var(--muted);font-size:.85rem;margin-top:4px}.form button{margin-top:18px;border:0;cursor:pointer}
.note{background:rgba(212,162,76,.08);border:1px solid rgba(212,162,76,.4);border-radius:14px;padding:14px 16px;margin:14px 0}.err{background:rgba(217,101,75,.1);border:1px solid #D9654B88;border-radius:14px;padding:12px 16px;margin:14px 0;color:#f3c1b5}
.side .card{margin-top:0}.side h3{font-size:1rem;margin-bottom:8px}.side ul{padding-left:1.1rem}
.abanner{display:flex;gap:16px;align-items:center;background:linear-gradient(135deg,rgba(212,162,76,.22),rgba(31,25,18,.95));border:1px solid rgba(212,162,76,.6);border-radius:18px;padding:16px 18px;margin:18px 0;text-decoration:none;color:var(--text)}
.abanner img{width:74px;height:74px;object-fit:cover;border-radius:14px;flex:none}.abanner b{display:block;color:var(--gold-light);font-family:Georgia,serif;font-size:1.08rem}.abanner span{color:var(--muted);font-size:.9rem}.abanner .go{margin-left:auto;white-space:nowrap;background:var(--gold);color:#1a1208;font-weight:700;border-radius:999px;padding:9px 14px;font-size:.88rem}
@media(max-width:560px){.abanner .go{display:none}}
.side .abanner{flex-direction:column;align-items:flex-start;text-align:left}.side .abanner img{width:100%;height:120px}.side .abanner .go{display:inline-block;margin-left:0}
.or{display:flex;align-items:center;gap:12px;color:var(--muted);margin:18px 0}.or::before,.or::after{content:"";flex:1;height:1px;background:var(--border)}
.gbtn{display:flex;justify-content:center;align-items:center;gap:10px;background:#fff;color:#1f1f1f;border-radius:999px;padding:12px 18px;font-weight:600;text-decoration:none}
.pager{display:flex;gap:8px;margin:18px 0}`;

export function layout(o: { title: string; desc: string; path: string; robots?: string; head?: string; body: string }) {
  return FORUM_SHELL.replace('%%TITLE%%', esc(o.title)).replace('%%TITLE%%', esc(o.title))
    .replace('%%DESC%%', esc(o.desc)).replace('%%DESC%%', esc(o.desc))
    .replace('%%CANON%%', BASE + o.path).replace('%%CANON%%', BASE + o.path)
    .replace('%%ROBOTS%%', o.robots ?? 'index, follow')
    .replace('%%HEAD%%', `<style>${CSS}</style>${o.head ?? ''}`)
    .replace('%%BODY%%', o.body);
}

export function wrap(o: { crumbs?: [string, string?][]; h1: string; lead?: string; bar: string; content: string; side?: string }) {
  const cr = `<div class="crumb"><a href="/">Defineciler</a> › <a href="/forum">Forum</a>${(o.crumbs ?? []).map(([n, h]) => ` › ${h ? `<a href="${h}">${esc(n)}</a>` : esc(n)}`).join('')}</div>`;
  return `<div class="phead"><div class="wrap">${cr}<p class="eyebrow">Defineciler Forum</p><h1>${esc(o.h1)}</h1>${o.lead ? `<p class="lead">${esc(o.lead)}</p>` : ''}</div></div>
<div class="body"><div class="wrap">${o.bar}${o.side ? `<div class="flayout"><div>${o.content}</div><aside class="side">${o.side}</aside></div>` : o.content}</div></div>`;
}

export function bar(s: Session | null, pending: number, active = '') {
  const pill = (href: string, label: string, key: string) => `<a class="pill${active === key ? ' on' : ''}" href="${href}">${label}</a>`;
  const right = s
    ? `${s.user.role === 'admin' ? pill('/forum/yonetim', `Yönetim${pending ? ` <span class="badge">${pending}</span>` : ''}`, 'yonetim') : ''}${pill(`/forum/uye/${encodeURIComponent(s.user.username)}`, `👤 ${esc(s.user.display_name)}`, 'uye')}${pill('/forum/hesap', 'Hesabım', 'hesap')}`
    : `${pill('/forum/giris', 'Giriş yap', 'giris')}${pill('/forum/kayit', 'Üye ol', 'kayit')}`;
  return `<div class="fbar"><nav>${pill('/forum', 'Forum', 'forum')}${pill('/forum/yeni', '＋ Yeni soru', 'yeni')}${pill('/forum/kurallar', 'Kurallar', 'kurallar')}</nav><nav>${right}</nav></div>`;
}

const BANNERS = [
  { img: '/site/ekran-sonuc.webp', h: 'Elindeki eseri fotoğrafla tanı', p: 'Sikke, seramik ya da yazıt: Defineciler dönemini ve uygarlığını saniyeler içinde değerlendirsin.', go: 'Ücretsiz indir' },
  { img: '/site/s-yilan.webp', h: '35 define işaretinin gerçek anlamı', p: 'Halk yorumu ile arkeolojik gerçeği yan yana okuyun. Hepsi Defineciler uygulamasında.', go: 'Uygulamayı aç' },
  { img: '/site/hero-sikke.webp', h: 'Defineciler Pro: günde 30 analiz', p: 'Reklamsız kullanım, ön ve arka yüzle ayrıntılı rapor, PDF olarak kaydetme.', go: 'Pro’yu dene' },
];
export const banner = (i: number) => {
  const b = BANNERS[((i % BANNERS.length) + BANNERS.length) % BANNERS.length];
  return `<a class="abanner" href="${PLAY}" rel="noopener"><img src="${b.img}" alt="" loading="lazy" width="74" height="74"><div><b>${esc(b.h)}</b><span>${esc(b.p)}</span></div><span class="go">${esc(b.go)}</span></a>`;
};

export const sideBox = () => `<div class="card"><h3>Forum kuralları</h3><ul>
<li>Yer tarifi, koordinat ya da harita paylaşılmaz.</li><li>Eser alım-satımı ve değer biçme yasaktır.</li><li>Kaçak kazı teşvik edilemez.</li><li>Saygılı dil kullanılır.</li></ul>
<p><a href="/forum/kurallar">Tüm kurallar →</a></p></div>
<div class="card"><h3>Eser buldunuz mu?</h3><p class="muted" style="font-size:.92rem">Dokunmayın ve 3 gün içinde en yakın müze müdürlüğüne bildirin.</p><p><a href="/rehber/tarihi-eser-bulursam-ne-yapmaliyim">Bildirim rehberi →</a></p></div>
${banner(0)}`;

export const statusTag = (st: string) =>
  st === 'published' ? '' : st === 'pending' ? '<span class="tag wait">Onay bekliyor</span>' : '<span class="tag hid">Gizlendi</span>';

export const topicRow = (t: Topic & { replies?: number }) =>
  `<a class="trow" href="${topicUrl(t)}"><div class="av">${esc((t.display_name ?? '?').slice(0, 1).toLocaleUpperCase('tr-TR'))}</div><div>
<h3>${esc(t.title)} ${statusTag(t.status)}${t.accepted_post_id ? ' <span class="tag ok">Cevaplandı</span>' : ''}</h3>
<div class="meta">${esc(catLabel(t.category))} · ${esc(t.display_name)} · ${ago(t.last_post_at)}</div></div>
<div class="cnt"><b>${t.reply_count}</b>cevap</div></a>`;

export const pics = (keys: string[]) =>
  keys.length ? `<div class="pics">${keys.map((k) => `<a href="/forum/img/${k}" target="_blank" rel="noopener"><img src="/forum/img/${k}" alt="Gönderi fotoğrafı" loading="lazy"></a>`).join('')}</div>` : '';

export function postCard(p: Post, o: { s: Session | null; acceptedId: number | null; ownerId: number; images: string[]; topicId: number }) {
  const { s } = o;
  const acts: string[] = [];
  const f = (action: string, label: string, extra = '') =>
    `<form method="post" action="${action}">${s ? `<input type="hidden" name="csrf" value="${s.csrf}">` : ''}${extra}<button class="btn-s">${label}</button></form>`;
  if (s && s.user.id !== p.user_id && p.status === 'published') {
    if (!p.is_first) acts.push(f(`/forum/gonderi/${p.id}/faydali`, `👍 Faydalı (${p.helpful})`));
    acts.push(`<details><summary class="btn-s" style="list-style:none;display:inline-block">⚑ Şikâyet et</summary>${f(`/forum/gonderi/${p.id}/sikayet`, 'Gönder', `<select name="reason" style="margin:8px 0;padding:6px;border-radius:8px;background:#120E0A;color:var(--text);border:1px solid var(--border2)"><option>Yer tarifi / koordinat</option><option>Alım-satım / değer biçme</option><option>Kaçak kazı teşviki</option><option>Hakaret / taciz</option><option>Spam / reklam</option><option>Diğer</option></select>`)}</details>`);
  } else if (!s && !p.is_first) acts.push(`<span class="muted" style="font-size:.85rem">👍 ${p.helpful} faydalı</span>`);
  if (s && s.user.id === o.ownerId && !p.is_first && p.status === 'published' && o.acceptedId !== p.id)
    acts.push(f(`/forum/konu/${o.topicId}/kabul/${p.id}`, '✓ En iyi cevap olarak işaretle'));
  if (s?.user.role === 'admin') {
    if (p.status !== 'published') acts.push(f('/forum/yonetim', 'Onayla', `<input type="hidden" name="act" value="approve"><input type="hidden" name="id" value="${p.id}">`));
    if (p.status !== 'hidden') acts.push(f('/forum/yonetim', 'Gizle', `<input type="hidden" name="act" value="hide"><input type="hidden" name="id" value="${p.id}">`));
  }
  return `<article class="post${o.acceptedId === p.id ? ' acc' : ''}" id="g${p.id}">
<div class="who"><div class="av">${esc((p.display_name ?? '?').slice(0, 1).toLocaleUpperCase('tr-TR'))}</div><div><b><a href="/forum/uye/${encodeURIComponent(p.username ?? '')}" style="color:inherit;text-decoration:none">${esc(p.display_name)}</a></b> · ${ago(p.created_at)} ${statusTag(p.status)}${o.acceptedId === p.id ? ' <span class="tag ok">En iyi cevap</span>' : ''}</div></div>
${p.status === 'pending' && p.flag_reason ? `<div class="note" style="margin-top:0">Bu gönderi otomatik denetime takıldı (<b>${esc(p.flag_reason)}</b>) ve yönetici onayı bekliyor.</div>` : ''}
${formatBody(p.body)}${pics(o.images)}
${acts.length ? `<div class="acts">${acts.join('')}</div>` : ''}</article>`;
}

export function turnstile(siteKey?: string) {
  return siteKey
    ? `<div class="cf-turnstile" data-sitekey="${esc(siteKey)}" data-theme="dark" style="margin-top:14px"></div>`
    : `<div style="position:absolute;left:-9999px" aria-hidden="true"><label>Bu alanı boş bırakın<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>`;
}
export const turnstileHead = (siteKey?: string) =>
  siteKey ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' : '';

/** Fotoğraf yükleme: tarayıcıda yeniden kodlama (EXIF/GPS silinir), /forum/yukle'ye gönderme. */
export const uploaderScript = (csrf: string) => `<script>
(()=>{const inp=document.getElementById('foto');if(!inp)return;const box=document.getElementById('fotolar'),st=document.getElementById('fdurum');
inp.addEventListener('change',async()=>{const files=[...inp.files].slice(0,4-box.children.length);inp.value='';
for(const f of files){st.textContent='Fotoğraf hazırlanıyor…';try{const bmp=await createImageBitmap(f);const s=Math.min(1,1600/Math.max(bmp.width,bmp.height));
const c=document.createElement('canvas');c.width=Math.round(bmp.width*s);c.height=Math.round(bmp.height*s);c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);
let blob=await new Promise(r=>c.toBlob(r,'image/webp',0.82));if(!blob||blob.type!=='image/webp')blob=await new Promise(r=>c.toBlob(r,'image/jpeg',0.85));
st.textContent='Yükleniyor…';const res=await fetch('/forum/yukle',{method:'POST',headers:{'Content-Type':blob.type,'X-CSRF':'${csrf}'},body:blob});const j=await res.json();
if(!res.ok)throw new Error(j.error||'Yüklenemedi');const d=document.createElement('div');d.style.cssText='position:relative';
d.innerHTML='<img src="/forum/img/'+j.key+'" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px"><input type="hidden" name="img" value="'+j.key+'">';box.appendChild(d);st.textContent='';}
catch(e){st.textContent='Hata: '+e.message;}}
inp.disabled=box.children.length>=4;});})();
</script>`;

export const fotoField = (enabled: boolean) =>
  enabled
    ? `<label for="foto">Fotoğraflar (en fazla 4)</label><input type="file" id="foto" accept="image/*" multiple>
<div class="hint">Fotoğraflar telefonunuzda küçültülür ve <b>konum (GPS) bilgisi silinerek</b> yüklenir. Yer tarifi verecek manzara fotoğrafı paylaşmayın.</div>
<div id="fotolar" class="pics"></div><div id="fdurum" class="hint"></div>`
    : '';

export const qaJsonLd = (t: Topic, first: Post, answers: Post[], acceptedId: number | null) => {
  const ans = (p: Post) => ({
    '@type': 'Answer', text: p.body.slice(0, 2000), dateCreated: new Date(p.created_at).toISOString(), upvoteCount: p.helpful,
    url: `${BASE}${topicUrl(t)}#g${p.id}`, author: { '@type': 'Person', name: p.display_name },
  });
  const accepted = answers.find((a) => a.id === acceptedId);
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question', name: t.title, text: first.body.slice(0, 2000), answerCount: answers.length,
      dateCreated: new Date(t.created_at).toISOString(), author: { '@type': 'Person', name: first.display_name },
      ...(accepted ? { acceptedAnswer: ans(accepted) } : {}),
      ...(answers.filter((a) => a.id !== acceptedId).length ? { suggestedAnswer: answers.filter((a) => a.id !== acceptedId).slice(0, 10).map(ans) } : {}),
    },
  }).replace(/</g, '\\u003c')}</script>`;
};
