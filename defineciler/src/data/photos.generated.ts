// Bu dosya scripts/fetch-photos.mts tarafından üretilir; elle düzenlemeyin.
// Fotoğraflar Wikimedia Commons'tandır; her birinin yazarı ve lisansı aşağıdadır.

export type Photo = { image: number; author: string; license: string; url: string };

export const PHOTOS: Record<string, Photo> = {};
