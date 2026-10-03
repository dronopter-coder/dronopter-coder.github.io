import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import type { IconName } from '@/components/ui';
import { PHOTOS } from '@/data/photos.generated';
import { getWikiSummary, type WikiSummary } from '@/services/wiki';

type Props = {
  /** Gömülü fotoğraf anahtarı, ör. "place:hitit" (bkz. scripts/fetch-photos.mts) */
  photoKey?: string;
  wiki?: { tr?: string; en?: string };
  accent: string;
  icon: IconName;
  style?: StyleProp<ViewStyle>;
  /** Fotoğrafın altına yazar/lisans etiketi yazılsın mı (detay sayfaları için) */
  showCredit?: boolean;
  onSummary?: (s: WikiSummary | null) => void;
};

export async function resolveWiki(wiki?: { tr?: string; en?: string }) {
  if (!wiki) return null;
  let s = wiki.tr ? await getWikiSummary(wiki.tr, 'tr') : null;
  if (!s?.image && wiki.en) {
    const en = await getWikiSummary(wiki.en, 'en');
    if (en) s = s ? { ...s, image: en.image } : en;
  }
  return s;
}

/**
 * Konu başlığı görseli. Öncelik sırası: uygulamaya gömülü Wikimedia Commons fotoğrafı →
 * çalışma anında Wikipedia görseli → renkli desenli yedek.
 */
export function WikiImage({ photoKey, wiki, accent, icon, style, showCredit, onSummary }: Props) {
  const photo = photoKey ? PHOTOS[photoKey] : undefined;
  const [summary, setSummary] = useState<WikiSummary | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (photo && !onSummary) return;
    let alive = true;
    resolveWiki(wiki).then((s) => {
      if (!alive) return;
      setSummary(s);
      onSummary?.(s);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wiki?.tr, wiki?.en, photo]);

  const remote = !photo && summary?.image && !failed ? summary.image : null;

  return (
    <View style={[styles.wrap, style]}>
      <LinearGradient colors={[accent, '#1A130A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <MaterialCommunityIcons name={icon} size={56} color="#FFFFFF33" style={styles.icon} />
      {photo ? (
        <Image source={photo.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
      ) : remote ? (
        <Image
          source={{ uri: remote }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
          cachePolicy="disk"
          onError={() => setFailed(true)}
        />
      ) : null}
      {(photo || remote) && (
        <LinearGradient colors={['transparent', '#14100CAA']} locations={[0.55, 1]} style={StyleSheet.absoluteFill} />
      )}
      {showCredit && photo && (
        <Text style={styles.credit} numberOfLines={1}>
          Fotoğraf: {photo.author} · {photo.license} · Wikimedia Commons
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  icon: { position: 'absolute' },
  credit: {
    position: 'absolute',
    right: 8,
    bottom: 6,
    left: 8,
    textAlign: 'right',
    color: '#F3E9DACC',
    fontSize: 10,
    textShadowColor: '#000',
    textShadowRadius: 3,
  },
});
