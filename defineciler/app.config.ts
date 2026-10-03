import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * app.json'u temel alır; Worker adresi DEFINECILER_API_URL ortam değişkeniyle geçici olarak değiştirilebilir:
 *   DEFINECILER_API_URL=http://192.168.1.20:8787 npx expo start
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  extra: {
    ...config.extra,
    apiUrl: process.env.DEFINECILER_API_URL ?? config.extra?.apiUrl,
  },
});
