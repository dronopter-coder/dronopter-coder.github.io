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
export const DAILY_FREE_SCANS = extra.dailyFreeScans ?? 2;

export const APP_NAME = 'Defineciler';
export const PRIVACY_URL = 'https://dronopter-coder.github.io/privacy.html';
export const CONTACT_EMAIL = 'dronopter@gmail.com';

/** Play Store adresi (paket adı app.json → android.package ile aynı olmalı). Not: paket adı deneyi için geçici olarak eski kimliğe döndürüldü. */
export const APP_SHARE_URL = 'https://play.google.com/store/apps/details?id=com.dronopter.defineciler';
export const APP_SHARE_MESSAGE = `Defineciler — elindeki tarihi eseri fotoğrafla tanı; dönemini, uygarlığını ve hikâyesini öğren.\n${APP_SHARE_URL}`;
