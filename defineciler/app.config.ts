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
  return {
    ...(config as ExpoConfig),
    name: process.env.APP_NAME || config.name || 'Defineciler',
    slug: config.slug ?? 'defineciler',
    android: { ...config.android, ...(pkg ? { package: pkg } : {}) },
    ios: { ...config.ios, ...(pkg ? { bundleIdentifier: pkg } : {}) },
    extra: {
      ...config.extra,
      apiUrl: process.env.DEFINECILER_API_URL || config.extra?.apiUrl,
      // Virgülle ayrılmış ek/yedek adresler: DEFINECILER_API_URLS="https://api.alanadi.com,https://x.workers.dev"
      apiUrls: (process.env.DEFINECILER_API_URLS ?? '')
        .split(',')
        .map((u: string) => u.trim())
        .filter(Boolean),
    },
  };
};
