import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { Colors, Fonts, Radius } from '@/constants/theme';
import { DOC_GROUPS, DOCS_TITLE } from '@/data/belgeler.generated';
import { PHOTOS } from '@/data/photos.generated';

/** Belgeler için kapak görseli: derlemede indirilen eski harita/ferman fotoğrafı, yoksa mühür fotoğrafı. */
export const DOCS_COVER = (PHOTOS['docs:cover'] ?? PHOTOS['guide:muhurler'])?.image;

const SECTIONS = DOC_GROUPS.reduce((n, g) => n + g.sections.length, 0);

/** Ana sayfadaki "Volçan Voyvoda ve Eşkıya Belgeleri" duyurusu: görselli banner, ilk girişte sağdan kayarak gelir. */
export function DocsBanner({ onPress }: { onPress: () => void }) {
  return (
    <Animated.View entering={FadeInRight.duration(450)}>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}>
        <Image source={DOCS_COVER} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient
          colors={['rgba(12,10,6,0.95)', 'rgba(12,10,6,0.75)', 'rgba(12,10,6,0.25)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.badge}>
          <MaterialCommunityIcons name="script-text-outline" size={13} color={Colors.onGold} />
          <Text style={styles.badgeText}>YENİ</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {DOCS_TITLE}
        </Text>
        <Text style={styles.sub} numberOfLines={2}>
          {DOC_GROUPS.length} bölüm · {SECTIONS} mevki · Martin Voyvoda ve 32 kişilik çetenin izinde
        </Text>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>Oku</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color={Colors.onGold} />
        </View>
      </Pressable>
    </Animated.View>
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
