import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { AdBanner } from '@/components/ad-banner';
import { confidenceColor } from '@/components/confidence-meter';
import { Button, EmptyState } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { useScans } from '@/hooks/use-scans';

export default function HistoryScreen() {
  const scans = useScans();

  return (
    <View style={{ flex: 1 }}>
      {scans === null ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.gold} />
        </View>
      ) : (
        <FlatList
          data={scans}
          keyExtractor={(s) => s.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="treasure-chest"
              title="Henüz tarama yok"
              text="Taradığınız eserler burada saklanır. İlk eserinizi tarayın!"
              action={<Button title="Tarama Yap" icon="camera" onPress={() => router.navigate('/')} />}
            />
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push({ pathname: '/result/[id]', params: { id: item.id } })}
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}>
              <Image source={{ uri: item.imageUri }} style={styles.thumb} contentFit="cover" />
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.result.title}
                </Text>
                <Text style={styles.sub} numberOfLines={1}>
                  {[item.result.period, item.result.civilization].filter(Boolean).join(' · ') || item.result.category}
                </Text>
                <View style={styles.metaRow}>
                  <View style={[styles.dot, { backgroundColor: confidenceColor(item.result.confidence) }]} />
                  <Text style={styles.meta}>%{Math.round(item.result.confidence)} güven</Text>
                  <Text style={styles.meta}>· {new Date(item.createdAt).toLocaleDateString('tr-TR')}</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.textMuted} />
            </Pressable>
          )}
        />
      )}
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.lg, gap: Spacing.md, flexGrow: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  thumb: { width: 72, height: 72, borderRadius: Radius.md, backgroundColor: Colors.surfaceRaised },
  title: { color: Colors.text, fontFamily: Fonts.serif, fontSize: 16 },
  sub: { color: Colors.textSecondary, fontSize: 13 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  meta: { color: Colors.textMuted, fontSize: 12 },
});
