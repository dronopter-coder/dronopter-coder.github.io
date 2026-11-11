// defineciler.online sitesinin tüm sayfalarını üretir: ana sayfa, uygulama sayfaları, define işaretleri, rehberler,
// tarihi bölgeler, haberler, kurumsal sayfalar, sitemap.xml ve robots.txt. Ortak tasarım: shell.mjs.
// Çıktı: src/seo.generated.ts (Worker bunu sunar). Çalıştırma (depo kökünden): bash defineciler/worker/scripts/build-site.sh
// Not: İşaret sayfaları halk yorumlarının yalnızca ilkini gösterir, kalanını uygulamaya bırakır (Pro içeriği).
import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { appPages } from './app-pages.mjs';
import { GUIDES, REGIONS } from './guides.mjs';
import { NEWS } from './news.mjs';
import { BASE, esc, inner, page, PLAY_URL } from './shell.mjs';
import { EVIDENCE, SIGN_CATEGORIES, SIGNS } from '../../src/data/signs.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..');
const OUT = join(HERE, '..', 'src', 'seo.generated.ts');
const TODAY = new Date().toISOString().slice(0, 10);

const hasImg = (id) => existsSync(join(ROOT, 'site', `s-${id}.webp`));
const lower = (s) => s.toLocaleLowerCase('tr-TR');
const ldTag = (o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`;
const trDate = (d) => new Date(`${d}T12:00:00+03:00`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

const warning = `<div class="warn"><b>Önemli:</b> Böyle bir işaret ya da eser görürseniz kazmayın, boyamayın ve yerinden oynatmayın. Fotoğrafını çekip konumunu en yakın müze müdürlüğüne ya da mülki amirliğe bildirin (2863 sayılı Kanun). Bulunan eserlerin 3 gün içinde bildirilmesi zorunludur.</div>`;
const appCta = (h, p) =>
  `<div class="cta"><div><h2>${esc(h)}</h2><p>${esc(p)}</p></div><a class="btn" href="${PLAY_URL}">▶ Google Play'den indir</a></div>`;

const chip = (ev) => {
  const e = EVIDENCE[ev];
  return `<span class="chip" style="color:${e.color};border-color:${e.color}99;background:${e.color}1F"><i style="background:${e.color}"></i>${esc(e.label)}</span>`;
};
const faqLd = (faq) => ({
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});
const faqHtml = (faq) => `<div class="faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`;
const crumbLd = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [['Defineciler', '/'], ...items].map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${BASE}${p}` })),
});
const publisher = { '@type': 'Organization', name: 'Defineciler', logo: { '@type': 'ImageObject', url: `${BASE}/site/icon.png` } };
const signTile = (o) =>
  `<a class="tile" href="/define-isaretleri/${o.id}">${hasImg(o.id) ? `<img src="/site/s-${o.id}.webp" alt="${esc(o.title)} işareti" loading="lazy" width="320" height="240">` : ''}<div><b>${esc(o.title)}</b><span>${esc(EVIDENCE[o.evidence].label)}</span></div></a>`;

const pages = {};

// ---------- Define işaretleri ----------
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

for (const s of SIGNS) {
  const path = `/define-isaretleri/${s.id}`;
  const cat = SIGN_CATEGORIES.find((c) => c.id === s.category);
  const img = hasImg(s.id) ? `/site/s-${s.id}.webp` : undefined;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', headline: `${s.title} define işareti ne anlama gelir?`, description: s.summary, inLanguage: 'tr-TR', dateModified: TODAY,
        mainEntityOfPage: `${BASE}${path}`, image: img ? `${BASE}${img}` : `${BASE}/site/og.jpg`, author: { '@type': 'Organization', name: 'Defineciler' }, publisher },
      crumbLd([['Define işaretleri', '/define-isaretleri'], [s.title, path]]),
      faqLd(signFaq(s)),
    ],
  };
  const related = SIGNS.filter((o) => o.category === s.category && o.id !== s.id).slice(0, 4);
  pages[path] = page({
    title: `${s.title} define işareti ne anlama gelir? Halk yorumu ve arkeolojik gerçek | Defineciler`,
    description: `${s.title} işareti: ${s.summary} Halk arasındaki yorumu, tarih ve arkeolojideki karşılığı, nerede görüldüğü ve yorumun sınırı.`.slice(0, 300),
    path, image: img, extra: ldTag(ld),
    body: inner({
      crumbs: [['Define işaretleri', '/define-isaretleri'], [s.title]],
      eyebrow: cat?.label ?? 'Define işareti',
      h1: `${s.title} define işareti ne anlama gelir?`,
      meta: s.aka ? `Diğer adları: ${esc(s.aka)}` : '',
      lead: s.summary,
      content: `<p>${chip(s.evidence)}</p>
${img ? `<div class="hero-img"><img src="${img}" alt="${esc(s.title)} işareti örneği" width="320" height="240"></div>` : ''}
<h2>Halk arasında nasıl yorumlanır?</h2>
<div class="card"><ul><li>${esc(s.folk[0])}</li></ul>${s.folk.length > 1 ? `<p class="muted">Diğer yorumlar ve ilgili işaretler Defineciler uygulamasında.</p>` : ''}
<p class="muted" style="font-style:italic">Bu yorumlar definecilik çevrelerinde anlatılanlardır; doğrulukları kanıtlanmamıştır.</p></div>
<h2>Tarih ve arkeolojideki karşılığı</h2><p>${esc(s.science)}</p>
<h2>Nerede ve hangi dönemde görülür?</h2><p>${esc(s.where)}</p>
<h2>Yorumun sınırı</h2>
<div class="card"><p><b>${esc(EVIDENCE[s.evidence].label)}.</b> ${esc(EVIDENCE[s.evidence].desc)} ${esc(s.limit)}</p></div>
<h2>Sık sorulan sorular</h2>${faqHtml(signFaq(s))}
<h2>${esc(cat?.label ?? 'İlgili işaretler')}: ilgili işaretler</h2>
<p class="muted">${esc(cat?.desc ?? '')}.</p>
<div class="grid">${related.map(signTile).join('')}</div>
<p>Konuyla ilgili rehberler: <a href="/rehber/define-efsaneleri-ve-gercekler">Define efsaneleri ve gerçekler</a> · <a href="/rehber/tarihi-eser-bulursam-ne-yapmaliyim">Tarihi eser bulursam ne yapmalıyım?</a></p>
${warning}
${appCta('Elindeki esere ya da işarete mi bakıyorsun?', `Fotoğrafını çek; Defineciler ${lower(s.title)} gibi işaretleri ve eserleri değerlendirsin. 35 işaretin tamamı uygulamada.`)}`,
    }),
  });
}

{
  const path = '/define-isaretleri';
  const description =
    'Yılan, kartal, el izi, çanak oyuk, tümülüs ve daha fazlası: 35 define işaretinin halk arasındaki yorumu, tarih ve arkeolojideki gerçek karşılığı ve yorumun sınırı.';
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', name: 'Define işaretleri ve anlamları', description, inLanguage: 'tr-TR', url: `${BASE}${path}`,
        hasPart: SIGNS.map((s) => ({ '@type': 'Article', headline: `${s.title} define işareti`, url: `${BASE}/define-isaretleri/${s.id}` })) },
      crumbLd([['Define işaretleri', path]]),
    ],
  };
  pages[path] = page({
    title: 'Define işaretleri ve anlamları: 35 işaret, halk yorumu ve arkeolojik gerçek | Defineciler',
    description, path, extra: ldTag(ld),
    body: inner({
      crumbs: [['Define işaretleri']], eyebrow: `${SIGNS.length} işaret`, h1: 'Define işaretleri ve anlamları', wide: true,
      lead: `Taşlarda ve kayalarda görülen işaretler halk arasında çok farklı yorumlanır. Burada ${SIGNS.length} işareti, halk yorumu ile tarih ve arkeolojideki gerçek karşılığını ayırarak anlatıyoruz.`,
      content: `<div class="card"><h3 style="margin-bottom:8px">Önce bunu okuyun: yorumun sınırı</h3><p>Her işaret üç düzeyden birine girer: ${chip('iz')} gerçek bir antik yapı ya da kalıntı, ${chip('sembol')} anlamı bilinen kültürel motif, ${chip('halk')} büyük ölçüde halk yorumu. Bir işaretin “define var” anlamına geldiğine dair bilimsel kanıt yoktur; örneklerin çoğu doğal oluşum ya da rastlantıdır.</p></div>
${SIGN_CATEGORIES.map((c) => `<h2 id="${c.id}">${esc(c.label)}</h2><p class="muted">${esc(c.desc)}</p><div class="grid">${SIGNS.filter((s) => s.category === c.id).map(signTile).join('')}</div>`).join('')}
${warning}
${appCta('Defineciler uygulamasında hepsi bir arada', 'Halk yorumlarının tamamı, ilgili işaretler, tarihi bölgeler ve fotoğraftan eser tanıma.')}`,
    }),
  });
}

// ---------- Rehberler ve bölgeler ----------
const words = (g) => [g.lead, ...g.sections.flatMap(([h, ps]) => [h, ...ps]), ...(g.faq ?? []).flat()].join(' ').split(/\s+/).length;
const allLinks = [
  ...GUIDES.map((g) => ({ id: g.id, title: g.title, short: g.short, href: `/rehber/${g.id}` })),
  ...REGIONS.map((g) => ({ id: g.id, title: g.title, short: g.short, href: `/bolgeler/${g.id}` })),
];
const articleCard = (a) => `<a class="feat" href="${a.href}"><h3>${esc(a.title)}</h3><p>${esc(a.short)}</p><span class="more">Oku →</span></a>`;

function articlePage(kind, g) {
  const isGuide = kind === 'rehber';
  const base = isGuide ? '/rehber' : '/bolgeler';
  const path = `${base}/${g.id}`;
  const section = isGuide ? ['Rehberler', '/rehber'] : ['Tarihi bölgeler', '/bolgeler'];
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', headline: g.title, description: g.lead, inLanguage: 'tr-TR', dateModified: TODAY, mainEntityOfPage: `${BASE}${path}`,
        author: { '@type': 'Organization', name: 'Defineciler', url: `${BASE}/hakkimizda` }, publisher },
      crumbLd([section, [g.title, path]]),
      ...(g.faq?.length ? [faqLd(g.faq)] : []),
    ],
  };
  const others = allLinks.filter((o) => o.id !== g.id && o.href.startsWith(base)).slice(0, 3);
  pages[path] = page({
    title: `${g.title} | Defineciler`, description: g.lead.slice(0, 300), path, extra: ldTag(ld),
    body: inner({
      crumbs: [section, [g.title]],
      eyebrow: isGuide ? 'Rehber' : 'Tarihi bölge',
      h1: g.title,
      meta: `Okuma süresi: ${Math.max(2, Math.round(words(g) / 180))} dk · Güncelleme: ${TODAY.split('-').reverse().join('.')} · <a href="/hakkimizda#ilkeler">Yayın ilkelerimiz</a>`,
      lead: g.lead,
      content: `${g.sections.length > 3 ? `<div class="toc"><b>Bu yazıda</b><ul>${g.sections.map(([h], i) => `<li><a href="#b${i + 1}">${esc(h)}</a></li>`).join('')}</ul></div>` : ''}
${g.sections.map(([h, ps], i) => `<h2 id="b${i + 1}">${esc(h)}</h2>${ps.map((t) => `<p>${esc(t)}</p>`).join('')}`).join('')}
${g.faq?.length ? `<h2>Sık sorulan sorular</h2>${faqHtml(g.faq)}` : ''}
<h2>Bunlar da ilginizi çekebilir</h2><div class="cards">${others.map(articleCard).join('')}</div>
${warning}
${appCta('Elindeki eseri tanımak ister misin?', 'Fotoğrafını çek; Defineciler dönemini, uygarlığını ve anlamını anlatsın.')}`,
    }),
  });
}
for (const g of GUIDES) articlePage('rehber', g);
for (const g of REGIONS) articlePage('bolge', g);

pages['/rehber'] = page({
  title: 'Tarih ve arkeoloji rehberleri: sikke okuma, seramik, patina, eser bildirimi | Defineciler',
  description: 'Tarihi eser bildirimi, sikke okuma, seramik tarihleme, patina, sahte eser ayrımı, tümülüsler ve Anadolu’nun arkeolojik dönemleri için ayrıntılı rehberler.',
  path: '/rehber', extra: ldTag({ '@context': 'https://schema.org', '@graph': [crumbLd([['Rehberler', '/rehber']])] }),
  body: inner({
    crumbs: [['Rehberler']], eyebrow: `${GUIDES.length} rehber`, h1: 'Tarih ve arkeoloji rehberleri', wide: true,
    lead: 'Eser bulduğunuzda izlenecek yasal süreçten sikke okumaya, seramik tarihlemeden sahte eser ayrımına kadar ayrıntılı rehberler.',
    content: `<div class="cards">${allLinks.filter((a) => a.href.startsWith('/rehber/')).map(articleCard).join('')}</div>
<h2>Tarihi bölgeler</h2><p class="muted">Anadolu’nun uygarlıklarını tanıtan yazılarımız için <a href="/bolgeler">Tarihi bölgeler</a> sayfasına göz atın.</p>${warning}`,
  }),
});
pages['/bolgeler'] = page({
  title: 'Anadolu’nun tarihi bölgeleri ve uygarlıkları: Hitit, Frigya, Lidya, Likya ve daha fazlası | Defineciler',
  description: 'Hititler, Frigler, Lidyalılar, Karya, Likya, Kapadokya, Urartu ve Kommagene: Anadolu’nun uygarlıkları, başkentleri, eserleri ve müzeleri.',
  path: '/bolgeler', extra: ldTag({ '@context': 'https://schema.org', '@graph': [crumbLd([['Tarihi bölgeler', '/bolgeler']])] }),
  body: inner({
    crumbs: [['Tarihi bölgeler']], eyebrow: `${REGIONS.length} uygarlık`, h1: 'Anadolu’nun tarihi bölgeleri', wide: true,
    lead: 'Anadolu, binlerce yıl boyunca birçok uygarlığa ev sahipliği yaptı. Başkentlerini, eserlerini, keşif hikâyelerini ve bugün nerede görülebileceklerini anlatıyoruz.',
    content: `<div class="cards">${allLinks.filter((a) => a.href.startsWith('/bolgeler/')).map(articleCard).join('')}</div>
<p>Dönemlerin genel sırası için <a href="/rehber/anadolu-arkeolojik-donemler">Anadolu’nun arkeolojik dönemleri</a> rehberine bakabilirsiniz.</p>${warning}`,
  }),
});

// ---------- Haberler ----------
const NEWS_SORTED = [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
const newsCard = (n) => `<a class="news" href="/haberler/${n.id}"><time datetime="${n.date}">${trDate(n.date)}</time><h3>${esc(n.title)}</h3><p>${esc(n.lead)}</p></a>`;
for (const n of NEWS_SORTED) {
  const path = `/haberler/${n.id}`;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'NewsArticle', headline: n.title, description: n.lead, inLanguage: 'tr-TR', datePublished: `${n.date}T10:00:00+03:00`,
        dateModified: `${n.date}T10:00:00+03:00`, mainEntityOfPage: `${BASE}${path}`, image: `${BASE}/site/og.jpg`,
        author: { '@type': 'Organization', name: 'Defineciler', url: `${BASE}/hakkimizda` }, publisher },
      crumbLd([['Arkeoloji haberleri', '/haberler'], [n.title, path]]),
    ],
  };
  const others = NEWS_SORTED.filter((o) => o.id !== n.id).slice(0, 3);
  pages[path] = page({
    title: `${n.title} | Defineciler`, description: n.lead.slice(0, 300), path, extra: ldTag(ld),
    body: inner({
      crumbs: [['Haberler', '/haberler'], [n.title]], eyebrow: `Arkeoloji haberi · ${trDate(n.date)}`, h1: n.title, lead: n.lead,
      content: `${n.paragraphs.map((t) => `<p>${esc(t)}</p>`).join('')}
<h2>Kaynaklar</h2><ul>${n.sources.map((x) => `<li><a href="${esc(x.url)}" rel="nofollow noopener" target="_blank">${esc(x.name)}</a></li>`).join('')}</ul>
<p class="muted" style="font-size:.9rem">Bu haber, kaynaklardaki bilgiler esas alınarak Defineciler editörlüğünce özetlenmiş ve arka plan bilgisiyle genişletilmiştir. Hata bildirimleri için <a href="/iletisim">iletişim</a>.</p>
${n.related?.length ? `<h2>Konuyla ilgili rehberler</h2><ul>${n.related.map((r) => `<li><a href="${r.href}">${esc(r.title)}</a></li>`).join('')}</ul>` : ''}
${others.length ? `<h2>Diğer haberler</h2>${others.map(newsCard).join('')}` : ''}`,
    }),
  });
}
pages['/haberler'] = page({
  title: 'Arkeoloji haberleri: Türkiye’deki kazılardan son gelişmeler | Defineciler',
  description: 'Göbeklitepe, Karahantepe, Troya ve Anadolu’nun diğer kazılarından haftalık arkeoloji haberleri; özet, arka plan ve kaynaklarıyla.',
  path: '/haberler', extra: ldTag({ '@context': 'https://schema.org', '@graph': [crumbLd([['Arkeoloji haberleri', '/haberler']])] }),
  body: inner({
    crumbs: [['Haberler']], eyebrow: 'Her hafta güncellenir', h1: 'Arkeoloji haberleri',
    lead: 'Türkiye’deki kazılardan ve araştırmalardan öne çıkan gelişmeleri her hafta derliyor; her haberi kaynaklarıyla birlikte, anlaşılır bir arka plan bilgisiyle özetliyoruz.',
    content: NEWS_SORTED.map(newsCard).join(''),
  }),
});

// ---------- Ana sayfa, uygulama ve kurumsal sayfalar ----------
const app = appPages({ ROOT, NEWS_SORTED, newsCard, signTile, SIGNS, allLinks, articleCard, warning, appCta, faqLd, faqHtml, crumbLd, ldTag });
Object.assign(pages, app.pages);

// ---------- Forum kabuğu (Worker çalışma anında doldurur) ----------
const FORUM_SHELL = page({ title: '%%TITLE%%', description: '%%DESC%%', path: '/forum', extra: '%%HEAD%%', body: '%%BODY%%' })
  .replaceAll(`${BASE}/forum"`, '%%CANON%%"')
  .replace('content="index, follow, max-image-preview:large"', 'content="%%ROBOTS%%"');
if ((FORUM_SHELL.match(/%%CANON%%/g) ?? []).length !== 2) throw new Error('FORUM_SHELL: canonical yer tutucuları bulunamadı');

// ---------- sitemap ve robots ----------
const urls = [
  ['/', '1.0'],
  ...app.sitemap,
  ['/define-isaretleri', '0.9'],
  ['/rehber', '0.8'],
  ['/bolgeler', '0.8'],
  ['/haberler', '0.8'],
  ['/forum/kurallar', '0.5'],
  ...GUIDES.map((g) => [`/rehber/${g.id}`, '0.7']),
  ...REGIONS.map((g) => [`/bolgeler/${g.id}`, '0.7']),
  ...NEWS.map((n) => [`/haberler/${n.id}`, '0.6']),
  ...SIGNS.map((s) => [`/define-isaretleri/${s.id}`, '0.7']),
];
const missing = urls.filter(([p]) => !pages[p]).map(([p]) => p);
if (missing.length) throw new Error(`Sitemap'te olup sayfası olmayan adresler: ${missing.join(', ')}`);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map(([p, pr]) => `  <url><loc>${BASE}${p}</loc><lastmod>${TODAY}</lastmod><priority>${pr}</priority></url>`)
  .join('\n')}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\nDisallow: /analyze\nDisallow: /echo\nDisallow: /news\nDisallow: /ping\nDisallow: /forum/yonetim\nDisallow: /forum/hesap\nDisallow: /forum/yeni\nDisallow: /forum/giris\nDisallow: /forum/kayit\nDisallow: /forum/auth/\n\nSitemap: ${BASE}/sitemap.xml\nSitemap: ${BASE}/forum/sitemap.xml\n`;

writeFileSync(
  OUT,
  `// scripts/gen-seo.mjs tarafından üretildi; elle düzenlemeyin.\nexport const SEO_PAGES: Record<string, string> = ${JSON.stringify(pages)};\nexport const SITEMAP_XML = ${JSON.stringify(sitemap)};\nexport const ROBOTS_TXT = ${JSON.stringify(robots)};\nexport const FORUM_SHELL = ${JSON.stringify(FORUM_SHELL)};\n`,
);
console.log(`seo.generated.ts: ${Object.keys(pages).length} sayfa, ${urls.length} adres sitemap'te`);
