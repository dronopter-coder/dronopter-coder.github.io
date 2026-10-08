import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Fragment } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AdBanner } from '@/components/ad-banner';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { DOC_GROUPS, DOCS_INTRO, DOCS_TITLE } from '@/data/belgeler.generated';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const SECTION_COUNT = DOC_GROUPS.reduce((n, g) => n + g.sections.length, 0);

export default function DocumentsScreen() {
  const note = DOCS_INTRO.find((b) => b.t === 'note')?.x;
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <LinearGradient colors={['#2A2214', '#15110B']} style={styles.cover}>
        <MaterialCommunityIcons name="script-text-outline" size={30} color={Colors.goldLight} />
        <Text style={styles.coverTitle}>{DOCS_TITLE}</Text>
        <Text style={styles.coverMeta}>
          {DOC_GROUPS.length} bölüm · {SECTION_COUNT} başlık · Martin Voyvoda, Manuk Bey ve beraberindekiler
        </Text>
      </LinearGradient>

      <View style={styles.warning}>
        <MaterialCommunityIcons name="alert-outline" size={20} color={Colors.warning} />
        <Text style={styles.warningText}>
          Bu notlar halk arasında dolaşan, doğruluğu kanıtlanmamış anlatılardır; tarihî belge değildir. İzinsiz kazı 2863 sayılı
          Kanun’a göre suçtur.
        </Text>
      </View>
      {note ? <Text style={styles.note}>{note}</Text> : null}

      {DOC_GROUPS.map((g, i) => (
        <Fragment key={g.id}>
          <Pressable
            onPress={() => router.push({ pathname: '/documents/[group]', params: { group: g.id } })}
            style={({ pressed }) => [styles.group, pressed && { opacity: 0.85 }]}>
            <View style={styles.numeral}>
              <Text style={styles.numeralText}>{ROMAN[i]}</Text>
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={styles.groupTitle}>{g.title}</Text>
              <Text style={styles.groupSub} numberOfLines={2}>
                {g.subtitle}
              </Text>
              <Text style={styles.groupMeta}>
                {g.sections.length} başlık · ~{g.minutes} dk okuma
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.textMuted} />
          </Pressable>
          {i % 2 === 1 && i < DOC_GROUPS.length - 1 ? <AdBanner variant="inline" /> : null}
        </Fragment>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxl },
  cover: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    gap: Spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(232,199,122,0.4)',
  },
  coverTitle: { fontFamily: Fonts.display, color: '#F2EBDD', fontSize: 26, lineHeight: 32 },
  coverMeta: { color: Colors.textSecondary, fontSize: 13, lineHeight: 19 },
  warning: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(224,164,58,0.1)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(224,164,58,0.4)',
  },
  warningText: { flex: 1, color: Colors.text, fontSize: 13, lineHeight: 19 },
  note: { color: Colors.textMuted, fontSize: 12, lineHeight: 18, fontStyle: 'italic' },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  numeral: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212,162,76,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(232,199,122,0.45)',
  },
  numeralText: { fontFamily: Fonts.inscription, color: Colors.goldLight, fontSize: 15 },
  groupTitle: { fontFamily: Fonts.display, color: Colors.text, fontSize: 17 },
  groupSub: { color: Colors.textSecondary, fontSize: 13, lineHeight: 18 },
  groupMeta: { color: Colors.gold, fontSize: 12, fontWeight: '600' },
});
