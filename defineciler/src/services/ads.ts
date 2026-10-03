import mobileAds, {
  AdEventType,
  AdsConsent,
  InterstitialAd,
  MaxAdContentRating,
  RewardedInterstitialAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

import {
  INTERSTITIAL_EVERY_N_SCANS,
  INTERSTITIAL_MIN_INTERVAL_MS,
  PRODUCTION_AD_UNITS,
  isPlaceholder,
} from '@/constants/ad-units';

const pick = (prod: string, test: string) => (__DEV__ || isPlaceholder(prod) ? test : prod);

export const AD_UNITS = {
  banner: pick(PRODUCTION_AD_UNITS.banner, TestIds.ADAPTIVE_BANNER),
  resultBanner: pick(PRODUCTION_AD_UNITS.resultBanner, TestIds.BANNER),
  interstitial: pick(PRODUCTION_AD_UNITS.interstitial, TestIds.INTERSTITIAL),
  rewarded: pick(PRODUCTION_AD_UNITS.rewarded, TestIds.REWARDED_INTERSTITIAL),
};

let canRequestAds = false;
let initPromise: Promise<void> | null = null;
let interstitial: InterstitialAd | null = null;
let rewarded: RewardedInterstitialAd | null = null;
let scansSinceInterstitial = 0;
let lastInterstitialAt = 0;

/** UMP (GDPR/KVKK) onayını toplar ve AdMob SDK'sını başlatır. Uygulama açılışında bir kez çağrılır. */
export function initAds(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        const info = await AdsConsent.gatherConsent();
        canRequestAds = info.canRequestAds;
      } catch {
        // Onay formu yüklenemezse (ör. ağ yok) önceki onay durumuna bak.
        try {
          canRequestAds = (await AdsConsent.getConsentInfo()).canRequestAds;
        } catch {
          canRequestAds = false;
        }
      }
      if (!canRequestAds) return;
      await mobileAds().setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.T,
      });
      await mobileAds().initialize();
      preloadInterstitial();
      preloadRewarded();
    })();
  }
  return initPromise;
}

export const adsReady = () => canRequestAds;

function preloadInterstitial() {
  if (!canRequestAds) return;
  interstitial?.removeAllListeners();
  interstitial = InterstitialAd.createForAdRequest(AD_UNITS.interstitial);
  interstitial.addAdEventListener(AdEventType.CLOSED, () => preloadInterstitial());
  interstitial.load();
}

function preloadRewarded() {
  if (!canRequestAds) return;
  rewarded?.removeAllListeners();
  rewarded = RewardedInterstitialAd.createForAdRequest(AD_UNITS.rewarded);
  rewarded.load();
}

/**
 * Bir analiz tamamlandığında çağrılır. Sıklık sınırına uyuyorsa geçiş reklamını gösterir
 * ve reklam kapanınca çözülür (reklam yoksa hemen çözülür).
 */
export async function maybeShowInterstitial(): Promise<void> {
  scansSinceInterstitial += 1;
  const due =
    scansSinceInterstitial >= INTERSTITIAL_EVERY_N_SCANS && Date.now() - lastInterstitialAt > INTERSTITIAL_MIN_INTERVAL_MS;
  const ad = interstitial;
  if (!due || !ad?.loaded) return;

  await new Promise<void>((resolve) => {
    const offClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      offClosed();
      offError();
      resolve();
    });
    const offError = ad.addAdEventListener(AdEventType.ERROR, () => {
      offClosed();
      offError();
      resolve();
    });
    ad.show().catch(() => resolve());
  });
  scansSinceInterstitial = 0;
  lastInterstitialAt = Date.now();
}

export const rewardedAvailable = () => !!rewarded?.loaded;

/** Yayın sürümünde ödüllü reklam birimi henüz tanımlı değilse reklam gösterilmeden hak verilir. */
export const rewardedConfigured = () => __DEV__ || !isPlaceholder(PRODUCTION_AD_UNITS.rewarded);

/**
 * Ödüllü reklamı gösterir. Kullanıcı ödülü kazandıysa true döner.
 * Reklam henüz yüklenmediyse yüklenmesini en fazla 8 sn bekler.
 */
export async function showRewarded(): Promise<boolean> {
  if (!canRequestAds) return false;
  if (!rewarded) preloadRewarded();
  const ad = rewarded!;

  if (!ad.loaded) {
    const loaded = await new Promise<boolean>((resolve) => {
      const timer = setTimeout(() => {
        offLoaded();
        offError();
        resolve(false);
      }, 8000);
      const offLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
        clearTimeout(timer);
        offLoaded();
        offError();
        resolve(true);
      });
      const offError = ad.addAdEventListener(AdEventType.ERROR, () => {
        clearTimeout(timer);
        offLoaded();
        offError();
        resolve(false);
      });
    });
    if (!loaded) {
      preloadRewarded();
      return false;
    }
  }

  const earned = await new Promise<boolean>((resolve) => {
    let gotReward = false;
    const offReward = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      gotReward = true;
    });
    const offClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      offReward();
      offClosed();
      resolve(gotReward);
    });
    ad.show().catch(() => {
      offReward();
      offClosed();
      resolve(false);
    });
  });
  preloadRewarded();
  return earned;
}

/** Ayarlar ekranından gizlilik/onay seçeneklerini yeniden açar. */
export async function showPrivacyOptions(): Promise<void> {
  await AdsConsent.showPrivacyOptionsForm();
}
