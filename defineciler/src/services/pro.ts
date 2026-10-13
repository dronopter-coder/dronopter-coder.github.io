import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useSyncExternalStore } from 'react';
import Purchases, { type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';

import { REVENUECAT_KEY } from '@/constants/config';
import { getDeviceId } from '@/services/api';

/**
 * Defineciler Pro aboneliği (Google Play Billing, RevenueCat üzerinden).
 * Uygulama kullanıcı kimliği = cihaz kimliği (sunucu da aynı kimlikle Pro'yu doğrular).
 * RevenueCat anahtarı yoksa Pro satın alma kapalıdır ve uygulama ücretsiz modda çalışır.
 */
export const PRO_ENTITLEMENT = 'pro';
const CACHE_KEY = 'pro:active:v1';

let isPro = false;
let configured = false;
let initPromise: Promise<void> | null = null;
const listeners = new Set<(v: boolean) => void>();

function setPro(v: boolean) {
  if (v === isPro) return;
  isPro = v;
  AsyncStorage.setItem(CACHE_KEY, v ? '1' : '0').catch(() => {});
  listeners.forEach((l) => l(v));
}

const activeIn = (info: CustomerInfo) => !!info.entitlements.active[PRO_ENTITLEMENT];

/** Satın alma servisini başlatır (uygulama açılışında bir kez). Önce son bilinen durum gösterilir. */
export function initPro(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        if ((await AsyncStorage.getItem(CACHE_KEY)) === '1') setPro(true);
      } catch {}
      if (!REVENUECAT_KEY) return;
      try {
        const appUserID = (await getDeviceId()) ?? undefined;
        Purchases.configure({ apiKey: REVENUECAT_KEY, appUserID });
        configured = true;
        Purchases.addCustomerInfoUpdateListener((info) => setPro(activeIn(info)));
        setPro(activeIn(await Purchases.getCustomerInfo()));
      } catch (e) {
        if (__DEV__) console.warn('Pro başlatılamadı', e);
      }
    })();
  }
  return initPromise;
}

/** Pro satın alma bu sürümde kullanılabilir mi (anahtar tanımlı ve servis başladı). */
export const proAvailable = () => configured;
export const isProNow = () => isPro;

function subscribe(cb: () => void) {
  const l = () => cb();
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useIsPro() {
  useEffect(() => {
    initPro();
  }, []);
  return useSyncExternalStore(subscribe, () => isPro, () => false);
}

export type ProPlan = {
  id: 'annual' | 'monthly';
  pkg: PurchasesPackage;
  price: string;
  /** Aylık karşılığı (yıllık için) */
  perMonth?: string;
  /** Ücretsiz deneme süresi metni, ör. "7 gün ücretsiz" */
  trial?: string;
};

function trialText(pkg: PurchasesPackage): string | undefined {
  const free = pkg.product.defaultOption?.freePhase;
  if (!free) return undefined;
  const { unit, value } = free.billingPeriod;
  const label = { DAY: 'gün', WEEK: 'hafta', MONTH: 'ay', YEAR: 'yıl', UNKNOWN: '' }[unit] ?? '';
  return label ? `${value} ${label} ücretsiz` : 'Ücretsiz deneme';
}

/** Mağazadaki güncel planlar (yıllık önce). Satın alma kapalıysa boş liste. */
export async function getPlans(): Promise<ProPlan[]> {
  await initPro();
  if (!configured) return [];
  const offerings = await Purchases.getOfferings();
  const pkgs = offerings.current?.availablePackages ?? [];
  if (!pkgs.length) throw new Error(offerings.current ? 'Teklifte paket yok' : 'Etkin teklif bulunamadı');
  const plans: ProPlan[] = [];
  const annual = pkgs.find((p) => p.packageType === 'ANNUAL');
  const monthly = pkgs.find((p) => p.packageType === 'MONTHLY');
  if (annual)
    plans.push({
      id: 'annual',
      pkg: annual,
      price: annual.product.priceString,
      perMonth: annual.product.pricePerMonthString ?? undefined,
      trial: trialText(annual),
    });
  if (monthly) plans.push({ id: 'monthly', pkg: monthly, price: monthly.product.priceString, trial: trialText(monthly) });
  return plans;
}

/** Planlar yüklenemediğinde kullanıcıya gösterilecek kısa teşhis metni (RevenueCat hata kodu ve mesajı). */
export function planErrorText(e: unknown): string {
  const err = e as { code?: string | number; message?: string; underlyingErrorMessage?: string };
  return [err?.code != null ? `Kod ${err.code}` : null, err?.underlyingErrorMessage || err?.message]
    .filter(Boolean)
    .join(' · ')
    .slice(0, 240);
}

export type PurchaseOutcome = 'purchased' | 'cancelled' | 'failed';

export async function purchase(plan: ProPlan): Promise<PurchaseOutcome> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(plan.pkg);
    setPro(activeIn(customerInfo));
    return activeIn(customerInfo) ? 'purchased' : 'failed';
  } catch (e) {
    return (e as { userCancelled?: boolean })?.userCancelled ? 'cancelled' : 'failed';
  }
}

/** Telefon değişince veya yeniden kurulumda aboneliği geri yükler. */
export async function restore(): Promise<boolean> {
  await initPro();
  if (!configured) return false;
  try {
    const info = await Purchases.restorePurchases();
    setPro(activeIn(info));
    return activeIn(info);
  } catch {
    return false;
  }
}
