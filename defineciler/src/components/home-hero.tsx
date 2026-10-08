import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { DustField } from '@/components/dust-field';
import { Sparkle } from '@/components/sparkle';
import { Colors, Fonts } from '@/constants/theme';

const HERO = require('../../assets/images/home-hero.jpg');
/** Görselin oranı (896×1200): yükseklik = genişlik × RATIO */
const RATIO = 1200 / 896;

/** Köşe çerçevesi (┌ biçiminde); `flip` ile sağ köşe (┐) çizilir. */
function Bracket({ size, flip }: { size: number; flip?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" style={flip ? { transform: [{ scaleX: -1 }] } : undefined}>
      <Path d="M1 19V1h12" stroke="rgba(214,220,206,0.55)" strokeWidth={1.2} fill="none" />
    </Svg>
  );
}

/**
 * Ana sayfa kahraman alanı: koyu zeminde toprak üzerindeki sikkeler. Görselin boş, karanlık üst
 * yarısına `children` (başlık ve alt metinler) yerleşir; etiket, köşe çerçeveleri ve cam kart sabit katmandır.
 */
export function HomeHero({ width: W, children }: { width: number; children: ReactNode }) {
  const H = W * RATIO;
  return (
    <View style={{ width: W, height: H }}>
      <Image source={HERO} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
      <LinearGradient colors={[Colors.night, 'transparent']} style={[styles.fade, { top: 0, height: H * 0.08 }]} />
      <LinearGradient colors={['transparent', Colors.night]} style={[styles.fade, { bottom: 0, height: H * 0.06 }]} />
      <DustField />

      {/* ESER / 2141 etiketi ve nesneyi çevreleyen köşe çerçeveleri */}
      <View pointerEvents="none" style={{ position: 'absolute', left: W * 0.06, top: H * 0.535 }}>
        <Text style={[styles.label, { fontSize: Math.max(9, W * 0.024), letterSpacing: W * 0.005 }]}>ESER / 2141</Text>
        <View style={{ marginTop: 6 }}>
          <Bracket size={W * 0.06} />
        </View>
      </View>
      <View pointerEvents="none" style={{ position: 'absolute', right: W * 0.04, top: H * 0.555 }}>
        <Sparkle size={W * 0.03} filled pulse={false} color="rgba(232,220,190,0.8)" style={{ alignSelf: 'flex-end' }} />
        <Bracket size={W * 0.06} flip />
      </View>

      {/* Cam kart: sağ altta, toprak üzerinde */}
      <View pointerEvents="none" style={[styles.card, { left: W * 0.42, right: W * 0.04, top: H * 0.885, padding: W * 0.026 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardLabel, { fontSize: Math.max(7.5, W * 0.02), letterSpacing: W * 0.002 }]} numberOfLines={1}>
            HER DETAY BİR İPUCU
          </Text>
          <Text style={[styles.cardTitle, { fontSize: W * 0.037, marginTop: W * 0.006 }]} numberOfLines={1}>
            Görünenden fazlası.
          </Text>
        </View>
        <Sparkle size={W * 0.03} pulse={false} color="rgba(232,220,190,0.8)" />
      </View>

      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fade: { position: 'absolute', left: 0, right: 0 },
  label: { color: 'rgba(214,220,206,0.65)', fontWeight: '500' },
  card: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(40,36,28,0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(232,199,122,0.35)',
  },
  cardLabel: { color: 'rgba(242,235,221,0.75)', fontWeight: '600' },
  cardTitle: { fontFamily: Fonts.display, color: '#F2EBDD' },
});
