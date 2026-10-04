import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';

type Mote = { x: number; y: number; size: number; drift: number; duration: number; delay: number; glow: boolean };

// Sabit "rastgele" dağılım: her açılışta aynı ama doğal görünen toz zerreleri.
const MOTES: Mote[] = Array.from({ length: 18 }, (_, i) => {
  const r = (n: number) => {
    const v = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  return {
    x: r(1) * 100,
    y: 15 + r(2) * 75,
    size: 1.5 + r(3) * 2.8,
    drift: 18 + r(4) * 40,
    duration: 5000 + r(5) * 6000,
    delay: r(6) * 4000,
    glow: r(7) > 0.7,
  };
});

function Particle({ m }: { m: Mote }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(m.delay, withRepeat(withTiming(1, { duration: m.duration, easing: Easing.linear }), -1, false));
  }, [m, t]);
  const style = useAnimatedStyle(() => ({
    opacity: Math.sin(t.value * Math.PI) * (m.glow ? 0.95 : 0.6),
    transform: [{ translateY: -t.value * m.drift }, { translateX: Math.sin(t.value * Math.PI * 2) * 4 }],
  }));
  return (
    <Animated.View
      style={[
        styles.mote,
        {
          left: `${m.x}%`,
          top: `${m.y}%`,
          width: m.size,
          height: m.size,
          borderRadius: m.size,
          shadowRadius: m.glow ? 6 : 2,
        },
        style,
      ]}
    />
  );
}

/** Işıkta uçuşan altın toz zerreleri (dekoratif, dokunmayı engellemez). */
export function DustField() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {MOTES.map((m, i) => (
        <Particle key={i} m={m} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  mote: {
    position: 'absolute',
    backgroundColor: '#F4D58A',
    shadowColor: '#F4D58A',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
  },
});
