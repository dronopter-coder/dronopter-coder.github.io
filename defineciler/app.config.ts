import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * app.json'u temel alır; Worker adresi DEFINECILER_API_URL ortam değişkeniyle verilir.
 * GitHub Actions bunu Worker'ı yayınladıktan sonra otomatik ayarlar. Yerelde:
 *   DEFINECILER_API_URL=http://192.168.1.20:8787 npx expo start
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  extra: {
    ...config.extra,
    apiUrl: process.env.DEFINECILER_API_URL || config.extra?.apiUrl,
  },
});
