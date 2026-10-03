import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type GuideSection = {
  heading: string;
  body?: string;
  bullets?: string[];
};

export type GuideTopic = {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  wiki?: { tr?: string; en?: string };
  /** Kapak fotoğrafı için aday Wikipedia sayfaları ("en:Başlık"); yoksa wiki.en/wiki.tr denenir. */
  photo?: string[];
  accent: string;
  sections: GuideSection[];
};

export const GUIDE: GuideTopic[] = [
  {
    id: 'sikkeler',
    title: 'Sikkeler',
    subtitle: 'Lidya’dan Osmanlı’ya madeni paraları tanıma',
    icon: 'circle-multiple',
    wiki: { tr: 'Sikke', en: 'Coin' },
    photo: ['en:Croeseid', 'en:Lydian coinage', 'en:Coin'],
    accent: '#C9A227',
    sections: [
      {
        heading: 'Neye bakmalı?',
        bullets: [
          'Ön yüz (avers): genellikle hükümdar portresi, tanrı başı veya yazı.',
          'Arka yüz (revers): sembol, hayvan, tanrı figürü veya darp yeri.',
          'Yazı dili ve harfleri: Grekçe, Latince, Arapça veya Osmanlıca.',
          'Kenar yapısı, ağırlık ve çap: her dönemin standart ölçüleri vardır.',
          'Maden: elektron, altın, gümüş, bronz veya bakır.',
        ],
      },
      {
        heading: 'Dönemlere göre kısa rehber',
        bullets: [
          'Lidya (MÖ 7–6. yy): düzensiz elektron külçe, aslan başı; arka yüzde zımba izi.',
          'Grek kent sikkeleri: kent sembolleri (Efes arısı, Side narı, Rodos gülü).',
          'Hellenistik: Büyük İskender tipli tetradrahmiler, Herakles başı.',
          'Roma İmparatorluk: imparator portresi, Latince ünvanlar (IMP, CAES, AVG).',
          'Roma eyalet (kent) basımları: Grekçe yazı ve kent adıyla basılmış bronzlar.',
          'Bizans: cephe portreler, haç; büyük “M” harfi follis değerini gösterir.',
          'Selçuklu ve Beylikler: Arapça yazılı, bazen atlı okçu figürlü dirhem ve bakırlar.',
          'Osmanlı: küçük gümüş akçe, tuğra ve “duribe” (basıldığı yer) ibaresi.',
        ],
      },
      {
        heading: 'Temizlemeyin',
        body: 'Sikkeyi asla zımparalamayın, asitle veya kimyasalla temizlemeyin. Patina eserin yaşını ve orijinalliğini gösterir; yanlış temizlik değerini ve bilimsel bilgisini yok eder.',
      },
    ],
  },
  {
    id: 'seramik',
    title: 'Seramik ve Pişmiş Toprak',
    subtitle: 'Çanak çömlek parçalarından dönem tahmini',
    icon: 'pot-mix',
    wiki: { tr: 'Seramik', en: 'Pottery' },
    photo: ['en:Ancient Greek pottery', 'en:Terra sigillata', 'en:Attic vase painting', 'en:Black-figure pottery'],
    accent: '#B5651D',
    sections: [
      {
        heading: 'Seramik neden önemli?',
        body: 'Arkeolojide en çok bulunan malzeme seramiktir. Hamur rengi, katkı maddeleri, yüzey işlemi ve biçim, bir parçanın dönemini çoğu zaman sikke kadar iyi gösterir.',
      },
      {
        heading: 'Tanıma ipuçları',
        bullets: [
          'El yapımı ve kalın cidarlı, düzensiz parçalar: genellikle Neolitik–Tunç Çağı.',
          'Açkılı (parlatılmış) siyah veya kırmızı yüzey: Tunç Çağı geleneği.',
          'Siyah figürlü / kırmızı figürlü: Grek Arkaik ve Klasik dönem.',
          'Parlak kırmızı astarlı, kalıp bezemeli: Roma “terra sigillata”.',
          'Kazıma bezemeli sırlı tabak (sgraffito): Bizans ve Orta Çağ.',
          'Kobalt mavisi, firuze çini: Selçuklu ve Osmanlı.',
        ],
      },
      {
        heading: 'Amfora ve mühürleri',
        body: 'Taşıma kapları olan amforaların kulplarında bazen üretim yerini ve memur adını gösteren mühürler bulunur (Rodos, Knidos, Sinop). Bu mühürler tarihlemede çok değerlidir.',
      },
    ],
  },
  {
    id: 'kandiller',
    title: 'Kandiller',
    subtitle: 'Antik aydınlatma araçları',
    icon: 'lamp',
    wiki: { en: 'Oil lamp' },
    photo: ['en:Oil lamp', 'en:Roman lamp', 'en:Lucerna'],
    accent: '#D08C3C',
    sections: [
      {
        heading: 'Gelişimi',
        bullets: [
          'Hellenistik: çarkta yapılmış, uzun burunlu, siyah veya kahverengi astarlı.',
          'Roma: iki parçalı kalıpla yapılmış, üstü resimli disk (tanrılar, gladyatörler, hayvanlar).',
          'Geç Roma ve Bizans: haç, kuş veya geometrik desenli, bazen tabanda atölye işareti.',
          'İslami dönem: uzun gagalı, sırlı kandiller.',
        ],
      },
      {
        heading: 'Sahte kandiller',
        body: 'Turistik bölgelerde satılan kandiller çoğunlukla yeni yapımdır: aşırı keskin kalıp çizgileri, düzgün ve “yapay eskitilmiş” yüzey, içte is izi olmaması dikkat edilecek noktalardır.',
      },
    ],
  },
  {
    id: 'muhurler',
    title: 'Mühürler',
    subtitle: 'Damga, silindir ve kurşun mühürler',
    icon: 'stamper',
    wiki: { tr: 'Mühür', en: 'Seal (emblem)' },
    photo: ['en:Cylinder seal', 'en:Stamp seal', 'en:Seal (emblem)'],
    accent: '#8E3B2E',
    sections: [
      {
        heading: 'Türleri',
        bullets: [
          'Damga mühür: Neolitik’ten itibaren; Hitit damga mühürlerinde hiyeroglif isimler bulunur.',
          'Silindir mühür: Mezopotamya ve Asur Ticaret Kolonileri; kil üzerinde yuvarlanarak kullanılır.',
          'Bulla: kil veya kurşuna basılmış mühür izi. Zeugma’da binlercesi bulunmuştur.',
          'Bizans kurşun mühürleri (molybdobull): bir yüzde aziz/haç, diğer yüzde sahibinin adı ve unvanı.',
          'Osmanlı mühürleri: akik veya pirinç, aynalı (ters) Arapça harfli.',
        ],
      },
    ],
  },
  {
    id: 'takilar',
    title: 'Takı ve Metal Eserler',
    subtitle: 'Fibula, yüzük, bilezik ve haçlar',
    icon: 'ring',
    wiki: { en: 'Fibula (brooch)' },
    photo: ['en:Fibula (brooch)', 'en:Byzantine jewellery', 'en:Ancient Greek jewellery'],
    accent: '#A3683A',
    sections: [
      {
        heading: 'Metali tanıma',
        bullets: [
          'Bronz: yeşil veya kahverengi patina; aktif “bronz hastalığı” toz halinde açık yeşildir.',
          'Gümüş: siyah veya mor-gri oksit; kırılgan olabilir.',
          'Altın: oksitlenmez, parlak kalır; toprakta binlerce yıl rengini korur.',
          'Demir: kalın pas kabukları, şekli bozulmuş olabilir.',
        ],
      },
      {
        heading: 'Yaygın buluntular',
        bullets: [
          'Fibula (çengelli iğne): Frig, Roma ve Bizans dönemlerinde giysi tutturucu.',
          'Yüzükler: oyma taşlı (gem) Roma yüzükleri, Bizans monogramlı yüzükler.',
          'Haçlar ve enkolpionlar (içi boş, rölik konan haç kolyeler): Bizans.',
          'Cam bilezikler: Orta Çağ ve Osmanlı döneminde çok yaygındır.',
        ],
      },
    ],
  },
  {
    id: 'figurinler',
    title: 'Heykelcik ve Figürinler',
    subtitle: 'Ana tanrıçadan Roma bronzlarına',
    icon: 'human-female',
    wiki: { tr: 'Figürin', en: 'Figurine' },
    photo: ['en:Seated Woman of Çatalhöyük', 'en:Tanagra figurine'],
    accent: '#9C5B2E',
    sections: [
      {
        heading: 'Dönemler',
        bullets: [
          'Neolitik–Kalkolitik: dolgun hatlı “ana tanrıça” figürinleri (Çatalhöyük, Hacılar).',
          'Tunç Çağı: keman biçimli idoller (Batı Anadolu), Hitit bronz tanrı figürleri.',
          'Hellenistik: pişmiş toprak Tanagra tipi kadın figürinleri, Eros figürleri.',
          'Roma: bronz Hermes, Afrodit, Lar figürinleri; mermer heykel parçaları.',
        ],
      },
    ],
  },
  {
    id: 'isaretler',
    title: 'Define İşaretleri',
    subtitle: 'Halk inanışı ve bilimsel açıklaması',
    icon: 'sign-direction',
    wiki: { tr: 'Petroglif', en: 'Cup and ring mark' },
    photo: ['en:Petroglyph', 'en:Cup and ring mark', 'en:Rock art'],
    accent: '#7A5C3E',
    sections: [
      {
        heading: 'Önce bilmeniz gereken',
        body: 'Kayalardaki “define işaretleri” halk arasında çok yaygın bir inanıştır, ancak bilimsel olarak işaretlerin gömü gösterdiğine dair kanıt yoktur. Bu işaretlerin büyük kısmı doğal aşınma, çoban ve sınır işaretleri, sonraki dönem kazımaları veya kaya mezarı ve tapınak gibi bilinen yapıların parçalarıdır. Aşağıda halk arasındaki yorum ile arkeolojik açıklama birlikte verilmiştir.',
      },
      {
        heading: 'Yaygın işaretler',
        bullets: [
          'Yılan — Halk inanışı: “gömü yakındır.” Arkeoloji: Antik çağda koruyucu ve şifa simgesi; çoğu zaman doğal kaya damarıdır.',
          'Kaplumbağa — Halk inanışı: “başın gösterdiği yöne bak.” Arkeoloji: Doğal kaya oluşumu olabilir; kaplumbağa kabartması nadirdir.',
          'Haç — Halk inanışı: “Rum gömüsü.” Arkeoloji: Bizans döneminde kilise, şapel, mezar ve sınır taşlarında çok yaygındır.',
          'Çanak/kupul delikleri — Halk inanışı: “sayısı derinliği gösterir.” Arkeoloji: Tarih öncesi kült, öğütme veya su toplama çukurları; çoğunlukla doğal erozyon.',
          'Ok ve ayak izi — Halk inanışı: “yön gösterir.” Arkeoloji: Çoğu sonraki dönem çoban ve yol işaretidir.',
          'At nalı ve kemer biçimi — Halk inanışı: “kapı veya mağara ağzı.” Arkeoloji: Çoğunlukla doğal kaya kırığı veya niş.',
        ],
      },
      {
        heading: 'Uygulamada kullanmak',
        body: 'Bir kaya işaretinin fotoğrafını çekip tarattığınızda yapay zeka, işaretin insan yapımı mı doğal mı olduğunu ve tarihsel olarak neyle ilişkili olabileceğini değerlendirir.',
      },
    ],
  },
  {
    id: 'sahte',
    title: 'Sahte Eser Nasıl Anlaşılır?',
    subtitle: 'Replika ve taklitleri ayırt etme',
    icon: 'magnify-scan',
    wiki: { en: 'Art forgery' },
    photo: ['en:Art forgery', 'en:Replica', 'en:Forgery'],
    accent: '#5A6E8C',
    sections: [
      {
        heading: 'Uyarı işaretleri',
        bullets: [
          'Döküm izleri: kenarlarda dikiş çizgisi, yüzeyde küçük hava kabarcıkları.',
          'Yapay patina: her yerde eşit, kolay kazınan, boya kokan renk.',
          'Aşınma tutarsızlığı: çıkıntılar aşınmamış ama girintiler kirli ya da tersi.',
          'Ağırlık: aynı boyuttaki orijinal sikkeye göre fazla hafif veya ağır.',
          'Mıknatıs: gümüş veya bronz görünen eserin mıknatısa yapışması.',
          'Fazla mükemmel ve keskin detaylar, modern alet izleri.',
        ],
      },
      {
        heading: 'Bilinmesi gereken',
        body: 'Fotoğrafla yapılan hiçbir değerlendirme kesin değildir. Kesin sonuç için eserin müze uzmanlarınca incelenmesi gerekir.',
      },
    ],
  },
  {
    id: 'yasal',
    title: 'Eser Bulursanız Ne Yapmalı?',
    subtitle: 'Yasal süreç, haklar ve cezalar',
    icon: 'scale-balance',
    photo: ['en:Museum of Anatolian Civilizations', 'en:Istanbul Archaeology Museums', 'tr:Anadolu Medeniyetleri Müzesi'],
    accent: '#3E7C8C',
    sections: [
      {
        heading: 'Bildirim zorunluluğu',
        body: '2863 sayılı Kültür ve Tabiat Varlıklarını Koruma Kanunu’na göre, bir taşınır kültür varlığı bulan kişi bunu en geç üç gün içinde en yakın müze müdürlüğüne, köy muhtarına veya mülki amirliğe (kaymakamlık/valilik) bildirmekle yükümlüdür.',
      },
      {
        heading: 'İkramiye',
        body: 'Kanun, buluntuyu bildiren ve devlete teslim eden kişiye, eserin değerine göre belirlenen ikramiye verilmesini öngörür. Yani eseri teslim etmek hem yasal hem de ödüllüdür.',
      },
      {
        heading: 'Yasal define arama',
        bullets: [
          'Define arama izni Kültür ve Turizm Bakanlığı tarafından verilir; başvuru valilik aracılığıyla yapılır.',
          'Sit alanları, ören yerleri, tescilli yapılar ve bunların koruma alanlarında izin verilmez.',
          'Arama, resmi görevliler gözetiminde ve masrafları başvurana ait olarak yapılır.',
        ],
      },
      {
        heading: 'Cezalar',
        body: 'İzinsiz kazı ve sondaj, kültür varlığı kaçakçılığı, satışı ve satın alınması hapis ve adli para cezası gerektiren suçlardır. Dedektörle izinsiz arama yapılması da yasaktır.',
      },
    ],
  },
  {
    id: 'fotograf',
    title: 'İyi Fotoğraf Nasıl Çekilir?',
    subtitle: 'Yapay zekadan en doğru sonucu almak için',
    icon: 'camera-iris',
    photo: ['en:Excavation (archaeology)', 'en:Archaeology', 'en:Archaeological field survey'],
    accent: '#C08B5C',
    sections: [
      {
        heading: 'İpuçları',
        bullets: [
          'Gün ışığında, doğrudan güneş yerine gölgede çekin; flaştan kaçının.',
          'Eseri düz ve sade bir zemine (tercihen gri veya beyaz) koyun.',
          'Boyut için yanına bir cetvel veya bozuk para koyun.',
          'Sikke ve mühürlerde her iki yüzü ayrı ayrı çekin ve taratın.',
          'Yazı ve bezemeleri yandan gelen ışıkla çekmek kabartmaları belirginleştirir.',
          'Eseri temizlemeyin; toprağı yalnızca yumuşak fırça ile hafifçe alın.',
        ],
      },
    ],
  },
  {
    id: 'zaman',
    title: 'Anadolu Zaman Çizelgesi',
    subtitle: 'Uygarlıklar ve dönemler bir bakışta',
    icon: 'timeline-clock',
    wiki: { tr: 'Göbekli Tepe', en: 'Göbekli Tepe' },
    photo: ['en:Göbekli Tepe'],
    accent: '#6E5A7E',
    sections: [
      {
        heading: 'Başlıca dönemler',
        bullets: [
          'MÖ 10.000–6.000 · Neolitik: Göbekli Tepe, Çatalhöyük, Çayönü',
          'MÖ 6.000–3.000 · Kalkolitik: Hacılar, Yumuktepe, Arslantepe',
          'MÖ 3.000–2.000 · Erken Tunç Çağı: Troya, Alacahöyük kral mezarları',
          'MÖ 2.000–1.750 · Asur Ticaret Kolonileri: Kültepe-Kaniş',
          'MÖ 1.650–1.180 · Hitit İmparatorluğu',
          'MÖ 1.200–600 · Geç Hitit, Frig, Urartu, Lidya krallıkları',
          'MÖ 546–334 · Pers (Akhaimenid) hâkimiyeti',
          'MÖ 334–30 · Hellenistik dönem: İskender ve halefleri, Pergamon',
          'MÖ 30–MS 395 · Roma İmparatorluğu',
          'MS 395–1453 · Bizans İmparatorluğu',
          '1071–1308 · Anadolu Selçukluları ve beylikler',
          '1299–1922 · Osmanlı İmparatorluğu',
        ],
      },
    ],
  },
];

export const getGuideTopic = (id: string) => GUIDE.find((g) => g.id === id);
