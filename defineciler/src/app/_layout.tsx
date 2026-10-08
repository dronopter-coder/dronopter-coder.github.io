import { Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { PlayfairDisplay_700Bold, PlayfairDisplay_700Bold_Italic, useFonts } from '@expo-google-fonts/playfair-display';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { Colors, Fonts } from '@/constants/theme';
import { initAds } from '@/services/ads';
import { preloadSfx } from '@/services/sfx';

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
  const [fontsLoaded, fontError] = useFonts({ PlayfairDisplay_700Bold, PlayfairDisplay_700Bold_Italic, Cinzel_700Bold });

  useEffect(() => {
    // Reklam onayı (UMP), SDK başlatma ve ses efektleri; arayüzü bekletmez.
    initAds();
    preloadSfx();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.goldLight,
          headerTitleStyle: { fontFamily: Fonts.serif, color: Colors.text },
          contentStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="scan" options={{ title: 'Eser Analizi' }} />
        <Stack.Screen name="result/[id]" options={{ title: 'Analiz Sonucu' }} />
        <Stack.Screen name="place/[id]" options={{ title: '' }} />
        <Stack.Screen name="guide/[id]" options={{ title: '' }} />
        <Stack.Screen name="documents/[group]" options={{ title: '' }} />
        <Stack.Screen name="settings" options={{ title: 'Ayarlar ve Hakkında' }} />
      </Stack>
    </ThemeProvider>
  );
}
