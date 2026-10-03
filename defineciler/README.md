# Defineciler

Yapay zeka destekli tarihi eser tanımlama uygulaması (Android). Kullanıcı eserin fotoğrafını çeker ya da galeriden seçer; Google Gemini eserin ne olduğunu, dönemini, uygarlığını, malzemesini, üzerindeki yazı ve sembolleri ve orijinallik ipuçlarını Türkçe olarak anlatır.

**Bölümler**

| Sekme | İçerik |
| --- | --- |
| **Tara** | Uygulamanın kalbi: fotoğraf çek / galeriden seç → not ekle → yapay zeka analizi → ayrıntılı sonuç ekranı |
| **Bölgeler** | Anadolu'nun tarihi yoğunluğu en yüksek 17 bölgesi: uygarlıklar, tipik buluntular, ören yerleri, müzeler (gerçek fotoğraflarla) |
| **Haberler** | Google Haberler, Arkeofili ve AA'dan güncel arkeoloji haberleri (doğrudan cihazdan okunur; olmazsa sunucudan) |
| **Rehber** | Sikke, seramik, kandil, mühür, takı, figürin, define işaretleri, sahte eser tespiti, yasal süreç, zaman çizelgesi |
| **Geçmiş** | Cihazda saklanan tarama geçmişi |

**Reklam yerleşimi (AdMob)**

| Tür | Nerede |
| --- | --- |
| Uyarlanabilir banner | Bölgeler, Haberler, Rehber, Geçmiş sekmelerinin altı |
| Orta dikdörtgen (300×250) | Sonuç ekranı, bölge ve rehber detay sayfalarının ortası |
| Geçiş reklamı (interstitial) | Analiz bittikten sonra, en fazla 2 analizde bir ve 90 sn aralıkla |
| Ödüllü reklam | Günlük 3 ücretsiz hak bitince "Reklam izle, +1 analiz hakkı" |

Avrupa kullanıcıları için Google UMP onay formu açılışta otomatik gösterilir.

## Mimari

```
Android uygulaması (Expo / React Native)
   │  fotoğraf (1280px JPEG, base64) + not
   ▼
Cloudflare Worker  (worker/)          ← GEMINI_API_KEY burada gizli durur
   │  /analyze → Gemini (JSON şemalı yanıt)
   │  /news    → RSS kaynakları (önbellekli)
   ▼
Google Gemini API
```

API anahtarı uygulamanın içine konmaz; APK açılsa bile anahtar çalınamaz. Worker ayrıca IP başına dakikalık (ve isteğe bağlı günlük) sınır uygular.

## 1. Sunucuyu yayınlama (GitHub üzerinden, terminal gerekmez)

GitHub Actions iş akışı her çalıştığında Worker'ı Cloudflare'e yayınlar, Gemini anahtarını sunucuya kaydeder ve APK'yı bu sunucu adresiyle derler. Sizin yapmanız gereken yalnızca iki anahtarı bir kez GitHub'a eklemek:

1. **Gemini API anahtarı:** [aistudio.google.com/apikey](https://aistudio.google.com/apikey) → *Create API key* → anahtarı kopyalayın.
2. **Cloudflare token:**
   - [dash.cloudflare.com](https://dash.cloudflare.com/sign-up) adresinde ücretsiz hesap açın.
   - Sol menüden bir kez **Workers & Pages** sayfasını açın (ücretsiz `*.workers.dev` alt alanınız oluşur).
   - Sağ üstte profil → **My Profile → API Tokens → Create Token** → **Edit Cloudflare Workers** şablonu → *Use template*.
   - *Account Resources*: kendi hesabınız; *Zone Resources*: *All zones* → *Continue to summary* → *Create Token* → token'ı kopyalayın.
3. **GitHub:** bu repo → **Settings → Secrets and variables → Actions → New repository secret**:
   - `GEMINI_API_KEY` = Gemini anahtarı
   - `CLOUDFLARE_API_TOKEN` = Cloudflare token'ı
4. **Actions** sekmesi → en son *Defineciler Android APK* çalışması → **Re-run all jobs**.

Çalışma bitince özet sayfasında sunucu adresi yazar; *Artifacts* bölümündeki `defineciler-apk` artık analiz yapabilen APK'dır.

Terminalden kurmak isterseniz: `cd worker && npm install && npx wrangler login && npx wrangler secret put GEMINI_API_KEY && npx wrangler deploy`; çıkan adresi `DEFINECILER_API_URL` ortam değişkeni (veya GitHub'da aynı adlı *repository variable*) olarak verin.

İsteğe bağlı günlük IP sınırı: `npx wrangler kv namespace create USAGE` komutunun verdiği id'yi `wrangler.jsonc` içindeki yorumlu `kv_namespaces` satırına ekleyin.

Model `wrangler.jsonc` → `GEMINI_MODEL` ile seçilir. Varsayılan `gemini-flash-latest` (Google'ın güncel Flash modeli).

> **Gizlilik notu:** Gemini API'nin ücretsiz katmanında Google, gönderilen içerikleri ürünlerini geliştirmek için kullanabilir. Yayına çıkarken AI Studio'da faturalandırmayı açmanız önerilir.

## 2. AdMob kimlikleri

Reklam birimleri `src/constants/ad-units.ts` dosyasındadır:

| Birim | Kimlik |
| --- | --- |
| Banner (`defineciler_banner`) | `ca-app-pub-3204109869365538/3849020679` |
| Geçiş (`defineciler_gecis`) | `ca-app-pub-3204109869365538/6287481758` |
| Ödüllü | henüz yok — AdMob'da *Ödüllü* birim açıp ekleyin; eklenene kadar "+1 hak" reklamsız verilir |

**Uygulama kimliği** (`ca-app-pub-3204109869365538~…`, AdMob → Uygulamalar → Uygulama ayarları) `app.json` → `react-native-google-mobile-ads` → `androidAppId` alanına yazılmalıdır; şu an Google'ın test kimliği duruyor ve gerçek reklamlar bu kimlik girilene kadar gösterilmez.

Geliştirme modunda otomatik olarak Google test reklamları gösterilir. `app-ads.txt` dosyası `dronopter-coder.github.io` sitesinde yayında; Play Store kaydında geliştirici web sitesi olarak `https://dronopter-coder.github.io` girin.

## Fotoğraflar

Bölge ve rehber kapak fotoğrafları Wikimedia Commons'tan `scripts/fetch-photos.mts` ile indirilip `assets/photos/` klasörüne gömülür (Actions'taki *photos* işi eksikleri indirip dala kaydeder). Her fotoğrafın yazarı ve lisansı `assets/photos/credits.json` dosyasında ve uygulamada fotoğrafın üzerinde gösterilir. Bir fotoğrafı değiştirmek için `src/data/places.ts` / `guide.ts` içindeki `photo` adaylarını düzenleyip `PHOTO_REFRESH=place:hitit` ile betiği yeniden çalıştırın.

## 3. APK / AAB üretme

**Seçenek A — GitHub Actions (kurulum gerektirmez):** `defineciler/` klasöründeki her değişiklikte "Defineciler Android APK" iş akışı çalışır ve test amaçlı (debug anahtarıyla imzalı) APK'yı *Artifacts* bölümüne koyar. Actions sekmesinden elle de başlatılabilir.

**Seçenek B — EAS Build (Play Store için önerilen):**

```bash
npm install
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview      # telefona kurulabilir APK
npx eas-cli@latest build -p android --profile production   # Play Store için AAB
```

EAS, Play Store yükleme anahtarını sizin için oluşturur ve saklar.

## Geliştirme

```bash
npm install
npx expo run:android          # bağlı cihaz/emülatörde geliştirme sürümü (AdMob nedeniyle Expo Go çalışmaz)
npx expo start --web          # tarayıcıda hızlı arayüz önizlemesi (reklam alanları yer tutucu)
npx tsc --noEmit && npx expo lint
```

Worker'ı API anahtarı olmadan denemek için örnek yanıt döndüren sahte mod:

```bash
cd worker && npm run dev:mock          # http://127.0.0.1:8787
DEFINECILER_API_URL=http://<bilgisayar-ip>:8787 npx expo start
npm test                               # worker birim testleri
```

İkonları yeniden üretmek: `node scripts/generate-icons.mjs` (kaynak: `assets/source/emblem.svg`).

## Proje yapısı

```
src/app/              ekranlar (expo-router)
  (tabs)/             Tara, Bölgeler, Haberler, Rehber, Geçmiş
  scan.tsx            fotoğraf önizleme + analiz
  result/[id].tsx     analiz sonucu
src/services/         api, ads, quota, news, wiki, picker
src/storage/          tarama geçmişi (AsyncStorage + dosya sistemi)
src/data/             bölge ve rehber içerikleri
worker/               Cloudflare Worker (Gemini + haberler)
```

## Yasal

Uygulama, kullanıcıları izinsiz kazıya yönlendirmez; her bölge sayfasında ve sonuç ekranında 2863 sayılı Kanun'a göre bildirim yükümlülüğü hatırlatılır. Yapay zekaya parasal değer biçmemesi ve gömü vaat etmemesi talimatı verilmiştir. Gizlilik politikası: https://dronopter-coder.github.io/privacy.html
