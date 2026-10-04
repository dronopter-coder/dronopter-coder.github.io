import AsyncStorage from '@react-native-async-storage/async-storage';

import { DAILY_FREE_SCANS } from '@/constants/config';

/**
 * Günlük ücretsiz analiz hakkı + ödüllü reklamla kazanılan ek haklar.
 * (Asıl kötüye kullanım koruması Worker'daki IP sınırıdır; bu sayaç kullanıcı deneyimi içindir.)
 */
const KEY = 'quota:v1';

type State = { day: string; used: number; bonus: number };

const today = () => new Date().toISOString().slice(0, 10);

type Listener = (remaining: number) => void;
const listeners = new Set<Listener>();

async function read(): Promise<State> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const s = raw ? (JSON.parse(raw) as State) : null;
    if (s && s.day === today()) return s;
    // Yeni gün: kullanılan sıfırlanır, kazanılmış ek haklar korunur.
    return { day: today(), used: 0, bonus: s?.bonus ?? 0 };
  } catch {
    return { day: today(), used: 0, bonus: 0 };
  }
}

const remainingOf = (s: State) => Math.max(0, DAILY_FREE_SCANS - s.used) + s.bonus;

async function write(s: State) {
  await AsyncStorage.setItem(KEY, JSON.stringify(s));
  const r = remainingOf(s);
  listeners.forEach((l) => l(r));
}

export async function getRemainingScans() {
  return remainingOf(await read());
}

export function subscribeQuota(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Başarılı bir analizden sonra bir hak düşer (önce günlük ücretsiz haklar kullanılır). */
export async function consumeScan() {
  const s = await read();
  if (s.used < DAILY_FREE_SCANS) s.used += 1;
  else if (s.bonus > 0) s.bonus -= 1;
  await write(s);
}

export async function addBonusScans(n = 1) {
  const s = await read();
  s.bonus += n;
  await write(s);
}

/** Reklam bulunamadığında verilen hediye hak sınırı (günlük). */
export const DAILY_FALLBACK_GIFTS = 3;
const GIFT_KEY = 'quota:gifts:v1';

/**
 * Ödüllü reklam gösterilemediğinde kullanıcıyı bekletmemek için hediye +1 hak verir.
 * Günde en fazla DAILY_FALLBACK_GIFTS kez; verildiyse true döner.
 */
export async function grantFallbackBonus(): Promise<boolean> {
  let state = { day: today(), count: 0 };
  try {
    const raw = await AsyncStorage.getItem(GIFT_KEY);
    const s = raw ? (JSON.parse(raw) as typeof state) : null;
    if (s && s.day === today()) state = s;
  } catch {}
  if (state.count >= DAILY_FALLBACK_GIFTS) return false;
  state.count += 1;
  await AsyncStorage.setItem(GIFT_KEY, JSON.stringify(state)).catch(() => {});
  await addBonusScans(1);
  return true;
}
