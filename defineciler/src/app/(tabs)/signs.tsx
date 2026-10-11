import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Fragment, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AdBanner } from '@/components/ad-banner';
import { EvidenceChip, SIGNS_COVER, SignGlyph } from '@/components/sign-glyph';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { PHOTOS } from '@/data/photos.generated';
import { EVIDENCE, SIGN_CATEGORIES, SIGNS, SIGNS_GUIDE, type Sign, type SignCategory } from '@/data/signs';

const open = (id: string) => router.push({ pathname: '/signs/[id]', params: { id } });

function SignTile({ sign, width }: { sign: Sign; width: number }) {
  const photo = PHOTOS[`sign:${sign.id}`];
  return (
    <Pressable onPress={() => open(sign.id)} style={({ pressed }) => [styles.tile, { width }, pressed && { opacity: 0.85 }]}>
      <View style={styles.tileArt}>
        <LinearGradient colors={['#2A2219', '#14100C']} style={StyleSheet.absoluteFill} />
        {photo ? (
          <>
            <Image source={photo.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
            <LinearGradient colors={['transparent', 'rgba(12,10,6,0.85)']} style={StyleSheet.absoluteFill} />
            <SignGlyph sign={sign} size={38} style={styles.tileGlyphSmall} />
          </>
        ) : (
          <SignGlyph sign={sign} size={64} />
        )}
      </View>
      <View style={styles.tileBody}>
        <Text style={styles.tileTitle} numberOfLines={1}>
          {sign.title}
        </Text>
        <EvidenceChip evidence={sign.evidence} small />
      </View>
    </Pressable>
  );
}

export default function SignsScreen() {
  const { width } = useWindowDimensions();
  const tileWidth = (Math.min(width, 800) - Spacing.lg * 2 - Spacing.md) / 2;
  const [category, setCategory] = useState<SignCategory | 'all'>('all');
  const groups = SIGN_CATEGORIES.filter((c) => category === 'all' || c.id === category);
  const chips: { id: SignCategory | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'Tümü', count: SIGNS.length },
    ...SIGN_CATEGORIES.map((c) => ({ id: c.id, label: c.label, count: SIGNS.filter((s) => s.category === c.id).length })),
  ];

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.cover}>
        <Image source={SIGNS_COVER} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient colors={['rgba(20,16,10,0.45)', 'rgba(20,16,10,0.95)']} style={StyleSheet.absoluteFill} />
        <MaterialCommunityIcons name="sign-direction" size={30} color={Colors.goldLight} />
        <Text style={styles.coverTitle}>Define İşaretleri ve Anlamları</Text>
        <Text style={styles.coverMeta}>
          {SIGNS.length} işaret · Halk arasındaki yorumu, tarih ve arkeolojideki karşılığı ve yorumun sınırı
        </Text>
      </View>

      <Pressable onPress={() => open('kilavuz')} style={({ pressed }) => [styles.guide, pressed && { opacity: 0.85 }]}>
        <MaterialCommunityIcons name="scale-balance" size={26} color={Colors.goldLight} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.guideTitle}>{SIGNS_GUIDE.title}</Text>
          <Text style={styles.guideSub}>{SIGNS_GUIDE.subtitle} · 5 soru, kanıt düzeyleri, yasal çerçeve</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.textMuted} />
      </Pressable>

      <View style={styles.legend}>
        {Object.entries(EVIDENCE).map(([key, e]) => (
          <View key={key} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: e.color }]} />
            <Text style={styles.legendText}>
              <Text style={{ color: e.color, fontWeight: '700' }}>{e.label}: </Text>
              {e.desc}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {chips.map((c) => {
          const active = c.id === category;
          return (
            <Pressable key={c.id} onPress={() => setCategory(c.id)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {c.label} · {c.count}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {groups.map((g, i) => (
        <Fragment key={g.id}>
          <View style={{ gap: 2 }}>
            <Text style={styles.groupTitle}>{g.label}</Text>
            <Text style={styles.groupDesc}>{g.desc}</Text>
          </View>
          <View style={styles.grid}>
            {SIGNS.filter((s) => s.category === g.id).map((s) => (
              <SignTile key={s.id} sign={s} width={tileWidth} />
            ))}
          </View>
          {i < groups.length - 1 ? <AdBanner variant="inline" /> : null}
        </Fragment>
      ))}

      <View style={styles.warning}>
        <MaterialCommunityIcons name="alert-outline" size={20} color={Colors.warning} />
        <Text style={styles.warningText}>
          Bu bölüm bilgilendirme amaçlıdır. İzinsiz kazı ve kültür varlıklarına zarar vermek 2863 sayılı Kanun’a göre suçtur. Bir
          işaret ya da buluntu gördüğünüzde müze müdürlüğüne bildirin.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxl },
  cover: {
    overflow: 'hidden',
    minHeight: 190,
    justifyContent: 'flex-end',
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    gap: Spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(232,199,122,0.4)',
    backgroundColor: Colors.surface,
  },
  coverTitle: { fontFamily: Fonts.display, color: '#F2EBDD', fontSize: 26, lineHeight: 32 },
  coverMeta: { color: Colors.textSecondary, fontSize: 13, lineHeight: 19 },
  guide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(212,162,76,0.1)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(232,199,122,0.5)',
  },
  guideTitle: { fontFamily: Fonts.display, color: Colors.text, fontSize: 17 },
  guideSub: { color: Colors.textSecondary, fontSize: 12, lineHeight: 17 },
  legend: {
    gap: 6,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  legendRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  legendText: { flex: 1, color: Colors.textSecondary, fontSize: 12, lineHeight: 18 },
  chips: { gap: Spacing.sm, paddingVertical: 2 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  chipText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: Colors.onGold },
  groupTitle: { fontFamily: Fonts.display, color: Colors.goldLight, fontSize: 20, marginTop: Spacing.sm },
  groupDesc: { color: Colors.textMuted, fontSize: 12, lineHeight: 17 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  tile: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  tileArt: { height: 110, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  tileGlyphSmall: { position: 'absolute', left: 8, bottom: 8, backgroundColor: 'rgba(20,16,10,0.75)' },
  tileBody: { padding: 10, gap: 6 },
  tileTitle: { color: Colors.text, fontSize: 15, fontWeight: '700' },
  warning: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(224,164,58,0.1)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(224,164,58,0.4)',
    marginTop: Spacing.sm,
  },
  warningText: { flex: 1, color: Colors.text, fontSize: 13, lineHeight: 19 },
});
