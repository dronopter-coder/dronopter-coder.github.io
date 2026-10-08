import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { EMBLEM_XML } from '@/components/emblem-xml';
import { Colors, Fonts } from '@/constants/theme';

/** Defineciler amblemi: Lidya aslanlı altın sikke (kaynak: scripts/build-emblem.mjs). */
export function LogoMark({ size = 64 }: { size?: number }) {
  return <SvgXml xml={EMBLEM_XML} width={size} height={size} />;
}

/**
 * "DEFİNECİLER" yazı logosu: Roma yazıtı harfleri, altın, geniş aralıklı.
 * `fill` verilirse bulunduğu alanın genişliğini tamamen dolduracak boyutu kendisi hesaplar.
 */
export function Wordmark({ size = 20, tagline = true, fill }: { size?: number; tagline?: boolean; fill?: boolean }) {
  const REF = 20;
  const [box, setBox] = useState(0);
  const [natural, setNatural] = useState(0);
  const fs = fill && box && natural ? Math.min(48, (REF * box) / natural) : size;
  const ready = !fill || (box > 0 && natural > 0);

  return (
    <View style={fill ? { flex: 1 } : undefined} onLayout={fill ? (e) => setBox(e.nativeEvent.layout.width) : undefined}>
      {fill ? (
        // Görünmez ölçüm: yazının REF boyutundaki doğal genişliği
        <View style={styles.measure} pointerEvents="none">
          <Text
            style={[styles.word, { fontSize: REF, letterSpacing: REF * 0.16 }]}
            onLayout={(e) => setNatural(e.nativeEvent.layout.width)}>
            DEFİNECİLER
          </Text>
        </View>
      ) : null}
      <Text style={[styles.word, { fontSize: fs, letterSpacing: fs * 0.16, opacity: ready ? 1 : 0 }]} numberOfLines={1}>
        DEFİNECİLER
      </Text>
      {tagline ? (
        <View style={styles.taglineRow}>
          <View style={styles.rule} />
          <Text style={[styles.tagline, { fontSize: Math.max(7, fs * 0.36), letterSpacing: fs * 0.05 }]} numberOfLines={1}>
            ANADOLU&apos;NUN HAZİNELERİ
          </Text>
          <View style={styles.rule} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  word: {
    fontFamily: Fonts.inscription,
    color: Colors.goldLight,
    textShadowColor: 'rgba(212,162,76,0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  taglineRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  rule: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.goldDark, minWidth: 8 },
  tagline: { color: Colors.sage, fontFamily: Fonts.sans },
  measure: { position: 'absolute', opacity: 0, flexDirection: 'row', width: 2000 },
});
