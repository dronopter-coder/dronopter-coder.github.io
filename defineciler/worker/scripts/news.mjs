// Arkeoloji haberleri (gen-seo.mjs → /haberler). En yeni üstte olacak şekilde tarih sırasına gerek yok; üretici sıralar.
// Kurallar: kaynaklardan kopyalanmaz, kendi cümlelerimizle özet + arka plan yazılır; sayılar kaynakta geçtiği gibi verilir;
// doğrulanamayan iddia yazılmaz; kaçak kazı haberlerinde yer tarifi verilmez. Her haberde kaynak bağlantısı bulunur.
// Öğe: { id, date: 'YYYY-MM-DD', title, lead, paragraphs[], sources[{ name, url }], related[{ title, href }] }

export const NEWS = [
  {
    id: 'smyrna-agorasi-2026-duvar-resimleri-su-kanali',
    date: '2026-11-16',
    title: 'Smyrna Agorası’nda 2026 sezonu: duvar resimli odalar ve Roma su kanalı',
    lead: 'İzmir’in tarihî merkezindeki Smyrna Agorası ve antik tiyatro çevresinde süren kazılarda Geç Antik Çağ’a ait odalar, daha önce burada görülmemiş duvar resimleri ve izi sürülen bir Roma su kanalı öne çıktı.',
    paragraphs: [
      'Smyrna kazıları, Prof. Dr. Akın Ersoy başkanlığında yürütülüyor. Ekip bu yıl Agora ile tiyatro arasındaki alanda üç oda ortaya çıkardı. Odalar MS 5. ve 6. yüzyıllara, yani kentin Geç Antik Çağ evresine tarihleniyor. İkisinin zemini mozaikle kaplı, üçüncüsünde ise mermer döşeme var.',
      'Sezonun en dikkat çeken yanı, odaların duvarlarında bulunan resimler. Ersoy’un açıklamalarına göre Smyrna Agorası’nda ve tiyatro çevresinde bu türden duvar resimlerine daha önce rastlanmamıştı. Resimlerin konusu ve üslubu henüz ayrıntılı olarak yayımlanmadı; bu nedenle ne tasvir ettiklerine dair yorum yapmak için bilimsel yayınları beklemek gerekiyor.',
      'Kazı ekibi yapıları Efes’teki Yamaç Evleri ile karşılaştırıyor. Ancak odaların bir konuta mı, yoksa kamusal bir işleve mi ait olduğu henüz kesinleşmiş değil. Ersoy, bunun için alanın genişletilmesi ve çalışmaların sürmesi gerektiğini vurguluyor.',
      'Aynı sezon, kentin su sistemine ait önemli bir ipucu da verdi. Ekip, Roma dönemine ait bir su kanalını yaklaşık 150 metre boyunca izledi. Kanalın suyu nereden aldığı ise henüz belirlenemedi. Antik kentlerde su yolları, kentin büyüklüğü, nüfusu ve bayındırlık düzeni hakkında doğrudan bilgi veren yapılardır.',
      'Smyrna Agorası, modern İzmir’in içinde kalan nadir açık arkeolojik alanlardan biri. Kazılar her yıl kentin Roma ve Geç Antik dönemlerine yeni katmanlar ekliyor; geçen sezonlarda bulunan mozaikli mekânlar da bu yıl yeniden ele alındı.',
      'Neden önemli? Duvar resimleri, mozaikler ve zemin döşemeleri bir yapının kimler tarafından ve ne amaçla kullanıldığını anlamanın en güçlü ipuçlarıdır. Bu bilgiler ancak buluntular yerinde, katmanlarıyla birlikte belgelendiğinde elde edilebilir. Kaçak kazıyla sökülen tek bir mozaik parçası bile bu bütünlüğü kalıcı olarak bozar.',
    ],
    sources: [
      { name: 'Hürriyet Daily News: New rooms, paintings unearthed at Smyrna', url: 'https://www.hurriyetdailynews.com/new-rooms-paintings-unearthed-at-smyrna-226279' },
      { name: 'Archaeology (AIA): Paintings and Floor Surfaces Revealed in Smyrna’s Agora', url: 'https://archaeology.org/news/2026/09/01/paintings-and-floor-surfaces-revealed-in-smyrnas-agora/' },
      { name: 'Greek Reporter (2 Ekim 2026): Roman water channel', url: 'https://greekreporter.com/2026/10/02/roman-water-channel-ancient-greek-city-smyrna/' },
    ],
    related: [
      { title: 'Anadolu’nun arkeolojik dönemleri', href: '/rehber/anadolu-arkeolojik-donemler' },
      { title: 'Seramik nasıl tarihlenir?', href: '/rehber/seramik-nasil-tarihlenir' },
    ],
  },
  {
    id: 'seyitomer-hoyugu-5-bin-yillik-ekmekler',
    date: '2026-11-05',
    title: 'Seyitömer Höyüğü’nde 5 bin yıllık yangından kalma 8 ekmek bulundu',
    lead: 'Kütahya’daki Seyitömer Höyüğü’nde, yaklaşık 5 bin yıl önce çıkan bir yangında kömürleşerek günümüze ulaşan sekiz ekmek kalıntısı ile buğday ve mercimek taneleri ortaya çıkarıldı.',
    paragraphs: [
      'Seyitömer Höyüğü’ndeki kazılar, Kütahya Müzesi Müdürü Dr. Sevgi Gürdal başkanlığında sürüyor. Ekip bu sezon Orta Tunç Çağı ve Erken Tunç Çağı tabakalarında çalıştı. Geçen yıl aynı yapıda bir fırın ve duvar dibinde raf kalıntıları bulunmuştu. Bu yıl raf ayaklarının arasında yanmış sekiz ekmek, buğday ve mercimek kalıntıları ele geçti.',
      'Gürdal’ın açıklamasına göre buluntular yaklaşık 5 bin yıl öncesine, Erken Tunç Çağı’nın ilk çeyreğine tarihleniyor. Ekibin yorumu şöyle: Yangından önce odada bir raf vardı ve rafın üzerinde çuval ya da torbalar içinde tahıl, bakliyat ve ekmek saklanıyordu. Yangında raf çöktü, ürünler birbirine karışarak toprağın altında kaldı. Ekmek, buğday ve mercimek kalıntıları bugün Kütahya Arkeoloji ve Maden Müzesi’nde sergileniyor.',
      'Seyitömer, kökeni MÖ 3000’li yıllara uzanan büyük bir höyük. Kent merkezine yaklaşık 26 kilometre uzaklıkta, bir termik santralin linyit sahası içinde kalıyor. Bu nedenle buradaki çalışmalar baştan beri bir kurtarma kazısı. Kazılar 1989’da başladı, farklı dönemlerde Eskişehir ve Afyonkarahisar müzeleri ile Kütahya Dumlupınar Üniversitesi tarafından yürütüldü. Höyükten bugüne kadar 17 binden fazla eser çıkarıldı. Çalışmalar 2019’dan beri Kütahya Müzesi Müdürlüğü’nde.',
      'Bu buluntu, Eskişehir’deki Küllüoba Höyüğü’nde daha önce bulunan ve ritüel amaçla gömüldüğü düşünülen tek ekmekle karıştırılmamalı. Seyitömer’deki ekmekler, gündelik bir depolama alanında bir yangın anında yakalanmış.',
      'Neden önemli? Yanarak kömürleşen tahıl ve ekmek, normalde çürüyüp kaybolan gıdaların arkeolojide korunabilmesinin ender yollarından biri. Bu kalıntılar, 5 bin yıl önce Anadolu’da hangi bitkilerin yetiştirildiğini, ekmeğin nasıl yapıldığını ve evlerde yiyeceğin nasıl saklandığını doğrudan gösteriyor. Bilginin değeri, buluntunun raf, fırın ve yangın tabakasıyla birlikte belgelenmesinden geliyor.',
    ],
    sources: [
      { name: 'Diken (5 Kasım 2026, AA fotoğraflarıyla)', url: 'https://www.diken.com.tr/kutahyada-5-bin-yillik-ekmek-kalintilari-bulundu/' },
      { name: 'Yeni Asır (6 Kasım 2026)', url: 'https://www.yeniasir.com.tr/ege/kutahya/2026/11/06/kutahyada-5-bin-yillik-ekmek-kalintilari-bulundu' },
    ],
    related: [
      { title: 'Anadolu’nun arkeolojik dönemleri', href: '/rehber/anadolu-arkeolojik-donemler' },
      { title: 'Seramik nasıl tarihlenir?', href: '/rehber/seramik-nasil-tarihlenir' },
    ],
  },
  {
    id: 'kultur-bakanligi-2026-kazi-bilancosu',
    date: '2026-11-06',
    title: '2026 kazı bilançosu: 67 ilde 261 kazı alanı, 32 binden fazla buluntu',
    lead: 'Kültür ve Turizm Bakanı Mehmet Nuri Ersoy, TBMM Plan ve Bütçe Komisyonu’nda yaptığı sunumda Türkiye’deki arkeolojik çalışmaların 2026 tablosunu paylaştı.',
    paragraphs: [
      'Bakan Ersoy’un 6 Kasım 2026’da Plan ve Bütçe Komisyonu’nda yaptığı sunuma göre, 2026 yılında 67 ilde 261 kazı alanında çalışma yürütüldü. Bakanlığın “Geleceğe Miras” projesi kapsamında 2024–2026 döneminde 32 binden fazla arkeolojik buluntunun gün yüzüne çıkarıldığı açıklandı.',
      'Sunumda paylaşılan diğer rakamlara göre yabancı heyetlerin yürüttüğü 29 kazı, yıl boyunca sürecek 12 aylık çalışma programına alındı. Yıl sonunda kazı ve araştırma sayısının 800’e ulaşması, 2027’de ise bu sayının 820’ye çıkarılması hedefleniyor. Kazılarda 3 bin 500’ün üzerinde uzman ile 6 bin 500’den fazla çalışanın görev aldığı, son iki yılda 944 bilimsel yayının hazırlanmasına katkı sunulduğu belirtildi.',
      'Kültür varlıklarının iadesi konusunda da rakamlar paylaşıldı: 2026’da 126 eser Türkiye’ye geri getirildi; 2002–2026 döneminde iade edilen eserlerin toplamı 13 bin 574’e ulaştı. Bu eserlerin önemli bir bölümü geçmişte kaçak kazılarla çıkarılıp yurt dışına götürülmüş parçalardır.',
      'Sunumda ayrıca UNESCO Dünya Miras Komitesi’nin 49. oturumunun 27 Haziran–7 Temmuz 2027 tarihlerinde İstanbul’da yapılacağı hatırlatıldı.',
      'Neden önemli? Kazı sayısının artması, Anadolu’nun farklı dönemlerine ait bilgilerin hızla çoğalması demek. Ancak bu çalışmaların değeri, buluntuların bağlamıyla birlikte belgelenmesine dayanıyor. Kaçak kazıyla yerinden sökülen bir eser, iade edilse bile bulunduğu katmanın anlattığı bilgiyi bir daha geri getiremiyor.',
    ],
    sources: [{ name: 'Takvim (6 Kasım 2026)', url: 'https://www.takvim.com.tr/guncel/2026/11/06/kultur-ve-turizm-bakani-mehmet-nuri-ersoy-tbmm-plan-ve-butce-komisyonunda-sunum-yapti' }],
    related: [
      { title: 'Anadolu’nun arkeolojik dönemleri', href: '/rehber/anadolu-arkeolojik-donemler' },
      { title: 'Tarihi eser bulursam ne yapmalıyım?', href: '/rehber/tarihi-eser-bulursam-ne-yapmaliyim' },
    ],
  },
  {
    id: 'yalova-cobankale-2026-kazilari-tamamlandi',
    date: '2026-11-04',
    title: 'Yalova Çobankale’de 2026 kazı sezonu tamamlandı',
    lead: 'Yalova’nın Altınova ilçesindeki Çobankale’de bu yılın arkeolojik kazı çalışmaları sona erdi; buluntular Yalova Müzesi’ne taşındı.',
    paragraphs: [
      'Yalova Altınova’daki Çobankale’de 2026 yılı kazı çalışmaları tamamlandı. Sezon boyunca ele geçen buluntular Yalova Müzesi’ne teslim edildi. Belgeleme ve yayına hazırlık çalışmalarının yıl sonuna kadar Yalova Müze Müdürlüğü denetiminde sürdürülmesi planlanıyor.',
      'Kazı sezonunun kapanışında Yalova İl Kültür ve Turizm Müdürü Fatih Bayram alanı ziyaret etti. Ziyarete Müze Müdürü Ali Sinan Özbey ile Kazı Başkan Vekili Doç. Dr. Ali Özcan eşlik etti.',
      'Arka plan: Çobankale, Marmara’nın güney kıyısını izleyen yollara hâkim bir tepede yer alan Orta Çağ kalelerinden biridir. Bu tür kaleler, Bizans döneminde kıyı yollarının ve çevredeki yerleşimlerin korunmasında önemli rol oynamıştır.',
      'Kazı sezonunun bitmesi, işin bittiği anlamına gelmiyor. Arkeolojide asıl uzun süren aşama, sahadan gelen buluntuların temizlenmesi, çizilmesi, fotoğraflanması, tarihlenmesi ve raporlanmasıdır. Bir kazının bilimsel sonuçları çoğu zaman bu masa başı çalışmalarından sonra, kazı sonuçları toplantılarında ve bilimsel yayınlarda paylaşılır.',
    ],
    sources: [{ name: 'GDH (4 Kasım 2026)', url: 'https://gdhdijital.com/haber/cobankale-de-2026-yili-kazi-calismalari-tamamlandi-a7fa2dt0dvh' }],
    related: [
      { title: 'Seramik nasıl tarihlenir?', href: '/rehber/seramik-nasil-tarihlenir' },
      { title: 'Roma ve Bizans sikkeleri', href: '/rehber/bizans-ve-roma-sikkeleri' },
    ],
  },
  {
    id: 'golyazi-apollonia-tiyatrosunda-mezar',
    date: '2026-11-01',
    title: 'Bursa Gölyazı’daki antik tiyatronun oturma sıralarında mezar bulundu',
    lead: 'Apollonia ad Rhyndacum antik kentinin tiyatrosunda, seyirci bölümünde MS 1. yüzyıla tarihlenen bir yakma mezar ortaya çıkarıldı.',
    paragraphs: [
      'Bursa’nın Nilüfer ilçesine bağlı Gölyazı’daki Apollonia ad Rhyndacum antik kentinde sürdürülen tiyatro kazılarında alışılmadık bir buluntu ele geçti: tiyatronun seyirci bölümünün (cavea) alt kısmında, kuzey kesimde bir mezar bulundu. Mezar, MS 1. yüzyıla tarihleniyor.',
      'Mezar, kerpiçten bir sanduka ve bunun üzerine çatı biçiminde yerleştirilmiş pişmiş toprak kiremitlerden oluşuyor. Gömülen kişinin yakıldığı belirlendi. Kemikler yandığı için bireyle ilgili bilgi sınırlı; mezarda kaç kişinin bulunduğu da tespit edilemedi. Mezarın yapısı, kentin nekropolündeki mezarlarla aynı özellikleri taşıyor.',
      'Kazı başkanı Bursa Uludağ Üniversitesi Arkeoloji Bölümü’nden Prof. Dr. Derya Şahin, bir tiyatronun içine mezar yapılmasının olağan olmadığını, mezarın bir kutsallık ya da kahramanlık anlatısıyla bağlantılı olabileceğini belirtiyor. Ekip, bu olasılığı araştırmak için antik kaynakları tarayacak.',
      'Tiyatro, Hellenistik dönemde Zambaktepe’nin yamacına, Uluabat Gölü’ne bakacak şekilde inşa edilmiş ve yaklaşık 5.000 kişilik. Bugüne kadar 42 seyirci basamağı yerine yerleştirildi. Yazıtlara göre yapının son evresi MS 2. yüzyılın başlarına tarihleniyor. Kültür ve Turizm Bakanlığı izniyle 2021’de başlayan kazılar, Nilüfer Belediyesi desteğiyle sürüyor.',
      'Neden ilginç? Antik dünyada ölüler genellikle kent dışındaki nekropollere gömülürdü. Kentin kamusal bir yapısının içinde, üstelik seyirci sıralarında bir mezar bulunması, ya o kişiye gösterilen özel bir saygıya ya da tiyatronun kullanım tarihindeki bilinmeyen bir evreye işaret ediyor olabilir. Kesin yorum için kazı ekibinin yayınlarını beklemek gerekiyor.',
    ],
    sources: [{ name: 'Arkeofili (1 Kasım 2026)', url: 'https://arkeofili.com/bursadaki-antik-tiyatronun-oturma-siralarinda-mezar-bulundu/' }],
    related: [
      { title: 'Anadolu’nun arkeolojik dönemleri', href: '/rehber/anadolu-arkeolojik-donemler' },
      { title: 'Tümülüs nedir?', href: '/rehber/tumulus-nedir' },
    ],
  },
  {
    id: 'troya-kemik-flut-ve-idol-basi',
    date: '2026-10-22',
    title: 'Troya’da 160 yılı aşkın kazı tarihinin ilk müzik aleti: 2 bin 800 yıllık kemik flüt',
    lead: 'Troya’daki 2026 kazılarında yaklaşık 2 bin 800 yıllık bir kemik flüt ile 4 bin 500 yıllık insan biçimli bir idol başı bulundu.',
    paragraphs: [
      'Kültür ve Turizm Bakanı Mehmet Nuri Ersoy, Troya’daki 2026 kazı sezonunda iki dikkat çekici buluntu ele geçtiğini sosyal medya hesabından duyurdu. “Geleceğe Miras” projesi kapsamında yürütülen çalışmalarda yaklaşık 2 bin 800 yıllık bir kemik flüt ve yaklaşık 4 bin 500 yıllık insan biçimli bir idol başı bulundu.',
      'Açıklamaya göre kemik flüt, 160 yılı aşkın Troya kazıları tarihinde bulunan ilk müzik aleti. Flüt Arkaik Döneme, yaklaşık MÖ 750–480 yıllarına tarihleniyor. Böylece Troya’da müzik yapıldığına dair, Bakan Ersoy’un ifadesiyle, doğrudan bir arkeolojik kanıta ulaşılmış oldu.',
      'İdol başı ise Troya II kentinin kapısı çevresinde bulundu ve yaklaşık MÖ 2500 yıllarına tarihleniyor. Troya II evresi yaklaşık MÖ 2500–2300 yıllarına karşılık gelir; bu evre, Heinrich Schliemann’ın 19. yüzyılda “Priamos’un Hazinesi” adını verdiği ünlü buluntularla da tanınır.',
      'Arka plan: Çanakkale’deki Troya ören yeri, MÖ 3. binyılın başlarından MS 13. yüzyıla kadar uzanan on ana yerleşim katmanıyla Anadolu’nun en uzun soluklu yerleşimlerinden biridir ve 1998’den beri UNESCO Dünya Mirası Listesi’ndedir. Katmanların üst üste bu kadar düzenli izlenebilmesi, Troya’yı arkeolojide “höyük” kavramının en bilinen örneklerinden biri yapar.',
    ],
    sources: [{ name: 'A Haber (22 Ekim 2026)', url: 'https://www.ahaber.com.tr/yasam/2026/10/22/160-yili-gecen-kazi-tarihimizde-bir-ilk-dogrudan-bir-arkeolojik-kanita-ulastik' }],
    related: [
      { title: 'Anadolu’nun arkeolojik dönemleri', href: '/rehber/anadolu-arkeolojik-donemler' },
      { title: 'Seramik nasıl tarihlenir?', href: '/rehber/seramik-nasil-tarihlenir' },
    ],
  },
];
