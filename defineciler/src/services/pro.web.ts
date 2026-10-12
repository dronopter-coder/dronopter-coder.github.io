// Web önizlemesinde satın alma yoktur; Pro hep kapalıdır.
export const PRO_ENTITLEMENT = 'pro';
export const initPro = async () => {};
export const proAvailable = () => false;
export const isProNow = () => false;
export const useIsPro = () => false;
export type ProPlan = { id: 'annual' | 'monthly'; pkg: unknown; price: string; perMonth?: string; trial?: string };
export const getPlans = async (): Promise<ProPlan[]> => [];
export type PurchaseOutcome = 'purchased' | 'cancelled' | 'failed';
export const purchase = async (_plan: ProPlan): Promise<PurchaseOutcome> => 'failed';
export const restore = async () => false;
