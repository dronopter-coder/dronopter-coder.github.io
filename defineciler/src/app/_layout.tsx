import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { Colors, Fonts } from '@/constants/theme';
import { initAds } from '@/services/ads';

SplashScreen.preventAutoHideAsync();

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.gold,
    background: Colors.background,
    card: Colors.background,
    text: Colors.text,
    border: Colors.border,
    notification: Colors.gold,
  },
};

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
    // Reklam onayı (UMP) ve SDK başlatma; arayüzü bekletmez.
    initAds();
  }, []);

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.goldLight,
          headerTitleStyle: { fontFamily: Fonts.serif, fontWeight: '700', color: Colors.text },
          contentStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="scan" options={{ title: 'Eser Analizi' }} />
        <Stack.Screen name="result/[id]" options={{ title: 'Analiz Sonucu' }} />
        <Stack.Screen name="place/[id]" options={{ title: '' }} />
        <Stack.Screen name="guide/[id]" options={{ title: '' }} />
        <Stack.Screen name="settings" options={{ title: 'Ayarlar ve Hakkında' }} />
      </Stack>
    </ThemeProvider>
  );
}
