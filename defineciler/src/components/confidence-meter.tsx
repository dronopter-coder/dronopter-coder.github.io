import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

export function confidenceColor(v: number) {
  if (v >= 70) return Colors.success;
  if (v >= 40) return Colors.warning;
  return Colors.danger;
}

export function confidenceLabel(v: number) {
  if (v >= 80) return 'Yüksek güven';
  if (v >= 60) return 'İyi güven';
  if (v >= 40) return 'Orta güven';
  return 'Düşük güven';
}

export function ConfidenceMeter({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const color = confidenceColor(v);
  return (
    <View style={{ gap: 6 }}>
      <View style={styles.row}>
        <Text style={styles.label}>{confidenceLabel(v)}</Text>
        <Text style={[styles.value, { color }]}>%{v}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${v}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  label: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  value: { fontSize: 18, fontWeight: '800' },
  track: { height: 8, borderRadius: 4, backgroundColor: Colors.surfaceRaised, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
});
