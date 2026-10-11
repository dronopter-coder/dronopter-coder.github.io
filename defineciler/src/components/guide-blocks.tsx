import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radius } from '@/constants/theme';
import type { GuideSection } from '@/data/guide';

/** Rehber ve İşaretler sayfalarındaki ipucu / uyarı kutusu. */
export function Callout({ kind, text }: NonNullable<GuideSection['callout']>) {
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

export function Pairs({ items }: { items: NonNullable<GuideSection['pairs']> }) {
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

const styles = StyleSheet.create({
  pairs: { borderRadius: Radius.md, backgroundColor: 'rgba(0,0,0,0.18)', paddingHorizontal: 12 },
  pair: { paddingVertical: 10, gap: 2 },
  pairDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border },
  term: { color: Colors.goldLight, fontSize: 14, fontWeight: '700' },
  desc: { color: Colors.text, fontSize: 14, lineHeight: 20 },
  callout: { flexDirection: 'row', gap: 10, padding: 12, borderRadius: Radius.md, borderWidth: StyleSheet.hairlineWidth },
  calloutTip: { backgroundColor: 'rgba(212,162,76,0.1)', borderColor: 'rgba(232,199,122,0.45)' },
  calloutWarn: { backgroundColor: 'rgba(224,164,58,0.1)', borderColor: 'rgba(224,164,58,0.5)' },
  calloutText: { flex: 1, color: Colors.text, fontSize: 13, lineHeight: 19 },
});
