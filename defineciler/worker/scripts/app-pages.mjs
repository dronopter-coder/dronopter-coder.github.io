// Ana sayfa, uygulama sayfaları (nasıl çalışır, özellikler, tanıtım, ekran görüntüleri, Pro, SSS) ve kurumsal sayfalar
// (hakkımızda, iletişim, gizlilik, abonelik). gen-seo.mjs çağırır.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { BASE, esc, inner, page, PLAY_URL } from './shell.mjs';

const VIDEO = '/media/defineciler-tanitim.mp4';
const POSTER = '/media/defineciler-tanitim-poster.webp';
const videoTag = `<div class="vphone"><video controls playsinline preload="none" poster="${POSTER}" width="720" height="1280" aria-label="Defineciler tanıtım videosu"><source src="${VIDEO}" type="video/mp4"></video></div>`;
const videoLd = {
  '@type': 'VideoObject', name: 'Defineciler tanıtım videosu',
  description: 'Defineciler uygulamasını 1 dakikada tanıyın: fotoğrafla eser ve sikke tanıma, define işaretlerinin anlamları, eşkıya belgeleri ve tarihi bölgeler.',
  thumbnailUrl: `${BASE}${POSTER}`, contentUrl: `${BASE}${VIDEO}`, uploadDate: '2026-11-06T17:00:00+03:00', duration: 'PT1M', inLanguage: 'tr-TR',
};
const SHOTS = [
  ['ekran-ana', 'Ana sayfa', 'Son taramalar, işaretler, bölgeler ve tek dokunuşla fotoğraf analizi.'],
  ['ekran-sonuc', 'Analiz sonucu', 'Eserin türü, muhtemel dönemi, uygarlığı, malzemesi ve güven düzeyi tek raporda.'],
  ['ekran-isaretler', 'Define işaretleri', '35 işaret; dört kategoride, kanıt düzeyi etiketleriyle.'],
  ['ekran-detay', 'İşaret ayrıntısı', 'Halk yorumu, arkeolojik karşılık, nerede görüldüğü ve yorumun sınırı.'],
  ['ekran-bolgeler', 'Tarihi bölgeler', 'Anadolu’nun uygarlıkları, tipik buluntuları ve müzeleri.'],
  ['ekran-rehber', 'Rehber', 'Sikke okuma, patina, sahte eser ayrımı ve yasal süreç rehberleri.'],
];
const shot = ([f, t, d]) => `<figure style="margin:0"><div class="phone"><img src="/site/${f}.webp" alt="${esc(t)} ekranı" loading="lazy" width="360" height="640"></div><figcaption style="margin-top:12px"><b style="color:var(--gold-light)">${esc(t)}</b><br><span class="muted" style="font-size:.92rem">${esc(d)}</span></figcaption></figure>`;

const FEATURES = [
  ['📷', 'Fotoğraftan eser tanımlama', 'Sikke, seramik, mühür, kandil, takı ve yazıtların fotoğrafını çekin. Defineciler eserin türünü, muhtemel dönemini, uygarlığını ve malzemesini değerlendirir; benzer müze örneklerine işaret eder. Ön ve arka yüzü birlikte göndermek, ölçü ve ağırlık eklemek sonucu güçlendirir.'],
  ['🪨', '35 define işareti', 'Yılan, kartal, el izi, çanak oyuklar, tümülüs ve daha fazlası. Her işaret için halk arasındaki yorum ile tarih ve arkeolojideki gerçek karşılık ayrı ayrı verilir; “yorumun sınırı” başlığı neyin kanıta dayandığını açıkça gösterir.'],
  ['🗺️', 'Tarihi bölgeler', 'Hitit’ten Frigya’ya, Lidya’dan Kommagene’ye Anadolu’nun uygarlıkları; başkentleri, tipik buluntuları, keşif hikâyeleri ve bugün ziyaret edilebilecek müzeleri.'],
  ['📚', 'Rehber ve belgeler', 'Sikke okuma, patina, seramik tarihleme, sahte eser ayrımı, zaman çizelgesi ve eser bulunduğunda yapılması gerekenler. Volçan Voyvoda ve eşkıya belgeleri de düzenlenmiş hâliyle, “tarihî belge değil, anlatı” notuyla uygulamada.'],
  ['📰', 'Güncel arkeoloji haberleri', 'Türkiye’deki kazılardan ve müzelerden haberler tek akışta. Habere dokunun, kaynağında okuyun.'],
  ['🔒', 'Gizliliğe saygı', 'Hesap açmanız gerekmez. Tarama geçmişiniz yalnızca cihazınızda kalır; analiz için gönderilen fotoğraflar sunucumuzda saklanmaz.'],
];

const FAQ = [
  ['Defineciler ücretsiz mi?', 'Evet. Her gün ücretsiz analiz hakkınız vardır ve hakkınız bittiğinde kısa bir reklam izleyerek devam edebilirsiniz. Reklamsız kullanım ve ek özellikler için isteğe bağlı Defineciler Pro aboneliği bulunur.'],
  ['Analiz sonuçları kesin mi?', 'Hayır. Analizler fotoğrafa dayalı tahminlerdir ve uzman incelemesinin ya da resmî ekspertizin yerini tutmaz. Rapor, güven düzeyini ve eksik kalan bilgileri de gösterir; ölçü, ağırlık ve arka yüz fotoğrafı eklemek sonucu iyileştirir.'],
  ['Fotoğraflarım saklanıyor mu?', 'Analiz için seçtiğiniz fotoğraf şifreli bağlantıyla işlenmek üzere gönderilir ve sunucumuzda saklanmaz. Tarama geçmişiniz yalnızca telefonunuzda tutulur. Ayrıntılar gizlilik politikasında yer alır.'],
  ['Define işaretleri gerçekten define yeri mi gösterir?', 'Hayır, bunu gösteren bilimsel bir kanıt yoktur. Defineciler her işareti halk yorumu ile tarih ve arkeolojideki gerçek karşılığına ayırarak anlatır; örneklerin çoğu doğal oluşum ya da rastlantıdır.'],
  ['Hesap açmam gerekiyor mu?', 'Hayır. Üyelik ya da giriş yoktur. Pro aboneliği Google Play hesabınızla yönetilir.'],
  ['Bir eser ya da işaret bulursam ne yapmalıyım?', 'Dokunmayın, kazmayın ve boyamayın. Yerini ve fotoğrafını kaydedip en yakın müze müdürlüğüne ya da mülki amirliğe bildirin. 2863 sayılı Kanun bulunan eserlerin 3 gün içinde bildirilmesini öngörür.'],
  ['Pro aboneliğini nasıl iptal ederim?', 'Google Play → Profil → Ödemeler ve abonelikler → Abonelikler bölümünden Defineciler Pro’yu seçip iptal edebilirsiniz. İptal, mevcut dönemin sonunda geçerli olur.'],
  ['Yıllık plandaki ücretsiz deneme nasıl işler?', 'Yıllık planda ilk 7 gün ücretsizdir. Deneme bitmeden iptal ederseniz ücret alınmaz; iptal etmezseniz deneme sonunda yıllık ücret tahsil edilir.'],
  ['iPhone sürümü var mı?', 'Şimdilik yalnızca Android için geliştiriliyor.'],
  ['Hangi eserler için kullanabilirim?', 'Sikkeler, seramik parçaları, kandiller, mühürler, takılar, heykelcikler, yazıtlı taşlar ve kaya işaretleri için kullanılabilir. Fotoğraf ne kadar net ve ölçekli olursa sonuç o kadar iyi olur.'],
];

const TRANSCRIPT = [
  'Eski bir sikke… Taşa oyulmuş gizemli bir işaret… Bunların ne anlama geldiğini hiç merak ettin mi?',
  'Defineciler, Anadolu’nun geçmişini cebine getiriyor.',
  'Elindeki eserin ya da sikkenin fotoğrafını çek. Dönemini, olası kökenini ve dikkat çeken ayrıntılarını saniyeler içinde öğren.',
  'Taşlardaki yılan, kartal, el izi gibi işaretler halk arasında hep farklı yorumlanır. Defineciler, halk yorumuyla tarihin ve arkeolojinin söylediğini birbirinden ayırır. Hangisi efsane, hangisi gerçek, sen karar ver.',
  'Volçan Voyvoda ve eşkıya belgeleri de uygulamada. Yıllardır elden ele dolaşan notlar, düzenlenmiş hâliyle okumana hazır. Bunlar tarihî birer belge değil, anlatılan hikâyeler. Kaynağı belirsiz, çelişkili, ama merak uyandıran bir sözlü miras.',
  'Tarihî bölgeler, rehberler ve belgeler de bir arada.',
  'Unutma: tarihî eserler hepimizin. Bir eser ya da işaret görürsen kazma, dokunma. Konumunu en yakın müzeye bildir.',
  'Defineciler. Şimdi Google Play’de, ücretsiz indir.',
];

/** privacy.html / abonelik.html içeriğini (başlık bloğu ve eski alt bilgi hariç) alır. */
function legalBody(root, file) {
  const html = readFileSync(join(root, file), 'utf8');
  const main = html.slice(html.indexOf('<main>') + 6, html.indexOf('</main>'));
  return main
    .replace(/<div class="brand">[\s\S]*?<\/div><\/div><\/div>/, '')
    .replace(/<footer>[\s\S]*?<\/footer>/, '')
    .replace(/href="privacy\.html"/g, 'href="/gizlilik"')
    .replace(/href="abonelik\.html"/g, 'href="/abonelik"')
    .replace(/href="index\.html"/g, 'href="/"');
}

export function appPages(ctx) {
  const { ROOT, NEWS_SORTED, newsCard, signTile, SIGNS, allLinks, articleCard, warning, appCta, faqLd, faqHtml, crumbLd, ldTag } = ctx;
  const pages = {};
  const sitemap = [];
  const add = (path, prio, html) => {
    pages[path] = html;
    sitemap.push([path, prio]);
  };
  const simple = ({ path, prio, title, description, eyebrow, h1, lead, content, wide, ld = [] }) =>
    add(path, prio, page({
      title, description, path,
      extra: ldTag({ '@context': 'https://schema.org', '@graph': [crumbLd([[h1, path]]), ...ld] }),
      body: inner({ crumbs: [[h1]], eyebrow, h1, lead, wide, content }),
    }));

  // ---------- Ana sayfa ----------
  const pick = (ids) => ids.map((id) => SIGNS.find((s) => s.id === id)).filter(Boolean);
  pages['/'] = page({
    title: 'Define işaretleri, sikke ve tarihi eser tanıma uygulaması | Defineciler',
    description: 'Defineciler: define işaretlerinin anlamlarını öğren, sikke ve tarihi eserini fotoğrafla tanı. 35 define işareti, halk yorumu ve arkeolojik gerçek, Anadolu’nun tarihi bölgeleri, rehberler ve haftalık arkeoloji haberleri.',
    path: '/', type: 'website',
    extra: ldTag({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'MobileApplication', name: 'Defineciler', alternateName: 'Defineciler: Eser Tanımlama', operatingSystem: 'Android', applicationCategory: 'EducationalApplication', inLanguage: 'tr-TR',
          description: 'Fotoğrafla tarihi eser ve sikke tanıma, 35 define işaretinin anlamları, Anadolu’nun tarihi bölgeleri ve arkeoloji rehberi.', url: `${BASE}/`, downloadUrl: PLAY_URL,
          image: `${BASE}/site/og.jpg`, offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
          publisher: { '@type': 'Organization', name: 'Defineciler', url: `${BASE}/`, logo: `${BASE}/site/icon.png` } },
        { '@type': 'WebSite', name: 'Defineciler', url: `${BASE}/`, inLanguage: 'tr-TR' },
        videoLd,
      ],
    }),
    body: `<section class="sec" style="padding:56px 0 64px;background:radial-gradient(900px 520px at 80% 20%,rgba(212,162,76,.18),transparent 70%)">
<div class="wrap split">
<div><p class="eyebrow">Anadolu'nun hazineleri</p>
<h1 style="color:var(--text);font-size:clamp(2.2rem,5.4vw,3.6rem)">Define işaretleri ve tarihi eserler: geçmişin kilidini <em style="color:var(--gold)">aç.</em></h1>
<p class="lead" style="margin-top:18px;font-size:1.18rem">Elindeki sikkenin, objenin ya da kayadaki işaretin hikâyesini bir fotoğrafla keşfet. Dönemi, uygarlığı, malzemesi ve anlamı saniyeler içinde elinin altında.</p>
<div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:26px"><a class="btn" href="${PLAY_URL}">▶ Google Play'den indir</a><a class="btn btn-ghost" href="/nasil-calisir">Nasıl çalışır?</a></div>
<p class="muted" style="font-size:.88rem;margin-top:14px">Android için · Ücretsiz başlayın, günde 2 analiz hakkı</p></div>
<div style="position:relative;height:500px;max-width:460px;width:100%;margin:0 auto" aria-hidden="true">
<div class="phone" style="position:absolute;width:56%;left:0;top:50px;transform:rotate(-5deg)"><img src="/site/ekran-ana.webp" alt="" width="360" height="640"></div>
<div class="phone" style="position:absolute;width:56%;right:0;top:0;transform:rotate(4deg)"><img src="/site/ekran-sonuc.webp" alt="" width="360" height="640"></div></div>
</div></section>

<section class="sec alt"><div class="wrap">
<div class="center"><p class="eyebrow">Keşfet</p><h2 style="margin-top:0">Defineciler’de neler var?</h2><p class="lead">Uygulamayı tanıyın, işaretleri okuyun, rehberlerle derinleşin.</p></div>
<div class="cards">
<a class="feat" href="/nasil-calisir"><div class="ic">📷</div><h3>Nasıl çalışır?</h3><p>Fotoğrafla, analiz et, öğren: üç adımda eserin hikâyesi.</p><span class="more">Devamı →</span></a>
<a class="feat" href="/define-isaretleri"><div class="ic">🪨</div><h3>35 define işareti</h3><p>Halk yorumu ile arkeolojik gerçeği yan yana okuyun.</p><span class="more">İşaretler →</span></a>
<a class="feat" href="/rehber"><div class="ic">📚</div><h3>Rehberler</h3><p>Sikke okuma, seramik, patina ve eser bulunca yapılacaklar.</p><span class="more">Rehberler →</span></a>
<a class="feat" href="/bolgeler"><div class="ic">🗺️</div><h3>Tarihi bölgeler</h3><p>Hitit, Frigya, Lidya, Likya, Kapadokya ve daha fazlası.</p><span class="more">Bölgeler →</span></a>
<a class="feat" href="/haberler"><div class="ic">📰</div><h3>Arkeoloji haberleri</h3><p>Türkiye’deki kazılardan haftalık gelişmeler.</p><span class="more">Haberler →</span></a>
<a class="feat" href="/pro"><div class="ic">⭐</div><h3>Defineciler Pro</h3><p>Reklamsız kullanım, günde 30 analiz ve ayrıntılı rapor.</p><span class="more">Planlar →</span></a>
</div></div></section>

<section class="sec" id="tanitim"><div class="wrap split">
${videoTag}
<div><p class="eyebrow">Tanıtım</p><h2 style="margin-top:0">Defineciler’i 1 dakikada tanı</h2>
<p class="lead">Sikke ve eser fotoğrafından dönem tahmini, 35 define işaretinin halk yorumu ile arkeolojideki karşılığı, eşkıya belgeleri, tarihi bölgeler ve rehberler: hepsi tek uygulamada.</p>
<div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:22px"><a class="btn" href="${PLAY_URL}">▶ Google Play'den indir</a><a class="btn btn-ghost" href="/tanitim">Video metni</a></div></div>
</div></section>

<section class="sec alt"><div class="wrap">
<div class="center"><p class="eyebrow">Define işaretleri ve anlamları</p><h2 style="margin-top:0">Efsane ile gerçeği ayırın</h2><p class="lead">Her işaret için halk arasındaki yorum, tarih ve arkeolojideki karşılık ve yorumun sınırı ayrı ayrı.</p></div>
<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(170px,1fr))">${pick(['yilan', 'kartal', 'aslan', 'el', 'tumulus', 'kaplumbaga']).map(signTile).join('')}</div>
<p class="center" style="margin-top:22px"><a class="btn btn-ghost" href="/define-isaretleri">35 işaretin tamamı →</a></p>
</div></section>

<section class="sec"><div class="wrap">
<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:12px"><div><p class="eyebrow">Arkeoloji haberleri</p><h2 style="margin:0">Kazılardan son gelişmeler</h2></div><a href="/haberler">Tüm haberler →</a></div>
<div class="cards">${NEWS_SORTED.slice(0, 3).map(newsCard).join('')}</div>
</div></section>

<section class="sec alt"><div class="wrap">
<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:12px"><div><p class="eyebrow">Rehberler</p><h2 style="margin:0">Okumaya buradan başlayın</h2></div><a href="/rehber">Tüm rehberler →</a></div>
<div class="cards">${['tarihi-eser-bulursam-ne-yapmaliyim', 'sikke-nasil-okunur', 'anadolu-arkeolojik-donemler', 'hitit', 'lidya', 'sahte-eser-nasil-anlasilir'].map((id) => allLinks.find((a) => a.id === id)).filter(Boolean).map(articleCard).join('')}</div>
</div></section>

<section class="sec"><div class="wrap narrow">${warning}${appCta('Elindeki hikâyeyi keşfetmeye hazır mısın?', 'Defineciler Google Play’de. Ücretsiz indir, ilk analizini hemen yap.')}</div></section>`,
  });

  // ---------- Uygulama sayfaları ----------
  simple({
    path: '/nasil-calisir', prio: '0.8', eyebrow: 'Uygulama', h1: 'Nasıl çalışır?',
    title: 'Defineciler nasıl çalışır? Fotoğrafla eser ve sikke tanıma adımları | Defineciler',
    description: 'Defineciler ile bir eserin ya da sikkenin fotoğrafını çekin, analiz raporunu okuyun: iyi fotoğraf ipuçları, raporun içeriği ve sonuçların sınırları.',
    lead: 'Teknik bilgi gerekmez. Fotoğrafı çekin, gerisini Defineciler anlatsın. Bu sayfada analiz sürecini, iyi sonuç için ipuçlarını ve raporun nasıl okunacağını anlatıyoruz.',
    content: `<h2>1. Fotoğrafla</h2><p>Eseri kameranızla çekin ya da galeriden seçin. Sikkelerde ön ve arka yüzü ayrı ayrı çekmek, yazıtlı taşlarda yazının tamamını kadraja almak sonucu belirgin biçimde iyileştirir. İsterseniz boyut, ağırlık ve bulunduğu yer gibi bir not ekleyin.</p>
<h2>2. Analiz et</h2><p>Defineciler fotoğraftaki eserin türünü, muhtemel dönemini, uygarlığını, malzemesini ve üzerindeki yazı ya da figürleri değerlendirir. Analiz genellikle birkaç saniye ile yarım dakika arasında tamamlanır.</p>
<h2>3. Öğren ve sakla</h2><p>Güven düzeyiyle birlikte anlaşılır bir rapor alırsınız. Rapor; eserin adını, tahmini tarih aralığını, uygarlığı, malzemeyi, dikkat çeken ayrıntıları ve benzer müze örneklerini içerir. Taramalarınız yalnızca telefonunuzda saklanır; Pro üyeler raporu PDF olarak kaydedip paylaşabilir.</p>
<h2>İyi bir fotoğraf için ipuçları</h2><ul>
<li><b>Gün ışığı kullanın.</b> Doğrudan güneş yerine gölgede ya da pencere önünde, yumuşak ışıkta çekin.</li>
<li><b>Yandan ışık, kabartmayı gösterir.</b> Sikke ve yazıtlarda ışığın yandan gelmesi kabartmaları belirginleştirir.</li>
<li><b>Ölçek koyun.</b> Yanına bir cetvel ya da madenî para koymak boyutu anlamayı kolaylaştırır.</li>
<li><b>Sade zemin seçin.</b> Düz, tek renkli bir zemin eseri öne çıkarır.</li>
<li><b>Netliğe dikkat edin.</b> Çok yaklaşmak yerine biraz uzaktan çekip yakınlaştırmak çoğu telefonda daha net sonuç verir.</li>
<li><b>Eseri temizlemeyin.</b> Patina ve toprak tabakası tarihleme için ipucu taşır.</li></ul>
<h2>Sonuçların sınırları</h2><p>Analizler fotoğrafa dayalı tahminlerdir; uzman incelemesinin ya da resmî ekspertizin yerini tutmaz. Rapordaki güven düzeyi düşükse daha net ya da farklı açıdan fotoğraflar eklemeyi deneyin. Gerçek bir kültür varlığı bulduğunuzu düşünüyorsanız <a href="/rehber/tarihi-eser-bulursam-ne-yapmaliyim">bildirim rehberimizi</a> okuyun.</p>
${appCta('Hemen deneyin', 'Günde 2 ücretsiz analiz hakkıyla başlayın.')}`,
  });

  simple({
    path: '/ozellikler', prio: '0.8', eyebrow: 'Uygulama', h1: 'Özellikler', wide: true,
    title: 'Defineciler özellikleri: eser tanıma, define işaretleri, bölgeler ve rehberler | Defineciler',
    description: 'Fotoğraftan eser tanımlama, 35 define işareti, tarihi bölgeler, rehberler, eşkıya belgeleri, arkeoloji haberleri ve gizlilik: Defineciler’in tüm özellikleri.',
    lead: 'Merakınızı besleyen her şey tek uygulamada: eser tanıma, işaret rehberi, tarihi bölgeler, belgeler ve haberler.',
    content: `<div class="cards">${FEATURES.map(([ic, h, p]) => `<div class="feat"><div class="ic">${ic}</div><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
<h2>Ücretsiz ve Pro karşılaştırması</h2>
<table><thead><tr><th>Özellik</th><th>Ücretsiz</th><th>Pro</th></tr></thead><tbody>
<tr><td>Günlük analiz</td><td>2 (+ reklamla ek hak)</td><td class="y">30</td></tr>
<tr><td>Reklamsız kullanım</td><td class="n">—</td><td class="y">✓</td></tr>
<tr><td>Ön ve arka yüz birlikte ayrıntılı rapor</td><td class="n">—</td><td class="y">✓</td></tr>
<tr><td>Raporu PDF olarak kaydetme</td><td class="n">—</td><td class="y">✓</td></tr>
<tr><td>Define işaretleri ve belgeler</td><td>Bir bölümü</td><td class="y">Tamamı</td></tr>
<tr><td>Rehberler, bölgeler, haberler</td><td class="y">✓</td><td class="y">✓</td></tr></tbody></table>
<p><a href="/pro">Pro planlarını inceleyin →</a></p>
${appCta('Tüm özellikleri keşfedin', 'Defineciler’i Google Play’den ücretsiz indirin.')}`,
  });

  simple({
    path: '/tanitim', prio: '0.7', eyebrow: 'Uygulama', h1: 'Tanıtım videosu', ld: [videoLd],
    title: 'Defineciler tanıtım videosu: uygulamayı 1 dakikada tanıyın | Defineciler',
    description: 'Defineciler uygulamasının 1 dakikalık tanıtım videosu ve video metni: fotoğrafla eser tanıma, define işaretleri, eşkıya belgeleri ve tarihi bölgeler.',
    lead: 'Defineciler’i bir dakikada tanıyın. Videonun altında seslendirme metnini de bulabilirsiniz.',
    content: `${videoTag}
<h2>Video metni</h2>${TRANSCRIPT.map((t) => `<p>${esc(t)}</p>`).join('')}
<p class="muted" style="font-size:.92rem">Not: Eşkıya belgeleri, dolaşımdaki notların düzenlenmiş hâlidir; uygulamada da “tarihî belge değil, anlatı” notuyla sunulur.</p>
${appCta('Videoda gördüklerinizi deneyin', 'Defineciler Google Play’de ücretsiz.')}`,
  });

  simple({
    path: '/ekran-goruntuleri', prio: '0.6', eyebrow: 'Uygulama', h1: 'Ekran görüntüleri', wide: true,
    title: 'Defineciler ekran görüntüleri: analiz, işaretler, bölgeler ve rehber | Defineciler',
    description: 'Defineciler uygulamasından ekran görüntüleri: ana sayfa, analiz sonucu, define işaretleri, işaret ayrıntısı, tarihi bölgeler ve rehber ekranları.',
    lead: 'Uygulamanın ana ekranlarına göz atın.',
    content: `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:28px;margin-top:10px">${SHOTS.map(shot).join('')}</div>
${appCta('Kendiniz deneyin', 'Ekranların tamamı ve daha fazlası uygulamada.')}`,
  });

  simple({
    path: '/pro', prio: '0.7', eyebrow: 'Defineciler Pro', h1: 'Defineciler Pro',
    title: 'Defineciler Pro: reklamsız kullanım, günde 30 analiz, ayrıntılı rapor | Defineciler',
    description: 'Defineciler Pro planları: aylık 79,99 ₺, yıllık 499,99 ₺ ve 7 gün ücretsiz deneme. Reklamsız kullanım, günde 30 analiz, ayrıntılı rapor ve PDF.',
    lead: 'Ücretsiz başlayın, isterseniz derinleşin. Her gün ücretsiz analiz hakkınız vardır; daha fazlasını isteyenler için Pro.',
    content: `<div class="cards">
<div class="feat"><h3>Aylık</h3><p style="font-family:Georgia,serif;font-size:2.2rem;color:var(--gold-light);margin:10px 0 2px">79,99 ₺ <small style="font-size:1rem;color:var(--muted)">/ ay</small></p><p>İstediğiniz zaman iptal edin.</p></div>
<div class="feat" style="border-color:var(--gold);background:linear-gradient(180deg,rgba(212,162,76,.12),var(--surface))"><h3>Yıllık · en avantajlı</h3><p style="font-family:Georgia,serif;font-size:2.2rem;color:var(--gold-light);margin:10px 0 2px">499,99 ₺ <small style="font-size:1rem;color:var(--muted)">/ yıl</small></p><p>İlk 7 gün ücretsiz. Aylık ödemeye göre yaklaşık %48 daha uygun.</p></div></div>
<h2>Pro ile neler açılır?</h2><ul>
<li>Reklamsız kullanım</li><li>Günde 30 analiz</li><li>Ön ve arka yüz birlikte ayrıntılı rapor</li><li>Raporu PDF olarak kaydetme ve paylaşma</li>
<li>Tüm belgeler ve define işaretleri</li><li>Yazı okuma denemesi ve müze örnekleri</li></ul>
<h2>Abonelik nasıl yönetilir?</h2><p>Abonelik Google Play üzerinden alınır ve siz iptal edene kadar her dönem sonunda otomatik yenilenir. Google Play → Abonelikler bölümünden istediğiniz zaman iptal edebilirsiniz; iptal, mevcut dönemin sonunda geçerli olur. Ayrıntılar için <a href="/abonelik">abonelik koşullarına</a> bakın.</p>
${appCta('Pro’yu deneyin', 'Yıllık planda ilk 7 gün ücretsiz.')}`,
  });

  simple({
    path: '/sss', prio: '0.7', eyebrow: 'Yardım', h1: 'Sık sorulan sorular', ld: [faqLd(FAQ)],
    title: 'Sık sorulan sorular: ücret, gizlilik, analiz sonuçları ve Pro | Defineciler',
    description: 'Defineciler hakkında merak edilenler: uygulama ücretsiz mi, sonuçlar kesin mi, fotoğraflar saklanıyor mu, Pro nasıl iptal edilir ve daha fazlası.',
    lead: 'Defineciler uygulaması, Pro aboneliği ve gizlilik hakkında en çok sorulan sorular.',
    content: `${faqHtml(FAQ)}<p style="margin-top:22px">Sorunuzun cevabını bulamadınız mı? <a href="/iletisim">Bize yazın.</a></p>`,
  });

  // ---------- Kurumsal ----------
  simple({
    path: '/hakkimizda', prio: '0.5', eyebrow: 'Kurumsal', h1: 'Hakkımızda',
    title: 'Hakkımızda: Defineciler nedir, yayın ilkelerimiz | Defineciler',
    description: 'Defineciler; Anadolu’nun tarihi eserlerini, sikkelerini ve define işaretlerini halk yorumu ile bilimsel karşılığını ayırarak anlatan bir bilgi sitesi ve mobil uygulamadır.',
    lead: 'Defineciler, Anadolu’nun zengin tarihi mirasını merak eden herkes için hazırlanmış bir bilgi sitesi ve mobil uygulamadır. Amacımız, halk arasında anlatılan define hikâyeleri ile tarih ve arkeolojinin söylediklerini birbirinden ayırarak doğru bilgiye kolay ulaşılmasını sağlamaktır.',
    content: `<h2>Ne yapıyoruz?</h2>
<p>Sitemizde Anadolu’da sık karşılaşılan 35 define işaretini, her birinin halk arasındaki yorumu ve tarih ile arkeolojideki gerçek karşılığıyla birlikte anlatıyoruz. Sikke okuma, seramik tarihleme, patina, sahte eser ayrımı ve tarihi eser bulunduğunda izlenecek yasal süreç gibi konularda rehber yazılar yayımlıyoruz. Hititlerden Kommagene’ye Anadolu’nun önemli uygarlıklarını tanıtan bölge yazıları ve haftalık arkeoloji haberleri de hazırlıyoruz.</p>
<p>Defineciler mobil uygulaması ise kullanıcıların bir eserin ya da sikkenin fotoğrafını çekerek muhtemel dönemi, uygarlığı ve özellikleri hakkında ön bilgi almasını sağlar. Uygulamanın verdiği sonuçlar tahminidir ve uzman incelemesinin yerini tutmaz.</p>
<h2 id="ilkeler">Yayın ilkelerimiz</h2>
<ul>
<li><b>Kazıyı teşvik etmiyoruz.</b> İzinsiz kazı ve kültür varlığı ticareti 2863 sayılı Kanun’a göre suçtur. Sitemizde yer tarifi, kazı yöntemi ya da define arama teknikleri yer almaz.</li>
<li><b>Halk yorumu ile bilimi ayırıyoruz.</b> Her işaret sayfasında halk arasındaki anlatı ile arkeolojik karşılık ayrı başlıklarda verilir ve “yorumun sınırı” açıkça belirtilir.</li>
<li><b>Temkinli tarihler veriyoruz.</b> Antik tarihlerin çoğu yaklaşıktır; kesin olmayan bilgileri “yaygın görüşe göre” gibi ifadelerle belirtiriz.</li>
<li><b>Haberleri kaynağıyla veriyoruz.</b> Arkeoloji haberlerini kaynaklarındaki bilgilere dayanarak kendi cümlelerimizle özetler, her haberde kaynak bağlantısını paylaşırız.</li>
<li><b>Korumayı öne çıkarıyoruz.</b> Bir eser ya da işaretle karşılaşan okurlarımıza her zaman dokunmamalarını ve en yakın müze müdürlüğüne bildirmelerini öneririz.</li>
</ul>
<h2>Kaynaklarımız</h2>
<p>Yazılarımızı hazırlarken müzelerin ve ören yerlerinin resmî tanıtımlarını, UNESCO Dünya Mirası kayıtlarını, kazı ekiplerinin yayımladığı raporları ve genel arkeoloji ile nümismatik başvuru kaynaklarını esas alıyoruz.</p>
<h2>Hata bildirimi ve düzeltme</h2>
<p>Bir yazımızda hata ya da eksik bilgi fark ederseniz <a href="/iletisim">iletişim sayfamızdan</a> bize yazabilirsiniz. Bildirimleri inceliyor, gerekli düzeltmeleri yapıyor ve sayfanın güncelleme tarihini yeniliyoruz.</p>
<h2>Geliştirici</h2>
<p>Defineciler web sitesi ve mobil uygulaması <a href="https://dronopter.com.tr" rel="noopener">Dronopter</a> tarafından geliştirilmektedir.</p>
${warning}`,
  });

  simple({
    path: '/iletisim', prio: '0.4', eyebrow: 'Kurumsal', h1: 'İletişim',
    title: 'İletişim | Defineciler',
    description: 'Defineciler web sitesi ve mobil uygulaması ile ilgili soru, öneri ve hata bildirimleri için iletişim bilgileri.',
    lead: 'Soru, öneri, iş birliği teklifi ya da içeriklerimizle ilgili düzeltme bildirimleriniz için bize e-postayla ulaşabilirsiniz.',
    content: `<div class="card"><p><b>E-posta:</b> <a href="mailto:dronopter@gmail.com">dronopter@gmail.com</a></p><p><b>Geliştirici:</b> <a href="https://dronopter.com.tr" rel="noopener">Dronopter</a></p></div>
<h2>Bize yazmadan önce</h2>
<ul>
<li><b>Uygulama ve abonelik:</b> Defineciler Pro aboneliği Google Play üzerinden yönetilir. İptal ve iade işlemleri için <a href="/abonelik">abonelik koşullarımıza</a> bakabilirsiniz.</li>
<li><b>Gizlilik:</b> Verilerinizin nasıl işlendiğini <a href="/gizlilik">gizlilik politikamızda</a> anlatıyoruz.</li>
<li><b>Sık sorulanlar:</b> Pek çok sorunun cevabı <a href="/sss">SSS sayfamızda</a>.</li>
<li><b>Eser değerlendirmesi:</b> E-postayla gönderilen fotoğraflar üzerinden eser değerlendirmesi, değer biçme ya da alım satım aracılığı yapmıyoruz.</li>
<li><b>Bir eser buldunuz mu?</b> Lütfen <a href="/rehber/tarihi-eser-bulursam-ne-yapmaliyim">bildirim rehberimizi</a> okuyun ve en yakın müze müdürlüğüne başvurun.</li>
</ul>
<p>E-postalarınıza genellikle birkaç iş günü içinde yanıt vermeye çalışıyoruz.</p>`,
  });

  simple({
    path: '/gizlilik', prio: '0.3', eyebrow: 'Kurumsal', h1: 'Gizlilik Politikası',
    title: 'Gizlilik Politikası | Defineciler',
    description: 'Defineciler uygulaması ve defineciler.online sitesinin hangi verileri nasıl işlediğini açıklayan gizlilik politikası.',
    lead: 'Defineciler · Son güncelleme: 12 Ekim 2026',
    content: legalBody(ROOT, 'privacy.html'),
  });
  simple({
    path: '/abonelik', prio: '0.3', eyebrow: 'Kurumsal', h1: 'Abonelik Koşulları',
    title: 'Abonelik Koşulları | Defineciler',
    description: 'Defineciler Pro abonelik koşulları: planlar, ücretsiz deneme, otomatik yenileme, iptal ve iade.',
    lead: 'Defineciler Pro · Son güncelleme: 12 Ekim 2026',
    content: legalBody(ROOT, 'abonelik.html'),
  });

  return { pages, sitemap };
}
