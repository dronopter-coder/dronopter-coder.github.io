// Web önizlemesinde AdMob yoktur; aynı API'yi boş uygulamalarla sağlar.
export const AD_UNITS = { banner: '', resultBanner: '', interstitial: '', rewarded: '' };
export const initAds = async () => {};
export const adsReady = () => false;
export const maybeShowInterstitial = async () => {};
export const rewardedAvailable = () => false;
export const rewardedConfigured = () => false;
export type RewardOutcome = 'earned' | 'dismissed' | 'unavailable';
export const showRewarded = async (): Promise<RewardOutcome> => 'earned';
export const warmUpRewarded = () => {};
export const showPrivacyOptions = async () => {};
