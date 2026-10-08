import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AdBanner } from '@/components/ad-banner';
import { Body, Bullets, Button, Card, EmptyState, SectionTitle } from '@/components/ui';
import { WikiImage } from '@/components/wiki-image';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { getGuideTopic, readingMinutes, type GuideSection } from '@/data/guide';
import type { WikiSummary } from '@/services/wiki';

function Callout({ kind, text }: NonNullable<GuideSection['callout']>) {
  const warn = kind === 'warning';
  return (
    <View style={[styles.callout, warn ? styles.calloutWarn : styles.calloutTip]}>
      <MaterialCommunityIcons
        name={warn ? 'alert-outline' : 'lightbulb-on-outline'}
        size={18}
        color={warn ? Colors.warning : Colors.goldLight}
      />
      <Text style={styles.calloutText}>{text}</Text>
    </View>
  );
}

function Pairs({ items }: { items: NonNullable<GuideSection['pairs']> }) {
  return (
    <View style={styles.pairs}>
      {items.map((p, i) => (
        <View key={p.term} style={[styles.pair, i > 0 && styles.pairDivider]}>
          <Text style={styles.term}>{p.term}</Text>
          <Text style={styles.desc}>{p.desc}</Text>
        </View>
      ))}
    </View>
  );
}

export default function GuideTopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const topic = getGuideTopic(id);
  const [wiki, setWiki] = useState<WikiSummary | null>(null);

  if (!topic) return <EmptyState icon="book-off-outline" title="Konu bulunamadı" />;
  const related = (topic.related ?? []).map(getGuideTopic).filter((t) => !!t);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: Spacing.xxl }}>
      <Stack.Screen options={{ title: topic.title }} />
      <WikiImage
        photoKey={`guide:${topic.id}`}
        wiki={topic.wiki}
        accent={topic.accent}
        icon={topic.icon}
        style={styles.hero}
        showCredit
        onSummary={setWiki}
      />
      <View style={styles.body}>
        <View style={{ gap: 4 }}>
          <Text style={styles.title}>{topic.title}</Text>
          <Text style={styles.subtitle}>{topic.subtitle}</Text>
          <Text style={styles.minutes}>
            <MaterialCommunityIcons name="clock-outline" size={13} color={Colors.gold} /> {readingMinutes(topic)} dk okuma ·{' '}
            {topic.sections.length} bölüm
          </Text>
        </View>

        {topic.facts?.length ? (
          <View style={styles.facts}>
            {topic.facts.map((f) => (
              <View key={f.label} style={styles.fact}>
                <Text style={styles.factLabel}>{f.label}</Text>
                <Text style={styles.factValue}>{f.value}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {topic.sections.map((s, i) => (
          <View key={s.heading} style={{ gap: Spacing.lg }}>
            <Card style={{ gap: Spacing.sm }}>
              <SectionTitle icon="bookmark-outline" style={{ marginBottom: 0 }}>
                {s.heading}
              </SectionTitle>
              {s.body && <Body>{s.body}</Body>}
              {s.bullets && <Bullets items={s.bullets} />}
              {s.pairs && <Pairs items={s.pairs} />}
              {s.callout && <Callout {...s.callout} />}
            </Card>
            {((i === 0 && topic.sections.length > 1) || (i === 2 && topic.sections.length > 3)) && <AdBanner variant="inline" />}
          </View>
        ))}

        {wiki?.extract && topic.wiki?.tr ? (
          <Card style={{ gap: Spacing.md }}>
            <SectionTitle icon="wikipedia" style={{ marginBottom: 0 }}>
              Wikipedia’dan
            </SectionTitle>
            <Body muted>{wiki.extract}</Body>
            <Button
              title="Devamını oku"
              icon="open-in-new"
              variant="secondary"
              onPress={() => WebBrowser.openBrowserAsync(wiki.url)}
            />
          </Card>
        ) : null}

        <Button title="Elindeki eseri tara" icon="line-scan" onPress={() => router.navigate('/')} />

        {related.length ? (
          <View style={{ gap: Spacing.sm }}>
            <Text style={styles.relatedTitle}>İlgili konular</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.md }}>
              {related.map((r) => (
                <Pressable
                  key={r.id}
                  onPress={() => router.push({ pathname: '/guide/[id]', params: { id: r.id } })}
                  style={({ pressed }) => [styles.related, pressed && { opacity: 0.85 }]}>
                  <WikiImage photoKey={`guide:${r.id}`} wiki={r.wiki} accent={r.accent} icon={r.icon} style={styles.relatedImg} />
                  <Text style={styles.relatedName} numberOfLines={2}>
                    {r.title}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { height: 200 },
  body: { padding: Spacing.lg, gap: Spacing.lg },
  title: { color: Colors.text, fontFamily: Fonts.serif, fontSize: 28 },
  subtitle: { color: Colors.textSecondary, fontSize: 15 },
  minutes: { color: Colors.gold, fontSize: 13, fontWeight: '600', marginTop: 4 },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  fact: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(212,162,76,0.1)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(232,199,122,0.4)',
  },
  factLabel: { color: Colors.textMuted, fontSize: 11 },
  factValue: { color: Colors.text, fontSize: 13, fontWeight: '700', marginTop: 1 },
  pairs: { borderRadius: Radius.md, backgroundColor: 'rgba(0,0,0,0.18)', paddingHorizontal: 12 },
  pair: { paddingVertical: 10, gap: 2 },
  pairDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border },
  term: { color: Colors.goldLight, fontSize: 14, fontWeight: '700' },
  desc: { color: Colors.text, fontSize: 14, lineHeight: 20 },
  callout: { flexDirection: 'row', gap: 10, padding: 12, borderRadius: Radius.md, borderWidth: StyleSheet.hairlineWidth },
  calloutTip: { backgroundColor: 'rgba(212,162,76,0.1)', borderColor: 'rgba(232,199,122,0.45)' },
  calloutWarn: { backgroundColor: 'rgba(224,164,58,0.1)', borderColor: 'rgba(224,164,58,0.5)' },
  calloutText: { flex: 1, color: Colors.text, fontSize: 13, lineHeight: 19 },
  relatedTitle: { fontFamily: Fonts.display, color: Colors.goldLight, fontSize: 18 },
  related: {
    width: 140,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  relatedImg: { height: 80 },
  relatedName: { color: Colors.text, fontSize: 13, fontWeight: '600', padding: 8 },
});
