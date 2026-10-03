import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { AdBanner } from '@/components/ad-banner';
import { Button, EmptyState } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { ApiError } from '@/services/api';
import { getCachedNews, loadNews, type NewsItem } from '@/services/news';

function timeAgo(iso: string | null) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff)) return '';
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'az önce';
  if (h < 24) return `${h} saat önce`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} gün önce`;
  return new Date(iso).toLocaleDateString('tr-TR');
}

function NewsCard({ item, featured }: { item: NewsItem; featured?: boolean }) {
  return (
    <Pressable
      onPress={() => WebBrowser.openBrowserAsync(item.link)}
      style={({ pressed }) => [styles.card, featured && styles.featured, pressed && { opacity: 0.85 }]}>
      <View style={featured ? styles.featuredImage : styles.thumb}>
        <MaterialCommunityIcons name="newspaper-variant-outline" size={featured ? 48 : 28} color={Colors.border} />
        {item.image && <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />}
      </View>
      <View style={[styles.cardBody, featured && { padding: Spacing.lg }]}>
        <Text style={[styles.title, featured && styles.featuredTitle]} numberOfLines={featured ? 3 : 3}>
          {item.title}
        </Text>
        {featured && !!item.summary && (
          <Text style={styles.summary} numberOfLines={3}>
            {item.summary}
          </Text>
        )}
        <View style={styles.meta}>
          <Text style={styles.source} numberOfLines={1}>
            {item.source}
          </Text>
          <Text style={styles.time}>{timeAgo(item.publishedAt)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function NewsScreen() {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const apply = useCallback((p: Promise<{ items: NewsItem[] }>) => {
    return p.then(
      (data) => {
        setItems(data.items);
        setError(null);
      },
      (e) => {
        setError(e instanceof ApiError ? e.message : 'Haberler yüklenemedi.');
        setItems((cur) => cur ?? []);
      },
    );
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await apply(loadNews());
    setRefreshing(false);
  }, [apply]);

  useEffect(() => {
    getCachedNews().then((c) => c && setItems((cur) => (cur && cur.length ? cur : c.items)));
    apply(loadNews());
  }, [apply]);

  return (
    <View style={{ flex: 1 }}>
      {items === null && !error ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.gold} />
        </View>
      ) : (
        <FlatList
          data={items ?? []}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={Colors.gold} colors={[Colors.gold]} />
          }
          ListHeaderComponent={
            error && items?.length ? <Text style={styles.offline}>Çevrimdışı: son kaydedilen haberler gösteriliyor.</Text> : null
          }
          ListEmptyComponent={
            <EmptyState
              icon="wifi-off"
              title="Haberler yüklenemedi"
              text={error ?? 'Şu anda gösterilecek haber yok.'}
              action={<Button title="Tekrar dene" icon="refresh" variant="secondary" onPress={refresh} />}
            />
          }
          renderItem={({ item, index }) => <NewsCard item={item} featured={index === 0} />}
        />
      )}
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.lg, gap: Spacing.md },
  offline: { color: Colors.warning, fontSize: 12, textAlign: 'center', marginBottom: Spacing.sm },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  featured: { flexDirection: 'column' },
  thumb: { width: 110, minHeight: 110, backgroundColor: Colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  featuredImage: { height: 190, backgroundColor: Colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1, padding: Spacing.md, gap: 6, justifyContent: 'space-between' },
  title: { color: Colors.text, fontSize: 15, fontWeight: '700', lineHeight: 21 },
  featuredTitle: { fontFamily: Fonts.serif, fontSize: 20, lineHeight: 26 },
  summary: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.sm },
  source: { color: Colors.gold, fontSize: 12, fontWeight: '700', flex: 1 },
  time: { color: Colors.textMuted, fontSize: 12 },
});
