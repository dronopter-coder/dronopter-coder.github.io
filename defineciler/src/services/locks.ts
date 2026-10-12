import { SIGNS, type Sign } from '@/data/signs';

/** Belgeler: ilk iki bölüm herkese açık, sonrası Pro. */
export const FREE_DOC_GROUPS = 2;
/** Define İşaretleri: her kategoride ilk üç işaret ve okuma kılavuzu herkese açık, sonrası Pro. */
export const FREE_SIGNS_PER_CATEGORY = 3;

export const isDocGroupLocked = (index: number) => index >= FREE_DOC_GROUPS;

export function isSignLocked(sign: Sign) {
  const inCategory = SIGNS.filter((s) => s.category === sign.category);
  return inCategory.indexOf(sign) >= FREE_SIGNS_PER_CATEGORY;
}
