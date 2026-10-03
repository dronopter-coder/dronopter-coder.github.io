import { Platform } from 'react-native';

/**
 * AdMob reklam birimi kimlikleri.
 *
 * AdMob panelinde (https://admob.google.com) "Defineciler" uygulamasını oluşturup
 * aşağıdaki birimleri açın ve kimlikleri buraya yazın. Geliştirme (__DEV__) modunda
 * Google'ın resmi test reklamları kullanılır; gerçek reklama kendiniz tıklamayın.
 *
 * Yayıncı kimliği: pub-3204109869365538
 */
export const PRODUCTION_AD_UNITS = {
  /** Sekmelerin altındaki banner (defineciler_banner) */
  banner: 'ca-app-pub-3204109869365538/3849020679',
  /** Sonuç ve detay ekranlarındaki orta dikdörtgen; aynı banner birimi her boyutu sunar */
  resultBanner: 'ca-app-pub-3204109869365538/3849020679',
  /** Analiz bittikten sonra gösterilen geçiş reklamı (defineciler_gecis) */
  interstitial: 'ca-app-pub-3204109869365538/6287481758',
  /** "Reklam izle, +1 analiz hakkı kazan" ödüllü reklamı — AdMob'da "Ödüllü" birim açılınca buraya yazın */
  rewarded: 'ca-app-pub-3204109869365538/XXXXXXXXXX',
};

/** Geçiş reklamı en fazla kaç analizde bir gösterilsin. */
export const INTERSTITIAL_EVERY_N_SCANS = 2;

/** İki geçiş reklamı arasında en az geçmesi gereken süre (ms). */
export const INTERSTITIAL_MIN_INTERVAL_MS = 90_000;

export const isPlaceholder = (id: string) => id.includes('XXXXXXXXXX');

export const adsSupported = Platform.OS === 'android' || Platform.OS === 'ios';
