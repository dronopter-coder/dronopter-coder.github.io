import Constants from 'expo-constants';

type Extra = {
  apiUrl?: string;
  /** Sunucu adresleri (sırayla tercih edilir); biri engelliyse çalışan seçilir. */
  apiUrls?: string[];
  appKey?: string;
  dailyFreeScans?: number;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

const clean = (u: string) => u.trim().replace(/\/+$/, '');

/** Sunucu adresleri (sonunda / olmadan). Birden fazla varsa uygulama ilk yanıt vereni kullanır. */
export const API_URLS: string[] = [...new Set([...(extra.apiUrls ?? []), extra.apiUrl ?? ''].map(clean).filter(Boolean))];

/** İlk (tercih edilen) sunucu adresi. */
export const API_URL = API_URLS[0] ?? '';

/** Worker'a gönderilen basit uygulama anahtarı (gizli değildir, sadece rastgele istekleri eler). */
export const APP_KEY = extra.appKey ?? '';

/** Günlük ücretsiz analiz hakkı. */
export const DAILY_FREE_SCANS = extra.dailyFreeScans ?? 2;

export const APP_NAME = 'Defineciler';
export const PRIVACY_URL = 'https://dronopter-coder.github.io/privacy.html';
export const CONTACT_EMAIL = 'dronopter@gmail.com';

/** Play Store adresi (paket adı app.json → android.package ile aynı olmalı). */
export const APP_SHARE_URL = 'https://play.google.com/store/apps/details?id=com.defineciler.app';
export const APP_SHARE_MESSAGE = `Defineciler — elindeki tarihi eseri fotoğrafla tanı; dönemini, uygarlığını ve hikâyesini öğren.\n${APP_SHARE_URL}`;
