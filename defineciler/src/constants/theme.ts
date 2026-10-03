import { Platform } from 'react-native';

/** Defineciler renk paleti: toprak, bronz ve altın tonları. Uygulama tek (koyu) temalıdır. */
export const Colors = {
  background: '#14100C',
  surface: '#1F1912',
  surfaceRaised: '#2A2219',
  border: '#3A2F22',
  gold: '#D4A24C',
  goldLight: '#F0C870',
  goldDark: '#8A6424',
  text: '#F3E9DA',
  textSecondary: '#B5A58E',
  textMuted: '#7D705E',
  danger: '#D9654B',
  success: '#7FB069',
  warning: '#E0A43A',
  onGold: '#1A130A',
} as const;

export const Fonts = {
  serif: Platform.select({ android: 'serif', ios: 'Georgia', default: 'Georgia, serif' }),
  sans: Platform.select({ android: 'sans-serif', default: 'system-ui' }),
  mono: Platform.select({ android: 'monospace', default: 'monospace' }),
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
} as const;
