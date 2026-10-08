import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useRef, useState, type RefObject } from 'react';
import { Modal, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, G, Line, RadialGradient, Stop } from 'react-native-svg';

import { DustField } from '@/components/dust-field';
import { HERO_LAYOUT } from '@/components/hero-layout';
import { Colors, Fonts } from '@/constants/theme';
import { playPortal, playRoll } from '@/services/sfx';

const BG = require('../../assets/images/home-hero-bg.jpg');
const SEAL = require('../../assets/images/home-hero-seal.png');

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Transition = {
  roll: SharedValue<number>;
  portal: SharedValue<number>;
  spin: SharedValue<number>;
  flash: SharedValue<number>;
};

/**
 * Ana sayfa kahraman sahnesi: arka plan + ayrı katmandaki silindir mühür + cam kart yazıları.
 * Görsel katmanları scripts/split-hero.py ile üretilir.
 */
export function HeroScene({
  width: W,
  roll,
  viewRef,
}: {
  width: number;
  roll: SharedValue<number>;
  viewRef?: RefObject<View | null>;
}) {
  const seal = HERO_LAYOUT.seal;
  const sealStyle = useAnimatedStyle(() => {
    const r = roll.value;
    return {
      opacity: interpolate(Math.abs(r), [0, 0.75, 1], [1, 1, 0]),
      transform: [{ translateX: r * W * 0.75 }, { translateY: Math.abs(r) * W * 0.06 }, { rotate: `${r * 150}deg` }],
    };
  });

  return (
    <View ref={viewRef} style={{ width: W, height: W }} collapsable={false}>
      <Image source={BG} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
      <Animated.View
        pointerEvents="none"
        style={[
          { position: 'absolute', left: W * seal.left, top: W * seal.top, width: W * seal.width, height: W * seal.height },
          sealStyle,
        ]}>
        <Image source={SEAL} style={StyleSheet.absoluteFill} contentFit="fill" />
      </Animated.View>
      {/* görselin üst ve alt kenarını zemine erit */}
      <LinearGradient colors={[Colors.night, 'transparent']} style={[styles.fade, { top: 0, height: W * 0.22 }]} />
      <LinearGradient colors={['transparent', Colors.night]} style={[styles.fade, { bottom: 0, height: W * 0.05 }]} />
      <DustField />
      <Text
        pointerEvents="none"
        style={[
          styles.label,
          {
            left: W * HERO_LAYOUT.label.left,
            top: W * HERO_LAYOUT.label.top,
            fontSize: Math.max(9, W * 0.022),
            letterSpacing: W * 0.0045,
          },
        ]}>
        ESER / 2141
      </Text>
      <View style={{ position: 'absolute', left: W * 0.575, top: W * 0.792, right: W * 0.075 }} pointerEvents="none">
        <Text
          style={[styles.cardLabel, { fontSize: Math.max(7.5, W * 0.0195), letterSpacing: W * 0.0018 }]}
          numberOfLines={1}
          adjustsFontSizeToFit>
          HER DETAY BİR İPUCU
        </Text>
        <Text style={[styles.cardTitle, { fontSize: W * 0.045, lineHeight: W * 0.052, marginTop: W * 0.012 }]} numberOfLines={2}>
          Görünenden{'\n'}fazlası.
        </Text>
      </View>
    </View>
  );
}

/** Kil tabletin ortasından açılıp tüm ekranı kaplayan boyut kapısı. */
function PortalOverlay({ cx, cy, t }: { cx: number; cy: number; t: Transition }) {
  const { width, height } = useWindowDimensions();
  // Kapı, merkezden ekranın en uzak köşesine kadar büyümeli.
  const R = Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy)) * 1.15;
  const D = R * 2;

  const grow = useAnimatedStyle(() => ({
    opacity: interpolate(t.portal.value, [0, 0.08, 1], [0, 1, 1]),
    transform: [{ scale: interpolate(t.portal.value, [0, 1], [0.01, 1]) }],
  }));
  const spinA = useAnimatedStyle(() => ({ transform: [{ rotate: `${t.spin.value}deg` }] }));
  const spinB = useAnimatedStyle(() => ({ transform: [{ rotate: `${-t.spin.value * 1.6}deg` }] }));
  const flash = useAnimatedStyle(() => ({ opacity: t.flash.value }));

  const rays = Array.from({ length: 24 }, (_, i) => (i / 24) * Math.PI * 2);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[{ position: 'absolute', left: cx - R, top: cy - R, width: D, height: D }, grow]}>
        <Svg width={D} height={D} viewBox="-100 -100 200 200" style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="core" cx="0" cy="0" r="100" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#FFFBEA" />
              <Stop offset="0.12" stopColor="#FFE7A0" />
              <Stop offset="0.3" stopColor="#E0A845" />
              <Stop offset="0.55" stopColor="#5B2C83" />
              <Stop offset="0.8" stopColor="#0F3B33" />
              <Stop offset="1" stopColor="#0B1310" />
            </RadialGradient>
          </Defs>
          <Circle r="100" fill="url(#core)" />
        </Svg>
        <Animated.View style={[StyleSheet.absoluteFill, spinA]}>
          <Svg width={D} height={D} viewBox="-100 -100 200 200">
            <G opacity={0.85}>
              {rays.map((a, i) => (
                <Line
                  key={i}
                  x1={Math.cos(a) * 14}
                  y1={Math.sin(a) * 14}
                  x2={Math.cos(a + 0.35) * 70}
                  y2={Math.sin(a + 0.35) * 70}
                  stroke={i % 2 ? '#FFE7A0' : '#C9A2FF'}
                  strokeWidth={i % 3 ? 0.6 : 1.2}
                  strokeLinecap="round"
                  opacity={0.6}
                />
              ))}
            </G>
            <Circle r="34" fill="none" stroke="#FFE7A0" strokeWidth="1.4" strokeDasharray="6 4" opacity={0.9} />
            <Circle r="58" fill="none" stroke="#D4A24C" strokeWidth="0.8" strokeDasharray="2 5" opacity={0.7} />
          </Svg>
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, spinB]}>
          <Svg width={D} height={D} viewBox="-100 -100 200 200">
            <Circle r="22" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="12 6 2 6" opacity={0.85} />
            <Circle r="46" fill="none" stroke="#B48CFF" strokeWidth="1" strokeDasharray="20 10" opacity={0.6} />
            <Circle r="82" fill="none" stroke="#FFE7A0" strokeWidth="0.6" strokeDasharray="1 6" opacity={0.6} />
          </Svg>
        </Animated.View>
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#FFF6DC' }, flash]} />
    </View>
  );
}

/**
 * "Fotoğraf Çek ve Tara" geçişi: mühür sağa yuvarlanır, tabletin ortasında boyut kapısı açılıp
 * ekranı kaplar, parlamayla kamera açılır. Kamera kapanınca `restore()` sahneyi geri getirir.
 */
export function useCameraTransition(heroRef: RefObject<View | null>, heroWidth: number) {
  const roll = useSharedValue(0);
  const portal = useSharedValue(0);
  const spin = useSharedValue(0);
  const flash = useSharedValue(0);
  const [center, setCenter] = useState<{ x: number; y: number } | null>(null);
  const running = useRef(false);

  const run = useCallback(async () => {
    if (running.current) return false;
    running.current = true;
    const pos = await new Promise<{ x: number; y: number }>((resolve) => {
      const node = heroRef.current;
      if (!node) return resolve({ x: heroWidth / 2, y: heroWidth });
      node.measureInWindow((x, y) =>
        resolve({ x: x + heroWidth * HERO_LAYOUT.portal.x, y: y + heroWidth * HERO_LAYOUT.portal.y }),
      );
    });
    setCenter(pos);
    playRoll();
    roll.set(withTiming(1, { duration: 750, easing: Easing.in(Easing.quad) }));
    await wait(420);
    playPortal();
    spin.set(0);
    spin.set(withRepeat(withTiming(360, { duration: 1600, easing: Easing.linear }), -1));
    portal.set(withTiming(1, { duration: 820, easing: Easing.in(Easing.cubic) }));
    await wait(760);
    flash.set(withTiming(1, { duration: 200 }));
    await wait(230);
    return true;
  }, [flash, heroRef, heroWidth, portal, roll, spin]);

  const restore = useCallback(() => {
    flash.set(withTiming(0, { duration: 380 }));
    portal.set(withTiming(0, { duration: 420, easing: Easing.out(Easing.quad) }));
    // mühür bu kez soldan yuvarlanarak yerine döner
    roll.set(-0.9);
    roll.set(withTiming(0, { duration: 650, easing: Easing.out(Easing.quad) }));
    setTimeout(() => {
      cancelAnimation(spin);
      setCenter(null);
      running.current = false;
    }, 450);
  }, [flash, portal, roll, spin]);

  const overlay = (
    <Modal visible={!!center} transparent animationType="none" statusBarTranslucent navigationBarTranslucent>
      {center ? <PortalOverlay cx={center.x} cy={center.y} t={{ roll, portal, spin, flash }} /> : null}
    </Modal>
  );

  return { roll, run, restore, overlay };
}

const styles = StyleSheet.create({
  fade: { position: 'absolute', left: 0, right: 0 },
  label: { position: 'absolute', color: 'rgba(214,220,206,0.62)', fontWeight: '500' },
  cardLabel: { color: 'rgba(242,235,221,0.75)', fontWeight: '600' },
  cardTitle: { fontFamily: Fonts.display, color: '#F2EBDD' },
});
