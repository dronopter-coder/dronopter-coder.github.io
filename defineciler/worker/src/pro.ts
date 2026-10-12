import type { KV } from './limits';

/** RevenueCat'te Pro aboneliğine karşılık gelen yetki (entitlement) kimliği. */
export const PRO_ENTITLEMENT = 'pro';
const CACHE_TTL = 10 * 60;

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

/**
 * Cihazın (RevenueCat uygulama kullanıcı kimliği = cihaz kimliği) etkin bir Pro aboneliği var mı?
 * İstemcinin beyanına güvenilmez; RevenueCat REST API'sinden doğrulanır ve sonuç KV'de 10 dk saklanır.
 * Gizli anahtar yoksa veya doğrulama başarısızsa Pro sayılmaz (ücretsiz sınırlar uygulanır).
 */
export async function isProDevice(
  device: string | undefined,
  secret: string | undefined,
  kv?: KV,
  fetchImpl: FetchLike = fetch,
  now = Date.now(),
): Promise<boolean> {
  if (!device || !secret) return false;
  const key = `pro:${device}`;
  if (kv) {
    const cached = await kv.get(key);
    if (cached === '1' || cached === '0') return cached === '1';
  }
  let pro = false;
  let known = false;
  try {
    const res = await fetchImpl(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(device)}`, {
      headers: { Authorization: `Bearer ${secret}` },
      signal: AbortSignal.timeout(5_000),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        subscriber?: { entitlements?: Record<string, { expires_date?: string | null }> };
      };
      const ent = data.subscriber?.entitlements?.[PRO_ENTITLEMENT];
      pro = !!ent && (!ent.expires_date || Date.parse(ent.expires_date) > now);
      known = true;
    }
  } catch (e) {
    console.error('revenuecat', String(e));
  }
  // Yalnızca kesin yanıt önbelleğe alınır; geçici hata bir sonraki istekte yeniden denenir.
  if (kv && known) await kv.put(key, pro ? '1' : '0', { expirationTtl: CACHE_TTL });
  return pro;
}
