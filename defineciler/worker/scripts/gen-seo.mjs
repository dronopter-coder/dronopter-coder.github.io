// Arama motorları için sayfalar üretir: "Define işaretleri" dizini, her işaret için ayrı sayfa, sitemap.xml ve robots.txt.
// Çıktı: src/seo.generated.ts (Worker bunu sunar). Çalıştırma (depo kökünden):
//   node --experimental-strip-types defineciler/worker/scripts/gen-seo.mjs
// Not: İşaret sayfaları özet, arkeolojik karşılık, yer/dönem ve yorum sınırını gösterir; halk yorumlarının yalnızca
// ilkini gösterir, kalanını ve ilgili işaretleri uygulamaya bırakır (Pro içeriğini ve indirme nedenini korumak için).
import { writeFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GUIDES, REGIONS } from './guides.mjs';
import { NEWS } from './news.mjs';
import { EVIDENCE, SIGN_CATEGORIES, SIGNS } from '../../src/data/signs.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..');
const OUT = join(HERE, '..', 'src', 'seo.generated.ts');
const BASE = 'https://defineciler.online';
const TODAY = new Date().toISOString().slice(0, 10);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const hasImg = (id) => existsSync(join(ROOT, 'site', `s-${id}.webp`));
const lower = (s) => s.toLocaleLowerCase('tr-TR');

const CSS = `
:root{--bg:#14100C;--bg2:#1A140E;--surface:#1F1912;--border:#3A2F22;--gold:#D4A24C;--gold-light:#F0C870;--text:#F3E9DA;--muted:#B5A58E}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.7 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:var(--gold)}img{max-width:100%;display:block}h1,h2,h3{font-family:Georgia,"Times New Roman",serif;color:var(--gold-light);line-height:1.25;margin:0}
.wrap{max-width:860px;margin:0 auto;padding:0 20px}header{border-bottom:1px solid var(--border);background:var(--bg2)}
.nav{display:flex;align-items:center;justify-content:space-between;height:60px}.logo{display:flex;align-items:center;gap:10px;color:var(--gold-light);font-family:Georgia,serif;font-weight:700;text-decoration:none;letter-spacing:.04em}
.logo img{width:32px;height:32px;border-radius:9px}.nav a.s{color:var(--muted);text-decoration:none;font-size:.92rem;margin-left:14px}@media(max-width:520px){.nav a.s{margin-left:10px;font-size:.82rem}.logo{font-size:.95rem}}
.faq details{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px 18px;margin:10px 0}.faq summary{cursor:pointer;font-weight:600;color:var(--gold-light)}.faq p{margin:10px 0 0}
main{padding:34px 0 56px}.crumb{color:var(--muted);font-size:.85rem;margin-bottom:18px}.crumb a{color:var(--muted)}
h1{font-size:clamp(1.8rem,5vw,2.5rem);margin-bottom:10px}h2{font-size:1.3rem;margin:30px 0 10px}
.hero{border-radius:18px;overflow:hidden;border:1px solid var(--border);margin:18px 0 6px;aspect-ratio:16/9}.hero img{width:100%;height:100%;object-fit:cover}
.chip{display:inline-flex;align-items:center;gap:7px;padding:4px 12px;border-radius:999px;border:1px solid;font-size:.85rem;font-weight:600}
.chip i{width:8px;height:8px;border-radius:50%;display:inline-block}
.card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:20px 22px;margin:14px 0}.card p{margin:0}
.lead{color:var(--muted);font-size:1.08rem}.muted{color:var(--muted)}ul{padding-left:1.2rem;margin:8px 0}
.cta{background:linear-gradient(180deg,rgba(212,162,76,.14),var(--surface));border:1px solid var(--gold);border-radius:18px;padding:22px;margin:30px 0}
.btn{display:inline-block;margin-top:12px;padding:12px 22px;border-radius:999px;background:var(--gold);color:#1a1208;font-weight:700;text-decoration:none}
.warn{background:rgba(224,164,58,.08);border:1px solid rgba(224,164,58,.4);border-radius:14px;padding:16px 18px;font-size:.92rem;margin-top:26px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px;margin:16px 0}
.tile{display:block;background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;text-decoration:none;color:var(--text)}
.tile img{width:100%;aspect-ratio:4/3;object-fit:cover}.tile div{padding:12px 14px}.tile b{display:block;color:var(--gold-light);font-family:Georgia,serif}.tile span{font-size:.85rem;color:var(--muted)}
footer{border-top:1px solid var(--border);padding:26px 0 40px;color:var(--muted);font-size:.88rem}footer a{color:var(--muted);margin-right:16px}
`;

const head = ({ title, description, path, image, extra = '' }) => `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<link rel="canonical" href="${BASE}${path}"><meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#14100C"><link rel="icon" href="/site/icon.png">
<meta property="og:type" content="article"><meta property="og:locale" content="tr_TR"><meta property="og:site_name" content="Defineciler">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${BASE}${path}">
<meta property="og:image" content="${BASE}${image ?? '/site/og.jpg'}"><meta name="twitter:card" content="summary_large_image">
${extra}<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3204109869365538" crossorigin="anonymous"></script><style>${CSS}</style></head><body>
<header><div class="wrap nav"><a class="logo" href="/"><img src="/site/icon.png" alt="" width="32" height="32">Defineciler</a><a class="s" href="/rehber">Rehberler</a><a class="s" href="/define-isaretleri">İşaretler</a><a class="s" href="/haberler">Haberler</a></div></header>
<main><div class="wrap">`;

const foot = `</div></main><footer><div class="wrap"><a href="/">Ana sayfa</a><a href="/define-isaretleri">Define işaretleri</a><a href="/rehber">Rehberler</a><a href="/haberler">Haberler</a><a href="/gizlilik">Gizlilik</a><a href="/abonelik">Abonelik koşulları</a><a href="/hakkimizda">Hakkımızda</a><a href="/iletisim">İletişim</a>
<p>Bu sayfa bilgilendirme amaçlıdır. Kazıyı, define aramayı ya da kültür varlığı ticaretini teşvik etmez; izinsiz kazı ve kültür varlıklarına zarar vermek 2863 sayılı Kanun’a göre suçtur.</p>
<p>Geliştirici: <a href="https://dronopter.com.tr" rel="noopener" style="color:var(--gold);margin:0">Dronopter</a></p></div></footer></body></html>`;

const warning = `<div class="warn"><b>Önemli:</b> Böyle bir işaret görürseniz kazmayın, boyamayın ve yerinden oynatmayın. Fotoğrafını çekip konumunu en yakın müze müdürlüğüne ya da mülki amirliğe bildirin (2863 sayılı Kanun). Bulunan eserlerin 3 gün içinde bildirilmesi zorunludur.</div>`;

const chip = (ev) => {
  const e = EVIDENCE[ev];
  return `<span class="chip" style="color:${e.color};border-color:${e.color}99;background:${e.color}1F"><i style="background:${e.color}"></i>${esc(e.label)}</span>`;
};

const pages = {};
const faqLd = (faq) => ({
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});
const EVIDENCE_ANSWER = {
  iz: 'gerçek bir antik yapı ya da kalıntıdır ve kültür varlığı olarak korunur',
  sembol: 'anlamı bilinen kültürel bir motiftir',
  halk: 'büyük ölçüde halk yorumudur; örneklerin çoğu doğal oluşum ya da rastlantıdır',
};
const signFaq = (s) => [
  [`${s.title} işareti define olduğunu mu gösterir?`, `Hayır, bunu gösteren bilimsel bir kanıt yoktur. ${s.title} ${EVIDENCE_ANSWER[s.evidence]}. ${s.limit}`],
  [`${s.title} işareti nerede ve hangi dönemlerde görülür?`, s.where],
  [`${s.title} işareti görürsem ne yapmalıyım?`, 'Kazmayın, boyamayın ve yerinden oynatmayın. Fotoğrafını çekip konumunu en yakın müze müdürlüğüne ya da mülki amirliğe bildirin; 2863 sayılı Kanun buluntuların 3 gün içinde bildirilmesini öngörür.'],
];
const words = (g) => [g.lead, ...g.sections.flatMap(([h, ps]) => [h, ...ps]), ...(g.faq ?? []).flat()].join(' ').split(/\s+/).length;
const byId = Object.fromEntries(SIGNS.map((s) => [s.id, s]));

// Her işaret için sayfa
for (const s of SIGNS) {
  const path = `/define-isaretleri/${s.id}`;
  const cat = SIGN_CATEGORIES.find((c) => c.id === s.category);
  const title = `${s.title} define işareti ne anlama gelir? Halk yorumu ve arkeolojik gerçek | Defineciler`;
  const description = `${s.title} işareti: ${s.summary} Halk arasındaki yorumu, tarih ve arkeolojideki karşılığı, nerede görüldüğü ve yorumun sınırı.`.slice(0, 300);
  const img = hasImg(s.id) ? `/site/s-${s.id}.webp` : undefined;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: `${s.title} define işareti ne anlama gelir?`,
        description: s.summary,
        inLanguage: 'tr-TR',
        dateModified: TODAY,
        mainEntityOfPage: `${BASE}${path}`,
        image: img ? `${BASE}${img}` : `${BASE}/site/og.jpg`,
        author: { '@type': 'Organization', name: 'Defineciler' },
        publisher: { '@type': 'Organization', name: 'Defineciler', logo: { '@type': 'ImageObject', url: `${BASE}/site/icon.png` } },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Defineciler', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: 'Define işaretleri', item: `${BASE}/define-isaretleri` },
          { '@type': 'ListItem', position: 3, name: s.title, item: `${BASE}${path}` },
        ],
      },
      faqLd(signFaq(s)),
    ],
  };
  const folkFirst = s.folk[0];
  const more = s.folk.length > 1;
  pages[path] =
    head({ title, description, path, image: img, extra: `<script type="application/ld+json">${JSON.stringify(ld)}</script>` }) +
    `<div class="crumb"><a href="/">Defineciler</a> › <a href="/define-isaretleri">Define işaretleri</a> › ${esc(s.title)}</div>
<p class="muted" style="margin:0 0 6px;text-transform:uppercase;letter-spacing:.1em;font-size:.8rem">${esc(cat?.label ?? '')}</p>
<h1>${esc(s.title)} define işareti ne anlama gelir?</h1>
${s.aka ? `<p class="muted" style="margin:0 0 10px">Diğer adları: ${esc(s.aka)}</p>` : ''}
<p class="lead">${esc(s.summary)}</p>
<p>${chip(s.evidence)}</p>
${img ? `<div class="hero"><img src="${img}" alt="${esc(s.title)} işareti örneği" width="320" height="240"></div>` : ''}
<h2>Halk arasında nasıl yorumlanır?</h2>
<div class="card"><ul><li>${esc(folkFirst)}</li></ul>${more ? `<p class="muted" style="margin-top:10px">Diğer yorumlar ve ilgili işaretler Defineciler uygulamasında.</p>` : ''}
<p class="muted" style="margin-top:10px;font-style:italic">Bu yorumlar definecilik çevrelerinde anlatılanlardır; doğrulukları kanıtlanmamıştır.</p></div>
<h2>Tarih ve arkeolojideki karşılığı</h2>
<div class="card"><p>${esc(s.science)}</p></div>
<h2>Nerede ve hangi dönemde görülür?</h2>
<div class="card"><p>${esc(s.where)}</p></div>
<h2>Yorumun sınırı</h2>
<div class="card"><p><b>${esc(EVIDENCE[s.evidence].label)}.</b> ${esc(EVIDENCE[s.evidence].desc)} ${esc(s.limit)}</p></div>
<h2>Sık sorulan sorular</h2><div class="faq">${signFaq(s).map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
<h2>${esc(cat?.label ?? 'İlgili işaretler')}: ilgili işaretler</h2>
<p class="muted" style="margin:0">${esc(cat?.desc ?? '')}. Aynı gruptaki diğer işaretlerin halk yorumu ve arkeolojik karşılığı:</p>
<div class="grid">${SIGNS.filter((o) => o.category === s.category && o.id !== s.id).slice(0, 4).map((o) => `<a class="tile" href="/define-isaretleri/${o.id}">${hasImg(o.id) ? `<img src="/site/s-${o.id}.webp" alt="${esc(o.title)} işareti" loading="lazy" width="320" height="240">` : ''}<div><b>${esc(o.title)}</b><span>${esc(EVIDENCE[o.evidence].label)}</span></div></a>`).join('')}</div>
<p>Konuyla ilgili rehberler: <a href="/rehber/define-efsaneleri-ve-gercekler">Define efsaneleri ve gerçekler</a> · <a href="/rehber/tarihi-eser-bulursam-ne-yapmaliyim">Tarihi eser bulursam ne yapmalıyım?</a></p>
${warning}
<div class="cta"><h2 style="margin:0 0 6px">Elindeki esere ya da işarete mi bakıyorsun?</h2>
<p style="margin:0">Fotoğrafını çek; Defineciler ${esc(lower(s.title))} gibi işaretleri ve eserleri değerlendirsin. 35 define işaretinin tamamı, tarihi bölgeler ve rehberler uygulamada.</p>
<a class="btn" href="/#indir">Defineciler'i keşfet</a></div>` +
    foot;
}

// Dizin sayfası
{
  const path = '/define-isaretleri';
  const title = 'Define işaretleri ve anlamları: 35 işaret, halk yorumu ve arkeolojik gerçek | Defineciler';
  const description =
    'Yılan, kartal, el izi, çanak oyuk, tümülüs ve daha fazlası: 35 define işaretinin halk arasındaki yorumu, tarih ve arkeolojideki gerçek karşılığı ve yorumun sınırı.';
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Define işaretleri ve anlamları',
    description,
    inLanguage: 'tr-TR',
    url: `${BASE}${path}`,
    hasPart: SIGNS.map((s) => ({ '@type': 'Article', headline: `${s.title} define işareti`, url: `${BASE}/define-isaretleri/${s.id}` })),
  };
  pages[path] =
    head({ title, description, path, extra: `<script type="application/ld+json">${JSON.stringify(ld)}</script>` }) +
    `<div class="crumb"><a href="/">Defineciler</a> › Define işaretleri</div>
<h1>Define işaretleri ve anlamları</h1>
<p class="lead">Taşlarda ve kayalarda görülen işaretler halk arasında çok farklı yorumlanır. Burada ${SIGNS.length} işareti, halk yorumu ile tarih ve arkeolojideki gerçek karşılığını ayırarak anlatıyoruz.</p>
<h2>Önce bunu okuyun: yorumun sınırı</h2>
<div class="card"><p>Her işaret üç düzeyden birine girer: ${chip('iz')} gerçek bir antik yapı ya da kalıntı, ${chip('sembol')} anlamı bilinen kültürel motif, ${chip('halk')} büyük ölçüde halk yorumu. Bir işaretin “define var” anlamına geldiğine dair bilimsel kanıt yoktur; örneklerin çoğu doğal oluşum ya da rastlantıdır.</p></div>
${SIGN_CATEGORIES.map((c) => {
      const list = SIGNS.filter((s) => s.category === c.id);
      return `<h2>${esc(c.label)}</h2><p class="muted" style="margin:0">${esc(c.desc)}</p><div class="grid">${list
        .map(
          (s) =>
            `<a class="tile" href="/define-isaretleri/${s.id}">${hasImg(s.id) ? `<img src="/site/s-${s.id}.webp" alt="${esc(s.title)} işareti" loading="lazy" width="320" height="240">` : ''}<div><b>${esc(s.title)}</b><span>${esc(EVIDENCE[s.evidence].label)}</span></div></a>`,
        )
        .join('')}</div>`;
    }).join('')}
${warning}
<div class="cta"><h2 style="margin:0 0 6px">Defineciler uygulamasında hepsi bir arada</h2><p style="margin:0">Halk yorumlarının tamamı, ilgili işaretler, Anadolu’nun tarihi bölgeleri ve eser tanıma. Elindeki eserin fotoğrafını çek, dönemini ve anlamını öğren.</p><a class="btn" href="/#indir">Uygulamayı keşfet</a></div>` +
    foot;
}

// Rehber ve bölge sayfaları
const articlePage = (kind, g, others) => {
  const base = kind === 'rehber' ? '/rehber' : '/bolgeler';
  const path = `${base}/${g.id}`;
  const title = `${g.title} | Defineciler`;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', headline: g.title, description: g.lead, inLanguage: 'tr-TR', dateModified: TODAY, mainEntityOfPage: `${BASE}${path}`,
        author: { '@type': 'Organization', name: 'Defineciler' },
        publisher: { '@type': 'Organization', name: 'Defineciler', logo: { '@type': 'ImageObject', url: `${BASE}/site/icon.png` } } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Defineciler', item: `${BASE}/` },
        { '@type': 'ListItem', position: 2, name: kind === 'rehber' ? 'Rehberler' : 'Tarihi bölgeler', item: `${BASE}/rehber` },
        { '@type': 'ListItem', position: 3, name: g.title, item: `${BASE}${path}` } ] },
      ...(g.faq?.length ? [faqLd(g.faq)] : []),
    ],
  };
  pages[path] =
    head({ title, description: g.lead.slice(0, 300), path, extra: `<script type="application/ld+json">${JSON.stringify(ld)}</script>` }) +
    `<div class="crumb"><a href="/">Defineciler</a> › <a href="/rehber">Rehberler</a> › ${esc(g.title)}</div>
<h1>${esc(g.title)}</h1><p class="muted" style="margin:0 0 10px;font-size:.88rem">Okuma süresi: ${Math.max(2, Math.round(words(g) / 180))} dk · Güncelleme: ${TODAY.split('-').reverse().join('.')} · <a href="/hakkimizda#ilkeler">Yayın ilkelerimiz</a></p><p class="lead">${esc(g.lead)}</p>
${g.sections.length > 3 ? `<div class="card"><b>Bu yazıda</b><ul>${g.sections.map(([h], i) => `<li><a href="#b${i + 1}">${esc(h)}</a></li>`).join('')}</ul></div>` : ''}
${g.sections.map(([h, ps], i) => `<h2 id="b${i + 1}">${esc(h)}</h2>${ps.map((t) => `<p>${esc(t)}</p>`).join('')}`).join('')}
${g.faq?.length ? `<h2>Sık sorulan sorular</h2><div class="faq">${g.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>` : ''}
<h2>Bunlar da ilginizi çekebilir</h2><ul>${others.filter((o) => o.id !== g.id).slice(0, 4).map((o) => `<li><a href="${o.href}">${esc(o.title)}</a></li>`).join('')}<li><a href="/define-isaretleri">Define işaretleri ve anlamları</a></li></ul>
${warning}
<div class="cta"><h2 style="margin:0 0 6px">Elindeki eseri tanımak ister misin?</h2><p style="margin:0">Fotoğrafını çek; Defineciler dönemini ve anlamını anlatsın.</p><a class="btn" href="/#indir">Defineciler'i keşfet</a></div>` +
    foot;
};
const allLinks = [
  ...GUIDES.map((g) => ({ id: g.id, title: g.title, href: `/rehber/${g.id}` })),
  ...REGIONS.map((g) => ({ id: g.id, title: g.title, href: `/bolgeler/${g.id}` })),
];
for (const g of GUIDES) articlePage('rehber', g, allLinks);
for (const g of REGIONS) articlePage('bolge', g, allLinks);
{
  const path = '/rehber';
  const title = 'Define ve eser rehberleri: tarihi eser bulursan ne yapmalısın, sikke nasıl okunur | Defineciler';
  const description = 'Tarihi eser bildirimi, sikke okuma, patina, sahte eser ayrımı, define efsaneleri ve Anadolu’nun tarihi bölgeleri için rehber yazıları.';
  const li = (a) => `<li><a href="${a.href}">${esc(a.title)}</a></li>`;
  pages[path] =
    head({ title, description, path }) +
    `<div class="crumb"><a href="/">Defineciler</a> › Rehberler</div><h1>Define ve eser rehberleri</h1>
<p class="lead">Tarihi eser bulduğunuzda ne yapmalısınız, sikke ve patina nasıl okunur, Anadolu’nun hangi medeniyetleri nelerle tanınır?</p>
<h2>Rehberler</h2><ul>${allLinks.filter((a) => a.href.startsWith('/rehber/')).map(li).join('')}</ul>
<h2>Tarihi bölgeler ve medeniyetler</h2><ul>${allLinks.filter((a) => a.href.startsWith('/bolgeler/')).map(li).join('')}</ul>
<h2>İşaretler</h2><p><a href="/define-isaretleri">35 define işaretinin anlamı ve arkeolojik karşılığı</a></p>${warning}` +
    foot;
}

// Arkeoloji haberleri
const trDate = (d) => new Date(`${d}T12:00:00+03:00`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
const NEWS_SORTED = [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
for (const n of NEWS_SORTED) {
  const path = `/haberler/${n.id}`;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'NewsArticle', headline: n.title, description: n.lead, inLanguage: 'tr-TR', datePublished: `${n.date}T10:00:00+03:00`,
        dateModified: `${n.date}T10:00:00+03:00`, mainEntityOfPage: `${BASE}${path}`, image: `${BASE}/site/og.jpg`,
        author: { '@type': 'Organization', name: 'Defineciler', url: `${BASE}/hakkimizda` },
        publisher: { '@type': 'Organization', name: 'Defineciler', logo: { '@type': 'ImageObject', url: `${BASE}/site/icon.png` } } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Defineciler', item: `${BASE}/` },
        { '@type': 'ListItem', position: 2, name: 'Arkeoloji haberleri', item: `${BASE}/haberler` },
        { '@type': 'ListItem', position: 3, name: n.title, item: `${BASE}${path}` } ] },
    ],
  };
  const others = NEWS_SORTED.filter((o) => o.id !== n.id).slice(0, 3);
  pages[path] =
    head({ title: `${n.title} | Defineciler`, description: n.lead.slice(0, 300), path, extra: `<script type="application/ld+json">${JSON.stringify(ld)}</script>` }) +
    `<div class="crumb"><a href="/">Defineciler</a> › <a href="/haberler">Arkeoloji haberleri</a> › ${esc(n.title)}</div>
<p class="muted" style="margin:0 0 6px;text-transform:uppercase;letter-spacing:.1em;font-size:.8rem">Arkeoloji haberi · ${trDate(n.date)}</p>
<h1>${esc(n.title)}</h1><p class="lead">${esc(n.lead)}</p>
${n.paragraphs.map((t) => `<p>${esc(t)}</p>`).join('')}
<h2>Kaynaklar</h2><ul>${n.sources.map((x) => `<li><a href="${esc(x.url)}" rel="nofollow noopener" target="_blank">${esc(x.name)}</a></li>`).join('')}</ul>
<p class="muted" style="font-size:.88rem">Bu haber, kaynaklardaki bilgiler esas alınarak Defineciler editörlüğünce özetlenmiş ve arka plan bilgisiyle genişletilmiştir. Hata bildirimleri için <a href="/iletisim">iletişim</a>.</p>
${n.related?.length ? `<h2>Konuyla ilgili rehberler</h2><ul>${n.related.map((r) => `<li><a href="${r.href}">${esc(r.title)}</a></li>`).join('')}</ul>` : ''}
${others.length ? `<h2>Diğer haberler</h2><ul>${others.map((o) => `<li><a href="/haberler/${o.id}">${esc(o.title)}</a> <span class="muted">· ${trDate(o.date)}</span></li>`).join('')}</ul>` : ''}
${warning}` +
    foot;
}
{
  const path = '/haberler';
  pages[path] =
    head({ title: 'Arkeoloji haberleri: Türkiye’deki kazılardan son gelişmeler | Defineciler', description: 'Göbeklitepe, Karahantepe, Troya ve Anadolu’nun diğer kazılarından haftalık arkeoloji haberleri; özet, arka plan ve kaynaklarıyla.', path }) +
    `<div class="crumb"><a href="/">Defineciler</a> › Arkeoloji haberleri</div>
<h1>Arkeoloji haberleri</h1>
<p class="lead">Türkiye’deki kazılardan ve araştırmalardan öne çıkan gelişmeleri her hafta derliyor; her haberi kaynaklarıyla birlikte, anlaşılır bir arka plan bilgisiyle özetliyoruz.</p>
${NEWS_SORTED.map((n) => `<div class="card"><p class="muted" style="font-size:.85rem">${trDate(n.date)}</p><h2 style="margin:4px 0 8px;font-size:1.2rem"><a href="/haberler/${n.id}" style="color:var(--gold-light);text-decoration:none">${esc(n.title)}</a></h2><p>${esc(n.lead)}</p></div>`).join('')}
${warning}` +
    foot;
}

// Hakkımızda ve İletişim
{
  const path = '/hakkimizda';
  const title = 'Hakkımızda: Defineciler nedir, yayın ilkelerimiz | Defineciler';
  const description = 'Defineciler; Anadolu’nun tarihi eserlerini, sikkelerini ve define işaretlerini halk yorumu ile bilimsel karşılığını ayırarak anlatan bir bilgi sitesi ve mobil uygulamadır.';
  pages[path] =
    head({ title, description, path }) +
    `<div class="crumb"><a href="/">Defineciler</a> › Hakkımızda</div>
<h1>Hakkımızda</h1>
<p class="lead">Defineciler, Anadolu’nun zengin tarihi mirasını merak eden herkes için hazırlanmış bir bilgi sitesi ve mobil uygulamadır. Amacımız, halk arasında anlatılan define hikâyeleri ile tarih ve arkeolojinin söylediklerini birbirinden ayırarak doğru bilgiye kolay ulaşılmasını sağlamaktır.</p>
<h2>Ne yapıyoruz?</h2>
<p>Sitemizde Anadolu’da sık karşılaşılan 35 define işaretini, her birinin halk arasındaki yorumu ve tarih ile arkeolojideki gerçek karşılığıyla birlikte anlatıyoruz. Sikke okuma, seramik tarihleme, patina, sahte eser ayrımı ve tarihi eser bulunduğunda izlenecek yasal süreç gibi konularda rehber yazılar yayımlıyoruz. Hititlerden Kommagene’ye Anadolu’nun önemli uygarlıklarını tanıtan bölge yazıları da hazırlıyoruz.</p>
<p>Defineciler mobil uygulaması ise kullanıcıların bir eserin ya da sikkenin fotoğrafını çekerek muhtemel dönemi, uygarlığı ve özellikleri hakkında ön bilgi almasını sağlar. Uygulamanın verdiği sonuçlar tahminidir ve uzman incelemesinin yerini tutmaz.</p>
<h2 id="ilkeler">Yayın ilkelerimiz</h2>
<ul>
<li><b>Kazıyı teşvik etmiyoruz.</b> İzinsiz kazı ve kültür varlığı ticareti 2863 sayılı Kanun’a göre suçtur. Sitemizde yer tarifi, kazı yöntemi ya da define arama teknikleri yer almaz.</li>
<li><b>Halk yorumu ile bilimi ayırıyoruz.</b> Her işaret sayfasında halk arasındaki anlatı ile arkeolojik karşılık ayrı başlıklarda verilir ve “yorumun sınırı” açıkça belirtilir.</li>
<li><b>Temkinli tarihler veriyoruz.</b> Antik tarihlerin çoğu yaklaşıktır; kesin olmayan bilgileri “yaygın görüşe göre” gibi ifadelerle belirtiriz.</li>
<li><b>Korumayı öne çıkarıyoruz.</b> Bir eser ya da işaretle karşılaşan okurlarımıza her zaman dokunmamalarını ve en yakın müze müdürlüğüne bildirmelerini öneririz.</li>
</ul>
<h2>Kaynaklarımız</h2>
<p>Yazılarımızı hazırlarken müzelerin ve ören yerlerinin resmî tanıtımlarını, UNESCO Dünya Mirası kayıtlarını, kazı ekiplerinin yayımladığı raporları ve genel arkeoloji ile nümismatik başvuru kaynaklarını esas alıyoruz.</p>
<h2>Hata bildirimi ve düzeltme</h2>
<p>Bir yazımızda hata ya da eksik bilgi fark ederseniz <a href="/iletisim">iletişim sayfamızdan</a> bize yazabilirsiniz. Bildirimleri inceliyor, gerekli düzeltmeleri yapıyor ve sayfanın güncelleme tarihini yeniliyoruz.</p>
<h2>Geliştirici</h2>
<p>Defineciler web sitesi ve mobil uygulaması <a href="https://dronopter.com.tr" rel="noopener">Dronopter</a> tarafından geliştirilmektedir.</p>
${warning}` +
    foot;
}
{
  const path = '/iletisim';
  const title = 'İletişim | Defineciler';
  const description = 'Defineciler web sitesi ve mobil uygulaması ile ilgili soru, öneri ve hata bildirimleri için iletişim bilgileri.';
  pages[path] =
    head({ title, description, path }) +
    `<div class="crumb"><a href="/">Defineciler</a> › İletişim</div>
<h1>İletişim</h1>
<p class="lead">Soru, öneri, iş birliği teklifi ya da içeriklerimizle ilgili düzeltme bildirimleriniz için bize e-postayla ulaşabilirsiniz.</p>
<div class="card"><p><b>E-posta:</b> <a href="mailto:dronopter@gmail.com">dronopter@gmail.com</a></p><p style="margin-top:8px"><b>Geliştirici:</b> <a href="https://dronopter.com.tr" rel="noopener">Dronopter</a></p></div>
<h2>Bize yazmadan önce</h2>
<ul>
<li><b>Uygulama ve abonelik:</b> Defineciler Pro aboneliği Google Play üzerinden yönetilir. İptal ve iade işlemleri için <a href="/abonelik">abonelik koşullarımıza</a> bakabilirsiniz.</li>
<li><b>Gizlilik:</b> Verilerinizin nasıl işlendiğini <a href="/gizlilik">gizlilik politikamızda</a> anlatıyoruz.</li>
<li><b>Eser değerlendirmesi:</b> E-postayla gönderilen fotoğraflar üzerinden eser değerlendirmesi, değer biçme ya da alım satım aracılığı yapmıyoruz.</li>
<li><b>Bir eser buldunuz mu?</b> Lütfen <a href="/rehber/tarihi-eser-bulursam-ne-yapmaliyim">bildirim rehberimizi</a> okuyun ve en yakın müze müdürlüğüne başvurun.</li>
</ul>
<p>E-postalarınıza genellikle birkaç iş günü içinde yanıt vermeye çalışıyoruz.</p>` +
    foot;
}

const urls = [
  ['/', '1.0'],
  ['/define-isaretleri', '0.9'],
  ['/rehber', '0.8'],
  ...GUIDES.map((g) => [`/rehber/${g.id}`, '0.7']),
  ...REGIONS.map((g) => [`/bolgeler/${g.id}`, '0.6']),
  ...SIGNS.map((s) => [`/define-isaretleri/${s.id}`, '0.7']),
  ['/haberler', '0.8'],
  ...NEWS.map((n) => [`/haberler/${n.id}`, '0.6']),
  ['/hakkimizda', '0.4'],
  ['/iletisim', '0.3'],
  ['/gizlilik', '0.3'],
  ['/abonelik', '0.3'],
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map(([p, pr]) => `  <url><loc>${BASE}${p}</loc><lastmod>${TODAY}</lastmod><priority>${pr}</priority></url>`)
  .join('\n')}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\nDisallow: /analyze\nDisallow: /echo\nDisallow: /news\nDisallow: /ping\n\nSitemap: ${BASE}/sitemap.xml\n`;

writeFileSync(
  OUT,
  `// scripts/gen-seo.mjs tarafından üretildi; elle düzenlemeyin.\nexport const SEO_PAGES: Record<string, string> = ${JSON.stringify(pages)};\nexport const SITEMAP_XML = ${JSON.stringify(sitemap)};\nexport const ROBOTS_TXT = ${JSON.stringify(robots)};\n`,
);
console.log(`seo.generated.ts: ${Object.keys(pages).length} sayfa, ${urls.length} adres sitemap'te`);
