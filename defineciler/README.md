# Defineciler

Yapay zeka destekli tarihi eser tanımlama uygulaması (Android). Kullanıcı eserin fotoğrafını çeker ya da galeriden seçer; Google Gemini eserin ne olduğunu, dönemini, uygarlığını, malzemesini, üzerindeki yazı ve sembolleri ve orijinallik ipuçlarını Türkçe olarak anlatır.

**Bölümler**

| Sekme | İçerik |
| --- | --- |
| **Tara** | Uygulamanın kalbi: fotoğraf çek / galeriden seç → not ekle → yapay zeka analizi → ayrıntılı sonuç ekranı |
| **Bölgeler** | Anadolu'nun tarihi yoğunluğu en yüksek 17 bölgesi: uygarlıklar, tipik buluntular, ören yerleri, müzeler (Wikipedia görselleriyle) |
| **Haberler** | Google Haberler, Arkeofili ve AA'dan güncel arkeoloji haberleri (Worker'da toplanır, 30 dk önbelleklenir) |
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

## 1. Worker'ı yayınlama (bir kez)

1. [Google AI Studio](https://aistudio.google.com/apikey)'dan bir **Gemini API anahtarı** alın.
2. Ücretsiz bir [Cloudflare](https://dash.cloudflare.com/sign-up) hesabı açın.
3. Terminalde:

```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put GEMINI_API_KEY     # anahtarı yapıştırın
npx wrangler deploy
```

4. Çıktıdaki adresi (ör. `https://defineciler-api.KULLANICI.workers.dev`) `app.json` → `expo.extra.apiUrl` alanına yazın.

İsteğe bağlı günlük IP sınırı: `npx wrangler kv namespace create USAGE` komutunun verdiği id'yi `wrangler.jsonc` içindeki yorumlu `kv_namespaces` satırına ekleyip yeniden `deploy` edin.

Model `wrangler.jsonc` → `GEMINI_MODEL` ile seçilir. Varsayılan `gemini-flash-latest` (Google'ın güncel Flash modeli). Sabit bir sürüm için ör. `gemini-3.8-flash` yazabilirsiniz.

> **Gizlilik notu:** Gemini API'nin ücretsiz katmanında Google, gönderilen içerikleri ürünlerini geliştirmek için kullanabilir. Yayına çıkarken AI Studio'da faturalandırmayı açmanız önerilir (ücretli katmanda veriler bu amaçla kullanılmaz).

## 2. AdMob kimlikleri

1. [AdMob](https://admob.google.com)'da "Defineciler" adında bir Android uygulaması oluşturun.
2. Uygulama kimliğini (`ca-app-pub-3204109869365538~...`) `app.json` → `react-native-google-mobile-ads` → `androidAppId` alanına yazın. (Şu an Google'ın test kimliği duruyor.)
3. Dört reklam birimi oluşturun (Banner, Banner, Geçiş, Ödüllü) ve kimliklerini `src/constants/ad-units.ts` dosyasına yazın.

Geliştirme modunda ve kimlik girilmemişken otomatik olarak Google test reklamları gösterilir. `app-ads.txt` dosyası `dronopter-coder.github.io` sitesinde zaten yayında; Play Store kaydında geliştirici web sitesi olarak `https://dronopter-coder.github.io` girin.

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
