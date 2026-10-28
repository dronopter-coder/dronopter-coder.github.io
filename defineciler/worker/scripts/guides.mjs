// Rehber ve bölge sayfalarının içeriği (gen-seo.mjs kullanır). Her bölüm: [başlık, paragraflar[]].
// Kural: kazıyı/define aramayı teşvik eden içerik yok; hukuki ve bilimsel çerçeve korunur.

export const GUIDES = [
  {
    id: 'tarihi-eser-bulursam-ne-yapmaliyim',
    title: 'Tarihi eser bulursam ne yapmalıyım? Bildirim adımları',
    short: 'Tarla, bahçe ya da inşaatta eser çıkarsa yasal süreç ve bildirim adımları.',
    lead: 'Tarlada, bahçede, inşaatta ya da yürüyüşte tarihi bir eser bulduysanız doğru davranış açıktır: dokunmadan bildirmek. Bu sayfa süreci adım adım anlatır.',
    sections: [
      ['Önce yapmanız gerekenler', [
        'Buluntuyu yerinden çıkarmayın, temizlemeyin, parlatmayın. Çevresindeki toprak ve konum, eserin tarihlendirilmesi için eserin kendisi kadar değerlidir.',
        'Bulunduğu yeri fotoğraflayın (genel görünüm ve yakın plan) ve telefonunuzla konumu kaydedin.',
        'Buluntuyu 2863 sayılı Kültür ve Tabiat Varlıklarını Koruma Kanunu uyarınca en kısa sürede, kanundaki süre içinde (3 gün) en yakın müze müdürlüğüne, yoksa mülki amirliğe (kaymakamlık, muhtarlık üzerinden jandarma/polis) bildirin.',
      ]],
      ['Bildirimden sonra ne olur?', [
        'Yetkililer yerinde inceleme yapar; gerekirse bilimsel kurtarma kazısı başlatılır. Buluntu müzeye alınır ve kayda geçirilir.',
        'Kanun, buluntuyu bildirenler için ödül öngörür. Süreç ve tutar müzenin değerlendirmesine bağlıdır; ayrıntı için müze müdürlüğüne danışın.',
      ]],
      ['Yapmamanız gerekenler', [
        'İzinsiz kazı yapmak, eseri evde saklamak, satmak ya da yurt dışına çıkarmak suçtur ve hapis cezası dahil ağır yaptırımları vardır.',
        'Metal dedektörüyle arazi taramak da izne tabidir. İzinsiz kullanım suç sayılabilir.',
        '“Define” umuduyla yapılan kazılar çoğu zaman eserin bağlamını yok eder ve kişiyi hukuki risk altına sokar.',
      ]],
      ['Sıkça sorulanlar', [
        'Arazim üzerinde çıkan eser benim mi olur? Hayır; Türkiye’de tüm taşınır ve taşınmaz kültür varlıkları devlet korumasındadır, bulan kişi bildirim yükümlüsüdür.',
        'Eser kıymetsiz çıkarsa? Değerine müzedeki uzmanlar karar verir; kendi başınıza değerlendirmeyin.',
      ]],
    ],
  },
  {
    id: 'sikke-nasil-okunur',
    title: 'Sikke nasıl okunur? Yüz, yazıt ve tarihleme ipuçları',
    short: 'Eski paraları okurken bakılacak yerler: portre, yazıt, darp yeri ve ağırlık.',
    lead: 'Bir sikkenin dönemi ve kaynağı çoğu zaman üzerindeki portre, yazıt ve simgelerden çıkarılır. Bu rehber temel okuma adımlarını anlatır.',
    sections: [
      ['1. Ön ve arka yüz', [
        'Ön yüzde genellikle hükümdar ya da tanrı portresi, arka yüzde ise bir simge, yapı ya da tanrıça figürü bulunur.',
        'Portrenin başlığı (taç, defne dalı, miğfer) ve sakal/saç düzeni dönem hakkında ipucu verir.',
      ]],
      ['2. Yazıt', [
        'Antik sikkelerde yazıt Grekçe ya da Latince olabilir. Çevrede dairesel yazılan kısaltmalar hükümdarın adını ve unvanlarını verir.',
        'Şehir sikkelerinde şehrin adı genitif halinde (“…lilerin”) yazılır; bu da darp yerini gösterir.',
      ]],
      ['3. Ağırlık, çap ve metal', [
        'Ağırlık ve çap, sikkenin değer birimini (drahmi, denarius, follis vb.) anlamaya yardım eder. Metal altın, gümüş ya da bronz olabilir.',
        'Temizlemek değeri düşürür ve bilgi kaybettirir; fırçalamayın.',
      ]],
      ['4. Tarihleme', [
        'Bazı sikkelerde yıl ya da hükümdarlık yılı yazılıdır. Yoksa portre ve yazıt tarzı kataloglarla karşılaştırılır.',
        'Kesin tanımlama için müze uzmanı ya da nümismatik katalog gerekir; fotoğraf tabanlı yorumlar yalnızca ön fikir verir.',
      ]],
    ],
  },
  {
    id: 'bizans-ve-roma-sikkeleri',
    title: 'Roma ve Bizans sikkeleri: nasıl ayırt edilir?',
    short: 'Roma imparatorluk sikkeleri ile Bizans sikkelerinin farkları.',
    lead: 'Anadolu’da en sık karşılaşılan eski paralar Roma ve Bizans dönemine aittir. İkisini ayırmanın en kolay yolu yazıt dili ve tasarımdır.',
    sections: [
      ['Roma imparatorluk sikkeleri', [
        'Yazıt Latincedir; ön yüzde imparator portresi ve unvanlar (IMP, CAES, AVG) görülür.',
        'Portreler gerçekçidir; defne çelengi ya da ışın taçlı başlık yaygındır.',
      ]],
      ['Bizans sikkeleri', [
        'Zamanla Grekçe yazıt ağırlık kazanır. Bakır sikkelerde (follis) büyük “M” harfi gibi değer işaretleri öne çıkar.',
        'Hristiyan simgeler (haç, İsa ya da Meryem figürü) ve tasarımda daha stilize, cepheden portreler dikkat çeker.',
      ]],
      ['Yanılma noktaları', [
        'Aşınmış sikkelerde yazı okunmaz hale gelir; bu yüzden tek özelliğe bakmak yanıltabilir.',
        'Geç Roma ve erken Bizans sikkeleri birbirine çok benzeyebilir. Kesin karar için uzman değerlendirmesi gerekir.',
      ]],
    ],
  },
  {
    id: 'patina-nedir',
    title: 'Patina nedir? Eskilik ve yaş hakkında ne söyler?',
    short: 'Patina, korozyon ve kabuk: görünüm eserin yaşını kanıtlar mı?',
    lead: 'Metal eserlerin yüzeyindeki yeşil, kahverengi ya da siyah tabaka patinadır. Güzel görünse de tek başına yaş kanıtı değildir.',
    sections: [
      ['Patina nasıl oluşur?', [
        'Bakır ve bronz toprağın nem, tuz ve mineralleriyle yavaşça tepkimeye girer; yüzeyde oksit ve karbonat tabakaları birikir.',
        'Gümüş kararır, altın ise çoğunlukla parlak kalır.',
      ]],
      ['Patina ile yaş tahmini', [
        'Doğal patina katmanlıdır ve çoğu zaman girintilere işlemiştir. Hızlıca boyanmış ya da kimyasalla yaşlandırılmış yüzeyler düzdür ve soyulur.',
        'Yine de patina yaşı kanıtlamaz; modern yaşlandırma yöntemleri taklit edebilir.',
      ]],
      ['Temizlik neden zararlıdır?', [
        'Patina eseri korur. Zımpara, asit ya da limonla temizlemek yüzey detaylarını ve bilimsel bilgiyi geri dönülmez biçimde yok eder.',
      ]],
    ],
  },
  {
    id: 'sahte-eser-nasil-anlasilir',
    title: 'Sahte eser nasıl anlaşılır? Taklit sikke ve heykel ipuçları',
    short: 'Sahte sikke, heykelcik ve belge uyarı işaretleri.',
    lead: 'Pazarda ve internette satılan “antik” eserlerin büyük kısmı taklittir. Aşağıdaki uyarı işaretleri ilk eleme için işe yarar; kesin karar uzmanındır.',
    sections: [
      ['Sikkelerde', [
        'Kalıptan dökme sikkelerde kenarlar yumuşak, yazı bulanık ve yüzeyde gözenekler olur; gerçek sikkeler çoğunlukla vurularak basılır.',
        'Aşırı net ve yeni görünen “mükemmel” detaylar şüphelidir.',
      ]],
      ['Heykelcik ve tabletlerde', [
        'Alışılmadık stil birleşimleri (farklı dönem ve kültürlerin karışımı) taklit göstergesidir.',
        'Satıcının hikâyesi (“dedemden kaldı”, “gizli kazı”) güvenilir bir belge değildir.',
      ]],
      ['Hukuki uyarı', [
        'Gerçek ya da sahte olsun, izinsiz eser alım satımı yasal risk taşır. Şüpheli satıcılarla pazarlık yapmayın ve ödeme yapmayın.',
      ]],
    ],
  },
  {
    id: 'define-efsaneleri-ve-gercekler',
    title: 'Define efsaneleri ve gerçekler: halk inanışı mı, tarih mi?',
    short: 'Anadolu’daki define efsanelerinin kökeni ve bilimsel karşılığı.',
    lead: 'Anadolu’da define hikâyeleri yüzyıllardır anlatılır. Bu rehber efsane ile arkeolojik gerçeği ayırır.',
    sections: [
      ['Efsaneler nereden gelir?', [
        'Savaşlar, göçler ve yer değiştirmeler sırasında insanlar değerli eşyalarını gömerdi. Bu “gömü” gerçeği, nesiller boyu hikâyeleşti.',
        'Antik yapıların kalıntıları üzerine kurulan köylerde “hazine” anlatıları yaygındır.',
      ]],
      ['İşaretler gerçekten bir şey söyler mi?', [
        'Taşlardaki oyuklar, yılan ya da kartal kabartmaları çoğunlukla tapınak, mezar, su düzeni veya yol işaretidir. “Define var” anlamına geldiğine dair bilimsel kanıt yoktur.',
        'Her işaretin halk yorumu ile arkeolojik karşılığı Defineciler işaret rehberinde ayrı ayrı gösterilir.',
      ]],
      ['Gerçek hazine nerede?', [
        'Gerçek değer, bilimsel kazılarla ortaya çıkarılan bağlamdadır: bir sikke çömlekteyken tarih yazar, kazılıp satıldığında susar.',
      ]],
    ],
  },
];

// Bölge/uygarlık sayfaları: arama niyeti "tarih, gezilecek yerler, eserler"; yer ifşası ve kazı teşviki yok.
export const REGIONS = [
  {
    id: 'hitit',
    title: 'Hititler: Anadolu’nun ilk büyük devleti',
    short: 'Hitit uygarlığı, Hattuşa ve tipik eserleri.',
    lead: 'MÖ 2. binyılda Orta Anadolu’da güçlü bir devlet kuran Hititler, çivi yazılı tabletleri ve kaya kabartmalarıyla tanınır.',
    sections: [
      ['Başkent Hattuşa', ['Çorum Boğazkale’deki Hattuşa, UNESCO Dünya Mirası’dır. Aslanlı Kapı, Yazılıkaya kaya tapınağı ve kral kapısı ziyaret edilebilir.']],
      ['Tipik eserler', ['Çivi yazılı kil tabletler, kaya kabartmaları, aslan ve sfenks figürleri, mühürler. Hitit hiyeroglifleri anıtlarda görülür.']],
      ['Müzeler', ['Ankara Anadolu Medeniyetleri Müzesi ve Çorum Müzesi önemli Hitit koleksiyonlarına sahiptir.']],
    ],
  },
  {
    id: 'frigya',
    title: 'Frigler ve Frigya Vadisi',
    short: 'Frig uygarlığı, kaya anıtları ve Midas Şehri.',
    lead: 'MÖ 8-7. yüzyılda Gordion’u başkent yapan Frigler, kaya oyma anıtları ve efsanevi Kral Midas ile hatırlanır.',
    sections: [
      ['Frigya Vadisi', ['Eskişehir–Afyonkarahisar arasındaki Frig Vadisi’nde Midas Anıtı gibi kaya anıtları ve oyma yapılar bulunur.']],
      ['Gordion', ['Ankara Polatlı’daki Gordion, büyük tümülüsleri ve ahşap mezar odalarıyla bilinir.']],
      ['Sembol ve motifler', ['Geometrik desenler, Kibele (Ana Tanrıça) kültü ve basamaklı cepheler tipik Frig özellikleridir.']],
    ],
  },
  {
    id: 'karya',
    title: 'Karya: Batı Anadolu’nun denizci medeniyeti',
    short: 'Karya bölgesi, Halikarnassos ve antik kentler.',
    lead: 'Günümüzde Muğla ve Aydın’ı kapsayan Karya, Halikarnassos Mozolesi ve çok sayıda antik kentiyle bilinir.',
    sections: [
      ['Önemli kentler', ['Halikarnassos (Bodrum), Afrodisias, Euromos, Stratonikeia ve Knidos bölgenin öne çıkan merkezleridir.']],
      ['Eserler', ['Mozole benzeri anıt mezarlar, sikkeler ve tapınak kalıntıları görülür.']],
    ],
  },
  {
    id: 'kapadokya',
    title: 'Kapadokya: kaya yerleşimleri ve yeraltı şehirleri',
    short: 'Kapadokya’nın kaya kiliseleri ve yeraltı şehirleri.',
    lead: 'Volkanik tüf kayalara oyulmuş yerleşimler, kiliseler ve yeraltı şehirleri Kapadokya’yı dünyaca ünlü yapar.',
    sections: [
      ['Yeraltı şehirleri', ['Derinkuyu ve Kaymaklı gibi çok katlı yeraltı şehirleri, güvenlik amacıyla kullanılmıştır.']],
      ['Kaya kiliseleri', ['Göreme Açık Hava Müzesi’ndeki freskli kiliseler Bizans sanatının önemli örneklerindendir.']],
    ],
  },
  {
    id: 'likya',
    title: 'Likya: kaya mezarları ve Likya Yolu',
    short: 'Likya medeniyeti, kaya mezarları ve antik kentler.',
    lead: 'Antalya–Muğla çevresindeki Likya, kayalara oyulmuş mezarları ve Likya Yolu ile ünlüdür.',
    sections: [
      ['Antik kentler', ['Xanthos, Letoon, Patara, Myra ve Olympos Likya’nın bilinen merkezleridir. Xanthos ve Letoon UNESCO listesindedir.']],
      ['Mezar mimarisi', ['Ev ve tapınak cephesi biçiminde oyulan kaya mezarları ve sütunlu lahitler bölgeye özgüdür.']],
    ],
  },
  {
    id: 'urartu',
    title: 'Urartular: Doğu Anadolu’nun kale krallığı',
    short: 'Urartu uygarlığı, Van Kalesi ve eserleri.',
    lead: 'MÖ 9-6. yüzyılda Van Gölü çevresinde güçlü bir krallık kuran Urartular, kaleleri ve bronz işçiliğiyle tanınır.',
    sections: [
      ['Başkent Tuşpa', ['Van Kalesi (Tuşpa) çevresindeki kaya yazıtları ve kaleler Urartu mimarisini gösterir.']],
      ['Eserler', ['Bronz kemer, kazan ve miğferler, çivi yazılı yazıtlar ve sulama kanalları tipiktir.']],
    ],
  },
];
