// Expo prebuild'in ürettiği android/app/build.gradle'a yükleme anahtarıyla imzalama ekler.
// Anahtar bilgileri ortam değişkenlerinden okunur (GitHub secret'ları); dosyaya şifre yazılmaz.
// Kullanım (defineciler klasöründe): node ../.github/scripts/android-signing.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const path = 'android/app/build.gradle';
let gradle = readFileSync(path, 'utf8');
if (gradle.includes('signingConfigs.upload')) process.exit(0);

const upload = `
        upload {
            storeFile file(System.getenv("ANDROID_UPLOAD_KEYSTORE_FILE"))
            storePassword System.getenv("ANDROID_UPLOAD_KEYSTORE_PASSWORD")
            keyAlias System.getenv("ANDROID_UPLOAD_KEY_ALIAS")
            keyPassword System.getenv("ANDROID_UPLOAD_KEY_PASSWORD")
        }`;
const before = gradle;
gradle = gradle.replace(/signingConfigs\s*\{/, (m) => m + upload);
// release derlemesi debug yerine yükleme anahtarıyla imzalansın
gradle = gradle.replace(/(release\s*\{[^}]*?)signingConfig\s+signingConfigs\.debug/s, '$1signingConfig signingConfigs.upload');
if (gradle === before || !gradle.includes('signingConfig signingConfigs.upload')) {
  console.error('build.gradle beklenen biçimde değil; imza ayarı eklenemedi.');
  process.exit(1);
}
writeFileSync(path, gradle);
console.log('Yükleme anahtarıyla imzalama eklendi.');
