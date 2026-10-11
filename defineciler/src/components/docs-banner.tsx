import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import type { IconName } from '@/components/ui';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { DOC_GROUPS, DOCS_TITLE } from '@/data/belgeler.generated';
import { PHOTOS } from '@/data/photos.generated';

/** Belgeler için kapak görseli: derlemede indirilen eski harita/ferman fotoğrafı, yoksa mühür fotoğrafı. */
export const DOCS_COVER = (PHOTOS['docs:cover'] ?? PHOTOS['guide:muhurler'])?.image;

const SECTIONS = DOC_GROUPS.reduce((n, g) => n + g.sections.length, 0);

type BannerProps = {
  image?: number;
  icon: IconName;
  badge: string;
  title: string;
  sub: string;
  cta: string;
  onPress: () => void;
  delay?: number;
};

/** Ana sayfa duyuru kartı: görselli banner, ilk girişte sağdan kayarak gelir. */
export function FeatureBanner({ image, icon, badge, title, sub, cta, onPress, delay = 0 }: BannerProps) {
  return (
    <Animated.View entering={FadeInRight.duration(450).delay(delay)}>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}>
        {image ? <Image source={image} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
        <LinearGradient
          colors={['rgba(12,10,6,0.95)', 'rgba(12,10,6,0.75)', 'rgba(12,10,6,0.25)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.badge}>
          <MaterialCommunityIcons name={icon} size={13} color={Colors.onGold} />
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.sub} numberOfLines={2}>
          {sub}
        </Text>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>{cta}</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color={Colors.onGold} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

/** Ana sayfadaki "Volçan Voyvoda ve Eşkıya Belgeleri" duyurusu. */
export function DocsBanner({ onPress }: { onPress: () => void }) {
  return (
    <FeatureBanner
      image={DOCS_COVER}
      icon="script-text-outline"
      badge="YENİ"
      title={DOCS_TITLE}
      sub={`${DOC_GROUPS.length} bölüm · ${SECTIONS} mevki · Martin Voyvoda ve 32 kişilik çetenin izinde`}
      cta="Oku"
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 156,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    padding: 16,
    paddingRight: '30%',
    gap: 6,
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(232,199,122,0.6)',
    backgroundColor: '#1E170E',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: Colors.gold,
  },
  badgeText: { fontFamily: Fonts.inscription, color: Colors.onGold, fontSize: 11, letterSpacing: 1 },
  title: { fontFamily: Fonts.display, color: '#F2EBDD', fontSize: 20, lineHeight: 25 },
  sub: { color: Colors.textSecondary, fontSize: 12, lineHeight: 17 },
  cta: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: Colors.gold,
  },
  ctaText: { color: Colors.onGold, fontWeight: '800', fontSize: 13 },
});
