import { useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

/** Dört köşeli parıltı yıldızı; isteğe bağlı yavaş "nefes alma" animasyonu. */
export function Sparkle({
  size = 28,
  color = '#E8C77A',
  filled = false,
  pulse = true,
  style,
}: {
  size?: number;
  color?: string;
  filled?: boolean;
  pulse?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const v = useSharedValue(1);
  useEffect(() => {
    if (pulse) v.value = withRepeat(withTiming(0.45, { duration: 1800, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [pulse, v]);
  const anim = useAnimatedStyle(() => ({ opacity: v.value, transform: [{ scale: 0.92 + v.value * 0.08 }] }));
  return (
    <Animated.View style={[{ width: size, height: size }, anim, style]} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M12 1.5 C12.6 7.5 16.5 11.4 22.5 12 C16.5 12.6 12.6 16.5 12 22.5 C11.4 16.5 7.5 12.6 1.5 12 C7.5 11.4 11.4 7.5 12 1.5 Z"
          fill={filled ? color : 'none'}
          stroke={color}
          strokeWidth={filled ? 0 : 1.3}
          strokeLinejoin="round"
        />
      </Svg>
    </Animated.View>
  );
}
