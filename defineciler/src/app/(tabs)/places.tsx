import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AdBanner } from '@/components/ad-banner';
import { DensityDots } from '@/components/density-dots';
import { Notice } from '@/components/ui';
import { WikiImage } from '@/components/wiki-image';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { PLACES, type Place } from '@/data/places';

const AREAS = ['Tümü', ...Array.from(new Set(PLACES.map((p) => p.area)))];

function PlaceCard({ place }: { place: Place }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/place/[id]', params: { id: place.id } })}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
      <WikiImage photoKey={`place:${place.id}`} wiki={place.wiki} accent={place.accent} icon="pillar" style={styles.cardImage} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardArea}>{place.area.toLocaleUpperCase('tr')}</Text>
          <DensityDots value={place.density} />
        </View>
        <Text style={styles.cardTitle}>{place.name}</Text>
        <Text style={styles.cardSummary} numberOfLines={2}>
          {place.summary}
        </Text>
        <View style={styles.cardMeta}>
          <MaterialCommunityIcons name="calendar-range" size={14} color={Colors.textMuted} />
          <Text style={styles.cardMetaText}>{place.era}</Text>
          <MaterialCommunityIcons name="map-marker-outline" size={14} color={Colors.textMuted} style={{ marginLeft: 8 }} />
          <Text style={[styles.cardMetaText, { flex: 1 }]} numberOfLines={1}>
            {place.provinces.slice(0, 3).join(', ')}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function PlacesScreen() {
  const [area, setArea] = useState('Tümü');
  const data = useMemo(() => (area === 'Tümü' ? PLACES : PLACES.filter((p) => p.area === area)), [area]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={{ gap: Spacing.md }}>
            <Text style={styles.intro}>
              Anadolu’da tarihi yoğunluğu en yüksek bölgeler; uygarlıkları, tipik buluntuları ve müzeleri.
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm }}>
              {AREAS.map((a) => (
                <Pressable key={a} onPress={() => setArea(a)} style={[styles.filter, a === area && styles.filterActive]}>
                  <Text style={[styles.filterText, a === area && { color: Colors.onGold }]}>{a}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => <PlaceCard place={item} />}
        ListFooterComponent={
          <Notice
            tone="warning"
            icon="alert-outline"
            text="Sit alanlarında ve ören yerlerinde izinsiz kazı ve dedektörle arama suçtur. Bu bölüm tarih ve kültür amaçlıdır."
          />
        }
      />
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: Spacing.lg, gap: Spacing.lg },
  intro: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20 },
  filter: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  filterText: { color: Colors.textSecondary, fontWeight: '600', fontSize: 13 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  cardImage: { height: 150 },
  cardBody: { padding: Spacing.lg, gap: 6 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardArea: { color: Colors.gold, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  cardTitle: { color: Colors.text, fontFamily: Fonts.serif, fontSize: 21, fontWeight: '700' },
  cardSummary: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  cardMetaText: { color: Colors.textMuted, fontSize: 12 },
});
