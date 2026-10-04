import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export function Heading({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.heading, style]}>{children}</Text>;
}

export function SectionTitle({ children, icon, style }: { children: ReactNode; icon?: IconName; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.sectionTitleRow, style]}>
      {icon && <MaterialCommunityIcons name={icon} size={18} color={Colors.gold} />}
      <Text style={styles.sectionTitle}>{children}</Text>
    </View>
  );
}

export function Body({ children, style, muted }: { children: ReactNode; style?: StyleProp<TextStyle>; muted?: boolean }) {
  return <Text style={[styles.body, muted && { color: Colors.textSecondary }, style]}>{children}</Text>;
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Chip({ label, icon, color = Colors.gold }: { label: string; icon?: IconName; color?: string }) {
  return (
    <View style={[styles.chip, { borderColor: color + '66', backgroundColor: color + '1F' }]}>
      {icon && <MaterialCommunityIcons name={icon} size={13} color={color} />}
      <Text style={[styles.chipText, { color }]}>{label}</Text>
    </View>
  );
}

export function Bullets({ items, icon = 'circle-small' }: { items: string[]; icon?: IconName }) {
  return (
    <View style={{ gap: Spacing.sm }}>
      {items.map((item, i) => (
        <View key={i} style={styles.bulletRow}>
          <MaterialCommunityIcons name={icon} size={18} color={Colors.gold} style={{ marginTop: 2 }} />
          <Text style={[styles.body, { flex: 1 }]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

type ButtonProps = {
  title: string;
  onPress?: () => void;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  /** Yüklenirken dönen simgenin yanında gösterilecek metin */
  loadingLabel?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ title, onPress, icon, variant = 'primary', loading, loadingLabel, disabled, style }: ButtonProps) {
  const fg =
    variant === 'primary'
      ? Colors.onGold
      : variant === 'danger'
        ? Colors.danger
        : variant === 'ghost'
          ? Colors.gold
          : Colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'danger' && styles.buttonDanger,
        variant === 'ghost' && styles.buttonGhost,
        (disabled || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
        style,
      ]}>
      {loading ? (
        <>
          <ActivityIndicator color={fg} />
          {loadingLabel && <Text style={[styles.buttonText, { color: fg }]}>{loadingLabel}</Text>}
        </>
      ) : (
        <>
          {icon && <MaterialCommunityIcons name={icon} size={20} color={fg} />}
          <Text style={[styles.buttonText, { color: fg }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

export function EmptyState({ icon, title, text, action }: { icon: IconName; title: string; text?: string; action?: ReactNode }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <MaterialCommunityIcons name={icon} size={36} color={Colors.gold} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {text && <Text style={[styles.body, { color: Colors.textSecondary, textAlign: 'center' }]}>{text}</Text>}
      {action}
    </View>
  );
}

export function Notice({
  text,
  icon = 'information-outline',
  tone = 'info',
}: {
  text: string;
  icon?: IconName;
  tone?: 'info' | 'warning';
}) {
  const color = tone === 'warning' ? Colors.warning : Colors.textSecondary;
  return (
    <View
      style={[
        styles.notice,
        tone === 'warning' && { borderColor: Colors.warning + '55', backgroundColor: Colors.warning + '12' },
      ]}>
      <MaterialCommunityIcons name={icon} size={18} color={color} style={{ marginTop: 1 }} />
      <Text style={[styles.noticeText, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: Fonts.serif,
    fontSize: 26,
    color: Colors.text,
    letterSpacing: 0.3,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  sectionTitle: {
    fontFamily: Fonts.serif,
    fontSize: 17,
    color: Colors.goldLight,
    letterSpacing: 0.3,
  },
  body: { color: Colors.text, fontSize: 15, lineHeight: 22 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  chipText: { fontSize: 12, fontWeight: '600' },
  bulletRow: { flexDirection: 'row', gap: 4 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    minHeight: 50,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.md,
  },
  buttonPrimary: { backgroundColor: Colors.gold },
  buttonSecondary: { backgroundColor: Colors.surfaceRaised, borderWidth: 1, borderColor: Colors.border },
  buttonDanger: { backgroundColor: Colors.danger + '1A', borderWidth: 1, borderColor: Colors.danger + '66' },
  buttonGhost: { backgroundColor: 'transparent' },
  buttonText: { fontSize: 16, fontWeight: '700' },
  empty: { alignItems: 'center', gap: Spacing.md, padding: Spacing.xxl },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: { fontFamily: Fonts.serif, fontSize: 18, color: Colors.text, textAlign: 'center' },
  notice: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  noticeText: { flex: 1, fontSize: 13, lineHeight: 19 },
});
