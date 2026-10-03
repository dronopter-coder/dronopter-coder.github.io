import { Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AdBanner } from '@/components/ad-banner';
import { Body, Bullets, Button, Card, EmptyState, SectionTitle } from '@/components/ui';
import { WikiImage } from '@/components/wiki-image';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { getGuideTopic } from '@/data/guide';
import type { WikiSummary } from '@/services/wiki';

export default function GuideTopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const topic = getGuideTopic(id);
  const [wiki, setWiki] = useState<WikiSummary | null>(null);

  if (!topic) return <EmptyState icon="book-off-outline" title="Konu bulunamadı" />;

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
        </View>
        {topic.sections.map((s, i) => (
          <View key={s.heading} style={{ gap: Spacing.lg }}>
            <Card style={{ gap: Spacing.sm }}>
              <SectionTitle icon="bookmark-outline" style={{ marginBottom: 0 }}>
                {s.heading}
              </SectionTitle>
              {s.body && <Body>{s.body}</Body>}
              {s.bullets && <Bullets items={s.bullets} />}
            </Card>
            {i === 0 && topic.sections.length > 1 && <AdBanner variant="inline" />}
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { height: 200 },
  body: { padding: Spacing.lg, gap: Spacing.lg },
  title: { color: Colors.text, fontFamily: Fonts.serif, fontSize: 28, fontWeight: '700' },
  subtitle: { color: Colors.textSecondary, fontSize: 15 },
});
