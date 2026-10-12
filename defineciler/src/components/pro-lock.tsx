import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

/** Pro'ya özel içeriğin önünde gösterilen kilit kartı; üstündeki önizlemeyi aşağı doğru karartır. */
export function ProLock({ title, text }: { title: string; text: string }) {
  return (
    <View>
      <LinearGradient colors={['rgba(20,16,12,0)', Colors.background]} style={styles.fade} pointerEvents="none" />
      <View style={styles.card}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="lock-outline" size={24} color={Colors.onGold} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
        <Button
          title="Defineciler Pro ile aç"
          icon="crown-outline"
          onPress={() => router.push('/paywall')}
          style={{ alignSelf: 'stretch' }}
        />
      </View>
    </View>
  );
}

/** Listelerde kilitli öğeyi belirten küçük rozet. */
export function LockBadge() {
  return (
    <View style={styles.badge}>
      <MaterialCommunityIcons name="lock-outline" size={11} color={Colors.onGold} />
      <Text style={styles.badgeText}>PRO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fade: { position: 'absolute', left: 0, right: 0, top: -120, height: 120 },
  card: {
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(232,199,122,0.5)',
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gold,
  },
  title: { fontFamily: Fonts.display, color: Colors.goldLight, fontSize: 19, textAlign: 'center' },
  text: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20, textAlign: 'center', marginBottom: Spacing.sm },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: Colors.gold,
  },
  badgeText: { color: Colors.onGold, fontSize: 10, fontWeight: '800' },
});
