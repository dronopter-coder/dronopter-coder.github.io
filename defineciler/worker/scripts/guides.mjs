// Rehber ve bölge sayfalarının içeriği (gen-seo.mjs kullanır).
// Her yazı: başlık, kısa açıklama, giriş, bölümler [başlık, paragraflar[]] ve SSS [soru, cevap].
// Kural: kazıyı/define aramayı teşvik eden içerik ve yer tarifi yok; hukuki ve bilimsel çerçeve korunur.
// Tarihler yaklaşık verilir; kesin olmayan bilgiler "yaygın görüşe göre" gibi ifadelerle belirtilir.

export const GUIDES = [
  {
    id: 'tarihi-eser-bulursam-ne-yapmaliyim',
    title: 'Tarihi eser bulursam ne yapmalıyım? Bildirim adımları ve yasal süreç',
    short: 'Tarla, bahçe ya da inşaatta eser çıkarsa yasal süreç ve bildirim adımları.',
    lead: 'Tarlada sürüm yaparken toprağın arasından bir sikke, inşaat temelinde bir küp ya da yürüyüşte üzerinde yazı olan bir taş görmek Anadolu’da sanıldığından sık yaşanır. Bu anlarda yapılan ilk birkaç hareket, hem buluntunun bilimsel değerini hem de bulan kişinin hukuki durumunu belirler. Bu rehber, bir kültür varlığıyla karşılaştığınızda adım adım ne yapmanız gerektiğini anlatır.',
    sections: [
      ['Kültür varlığı ne demek?', [
        'Türkiye’de tarih öncesi ve tarihî devirlere ait; bilim, kültür, din ve güzel sanatlar bakımından değer taşıyan yer üstündeki, yer altındaki ya da su altındaki taşınır ve taşınmaz varlıklar kültür varlığı sayılır. Bu tanım 2863 sayılı Kültür ve Tabiat Varlıklarını Koruma Kanunu ile yapılır. Sikkeler, seramik parçaları, heykelcikler, mühürler, yazıtlı taşlar, mezar taşları, eski yapı kalıntıları ve bunların parçaları bu kapsama girer.',
        'Kanuna göre kültür varlıkları devlet malı niteliğindedir. Bir eserin sizin tarlanızda ya da bahçenizde çıkması, onun size ait olduğu anlamına gelmez. Eseri bulan kişinin görevi onu korumak ve yetkililere haber vermektir.',
      ]],
      ['İlk dakikalarda yapılması gerekenler', [
        'Buluntuyu yerinden oynatmayın. Bir eserin hangi toprak katmanında, hangi nesnelerle birlikte ve hangi konumda bulunduğu, arkeologlar için eserin kendisi kadar önemlidir. Bu bilgiye “bağlam” denir; eser yerinden alındığında bu bilgi bir daha geri getirilemez.',
        'Temizlemeyin, yıkamayın, fırçalamayın. Sikke ve metal eserlerin yüzeyindeki tabaka hem eseri korur hem de tarihleme için ipucu taşır. Sirke, limon, diş macunu ya da tel fırça ile yapılan “temizlik” eserin değerini kalıcı olarak düşürür.',
        'Fotoğraf çekin ve konumu kaydedin. Genel bir görünüm, yakın plan ve ölçek için yanına konmuş bir kalem ya da madenî para yeterlidir. Telefonun konum bilgisini açık tutarak çektiğiniz fotoğraflar, yetkililerin yeri bulmasını kolaylaştırır.',
        'Alanı koruyun. Çevreyi çitle ya da işaretle belli etmek, başkalarının alana girip zarar vermesini önler. İnşaat çalışmasıysa iş makinelerini o bölgede durdurun.',
      ]],
      ['Kime ve ne zaman bildirilir?', [
        '2863 sayılı Kanun, kültür varlığını bulan kişinin bunu en geç üç gün içinde en yakın müze müdürlüğüne bildirmesini öngörür. Köylerde muhtara, diğer yerlerde mülki amire (kaymakamlık ya da valilik) de bildirim yapılabilir; jandarma ve emniyet birimleri de bildirimi ilgili kuruma iletir.',
        'Bildirim sözlü ya da yazılı yapılabilir. Yazılı bildirimde adınızı, iletişim bilgilerinizi, buluntunun yerini ve nasıl bulunduğunu kısaca yazmanız, çektiğiniz fotoğrafları eklemeniz yeterlidir. Bir kopyasını ya da evrak kayıt numarasını saklamanız önerilir.',
      ]],
      ['Bildirimden sonra süreç nasıl işler?', [
        'Müze uzmanları yerinde inceleme yapar. Buluntu taşınabilir bir eserse kayıt altına alınarak müzeye götürülür. Alanda başka kalıntılar olabileceği düşünülürse kurtarma kazısı yapılabilir ya da alan sit alanı olarak tescil edilebilir.',
        'Mevzuat, kültür varlığını bildirenlere ödül verilebilmesini öngörür. Ödülün verilip verilmeyeceği ve miktarı, eserin niteliğine ve müzenin değerlendirmesine bağlıdır. Ayrıntılı bilgi için bildirimi yaptığınız müze müdürlüğüne danışabilirsiniz.',
        'Arazinizde tescil yapılırsa bazı yapılaşma kısıtları gündeme gelebilir. Bu durumda Kültür Varlıklarını Koruma Bölge Kurulu kararları ve ilgili belediye ile görüşmek gerekir. Bir avukat ya da harita mühendisinden destek almak süreci kolaylaştırır.',
      ]],
      ['Kesinlikle yapılmaması gerekenler', [
        'İzinsiz kazı yapmak, bulunan eseri saklamak, satmak, satın almak ya da yurt dışına çıkarmak suçtur ve hapis ile adli para cezası dahil ağır yaptırımları vardır. Eserin “küçük” ya da “değersiz” görünmesi bu durumu değiştirmez.',
        'Türkiye’de define arama yalnızca Kültür ve Turizm Bakanlığından izin alınarak ve müze uzmanlarının denetiminde yapılabilir. Metal dedektörüyle izinsiz arama yapmak da yasal risk taşır.',
        'Sosyal medyada eserin yerini açıkça paylaşmayın. Bu paylaşımlar kaçak kazıcıların bölgeye gelmesine yol açabilir; konumu yalnızca yetkililerle paylaşın.',
      ]],
    ],
    faq: [
      ['Kendi tarlamda bulduğum eser bana ait olur mu?', 'Hayır. Türkiye’de kültür varlıkları devlet malı niteliğindedir; tarla sahibi olmanız eserin mülkiyetini size vermez. Bildirim yapmanız ise hem yasal yükümlülüğünüzü yerine getirir hem de ödül hakkı doğurabilir.'],
      ['Bildirim için ne kadar sürem var?', 'Kanun, bulunan kültür varlığının en geç üç gün içinde bildirilmesini öngörür. Ne kadar erken bildirirseniz, buluntunun bağlamı o kadar iyi korunur.'],
      ['Eserin sahte ya da değersiz olduğunu düşünüyorsam yine bildirmeli miyim?', 'Evet. Eserin gerçek olup olmadığına ve değerine uzmanlar karar verir. Kendi değerlendirmenize göre bildirimden vazgeçmek sizi hukuki risk altına sokabilir.'],
    ],
  },
  {
    id: 'sikke-nasil-okunur',
    title: 'Sikke nasıl okunur? Portre, yazıt, darphane işareti ve tarihleme',
    short: 'Eski paraları okurken bakılacak yerler: portre, yazıt, darp yeri ve ağırlık.',
    lead: 'Antik bir sikke, avuç içine sığan küçük bir tarih belgesidir. Üzerindeki portre, yazı ve simgeler; onu kimin, nerede ve hangi dönemde bastırdığını anlatır. Bu rehberde nümismatların, yani para bilimcilerinin bir sikkeyi incelerken izlediği temel adımları sade bir dille anlatıyoruz. Amaç, müzelerde ya da kitaplarda gördüğünüz sikkeleri daha iyi anlamanızı sağlamaktır.',
    sections: [
      ['Ön yüz ve arka yüz', [
        'Sikkenin ön yüzüne nümismatikte “avers”, arka yüzüne “revers” denir. Antik ve Orta Çağ sikkelerinin çoğunda ön yüzde bir hükümdarın, imparatorun ya da tanrının başı yer alır. Arka yüzde ise bir tanrı figürü, bir hayvan, bir yapı, bir sembol ya da yazı bulunur.',
        'Portrenin ayrıntıları dönem hakkında güçlü ipuçları verir. Roma imparatorlarının başında defne çelengi ya da ışın taç görülür; Hellenistik krallar genellikle diadem denen bir saç bandı taşır. Sakal, saç ve yüz ifadesi de modaya göre değiştiği için uzmanlar portre üslubundan dönemi tahmin edebilir.',
      ]],
      ['Yazıt (lejant) nasıl okunur?', [
        'Sikkenin kenarı boyunca dairesel olarak yazılmış metne lejant denir. Antik Yunan ve Hellenistik sikkelerde Grekçe, Roma sikkelerinde Latince, Bizans’ta önce Latince sonra Grekçe, İslami sikkelerde ise Arapça yazılar görülür.',
        'Roma sikkelerinde unvanlar kısaltılmış olarak yazılır: IMP (imparator), CAES (Caesar), AVG (Augustus), P F (dindar ve mutlu), P M (baş rahip), TR P (halk tribünü yetkisi), COS (konsül). Bu kısaltmaların yanındaki sayılar, örneğin TR P VII, imparatorun o yetkiyi kaçıncı kez aldığını gösterir ve sikkeyi birkaç yıllık bir aralığa tarihlemeye yarar.',
        'Grek kent sikkelerinde kentin adı çoğunlukla “…lıların” anlamına gelen bir ekle yazılır. Bu, sikkenin hangi kentte basıldığını gösteren en açık bilgidir.',
      ]],
      ['Darphane işareti ve atölye harfleri', [
        'Geç Roma ve Bizans sikkelerinde arka yüzün alt kısmında, bir çizgiyle ayrılmış bölümde (eksergu) kısa harf grupları bulunur. Bunlar sikkenin basıldığı darphaneyi gösterir: örneğin CONS Konstantinopolis, NIC Nikomedia (İzmit), KVZ ya da CYZ Kyzikos (Erdek yakınları), ANT Antiokheia (Antakya) anlamına gelir.',
        'Darphane kısaltmasının yanındaki bir harf ya da işaret, o darphane içindeki atölyeyi (officina) belirtir. Bu küçük ayrıntılar kataloglarda sikkenin tam karşılığını bulmayı sağlar.',
      ]],
      ['Ağırlık, çap ve metal', [
        'Sikkenin ağırlığı ve çapı, değer birimini anlamaya yardım eder. Antik dünyada gümüş drahmi ve tetradrahmi, Roma’da gümüş denarius ve bronz sestertius, Bizans’ta altın solidus ve bronz follis yaygın birimlerdir.',
        'Metal türü de önemlidir: altın sikkeler genellikle iyi korunur ve parlaklığını kaybetmez; gümüş kararır; bronz ise yeşil, kahverengi ya da siyah bir patina ile kaplanır. Hassas bir mutfak terazisi ve kumpas, ön bilgi için yeterlidir.',
      ]],
      ['Kataloglarla karşılaştırma', [
        'Uzmanlar sikkeleri standart kataloglarla karşılaştırarak tanımlar. Roma imparatorluk sikkeleri için “Roman Imperial Coinage” (RIC), Bizans sikkeleri için çeşitli müze katalogları ve genel başvuru kitapları kullanılır. Müzelerin çevrim içi koleksiyon veri tabanları da karşılaştırma için iyi bir kaynaktır.',
        'Fotoğraf tabanlı tanımlama, Defineciler uygulaması dahil, yalnızca ön fikir verir. Aşınmış ya da kırık bir sikkede yazının yarısı okunamayabilir; bu durumda kesin karar ancak eserin elde incelenmesiyle verilebilir.',
      ]],
      ['Sikkeye zarar vermeden incelemek', [
        'Sikkeyi kenarından tutun; parmak izindeki yağ ve tuz yüzeyde leke bırakır. Yazıyı okumak için güçlü bir büyüteç ve yandan gelen (eğik) ışık kullanın; eğik ışık kabartmaları belirgin hâle getirir.',
        'Asla zımpara, kimyasal temizleyici ya da tel fırça kullanmayın. Temizlenmiş sikkeler uzmanlar ve müzeler için değer kaybeder; ayrıca yüzeydeki bilgiler geri dönülmez biçimde yok olur.',
      ]],
    ],
    faq: [
      ['Sikkenin üzerindeki yazı okunmuyorsa tarihlenebilir mi?', 'Çoğu zaman yaklaşık olarak evet. Portre üslubu, arka yüzdeki figür, ağırlık ve çap birlikte değerlendirildiğinde sikke birkaç on yıllık ya da birkaç yüzyıllık bir döneme yerleştirilebilir.'],
      ['Elimdeki sikke gerçek mi?', 'Bunu kesin olarak yalnızca uzman inceleme belirleyebilir. Sahte sikkelerin ipuçları için “Sahte eser nasıl anlaşılır?” rehberimize bakabilirsiniz.'],
      ['Bulduğum sikkeyi temizlesem değeri artar mı?', 'Hayır, tam tersine düşer. Patina sikkeyi korur ve tarihleme için ipucu taşır; temizlik hem bilimsel hem de koleksiyon değerini azaltır.'],
    ],
  },
  {
    id: 'bizans-ve-roma-sikkeleri',
    title: 'Roma ve Bizans sikkeleri: farkları ve nasıl ayırt edilir?',
    short: 'Roma imparatorluk sikkeleri ile Bizans sikkelerinin farkları.',
    lead: 'Anadolu’da müzelerde en sık sergilenen eski paralar Roma ve Bizans dönemine aittir. Bunun nedeni, iki imparatorluğun yaklaşık bin beş yüz yıl boyunca bu topraklarda çok büyük miktarda para basmış olmasıdır. İki dönemin sikkeleri ilk bakışta birbirine benzeyebilir; ancak yazı dili, portre üslubu, simgeler ve değer işaretleri dikkatle incelendiğinde aradaki fark belirginleşir.',
    sections: [
      ['Roma sikkelerinin genel özellikleri', [
        'Roma Cumhuriyeti döneminde, yaygın kabule göre MÖ 3. yüzyılın sonlarında, gümüş denarius basılmaya başlandı. İmparatorluk döneminde (MÖ 27 sonrası) para sistemi altın aureus, gümüş denarius ve bronz/pirinç sestertius, dupondius ve as gibi birimlerden oluşuyordu.',
        'Roma sikkelerinin yazısı Latincedir. Ön yüzde imparatorun gerçekçi bir portresi ve unvanları yer alır. Arka yüzde ise Victoria (zafer), Concordia (uyum), Fortuna (talih) gibi kişileştirilmiş kavramlar, tanrılar, askerî sahneler ya da yapılar görülür.',
        '3. yüzyılda yaşanan ekonomik kriz sırasında gümüş oranı düşen antoninianus yaygınlaştı. Diocletianus’un 3. yüzyıl sonundaki reformu ve ardından I. Constantinus döneminde basılan altın solidus, para sistemini yeniden düzenledi. Solidus, sonraki yüzyıllarda Bizans’ın da temel altın sikkesi olarak kullanılmaya devam etti.',
      ]],
      ['Bizans sikkelerinin genel özellikleri', [
        'Bizans döneminin sikkeleri, özellikle 5. yüzyılın sonundan itibaren belirgin bir değişim gösterir. İmparator Anastasius’un yaygın kabule göre 498 yılındaki para reformuyla bronz follis üzerinde büyük bir değer işareti kullanılmaya başlandı: “M” harfi 40 nummiye karşılık geliyordu. K (20), I (10) ve E (5) harfleri de daha küçük birimleri gösterir.',
        'Portreler zamanla gerçekçilikten uzaklaşır; imparatorlar çoğunlukla cepheden, taç ve haçlı küre ile tasvir edilir. Haç, Hristiyan simgeler ve daha sonraki dönemlerde İsa ve Meryem tasvirleri yaygınlaşır.',
        'Yazı dili 7. yüzyıldan itibaren giderek Grekçeye döner; bazı yazıtlarda Latin ve Grek harfleri karışık kullanılır. Bu karışık yazılar, Bizans sikkelerini tanımada önemli bir ipucudur.',
      ]],
      ['Hızlı karşılaştırma', [
        'Yazı: Roma sikkelerinde Latince ve düzenli harfler; Bizans’ta Latin-Grek karışık ya da Grekçe yazılar.',
        'Portre: Roma’da yandan, gerçekçi ve kişisel özellikleri belirgin; Bizans’ta çoğunlukla cepheden, stilize ve simgesel.',
        'Simgeler: Roma’da tanrılar ve kişileştirmeler; Bizans’ta haç, dinî figürler ve büyük değer harfleri.',
        'Biçim: Geç Bizans döneminde içbükey (çanak biçimli) sikkeler görülür; bu biçim Roma döneminde yoktur.',
      ]],
      ['Neden bu kadar çok bulunuyorlar?', [
        'Roma ve Bizans dönemlerinde Anadolu, imparatorluğun en kalabalık ve zengin bölgelerinden biriydi. Ordunun maaşları, vergiler ve ticaret için çok sayıda bronz sikke basıldı. Küçük değerli bronz sikkeler günlük hayatta sık kaybedildiği için bugün de arkeolojik kazılarda bol miktarda ele geçer.',
        'Bu bolluk, sikkelerin kazı tabakalarını tarihlemede çok değerli olmasını sağlar. Bir yapının tabanında bulunan sikke, o yapının ne zaman kullanıldığını gösteren en güçlü kanıtlardan biridir. Bu yüzden sikkeleri bağlamından koparmak bilime büyük zarar verir.',
      ]],
      ['Yanılma noktaları', [
        'Aşınmış sikkelerde yazı ve portre ayrıntıları kaybolur; geç Roma ile erken Bizans sikkeleri bu durumda birbirine çok benzeyebilir. Tek bir özelliğe bakarak karar vermek yanıltıcıdır.',
        'Hellenistik krallıkların ve Roma dönemi Anadolu kentlerinin kendi adlarına bastığı sikkeler (eyalet sikkeleri) Grekçe yazılıdır. Bu sikkeler Roma dönemine ait olsa da yazı dili nedeniyle Bizans sikkesi sanılabilir.',
      ]],
    ],
    faq: [
      ['Üzerinde büyük “M” harfi olan sikke hangi döneme aittir?', 'Büyük bir M harfi taşıyan bronz sikke çoğunlukla Bizans follisidir. M harfi 40 nummilik değeri gösterir ve 5. yüzyılın sonlarından itibaren kullanılmıştır.'],
      ['Grekçe yazılı her sikke Bizans’a mı aittir?', 'Hayır. Antik Yunan kentleri, Hellenistik krallıklar ve Roma dönemi Anadolu kentleri de Grekçe yazılı sikkeler basmıştır. Portre, simgeler ve değer işaretleri birlikte değerlendirilmelidir.'],
    ],
  },
  {
    id: 'patina-nedir',
    title: 'Patina nedir? Metal eserlerde yüzey tabakası ve yaş tahmini',
    short: 'Patina, korozyon ve kabuk: görünüm eserin yaşını kanıtlar mı?',
    lead: 'Müzelerdeki bronz heykellerin yeşil yüzeyi, eski sikkelerin kahverengi parlaklığı ya da kararmış gümüş takılar; hepsi zamanla oluşan yüzey tabakalarının sonucudur. Bu tabakaya genel olarak patina denir. Patina hem eserin geçmişine dair ipuçları taşır hem de onu korur. Bu rehberde patinanın nasıl oluştuğunu, eserin yaşı hakkında neler söyleyip neler söyleyemediğini ve neden temizlenmemesi gerektiğini anlatıyoruz.',
    sections: [
      ['Patina nasıl oluşur?', [
        'Metaller, bulundukları ortamdaki oksijen, nem, tuzlar ve topraktaki minerallerle yavaş yavaş tepkimeye girer. Bu tepkimeler sonucunda metalin yüzeyinde oksitler, karbonatlar, sülfürler ve klorürler gibi yeni bileşikler oluşur.',
        'Bakır ve bronz eserlerde en sık görülen tabakalar şunlardır: metal yüzeyine yakın kırmızımsı kuprit (bakır oksit), onun üzerinde yeşil malahit ve zaman zaman mavi azurit (bakır karbonatlar). Toprak koşullarına göre kahverengi, siyah ya da koyu yeşil tonlar da görülebilir.',
        'Gümüş eserler çoğunlukla gümüş sülfür nedeniyle kararır; tuzlu topraklarda ise gri-mor renkli, mum kıvamında bir gümüş klorür tabakası oluşabilir. Altın ise korozyona çok dayanıklıdır; bu yüzden altın eserler toprağın altından yüzyıllar sonra bile parlak çıkabilir.',
      ]],
      ['Patina eserin yaşını gösterir mi?', [
        'Doğal patina genellikle katmanlıdır, girintilere işlemiştir ve metalle sıkı bir bağ kurar. Yapay olarak eskitilmiş yüzeyler ise çoğunlukla düz, tek renkli ve kolayca kazınabilen bir görünüme sahiptir.',
        'Ancak patina tek başına yaş kanıtı değildir. Patinanın oluşma hızı ortama göre çok değişir: tuzlu ve nemli bir toprakta birkaç on yılda kalın bir tabaka oluşabilirken kuru bir ortamda yüzyıllar boyunca ince kalabilir. Ayrıca modern kimyasal yöntemlerle gerçeğe çok yakın yapay patinalar üretilebilir.',
        'Bu nedenle uzmanlar patinayı tek başına değil; eserin biçimi, üslubu, üretim izleri ve gerektiğinde laboratuvar analizleriyle birlikte değerlendirir.',
      ]],
      ['Bronz hastalığı: tehlikeli bir değişim', [
        'Bronz eserlerde görülen açık yeşil, toz hâlinde ve kabarcıklı lekeler “bronz hastalığı” olarak bilinir. Bu durum, metal içindeki bakır klorürlerin nemle tepkimeye girmesiyle ortaya çıkar ve eser zamanla çürüyerek dağılabilir.',
        'Bronz hastalığı fark edilen eserler kuru bir ortamda saklanmalı ve konservatörlere gösterilmelidir. Evde yapılan müdahaleler çoğu zaman sorunu büyütür.',
      ]],
      ['Neden temizlenmemeli?', [
        'Kararlı bir patina eseri dış etkenlere karşı korur. Zımpara, tel fırça, asit, sirke ya da limon ile yapılan temizlik bu koruyucu tabakayı yok eder ve metali yeniden aşınmaya açık hâle getirir.',
        'Patina aynı zamanda bilgi taşır: üzerindeki toprak kalıntıları ve tabakalaşma, eserin nasıl bir ortamda kaldığını anlatır. Temizlenmiş eserlerde bu bilgi kaybolur. Müzelerde temizlik ve koruma işlemleri yalnızca uzman konservatörler tarafından, eserin durumuna göre ve kontrollü olarak yapılır.',
      ]],
      ['Metal eserler nasıl saklanmalı?', [
        'Kuru ve sıcaklığı sabit bir ortam en iyisidir. Nem, özellikle bronz ve demir eserler için en büyük tehlikedir.',
        'Eserler asitsiz kâğıt ya da yumuşak kumaş üzerinde, birbirine değmeden saklanmalıdır. Plastik poşetler nemi hapsedebileceği için uzun süreli saklama için uygun değildir.',
      ]],
    ],
    faq: [
      ['Yeşil renkli her sikke eski midir?', 'Hayır. Yeşil patina bakır içeren metallerde birkaç on yılda da oluşabilir ve yapay olarak da üretilebilir. Renk tek başına yaş göstergesi değildir.'],
      ['Patina sikkenin değerini düşürür mü?', 'Hayır, düzgün ve kararlı bir patina genellikle değeri korur. Değeri asıl düşüren, patinanın temizlik sırasında zarar görmesidir.'],
    ],
  },
  {
    id: 'sahte-eser-nasil-anlasilir',
    title: 'Sahte eser nasıl anlaşılır? Taklit sikke, heykelcik ve belge ipuçları',
    short: 'Sahte sikke, heykelcik ve belge uyarı işaretleri.',
    lead: 'Pazar yerlerinde, sosyal medyada ve ikinci el sitelerde “antik” diye sunulan eserlerin büyük çoğunluğu taklittir. Bazıları hediyelik eşya olarak üretilir, bazıları ise bilerek alıcıyı kandırmak için eskitilir. Bu rehber, taklit eserleri ilk bakışta fark etmenize yardımcı olabilecek uyarı işaretlerini derler. Unutmayın: kesin karar her zaman uzman incelemesiyle verilir.',
    sections: [
      ['Taklit sikkelerin ipuçları', [
        'Antik sikkelerin büyük bölümü, iki kalıp arasına konan metal pulun çekiçle vurulmasıyla basılmıştır. Bu yöntem kenarlarda hafif çatlaklar, düzensiz bir daire biçimi ve kalıbın biraz kaymasından doğan izler bırakır. Döküm yoluyla üretilen taklitlerde ise kenarlar yumuşak, yüzey gözenekli ve ayrıntılar bulanık olur.',
        'Döküm taklitlerde kenarın bir yerinde döküm kanalı ya da birleşme çizgisi görülebilir. Yüzeyde küçük hava kabarcığı izleri de döküm sahteliğinin tipik işaretidir.',
        'Ağırlık önemli bir ipucudur. Gerçek bir gümüş tetradrahmi ya da altın solidusun beklenen ağırlığı kataloglarda bellidir. Çok hafif ya da çok ağır bir örnek şüphe uyandırmalıdır.',
        'Aynı sikkeden birebir aynı kusurları taşıyan çok sayıda örnek görüyorsanız, bunlar büyük olasılıkla aynı kalıptan dökülmüş taklitlerdir. Antik basım tekniğinde her sikke az da olsa farklıdır.',
      ]],
      ['Heykelcik, kandil ve takılar', [
        'Farklı dönem ve kültürlerin üsluplarını bir arada taşıyan eserler taklit olma olasılığı yüksek eserlerdir. Örneğin bir Hitit motifinin yanında Roma üslubunda bir yüz bulunması tutarsız bir birleşimdir.',
        'Toprak ve kir tabakası eserin girintilerine işlememiş, yüzeye sonradan sürülmüş gibi duruyorsa dikkatli olun. Yapay olarak eskitilmiş eserlerde aşınma izleri genellikle mantıksız yerlerde ve aşırı düzenli görülür.',
        'Pişmiş toprak (seramik) eserlerin yaşı termolüminesans gibi laboratuvar yöntemleriyle ölçülebilir; metal eserlerin bileşimi XRF gibi tahribatsız analizlerle incelenebilir. Bu testler yalnızca uzman kurumlarda yapılır.',
      ]],
      ['Belge, harita ve “define notları”', [
        'Eskitilmiş kâğıt üzerine yazılmış haritalar, mühürlü belgeler ve şifreli notlar sahteciliğin en yaygın türlerindendir. Kâğıdın çay ya da kahveyle boyanması, kenarlarının yakılması ve modern kalem izleri tipik işaretlerdir.',
        'Osmanlıca ya da eski harflerle yazılmış gibi görünen pek çok belgede dil bilgisi hataları, dönemine uymayan kelimeler ve modern yer adları bulunur. Bu tür belgeler tarihî kaynak değil, çoğu zaman satış amaçlı üretilmiş kâğıtlardır.',
      ]],
      ['Satıcının hikâyesine dikkat', [
        '“Dedemden kaldı”, “gizli bir kazıdan çıktı”, “yurt dışına çıkmadan son fırsat” gibi anlatılar eserin gerçekliğine dair hiçbir kanıt sunmaz. Aksine, aceleye getiren ve gizlilik isteyen satışlar dolandırıcılığın en yaygın işaretleridir.',
        'Kâğıt üzerinde “ekspertiz raporu” sunulması da yeterli değildir; bu raporların bir kısmı sahte ya da yetkisiz kişilerce hazırlanmış olabilir.',
      ]],
      ['Hukuki uyarı', [
        'Eser gerçek de olsa sahte de olsa, izinsiz kültür varlığı alım satımı hukuki risk taşır. Gerçek bir eser söz konusuysa, onu satın almak ya da elde bulundurmak suçtur. Sahte bir eser için ödeme yapmak ise dolandırıcılığa kurban gitmek demektir.',
        'Şüpheli bir teklif aldığınızda ödeme yapmayın, eseri teslim almayın ve gerekirse durumu kolluk birimlerine bildirin.',
      ]],
    ],
    faq: [
      ['Mıknatıs sikkeyi tutuyorsa sahte midir?', 'Antik altın, gümüş ve bronz sikkeler mıknatısa tutunmaz. Mıknatısa yapışan bir sikke büyük olasılıkla demir ya da çelik içeren modern bir taklittir; ancak tutunmaması gerçek olduğunu kanıtlamaz.'],
      ['Uygulama sahte eseri tespit edebilir mi?', 'Fotoğraf tabanlı bir değerlendirme bazı uyarı işaretlerini gösterebilir, ancak kesin sahtelik kararı ancak eserin elde ve gerektiğinde laboratuvarda incelenmesiyle verilebilir.'],
    ],
  },
  {
    id: 'define-efsaneleri-ve-gercekler',
    title: 'Define efsaneleri ve gerçekler: halk inanışı mı, tarih mi?',
    short: 'Anadolu’daki define efsanelerinin kökeni ve bilimsel karşılığı.',
    lead: 'Anadolu’da neredeyse her köyün anlatılan bir define hikâyesi vardır: kayaya oyulmuş bir yılanın baktığı yön, ağaç dibine gömülmüş küpler, gece parlayan ışıklar… Bu hikâyeler kuşaktan kuşağa aktarılan zengin bir sözlü kültürün parçasıdır. Ancak efsaneler ile tarihî gerçekler arasında büyük bir fark vardır. Bu rehberde bu farkı anlatıyor, işaretlerin arkeolojideki gerçek karşılıklarına dikkat çekiyoruz.',
    sections: [
      ['Efsaneler nereden doğar?', [
        'İnsanlar savaşlar, salgınlar ve göçler sırasında değerli eşyalarını toprağa gömerek saklamıştır. Arkeolojik kazılarda bu tür saklama buluntularına, yani gömülerine gerçekten rastlanır. Ancak bu gömüler çoğunlukla küçük ölçeklidir ve tesadüfen bulunur.',
        'Antik kentlerin, kalelerin ve mezarların kalıntıları üzerine ya da yakınına kurulan köylerde, anlamı bilinmeyen yapılar zamanla hikâyelerle açıklanmıştır. Bir kaya mezarı “hazine odası”, bir sarnıç “gizli geçit”, bir mil taşı “işaret” olarak yorumlanmıştır.',
      ]],
      ['Taşlardaki işaretler gerçekte ne anlatır?', [
        'Kayalara oyulmuş çanak biçimli çukurlar çoğunlukla sunu ve adak törenleriyle, şarap ve zeytinyağı üretimiyle ya da doğal aşınmayla ilgilidir. Yılan, kartal ve aslan kabartmaları ise farklı uygarlıklarda koruyuculuk, güç ve inançla ilişkili sembollerdir.',
        'Haç işaretleri Hristiyan dönemine ait inanç sembolleri, mezar işaretleri ya da sınır belirteçleri olabilir. Ok ve çizgi biçimindeki oymalar ise bazen taş ocağı işçilerinin, bazen de sonraki dönemlerde çobanların bıraktığı izlerdir.',
        'Defineciler sitesindeki işaret rehberinde her işaret için halk arasındaki yorum ile tarih ve arkeolojideki karşılığı ayrı ayrı anlatılır. Kısaca: bir işaretin “define var” anlamına geldiğine dair bilimsel bir kanıt yoktur.',
      ]],
      ['Efsanelerin bedeli', [
        'Define umuduyla yapılan kaçak kazılar, Anadolu’daki arkeolojik mirasa her yıl büyük zarar verir. Bir kaya mezarının ya da tümülüsün dinamitle ya da iş makinesiyle açılması, binlerce yıllık bilgiyi birkaç saatte yok eder.',
        'Kazı yapan kişiler de büyük risk altına girer: hapis ve para cezalarının yanında göçükler, düşmeler ve dolandırıcılar da ciddi tehlikelerdir. “Define bulduk, ortak ol” teklifleri çoğu zaman dolandırıcılığın kapısını aralar.',
      ]],
      ['Gerçek hazine nerede?', [
        'Arkeologlar için en değerli şey altın değil, bağlamdır: bir sikke, bir çömlek parçası ya da bir mühür, bulunduğu katmandaki diğer nesnelerle birlikte incelendiğinde geçmişte yaşamış insanların günlük hayatını, ticaretini ve inançlarını anlatır.',
        'Bu bilgiye ulaşmanın en güzel yolu müzeleri ve ören yerlerini ziyaret etmek, bilimsel kazılarda gönüllü olmak ve bulunan eserleri bildirerek bu mirasın korunmasına katkıda bulunmaktır.',
      ]],
    ],
    faq: [
      ['Kayadaki yılan işareti hazinenin yerini gösterir mi?', 'Hayır. Yılan pek çok kültürde koruyuculuk ve bereketle ilişkilendirilen bir semboldür. Bir hazinenin yerini gösterdiğine dair bilimsel bir kanıt yoktur.'],
      ['Gece görülen ışıklar defineye mi işarettir?', 'Bu inanışın bilimsel bir dayanağı yoktur. Gece görülen ışıklar çoğunlukla yansımalar, araç farları, bataklık gazları ya da göz yanılmalarıyla açıklanabilir.'],
    ],
  },
  {
    id: 'seramik-nasil-tarihlenir',
    title: 'Seramik nasıl tarihlenir? Çanak çömlek parçalarından dönem tahmini',
    short: 'Hamur, astar, sır ve bezeme ile seramik parçalarını dönemlerine ayırma.',
    lead: 'Arkeolojik kazılarda en sık bulunan malzeme seramiktir. Kırılan kaplar atılsa bile parçaları toprakta binlerce yıl boyunca bozulmadan kalır. Bu yüzden seramik, arkeologların bir yerleşimi tarihlemesinde en güvendiği araçlardan biridir. Bu rehberde, bir seramik parçasına bakarken hangi özelliklerin dönem hakkında ipucu verdiğini anlatıyoruz.',
    sections: [
      ['Hamur: kabın iç yapısı', [
        'Seramiğin kırık kenarına bakıldığında görülen kesite hamur denir. Hamurun rengi, içindeki katkı maddeleri (kum, saman, kireç taşı, mika gibi) ve pişirme derecesi, kabın nerede ve nasıl üretildiği hakkında bilgi verir.',
        'Erken dönem seramiklerinde hamur genellikle kaba ve iri katkılıdır; pişirme sıcaklığı düşük olduğu için kesitte renk farklılıkları görülür. Gelişmiş atölyelerde üretilen kaplarda ise hamur ince, homojen ve iyi pişirilmiştir.',
      ]],
      ['Elde yapım ve çark', [
        'Neolitik ve erken dönemlere ait kaplar elde şekillendirilmiştir; duvar kalınlığı düzensizdir. Çömlekçi çarkının yaygınlaşmasıyla kapların duvarları incelir ve yüzeyde ince, paralel dönme izleri görülür.',
        'Çarkta yapılmış bir parçanın içinde ya da dışında spiral biçimli izler görmek, kabın çarkta biçimlendirildiğine dair güçlü bir işarettir.',
      ]],
      ['Astar, boya ve bezeme', [
        'Astar, kabın yüzeyine sürülen ince kil tabakasıdır ve renk ile parlaklık verir. Bezeme ise boya, kazıma, baskı ya da kabartma ile yapılan süslemedir.',
        'Antik Yunan dünyasında MÖ 7. ve 6. yüzyıllarda siyah figür tekniği, MÖ 6. yüzyılın sonlarından itibaren kırmızı figür tekniği yaygınlaşır. Roma döneminde parlak kırmızı astarlı ve çoğu zaman üretici damgası taşıyan “terra sigillata” kapları tipiktir.',
        'Bizans döneminde sırlı ve kazıma bezemeli (sgraffito) kaplar görülür. Selçuklu ve Osmanlı dönemlerinde sırlı, renkli seramikler gelişir; İznik ve Kütahya çinileri ile Çanakkale seramikleri bu geleneğin bilinen örnekleridir.',
      ]],
      ['Biçim: kabın şekli neyi anlatır?', [
        'Ağız kenarı, kulp ve dip biçimleri dönemden döneme değişir. Arkeologlar özellikle ağız kenarı parçalarını çizerek kataloglardaki örneklerle karşılaştırır.',
        'Amphoralar, yani şarap ve zeytinyağı taşımak için kullanılan iki kulplu büyük kaplar, hem dönemi hem de ticaret ağlarını gösterir. Biçimleri ve üzerindeki damgalar, hangi bölgede üretildiklerini ortaya koyabilir.',
      ]],
      ['Laboratuvar yöntemleri', [
        'Termolüminesans yöntemi, seramiğin son pişirildiği zamandan bu yana biriktirdiği doğal radyasyon miktarını ölçerek yaklaşık bir yaş verir. Bu yöntem sahte eserleri ayırt etmede de kullanılır.',
        'Kimyasal ve mineralojik analizler, kilin hangi kaynaktan geldiğini belirleyebilir. Bu sayede bir kabın yerel mi yoksa ithal mi olduğu anlaşılır.',
      ]],
      ['Bağlamın önemi', [
        'Bir seramik parçası tek başına dönem hakkında fikir verse de asıl değeri bulunduğu katmanla birlikte incelendiğinde ortaya çıkar. Aynı katmandaki sikkeler, yapı kalıntıları ve diğer buluntular birlikte değerlendirilerek yerleşimin kronolojisi kurulur.',
        'Bu nedenle bir ören yerinde yüzeyde gördüğünüz seramik parçalarını toplamamanız ve yerinde bırakmanız gerekir. Bu parçalar yüzey araştırmalarında arkeologların en önemli veri kaynaklarından biridir.',
      ]],
    ],
    faq: [
      ['Tarlada bulduğum çömlek parçası değerli midir?', 'Maddi değeri çoğu zaman düşüktür, ancak bilimsel değeri yüksek olabilir. Tarlanızda yoğun seramik parçası görüyorsanız bu, eski bir yerleşimin izi olabilir; durumu müze müdürlüğüne bildirmek en doğrusudur.'],
      ['Sırlı seramik her zaman yeni midir?', 'Hayır. Sır kullanımı Anadolu’da Orta Çağ’da yaygınlaşmıştır, ancak bazı erken örnekler daha eski dönemlere uzanır. Tarihleme için hamur, biçim ve bezeme birlikte değerlendirilmelidir.'],
    ],
  },
  {
    id: 'tumulus-nedir',
    title: 'Tümülüs nedir? Anadolu’nun yapay mezar tepeleri',
    short: 'Tümülüslerin yapısı, Frig ve Lidya örnekleri ve neden korunmaları gerektiği.',
    lead: 'Anadolu’nun birçok ovasında çevresinden belirgin biçimde yükselen, yuvarlak ve düzgün tepeler görürsünüz. Bunların bir kısmı doğal tepeler, bir kısmı ise binlerce yıl önce bir yöneticinin ya da soylunun mezarı üzerine yığılmış yapay tepelerdir. Arkeolojide bu yapılara tümülüs denir. Bu rehberde tümülüslerin nasıl yapıldığını, Anadolu’daki ünlü örnekleri ve neden korunmaları gerektiğini anlatıyoruz.',
    sections: [
      ['Tümülüs nasıl yapılır?', [
        'Tümülüs, bir mezar odasının üzerine toprak, taş ya da ikisinin karışımının yığılmasıyla oluşturulan yapay bir tepedir. Mezar odası ahşap, taş ya da kerpiçten olabilir. Bazı tümülüslere dromos denen bir koridorla girilir.',
        'Tümülüsün büyüklüğü genellikle gömülen kişinin toplumdaki önemini gösterir. Küçük tümülüsler birkaç metre yüksekliğindeyken büyük kral tümülüsleri onlarca metreye ulaşabilir.',
      ]],
      ['Frig tümülüsleri ve Gordion', [
        'Frig başkenti Gordion çevresinde (bugünkü Ankara Polatlı yakınları) yüzden fazla tümülüs bulunur. Bunların en büyüğü, yaygın olarak Kral Midas’a ya da ailesinden birine ait olduğu düşünülen büyük tümülüstür.',
        'Bu tümülüsün içindeki ardıç ve çam ağacından yapılmış mezar odası, dünyanın günümüze ulaşan en eski ahşap yapılarından biri olarak kabul edilir. Ağaç halkalarıyla yapılan tarihleme, odanın yaklaşık MÖ 8. yüzyılın ikinci yarısına ait olduğunu gösterir. Gordion, 2023 yılında UNESCO Dünya Mirası Listesi’ne alınmıştır.',
      ]],
      ['Lidya tümülüsleri: Bin Tepe', [
        'Lidya’nın başkenti Sardes’in kuzeyinde, Gygaia Gölü (Marmara Gölü) çevresinde uzanan alan, çok sayıda tümülüs nedeniyle “Bin Tepe” olarak anılır. Antik yazar Herodotos’un anlattığı Kral Alyattes’in mezarının bu tümülüslerden biri olduğu düşünülmektedir.',
      ]],
      ['Diğer örnekler', [
        'Kommagene Kralı I. Antiokhos’un Nemrut Dağı’ndaki tümülüsü, dev heykelleriyle Anadolu’nun en tanınmış anıtlarından biridir. Trakya’da, özellikle Kırklareli ve Edirne çevresinde de çok sayıda tümülüs bulunur.',
        'Bu örnekler, tümülüs geleneğinin farklı dönem ve kültürlerde, birbirinden bağımsız olarak da sürdürüldüğünü gösterir.',
      ]],
      ['Tümülüsler neden korunmalı?', [
        'Tümülüsler, kaçak kazıcıların en çok hedef aldığı arkeolojik yapılardandır. İçlerine açılan tüneller ve dinamitle yapılan tahribat, hem tümülüsün yapısını bozar hem de mezar odasındaki bilgileri yok eder. Pek çok tümülüs, bilim insanları incelemeden önce bu şekilde soyulmuştur.',
        'Tümülüsler genellikle sit alanı olarak tescillidir; üzerlerinde kazı yapmak, toprak almak ya da tarım için düzleştirmek yasaktır. Bir tümülüste kazı izi görürseniz bunu jandarmaya ya da müze müdürlüğüne bildirmeniz mirasın korunmasına önemli bir katkıdır.',
      ]],
    ],
    faq: [
      ['Her yuvarlak tepe tümülüs müdür?', 'Hayır. Pek çok yuvarlak tepe doğal oluşumdur. Ayrıca eski yerleşim yerlerinin üst üste birikmesiyle oluşan höyükler de tümülüsle karıştırılır; höyük bir yerleşim, tümülüs ise bir mezar yapısıdır.'],
      ['Tümülüslerde hâlâ hazine var mı?', 'Kaçak kazıcıların büyük bölümü hiçbir şey bulamaz; çünkü tümülüslerin çoğu antik çağda ya da sonraki dönemlerde açılmıştır. Gerçek değer, bilimsel kazılarla elde edilen bilgidedir.'],
    ],
  },
  {
    id: 'anadolu-arkeolojik-donemler',
    title: 'Anadolu’nun arkeolojik dönemleri: Neolitik’ten Osmanlı’ya zaman çizelgesi',
    short: 'Göbeklitepe’den Osmanlı’ya Anadolu tarihinin dönemleri ve öne çıkan buluntular.',
    lead: 'Anadolu, insanlığın yerleşik hayata geçtiği ilk bölgelerden biridir ve on binlerce yıllık kesintisiz bir yaşam geçmişine sahiptir. Müzelerde ya da ören yerlerinde gördüğünüz bir eserin hangi döneme ait olduğunu anlamak için bu dönemlerin genel sırasını bilmek çok işe yarar. Aşağıdaki tarihler yaklaşıktır ve bölgeden bölgeye farklılık gösterebilir.',
    sections: [
      ['Paleolitik ve Mezolitik (Taş Devri)', [
        'Anadolu’da insan varlığının izleri yüz binlerce yıl öncesine uzanır. Avcı-toplayıcı topluluklar mağaralarda ve açık alanlarda yaşamış, yontma taştan aletler kullanmıştır. Antalya çevresindeki Karain Mağarası bu dönemin bilinen yerlerindendir.',
      ]],
      ['Neolitik (Cilalı Taş Devri, yaklaşık MÖ 10.000–6000)', [
        'İnsanların tarıma ve hayvancılığa geçtiği, yerleşik köylerin kurulduğu dönemdir. Şanlıurfa’daki Göbeklitepe, yaklaşık MÖ 9600’e uzanan anıtsal yapılarıyla dünyanın bilinen en eski tören merkezlerinden biri olarak kabul edilir ve 2018’de UNESCO Dünya Mirası Listesi’ne alınmıştır.',
        'Konya’daki Çatalhöyük, yaklaşık MÖ 7400–6000 arasında yerleşilmiş büyük bir Neolitik yerleşimdir; duvar resimleri ve bitişik evleriyle tanınır ve 2012’den beri UNESCO listesindedir.',
      ]],
      ['Kalkolitik (Bakır Çağı, yaklaşık MÖ 6000–3000)', [
        'Taş aletlerin yanında bakırın da kullanılmaya başlandığı dönemdir. Boyalı seramikler ve gelişen ticaret ağları bu dönemin belirgin özellikleridir.',
      ]],
      ['Tunç Çağı (yaklaşık MÖ 3000–1200)', [
        'Bakır ve kalayın karıştırılmasıyla elde edilen tunç yaygınlaşır. Erken Tunç Çağı’nda Troya ve Alacahöyük gibi merkezler öne çıkar. Orta Tunç Çağı’nda Asurlu tüccarların Kültepe (Kaniş-Karum) çevresinde kurduğu ticaret kolonileri, Anadolu’da yazının kullanılmaya başlandığı dönemi başlatır.',
        'Geç Tunç Çağı, Hitit İmparatorluğu’nun Anadolu’ya hâkim olduğu dönemdir. Başkent Hattuşa’da bulunan binlerce çivi yazılı tablet, bu dönemin diplomasi, hukuk ve dinine ışık tutar.',
      ]],
      ['Demir Çağı (yaklaşık MÖ 1200–550)', [
        'Hitit İmparatorluğu’nun çöküşünün ardından Anadolu’da farklı krallıklar ortaya çıkar: Orta Anadolu’da Frigler, Doğu Anadolu’da Urartular, Batı Anadolu’da Lidyalılar, Güneydoğu’da ise Geç Hitit kent devletleri. Bu dönemde demir aletler yaygınlaşır.',
      ]],
      ['Arkaik, Klasik ve Hellenistik dönemler (yaklaşık MÖ 700–30)', [
        'Batı Anadolu kıyılarında İyonya kentleri gelişir; felsefe, bilim ve sanat alanında önemli eserler ortaya çıkar. MÖ 6. yüzyılın ortasından itibaren Anadolu’nun büyük bölümü Pers egemenliğine girer.',
        'Büyük İskender’in MÖ 334’te başlayan seferiyle Hellenistik dönem başlar. Bergama Krallığı ve Seleukos Krallığı gibi devletler bu dönemde öne çıkar.',
      ]],
      ['Roma ve Bizans dönemleri (yaklaşık MÖ 133 – MS 1453)', [
        'Bergama Krallığı’nın MÖ 133’te Roma’ya bırakılmasıyla Anadolu’da Roma dönemi başlar. Efes, Afrodisias ve Perge gibi kentler bu dönemde büyük gelişme gösterir.',
        'MS 330’da Konstantinopolis’in başkent olmasıyla Doğu Roma, yani Bizans dönemi başlar. Kiliseler, sarnıçlar, kaleler ve mozaikler bu dönemin en bilinen kalıntılarıdır.',
      ]],
      ['Selçuklu, Beylikler ve Osmanlı dönemleri', [
        '1071 Malazgirt Savaşı’nın ardından Anadolu’da Türk egemenliği başlar. Anadolu Selçuklu Devleti döneminde kervansaraylar, medreseler ve camiler inşa edilir. Ardından gelen Beylikler döneminin sonunda Osmanlı Devleti Anadolu’nun büyük bölümünü birleştirir.',
        'Bu dönemlere ait yapılar, mezar taşları, sikkeler ve seramikler de kültür varlığıdır ve aynı yasal korumaya tabidir.',
      ]],
    ],
    faq: [
      ['Anadolu’daki en eski yerleşim hangisidir?', 'Bilinen en eski anıtsal yapılar Göbeklitepe’dedir; ancak Anadolu’da insan varlığı çok daha eskiye, Paleolitik döneme uzanır.'],
      ['Höyük nedir?', 'Höyük, aynı yere yüzyıllar boyunca tekrar tekrar kurulan yerleşimlerin kalıntılarının üst üste birikmesiyle oluşan yapay tepedir. Her katman farklı bir dönemi temsil eder.'],
    ],
  },
];

// Bölge/uygarlık sayfaları: arama niyeti "tarih, gezilecek yerler, eserler"; yer ifşası ve kazı teşviki yok.
export const REGIONS = [
  {
    id: 'hitit',
    title: 'Hititler: Anadolu’nun ilk büyük imparatorluğu',
    short: 'Hitit uygarlığı, Hattuşa, Yazılıkaya ve tipik eserleri.',
    lead: 'Hititler, yaklaşık MÖ 17. yüzyıldan MÖ 12. yüzyılın başlarına kadar Orta Anadolu merkezli güçlü bir devlet kurdu. Mısır ve Asur gibi dönemin büyük güçleriyle eşit düzeyde ilişki kuran Hititler; yazılı hukukları, diplomatik antlaşmaları ve kaya kabartmalarıyla Anadolu tarihinde ayrı bir yere sahiptir.',
    sections: [
      ['Başkent Hattuşa', [
        'Hitit başkenti Hattuşa, bugünkü Çorum’un Boğazkale ilçesinde yer alır. Yaklaşık iki kilometrekareyi aşan alanıyla dönemin en büyük kentlerinden biridir. Aslanlı Kapı, Kral Kapısı, Yer Kapı ve Büyük Tapınak kentin en tanınmış yapılarıdır.',
        'Hattuşa ve yakınındaki Yazılıkaya açık hava tapınağı, 1986 yılında UNESCO Dünya Mirası Listesi’ne alınmıştır.',
      ]],
      ['Çivi yazılı tabletler ve Hitit dili', [
        'Hattuşa’daki kazılarda binlerce çivi yazılı kil tablet bulunmuştur. Bu tabletler devlet arşivlerinin, mektupların, antlaşmaların, kanunların ve dinî metinlerin bir parçasıdır.',
        'Hitit dili, Hint-Avrupa dil ailesinin bilinen en eski yazılı dillerinden biridir. Dilin çözülmesi 20. yüzyılın başlarında Çek dilbilimci Bedřich Hrozný’nin çalışmalarıyla mümkün olmuştur.',
        'Hitit kralı III. Hattuşili ile Mısır firavunu II. Ramses arasında yapılan Kadeş Antlaşması, bilinen en eski yazılı barış antlaşmalarından biri olarak kabul edilir. Antlaşmanın Hattuşa’da bulunan tablet kopyası İstanbul Arkeoloji Müzeleri’nde sergilenmektedir.',
      ]],
      ['Yazılıkaya ve kaya kabartmaları', [
        'Yazılıkaya, Hattuşa’nın yakınında doğal kaya oluşumlarının arasında yer alan bir açık hava tapınağıdır. Kaya yüzeylerine işlenmiş tanrı ve tanrıça alayları, Hitit dininin “bin tanrılı” yapısını yansıtır.',
        'Hititlerin ve onların ardından gelen Geç Hitit krallıklarının kaya kabartmaları Anadolu’nun farklı yerlerinde görülür. Bu kabartmalar çoğunlukla kralları, tanrıları ve hiyeroglif yazıtları gösterir.',
      ]],
      ['Hitit sanatı ve tipik eserler', [
        'Hitit sanatında aslan ve sfenks figürleri, boğa biçimli ritüel kapları, damga mühürler ve madenî heykelcikler yaygındır. Alacahöyük’te bulunan ve Hitit öncesi döneme ait güneş kursları ile geyik heykelcikleri de Anadolu’nun simge eserleri arasındadır.',
        'Hiyeroglif Luvice yazıtlar, özellikle Geç Hitit döneminde, anıtsal taş bloklar üzerinde kullanılmıştır.',
      ]],
      ['Hititleri nerede görebilirsiniz?', [
        'Ankara’daki Anadolu Medeniyetleri Müzesi, Hitit eserlerinin en zengin koleksiyonlarından birine sahiptir. Çorum Müzesi ile Boğazköy Müzesi de bölgedeki kazılardan çıkan buluntuları sergiler.',
        'Hattuşa ören yeri, Alacahöyük ve Şapinuva gibi alanlar ziyaretçilere açıktır. Gezerken yalnızca belirlenmiş yollarda yürümek ve kalıntılara dokunmamak, bu mirasın korunmasına katkıdır.',
      ]],
    ],
    faq: [
      ['Hititler hangi dili konuşuyordu?', 'Hititler Hint-Avrupa dil ailesine ait Hititçeyi konuşuyordu. Devlette Hititçenin yanında Luvice, Hattice ve Akadca gibi diller de kullanılıyordu.'],
      ['Hitit İmparatorluğu nasıl yıkıldı?', 'İmparatorluk yaklaşık MÖ 12. yüzyılın başlarında çöktü. Kuraklık, kıtlık, iç karışıklıklar ve “Deniz Kavimleri” olarak bilinen göç dalgaları gibi birden çok etkenin birlikte rol oynadığı düşünülmektedir.'],
    ],
  },
  {
    id: 'frigya',
    title: 'Frigler ve Frigya: Gordion, Midas ve kaya anıtları',
    short: 'Frig uygarlığı, başkent Gordion, kaya anıtları ve Midas efsanesi.',
    lead: 'Frigler, Hitit İmparatorluğu’nun çöküşünün ardından Orta Anadolu’da güçlenen ve özellikle MÖ 8. yüzyılda en parlak dönemini yaşayan bir halktır. Başkentleri Gordion, efsanevi Kral Midas ve kayalara oyulmuş anıtlarıyla Frigler, Anadolu’nun en tanınan Demir Çağı uygarlıklarından biridir.',
    sections: [
      ['Başkent Gordion', [
        'Gordion, Ankara’nın Polatlı ilçesi yakınlarında, Sakarya Nehri kıyısında yer alır. Kentin kalıntıları ve çevresindeki tümülüsler, 2023 yılında UNESCO Dünya Mirası Listesi’ne alınmıştır.',
        'Gordion’daki kazılarda Frig sarayları, kale kapıları, renkli taş mozaik döşemeler ve büyük miktarda seramik bulunmuştur. Kent, yaklaşık MÖ 7. yüzyılın başlarında Kimmer saldırılarıyla büyük zarar görmüştür.',
      ]],
      ['Kral Midas: tarih ve efsane', [
        'Antik kaynaklarda ve Asur belgelerinde adı geçen Midas, MÖ 8. yüzyılın ikinci yarısında hüküm sürmüş gerçek bir Frig kralıdır. Dokunduğu her şeyi altına çeviren kral efsanesi ise sonraki dönemlerde Yunan anlatılarında ortaya çıkmıştır.',
        'Gordion’daki büyük tümülüs, yaygın olarak Midas’a ya da babasına ait olduğu düşünülen bir mezardır. İçindeki ahşap mezar odası, dünyanın günümüze ulaşan en eski ahşap yapılarından biridir.',
        'Büyük İskender’in MÖ 333’te Gordion’da çözdüğü anlatılan “Gordion düğümü” de bu kentle ilgili ünlü bir hikâyedir.',
      ]],
      ['Frig Vadisi ve kaya anıtları', [
        'Eskişehir, Afyonkarahisar ve Kütahya arasındaki bölge, Frig Vadisi olarak bilinir. Bölgede kayalara oyulmuş anıtsal cepheler, kaya mezarları ve kutsal alanlar bulunur.',
        'Bunların en ünlüsü, Eskişehir’in Han ilçesine bağlı Yazılıkaya köyündeki ve yüzeyinde Frig yazıtı bulunan anıttır. Halk arasında “Midas Anıtı” olarak bilinen bu cephenin, Frig Ana Tanrıçası’na adandığı düşünülmektedir.',
      ]],
      ['Frig dini ve sanatı', [
        'Friglerin en önemli tanrısı Matar, yani “Ana”dır. Bu tanrıça sonraki dönemlerde Kybele adıyla tanınmış ve kültü Akdeniz dünyasına yayılmıştır.',
        'Frig sanatında geometrik desenler, ahşap oymacılığı, tunç kaplar ve fibula denen süslü kopçalar öne çıkar. Frig alfabesi, Fenike kökenli alfabelerden türetilmiştir ve kaya anıtlarında görülebilir.',
      ]],
      ['Frigya’yı nerede görebilirsiniz?', [
        'Gordion Müzesi, Ankara’daki Anadolu Medeniyetleri Müzesi ve Eskişehir ile Afyonkarahisar müzeleri Frig eserlerini sergiler. Frig Vadisi’nde yürüyüş rotaları da bulunur.',
      ]],
    ],
    faq: [
      ['Kral Midas gerçekten yaşadı mı?', 'Evet. Midas adlı bir Frig kralı MÖ 8. yüzyılda yaşamıştır ve Asur kaynaklarında da adı geçer. Altın efsanesi ise sonradan ortaya çıkmış bir anlatıdır.'],
      ['Frigler hangi bölgede yaşadı?', 'Frigler ağırlıklı olarak Orta ve Batı Anadolu’da, bugünkü Ankara, Eskişehir, Afyonkarahisar ve Kütahya çevresinde yaşamıştır.'],
    ],
  },
  {
    id: 'lidya',
    title: 'Lidya: ilk sikkeler, Sardes ve Kral Kroisos',
    short: 'Paranın icat edildiği topraklar: Lidya Krallığı ve başkenti Sardes.',
    lead: 'Batı Anadolu’da, Gediz ve Küçük Menderes nehirleri arasındaki verimli topraklarda kurulan Lidya Krallığı, dünya tarihine sikkeyi kazandıran uygarlık olarak bilinir. Başkentleri Sardes, zenginliğiyle ünlü Kral Kroisos ve Bin Tepe tümülüsleriyle Lidya, Anadolu’nun en ilgi çekici antik krallıklarından biridir.',
    sections: [
      ['İlk sikkeler', [
        'Yaygın kabule göre ilk sikkeler, MÖ 7. yüzyılın sonlarında Lidya’da basılmıştır. Bu ilk sikkeler, altın ve gümüşün doğal alaşımı olan elektrondan yapılmıştır. Üzerlerinde çoğunlukla aslan başı motifi görülür.',
        'Kral Kroisos döneminde (yaklaşık MÖ 560–546) saf altın ve saf gümüş sikkeler ayrı ayrı basılmaya başlanmıştır. Bu gelişme, iki metalli para sisteminin başlangıcı olarak kabul edilir.',
      ]],
      ['Başkent Sardes', [
        'Sardes, Manisa’nın Salihli ilçesi yakınlarındaki Sart’ta yer alır. Kentin yanından geçen Paktolos Çayı’nın (bugünkü Sart Çayı) antik çağda altın tozu taşıdığı anlatılır; kazılarda altın arıtma atölyeleri de bulunmuştur.',
        'Sardes, Lidya’dan sonra Pers, Hellenistik ve Roma dönemlerinde de önemli bir kent olmaya devam etmiştir. Roma dönemine ait gymnasium kompleksi ve büyük sinagog, ören yerinin en etkileyici yapılarıdır. Artemis Tapınağı da kentin simgelerinden biridir.',
        'Pers Kralı I. Dareios döneminde düzenlenen ve Sardes’i Pers başkentlerinden Susa’ya bağlayan Kral Yolu, antik dünyanın en önemli yollarından biridir.',
      ]],
      ['Kral Kroisos', [
        '“Kroisos kadar zengin” deyimi, Lidya kralının efsanevi servetinden gelir. Antik tarihçi Herodotos’a göre Kroisos, Pers Kralı Kyros ile savaşmış ve yaklaşık MÖ 546’da yenilmiştir. Bu yenilgiyle Lidya Krallığı sona ermiş, Sardes Pers yönetimine geçmiştir.',
      ]],
      ['Bin Tepe tümülüsleri', [
        'Sardes’in kuzeyinde, Marmara Gölü (antik Gygaia Gölü) çevresinde çok sayıda tümülüs bulunur. Bölge bu nedenle “Bin Tepe” olarak anılır. Bunlardan birinin Kroisos’un babası Kral Alyattes’e ait olduğu düşünülür. Bu tümülüsler, Lidya soylularının anıtsal mezarlarıdır.',
        'Bin Tepe tümülüsleri de tarih boyunca kaçak kazılardan zarar görmüştür ve koruma altındadır.',
      ]],
      ['Lidya’yı nerede görebilirsiniz?', [
        'Sardes ören yeri ziyaretçilere açıktır. Manisa Müzesi ve Uşak Müzesi, Lidya eserlerini sergiler. Uşak Müzesi’ndeki “Karun Hazinesi” olarak bilinen eserler, kaçak kazıyla yurt dışına çıkarıldıktan sonra uzun bir hukuk mücadelesiyle Türkiye’ye geri getirilmiştir.',
      ]],
    ],
    faq: [
      ['Para ilk nerede icat edildi?', 'Yaygın kabule göre ilk sikkeler MÖ 7. yüzyılın sonlarında Lidya’da basılmıştır. Ancak takas ve ölçülü metal kullanımı gibi daha eski ödeme biçimleri de vardır.'],
      ['“Karun gibi zengin” deyimi nereden gelir?', 'Bu deyim, Lidya Kralı Kroisos’un adının Türkçedeki biçimlerinden biri olan “Karun” ile ilişkilendirilir ve kralın efsanevi servetini anlatır.'],
    ],
  },
  {
    id: 'karya',
    title: 'Karya: Halikarnassos Mozolesi ve Batı Anadolu’nun antik kentleri',
    short: 'Karya bölgesi, Mausolos’un anıt mezarı ve antik kentler.',
    lead: 'Karya, bugünkü Muğla ve Aydın illerinin büyük bölümünü kapsayan antik bir bölgedir. Kendine özgü dili, denizcilik geleneği ve dünyanın yedi harikasından biri sayılan Halikarnassos Mozolesi ile tanınır. Bölge, sonraki dönemlerde Hellenistik ve Roma kentleriyle de zengin bir arkeolojik miras bırakmıştır.',
    sections: [
      ['Karyalılar ve Karya dili', [
        'Karyalılar, Batı Anadolu’nun yerli halklarından biridir. Kendi dillerini ve alfabelerini kullanmışlardır. Karya alfabesinin çözülmesi 20. yüzyılın sonlarında önemli ölçüde ilerlemiştir.',
        'Antik kaynaklar, Karyalıları usta denizciler ve paralı askerler olarak anar.',
      ]],
      ['Mausolos ve Halikarnassos Mozolesi', [
        'Pers yönetimine bağlı Karya satrabı Mausolos, başkenti Mylasa’dan (Milas) Halikarnassos’a (Bodrum) taşımıştır. Mausolos’un yaklaşık MÖ 353’teki ölümünün ardından eşi Artemisia tarafından tamamlatılan anıt mezar, antik dünyanın yedi harikasından biri olarak kabul edilmiştir.',
        'Bugün kullanılan “mozole” kelimesi de Mausolos’un adından gelir. Anıt sonraki yüzyıllarda depremlerle yıkılmış; taşlarının bir kısmı 15. yüzyılda Rodos Şövalyeleri tarafından Bodrum Kalesi’nin yapımında kullanılmıştır.',
      ]],
      ['Bölgenin önemli antik kentleri', [
        'Afrodisias, mermer heykel atölyeleri ve iyi korunmuş stadyumuyla ünlüdür; 2017’de UNESCO Dünya Mirası Listesi’ne alınmıştır.',
        'Stratonikeia, Hellenistik dönemden Osmanlı dönemine kadar kesintisiz yerleşim izleri taşıyan bir kenttir. Labraunda, Zeus kutsal alanıyla; Euromos, iyi korunmuş Zeus Tapınağı ile; Knidos ise denizcilik geçmişi ve ünlü Afrodit heykeliyle anılır.',
        'Kaunos, kayalara oyulmuş tapınak cepheli mezarlarıyla Karya ile Likya sınırındaki kültürel etkileşimi gösterir.',
      ]],
      ['Bodrum Sualtı Arkeoloji Müzesi', [
        'Bodrum Kalesi içinde yer alan müze, Ege ve Akdeniz’deki batıklardan çıkarılan eserleri sergiler. Uluburun batığı gibi Tunç Çağı’na ait buluntular, antik deniz ticaretine dair benzersiz bilgiler sunar.',
        'Sualtında bulunan kültür varlıkları da karadakiler gibi korunmaktadır; izinsiz dalış ve eser çıkarma yasaktır.',
      ]],
    ],
    faq: [
      ['Mozole kelimesi nereden gelir?', 'Mozole kelimesi, Karya satrabı Mausolos için Halikarnassos’ta yapılan anıt mezarın adından gelir.'],
      ['Karya bugün hangi illerde kalıyor?', 'Antik Karya bölgesi, bugünkü Muğla ve Aydın illerinin büyük bölümü ile Denizli’nin bir kısmını kapsar.'],
    ],
  },
  {
    id: 'likya',
    title: 'Likya: kaya mezarları, Likya Birliği ve Likya Yolu',
    short: 'Likya uygarlığı, kaya mezarları ve UNESCO listesindeki kentler.',
    lead: 'Likya, bugünkü Antalya’nın batısı ile Muğla’nın doğusu arasındaki dağlık kıyı bölgesinin antik adıdır. Kendine özgü dili, kayalara oyulmuş ev biçimli mezarları ve antik dünyanın ilk federal yönetimlerinden biri olarak anılan Likya Birliği ile Likya, Anadolu’nun en özgün kültürlerinden birini oluşturur.',
    sections: [
      ['Likyalılar ve Likya dili', [
        'Likyalılar, Luvi kökenli bir dil konuşan yerli bir Anadolu halkıdır. Likya dili, kendine özgü bir alfabeyle yazılmıştır; yazıtların bir kısmı Grekçe ile birlikte iki dilli olduğu için dilin çözülmesi kolaylaşmıştır.',
      ]],
      ['Likya Birliği', [
        'Hellenistik ve Roma dönemlerinde Likya kentleri, Likya Birliği adı verilen bir siyasi yapı içinde bir araya gelmiştir. Kentler, büyüklüklerine göre birlik meclisinde farklı sayıda oy hakkına sahipti.',
        'Bu yapı, sonraki yüzyıllarda temsilî ve federal yönetim modelleri üzerine yapılan tartışmalarda örnek olarak anılmıştır. Patara’daki meclis binası (bouleuterion), birliğin toplantı yeri olarak restore edilmiştir.',
      ]],
      ['Kaya mezarları ve lahitler', [
        'Likya’nın en karakteristik eserleri, kayalara oyulmuş ve ahşap evleri taklit eden mezar cepheleridir. Tapınak cepheli mezarlar, yüksek kaideler üzerine yerleştirilmiş lahitler ve dikme mezarlar da bölgede yaygındır.',
        'Myra (Demre), Tlos, Pınara ve Kaunos çevresindeki kaya mezarları en etkileyici örneklerdendir. Bu mezarlar kültür varlığıdır; üzerlerine çıkmak, yazı yazmak ya da parça almak yasaktır.',
      ]],
      ['Ksanthos ve Letoon', [
        'Likya’nın en önemli kenti sayılan Ksanthos ile yakınındaki Letoon kutsal alanı, 1988’de UNESCO Dünya Mirası Listesi’ne alınmıştır. Ksanthos’taki yazıtlı dikme, bilinen en uzun Likçe yazıtı taşır.',
        'Ksanthos’tan 19. yüzyılda çıkarılan Nereidler Anıtı gibi bazı eserler bugün yurt dışındaki müzelerde bulunmaktadır.',
      ]],
      ['Myra ve Aziz Nikolaos', [
        'Demre’deki antik Myra kenti, kaya mezarları ve tiyatrosuyla ünlüdür. Kentte 4. yüzyılda piskoposluk yapan Aziz Nikolaos adına yapılan kilise, önemli bir ziyaret yeridir. Aziz Nikolaos, Noel Baba figürünün tarihî kökenlerinden biri olarak kabul edilir.',
      ]],
      ['Likya Yolu', [
        'Fethiye ile Antalya arasında yaklaşık 500 kilometreyi aşan Likya Yolu, antik kentlerden ve kıyı köylerinden geçen işaretli bir yürüyüş rotasıdır. Rota üzerinde birçok ören yeri ziyaret edilebilir.',
      ]],
    ],
    faq: [
      ['Likya bugün hangi illerde kalıyor?', 'Antik Likya, bugünkü Antalya’nın batı kesimi ile Muğla’nın Fethiye ve çevresini kapsar.'],
      ['Likya kaya mezarları neden ev biçimindedir?', 'Mezarlar, Likyalıların ahşap evlerini taşta taklit eder. Bu, ölülerin de bir “ev”de yaşamaya devam ettiği inancıyla ilişkilendirilir.'],
    ],
  },
  {
    id: 'kapadokya',
    title: 'Kapadokya: peri bacaları, kaya kiliseleri ve yeraltı şehirleri',
    short: 'Kapadokya’nın kaya yerleşimleri, freskli kiliseleri ve yeraltı şehirleri.',
    lead: 'Kapadokya, Nevşehir, Kayseri, Aksaray, Niğde ve Kırşehir illerine yayılan, volkanik tüf kayalardan oluşan eşsiz bir coğrafyadır. Doğanın binlerce yılda biçimlendirdiği peri bacaları, insanların bu yumuşak kayalara oyduğu evler, kiliseler ve yeraltı şehirleri bölgeyi dünyanın en özel yerlerinden biri yapar.',
    sections: [
      ['Peri bacaları nasıl oluştu?', [
        'Milyonlarca yıl önce Erciyes, Hasan ve Göllü dağlarından püsküren volkanik küller bölgeyi kalın bir tüf tabakasıyla örttü. Yağmur, rüzgâr ve sıcaklık farkları yumuşak tüfü aşındırırken üstteki daha sert kaya parçaları alttaki tüfü korudu. Böylece başlıklı, sivri kaya kuleleri, yani peri bacaları oluştu.',
      ]],
      ['Kaya yerleşimleri ve kiliseler', [
        'Yumuşak tüf kolayca oyulabildiği için bölgede insanlar binlerce yıl boyunca kayalara evler, ambarlar ve güvercinlikler oymuştur. Bizans döneminde bölge önemli bir manastır ve kilise merkezi hâline gelmiştir.',
        'Göreme Açık Hava Müzesi’ndeki Karanlık Kilise ve Tokalı Kilise gibi yapılar, özellikle 10. ve 11. yüzyıllara tarihlenen renkli freskleriyle Bizans sanatının en önemli örnekleri arasındadır.',
        'Göreme Millî Parkı ve Kapadokya kaya yapıları, 1985’te UNESCO Dünya Mirası Listesi’ne alınmıştır.',
      ]],
      ['Yeraltı şehirleri', [
        'Derinkuyu ve Kaymaklı, Kapadokya’nın en bilinen yeraltı şehirleridir. Çok katlı bu yapılarda yaşam alanları, ahırlar, kilerler, şarap işlikleri ve havalandırma bacaları bulunur. Girişler, büyük döner taş kapılarla kapatılabiliyordu.',
        'Yeraltı şehirlerinin ilk oyulduğu dönem kesin olarak bilinmemektedir; ancak özellikle Bizans döneminde akınlar sırasında sığınak olarak kullanıldıkları kabul edilir.',
      ]],
      ['Adın kökeni', [
        'Yaygın bir yoruma göre “Kapadokya” adı, Pers dönemindeki “Katpatuka” adından gelir ve “güzel atlar ülkesi” anlamına gelir. Bu etimoloji popüler olsa da dilbilimciler arasında farklı görüşler de bulunmaktadır.',
      ]],
      ['Gezerken dikkat edilmesi gerekenler', [
        'Freskler ve kaya yapıları çok hassastır. Flaşlı fotoğraf çekmemek, duvarlara dokunmamak ve yalnızca izin verilen alanlara girmek bu mirasın korunması için önemlidir.',
        'Nevşehir, Kayseri, Aksaray ve Niğde müzeleri bölgeden çıkan eserleri sergiler.',
      ]],
    ],
    faq: [
      ['Kapadokya hangi illeri kapsar?', 'Kapadokya bölgesi genellikle Nevşehir merkezli olarak tanımlanır; Kayseri, Aksaray, Niğde ve Kırşehir’in bir bölümünü de kapsar.'],
      ['Yeraltı şehirleri neden yapıldı?', 'Yeraltı şehirleri başta saldırılar sırasında sığınmak olmak üzere ürünlerin saklanması ve iklim koşullarından korunma amacıyla kullanılmıştır.'],
    ],
  },
  {
    id: 'urartu',
    title: 'Urartular: Doğu Anadolu’nun kale krallığı',
    short: 'Urartu uygarlığı, Van Kalesi, sulama kanalları ve bronz işçiliği.',
    lead: 'Urartu Krallığı, yaklaşık MÖ 9. yüzyıldan MÖ 6. yüzyıla kadar Van Gölü çevresini merkez alan güçlü bir devletti. Dağlık bir coğrafyada kurdukları kaleler, kayalara işlenmiş yazıtları, gelişmiş sulama sistemleri ve usta bronz işçilikleriyle Urartular, Doğu Anadolu’nun en önemli antik uygarlıklarından biridir.',
    sections: [
      ['Başkent Tuşpa ve Van Kalesi', [
        'Urartu başkenti Tuşpa, bugünkü Van Kalesi’nin bulunduğu kayalık üzerinde yer alır. Kalenin kaya yüzeylerine oyulmuş mezar odaları ve Urartu krallarının çivi yazılı yazıtları bulunur.',
        'Urartular, Asur çivi yazısını kendi dillerine uyarlamıştır. Urartu dili, Hurri diliyle akraba kabul edilir.',
      ]],
      ['Kaleler ve yerleşimler', [
        'Urartular, sarp tepeler üzerine büyük kaleler inşa etmiştir. Çavuştepe, Ayanis ve Toprakkale bu kalelerin bilinen örnekleridir. Kalelerde tapınaklar, depolar ve dev küplerle dolu ambarlar bulunur.',
        'Urartu tapınakları genellikle kare planlıdır ve krallığın baş tanrısı Haldi’ye adanmıştır.',
      ]],
      ['Sulama kanalları', [
        'Urartuların mühendislik başarılarının en dikkat çekicilerinden biri, Kral Menua döneminde yapıldığı kabul edilen ve halk arasında Şamram Kanalı olarak bilinen su kanalıdır. Uzun bir mesafe boyunca suyu taşıyan bu kanalın bazı bölümlerinin günümüzde bile kullanıldığı belirtilir.',
        'Barajlar, göletler ve kanallar, Urartuların zorlu iklimde tarım yapabilmelerini sağlamıştır.',
      ]],
      ['Urartu sanatı', [
        'Urartular bronz işçiliğinde çok ustaydı. Süslü kemerler, kalkanlar, miğferler, at koşum takımları ve kazanlar bu ustalığın örnekleridir. Kazan kulplarında kullanılan boğa ve kuş başlı figürler Urartu sanatının tanınmış motiflerindendir.',
        'Urartu eserlerinin bir kısmı geçmişte kaçak kazılarla yurt dışına çıkarılmıştır. Bu durum, kültür varlıklarının korunmasının önemini bir kez daha gösterir.',
      ]],
      ['Urartu’yu nerede görebilirsiniz?', [
        'Van Müzesi, Urartu eserlerinin en zengin koleksiyonlarından birine sahiptir. Ankara’daki Anadolu Medeniyetleri Müzesi de önemli Urartu eserlerini sergiler. Van Kalesi ve Çavuştepe ören yerleri ziyaret edilebilir.',
      ]],
    ],
    faq: [
      ['Urartu Krallığı nasıl sona erdi?', 'Krallık yaklaşık MÖ 6. yüzyılda zayıfladı ve bölge Med ve ardından Pers egemenliğine girdi. Yıkılışın ayrıntıları hâlâ araştırılmaktadır.'],
      ['Urartular hangi dili konuşuyordu?', 'Urartular, Hurri diliyle akraba kabul edilen Urartuca konuşuyordu ve bu dili Asur çivi yazısının uyarlanmış bir biçimiyle yazıyordu.'],
    ],
  },
  {
    id: 'kommagene',
    title: 'Kommagene Krallığı ve Nemrut Dağı',
    short: 'Nemrut Dağı’nın dev heykelleri ve Kommagene Krallığı’nın tarihi.',
    lead: 'Kommagene, Fırat Nehri’nin batısında, bugünkü Adıyaman çevresinde kurulmuş küçük ama etkileyici bir krallıktır. Krallığın en tanınmış anıtı, Nemrut Dağı’nın zirvesindeki tümülüs ve dev heykellerdir. Doğu ile Batı kültürlerini bir araya getiren Kommagene sanatı, Anadolu’nun en özgün örneklerinden birini oluşturur.',
    sections: [
      ['Kommagene Krallığı', [
        'Kommagene, Hellenistik dönemde Seleukos Krallığı’nın zayıflamasının ardından bağımsızlığını kazanan bir krallıktır. Kraliyet ailesi, soyunu hem Pers krallarına hem de Büyük İskender’in ardıllarına bağlıyordu. Krallık, MS 1. yüzyılda Roma İmparatorluğu’na katılmıştır.',
        'En ünlü kralı I. Antiokhos, MÖ 1. yüzyılda hüküm sürmüş ve krallığın anıtsal yapılarının büyük bölümünü yaptırmıştır.',
      ]],
      ['Nemrut Dağı', [
        'Nemrut Dağı’nın zirvesinde, I. Antiokhos için yapılmış büyük bir tümülüs bulunur. Tümülüsün doğu ve batı teraslarında, tanrıları ve kralı temsil eden dev heykeller yer alır. Zamanla depremler nedeniyle yere düşen heykel başları, bugün terasların önünde dizili olarak görülür.',
        'Heykellerde Pers ve Yunan tanrılarının birleştirildiği karma figürler görülür; örneğin Zeus-Oromasdes ve Apollon-Mithras gibi. Bu durum, Kommagene’nin iki kültür arasında köprü olma düşüncesini yansıtır.',
        'Nemrut Dağı, 1987’de UNESCO Dünya Mirası Listesi’ne alınmıştır. Gün doğumu ve gün batımında yapılan ziyaretler özellikle popülerdir.',
      ]],
      ['Arsameia ve diğer anıtlar', [
        'Kâhta yakınlarındaki Arsameia, krallığın önemli merkezlerinden biridir. Burada bulunan uzun Grekçe yazıt ve kral ile Herakles’in tokalaşmasını gösteren kabartma, Kommagene’nin en dikkat çekici eserlerindendir.',
        'Bölgede Roma dönemine ait Cendere Köprüsü ve Karakuş Tümülüsü de ziyaret edilebilecek önemli yapılardır.',
      ]],
      ['Kommagene’yi nerede görebilirsiniz?', [
        'Adıyaman Müzesi, bölgeden çıkan eserleri sergiler. Nemrut Dağı Millî Parkı içindeki alanlar, belirlenmiş yürüyüş yolları üzerinden ziyaret edilebilir.',
      ]],
    ],
    faq: [
      ['Nemrut Dağı’ndaki heykellerin başları neden yerde?', 'Heykellerin başları, yüzyıllar içinde yaşanan depremler ve doğal etkenler nedeniyle gövdelerinden ayrılarak yere düşmüştür.'],
      ['Kommagene Krallığı ne zaman sona erdi?', 'Krallık MS 1. yüzyılda Roma İmparatorluğu’na bağlanarak bağımsızlığını yitirmiştir.'],
    ],
  },
];

// Ek bölümler: yazıları derinleştirmek için (keşif tarihi, günlük hayat, sık yapılan hatalar).
const EXTRA = {
  'define-efsaneleri-ve-gercekler': [
    ['Sık anlatılan hikâyeler ve açıklamaları', [
      '“Küp dolusu altın” anlatıları genellikle tarihî gömülerin abartılmış hâlidir. Bilimsel kazılarda bulunan saklama buluntuları çoğunlukla bir avuç bronz sikke, birkaç takı ya da günlük eşyadan oluşur.',
      '“Ağaca çakılmış çivi” ya da “kayaya kazınmış ok” gibi işaretlerin önemli bir kısmı yakın dönemde çobanlar, avcılar ya da harita çalışmaları yapan ekipler tarafından bırakılmıştır. Bazı işaretler ise bizzat definecilerin birbirini yanıltmak için yaptığı izlerdir.',
      'Kuyular, sarnıçlar ve su kanalları çoğu zaman “gizli geçit” olarak yorumlanır. Oysa bu yapılar antik yerleşimlerin su ihtiyacını karşılayan mühendislik eserleridir ve bilimsel açıdan çok değerlidir.',
    ]],
    ['Dolandırıcılık senaryolarına dikkat', [
      'Define konusu, dolandırıcıların en çok kullandığı konulardan biridir. “Elimizde eski bir harita var, kazı masrafına ortak ol”, “bulduğumuz altınları bozdurmak için önce para lazım”, “cin çıkarmak için hoca tutmalıyız” gibi teklifler çok yaygındır.',
      'Bu tekliflerin ortak özelliği, önce sizden para istenmesi ve her şeyin gizlilik içinde yapılmasıdır. Böyle bir teklifle karşılaşırsanız para vermeyin ve durumu kolluk birimlerine bildirin.',
    ]],
  ],
  'tumulus-nedir': [
    ['Höyük ile tümülüs arasındaki fark', [
      'Höyük, aynı yerde yüzyıllar boyunca kurulan yerleşimlerin kalıntılarının üst üste birikmesiyle oluşan bir tepedir. İçinde ev duvarları, ocaklar, çöp çukurları ve farklı dönemlere ait katmanlar bulunur.',
      'Tümülüs ise tek bir amaç için, bir ya da birkaç kişinin mezarını örtmek için bilinçli olarak yığılmış bir tepedir. Höyükler genellikle daha geniş ve yassı, tümülüsler ise daha düzgün ve konik görünür; ancak dışarıdan bakarak ayırt etmek her zaman kolay değildir.',
    ]],
    ['Bir tümülüs bilimsel olarak nasıl incelenir?', [
      'Arkeologlar bir tümülüsü incelemeden önce jeofizik yöntemlerle, yani yer radarı ve manyetik ölçümlerle tepenin iç yapısını anlamaya çalışır. Böylece mezar odasının yeri kazı yapılmadan tahmin edilebilir.',
      'Kazı yapılacaksa bu iş Kültür ve Turizm Bakanlığı izniyle, uzman bir ekip tarafından ve her katman belgelenerek yürütülür. Mezar odasından çıkan ahşap, kemik ve organik kalıntılar laboratuvarda incelenerek tarihlenir. Bu süreç yıllar sürebilir ve sonuçları bilim dünyasıyla paylaşılır.',
    ]],
  ],
  'patina-nedir': [
    ['Demir ve kurşun eserler', [
      'Demir eserler toprakta hızla paslanır ve çoğu zaman şekli zor seçilen, kabarık bir pas kütlesine dönüşür. Bu kütlenin içinde eserin özgün biçimi korunmuş olabilir; konservatörler röntgen görüntüleriyle bu biçimi ortaya çıkarır.',
      'Kurşun eserler beyazımsı bir tabakayla kaplanır. Kurşun zehirli bir metal olduğu için bu tür eserlere çıplak elle uzun süre dokunulmamalıdır.',
    ]],
  ],
  'sahte-eser-nasil-anlasilir': [
    ['Hediyelik eşya ile sahte eser arasındaki fark', [
      'Müze dükkânlarında ve turistik bölgelerde satılan replikalar, yani kopyalar, sahte eser sayılmaz; bunlar açıkça kopya olarak satılır ve çoğu zaman üzerlerinde bunu belirten bir işaret bulunur.',
      'Sorun, bu kopyaların eskitilerek “antik” diye satılmasıyla başlar. Bir eseri satın alırken satıcının onu nasıl tanımladığına ve belge sunup sunmadığına dikkat edin.',
    ]],
  ],
  'seramik-nasil-tarihlenir': [
    ['Yüzey araştırmalarında seramiğin rolü', [
      'Arkeologlar bir bölgede kazı yapmadan önce yüzey araştırması yapar; tarlalarda ve yamaçlarda yüzeye çıkmış seramik parçalarını belgeleyerek hangi dönemlerde yerleşim olduğunu belirler.',
      'Bu nedenle yüzeydeki parçaların toplanması, bir bölgenin geçmişine dair bilgilerin kaybolmasına yol açar. Gördüğünüz parçaları yerinde bırakmak ve dikkat çekici bir yoğunluk fark ederseniz müzeye haber vermek en doğrusudur.',
    ]],
  ],
  'anadolu-arkeolojik-donemler': [
    ['Dönemler nasıl belirlenir?', [
      'Arkeolojik dönemler, kazılarda ortaya çıkan katmanların ve buluntuların karşılaştırılmasıyla belirlenir. Radyokarbon (karbon-14) yöntemi organik kalıntıların yaşını ölçerken, ağaç halkası yöntemi (dendrokronoloji) ahşap kalıntıları yıl düzeyinde tarihleyebilir.',
      'Yazılı belgelerin bulunduğu dönemlerde ise kral listeleri, antlaşmalar ve sikkeler kronolojiyi daha kesin hâle getirir. Yine de dönemlerin başlangıç ve bitiş tarihleri yeni buluntularla zaman zaman yeniden değerlendirilir.',
    ]],
  ],
  'hitit': [
    ['Keşif ve araştırma tarihi', [
      'Hattuşa kalıntıları 1834’te Fransız gezgin Charles Texier tarafından Avrupa’ya tanıtıldı. 20. yüzyılın başında Hugo Winckler ve Osmanlı arkeoloğu Theodor Makridi’nin çalışmalarıyla tablet arşivleri bulundu. Kazılar, Alman Arkeoloji Enstitüsü tarafından bugün de sürdürülmektedir.',
      'Bu çalışmalar, uzun süre yalnızca Eski Ahit’teki kısa anlatımlardan bilinen Hititlerin gerçekte büyük bir imparatorluk olduğunu ortaya koydu.',
    ]],
    ['Günlük hayat ve hukuk', [
      'Hitit toplumunun ekonomisi tarıma ve hayvancılığa dayanıyordu; buğday, arpa, üzüm ve zeytin önemli ürünlerdi. Devlet depolarında büyük tahıl ambarları bulunmuştur.',
      'Hitit kanunları, birçok suç için ağır bedensel cezalar yerine tazminat ödenmesini öngörür. Bu yönüyle Hitit hukuku, dönemin diğer hukuk sistemlerine göre dikkat çekici özellikler taşır.',
    ]],
  ],
  'frigya': [
    ['Keşif ve araştırma tarihi', [
      'Gordion’daki ilk kazılar 1900’de Alman Körte kardeşler tarafından yapıldı. 1950’den itibaren Pennsylvania Üniversitesi Müzesi’nin uzun soluklu kazıları başladı; büyük tümülüsün mezar odası bu dönemde açıldı.',
      'Mezar odasında bulunan kakmalı ahşap mobilyalar, tunç kaplar ve ölü yemeği kalıntıları, Frig sarayının yaşamına ışık tutan benzersiz buluntulardır.',
    ]],
    ['Günlük hayat ve ekonomi', [
      'Frigler tarım ve hayvancılıkla geçiniyordu. Dokumacılık, ahşap oymacılığı ve maden işçiliğinde ustalaşmışlardı. Gordion’da bulunan çok sayıda dokuma tezgâhı ağırlığı, dokumacılığın önemini gösterir.',
    ]],
  ],
  'lidya': [
    ['Keşif ve araştırma tarihi', [
      'Sardes’teki ilk sistematik kazılar 1910–1914 yılları arasında Princeton Üniversitesi’nden Howard Crosby Butler yönetiminde yapıldı. 1958’den beri Harvard ve Cornell üniversitelerinin yürüttüğü kazılar sürmektedir.',
      'Kazılarda bulunan altın arıtma atölyesi, Lidyalıların elektronu altın ve gümüşe nasıl ayırdığını anlamamızı sağlamıştır.',
    ]],
    ['Ticaret ve günlük hayat', [
      'Herodotos, Lidyalıları ilk perakende tüccarlar olarak anar. Sikkenin ortaya çıkışı, küçük ölçekli ticareti kolaylaştırarak pazar yerlerinin gelişmesine katkıda bulunmuştur.',
      'Lidyalılar ayrıca müzik, oyunlar ve parfüm gibi lüks ürünlerle de tanınıyordu. Antik yazarlar, Lidya’nın zenginliğini ve şatafatını sık sık anlatır.',
    ]],
  ],
  'karya': [
    ['Keşif ve araştırma tarihi', [
      'Halikarnassos Mozolesi’nin yeri 1856–1857’de İngiliz arkeolog Charles Newton tarafından yapılan kazılarla belirlendi. Bu kazılarda bulunan heykellerin bir kısmı bugün British Museum’da sergilenmektedir.',
      'Mozolenin yeri bugün Bodrum’da açık hava müzesi olarak ziyaret edilebilir. Alanda anıtın temelleri ve mimari parçaları görülür.',
    ]],
    ['Ekonomi ve kültür', [
      'Karya kentleri denizcilik, ticaret, zeytincilik ve mermer işçiliğiyle gelişti. Afrodisias, Roma döneminde ünlü bir heykel okulunun merkezi oldu; buradaki heykeltıraşların eserleri imparatorluğun farklı yerlerine gönderildi.',
    ]],
  ],
  'likya': [
    ['Keşif ve araştırma tarihi', [
      '1830’lu ve 1840’lı yıllarda İngiliz gezgin Charles Fellows Likya kentlerini Avrupa’ya tanıttı. Ksanthos’taki pek çok anıtsal eser bu dönemde İngiltere’ye götürüldü.',
      'Günümüzde Ksanthos, Patara, Tlos ve Myra gibi kentlerde Türk ve yabancı ekiplerin kazı ve restorasyon çalışmaları sürmektedir.',
    ]],
    ['Ekonomi ve günlük hayat', [
      'Likya’nın dağlık yapısı tarımı sınırlıyordu; buna karşın sedir ve çam ormanları kereste ticaretini, uzun kıyı şeridi de denizciliği geliştirdi. Myra’nın limanı Andriake’deki büyük tahıl ambarı, bölgenin Roma dönemindeki ticari önemini gösterir.',
    ]],
  ],
  'kapadokya': [
    ['Kültepe ve yazının Anadolu’ya gelişi', [
      'Kapadokya bölgesinde, Kayseri yakınlarındaki Kültepe (antik Kaniş), Anadolu tarihinin dönüm noktalarından biridir. Yaklaşık MÖ 20. ve 18. yüzyıllar arasında Asurlu tüccarların burada kurduğu ticaret kolonisinde bulunan binlerce çivi yazılı tablet, Anadolu’daki ilk yazılı belgeler arasındadır.',
      'Bu tabletler; kalay ve kumaş ticaretini, kredi ilişkilerini, aile mektuplarını ve hukuki anlaşmazlıkları anlatır.',
    ]],
    ['Güvercinlikler ve kırsal yaşam', [
      'Kapadokya’daki kayalara oyulmuş güvercinlikler, güvercin gübresinin bağ ve bahçelerde kullanılması için yapılmıştır. Bu gübre, volkanik toprağın verimini artırmıştır.',
      'Bölgede bağcılık ve şarap üretimi çok eskilere uzanan bir gelenektir; kayalara oyulmuş şarap işlikleri bu geleneğin izlerini taşır.',
    ]],
  ],
  'urartu': [
    ['Keşif ve araştırma tarihi', [
      'Van Kalesi’ndeki Urartu yazıtları 1827’de Alman araştırmacı Friedrich Eduard Schulz tarafından kopyalandı. 19. yüzyılın sonunda Toprakkale’de yapılan kazılardan çıkan eserlerin bir kısmı Avrupa müzelerine gitti.',
      'Ayanis Kalesi’nde 1989’dan itibaren yürütülen kazılar, iyi korunmuş tapınağı ve duvar süslemeleriyle Urartu sanatı hakkındaki bilgileri önemli ölçüde artırdı.',
    ]],
    ['Ekonomi ve günlük hayat', [
      'Urartu ekonomisi tarım, hayvancılık ve maden işçiliğine dayanıyordu. Kalelerdeki dev küpler, tahıl ve şarabın depolanmasında kullanılıyordu. Yazıtlarda bağ ve bahçe kurulduğundan sık sık söz edilir.',
      'At yetiştiriciliği de önemliydi; Urartu atları komşu krallıklarda da değer görüyordu.',
    ]],
  ],
  'kommagene': [
    ['Keşif ve araştırma tarihi', [
      'Nemrut Dağı’ndaki heykeller 1881’de Alman mühendis Karl Sester tarafından fark edildi. 1883’te Osman Hamdi Bey ve Osgan Efendi bölgede inceleme yaparak anıtı belgeledi.',
      '1950’li ve 1960’lı yıllarda Amerikalı arkeolog Theresa Goell’ün yürüttüğü çalışmalar, tümülüsün yapısı ve heykeller hakkında ayrıntılı bilgiler ortaya koydu. Alan bugün de koruma ve araştırma çalışmalarının odağındadır.',
    ]],
    ['Kral Antiokhos’un kült yasası', [
      'I. Antiokhos, Nemrut Dağı ve Arsameia’daki uzun Grekçe yazıtlarda, kendi adına düzenlenecek törenlerin nasıl yapılacağını ayrıntılı biçimde anlatmıştır. Bu yazıtlar, Hellenistik dönemde kral kültlerinin nasıl örgütlendiğini gösteren önemli belgelerdir.',
    ]],
  ],
};
for (const g of [...GUIDES, ...REGIONS]) {
  const extra = EXTRA[g.id];
  if (extra) g.sections.push(...extra);
}
