import Constants from 'expo-constants';

type Extra = {
  apiUrl?: string;
  appKey?: string;
  dailyFreeScans?: number;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

/** Cloudflare Worker adresi (sonunda / olmadan). app.json → expo.extra.apiUrl */
export const API_URL = (extra.apiUrl ?? '').replace(/\/+$/, '');

/** Worker'a gönderilen basit uygulama anahtarı (gizli değildir, sadece rastgele istekleri eler). */
export const APP_KEY = extra.appKey ?? '';

/** Günlük ücretsiz analiz hakkı. */
export const DAILY_FREE_SCANS = extra.dailyFreeScans ?? 3;

export const APP_NAME = 'Defineciler';
export const PRIVACY_URL = 'https://dronopter-coder.github.io/privacy.html';
export const CONTACT_EMAIL = 'dronopter@gmail.com';
