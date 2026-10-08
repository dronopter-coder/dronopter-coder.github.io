import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AdBanner } from '@/components/ad-banner';
import { WikiImage } from '@/components/wiki-image';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { GUIDE, GUIDE_CATEGORIES, readingMinutes, type GuideCategory, type GuideTopic } from '@/data/guide';

const FEATURED_ID = 'yasal';
const open = (id: string) => router.push({ pathname: '/guide/[id]', params: { id } });

function Featured({ topic }: { topic: GuideTopic }) {
  return (
    <Pressable onPress={() => open(topic.id)} style={({ pressed }) => [styles.featured, pressed && { opacity: 0.9 }]}>
      <WikiImage
        photoKey={`guide:${topic.id}`}
        wiki={topic.wiki}
        accent={topic.accent}
        icon={topic.icon}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient colors={['rgba(12,10,6,0.1)', 'rgba(12,10,6,0.92)']} style={StyleSheet.absoluteFill} />
      <View style={styles.featuredBody}>
        <View style={styles.featuredTag}>
          <MaterialCommunityIcons name="star-four-points" size={12} color={Colors.onGold} />
          <Text style={styles.featuredTagText}>MUTLAKA OKUYUN</Text>
        </View>
        <Text style={styles.featuredTitle}>{topic.title}</Text>
        <Text style={styles.featuredSub} numberOfLines={2}>
          {topic.subtitle} · {readingMinutes(topic)} dk
        </Text>
      </View>
    </Pressable>
  );
}

export default function GuideScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = (Math.min(width, 800) - Spacing.lg * 2 - Spacing.md) / 2;
  const [category, setCategory] = useState<GuideCategory | 'all'>('all');
  const featured = GUIDE.find((g) => g.id === FEATURED_ID)!;
  const topics = useMemo(
    () => GUIDE.filter((g) => g.id !== FEATURED_ID && (category === 'all' || g.category === category)),
    [category],
  );
  const chips: { id: GuideCategory | 'all'; label: string }[] = [{ id: 'all', label: 'Tümü' }, ...GUIDE_CATEGORIES];

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={topics}
        keyExtractor={(g) => g.id}
        numColumns={2}
        columnWrapperStyle={{ gap: Spacing.md }}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={{ gap: Spacing.md }}>
            <Text style={styles.intro}>
              {GUIDE.length} konu: sikkelerden yazıtlara, sahte eserlerden yasal haklarınıza kadar eserleri tanımayı öğrenin.
            </Text>
            <Featured topic={featured} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {chips.map((c) => {
                const active = c.id === category;
                const count =
                  c.id === 'all' ? GUIDE.length - 1 : GUIDE.filter((g) => g.category === c.id && g.id !== FEATURED_ID).length;
                return (
                  <Pressable key={c.id} onPress={() => setCategory(c.id)} style={[styles.chip, active && styles.chipActive]}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {c.label} · {count}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => open(item.id)}
            style={({ pressed }) => [styles.card, { width: cardWidth }, pressed && { opacity: 0.85 }]}>
            <WikiImage
              photoKey={`guide:${item.id}`}
              wiki={item.wiki}
              accent={item.accent}
              icon={item.icon}
              style={styles.image}
            />
            <View style={styles.badge}>
              <MaterialCommunityIcons name={item.icon} size={18} color={Colors.onGold} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={2}>
                {item.subtitle}
              </Text>
              <Text style={styles.minutes}>{readingMinutes(item)} dk okuma</Text>
            </View>
          </Pressable>
        )}
      />
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: Spacing.lg, gap: Spacing.md },
  intro: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20 },
  featured: {
    height: 180,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(232,199,122,0.5)',
    justifyContent: 'flex-end',
  },
  featuredBody: { padding: Spacing.lg, gap: 4 },
  featuredTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: Colors.gold,
    marginBottom: 4,
  },
  featuredTagText: { color: Colors.onGold, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  featuredTitle: { fontFamily: Fonts.display, color: '#F2EBDD', fontSize: 22 },
  featuredSub: { color: Colors.textSecondary, fontSize: 13 },
  chips: { gap: Spacing.sm, paddingVertical: 2 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  chipText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: Colors.onGold },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  image: { height: 110 },
  badge: {
    position: 'absolute',
    top: 92,
    left: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  cardBody: { padding: Spacing.md, paddingTop: Spacing.xl, gap: 4 },
  title: { color: Colors.text, fontFamily: Fonts.serif, fontSize: 16 },
  subtitle: { color: Colors.textMuted, fontSize: 12, lineHeight: 17 },
  minutes: { color: Colors.gold, fontSize: 11, fontWeight: '600', marginTop: 2 },
});
