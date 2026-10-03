import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

/** Web önizlemesi: reklam alanının yerini gösteren yer tutucu. */
export function AdBanner({ variant = 'anchored' }: { variant?: 'anchored' | 'inline' }) {
  const inline = variant === 'inline';
  return (
    <View style={[styles.box, inline ? styles.inline : styles.anchored]}>
      <Text style={styles.text}>Reklam alanı ({inline ? '300×250' : 'uyarlanabilir banner'})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  anchored: { height: 56, backgroundColor: Colors.background },
  inline: { height: 250, width: 300, alignSelf: 'center', marginVertical: 16 },
  text: { color: Colors.textMuted, fontSize: 12 },
});
