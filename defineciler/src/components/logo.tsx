import { StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { EMBLEM_XML } from '@/components/emblem-xml';
import { Colors, Fonts } from '@/constants/theme';

/** Defineciler amblemi: Lidya aslanlı altın sikke (kaynak: scripts/build-emblem.mjs). */
export function LogoMark({ size = 64 }: { size?: number }) {
  return <SvgXml xml={EMBLEM_XML} width={size} height={size} />;
}

/** "DEFİNECİLER" yazı logosu: Roma yazıtı harfleri, altın, geniş aralıklı. */
export function Wordmark({ size = 20, tagline = true }: { size?: number; tagline?: boolean }) {
  return (
    <View>
      <Text style={[styles.word, { fontSize: size, letterSpacing: size * 0.16 }]} numberOfLines={1}>
        DEFİNECİLER
      </Text>
      {tagline ? (
        <View style={styles.taglineRow}>
          <View style={styles.rule} />
          <Text style={[styles.tagline, { fontSize: Math.max(8, size * 0.42) }]} numberOfLines={1}>
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
  tagline: { color: Colors.sage, letterSpacing: 1.6, fontFamily: Fonts.sans },
});
