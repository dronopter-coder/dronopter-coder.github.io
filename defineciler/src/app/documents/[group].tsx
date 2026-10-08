import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Fragment, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AdBanner } from '@/components/ad-banner';
import { EmptyState } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { DOC_GROUPS, type DocBlock } from '@/data/belgeler.generated';

/** Uzun başlıklarda bu kadar bloktan sonra araya reklam girer. */
const BLOCKS_PER_AD = 14;

function Block({ b }: { b: DocBlock }) {
  switch (b.t) {
    case 'h':
      return <Text style={styles.sub}>{b.x}</Text>;
    case 'label':
      return <Text style={styles.label}>{b.x}</Text>;
    case 'ol':
      return (
        <View style={styles.li}>
          <Text style={styles.liNum}>{b.n}.</Text>
          <Text style={styles.liText}>{b.x}</Text>
        </View>
      );
    case 'ul':
      return (
        <View style={styles.li}>
          <Text style={styles.liDot}>◆</Text>
          <Text style={styles.liText}>{b.x}</Text>
        </View>
      );
    default:
      return <Text style={styles.p}>{b.x}</Text>;
  }
}

export default function DocumentGroupScreen() {
  const { group } = useLocalSearchParams<{ group: string }>();
  const index = DOC_GROUPS.findIndex((g) => g.id === group);
  const g = DOC_GROUPS[index];
  if (!g) return <EmptyState icon="file-question-outline" title="Bölüm bulunamadı" />;
  const prev = DOC_GROUPS[index - 1];
  const next = DOC_GROUPS[index + 1];

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Stack.Screen options={{ title: `Bölüm ${index + 1}` }} />
      <Text style={styles.title}>{g.title}</Text>
      <Text style={styles.meta}>
        {g.sections.length} başlık · ~{g.minutes} dk okuma
      </Text>

      {g.sections.map((s, si) => {
        const parts: ReactNode[] = [];
        s.blocks.forEach((b, bi) => {
          parts.push(<Block key={bi} b={b} />);
          if ((bi + 1) % BLOCKS_PER_AD === 0 && bi < s.blocks.length - 3) {
            parts.push(<AdBanner key={`ad${bi}`} variant="inline" />);
          }
        });
        return (
          <Fragment key={s.n}>
            <View style={styles.section}>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionNum}>{s.n}</Text>
                <Text style={styles.sectionTitle}>{s.title}</Text>
              </View>
              {parts}
            </View>
            {si % 2 === 1 && si < g.sections.length - 1 ? <AdBanner variant="inline" /> : null}
          </Fragment>
        );
      })}

      <View style={styles.nav}>
        {prev ? (
          <Pressable
            style={styles.navBtn}
            onPress={() => router.replace({ pathname: '/documents/[group]', params: { group: prev.id } })}>
            <MaterialCommunityIcons name="chevron-left" size={20} color={Colors.goldLight} />
            <Text style={styles.navText} numberOfLines={2}>
              {prev.title}
            </Text>
          </Pressable>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        {next ? (
          <Pressable
            style={[styles.navBtn, { justifyContent: 'flex-end' }]}
            onPress={() => router.replace({ pathname: '/documents/[group]', params: { group: next.id } })}>
            <Text style={[styles.navText, { textAlign: 'right' }]} numberOfLines={2}>
              {next.title}
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.goldLight} />
          </Pressable>
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </View>
      <AdBanner variant="inline" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxl },
  title: { fontFamily: Fonts.display, color: '#F2EBDD', fontSize: 26, lineHeight: 32 },
  meta: { color: Colors.gold, fontSize: 13, fontWeight: '600', marginTop: -Spacing.sm },
  section: {
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  sectionNum: {
    fontWeight: '800',
    color: Colors.onGold,
    backgroundColor: Colors.gold,
    minWidth: 30,
    textAlign: 'center',
    borderRadius: 6,
    overflow: 'hidden',
    paddingVertical: 2,
    fontSize: 14,
    marginTop: 3,
  },
  sectionTitle: { flex: 1, fontFamily: Fonts.display, color: Colors.goldLight, fontSize: 19, lineHeight: 25 },
  sub: { fontFamily: Fonts.display, color: Colors.text, fontSize: 16, marginTop: Spacing.sm },
  label: { color: Colors.gold, fontSize: 14, fontWeight: '700', marginTop: Spacing.xs },
  p: { color: Colors.text, fontSize: 15, lineHeight: 24 },
  li: { flexDirection: 'row', gap: Spacing.sm },
  liNum: { color: Colors.gold, fontSize: 14, lineHeight: 22, minWidth: 26, textAlign: 'right', fontWeight: '700' },
  liDot: { color: Colors.goldDark, fontSize: 10, lineHeight: 22 },
  liText: { flex: 1, color: Colors.text, fontSize: 14, lineHeight: 22 },
  nav: { flexDirection: 'row', gap: Spacing.md },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(232,199,122,0.35)',
  },
  navText: { flex: 1, color: Colors.goldLight, fontSize: 13, fontWeight: '600' },
});
