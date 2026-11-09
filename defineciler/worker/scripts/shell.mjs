// Sitenin ortak kabuğu: tasarım (CSS), üst menü (masaüstünde açılır menüler, mobilde JS'siz hamburger) ve alt bilgi.
// gen-seo.mjs tüm sayfaları (ana sayfa dahil) bu kabukla üretir.

export const BASE = 'https://defineciler.online';
export const PLAY_URL = 'https://play.google.com/store/apps/details?id=online.defineciler.app';
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Menü yapısı: başlık → alt sayfalar. Tek bağlantılı öğelerde `href` vardır.
export const MENU = [
  {
    label: 'Uygulama',
    items: [
      { href: '/nasil-calisir', label: 'Nasıl çalışır?', desc: 'Üç adımda eser analizi' },
      { href: '/ozellikler', label: 'Özellikler', desc: 'Uygulamada neler var?' },
      { href: '/tanitim', label: 'Tanıtım videosu', desc: '1 dakikada Defineciler' },
      { href: '/ekran-goruntuleri', label: 'Ekran görüntüleri', desc: 'Uygulamadan kareler' },
      { href: '/pro', label: 'Defineciler Pro', desc: 'Planlar ve ayrıcalıklar' },
      { href: '/sss', label: 'Sık sorulan sorular', desc: 'Merak edilenler' },
    ],
  },
  { href: '/define-isaretleri', label: 'Define işaretleri' },
  {
    label: 'Rehberler',
    items: [
      { href: '/rehber', label: 'Tüm rehberler', desc: 'Sikke, seramik, patina ve daha fazlası' },
      { href: '/bolgeler', label: 'Tarihi bölgeler', desc: 'Hitit’ten Kommagene’ye uygarlıklar' },
      { href: '/rehber/tarihi-eser-bulursam-ne-yapmaliyim', label: 'Eser bulursam ne yapmalıyım?', desc: 'Yasal bildirim adımları' },
      { href: '/rehber/anadolu-arkeolojik-donemler', label: 'Arkeolojik dönemler', desc: 'Anadolu zaman çizelgesi' },
    ],
  },
  { href: '/haberler', label: 'Haberler' },
  {
    label: 'Kurumsal',
    items: [
      { href: '/hakkimizda', label: 'Hakkımızda', desc: 'Amacımız ve yayın ilkelerimiz' },
      { href: '/iletisim', label: 'İletişim', desc: 'Bize ulaşın' },
      { href: '/gizlilik', label: 'Gizlilik politikası', desc: '' },
      { href: '/abonelik', label: 'Abonelik koşulları', desc: '' },
    ],
  },
];

export const CSS = `
:root{--bg:#120E0A;--bg2:#18130E;--surface:#1F1912;--surface2:#2A2219;--border:#3A2F22;--border2:#4A3C2A;--gold:#D4A24C;--gold-light:#F0C870;--text:#F3E9DA;--muted:#B5A58E;--green:#7FB069;--radius:18px}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--text);font:16.5px/1.75 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}a{color:var(--gold)}a:hover{color:var(--gold-light)}
h1,h2,h3{font-family:Georgia,"Times New Roman",serif;color:var(--gold-light);line-height:1.22;margin:0;font-weight:700;letter-spacing:.005em}
h1{font-size:clamp(2rem,5vw,3rem)}h2{font-size:clamp(1.35rem,3vw,1.75rem);margin:38px 0 12px}h3{font-size:1.15rem}
p{margin:0 0 14px}ul{padding-left:1.25rem;margin:8px 0 16px}li{margin:4px 0}
.wrap{max-width:1160px;margin:0 auto;padding:0 20px}.narrow{max-width:820px}
.muted{color:var(--muted)}.lead{color:var(--muted);font-size:1.12rem;max-width:720px}
.eyebrow{color:var(--gold);font-size:.78rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;margin:0 0 10px}
.btn{display:inline-flex;align-items:center;gap:10px;padding:12px 22px;border-radius:999px;font-weight:700;text-decoration:none;border:1px solid transparent;font-size:1rem;line-height:1.2;transition:transform .15s,background .15s}
.btn:hover{transform:translateY(-1px)}.btn-gold,.btn{background:var(--gold);color:#1a1208}.btn-gold:hover,.btn:hover{background:var(--gold-light);color:#1a1208}
.btn-ghost{background:var(--surface);border-color:var(--border2);color:var(--text)}.btn-ghost:hover{background:var(--surface2);color:var(--gold-light)}

/* üst çubuk */
.top{position:sticky;top:0;z-index:50;background:rgba(18,14,10,.9);backdrop-filter:saturate(1.4) blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid rgba(58,47,34,.8)}
.bar{display:flex;align-items:center;gap:18px;height:68px}
.logo{display:flex;align-items:center;gap:11px;text-decoration:none;color:var(--gold-light);font-family:Georgia,serif;font-weight:700;font-size:1.22rem;letter-spacing:.04em;white-space:nowrap}
.logo img{width:38px;height:38px;border-radius:11px;box-shadow:0 4px 14px rgba(0,0,0,.4)}
.menu{display:flex;align-items:center;gap:2px;margin-left:auto;list-style:none;padding:0;margin-top:0;margin-bottom:0}
.menu>li{position:relative;margin:0}
.menu>li>a,.menu>li>span{display:flex;align-items:center;gap:6px;padding:10px 13px;border-radius:10px;color:var(--text);text-decoration:none;font-size:.95rem;font-weight:500;cursor:pointer;white-space:nowrap}
.menu>li>a:hover,.menu>li:hover>span,.menu>li:focus-within>span,.menu>li>a.on,.menu>li>span.on{color:var(--gold-light);background:var(--surface)}
.menu>li>span::after{content:"";width:7px;height:7px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg) translateY(-3px);opacity:.7}
.drop{position:absolute;top:100%;left:-8px;min-width:300px;padding:10px;background:var(--bg2);border:1px solid var(--border2);border-radius:16px;box-shadow:0 24px 50px rgba(0,0,0,.55);opacity:0;visibility:hidden;transform:translateY(6px);transition:.16s;list-style:none;margin:0}
.menu>li:hover .drop,.menu>li:focus-within .drop{opacity:1;visibility:visible;transform:none}
.drop li{margin:0}.drop a{display:block;padding:10px 12px;border-radius:10px;text-decoration:none;color:var(--text)}
.drop a:hover{background:var(--surface)}.drop b{display:block;font-weight:600;font-size:.95rem}.drop small{display:block;color:var(--muted);font-size:.82rem;line-height:1.4}
.bar .btn{padding:10px 18px;font-size:.92rem;margin-left:8px;white-space:nowrap}
.burger,.navtoggle{display:none}
@media(max-width:1020px){
  .menu,.bar .btn{display:none}
  .burger{display:flex;margin-left:auto;width:44px;height:44px;border-radius:12px;border:1px solid var(--border2);background:var(--surface);align-items:center;justify-content:center;cursor:pointer}
  .burger i,.burger i::before,.burger i::after{display:block;width:20px;height:2px;background:var(--gold-light);border-radius:2px;position:relative;transition:.2s}
  .burger i::before,.burger i::after{content:"";position:absolute;left:0}.burger i::before{top:-6px}.burger i::after{top:6px}
  .navtoggle:checked~.top .burger i{background:transparent}.navtoggle:checked~.top .burger i::before{top:0;transform:rotate(45deg)}.navtoggle:checked~.top .burger i::after{top:0;transform:rotate(-45deg)}
  .mnav{display:none;max-height:calc(100vh - 68px);overflow-y:auto;border-top:1px solid var(--border);padding:8px 20px 26px;background:var(--bg2)}
  .navtoggle:checked~.top .mnav{display:block}
  .mnav h4{margin:18px 0 6px;color:var(--gold);font-size:.75rem;letter-spacing:.16em;text-transform:uppercase;font-family:system-ui,sans-serif}
  .mnav a{display:block;padding:11px 4px;border-bottom:1px solid rgba(58,47,34,.6);color:var(--text);text-decoration:none;font-size:1.02rem}
  .mnav a.on{color:var(--gold-light)}.mnav .btn{display:flex;justify-content:center;margin-top:20px;border:0}
}
@media(min-width:1021px){.mnav{display:none}}

/* sayfa başlığı ve gövde */
main{min-height:60vh}
.phead{padding:46px 0 34px;background:radial-gradient(800px 340px at 85% -10%,rgba(212,162,76,.16),transparent 70%),linear-gradient(180deg,var(--bg2),var(--bg));border-bottom:1px solid var(--border)}
.phead h1{margin:6px 0 12px}.phead .lead{margin:0}
.crumb{color:var(--muted);font-size:.85rem;margin-bottom:14px}.crumb a{color:var(--muted);text-decoration:none}.crumb a:hover{color:var(--gold-light)}
.body{padding:36px 0 64px}.body>.wrap>h2:first-child{margin-top:0}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:22px 24px;margin:16px 0}.card p:last-child{margin-bottom:0}
.toc{background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--gold);border-radius:14px;padding:16px 22px;margin:22px 0}.toc ul{margin:6px 0 0}
.hero-img{border-radius:var(--radius);overflow:hidden;border:1px solid var(--border);margin:22px 0;aspect-ratio:16/9}.hero-img img{width:100%;height:100%;object-fit:cover}
.chip{display:inline-flex;align-items:center;gap:7px;padding:4px 12px;border-radius:999px;border:1px solid;font-size:.85rem;font-weight:600}
.chip i{width:8px;height:8px;border-radius:50%;display:inline-block}
.warn{background:rgba(224,164,58,.08);border:1px solid rgba(224,164,58,.4);border-radius:16px;padding:18px 20px;font-size:.95rem;margin:30px 0}
.cta{background:linear-gradient(135deg,rgba(212,162,76,.18),rgba(31,25,18,.9));border:1px solid rgba(212,162,76,.6);border-radius:22px;padding:28px;margin:36px 0;display:flex;flex-wrap:wrap;gap:18px;align-items:center;justify-content:space-between}
.cta h2{margin:0 0 6px}.cta p{margin:0;color:var(--muted)}.cta>div{flex:1 1 380px}
.faq details{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:0 20px;margin:10px 0}
.faq summary{cursor:pointer;padding:16px 0;font-weight:700;list-style:none;display:flex;justify-content:space-between;gap:16px;color:var(--text)}
.faq summary::-webkit-details-marker{display:none}.faq summary::after{content:"+";color:var(--gold);font-size:1.4rem;line-height:1}
.faq details[open] summary::after{content:"–"}.faq details p{color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px;margin:18px 0}
.tile{display:block;background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;text-decoration:none;color:var(--text);transition:transform .15s,border-color .15s}
.tile:hover{transform:translateY(-3px);border-color:var(--gold)}
.tile img{width:100%;aspect-ratio:16/10;object-fit:cover}.tile div{padding:14px 16px}.tile b{display:block;color:var(--gold-light);font-family:Georgia,serif;font-size:1.05rem}.tile span{font-size:.88rem;color:var(--muted)}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;margin:22px 0}
.feat{display:block;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:24px;text-decoration:none;color:var(--text);transition:transform .15s,border-color .15s}
a.feat:hover{transform:translateY(-3px);border-color:var(--gold)}.feat .ic{font-size:1.7rem;margin-bottom:10px}.feat h3{margin-bottom:6px}.feat p{margin:0;color:var(--muted);font-size:.97rem}
.feat .more{display:inline-block;margin-top:12px;color:var(--gold);font-weight:600;font-size:.92rem}
.news{display:block;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:22px 24px;margin:14px 0;text-decoration:none;color:var(--text);transition:border-color .15s}
.news:hover{border-color:var(--gold)}.news time{color:var(--gold);font-size:.82rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}.news h3{margin:6px 0 8px;font-size:1.2rem}.news p{margin:0;color:var(--muted)}
.prose{font-size:1.04rem}.prose h2{scroll-margin-top:90px}.prose p{color:#E9DECD}
.sec{padding:72px 0}.sec.alt{background:var(--bg2);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}.center{text-align:center}.center .lead{margin-left:auto;margin-right:auto}
.split{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
.phone{border-radius:30px;padding:8px;background:linear-gradient(160deg,#3a2f22,#17120d);border:1px solid var(--border2);box-shadow:0 30px 60px rgba(0,0,0,.55)}
.phone img{border-radius:23px;width:100%;height:auto;aspect-ratio:9/16;object-fit:cover}
.vphone{max-width:340px;margin:0 auto;border-radius:34px;padding:9px;background:linear-gradient(160deg,#3a2f22,#17120d);border:1px solid var(--border2);box-shadow:0 30px 60px rgba(0,0,0,.55)}
.vphone video{display:block;width:100%;height:auto;aspect-ratio:9/16;border-radius:26px;background:#000}
table{width:100%;border-collapse:collapse;margin:18px 0;font-size:.97rem}th,td{padding:12px 14px;border-bottom:1px solid var(--border);text-align:left}th{color:var(--gold-light);font-family:Georgia,serif}
td.y{color:var(--green);font-weight:700}td.n{color:var(--muted)}

/* alt bilgi */
.foot{background:#0E0B08;border-top:1px solid var(--border);padding:54px 0 30px;color:var(--muted);font-size:.93rem}
.fgrid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:34px}
.fgrid h4{color:var(--gold-light);font-family:Georgia,serif;font-size:1rem;margin:0 0 12px}
.fgrid a{display:block;color:var(--muted);text-decoration:none;padding:4px 0}.fgrid a:hover{color:var(--gold-light)}
.fgrid a.logo{display:flex;color:var(--gold-light);padding:0;margin-bottom:12px}.fbrand p{max-width:340px}
.fbottom{margin-top:36px;padding-top:20px;border-top:1px solid var(--border);display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;font-size:.84rem}
.fbottom a{color:var(--gold)}
@media(max-width:860px){.fgrid{grid-template-columns:1fr 1fr}.fbrand{grid-column:1/-1}.split{grid-template-columns:1fr}.sec{padding:54px 0}.phead{padding:32px 0 26px}}
@media(max-width:520px){body{font-size:16px}.cta{padding:22px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{transition:none!important}}
`;

const isOn = (path, href) => href === path || (href !== '/' && path.startsWith(href + '/'));

export function header(path) {
  const desktop = MENU.map((m) => {
    if (m.href) return `<li><a href="${m.href}"${isOn(path, m.href) ? ' class="on"' : ''}>${esc(m.label)}</a></li>`;
    const on = m.items.some((i) => isOn(path, i.href));
    return `<li><span tabindex="0"${on ? ' class="on"' : ''}>${esc(m.label)}</span><ul class="drop">${m.items
      .map((i) => `<li><a href="${i.href}"><b>${esc(i.label)}</b>${i.desc ? `<small>${esc(i.desc)}</small>` : ''}</a></li>`)
      .join('')}</ul></li>`;
  }).join('');
  // Mobilde tek bağlantılı öğeler "Keşfet" başlığı altında toplanır.
  const mlink = (i) => `<a href="${i.href}"${isOn(path, i.href) ? ' class="on"' : ''}>${esc(i.label)}</a>`;
  const mobile =
    `<h4>Keşfet</h4>${MENU.filter((m) => m.href).map(mlink).join('')}` +
    MENU.filter((m) => m.items).map((m) => `<h4>${esc(m.label)}</h4>${m.items.map(mlink).join('')}`).join('');
  return `<input type="checkbox" id="navt" class="navtoggle" aria-hidden="true">
<header class="top"><div class="wrap bar">
<a class="logo" href="/"><img src="/site/icon.png" alt="" width="38" height="38">Defineciler</a>
<nav aria-label="Ana menü" style="display:contents"><ul class="menu">${desktop}</ul></nav>
<a class="btn" href="${PLAY_URL}">Google Play'den indir</a>
<label for="navt" class="burger" aria-label="Menüyü aç"><i></i></label>
</div><nav class="mnav" aria-label="Mobil menü"><a href="/"${path === '/' ? ' class="on"' : ''}>Ana sayfa</a>${mobile}<a class="btn" href="${PLAY_URL}">▶ Google Play'den indir</a></nav></header>`;
}

export const footer = () => `<footer class="foot"><div class="wrap">
<div class="fgrid">
<div class="fbrand"><a class="logo" href="/"><img src="/site/icon.png" alt="" width="38" height="38">Defineciler</a>
<p>Anadolu’nun tarihi eserlerini, sikkelerini ve define işaretlerini halk yorumu ile bilimsel karşılığını ayırarak anlatan bilgi sitesi ve mobil uygulama.</p>
<a class="btn" href="${PLAY_URL}" style="display:inline-flex;color:#1a1208;padding:10px 18px;font-size:.9rem">▶ Google Play'den indir</a></div>
<div><h4>Uygulama</h4>${MENU[0].items.map((i) => `<a href="${i.href}">${esc(i.label)}</a>`).join('')}</div>
<div><h4>Keşfet</h4><a href="/define-isaretleri">Define işaretleri</a><a href="/rehber">Rehberler</a><a href="/bolgeler">Tarihi bölgeler</a><a href="/haberler">Arkeoloji haberleri</a><a href="/rehber/tarihi-eser-bulursam-ne-yapmaliyim">Eser bulursam ne yapmalıyım?</a></div>
<div><h4>Kurumsal</h4><a href="/hakkimizda">Hakkımızda</a><a href="/iletisim">İletişim</a><a href="/gizlilik">Gizlilik politikası</a><a href="/abonelik">Abonelik koşulları</a></div>
</div>
<div class="fbottom"><span>Bu site bilgilendirme amaçlıdır; kazıyı, define aramayı ya da kültür varlığı ticaretini teşvik etmez. İzinsiz kazı 2863 sayılı Kanun’a göre suçtur.</span><span>© ${new Date().getFullYear()} Defineciler · Geliştirici: <a href="https://dronopter.com.tr" rel="noopener">Dronopter</a></span></div>
</div></footer>`;

/** Tam HTML belgesi. `body` main içeriğidir; `phead` verilirse sayfa başlığı bandı olarak basılır. */
export function page({ title, description, path, image, extra = '', type = 'article', body }) {
  return `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<link rel="canonical" href="${BASE}${path}"><meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#120E0A"><link rel="icon" href="/site/icon.png">
<meta property="og:type" content="${type}"><meta property="og:locale" content="tr_TR"><meta property="og:site_name" content="Defineciler">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${BASE}${path}">
<meta property="og:image" content="${BASE}${image ?? '/site/og.jpg'}"><meta name="twitter:card" content="summary_large_image">
${extra}<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3204109869365538" crossorigin="anonymous"></script>
<style>${CSS}</style></head><body>
${header(path)}
<main>${body}</main>
${footer()}
</body></html>`;
}

/** İç sayfa başlık bandı + gövde. crumbs: [[ad, href?], ...] */
export function inner({ crumbs = [], eyebrow, h1, lead, meta, wide = false, content }) {
  const cr = crumbs.length
    ? `<div class="crumb"><a href="/">Defineciler</a>${crumbs.map(([n, h]) => ` › ${h ? `<a href="${h}">${esc(n)}</a>` : esc(n)}`).join('')}</div>`
    : '';
  return `<div class="phead"><div class="wrap${wide ? '' : ' narrow'}">${cr}${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h1>${esc(h1)}</h1>${meta ? `<p class="muted" style="font-size:.88rem;margin:0 0 12px">${meta}</p>` : ''}${lead ? `<p class="lead">${esc(lead)}</p>` : ''}</div></div>
<div class="body"><div class="wrap${wide ? '' : ' narrow'} prose">${content}</div></div>`;
}
