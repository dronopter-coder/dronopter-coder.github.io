import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AdBanner } from '@/components/ad-banner';
import { DensityDots } from '@/components/density-dots';
import { Body, Bullets, Button, Card, Chip, EmptyState, Notice, SectionTitle } from '@/components/ui';
import { WikiImage } from '@/components/wiki-image';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { LEGAL_NOTICE, getPlace } from '@/data/places';
import type { WikiSummary } from '@/services/wiki';

export default function PlaceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const place = getPlace(id);
  const [wiki, setWiki] = useState<WikiSummary | null>(null);

  if (!place) return <EmptyState icon="map-marker-question-outline" title="Bölge bulunamadı" />;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: place.name }} />
      <ScrollView contentContainerStyle={{ paddingBottom: Spacing.xxl }}>
        <WikiImage wiki={place.wiki} accent={place.accent} icon="pillar" style={styles.hero} onSummary={setWiki} />
        <View style={styles.body}>
          <View style={{ gap: Spacing.sm }}>
            <Text style={styles.area}>
              {place.area.toLocaleUpperCase('tr')} · {place.era}
            </Text>
            <Text style={styles.title}>{place.name}</Text>
            <View style={styles.densityRow}>
              <Text style={styles.densityLabel}>Tarihi yoğunluk</Text>
              <DensityDots value={place.density} />
            </View>
          </View>

          <Body>{place.description}</Body>

          <Card>
            <SectionTitle icon="map-marker-multiple-outline">İller</SectionTitle>
            <View style={styles.chips}>
              {place.provinces.map((p) => (
                <Chip key={p} label={p} />
              ))}
            </View>
          </Card>

          <Card>
            <SectionTitle icon="account-group-outline">Uygarlıklar</SectionTitle>
            <View style={styles.chips}>
              {place.civilizations.map((c) => (
                <Chip key={c} label={c} color={Colors.textSecondary} />
              ))}
            </View>
          </Card>

          <Card>
            <SectionTitle icon="treasure-chest">Tipik buluntular</SectionTitle>
            <Bullets items={place.typicalFinds} />
          </Card>

          <AdBanner variant="inline" />

          <Card>
            <SectionTitle icon="pillar">Önemli ören yerleri</SectionTitle>
            <Bullets items={place.keySites} icon="map-marker" />
          </Card>

          <Card>
            <SectionTitle icon="bank-outline">Görülmesi gereken müzeler</SectionTitle>
            <Bullets items={place.museums} icon="bank" />
          </Card>

          {wiki?.extract ? (
            <Card style={{ gap: Spacing.md }}>
              <SectionTitle icon="wikipedia" style={{ marginBottom: 0 }}>
                {wiki.title}
              </SectionTitle>
              <Body muted>{wiki.extract}</Body>
              <Button
                title="Wikipedia’da oku"
                icon="open-in-new"
                variant="secondary"
                onPress={() => WebBrowser.openBrowserAsync(wiki.url)}
              />
            </Card>
          ) : null}

          <Notice tone="warning" icon="alert-outline" text={LEGAL_NOTICE} />
          <View style={styles.credit}>
            <MaterialCommunityIcons name="creative-commons" size={14} color={Colors.textMuted} />
            <Text style={styles.creditText}>Görsel ve özet: Wikipedia / Wikimedia Commons (CC BY-SA)</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 240 },
  body: { padding: Spacing.lg, gap: Spacing.lg },
  area: { color: Colors.gold, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  title: { color: Colors.text, fontFamily: Fonts.serif, fontSize: 30, fontWeight: '700' },
  densityRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  densityLabel: { color: Colors.textMuted, fontSize: 13 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  credit: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  creditText: { color: Colors.textMuted, fontSize: 11 },
});
