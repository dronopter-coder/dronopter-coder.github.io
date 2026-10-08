import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type GuideSection = {
  heading: string;
  body?: string;
  bullets?: string[];
  /** Terim–açıklama listesi (sözlük, birim tablosu, dönem tablosu) */
  pairs?: { term: string; desc: string }[];
  /** Renkli ipucu / uyarı kutusu */
  callout?: { kind: 'tip' | 'warning'; text: string };
};

export type GuideCategory = 'eser' | 'inceleme' | 'pratik';

export const GUIDE_CATEGORIES: { id: GuideCategory; label: string }[] = [
  { id: 'eser', label: 'Eserler' },
  { id: 'inceleme', label: 'İnceleme' },
  { id: 'pratik', label: 'Pratik ve Yasal' },
];

export type GuideTopic = {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  category: GuideCategory;
  wiki?: { tr?: string; en?: string };
  /** Kapak fotoğrafı için aday Wikipedia sayfaları ("en:Başlık"); yoksa wiki.en/wiki.tr denenir. */
  photo?: string[];
  accent: string;
  /** Konu başında gösterilen hızlı bilgiler */
  facts?: { label: string; value: string }[];
  /** İlgili konu kimlikleri */
  related?: string[];
  sections: GuideSection[];
};

export const GUIDE: GuideTopic[] = [
  // ───────────────────────── ESERLER ─────────────────────────
  {
    id: 'sikkeler',
    title: 'Sikkeler',
    subtitle: 'Lidya’dan Osmanlı’ya madeni paraları tanıma',
    icon: 'circle-multiple',
    category: 'eser',
    wiki: { tr: 'Sikke', en: 'Coin' },
    photo: ['en:Croeseid', 'en:Lydian coinage', 'en:Coin'],
    accent: '#C9A227',
    facts: [
      { label: 'İlk sikke', value: 'Lidya, MÖ 7. yy' },
      { label: 'Maden', value: 'Elektron, altın, gümüş, bronz' },
      { label: 'Bilim dalı', value: 'Nümismatik' },
    ],
    related: ['yazitlar', 'patina', 'sahte'],
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
        callout: {
          kind: 'tip',
          text: 'Taratırken sikkenin iki yüzünü ayrı ayrı çekin ve not alanına çapını (mm) ve ağırlığını (g) yazın. Bu iki bilgi tanımlamayı çok kolaylaştırır.',
        },
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
        heading: 'Para birimleri',
        pairs: [
          { term: 'Stater (Lidya)', desc: 'Elektron sikke; en yaygın bulunanı yaklaşık 4,7 g ağırlığındaki ⅓ stater (trite).' },
          { term: 'Drahmi', desc: 'Grek gümüş birimi; Attik standartta yaklaşık 4,3 g.' },
          { term: 'Tetradrahmi', desc: 'Dört drahmi, yaklaşık 17 g; Hellenistik dönemin büyük gümüş sikkesi.' },
          { term: 'Denarius', desc: 'Roma’nın temel gümüş sikkesi, yaklaşık 3,5–3,9 g.' },
          { term: 'Antoninianus', desc: 'MS 3. yy; ışınlı taç takmış imparator portresiyle tanınır.' },
          { term: 'Solidus', desc: 'Bizans altın sikkesi, yaklaşık 4,5 g; yüzyıllarca değerini korudu.' },
          { term: 'Follis', desc: 'Bizans bronz sikkesi; arka yüzdeki büyük “M” 40 nummi demektir.' },
          { term: 'Dirhem', desc: 'İslami dönemin gümüş sikkesi; Selçuklu ve beyliklerde yaygın.' },
          { term: 'Akçe', desc: 'Osmanlı küçük gümüş sikkesi; erken dönemde yaklaşık 1,1 g, zamanla hafifler.' },
          { term: 'Mangır', desc: 'Osmanlı bakır parası.' },
        ],
      },
      {
        heading: 'Roma sikkelerindeki kısaltmalar',
        pairs: [
          { term: 'IMP', desc: 'Imperator — komutan, imparator' },
          { term: 'CAES', desc: 'Caesar — veliaht veya imparator unvanı' },
          { term: 'AVG', desc: 'Augustus — imparator; AVGG iki imparatoru gösterir' },
          { term: 'P F', desc: 'Pius Felix — dindar ve mutlu' },
          { term: 'P M', desc: 'Pontifex Maximus — baş rahip' },
          { term: 'TR P', desc: 'Tribunicia Potestas — halk tribünü yetkisi; yanındaki sayı yılı gösterir' },
          { term: 'COS', desc: 'Consul — konsül; yanındaki sayı kaçıncı konsüllük olduğunu gösterir' },
          { term: 'S C', desc: 'Senatus Consulto — senato kararıyla (bronz sikkelerde)' },
          { term: 'CONOB', desc: 'Konstantinopolis darphanesinde basılmış saf altın' },
        ],
      },
      {
        heading: 'Temizlemeyin',
        body: 'Sikkeyi asla zımparalamayın, asitle veya kimyasalla temizlemeyin. Patina eserin yaşını ve orijinalliğini gösterir; yanlış temizlik değerini ve bilimsel bilgisini yok eder.',
        callout: {
          kind: 'warning',
          text: 'Limon, sirke, diş macunu veya tel fırça sikkenin yüzeyini geri dönülmez biçimde bozar.',
        },
      },
    ],
  },
  {
    id: 'seramik',
    title: 'Seramik ve Pişmiş Toprak',
    subtitle: 'Çanak çömlek parçalarından dönem tahmini',
    icon: 'pot-mix',
    category: 'eser',
    wiki: { tr: 'Seramik', en: 'Pottery' },
    photo: ['en:Ancient Greek pottery', 'en:Terra sigillata', 'en:Attic vase painting', 'en:Black-figure pottery'],
    accent: '#B5651D',
    facts: [
      { label: 'En sık buluntu', value: 'Çanak çömlek parçası' },
      { label: 'Kullanım', value: 'Neolitik’ten bugüne' },
    ],
    related: ['kandiller', 'cam', 'zaman'],
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
        heading: 'Hamur, astar ve pişirme',
        pairs: [
          { term: 'Kırmızı–turuncu hamur', desc: 'Fırında bol oksijenle (oksitleyici) pişmiş; en yaygın renk.' },
          { term: 'Gri–siyah hamur', desc: 'Oksijeni azaltılmış (indirgeyici) fırında pişmiş; Frig ve bazı Tunç Çağı kapları.' },
          { term: 'Kesitte siyah çekirdek', desc: 'Yeterince yüksek ısıda pişmemiş; çoğunlukla erken ve kaba kaplar.' },
          { term: 'Katkı', desc: 'Hamura karıştırılan saman, kum, kireç veya kırık seramik; kesitte görülür.' },
          { term: 'Astar', desc: 'Yüzeye sürülen ince kil tabakası; parlak ve düzgün görünüm verir.' },
          { term: 'Sır', desc: 'Camsı kaplama; Anadolu’da ağırlıkla Bizans ve İslami dönemlerde yaygınlaşır.' },
        ],
      },
      {
        heading: 'Roma kırmızı astarlı kapları',
        body: 'Anadolu’da Roma dönemi sofra kapları çoğunlukla “Doğu sigillatası” denen parlak kırmızı astarlı kaplardır. Bergama yakınındaki Çandarlı (Pitane) atölyelerinin ürünleri bunların en bilinenidir. Tabanlarda bazen atölye ya da usta adını gösteren küçük damgalar bulunur.',
      },
      {
        heading: 'Amfora ve mühürleri',
        body: 'Taşıma kapları olan amforaların kulplarında bazen üretim yerini ve memur adını gösteren mühürler bulunur (Rodos, Knidos, Sinop). Bu mühürler tarihlemede çok değerlidir.',
      },
      {
        heading: 'Çini',
        body: 'Selçuklu sarayı Kubadabad’ın yıldız ve haç biçimli lüster ve minai çinileri ile 16. yüzyıl İznik çinileri Anadolu çini sanatının zirveleridir. İznik’in parlak mercan kırmızısı, taklitlerden ayırt etmede önemli bir ipucudur.',
        callout: {
          kind: 'tip',
          text: 'Kırık bir parçayı taratırken kırık yüzeyini (kesitini) de çekin; hamur rengi ve katkılar dönem tahmini için çok değerlidir.',
        },
      },
    ],
  },
  {
    id: 'kandiller',
    title: 'Kandiller',
    subtitle: 'Antik aydınlatma araçları',
    icon: 'lamp',
    category: 'eser',
    wiki: { en: 'Oil lamp' },
    photo: ['en:Oil lamp', 'en:Roman lamp', 'en:Lucerna'],
    accent: '#D08C3C',
    facts: [
      { label: 'Yakıt', value: 'Zeytinyağı' },
      { label: 'Malzeme', value: 'Pişmiş toprak, bronz' },
    ],
    related: ['seramik', 'sahte'],
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
        heading: 'Bir kandilin bölümleri',
        pairs: [
          { term: 'Disk', desc: 'Üstteki düz veya çukur yüzey; resimler buraya yapılır, ortasında yağ doldurma deliği bulunur.' },
          { term: 'Omuz', desc: 'Diski çevreleyen halka; çoğu zaman yumurta dizisi, yaprak veya noktalarla bezenir.' },
          {
            term: 'Burun (nozül)',
            desc: 'Fitilin çıktığı kısım; Roma kandillerinde volütlü veya yuvarlak olabilir. Ucu islidir.',
          },
          { term: 'Kulp', desc: 'Tutmaya yarayan halka veya dil biçimli çıkıntı.' },
          { term: 'Taban', desc: 'Bazı Roma kandillerinde atölye adı (ör. FORTIS) damgalanmıştır.' },
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
    category: 'eser',
    wiki: { tr: 'Mühür', en: 'Seal (emblem)' },
    photo: ['en:Cylinder seal', 'en:Stamp seal', 'en:Seal (emblem)'],
    accent: '#8E3B2E',
    facts: [
      { label: 'İlk örnekler', value: 'Neolitik dönem' },
      { label: 'Kullanım', value: 'Sahiplik ve onay işareti' },
    ],
    related: ['yazitlar', 'takilar'],
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
      {
        heading: 'Silindir mühür nasıl okunur?',
        body: 'Silindir mühür yaş kil üzerinde yuvarlandığında, yüzeyine oyulmuş sahne kesintisiz bir şerit olarak çıkar. Kültepe’de (Kaniş) bulunan binlerce tablet zarfının üzerinde Asurlu tüccarların mühür baskıları vardır. Mühürdeki sahne çoğunlukla bir tanrıya sunulan bir kişiyi, hayvan dizilerini veya yazı satırlarını gösterir.',
        callout: {
          kind: 'tip',
          text: 'Mühürlerde sahne ters (ayna görüntüsü) oyulur. Fotoğrafını çekerken baskı yüzeyini yandan gelen ışıkla çekin; oyuklar daha net okunur.',
        },
      },
      {
        heading: 'Bizans kurşun mühürleri',
        body: 'Belgeleri mühürlemek için kullanılan kurşun mühürlerin bir yüzünde çoğunlukla Meryem (Theotokos) veya bir aziz, diğer yüzünde “Rabbim, kulun … yardım et” anlamına gelen kalıp ifade ve sahibinin adı, unvanı yazar. Bunlar Bizans yönetim tarihine dair çok değerli belgelerdir.',
      },
    ],
  },
  {
    id: 'takilar',
    title: 'Takı ve Metal Eserler',
    subtitle: 'Fibula, yüzük, bilezik ve haçlar',
    icon: 'ring',
    category: 'eser',
    wiki: { en: 'Fibula (brooch)' },
    photo: ['en:Fibula (brooch)', 'en:Byzantine jewellery', 'en:Ancient Greek jewellery'],
    accent: '#A3683A',
    facts: [
      { label: 'Yaygın maden', value: 'Bronz, gümüş, altın' },
      { label: 'Tipik buluntu', value: 'Fibula, yüzük, haç' },
    ],
    related: ['patina', 'muhurler', 'silahlar'],
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
      {
        heading: 'Fibula tipleri',
        pairs: [
          {
            term: 'Frig fibulası',
            desc: 'Yay biçimli gövde, bilezik gibi kalın halkalar; Gordion’da çok sayıda bulunmuştur (MÖ 8–7. yy).',
          },
          { term: 'Aucissa tipi', desc: 'Erken Roma; yarım daire gövdeli, başında menteşe bulunan bronz fibula.' },
          {
            term: 'Soğan başlı fibula',
            desc: 'Geç Roma (MS 3–5. yy); T biçimli, uçları soğan gibi şişkin; asker ve memurların rütbe işareti.',
          },
        ],
      },
      {
        heading: 'Döküm mü, dövme mi?',
        body: 'Antik takıların çoğu kalıba dökülmüş ya da ince levhadan dövülerek yapılmıştır. Dövme altın takılarda lehim izleri, telkâri (ince tel işi) ve granülasyon (minik altın tanecikler) görülür. Modern taklitlerde ise kalıp dikiş çizgisi ve gözenekli yüzey dikkat çeker.',
      },
    ],
  },
  {
    id: 'figurinler',
    title: 'Heykelcik ve Figürinler',
    subtitle: 'Ana tanrıçadan Roma bronzlarına',
    icon: 'human-female',
    category: 'eser',
    wiki: { tr: 'Figürin', en: 'Figurine' },
    photo: ['en:Seated Woman of Çatalhöyük', 'en:Tanagra figurine'],
    accent: '#9C5B2E',
    facts: [
      { label: 'Malzeme', value: 'Pişmiş toprak, taş, bronz' },
      { label: 'İşlev', value: 'Adak, kült, süs' },
    ],
    related: ['seramik', 'mimari'],
    sections: [
      {
        heading: 'Dönemler',
        bullets: [
          'Neolitik–Kalkolitik: dolgun hatlı “ana tanrıça” figürinleri (Çatalhöyük, Hacılar).',
          'Kalkolitik: Batı Anadolu’da mermerden “Kilya tipi” idoller.',
          'Tunç Çağı: keman biçimli idoller (Batı Anadolu), Hitit bronz tanrı figürleri.',
          'Hellenistik: pişmiş toprak Tanagra tipi kadın figürinleri, Eros figürleri.',
          'Roma: bronz Hermes, Afrodit, Lar figürinleri; mermer heykel parçaları.',
        ],
      },
      {
        heading: 'Kybele (Matar)',
        body: 'Anadolu’nun ana tanrıçası Kybele, Frig döneminde “Matar” adıyla anılır ve çoğunlukla bir kapı biçimli niş içinde, iki yanında aslanlarla tasvir edilir. Roma döneminde bile yaygın bir adak figürü olmaya devam etmiştir.',
      },
      {
        heading: 'Pişmiş toprak figürinler',
        body: 'Hellenistik ve Roma dönemi pişmiş toprak figürinler kalıpla yapılır; arkaları çoğunlukla düz ve işlenmemiştir, sırtta havalandırma deliği bulunur. Üzerlerinde bazen beyaz astar ve boya izleri kalır.',
        callout: {
          kind: 'tip',
          text: 'Figürinin arka yüzünü de çekin: kalıp izi, havalandırma deliği ve işçilik farkı dönem ve orijinallik için önemli ipuçlarıdır.',
        },
      },
    ],
  },
  {
    id: 'cam',
    title: 'Cam Eserler',
    subtitle: 'Gözyaşı şişelerinden Roma cam kaplarına',
    icon: 'bottle-tonic-outline',
    category: 'eser',
    wiki: { en: 'Roman glass' },
    photo: ['en:Roman glass', 'en:Lachrymatory', 'en:Ancient glass'],
    accent: '#3E8C7A',
    facts: [
      { label: 'Altın çağ', value: 'Roma (MÖ 1. yy – MS 4. yy)' },
      { label: 'Teknik', value: 'Üfleme, kalıp, döküm' },
    ],
    related: ['seramik', 'patina', 'mezarlar'],
    sections: [
      {
        heading: 'Cam üflemenin icadı',
        body: 'MÖ 1. yüzyılda Doğu Akdeniz’de cam üfleme tekniğinin bulunmasıyla cam, lüks bir maddeden günlük eşyaya dönüştü. Roma döneminde şişeler, kâseler, bardaklar ve parfüm kapları çok yaygınlaştı.',
      },
      {
        heading: 'Yaygın buluntular',
        bullets: [
          'Unguentarium (“gözyaşı şişesi”): ince boyunlu küçük parfüm/yağ şişesi; mezarlarda sık bulunur.',
          'Kalıba üflenmiş kaplar: üzerinde yüz, yazı veya desen bulunan şişeler.',
          'Cam bilezik ve boncuklar: Bizans, Selçuklu ve Osmanlı dönemlerinde çok yaygın.',
          'Pencere camı parçaları: hamam ve villa kalıntılarında görülür.',
        ],
      },
      {
        heading: 'İrizasyon: gökkuşağı renkleri',
        body: 'Toprakta yüzyıllarca kalan camın yüzeyi nem ve kimyasallarla ayrışır, ince katmanlar halinde soyulur. Bu katmanlar ışığı kırarak gökkuşağı renkleri verir. İrizasyon eski camın tipik bir özelliğidir, ancak taklitçiler bunu kimyasallarla da üretebilir.',
        callout: {
          kind: 'warning',
          text: 'İrize camın yüzeyi pul pul dökülebilir; silmeyin, yıkamayın. Kuru ve yumuşak bir zeminde saklayın.',
        },
      },
    ],
  },
  {
    id: 'silahlar',
    title: 'Ok Uçları ve Silahlar',
    subtitle: 'Tunç ok uçları, sapan taşları, kılıç parçaları',
    icon: 'arrow-projectile',
    category: 'eser',
    wiki: { en: 'Arrowhead' },
    photo: ['en:Arrowhead', 'en:Sling (weapon)', 'en:Bronze Age sword'],
    accent: '#6B6E70',
    facts: [
      { label: 'Malzeme', value: 'Taş, tunç, demir, kurşun' },
      { label: 'Yaygın buluntu', value: 'Ok ucu, sapan mermisi' },
    ],
    related: ['tasaletler', 'takilar', 'patina'],
    sections: [
      {
        heading: 'Ok uçları',
        pairs: [
          { term: 'Çakmaktaşı / obsidyen', desc: 'Neolitik ve Kalkolitik; yontularak yapılmış, yaprak veya üçgen biçimli.' },
          { term: 'Tunç, saplı', desc: 'Tunç Çağı; yassı, ortası kabarık yaprak biçimli, sapı ağaç gövdeye geçirilir.' },
          { term: 'Üç kanatlı tunç', desc: 'MÖ 7–4. yy; İskit ve Pers ordularıyla yaygınlaşan, yuvalı küçük ok uçları.' },
          { term: 'Demir', desc: 'Roma ve sonrası; pas kabuğu altında şekli zor seçilir.' },
        ],
      },
      {
        heading: 'Sapan mermileri',
        body: 'Kurşundan dökülmüş, badem biçimli sapan mermileri Hellenistik ve Roma ordularında kullanılmıştır. Bazılarının üzerinde komutan adı, kent adı ya da “al bunu!” gibi kısa yazılar bulunur. Pişmiş toprak ve taş sapan taşları ise çok daha eskiye uzanır.',
      },
      {
        heading: 'Kılıç ve mızrak parçaları',
        body: 'Tunç Çağı kılıç ve hançerleri yeşil patinalı, çoğunlukla kırık parçalar halinde bulunur. Demir silahlar ise kalın pas kabuğuyla kaplıdır ve kolayca dağılabilir. Bu tür parçaların konservasyonu mutlaka uzman işidir.',
        callout: {
          kind: 'warning',
          text: 'Askeri bölgelerde ve eski savaş alanlarında patlamamış mühimmat bulunabilir. Şüpheli metal nesnelere dokunmayın, jandarmaya bildirin.',
        },
      },
    ],
  },
  {
    id: 'tasaletler',
    title: 'Taş Aletler',
    subtitle: 'Çakmaktaşı, obsidyen ve öğütme taşları',
    icon: 'hammer-wrench',
    category: 'eser',
    wiki: { tr: 'Obsidyen', en: 'Stone tool' },
    photo: ['en:Stone tool', 'en:Lithic flake', 'en:Obsidian'],
    accent: '#5E5A4E',
    facts: [
      { label: 'Dönem', value: 'Paleolitik – Kalkolitik' },
      { label: 'Önemli kaynak', value: 'Kapadokya obsidyeni' },
    ],
    related: ['silahlar', 'zaman', 'sozluk'],
    sections: [
      {
        heading: 'İnsan yapımı mı, doğal mı?',
        bullets: [
          'Vurma topuzu (darbe noktası) ve altında kabarcık biçimli şişkinlik: insan yapımı yongaların işaretidir.',
          'Kenar boyunca düzenli, küçük rötuş izleri: aletin keskinleştirildiğini gösterir.',
          'Simetrik biçim (el baltası, ok ucu, dilgi): bilinçli üretim.',
          'Rastgele kırık, köşeli çakıllar: çoğunlukla doğal kırılmadır.',
        ],
      },
      {
        heading: 'Obsidyen',
        body: 'Volkanik cam olan obsidyen, keskin kenarlarıyla tarih öncesinde en değerli alet hammaddesiydi. Kapadokya’daki (Göllüdağ, Nenezi) ve Doğu Anadolu’daki (Bingöl, Nemrut Dağı) obsidyen kaynaklarından çıkan taşlar, binlerce kilometre uzaklıktaki yerleşimlere kadar taşınmıştır.',
      },
      {
        heading: 'Öğütme taşları ve havanlar',
        body: 'Tahıl öğütmek için kullanılan, üstü aşınarak çukurlaşmış büyük düz taşlar (öğütme taşı) ve elde tutulan ezgi taşları Neolitik yerleşimlerin tipik buluntularıdır. Bu taşlar tarla kenarlarında bile görülebilir ve çoğu zaman “define işareti” sanılır.',
      },
    ],
  },
  {
    id: 'mimari',
    title: 'Mimari Parçalar',
    subtitle: 'Sütun başlıkları, mozaik ve devşirme taşlar',
    icon: 'pillar',
    category: 'eser',
    wiki: { en: 'Classical order' },
    photo: ['en:Corinthian order', 'en:Capital (architecture)', 'en:Classical order'],
    accent: '#8C7A5E',
    facts: [
      { label: 'Malzeme', value: 'Mermer, kireçtaşı, tuğla' },
      { label: 'Sık görüldüğü yer', value: 'Köy duvarları, cami avluları' },
    ],
    related: ['yazitlar', 'mezarlar', 'figurinler'],
    sections: [
      {
        heading: 'Sütun düzenleri',
        pairs: [
          { term: 'Dor', desc: 'Sade, yastık biçimli başlık; kaidesiz kalın sütun. Arkaik ve Klasik dönem.' },
          { term: 'İon', desc: 'Başlığın iki yanında salyangoz kıvrımları (volüt). Batı Anadolu’da çok yaygın (Efes, Didyma).' },
          { term: 'Korint', desc: 'Akantus yapraklarıyla kaplı çan biçimli başlık; Roma döneminin gözdesi.' },
          { term: 'Bizans başlıkları', desc: 'Sepet biçimli, derin oymalı, sıklıkla haç veya monogramlı.' },
        ],
      },
      {
        heading: 'Devşirme malzeme',
        body: 'Antik yapılardan sökülen sütunlar, kitabeler ve kabartmalı bloklar yüzyıllar boyunca yeni yapılarda yeniden kullanılmıştır. Anadolu’da köy evlerinin duvarlarında, çeşmelerde ve cami avlularında antik taş görmek olağandır. Bu taşlar bulundukları yerde kültür varlığı olarak korunur.',
      },
      {
        heading: 'Mozaik',
        body: 'Mozaikler küçük renkli taş, cam veya pişmiş toprak parçalarından (tessera) oluşur. Roma ve Bizans villa, hamam ve kiliselerinde taban döşemesi olarak yaygındır. Zeugma mozaikleri dünyanın en ünlüleri arasındadır.',
        callout: {
          kind: 'warning',
          text: 'Görünür bir mozaik taban veya yazıtlı taş fark ederseniz yerinden oynatmayın; müze müdürlüğüne bildirin. Sökülen mozaik geri dönülmez biçimde zarar görür.',
        },
      },
    ],
  },
  {
    id: 'mezarlar',
    title: 'Mezar Gelenekleri',
    subtitle: 'Tümülüs, lahit ve kaya mezarları',
    icon: 'grave-stone',
    category: 'eser',
    wiki: { en: 'Lycian tombs' },
    photo: ['en:Lycian tombs', 'en:Tumulus', 'en:Sarcophagus'],
    accent: '#6E4E3E',
    facts: [
      { label: 'Yasal durum', value: 'Tamamı koruma altında' },
      { label: 'Ünlü örnek', value: 'Likya kaya mezarları' },
    ],
    related: ['mimari', 'yasal', 'isaretler'],
    sections: [
      {
        heading: 'Başlıca mezar tipleri',
        pairs: [
          {
            term: 'Tümülüs',
            desc: 'Toprak yığma büyük mezar tepesi; Frig (Gordion) ve Lidya (Bintepeler) krallarının mezarları.',
          },
          {
            term: 'Kaya mezarı',
            desc: 'Kayaya oyulmuş, çoğu zaman tapınak cephesi taklidi mezar; Likya, Karya ve Paflagonya’da yaygın.',
          },
          { term: 'Lahit', desc: 'Taş tabut; Roma döneminde kabartmalı, kapağında yatan figür (kline) bulunan örnekler.' },
          { term: 'Ostotek', desc: 'Yakılan ölünün kemiklerinin konduğu küçük taş sandık.' },
          { term: 'Nekropol', desc: 'Antik kentin dışındaki mezarlık alanı.' },
        ],
      },
      {
        heading: 'Arkeolojide mezarın önemi',
        body: 'Mezarlar, insanların inançları, sağlıkları, giyimleri ve sosyal yapıları hakkında en zengin bilgiyi veren alanlardır. Bir mezarın bilimsel değeri, içindeki nesnelerden çok onların yerinde ve birlikte bulunmasından gelir. Kaçak kazıyla açılan bir mezar, bu bilginin tamamını sonsuza dek yok eder.',
        callout: {
          kind: 'warning',
          text: 'Mezarlarda ve tümülüslerde kazı yapmak 2863 sayılı Kanun’a göre ağır cezası olan bir suçtur. Tahrip edilmiş bir mezar görürseniz jandarmaya veya müzeye bildirin.',
        },
      },
    ],
  },

  // ───────────────────────── İNCELEME ─────────────────────────
  {
    id: 'yazitlar',
    title: 'Yazıtlar ve Alfabeler',
    subtitle: 'Grek, Latin, Luvi ve Arap harflerini tanıma',
    icon: 'alphabetical-variant',
    category: 'inceleme',
    wiki: { en: 'Epigraphy' },
    photo: ['en:Epigraphy', 'en:Anatolian hieroglyphs', 'en:Greek alphabet'],
    accent: '#4E6E8C',
    facts: [
      { label: 'Bilim dalı', value: 'Epigrafi' },
      { label: 'En yaygın dil', value: 'Antik Yunanca' },
    ],
    related: ['sikkeler', 'muhurler', 'mimari'],
    sections: [
      {
        heading: 'Hangi yazı hangi döneme ait?',
        pairs: [
          {
            term: 'Çivi yazısı',
            desc: 'Kil tabletlerde kama biçimli işaretler; Asur Ticaret Kolonileri ve Hititler (MÖ 2. binyıl).',
          },
          { term: 'Luvi hiyeroglifi', desc: 'Resim yazısı; Hitit ve Geç Hitit kabartmalarında, kaya anıtlarında görülür.' },
          {
            term: 'Frig, Lidya, Likya alfabeleri',
            desc: 'Grek alfabesine benzeyen ama farklı harfleri olan yerel Anadolu yazıları.',
          },
          {
            term: 'Grek (Yunan) alfabesi',
            desc: 'Antik Anadolu’nun ortak yazısı; Hellenistik, Roma ve Bizans yazıtlarının çoğu.',
          },
          { term: 'Latin alfabesi', desc: 'Roma resmi yazıtları, kilometre taşları ve sikke lejantları.' },
          { term: 'Arap harfleri', desc: 'Selçuklu, beylikler ve Osmanlı kitabeleri, mezar taşları ve sikkeleri.' },
        ],
      },
      {
        heading: 'Grek yazıtlarında sık görülen kelimeler',
        pairs: [
          { term: 'ΒΟΥΛΗ ΚΑΙ ΔΗΜΟΣ', desc: '“Meclis ve halk” — bir kişiyi onurlandıran kent kararı.' },
          { term: 'ΑΥΤΟΚΡΑΤΩΡ', desc: '“İmparator”.' },
          { term: 'ΜΝΗΜΗΣ ΧΑΡΙΝ', desc: '“Anısına” — mezar taşlarında.' },
          { term: 'ΧΑΙΡΕ', desc: '“Elveda / selam” — mezar stellerinde.' },
          { term: 'ΘΕΟΣ', desc: '“Tanrı”; Bizans’ta ✝ ve ΙΣ ΧΣ (İsa Mesih) kısaltmasıyla birlikte.' },
        ],
      },
      {
        heading: 'Osmanlı kitabeleri',
        body: 'Osmanlı yapı kitabeleri ve mezar taşları çoğunlukla Arapça veya Osmanlı Türkçesiyle yazılır; sonda Hicri tarih bulunur. Tarih bazen “ebced” hesabıyla bir mısranın harflerine gizlenir. Mezar taşlarının baş kısmındaki sarık veya fes biçimi, ölenin cinsiyetini ve mesleğini gösterir.',
        callout: {
          kind: 'tip',
          text: 'Yazıtı taratırken her satırı net görecek şekilde dik açıyla ve yan ışıkla çekin. Harfler okunabilirse Defineciler metni çözmeye çalışır.',
        },
      },
    ],
  },
  {
    id: 'patina',
    title: 'Patina ve Korozyon',
    subtitle: 'Metal eserlerin zamanla değişimi ve korunması',
    icon: 'water-opacity',
    category: 'inceleme',
    wiki: { en: 'Patina' },
    photo: ['en:Patina', 'en:Bronze disease', 'en:Corrosion'],
    accent: '#4E7C5E',
    facts: [
      { label: 'Kural', value: 'Patina temizlenmez' },
      { label: 'Tehlike', value: 'Bronz hastalığı' },
    ],
    related: ['takilar', 'sikkeler', 'sahte'],
    sections: [
      {
        heading: 'Metallere göre görünüm',
        pairs: [
          { term: 'Bronz / bakır', desc: 'Kararlı patina koyu yeşil, kahverengi veya mavi-yeşildir; sert ve pürüzsüzdür.' },
          {
            term: 'Bronz hastalığı',
            desc: 'Toz gibi, açık yeşil, yumuşak lekeler; nemle büyür ve eseri içten yer. Uzman müdahalesi gerekir.',
          },
          { term: 'Gümüş', desc: 'Siyah, mor veya gri kararma; bakır oranı yüksekse yeşil lekeler de görülür.' },
          { term: 'Altın', desc: 'Neredeyse hiç değişmez; yalnızca toprak ve kireç tabakası olabilir.' },
          { term: 'Demir', desc: 'Kalın, kabarık, kırmızı-kahve pas; içi çoğu zaman tamamen paslanmıştır.' },
          { term: 'Kurşun', desc: 'Beyaz-gri, tebeşirimsi kabuk.' },
        ],
      },
      {
        heading: 'Doğru saklama',
        bullets: [
          'Kuru tutun: metal eserler için bağıl nem %40’ın altında olmalıdır.',
          'Asitsiz kâğıt veya pamuklu beze sarın; plastik poşette nem birikebilir.',
          'Eseri çıplak elle sık tutmayın; ter ve yağ korozyonu hızlandırır.',
          'Farklı metalleri birbirine değdirmeyin.',
        ],
        callout: {
          kind: 'warning',
          text: 'Patinayı kazımak, fırçalamak veya kimyasalla “parlatmak” eserin bilimsel ve kültürel değerini yok eder. Konservasyon yalnızca uzman işidir.',
        },
      },
    ],
  },
  {
    id: 'isaretler',
    title: 'Define İşaretleri',
    subtitle: 'Halk inanışı ve bilimsel açıklaması',
    icon: 'sign-direction',
    category: 'inceleme',
    wiki: { tr: 'Petroglif', en: 'Cup and ring mark' },
    photo: ['en:Petroglyph', 'en:Cup and ring mark', 'en:Rock art'],
    accent: '#7A5C3E',
    facts: [
      { label: 'Bilimsel kanıt', value: 'Gömü gösterdiğine dair yok' },
      { label: 'Gerçekte çoğu', value: 'Doğal oluşum veya sınır işareti' },
    ],
    related: ['tasaletler', 'mezarlar', 'yasal'],
    sections: [
      {
        heading: 'Önce bilmeniz gereken',
        body: 'Kayalardaki “define işaretleri” halk arasında çok yaygın bir inanıştır, ancak bilimsel olarak işaretlerin gömü gösterdiğine dair kanıt yoktur. Bu işaretlerin büyük kısmı doğal aşınma, çoban ve sınır işaretleri, sonraki dönem kazımaları veya kaya mezarı ve tapınak gibi bilinen yapıların parçalarıdır. Aşağıda halk arasındaki yorum ile arkeolojik açıklama birlikte verilmiştir.',
      },
      {
        heading: 'Yaygın işaretler',
        pairs: [
          {
            term: 'Yılan',
            desc: 'Halk: “gömü yakındır.” Arkeoloji: Antik çağda koruyucu ve şifa simgesi; çoğu zaman doğal kaya damarıdır.',
          },
          {
            term: 'Kaplumbağa',
            desc: 'Halk: “başın gösterdiği yöne bak.” Arkeoloji: Doğal kaya oluşumu olabilir; kaplumbağa kabartması nadirdir.',
          },
          {
            term: 'Haç',
            desc: 'Halk: “Rum gömüsü.” Arkeoloji: Bizans döneminde kilise, şapel, mezar ve sınır taşlarında çok yaygındır.',
          },
          {
            term: 'Çanak / kupul delikleri',
            desc: 'Halk: “sayısı derinliği gösterir.” Arkeoloji: Tarih öncesi kült, öğütme veya su toplama çukurları; çoğunlukla doğal erozyon.',
          },
          { term: 'Ok ve ayak izi', desc: 'Halk: “yön gösterir.” Arkeoloji: Çoğu sonraki dönem çoban ve yol işaretidir.' },
          { term: 'At nalı / kemer', desc: 'Halk: “kapı veya mağara ağzı.” Arkeoloji: Çoğunlukla doğal kaya kırığı veya niş.' },
          {
            term: 'Hilal ve yıldız',
            desc: 'Halk: “Osmanlı gömüsü.” Arkeoloji: Çoğunlukla geç dönem sınır, mülk veya çoban işareti.',
          },
        ],
      },
      {
        heading: 'Uygulamada kullanmak',
        body: 'Bir kaya işaretinin fotoğrafını çekip tarattığınızda Defineciler, işaretin insan yapımı mı doğal mı olduğunu ve tarihsel olarak neyle ilişkili olabileceğini değerlendirir.',
        callout: {
          kind: 'warning',
          text: 'İşaretlerin çevresinde kazı yapmak, kayayı kırmak veya patlatmak hem suçtur hem de gerçek tarihî kalıntılara geri dönülmez zarar verir.',
        },
      },
    ],
  },
  {
    id: 'sahte',
    title: 'Sahte Eser Nasıl Anlaşılır?',
    subtitle: 'Replika ve taklitleri ayırt etme',
    icon: 'magnify-scan',
    category: 'inceleme',
    wiki: { en: 'Art forgery' },
    photo: ['en:Magnifying glass', 'en:Loupe', 'en:Replica'],
    accent: '#5A6E8C',
    facts: [
      { label: 'Piyasadaki oran', value: 'Taklitler çok yaygın' },
      { label: 'Kesin karar', value: 'Yalnızca uzman' },
    ],
    related: ['patina', 'sikkeler', 'kandiller'],
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
        heading: 'Zarar vermeyen basit kontroller',
        pairs: [
          { term: 'Hassas terazi', desc: 'Sikkelerde ağırlığı 0,01 g hassasiyetle ölçüp katalog değerleriyle karşılaştırın.' },
          { term: 'Kumpas', desc: 'Çap ve kalınlığı milimetre olarak ölçün.' },
          { term: 'Büyüteç (10x lup)', desc: 'Döküm gözenekleri, dikiş izi ve modern alet izlerini arayın.' },
          { term: 'Mıknatıs', desc: 'Gümüş, altın ve bronz mıknatısa yapışmaz; yapışıyorsa içi demir veya çeliktir.' },
          {
            term: 'Karşılaştırma',
            desc: 'Müze katalogları ve nümismatik veri tabanlarındaki orijinal örneklerle karşılaştırın.',
          },
        ],
        callout: {
          kind: 'warning',
          text: 'Kazıma, asit damlatma, ateşe tutma veya kırma gibi “testler” eseri kalıcı olarak bozar ve orijinal bir eseri yok edebilir.',
        },
      },
      {
        heading: 'Bilinmesi gereken',
        body: 'Fotoğrafla yapılan hiçbir değerlendirme kesin değildir. Kesin sonuç için eserin müze uzmanlarınca incelenmesi gerekir.',
      },
    ],
  },
  {
    id: 'zaman',
    title: 'Anadolu Zaman Çizelgesi',
    subtitle: 'Uygarlıklar ve dönemler bir bakışta',
    icon: 'timeline-clock',
    category: 'inceleme',
    wiki: { tr: 'Göbekli Tepe', en: 'Göbekli Tepe' },
    photo: ['en:Göbekli Tepe'],
    accent: '#6E5A7E',
    facts: [
      { label: 'En eski tapınak', value: 'Göbekli Tepe, MÖ 9600' },
      { label: 'Kapsam', value: '12.000 yıl' },
    ],
    related: ['seramik', 'yazitlar', 'tasaletler'],
    sections: [
      {
        heading: 'Başlıca dönemler',
        pairs: [
          {
            term: 'MÖ 10.000–6.000 · Neolitik',
            desc: 'İlk köyler ve tapınaklar: Göbekli Tepe, Karahan Tepe, Çatalhöyük, Çayönü.',
          },
          { term: 'MÖ 6.000–3.000 · Kalkolitik', desc: 'Bakırın kullanımı; boyalı seramikler: Hacılar, Yumuktepe, Arslantepe.' },
          { term: 'MÖ 3.000–2.000 · Erken Tunç Çağı', desc: 'Kentleşme ve kral mezarları: Troya, Alacahöyük.' },
          { term: 'MÖ 2.000–1.750 · Asur Ticaret Kolonileri', desc: 'Anadolu’da yazının başlangıcı: Kültepe-Kaniş tabletleri.' },
          { term: 'MÖ 1.650–1.180 · Hitit İmparatorluğu', desc: 'Başkent Hattuşa; Yazılıkaya, Alacahöyük sfenksli kapı.' },
          { term: 'MÖ 1.200–600 · Demir Çağı krallıkları', desc: 'Geç Hitit, Frig (Gordion), Urartu (Van), Lidya (Sardes).' },
          { term: 'MÖ 546–334 · Pers hâkimiyeti', desc: 'Satraplıklar; Kral Yolu Sardes’ten Persepolis’e uzanır.' },
          { term: 'MÖ 334–30 · Hellenistik dönem', desc: 'İskender ve halefleri; Pergamon (Bergama) Krallığı, Kommagene.' },
          { term: 'MÖ 30–MS 395 · Roma İmparatorluğu', desc: 'Efes, Perge, Aphrodisias; tiyatrolar, hamamlar, yollar.' },
          { term: 'MS 395–1453 · Bizans İmparatorluğu', desc: 'Konstantinopolis; kiliseler, kaya kiliseleri (Kapadokya).' },
          { term: '1071–1308 · Anadolu Selçukluları', desc: 'Konya başkent; kervansaraylar, medreseler, çini sanatı.' },
          { term: '1299–1922 · Osmanlı İmparatorluğu', desc: 'Bursa, Edirne, İstanbul; camiler, külliyeler, akçe.' },
        ],
      },
    ],
  },
  {
    id: 'sozluk',
    title: 'Arkeoloji Sözlüğü',
    subtitle: 'Sık geçen 45 terim, kısa açıklamalarıyla',
    icon: 'book-alphabet',
    category: 'inceleme',
    wiki: { tr: 'Arkeoloji', en: 'Archaeology' },
    photo: ['en:Archaeology', 'en:Archaeological site'],
    accent: '#8C6E3E',
    related: ['zaman', 'sikkeler', 'seramik'],
    sections: [
      {
        heading: 'A – K',
        pairs: [
          { term: 'Agora', desc: 'Antik kentin pazar ve toplanma meydanı.' },
          { term: 'Akropol', desc: 'Kentin yüksek, surlu kesimi; çoğunlukla tapınaklar burada bulunur.' },
          { term: 'Amfora', desc: 'Şarap, zeytinyağı gibi ürünleri taşımaya yarayan iki kulplu, sivri dipli kap.' },
          { term: 'Antefiks', desc: 'Çatı kiremitlerinin uçlarını kapatan bezemeli pişmiş toprak parça.' },
          { term: 'Arkeometri', desc: 'Eserleri fiziksel ve kimyasal yöntemlerle inceleyen bilim dalı.' },
          { term: 'Astar', desc: 'Seramik yüzeyine sürülen ince kil tabakası.' },
          { term: 'Avers / Revers', desc: 'Sikkenin ön yüzü / arka yüzü.' },
          { term: 'Bulla', desc: 'Belge veya kabı mühürlemek için kullanılan kil ya da kurşun parçası.' },
          { term: 'Devşirme', desc: 'Eski yapılardan alınıp yeni yapıda kullanılan taş veya mimari parça.' },
          { term: 'Elektron', desc: 'Doğal altın-gümüş alaşımı; ilk sikkeler bundan yapıldı.' },
          { term: 'Epigrafi', desc: 'Taş, metal gibi sert malzeme üzerindeki yazıtları inceleyen bilim.' },
          { term: 'Fibula', desc: 'Giysiyi tutturmaya yarayan çengelli iğne, antik broş.' },
          { term: 'Höyük', desc: 'Üst üste kurulan yerleşimlerin birikmesiyle oluşan yapay tepe.' },
          { term: 'İkonografi', desc: 'Sanat eserlerindeki figür ve sembollerin anlamını inceleyen alan.' },
          { term: 'İn situ', desc: 'Eserin bulunduğu özgün yerinde, yerinden oynatılmamış hali.' },
          { term: 'Kalkolitik', desc: 'Bakır-Taş Çağı; taş aletlerin yanında bakırın da kullanıldığı dönem.' },
          { term: 'Kitabe', desc: 'Yapı veya mezar üzerindeki yazılı taş levha.' },
          { term: 'Kline', desc: 'Lahit kapaklarında görülen, uzanmış figürlü yatak sahnesi.' },
          { term: 'Konservasyon', desc: 'Eserin bozulmasını durdurup korunmasını sağlayan uzman işlemleri.' },
          { term: 'Kybele', desc: 'Anadolu’nun ana tanrıçası; Friglerde “Matar”.' },
        ],
      },
      {
        heading: 'L – Z',
        pairs: [
          { term: 'Lahit', desc: 'Taştan veya pişmiş topraktan tabut.' },
          { term: 'Lejant', desc: 'Sikkenin kenarı boyunca dönen yazı.' },
          { term: 'Megaron', desc: 'Önde sundurması olan dikdörtgen ana salon; Troya ve Frig yapılarında.' },
          { term: 'Molybdobull', desc: 'Bizans kurşun mührü.' },
          { term: 'Monogram', desc: 'Bir ismin harflerinin birleştirilmesiyle oluşan simge.' },
          { term: 'Nekropol', desc: 'Antik mezarlık alanı.' },
          { term: 'Nümismatik', desc: 'Sikke bilimi.' },
          { term: 'Obsidyen', desc: 'Volkanik cam; tarih öncesinde alet yapımında kullanıldı.' },
          { term: 'Ostotek', desc: 'Kemiklerin konduğu küçük taş sandık.' },
          { term: 'Patina', desc: 'Metal veya taş yüzeyinde zamanla oluşan doğal tabaka.' },
          { term: 'Pithos', desc: 'Erzak saklamaya yarayan çok büyük küp.' },
          { term: 'Riton', desc: 'Hayvan biçimli veya boynuz şeklinde içki kabı; Hititlerde yaygın.' },
          { term: 'Sigillata', desc: 'Roma döneminin parlak kırmızı astarlı sofra kapları.' },
          { term: 'Sit alanı', desc: 'Yasal olarak koruma altına alınmış tarihî veya doğal alan.' },
          { term: 'Stel', desc: 'Yazıt veya kabartma taşıyan dikili taş; çoğunlukla mezar taşı.' },
          { term: 'Stratigrafi', desc: 'Toprak katmanlarının sırasına göre tarihleme yöntemi.' },
          { term: 'Tessera', desc: 'Mozaiği oluşturan küçük taş veya cam parçası.' },
          { term: 'Tetradrahmi', desc: 'Dört drahmi değerindeki büyük gümüş sikke.' },
          { term: 'Tümülüs', desc: 'Toprak yığma mezar tepesi.' },
          { term: 'Unguentarium', desc: 'Parfüm veya yağ için küçük şişe; “gözyaşı şişesi”.' },
          { term: 'Votif', desc: 'Bir tanrıya adak olarak sunulmuş nesne.' },
          { term: 'Volüt', desc: 'İon sütun başlığındaki salyangoz biçimli kıvrım.' },
          { term: 'Yonga', desc: 'Taş alet yapımında ana taştan kopan parça.' },
          { term: 'Zigurat', desc: 'Mezopotamya’nın basamaklı tapınak kulesi.' },
          { term: 'Zeytinyağı kandili', desc: 'Antik çağın temel aydınlatma aracı; bkz. Kandiller.' },
        ],
      },
    ],
  },

  // ───────────────────────── PRATİK VE YASAL ─────────────────────────
  {
    id: 'yasal',
    title: 'Eser Bulursanız Ne Yapmalı?',
    subtitle: 'Yasal süreç, haklar ve cezalar',
    icon: 'scale-balance',
    category: 'pratik',
    photo: ['en:Museum of Anatolian Civilizations', 'en:Istanbul Archaeology Museums', 'tr:Anadolu Medeniyetleri Müzesi'],
    accent: '#3E7C8C',
    facts: [
      { label: 'Bildirim süresi', value: '3 gün' },
      { label: 'Kanun', value: '2863 sayılı Kanun' },
      { label: 'Teslim edene', value: 'İkramiye' },
    ],
    related: ['mezarlar', 'fotograf', 'sahte'],
    sections: [
      {
        heading: 'Adım adım ne yapmalı?',
        pairs: [
          { term: '1. Dokunmayın', desc: 'Mümkünse eseri bulunduğu yerde bırakın; toprağından ayırmayın, temizlemeyin.' },
          { term: '2. Kaydedin', desc: 'Fotoğrafını çekin, konumunu (telefonun haritası) ve bulunuş şeklini not edin.' },
          {
            term: '3. Bildirin',
            desc: 'En geç 3 gün içinde en yakın müze müdürlüğüne, köyde muhtara, diğer yerlerde mülki amire (kaymakamlık/valilik) bildirin.',
          },
          { term: '4. Teslim edin', desc: 'Görevliler bir tutanak düzenler; eser uzmanlarca incelenir.' },
          { term: '5. İkramiye', desc: 'Eser müzeye alınmaya değer bulunursa, değerine göre ikramiye ödenir.' },
        ],
        callout: {
          kind: 'tip',
          text: 'Nereye başvuracağınızı bilmiyorsanız jandarma veya polise gidebilirsiniz; sizi doğru kuruma yönlendirirler.',
        },
      },
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
        callout: {
          kind: 'warning',
          text: 'İnternette veya elden “tarihi eser” almak da suçtur; üstelik satılanların büyük çoğunluğu sahtedir.',
        },
      },
    ],
  },
  {
    id: 'fotograf',
    title: 'İyi Fotoğraf Nasıl Çekilir?',
    subtitle: 'Defineciler’den en doğru sonucu almak için',
    icon: 'camera-iris',
    category: 'pratik',
    photo: ['en:Excavation (archaeology)', 'en:Archaeology', 'en:Archaeological field survey'],
    accent: '#C08B5C',
    facts: [
      { label: 'En iyi ışık', value: 'Gölgede gün ışığı' },
      { label: 'Ölçek', value: 'Cetvel veya madeni para' },
    ],
    related: ['sikkeler', 'yazitlar', 'yasal'],
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
      {
        heading: 'Esere göre çekim',
        pairs: [
          { term: 'Sikke', desc: 'Tam karşıdan, ekranı dolduracak kadar yakın; iki yüz ayrı ayrı.' },
          { term: 'Seramik parçası', desc: 'Dış yüz, iç yüz ve kırık kesiti; kesit hamur rengini gösterir.' },
          { term: 'Yazıt / kabartma', desc: 'Yandan alçak açılı ışıkla; satırlar ekrana paralel olacak şekilde.' },
          { term: 'Kaya işareti', desc: 'Bir yakın, bir de çevresini gösteren uzak çekim.' },
          { term: 'Takı / metal', desc: 'Patinayı parlatmadan, yansımayı önlemek için hafif yandan.' },
        ],
        callout: {
          kind: 'tip',
          text: 'Not alanına boyut, ağırlık, malzeme ve bulunduğu il/ilçeyi yazmak sonucu belirgin biçimde iyileştirir.',
        },
      },
    ],
  },
];

export const getGuideTopic = (id: string) => GUIDE.find((g) => g.id === id);

/** Konunun yaklaşık okuma süresi (dakika). */
export function readingMinutes(t: GuideTopic) {
  let words = 0;
  const count = (s?: string) => (words += s ? s.split(/\s+/).length : 0);
  for (const s of t.sections) {
    count(s.body);
    s.bullets?.forEach(count);
    s.pairs?.forEach((p) => {
      count(p.term);
      count(p.desc);
    });
    count(s.callout?.text);
  }
  return Math.max(1, Math.round(words / 180));
}
