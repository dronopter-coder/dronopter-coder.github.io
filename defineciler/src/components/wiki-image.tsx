import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { IconName } from '@/components/ui';
import { getWikiSummary, type WikiSummary } from '@/services/wiki';

type Props = {
  wiki?: { tr?: string; en?: string };
  accent: string;
  icon: IconName;
  style?: StyleProp<ViewStyle>;
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

/** Konu başlığı görseli: Wikipedia'dan çekilir, yüklenemezse renkli desenli yedek gösterilir. */
export function WikiImage({ wiki, accent, icon, style, onSummary }: Props) {
  const [summary, setSummary] = useState<WikiSummary | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
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
  }, [wiki?.tr, wiki?.en]);

  return (
    <View style={[styles.wrap, style]}>
      <LinearGradient colors={[accent, '#1A130A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <MaterialCommunityIcons name={icon} size={56} color="#FFFFFF33" style={styles.icon} />
      {summary?.image && !failed && (
        <Image
          source={{ uri: summary.image }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
          cachePolicy="disk"
          onError={() => setFailed(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  icon: { position: 'absolute' },
});
