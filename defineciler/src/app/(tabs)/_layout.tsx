import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';
import type { ColorValue } from 'react-native';

import type { IconName } from '@/components/ui';
import { Colors, Fonts } from '@/constants/theme';

function TabIcon({ name, color, size }: { name: IconName; color: ColorValue; size: number }) {
  return <MaterialCommunityIcons name={name} color={color as string} size={size} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTitleStyle: { fontFamily: Fonts.serif, color: Colors.text, fontSize: 22 },
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.border },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', lineHeight: 15 },
        sceneStyle: { backgroundColor: Colors.background },
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Tara', headerShown: false, tabBarIcon: (p) => <TabIcon name="line-scan" {...p} /> }}
      />
      <Tabs.Screen
        name="places"
        options={{
          title: 'Bölgeler',
          headerTitle: 'Tarihi Bölgeler',
          tabBarIcon: (p) => <TabIcon name="map-marker-radius" {...p} />,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Belgeler',
          headerTitle: 'Eşkıya Belgeleri',
          tabBarIcon: (p) => <TabIcon name="script-text-outline" {...p} />,
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'Haberler',
          headerTitle: 'Arkeoloji Haberleri',
          tabBarIcon: (p) => <TabIcon name="newspaper-variant-outline" {...p} />,
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: 'Rehber',
          headerTitle: 'Definecinin Rehberi',
          tabBarIcon: (p) => <TabIcon name="book-open-page-variant" {...p} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: 'Geçmiş', headerTitle: 'Taramalarım', tabBarIcon: (p) => <TabIcon name="history" {...p} /> }}
      />
    </Tabs>
  );
}
