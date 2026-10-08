import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Fonts, Radius } from '@/constants/theme';

const SPEED = 48; // piksel / saniye

/** Sağdan sola sürekli kayan duyuru şeridi. */
export function MarqueeBanner({ label, text, onPress }: { label: string; text: string; onPress: () => void }) {
  const [boxW, setBoxW] = useState(0);
  const [textW, setTextW] = useState(0);
  const x = useSharedValue(0);

  useEffect(() => {
    if (!boxW || !textW) return;
    x.set(boxW);
    x.set(withRepeat(withTiming(-textW, { duration: ((boxW + textW) / SPEED) * 1000, easing: Easing.linear }), -1));
    return () => cancelAnimation(x);
  }, [boxW, textW, x]);

  const moving = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.85 }]}>
      <View style={styles.badge}>
        <MaterialCommunityIcons name="script-text-outline" size={14} color={Colors.onGold} />
        <Text style={styles.badgeText}>{label}</Text>
      </View>
      <View style={styles.track} onLayout={(e) => setBoxW(e.nativeEvent.layout.width)}>
        <Animated.View style={[styles.mover, moving]}>
          <Text style={styles.text} numberOfLines={1} onLayout={(e) => setTextW(e.nativeEvent.layout.width)}>
            {text}
          </Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: 'rgba(212,162,76,0.1)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(232,199,122,0.55)',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: '100%',
    paddingHorizontal: 10,
    backgroundColor: Colors.gold,
    zIndex: 1,
  },
  badgeText: { fontFamily: Fonts.inscription, color: Colors.onGold, fontSize: 12, letterSpacing: 1 },
  track: { flex: 1, height: '100%', overflow: 'hidden', justifyContent: 'center' },
  mover: { position: 'absolute', left: 0, flexDirection: 'row', width: 4000 },
  text: { color: Colors.goldLight, fontSize: 14, fontWeight: '600', alignSelf: 'flex-start' },
});
