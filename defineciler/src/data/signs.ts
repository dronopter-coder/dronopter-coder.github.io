// Define işaretleri: halk arasındaki yorumlar ile arkeolojik/tarihî karşılıkları yan yana.
// Bu dosya hem uygulamada hem derlemede (scripts/fetch-photos.mts) kullanılır; React Native içe aktarmayın.

import type { GuideSection } from './guide';

export type SignCategory = 'hayvan' | 'sembol' | 'insan' | 'yapi';

export const SIGN_CATEGORIES: { id: SignCategory; label: string; desc: string }[] = [
  { id: 'hayvan', label: 'Hayvan Figürleri', desc: 'Yılan, kaplumbağa, kartal, aslan ve kayalara işlenmiş diğer hayvanlar' },
  { id: 'sembol', label: 'Semboller ve Oymalar', desc: 'Haç, hilal, güneş, ok, nal, tamga ve taşçı işaretleri' },
  { id: 'insan', label: 'İnsan, El ve Ayak', desc: 'El ve ayak izleri, yüz ve insan figürleri' },
  { id: 'yapi', label: 'Kaya ve Yapı İzleri', desc: 'Çanak oyuklar, kaya mezarları, nişler, basamaklar, tümülüsler' },
];

/**
 * Kanıt düzeyi (yorum sınırı):
 * - iz: gerçek bir arkeolojik iz ya da yapı (mezar, sunak, sarnıç, yazıt). Kültür varlığıdır, korunur.
 * - sembol: anlamı bilinen kültürel/dinî bir motif; "define var" anlamına geldiği kanıtlanmamıştır.
 * - halk: büyük ölçüde halk yorumu; çoğu örnek doğal oluşum veya rastlantıdır.
 */
export type SignEvidence = 'iz' | 'sembol' | 'halk';

export const EVIDENCE: Record<SignEvidence, { label: string; color: string; desc: string }> = {
  iz: {
    label: 'Arkeolojik iz',
    color: '#7FB069',
    desc: 'Gerçek bir antik yapı ya da kalıntıdır; kültür varlığı olarak korunur.',
  },
  sembol: {
    label: 'Kültürel sembol',
    color: '#E0A43A',
    desc: 'Anlamı bilinen bir motiftir; "define var" demek olduğu kanıtlanmamıştır.',
  },
  halk: {
    label: 'Halk yorumu',
    color: '#D9654B',
    desc: 'Büyük ölçüde inanış ve yorumdur; örneklerin çoğu doğal oluşum ya da rastlantıdır.',
  },
};

export type Sign = {
  id: string;
  title: string;
  /** Diğer adları */
  aka?: string;
  category: SignCategory;
  evidence: SignEvidence;
  /** Piktogram: 64x64 alanda çizgi çizimi (SVG iç öğeleri; renk ve kalınlık bileşende verilir) */
  glyph: string;
  /** Tek cümlelik özet */
  summary: string;
  /** Definecilik çevrelerinde anlatılan yorumlar */
  folk: string[];
  /** Arkeolojik / tarihî karşılığı */
  science: string;
  /** Nerede ve hangi dönemlerde görülür */
  where: string;
  /** Yorum sınırı: neden temkinli olunmalı */
  limit: string;
  /** Kapak fotoğrafı için aday Wikipedia sayfaları ("en:Başlık") */
  photo?: string[];
  related?: string[];
};

export const SIGNS: Sign[] = [
  // ───────────────────────── HAYVAN FİGÜRLERİ ─────────────────────────
  {
    id: 'yilan',
    title: 'Yılan',
    aka: 'Yılan kabartması, dolanan yılan',
    category: 'hayvan',
    evidence: 'sembol',
    glyph:
      '<path d="M10 50c8 0 10-8 18-8s10 8 18 8 8-10 0-14-14-4-14-12 8-10 14-8"/><circle cx="46" cy="16" r="3"/><path d="M49 15l5-2M49 17l5 2"/>',
    summary: 'Anadolu’nun en eski koruyucu sembollerinden; definecilikte “bekçi” olarak anılır.',
    folk: [
      'Hazinenin bekçisi sayılır; başının döndüğü yönde define arandığı anlatılır.',
      'Kuyruğun gösterdiği yönde su ya da giriş olduğuna inanılır.',
      'Halka şeklinde dolanmış yılanın mezarı, düz yılanın yolu gösterdiği söylenir.',
    ],
    science:
      'Yılan, Göbekli Tepe’deki dikili taşlardan (MÖ 10. bin) beri yer altı, yenilenme ve koruma ile ilişkilendirilir. Yunan-Roma dünyasında Asklepios’un asasında şifanın, evlerde ise “genius loci” denen koruyucu ruhun simgesidir. Roma mezar stellerinde ve sunaklarda süs olarak sık görülür. Doğu Anadolu’da Şahmeran anlatısıyla halk sanatına geçmiştir.',
    where: 'Göbekli Tepe, Roma sunak ve mezar stelleri, Bizans ve Ermeni taş süslemeleri, Mardin–Tarsus Şahmeran motifleri.',
    limit:
      'Kayadaki kıvrımlı damarlar, kök izleri ve su oluklarının çoğu “yılan” sanılır. Gerçek bir kabartmanın düzgün işçiliği ve baş detayı olur. Varsa bile anlamı koruma ya da şifadır; bir gömüyü gösterdiğine dair kazı kanıtı yoktur.',
    photo: ['en:Rod of Asclepius', 'en:Göbekli Tepe'],
    related: ['akrep', 'kertenkele', 'kaplumbaga'],
  },
  {
    id: 'kaplumbaga',
    title: 'Kaplumbağa',
    aka: 'Kaplumbağa kayası',
    category: 'hayvan',
    evidence: 'halk',
    glyph:
      '<ellipse cx="32" cy="34" rx="16" ry="12"/><path d="M22 30h20M24 38h16M32 22v24"/><circle cx="52" cy="32" r="4"/><path d="M20 44l-4 6M44 44l4 6M20 24l-4-6M44 24l4-6M16 34h-4"/>',
    summary: 'Definecilikte “en güçlü işaret” diye anlatılır; örneklerin çoğu kaplumbağaya benzeyen doğal kayadır.',
    folk: [
      'Başının baktığı yönde, belirli adım sayısı kadar ileride gömü olduğu anlatılır.',
      'Karnının altında ya da kabuğunun ortasında oyuk varsa definenin altında olduğuna inanılır.',
      'Ters dönmüş kaplumbağanın “boş” olduğu, yani soyulduğu söylenir.',
    ],
    science:
      'Antik Anadolu sanatında kaplumbağa kabartması nadirdir. Roma’da Afrodit ve Hermes ile ilişkili küçük figürinler, Doğu kültürlerinde ise dünyayı taşıyan kaplumbağa inancı bilinir. Arazide “kaplumbağa kayası” denen örneklerin büyük kısmı, yuvarlak bloklarda aşınma ve çatlaklarla oluşmuş doğal şekillerdir.',
    where: 'Roma dönemi küçük figürinler; arazide ise çoğunlukla volkanik ve granit bölgelerdeki yuvarlak kayalar.',
    limit:
      'İnsan beyni rastgele şekillerde tanıdık figürler görür (pareidolia). Alet izi, simetri ve düzgün kenar yoksa kaya doğaldır. Yalnızca şekle bakarak kazı yapmak hem sonuçsuz kalır hem de suç teşkil edebilir.',
    photo: ['en:Turtles in mythology', 'en:Pareidolia'],
    related: ['yilan', 'canak', 'tas-yigini'],
  },
  {
    id: 'kartal',
    title: 'Kartal',
    aka: 'Çift başlı kartal',
    category: 'hayvan',
    evidence: 'sembol',
    glyph:
      '<path d="M32 20v28M32 26c-6-10-18-8-22-2 6 0 10 4 12 10M32 26c6-10 18-8 22-2-6 0-10 4-12 10"/><path d="M26 48h12M28 48l-2 6M36 48l2 6"/><path d="M28 18l4-4 4 4"/>',
    summary: 'Hitit’ten Selçuklu’ya egemenlik ve gücün simgesi.',
    folk: [
      'Kanatlarının açık olduğu yönün yolu gösterdiği anlatılır.',
      'Yüksekte işlenmiş kartalın tepede, alçakta işlenmişin vadide gömüyü işaret ettiği söylenir.',
    ],
    science:
      'Çift başlı kartal Alacahöyük ve Yazılıkaya’da Hitit kraliyet sembolüdür. Roma lejyonlarının sancağında, Bizans’ta imparatorluk arması olarak, Selçuklu döneminde ise Diyarbakır surları ve Divriği gibi yapılarda güç simgesi olarak kullanılır.',
    where: 'Hitit başkentleri, Roma askerî buluntuları, Bizans ve Selçuklu yapı süslemeleri.',
    limit: 'Kartal bir otorite ve koruma simgesidir; yapının sahibini veya dönemini gösterir, gömü yeri değil.',
    photo: ['en:Double-headed eagle', 'en:Alaca Höyük'],
    related: ['aslan', 'kus', 'gunes'],
  },
  {
    id: 'aslan',
    title: 'Aslan',
    aka: 'Aslanlı kapı, aslan heykeli',
    category: 'hayvan',
    evidence: 'sembol',
    glyph:
      '<circle cx="24" cy="26" r="10"/><path d="M24 16c-6-2-10 2-10 6M24 16c6-2 10 2 10 6M34 28h16l4 10H40M20 36v14M28 36v14M44 38v12M52 38v12"/><path d="M54 38c4 0 6-4 4-8"/>',
    summary: 'Kapıların ve mezarların koruyucusu; Lidya sikkelerinin de simgesi.',
    folk: [
      'Aslanın baktığı yönün girişi, ağzının ise “kapıyı” gösterdiği anlatılır.',
      'Yatan aslanın gömünün üzerinde “nöbet tuttuğu” söylenir.',
    ],
    science:
      'Hattuşa’daki Aslanlı Kapı, Frig dönemi Aslantaş kaya mezarı, Lidya aslan başlı sikkeleri ve Roma mezarlarının köşelerindeki aslan heykelleri, aslanın koruyucu (apotropaik) rolünü gösterir. Mezar aslanı, mezarı soygunculara karşı sembolik olarak korur.',
    where: 'Hitit kapıları, Frig kaya anıtları, Lidya sikkeleri, Roma ve Helenistik mezarlar.',
    limit:
      'Mezar aslanları gerçekten bir mezarın varlığına işaret edebilir; ancak bu mezarlar kültür varlığıdır ve çoğu antik çağda soyulmuştur. Bulunduğu yer bildirilmelidir.',
    photo: ['en:Lion Gate (Hattusa)', 'en:Lydian coinage'],
    related: ['kartal', 'boga', 'kaya-mezari'],
  },
  {
    id: 'boga',
    title: 'Boğa Başı',
    aka: 'Bukranion, boynuz',
    category: 'hayvan',
    evidence: 'sembol',
    glyph:
      '<path d="M20 26c-6-2-10-8-8-14 4 6 8 8 14 8h12c6 0 10-2 14-8 2 6-2 12-8 14"/><path d="M22 24c0 14 4 26 10 26s10-12 10-26"/><circle cx="27" cy="32" r="1.5"/><circle cx="37" cy="32" r="1.5"/><path d="M28 44h8"/>',
    summary: 'Kurban, bereket ve fırtına tanrısının simgesi.',
    folk: ['Boğa başı figürünün büyük bir gömüyü ya da kurban yerini gösterdiği anlatılır.'],
    science:
      'Çatalhöyük’te duvarlara gömülü boğa boynuzları Neolitik kült uygulamasıdır. Hititlerde fırtına tanrısının boğaları Şerri ve Hurri’dir. Helenistik ve Roma sunaklarında çelenklerle süslenmiş boğa kafatası (bukranion) kurban törenini simgeleyen standart bir süstür.',
    where: 'Çatalhöyük, Hitit kabartmaları, Helenistik–Roma sunakları, lahitler ve friz blokları.',
    limit: 'Bukranion, mimari bir süs kalıbıdır; tek başına bir sunak parçasından ibaret olabilir. Gömü işareti değildir.',
    photo: ['en:Bucranium', 'en:Çatalhöyük'],
    related: ['aslan', 'gunes'],
  },
  {
    id: 'akrep',
    title: 'Akrep',
    category: 'hayvan',
    evidence: 'sembol',
    glyph:
      '<ellipse cx="30" cy="38" rx="8" ry="10"/><path d="M30 28c0-8 4-14 10-14s8 6 4 10l-4-2"/><path d="M22 34l-8-4M22 40l-8 2M22 44l-6 6M38 34l6-4M38 40l6 2"/><path d="M26 48l-4 8M34 48l4 8"/>',
    summary: 'Koruma ve tehlike simgesi; definecilikte “tuzak” diye yorumlanır.',
    folk: ['Akrep figürünün, yakında tuzak ya da zehirli tehlike bulunduğunu haber verdiği anlatılır.'],
    science:
      'Akrep, Göbekli Tepe kabartmalarından ve Mezopotamya mühürlerinden bilinir. Mezopotamya’da akrep insanlar kutsal kapıların bekçisidir. Anadolu halk kültüründe kilim ve dokumalarda nazara karşı koruyucu motif olarak kullanılır.',
    where: 'Göbekli Tepe, Mezopotamya silindir mühürleri, Anadolu kilim motifleri.',
    limit:
      '“Tuzak” anlatıları büyük ölçüde efsanedir; antik mezarlarda mekanik tuzak bulunduğuna dair güvenilir kazı kaydı yok denecek kadar azdır.',
    photo: ['en:Scorpion man', 'en:Göbekli Tepe'],
    related: ['yilan', 'kertenkele'],
  },
  {
    id: 'keci',
    title: 'Dağ Keçisi',
    aka: 'Yaban keçisi, kaya resmi',
    category: 'hayvan',
    evidence: 'iz',
    glyph:
      '<path d="M18 36h22l6-8M46 28c2-10-4-16-10-18M46 28c4-6 2-14-4-16"/><path d="M20 36v14M26 36v14M34 36v14M40 36v14"/><path d="M18 36c-4-2-4-6 0-8"/>',
    summary: 'Doğu Anadolu kaya resimlerinin en yaygın figürü.',
    folk: ['Keçinin baktığı ve boynuzlarının gösterdiği yönde yol veya mağara olduğu anlatılır.'],
    science:
      'Hakkari Gevaruk, Van, Kars Camuşlu ve Erzurum çevresindeki kaya resimlerinde dağ keçisi, avcı ve çoban toplulukların en sık işlediği figürdür. Av büyüsü, sürü sahipliği veya geçiş yollarının anlatımı olarak yorumlanır. Bazıları binlerce yıllıktır, bazıları ise yakın dönem çobanlarına aittir.',
    where: 'Doğu ve Güneydoğu Anadolu yaylaları, çoban geçiş yolları üzerindeki kaya yüzeyleri.',
    limit: 'Kaya resimleri başlı başına kültür varlığıdır; üzerine boya, tebeşir ya da kazıma yapmak onları kalıcı olarak bozar.',
    photo: ['en:Petroglyph', 'en:Rock art'],
    related: ['ok', 'cizgi'],
  },
  {
    id: 'balik',
    title: 'Balık',
    aka: 'İhtus',
    category: 'hayvan',
    evidence: 'sembol',
    glyph: '<path d="M10 32c10-12 28-12 38 0-10 12-28 12-38 0z"/><path d="M48 32l8-8v16z"/><circle cx="20" cy="30" r="1.5"/>',
    summary: 'Erken Hristiyanlığın gizli sembolü; bereket ve su ile ilişkilidir.',
    folk: ['Balık işaretinin yakında su kaynağı ya da su kenarında gömü olduğunu gösterdiği anlatılır.'],
    science:
      'Yunanca “ikhthys” sözcüğünün harfleri “İsa Mesih, Tanrı’nın Oğlu, Kurtarıcı” ifadesinin baş harfleridir. Bu yüzden balık, erken Hristiyanların mezar taşlarında, kandillerde ve mozaiklerde inanç işareti olarak kullanılır.',
    where: 'Roma–Bizans dönemi mezar taşları, kandiller, kilise mozaikleri.',
    limit: 'Bir balık figürü, çoğunlukla bir Hristiyan mezarını ya da kutsal mekânı gösterir; definenin değil.',
    photo: ['en:Ichthys'],
    related: ['hac', 'kus'],
  },
  {
    id: 'kus',
    title: 'Kuş ve Güvercin',
    category: 'hayvan',
    evidence: 'sembol',
    glyph:
      '<path d="M14 36c8 0 12-4 16-10 4-6 10-8 16-6l6-2-4 6c0 10-8 18-20 18-6 0-10-2-14-6z"/><path d="M26 30c4 4 10 4 14 0"/><circle cx="46" cy="22" r="1.5"/><path d="M30 44l-2 8M36 44l2 8"/>',
    summary: 'Ruh, barış ve Kutsal Ruh’un simgesi; Kapadokya’da güvercinlikler.',
    folk: ['Kuşun uçtuğu yönde ya da gagasının gösterdiği yerde arama yapılması gerektiği anlatılır.'],
    science:
      'Güvercin, Hristiyan ikonografisinde Kutsal Ruh ve barışın; Antik Çağ mezar stellerinde ölen kişinin ruhunun simgesidir. Kapadokya’daki kayalara oyulmuş güvercinlikler ise gübre toplamak için yapılmış, tarımsal yapılardır.',
    where: 'Bizans kiliseleri ve mezar taşları, Kapadokya vadileri, Roma mezar stelleri.',
    limit: 'Kayalardaki küçük delik dizileri çoğunlukla güvercinliktir; içlerinden çıkacak olan güvercin gübresidir.',
    photo: ['en:Dovecote'],
    related: ['kartal', 'balik'],
  },
  {
    id: 'kertenkele',
    title: 'Kertenkele',
    aka: 'Keler',
    category: 'hayvan',
    evidence: 'sembol',
    glyph:
      '<path d="M32 10c3 0 4 4 4 8v18c0 6-2 10-4 18-2-8-4-12-4-18V18c0-4 1-8 4-8z"/><path d="M28 22l-8-4-2 4M36 22l8-4 2 4M28 36l-8 4-2-4M36 36l8 4 2-4"/>',
    summary: 'Roma’da güneş ve yeniden doğuş; definecilikte “yön gösterici”.',
    folk: [
      'Başı yukarı bakan kertenkelenin definenin yukarıda, aşağı bakanın aşağıda olduğunu gösterdiği anlatılır.',
      'Kuyruğu kesik kertenkelenin “soyulmuş yer” anlamına geldiği söylenir.',
    ],
    science:
      'Kertenkele, Roma döneminde güneşle ve kış uykusundan uyanmasıyla yeniden doğuşla ilişkilendirilir; Sabazios kültüne ait bronz ellerde ve muskalarda koruyucu figür olarak yer alır.',
    where: 'Roma bronz adak elleri, muskalar ve küçük kabartmalar.',
    limit: 'Kaya yüzeyindeki uzun çatlaklar ve dallanan damarlar kolayca “keler” sanılır. Yön yorumu tamamen halk anlatısıdır.',
    photo: ['en:Hand of Sabazios', 'en:Lizard'],
    related: ['yilan', 'akrep', 'el'],
  },

  // ───────────────────────── SEMBOLLER VE OYMALAR ─────────────────────────
  {
    id: 'hac',
    title: 'Haç',
    aka: 'Haçkar, çarpı',
    category: 'sembol',
    evidence: 'sembol',
    glyph: '<path d="M32 10v44M18 24h28"/><path d="M28 10h8M28 54h8M18 20v8M46 20v8"/>',
    summary: 'Hristiyan mezarı, kilise ve kutsama işareti.',
    folk: [
      'Haçın Rum ya da Ermeni definesini gösterdiği anlatılır.',
      'At nalı içinde haç görülürse mağara ve para bulunacağı söylenir.',
      'Kolları eşit olmayan haçta uzun kolun yönü takip edilir.',
    ],
    science:
      'Haç; Bizans, Ermeni ve Süryani mezar taşlarında, kilise kapılarında, sınır taşlarında ve su kaynaklarının kutsanmasında kullanılır. Ermeni haçkarları, oymalı taş anıtlar olarak dünya mirası listesindedir. Çobanların ve yolcuların kazıdığı basit çarpılar da yaygındır.',
    where: 'Bizans ve Ermeni yerleşimleri, kilise ve manastır çevresi, eski köy mezarlıkları.',
    limit: 'Haç, çoğu zaman bir mezarı ya da kutsal yeri gösterir. Mezarları açmak hem suç hem de saygısızlıktır.',
    photo: ['en:Khachkar', 'en:Christian cross'],
    related: ['balik', 'at-nali', 'yazit'],
  },
  {
    id: 'hilal',
    title: 'Hilal',
    aka: 'Ay',
    category: 'sembol',
    evidence: 'sembol',
    glyph: '<path d="M40 12a20 20 0 1 0 0 40 16 16 0 1 1 0-40z"/>',
    summary: 'Antik ay tanrıçasından Osmanlı’ya uzanan bir simge.',
    folk: ['Hilalin açık tarafının baktığı yönde arama yapılması gerektiği anlatılır.'],
    science:
      'Hilal, antik Byzantion’un ve ay tanrıçası Hekate’nin simgesidir; Sasani ve Bizans sikkelerinde de görülür. Selçuklu ve Osmanlı döneminde mezar taşlarında, cami alemlerinde ve sancaklarda yaygınlaşır.',
    where: 'Antik sikkeler, Bizans ve Osmanlı mezar taşları, cami ve türbe süslemeleri.',
    limit: 'Mezar taşındaki hilal, mezarın bir Müslümana ait olduğunu gösterir; gömü işareti değildir.',
    photo: ['en:Star and crescent'],
    related: ['gunes', 'yildiz'],
  },
  {
    id: 'gunes',
    title: 'Güneş ve Rozet',
    aka: 'Çarkıfelek, papatya motifi',
    category: 'sembol',
    evidence: 'sembol',
    glyph: '<circle cx="32" cy="32" r="9"/><path d="M32 10v8M32 46v8M10 32h8M46 32h8M16 16l6 6M42 42l6 6M16 48l6-6M42 22l6-6"/>',
    summary: 'Ölümsüzlük, ışık ve sonsuz döngünün simgesi.',
    folk: ['Güneş işaretinin altını, ışınlarının sayısının ise adım veya derinliği gösterdiği anlatılır.'],
    science:
      'Rozet (çiçek biçimli daire), Frig, Urartu ve Roma mezar stellerinde ölümsüzlük ve göksel düzeni simgeler. Selçuklu yapılarındaki çarkıfelek motifi zamanın ve evrenin döngüsünü anlatır. Ahşap ve taş işçiliğinde en sık kullanılan süslerdendir.',
    where: 'Frig ve Urartu buluntuları, Roma mezar stelleri ve lahitleri, Selçuklu kapı süslemeleri.',
    limit: 'Rozet, en yaygın mimari süslerden biridir; tek başına bir anlam yüklemek yanıltıcıdır.',
    photo: ['en:Rosette (design)', 'en:Sun cross'],
    related: ['hilal', 'yildiz', 'spiral'],
  },
  {
    id: 'yildiz',
    title: 'Yıldız',
    aka: 'Mühr-i Süleyman, beş köşeli yıldız',
    category: 'sembol',
    evidence: 'sembol',
    glyph: '<path d="M32 10l18 32H14z"/><path d="M32 54L14 22h36z"/>',
    summary: 'Koruyucu tılsım; Selçuklu ve Osmanlı süslemelerinde yaygın.',
    folk: ['Altı köşeli yıldızın definenin tılsımla korunduğunu gösterdiği anlatılır.'],
    science:
      'Altı köşeli yıldız (Mühr-i Süleyman), İslam sanatında Hz. Süleyman’ın mührü olarak bilinir ve kötülüğe karşı koruyucu sayılır; cami, çeşme ve mezar taşlarında süs olarak işlenir. Beş köşeli yıldız Antik Çağ’dan beri bilinen geometrik bir motiftir.',
    where: 'Selçuklu ve Osmanlı yapıları, çeşmeler, mezar taşları, sikkeler.',
    limit: '“Tılsım” anlatıları kanıtlanamaz. Motif çoğu zaman yalnızca süslemedir.',
    photo: ['en:Seal of Solomon', 'en:Hexagram'],
    related: ['hilal', 'gunes'],
  },
  {
    id: 'ok',
    title: 'Ok ve Yön Oku',
    category: 'sembol',
    evidence: 'halk',
    glyph: '<path d="M12 52L52 12M52 12H36M52 12v16"/><path d="M12 52l4-10M12 52l10-4"/>',
    summary: 'En çok aranan “yön işareti”; bir kısmı modern ölçüm işaretidir.',
    folk: [
      'Okun gösterdiği yönde ve okun boyu kadar adım ileride arama yapıldığı anlatılır.',
      'Ters ok (aşağı bakan) derinliği gösterir diye yorumlanır.',
    ],
    science:
      'Kaya resimlerindeki oklar avcılık sahnelerinin parçasıdır. Ayrıca harita ve kadastro çalışmalarında taşlara kazınan nirengi ve röper işaretleri, yol ve su yönünü gösteren çoban işaretleri de ok biçimindedir. Bunlar yakın dönemlere aittir.',
    where: 'Kaya resimleri; tepe başlarında ölçüm taşları; yayla yolları.',
    limit:
      'Temiz kenarlı, keskin ok işaretlerinin çoğu son yüzyıla aittir. Bazıları da başka definecilerin kendi bıraktığı, yanıltıcı işaretlerdir.',
    photo: ['en:Benchmark (surveying)', 'en:Arrow'],
    related: ['keci', 'cizgi', 'sinir-tasi'],
  },
  {
    id: 'at-nali',
    title: 'At Nalı',
    category: 'sembol',
    evidence: 'halk',
    glyph:
      '<path d="M20 52V30a12 12 0 0 1 24 0v22"/><path d="M16 52h8M40 52h8"/><circle cx="22" cy="36" r="1.5"/><circle cx="42" cy="36" r="1.5"/><circle cx="24" cy="26" r="1.5"/><circle cx="40" cy="26" r="1.5"/>',
    summary: 'Uğur ve nazarlık; definecilikte mağara işareti diye yorumlanır.',
    folk: [
      'Nal biçimli oymanın mağara ya da yer altı odasını gösterdiği anlatılır.',
      'Nalın açık ucunun yönü girişi işaret eder diye yorumlanır.',
    ],
    science:
      'At nalı, Orta Çağ’dan beri uğur ve nazarlık olarak kapılara asılır. Kayalardaki U biçimli oymaların bir kısmı ise hayvan bağlama yeri, kapı söve yuvası ya da su yatağıdır.',
    where: 'Köy evleri, ahırlar, eski yollar ve kaya yüzeyleri.',
    limit: 'U biçimli oymaların çoğu işlevseldir; “mağara işareti” yorumunun kanıtı yoktur.',
    photo: ['en:Horseshoe'],
    related: ['hac', 'canak'],
  },
  {
    id: 'spiral',
    title: 'Spiral ve Labirent',
    category: 'sembol',
    evidence: 'sembol',
    glyph: '<path d="M32 32c0-2 2-4 4-2s2 6-2 8-10 0-10-6 6-12 14-10 12 10 8 18-14 12-22 6-8-18 0-24"/>',
    summary: 'Sonsuzluk ve yolculuk; tarih öncesi kaya sanatının motifi.',
    folk: ['Spiralin merkezine doğru “dolanarak” ilerleyen bir yolu ya da tüneli gösterdiği anlatılır.'],
    science:
      'Spiral, Neolitik dönemden beri seramik, kaya resmi ve takılarda görülür; döngü, su ve yaşamın sürekliliği ile ilişkilendirilir. Labirent motifi Antik Yunan’da Girit miti ile bilinir.',
    where: 'Neolitik seramik, kaya yüzeyleri, Roma mozaikleri.',
    limit: 'Motif dekoratiftir. Tünel ya da gizli yol anlamına geldiği kanıtlanmamıştır.',
    photo: ['en:Spiral', 'en:Labyrinth'],
    related: ['gunes', 'canak'],
  },
  {
    id: 'tamga',
    title: 'Tamga (Damga)',
    aka: 'Oğuz boy damgası, Yörük damgası',
    category: 'sembol',
    evidence: 'sembol',
    glyph: '<path d="M20 14v36M44 14v36M20 32h24"/><path d="M14 14h12M38 14h12"/>',
    summary: 'Türk boylarının mülkiyet ve kimlik işareti.',
    folk: ['Tamganın Türk dönemine ait hazineyi gösterdiği anlatılır.'],
    science:
      'Tamgalar Kayı, Bayındır gibi Oğuz boylarının ve sonraki Yörük aşiretlerinin damgasıdır. Hayvanlara, kayalara, mezar taşlarına ve halılara vurularak sahiplik, sınır ya da aidiyet belirtilir. Kaşgarlı Mahmut’un sözlüğünde 22 Oğuz boyunun damgası çizilmiştir.',
    where: 'Yaylalar, yörük mezarlıkları, kervan yolları, halı ve kilimler.',
    limit: 'Tamga bir otlak, sürü ya da mezarın kime ait olduğunu söyler; altın değil kimlik bilgisidir.',
    photo: ['en:Tamga'],
    related: ['tas-yigini', 'sinir-tasi'],
  },
  {
    id: 'tasci',
    title: 'Taşçı İşareti',
    aka: 'Usta işareti, mason işareti',
    category: 'sembol',
    evidence: 'iz',
    glyph: '<rect x="12" y="16" width="40" height="32" rx="2"/><path d="M24 26l8 12 8-12M26 40h12"/>',
    summary: 'Ustaların kestikleri bloğa vurduğu imza.',
    folk: ['İşaretli bloğun içinde ya da arkasında define saklandığı anlatılır.'],
    science:
      'Roma, Bizans ve Selçuklu yapılarında taş ustaları kestikleri bloklara harf, ok, yıldız gibi küçük işaretler kazırdı. Bunlar ödemenin hesaplanması ve blokların yerleştirilme sırası içindir. Selçuklu kervansaraylarında yüzlerce farklı usta işareti belgelenmiştir.',
    where: 'Kervansaraylar, kale ve sur duvarları, köprüler, antik tapınak blokları.',
    limit: 'Bu işaretler yapının tarihine dair değerli bilgidir; blokları sökmek ya da delmek yapıyı tahrip etmektir.',
    photo: ["en:Mason's mark"],
    related: ['kenet', 'yazit'],
  },
  {
    id: 'kazan',
    title: 'Kazan ve Küp',
    category: 'sembol',
    evidence: 'halk',
    glyph:
      '<path d="M14 26h36l-4 20c-1 4-4 6-8 6H26c-4 0-7-2-8-6z"/><path d="M14 26c0-4 8-6 18-6s18 2 18 6M20 18l4 4M44 18l-4 4"/>',
    summary: 'Halk anlatılarında “altın dolu küp”; arazide çoğunlukla sunak ya da dibek oyuğu.',
    folk: ['Kazan figürünün altın dolu bir küpün gömülü olduğunu gösterdiği anlatılır.'],
    science:
      'Kayalardaki kazan biçimli oyuklar çoğunlukla dibek (tahıl ezme), şarap ve zeytinyağı işlik çukurları ya da sunu kaplarıdır. Antik işliklerde ezme teknesinin yanında süzme çukuru ve oluk bulunur.',
    where: 'Bağ ve zeytinlik alanları, köy çevreleri, antik çiftlik kalıntıları.',
    limit: 'Bir işlik ya da dibek, köylülerin yüzyıllarca kullandığı bir araçtır; içi zaten açıktadır.',
    photo: ['en:Cauldron', 'en:Winepress'],
    related: ['canak', 'sarnic'],
  },
  {
    id: 'cizgi',
    title: 'Çentik ve Nokta Dizileri',
    aka: 'Sayı çizgileri',
    category: 'sembol',
    evidence: 'halk',
    glyph:
      '<path d="M14 18v20M22 18v20M30 18v20M38 18v20M10 30h32"/><circle cx="16" cy="48" r="2"/><circle cx="26" cy="48" r="2"/><circle cx="36" cy="48" r="2"/><circle cx="46" cy="48" r="2"/>',
    summary: 'Adım ya da derinlik sayısı diye yorumlanan sıra çizgiler.',
    folk: ['Çentik ya da nokta sayısının, definenin kaç adım ya da kaç arşın ötede olduğunu gösterdiği anlatılır.'],
    science:
      'Sıra çizgiler; çobanların sürü sayımı, işçilerin gün hesabı, bileme izleri veya oyunlarda (mangala benzeri taş oyunları) kullanılan işaretlerdir. Bazıları tarih öncesi takvim ya da sayım denemeleri olarak yorumlanır.',
    where: 'Yayla kayaları, mağara girişleri, köy ve bağ evlerinin taşları.',
    limit: 'Bıçak ve alet bileme izleri de düzenli çizgiler bırakır. Sayıya anlam yüklemek tamamen tahmindir.',
    photo: ['en:Tally marks', 'en:Mancala'],
    related: ['ok', 'canak'],
  },

  // ───────────────────────── İNSAN, EL VE AYAK ─────────────────────────
  {
    id: 'el',
    title: 'El İzi',
    aka: 'Açık el, pençe',
    category: 'insan',
    evidence: 'sembol',
    glyph:
      '<path d="M22 54c-4-6-8-14-8-22 0-2 2-4 4-2l4 6V14c0-2 4-2 4 0v14-18c0-2 4-2 4 0v18-16c0-2 4-2 4 0v16-12c0-2 4-2 4 0v22c0 8-2 14-6 18z"/>',
    summary: 'Koruma ve dua işareti; tarih öncesinden Fatma Ana eline.',
    folk: [
      'Parmakların gösterdiği yönde gömü olduğu, açık parmak sayısının adım sayısını verdiği anlatılır.',
      'Yumruk şeklindeki elin “kapalı / boş” anlamına geldiği söylenir.',
    ],
    science:
      'El izleri, mağara sanatının en eski motiflerindendir. Roma’da Sabazios kültüne ait bronz adak elleri, Akdeniz dünyasında “hamsa” denen koruyucu el ve Anadolu’da Fatma Ana eli nazara karşı koruma simgesidir. Bizans’ta kaldırılmış el dua ve kutsama hareketidir.',
    where: 'Mağara duvarları, Roma adak buluntuları, kapı tokmakları, muskalar.',
    limit: 'Elin anlamı korumadır. Parmak sayısını adıma çevirmek kanıtı olmayan bir yorumdur.',
    photo: ['en:Hamsa', 'en:Hand of Sabazios'],
    related: ['ayak', 'kertenkele'],
  },
  {
    id: 'ayak',
    title: 'Ayak İzi',
    category: 'insan',
    evidence: 'sembol',
    glyph:
      '<path d="M22 54c-6 0-8-6-6-14l2-10c2-6 10-6 12 0 2 8-2 12-2 18 0 4-2 6-6 6z"/><circle cx="20" cy="18" r="2.5"/><circle cx="26" cy="16" r="2.5"/><circle cx="32" cy="18" r="2"/><path d="M42 38c4 0 6-4 4-10l-2-6c-2-4-8-4-8 2 0 4 2 6 2 10 0 2 2 4 4 4z"/>',
    summary: 'Hac, adak ve ziyaret izi.',
    folk: ['Ayak izinin gittiği yönde yürünürse gömüye varılacağı anlatılır.'],
    science:
      'Roma ve Helenistik tapınaklarında ziyaretçiler, tanrıya geldiklerini belgelemek için ayak izi işlenmiş adak taşları bırakırdı. Bazı ayak izleri ise bir tanrının ya da kutsal kişinin “izi” olarak saygı görür (Kadem-i Şerif gibi). Bizans döneminde hac yollarında da benzer işaretler bulunur.',
    where: 'Tapınak ve kutsal alan girişleri, hac yolları, türbeler.',
    limit: 'Ayak izi oyması bir ziyaret ya da adak işaretidir. Kayalardaki doğal çukurlar da kolayca ayak izine benzetilir.',
    photo: ['en:Footprint'],
    related: ['el', 'yazit'],
  },
  {
    id: 'yuz',
    title: 'Yüz ve Maske',
    aka: 'Medusa, gorgo başı',
    category: 'insan',
    evidence: 'sembol',
    glyph:
      '<circle cx="32" cy="32" r="14"/><circle cx="26" cy="29" r="2"/><circle cx="38" cy="29" r="2"/><path d="M26 39c4 3 8 3 12 0"/><path d="M18 22c-4-4-8-2-10 2M46 22c4-4 8-2 10 2M18 42c-4 4-8 2-10-2M46 42c4 4 8 2 10-2"/>',
    summary: 'Mezarı koruyan, kötülüğü uzaklaştıran yüz.',
    folk: ['Yüzün baktığı yönün gömünün yerini gösterdiği, gözlerin ise girişi işaret ettiği anlatılır.'],
    science:
      'Medusa (gorgo) başı, Antik Çağ’da kötülüğü uzaklaştıran (apotropaik) bir motiftir; lahitlerde, kalkanlarda ve mozaiklerde bulunur. Didim ve Yerebatan Sarnıcı’ndaki Medusa başları en bilinen örneklerdir. Tiyatro maskeleri de Roma lahitlerinde sık işlenir.',
    where: 'Roma lahitleri, tapınak frizleri, sarnıç ve çeşmeler.',
    limit: 'Yüz figürü korumayı simgeler; bir lahitte bulunuyorsa o lahit kendisi kültür varlığıdır.',
    photo: ['en:Gorgoneion', 'en:Medusa'],
    related: ['insan', 'aslan'],
  },
  {
    id: 'insan',
    title: 'İnsan Figürü',
    aka: 'Stel, kabartma',
    category: 'insan',
    evidence: 'iz',
    glyph:
      '<circle cx="32" cy="14" r="6"/><path d="M32 20v18M32 26l-12 8M32 26l12 8M32 38l-8 16M32 38l8 16"/><rect x="10" y="8" width="44" height="50" rx="4"/>',
    summary: 'Ölen kişiyi tasvir eden mezar stelleri ve kabartmalar.',
    folk: ['Figürün elinin ya da bakışının gösterdiği yönde gömü olduğu anlatılır.'],
    science:
      'Helenistik ve Roma döneminde ölen kişi, mezar stelinde tek başına ya da ailesiyle, sık sık “ölü yemeği” sahnesinde tasvir edilir. Frig ve Likya’da kaya mezarlarının cephelerinde de insan figürleri işlenir.',
    where: 'Antik nekropoller (mezarlıklar), kaya mezarı cepheleri, müzeler.',
    limit: 'Mezar steli bir mezarın varlığını gösterebilir; mezarlar ve içerikleri kanunla korunur.',
    photo: ['en:Stele', 'en:Funerary banquet'],
    related: ['yuz', 'kaya-mezari', 'yazit'],
  },

  // ───────────────────────── KAYA VE YAPI İZLERİ ─────────────────────────
  {
    id: 'canak',
    title: 'Çanak Oyuklar',
    aka: 'Kupula, fincan oyuk',
    category: 'yapi',
    evidence: 'iz',
    glyph:
      '<path d="M8 46c8-10 40-10 48 0"/><ellipse cx="22" cy="36" rx="5" ry="2.5"/><ellipse cx="36" cy="34" rx="4" ry="2"/><ellipse cx="46" cy="38" rx="3" ry="1.5"/><ellipse cx="28" cy="42" rx="3" ry="1.5"/>',
    summary: 'Kayalara oyulmuş yuvarlak çukurlar; dünyanın en eski insan işaretlerinden.',
    folk: [
      'Çukur sayısının adım sayısını, büyük çukurun definenin yerini gösterdiği anlatılır.',
      'Çukurları birleştiren çizginin bir harita olduğu söylenir.',
    ],
    science:
      'Kupula (cupule) denen çanak oyuklar, tarih öncesinden yakın döneme kadar dünyanın her yerinde görülür. Sunu (adak) bırakma, ritüel, tohum ve tahıl ezme, su biriktirme veya taş oyunu gibi işlevleri vardır. Bazıları doğal erime çukurlarıdır.',
    where: 'Tepe üstlerindeki düz kayalar, eski kutsal alanlar, köy çevreleri.',
    limit:
      'Çanak oyukların harita olduğuna dair bir kanıt yoktur. Eski olanlar kültür varlığıdır, genişletilmemeli ve kırılmamalıdır.',
    photo: ['en:Cupule', 'en:Cup and ring mark'],
    related: ['kazan', 'cizgi', 'basamak'],
  },
  {
    id: 'kaya-mezari',
    title: 'Kaya Mezarı',
    category: 'yapi',
    evidence: 'iz',
    glyph: '<path d="M8 56V20l24-12 24 12v36"/><path d="M18 56V30h28v26"/><path d="M14 22h36M26 30v26M38 30v26"/>',
    summary: 'Kayaya oyulmuş antik mezar odaları.',
    folk: ['Kaya mezarlarının yakınında ya da içindeki gizli bölmelerde define bulunduğu anlatılır.'],
    science:
      'Likya (Fethiye, Kaunos, Myra), Paflagonya (Kastamonu), Frig (Afyon–Eskişehir) ve Urartu (Van) bölgelerinde kayaya oyulmuş anıt mezarlar vardır. Cepheleri çoğunlukla tapınak ya da ahşap ev görünümündedir. Mezarların büyük bölümü daha antik çağda soyulmuş, sonra çobanlar tarafından barınak olarak kullanılmıştır.',
    where: 'Likya kıyıları, Kastamonu ve Çorum dağları, Frig Vadisi, Van Kalesi.',
    limit:
      'Kaya mezarları birinci derece arkeolojik sit alanıdır. İçinde kazı yapmak, duvarlarını delmek 2863 sayılı Kanun’a göre ağır suçtur.',
    photo: ['en:Tomb of Amyntas', 'en:Lycian rock-cut tombs'],
    related: ['sahte-kapi', 'aslan', 'tumulus'],
  },
  {
    id: 'sahte-kapi',
    title: 'Sahte Kapı ve Niş',
    aka: 'Kör kapı, kaya nişi',
    category: 'yapi',
    evidence: 'iz',
    glyph: '<path d="M12 56V12h40v44"/><path d="M22 56V26a10 10 0 0 1 20 0v30"/><path d="M8 56h48"/>',
    summary: 'Kayaya işlenmiş, açılmayan kapı ve oyuk nişler.',
    folk: ['Sahte kapının arkasında gizli bir oda ya da hazine olduğu anlatılır.'],
    science:
      'Frig kült anıtlarında (Midas Anıtı, Arslankaya) kayaya oyulmuş kapı nişi, ana tanrıça Kybele’nin sembolik girişidir; arkasında oda yoktur. Mezar nişleri ise küçük adak, kandil ya da ölü küllerini koymak için açılır.',
    where: 'Frig Vadisi (Eskişehir–Afyon), Likya, Kapadokya, Roma nekropolleri.',
    limit: 'Kült cepheleri kasıtlı olarak “kapalı” yapılmıştır. Delinen kayalar geri getirilemez biçimde bozulur.',
    photo: ['en:Midas Monument', 'en:Phrygian Valley'],
    related: ['kaya-mezari', 'basamak'],
  },
  {
    id: 'basamak',
    title: 'Kaya Basamakları',
    aka: 'Merdiven, kaya sunağı',
    category: 'yapi',
    evidence: 'iz',
    glyph: '<path d="M8 56h12V44h12V32h12V20h12"/><path d="M8 56V44M20 44V32M32 32V20M44 20V8"/>',
    summary: 'Sunak, kale yolu ya da taş ocağı izi olabilir.',
    folk: ['Kayaya oyulmuş merdivenin “yer altına inen yolu” gösterdiği anlatılır.'],
    science:
      'Frig ve Urartu kutsal alanlarında kayaya oyulmuş basamaklı sunaklar (örneğin Frig “basamaklı sunakları”) tanrıya sunulan bir taht ya da sunu yeridir. Kalelerde kayaya oyulmuş basamaklar yukarı ve su kaynağına çıkan yollardır. Taş ocaklarında ise blok çıkarılırken basamaklı izler kalır.',
    where: 'Frig ve Urartu kaleleri, kale yamaçları, antik taş ocakları.',
    limit: 'Basamaklar çoğunlukla bir yere çıkmak ya da taş almak için yapılmıştır; altında bir şey saklı değildir.',
    photo: ['en:Urartu', 'en:Quarry'],
    related: ['sahte-kapi', 'sarnic', 'canak'],
  },
  {
    id: 'sarnic',
    title: 'Sarnıç ve Su Kanalı',
    aka: 'Dehliz, tünel',
    category: 'yapi',
    evidence: 'iz',
    glyph: '<path d="M8 20h48M8 20v28h48V20"/><path d="M8 34c6-4 10 4 16 0s10 4 16 0 10 4 16 0"/><path d="M20 20V12h24v8"/>',
    summary: 'Su biriktirme ve taşıma yapıları; çoğu zaman “dehliz” sanılır.',
    folk: ['Kayaya açılmış tünel ve kanalların hazine odalarına çıktığı anlatılır.'],
    science:
      'Antik yerleşimlerde yağmur suyunu toplayan sarnıçlar, kaleye su taşıyan tüneller (Hitit ve Urartu kalelerinde “gizli su yolları”) ve Roma su kanalları yaygındır. Kanalların iç yüzeyinde su sıvası ve kireç birikintisi (sinter) bulunur.',
    where: 'Kaleler, akropoller, Roma kentleri, Kapadokya yer altı yerleşimleri.',
    limit: 'Bu yapılar genellikle tehlikelidir: göçük, havasızlık ve düşme riski vardır. Ayrıca kültür varlığıdırlar.',
    photo: ['en:Cistern', 'en:Basilica Cistern'],
    related: ['basamak', 'kazan'],
  },
  {
    id: 'tumulus',
    title: 'Tümülüs',
    aka: 'Höyük, mezar tepesi',
    category: 'yapi',
    evidence: 'iz',
    glyph: '<path d="M4 50c10-22 46-22 56 0z"/><path d="M26 50V40h12v10"/><path d="M4 50h56"/>',
    summary: 'Toprak yığılarak yapılmış yapay mezar tepeleri.',
    folk: ['Tepenin ortasında altın dolu bir mezar odası olduğu anlatılır.'],
    science:
      'Frig (Gordion’daki Midas Tümülüsü), Lidya (Bin Tepeler) ve Trakya’da kral ve soyluların mezar odaları büyük toprak yığınlarıyla örtülürdü. Höyük ise farklıdır: binlerce yıl üst üste kurulan yerleşimlerin oluşturduğu tepedir.',
    where: 'Gordion, Manisa Bin Tepeler, Kırklareli, Antalya ve Burdur çevresi.',
    limit: 'Tümülüs ve höyüklerin neredeyse tamamı tescilli sit alanıdır. Kaçak kazılar, bilimsel değerini sonsuza dek yok eder.',
    photo: ['en:Tumulus', 'en:Bin Tepe'],
    related: ['kaya-mezari', 'tas-yigini'],
  },
  {
    id: 'tas-yigini',
    title: 'Taş Yığını',
    aka: 'Kerkez, işaret taşı, cairn',
    category: 'yapi',
    evidence: 'halk',
    glyph:
      '<ellipse cx="32" cy="50" rx="20" ry="5"/><ellipse cx="32" cy="40" rx="14" ry="5"/><ellipse cx="32" cy="30" rx="9" ry="4"/><ellipse cx="32" cy="21" rx="5" ry="3"/>',
    summary: 'Yol, sınır ya da tarla temizliğinden kalan taş kümeleri.',
    folk: ['Taşların gömünün üzerine işaret olarak yığıldığı anlatılır.'],
    science:
      'Taş yığınları; çobanların yol işareti, tarla temizlenirken toplanan taşlar, köy sınırları ya da basit mezarlar olabilir. Tarih öncesi dönemde de taş yığma (kurgan, cairn) mezarlar yapılmıştır.',
    where: 'Yaylalar, geçitler, tarla kenarları, eski yayla mezarlıkları.',
    limit: 'Yığını dağıtmak bir mezarı bozmak ya da çobanların yol işaretini yok etmek anlamına gelebilir.',
    photo: ['en:Cairn'],
    related: ['tumulus', 'sinir-tasi', 'tamga'],
  },
  {
    id: 'sinir-tasi',
    title: 'Sınır ve Mil Taşı',
    category: 'yapi',
    evidence: 'iz',
    glyph: '<path d="M22 56V18a10 10 0 0 1 20 0v38"/><path d="M16 56h32M28 26h8M28 32h8M28 38h8"/>',
    summary: 'Arazi, köy ya da yol mesafesini gösteren dikili taşlar.',
    folk: ['Tek başına dikili taşın altında gömü olduğu anlatılır.'],
    science:
      'Roma yollarında mil taşları (miliarium) mesafeyi ve yolu yaptıran imparatoru, sınır taşları ise kent ve vakıf arazilerini gösterir. Osmanlı döneminde de vakıf ve köy sınırları taşlarla belirlenirdi.',
    where: 'Antik yollar, köy ve vakıf arazi sınırları.',
    limit: 'Bu taşlar yerinden oynatılırsa hem tarihî bilgi hem de günümüz arazi sınırları kaybolur.',
    photo: ['en:Milestone', 'en:Boundary marker'],
    related: ['yazit', 'tas-yigini', 'ok'],
  },
  {
    id: 'yazit',
    title: 'Yazıt',
    aka: 'Kitabe',
    category: 'yapi',
    evidence: 'iz',
    glyph: '<rect x="12" y="10" width="40" height="46" rx="3"/><path d="M18 20h28M18 28h28M18 36h20M18 44h24"/>',
    summary: 'Taşa yazılmış metinler: mezar, adak, onur ya da yapı kitabeleri.',
    folk: ['Okunamayan eski yazıların definenin yerini anlattığı düşünülür.'],
    science:
      'Anadolu’da Hitit hiyeroglifi, Frigce, Likçe, Grekçe, Latince, Süryanice, Ermenice ve Osmanlıca yazıtlar bulunur. Büyük çoğunluğu mezar yazısı (“… kendisi ve ailesi için yaptırdı”), adak ya da yapı kitabesidir. Epigrafi bilim dalı bu yazıtları okur.',
    where: 'Antik kentler, mezarlıklar, köy evlerinin duvarlarına devşirme olarak kullanılmış taşlar.',
    limit: 'Yazıtlar bir yerin tarihini anlatır, hazine haritası değildir. Fotoğraflayıp müzeye bildirmek en doğrusudur.',
    photo: ['en:Epigraphy', 'en:Luwian language'],
    related: ['tasci', 'insan', 'sinir-tasi'],
  },
  {
    id: 'kenet',
    title: 'Kenet ve Zıvana Yuvaları',
    aka: 'Kurşun yuvası, dübel deliği',
    category: 'yapi',
    evidence: 'iz',
    glyph:
      '<rect x="8" y="20" width="22" height="24"/><rect x="34" y="20" width="22" height="24"/><path d="M24 30h16v4H24z"/><path d="M22 28v8M42 28v8"/>',
    summary: 'Antik blokları birbirine bağlayan metal kenetlerin oyukları.',
    folk: ['Kurşun dökülmüş deliklerin altın sakladığı ya da define işareti olduğu anlatılır.'],
    science:
      'Antik taş yapılarda bloklar, demir ya da bronz kenetlerle birbirine bağlanır ve kenetler erimiş kurşunla sabitlenirdi. Taşın üstündeki “I” ya da “güvercin kuyruğu” biçimli oyuklar bu kenetlerin yuvalarıdır. Orta Çağ’da metal kenetler sökülüp yeniden kullanıldığı için yuvalar çoğunlukla boştur.',
    where: 'Tapınak, tiyatro ve sur blokları; köy evlerinde devşirme taşlar.',
    limit: 'Bu oyuklar yapım tekniğinin izidir; içi boş olması normaldir. Kurşun kalıntısı varsa da hiçbir değeri yoktur.',
    photo: ['en:Dovetail joint', 'en:Ashlar'],
    related: ['tasci', 'yazit'],
  },
];

/** "İşaretler nasıl okunur" kılavuzu: işaretler sayfasının başında açılır. */
export const SIGNS_GUIDE: { title: string; subtitle: string; sections: GuideSection[] } = {
  title: 'Okumadan Önce: Yorum Sınırı',
  subtitle: 'Bir işareti doğru değerlendirmenin yolları',
  sections: [
    {
      heading: 'Define işareti denen şey nedir?',
      body: 'Definecilik çevrelerinde, kayalara, duvarlara ve mezar taşlarına işlenmiş figürlerin gömülü bir hazinenin yerini gösterdiğine inanılır. Bu işaretlerin bir kısmı gerçekten antik insanların bıraktığı izlerdir; ancak anlamları çoğu zaman “burada altın var” değil, “burada bir mezar, bir sunak, bir sınır ya da bir usta vardı”dır. Bu bölüm, her işaret için hem halk arasındaki yorumu hem de tarih ve arkeolojinin bildiklerini yan yana verir.',
    },
    {
      heading: 'Bir işarete bakarken sorulacak 5 soru',
      bullets: [
        'İnsan eliyle mi yapıldı? Alet izi, simetri, düzgün kenar yoksa büyük olasılıkla doğal oluşumdur.',
        'Ne kadar eski? Keskin kenarlı, açık renkli, likensiz oymalar genellikle yenidir.',
        'Bağlamı ne? Yakında mezar, kilise, yol, kale, işlik ya da tarla var mı?',
        'Yalnız mı? Gerçek antik işaretler çoğunlukla bir yapının, nekropolün ya da yerleşimin parçasıdır.',
        'Daha basit bir açıklama var mı? Çoban işareti, ölçüm taşı, bileme izi, işlik çukuru…',
      ],
    },
    {
      heading: 'Kanıt düzeyleri',
      pairs: [
        {
          term: 'Arkeolojik iz',
          desc: 'Gerçek bir antik yapı ya da kalıntı. Değerlidir, ama değeri bilgidedir; kanunla korunur.',
        },
        {
          term: 'Kültürel sembol',
          desc: 'Anlamı bilinen motif (koruma, inanç, egemenlik). Definenin yerini gösterdiği kanıtlanmamıştır.',
        },
        {
          term: 'Halk yorumu',
          desc: 'Büyük ölçüde inanış. Örneklerin çoğu doğal kaya şekli, rastlantı ya da yakın dönem işaretidir.',
        },
      ],
    },
    {
      heading: 'Sık yapılan yanılgılar',
      bullets: [
        'Pareidolia: insan beyni bulutlarda yüz gördüğü gibi kayalarda da kaplumbağa, yılan ve kertenkele görür.',
        'Kadastro ve harita ölçüm işaretleri, ok ve çarpılar çoğu zaman yakın döneme aittir.',
        'Başka definecilerin bıraktığı işaretler, kazılmış ve boşaltılmış yerleri gösterebilir veya kasten yanıltıcı olabilir.',
        'Antik mezarların büyük bölümü daha Antik Çağ ya da Orta Çağ’da soyulmuştur.',
        '“Tuzak” anlatıları neredeyse tamamen efsanedir; asıl tehlike göçük, havasızlık ve düşmedir.',
      ],
    },
    {
      heading: 'Yasal çerçeve',
      body: '2863 sayılı Kültür ve Tabiat Varlıklarını Koruma Kanunu’na göre izinsiz kazı ve sondaj yapmak, sit alanlarına ve tescilli yapılara zarar vermek suçtur. Bir kültür varlığı bulan kişi bunu en geç üç gün içinde en yakın müze müdürlüğüne, muhtarlığa veya kolluğa bildirmekle yükümlüdür; bildirilen buluntular için kanunda ikramiye öngörülmüştür.',
      callout: {
        kind: 'warning',
        text: 'Bir işaret gördüğünüzde fotoğrafını çekip konumunu not edin ve müze müdürlüğüne bildirin. Kazmayın, boyamayın, tebeşirle çizmeyin.',
      },
    },
  ],
};

export function getSign(id: string | undefined) {
  return SIGNS.find((s) => s.id === id);
}

/** Piktogram SVG'si: verilen renkte çizgi çizimi. */
export function glyphXml(glyph: string, color: string, strokeWidth = 2.5) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${glyph}</svg>`;
}
