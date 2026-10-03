import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';

import { Colors } from '@/constants/theme';

/** 1-5 arası tarihi yoğunluk göstergesi. */
export function DensityDots({ value }: { value: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <MaterialCommunityIcons key={i} name="circle" size={8} color={i <= value ? Colors.gold : Colors.border} />
      ))}
    </View>
  );
}
