// Arkeoloji haberleri (gen-seo.mjs → /haberler). En yeni üstte olacak şekilde tarih sırasına gerek yok; üretici sıralar.
// Kurallar: kaynaklardan kopyalanmaz, kendi cümlelerimizle özet + arka plan yazılır; sayılar kaynakta geçtiği gibi verilir;
// doğrulanamayan iddia yazılmaz; kaçak kazı haberlerinde yer tarifi verilmez. Her haberde kaynak bağlantısı bulunur.
// Öğe: { id, date: 'YYYY-MM-DD', title, lead, paragraphs[], sources[{ name, url }], related[{ title, href }] }

export const NEWS = [
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
