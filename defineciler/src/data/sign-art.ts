// İşaretlerin kapak görselleri (uygulama sahibinin hazırladığı görseller). Bir işaret burada yoksa
// derlemede Wikimedia Commons'tan indirilen örnek fotoğraf (PHOTOS['sign:<id>']), o da yoksa piktogram gösterilir.
export const SIGN_ART: Record<string, number> = {
  aslan: require('../../assets/signs/aslan.jpg'),
  'at-nali': require('../../assets/signs/at-nali.jpg'),
  ayak: require('../../assets/signs/ayak.jpg'),
  balik: require('../../assets/signs/balik.jpg'),
  hilal: require('../../assets/signs/hilal.jpg'),
  insan: require('../../assets/signs/insan.jpg'),
  kaplumbaga: require('../../assets/signs/kaplumbaga.jpg'),
  tamga: require('../../assets/signs/tamga.jpg'),
  yildiz: require('../../assets/signs/yildiz.jpg'),
  yilan: require('../../assets/signs/yilan.jpg'),
};
