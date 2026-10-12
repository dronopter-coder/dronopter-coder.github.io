import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * app.json'u temel alır; Worker adresi DEFINECILER_API_URL ortam değişkeniyle verilir.
 * GitHub Actions bunu Worker'ı yayınladıktan sonra otomatik ayarlar. Yerelde:
 *   DEFINECILER_API_URL=http://192.168.1.20:8787 npx expo start
 *
 * Karşılaştırma (A/B) derlemeleri için ANDROID_PACKAGE ve APP_NAME ortam değişkenleri paket adını
 * ve uygulama adını değiştirir; böylece iki sürüm aynı telefonda yan yana kurulabilir.
 */
export default ({ config }: ConfigContext): ExpoConfig => {
  const pkg = process.env.ANDROID_PACKAGE;
  // Play Store paketlerinde her yüklemede artan sürüm kodu (GitHub çalıştırma numarası)
  const versionCode = Number(process.env.ANDROID_VERSION_CODE) || undefined;
  return {
    ...(config as ExpoConfig),
    name: process.env.APP_NAME || config.name || 'Defineciler',
    slug: config.slug ?? 'defineciler',
    android: { ...config.android, ...(pkg ? { package: pkg } : {}), ...(versionCode ? { versionCode } : {}) },
    ios: { ...config.ios, ...(pkg ? { bundleIdentifier: pkg } : {}) },
    extra: {
      ...config.extra,
      apiUrl: process.env.DEFINECILER_API_URL || config.extra?.apiUrl,
      // Virgülle ayrılmış ek/yedek adresler: DEFINECILER_API_URLS="https://api.alanadi.com,https://x.workers.dev"
      // RevenueCat Android genel (public) SDK anahtarı; yoksa Pro satın alma kapalıdır.
      revenuecatKey: process.env.REVENUECAT_ANDROID_KEY || config.extra?.revenuecatKey || '',
      apiUrls: (process.env.DEFINECILER_API_URLS ?? '')
        .split(',')
        .map((u: string) => u.trim())
        .filter(Boolean),
    },
  };
};
