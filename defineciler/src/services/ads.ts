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

type RewardedState = 'idle' | 'loading' | 'loaded' | 'failed';
let rewardedState: RewardedState = 'idle';
let rewardedRetry: ReturnType<typeof setTimeout> | null = null;
let rewardedAttempts = 0;
const RETRY_DELAYS = [5_000, 15_000, 45_000, 120_000];

/** Ödüllü reklamı yükler; yüklenemezse artan aralıklarla (5 sn → 2 dk) yeniden dener. */
function preloadRewarded() {
  if (!canRequestAds) return;
  if (rewardedRetry) clearTimeout(rewardedRetry);
  rewardedRetry = null;
  rewarded?.removeAllListeners();
  const ad = RewardedInterstitialAd.createForAdRequest(AD_UNITS.rewarded);
  rewarded = ad;
  rewardedState = 'loading';
  ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
    rewardedState = 'loaded';
    rewardedAttempts = 0;
  });
  ad.addAdEventListener(AdEventType.ERROR, (e) => {
    if (rewarded !== ad || rewardedState === 'loaded') return;
    rewardedState = 'failed';
    if (__DEV__) console.warn('Ödüllü reklam yüklenemedi', e);
    const delay = RETRY_DELAYS[Math.min(rewardedAttempts++, RETRY_DELAYS.length - 1)];
    rewardedRetry = setTimeout(preloadRewarded, delay);
  });
  ad.load();
}

/** Hak bitmek üzereyken / tarama ekranı açılınca çağrılır: reklam hazır değilse yüklemeyi başlatır. */
export function warmUpRewarded() {
  if (!canRequestAds) return;
  if (rewardedState === 'failed' || rewardedState === 'idle') preloadRewarded();
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

export const rewardedAvailable = () => rewardedState === 'loaded';

/** Yayın sürümünde ödüllü reklam birimi henüz tanımlı değilse reklam gösterilmeden hak verilir. */
export const rewardedConfigured = () => __DEV__ || !isPlaceholder(PRODUCTION_AD_UNITS.rewarded);

export type RewardOutcome = 'earned' | 'dismissed' | 'unavailable';

/**
 * Ödüllü reklamı gösterir. Reklam hazır değilse yüklenmesini en fazla 15 sn bekler.
 * - earned: kullanıcı ödülü kazandı
 * - dismissed: reklam açıldı ama sonuna kadar izlenmedi
 * - unavailable: gösterilecek reklam bulunamadı (yeni hesaplarda sık görülür)
 */
export async function showRewarded(): Promise<RewardOutcome> {
  if (!canRequestAds) return 'unavailable';
  if (rewardedState !== 'loaded' && rewardedState !== 'loading') preloadRewarded();
  const ad = rewarded;
  if (!ad) return 'unavailable';

  if (rewardedState !== 'loaded') {
    const loaded = await new Promise<boolean>((resolve) => {
      const timer = setTimeout(() => done(false), 15_000);
      const offLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => done(true));
      const offError = ad.addAdEventListener(AdEventType.ERROR, () => done(false));
      function done(v: boolean) {
        clearTimeout(timer);
        offLoaded();
        offError();
        resolve(v);
      }
    });
    if (!loaded) return 'unavailable';
  }

  const outcome = await new Promise<RewardOutcome>((resolve) => {
    let gotReward = false;
    const offReward = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      gotReward = true;
    });
    const offClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      offReward();
      offClosed();
      resolve(gotReward ? 'earned' : 'dismissed');
    });
    ad.show().catch(() => {
      offReward();
      offClosed();
      resolve('unavailable');
    });
  });
  rewardedState = 'idle';
  preloadRewarded();
  return outcome;
}

/** Ayarlar ekranından gizlilik/onay seçeneklerini yeniden açar. */
export async function showPrivacyOptions(): Promise<void> {
  await AdsConsent.showPrivacyOptionsForm();
}
