import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { FeatureBanner } from '@/components/docs-banner';
import { Colors } from '@/constants/theme';
import { PHOTOS } from '@/data/photos.generated';
import { EVIDENCE, glyphXml, SIGNS, type Sign, type SignEvidence } from '@/data/signs';

/** İşaretler kapağı: derlemede indirilen kaya resmi fotoğrafı, yoksa rehberdeki işaretler fotoğrafı. */
export const SIGNS_COVER = (PHOTOS['signs:cover'] ?? PHOTOS['guide:isaretler'])?.image;

/** İşaretin çizgi piktogramı, altın renkli daire içinde. */
export function SignGlyph({
  sign,
  size = 56,
  color = Colors.goldLight,
  style,
}: {
  sign: Sign;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <SvgXml xml={glyphXml(sign.glyph, color)} width={size * 0.7} height={size * 0.7} />
    </View>
  );
}

/** Kanıt düzeyi etiketi (Arkeolojik iz / Kültürel sembol / Halk yorumu). */
export function EvidenceChip({ evidence, small }: { evidence: SignEvidence; small?: boolean }) {
  const e = EVIDENCE[evidence];
  return (
    <View style={[styles.chip, { borderColor: e.color + '99', backgroundColor: e.color + '1F' }]}>
      <View style={[styles.dot, { backgroundColor: e.color }]} />
      <Text style={[styles.chipText, { color: e.color, fontSize: small ? 11 : 12 }]}>{e.label}</Text>
    </View>
  );
}

/** Ana sayfadaki "Define işaretleri ne anlama gelir?" duyurusu. */
export function SignsBanner({ onPress }: { onPress: () => void }) {
  return (
    <FeatureBanner
      image={SIGNS_COVER}
      icon="sign-direction"
      badge="REHBER"
      title="Define işaretleri ne anlama gelir?"
      sub={`${SIGNS.length} işaret · halk yorumu, arkeolojik karşılığı ve yorum sınırı`}
      cta="Keşfet"
      onPress={onPress}
      delay={120}
    />
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212,162,76,0.1)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(232,199,122,0.5)',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  chipText: { fontWeight: '700' },
});
