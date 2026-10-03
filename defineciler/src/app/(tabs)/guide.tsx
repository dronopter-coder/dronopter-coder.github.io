import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AdBanner } from '@/components/ad-banner';
import { WikiImage } from '@/components/wiki-image';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { GUIDE } from '@/data/guide';

export default function GuideScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = (Math.min(width, 800) - Spacing.lg * 2 - Spacing.md) / 2;
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={GUIDE}
        keyExtractor={(g) => g.id}
        numColumns={2}
        columnWrapperStyle={{ gap: Spacing.md }}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.intro}>
            Eserleri tanımayı öğrenin: sikkeler, seramikler, mühürler, işaretler ve yasal haklarınız.
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/guide/[id]', params: { id: item.id } })}
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
  intro: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: Spacing.xs },
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
  title: { color: Colors.text, fontFamily: Fonts.serif, fontWeight: '700', fontSize: 16 },
  subtitle: { color: Colors.textMuted, fontSize: 12, lineHeight: 17 },
});
