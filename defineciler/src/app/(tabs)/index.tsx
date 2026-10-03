import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LogoMark } from '@/components/logo';
import { Button, Card, SectionTitle, type IconName } from '@/components/ui';
import { DAILY_FREE_SCANS } from '@/constants/config';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { useRemainingScans } from '@/hooks/use-quota';
import { useScans } from '@/hooks/use-scans';
import { pickFromGallery, takePhoto, type PickedImage } from '@/services/picker';

function openScan(img: PickedImage | null) {
  if (!img) return;
  router.push({ pathname: '/scan', params: { uri: img.uri, width: String(img.width), height: String(img.height) } });
}

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'camera-outline', title: 'Çek', text: 'Eseri net ve aydınlık çekin' },
  { icon: 'brain', title: 'Analiz', text: 'Yapay zeka inceler' },
  { icon: 'script-text-outline', title: 'Öğren', text: 'Dönem, uygarlık, içerik' },
];

const EXPLORE: { href: '/places' | '/guide' | '/news'; icon: IconName; title: string; text: string }[] = [
  { href: '/places', icon: 'map-marker-radius', title: 'Tarihi Bölgeler', text: 'Uygarlıkların izinde 17 bölge' },
  { href: '/guide', icon: 'book-open-page-variant', title: 'Rehber', text: 'Sikke, seramik, işaretler' },
  { href: '/news', icon: 'newspaper-variant-outline', title: 'Haberler', text: 'Güncel kazı ve keşifler' },
];

export default function ScanHome() {
  const remaining = useRemainingScans();
  const scans = useScans();
  const recent = scans?.slice(0, 8) ?? [];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <LogoMark size={40} />
            <Text style={styles.brandText}>Defineciler</Text>
          </View>
          <Link href="/settings" asChild>
            <Pressable hitSlop={12} accessibilityLabel="Ayarlar">
              <MaterialCommunityIcons name="cog-outline" size={26} color={Colors.textSecondary} />
            </Pressable>
          </Link>
        </View>

        <LinearGradient colors={['#3A2A16', '#1F1912']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <MaterialCommunityIcons name="treasure-chest" size={150} color="#D4A24C14" style={styles.heroBg} />
          <Text style={styles.heroKicker}>YAPAY ZEKA İLE ESER TANIMA</Text>
          <Text style={styles.heroTitle}>Elinizdeki eser ne?</Text>
          <Text style={styles.heroText}>
            Fotoğrafını çekin; yapay zeka ne olduğunu, hangi döneme ve uygarlığa ait olduğunu, malzemesini ve üzerindeki yazı ile
            sembolleri anlatsın.
          </Text>
          <View style={{ gap: Spacing.md, marginTop: Spacing.lg }}>
            <Button
              title="Fotoğraf Çek"
              icon="camera"
              onPress={async () => openScan(await takePhoto())}
              style={{ minHeight: 58 }}
            />
            <Button
              title="Galeriden Seç"
              icon="image-multiple"
              variant="secondary"
              onPress={async () => openScan(await pickFromGallery())}
            />
          </View>
          <View style={styles.quota}>
            <MaterialCommunityIcons name="lightning-bolt" size={16} color={Colors.goldLight} />
            <Text style={styles.quotaText}>
              {remaining === null
                ? ' '
                : remaining > 0
                  ? `Bugün ${remaining} analiz hakkınız var`
                  : 'Günlük hakkınız bitti · reklam izleyerek ek hak kazanın'}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.steps}>
          {STEPS.map((s, i) => (
            <View key={s.title} style={styles.step}>
              <View style={styles.stepIcon}>
                <MaterialCommunityIcons name={s.icon} size={22} color={Colors.gold} />
              </View>
              <Text style={styles.stepTitle}>
                {i + 1}. {s.title}
              </Text>
              <Text style={styles.stepText}>{s.text}</Text>
            </View>
          ))}
        </View>

        {recent.length > 0 && (
          <View>
            <View style={styles.rowBetween}>
              <SectionTitle icon="history">Son Taramalar</SectionTitle>
              <Link href="/history" style={styles.link}>
                Tümü
              </Link>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.md }}>
              {recent.map((s) => (
                <Link key={s.id} href={{ pathname: '/result/[id]', params: { id: s.id } }} asChild>
                  <Pressable style={styles.recent}>
                    <Image source={{ uri: s.imageUri }} style={styles.recentImg} contentFit="cover" />
                    <Text style={styles.recentTitle} numberOfLines={2}>
                      {s.result.title}
                    </Text>
                    <Text style={styles.recentSub} numberOfLines={1}>
                      {s.result.period || s.result.category}
                    </Text>
                  </Pressable>
                </Link>
              ))}
            </ScrollView>
          </View>
        )}

        <View>
          <SectionTitle icon="compass-outline">Keşfet</SectionTitle>
          <View style={{ gap: Spacing.md }}>
            {EXPLORE.map((e) => (
              <Link key={e.href} href={e.href} asChild>
                <Pressable>
                  <Card style={styles.explore}>
                    <View style={styles.exploreIcon}>
                      <MaterialCommunityIcons name={e.icon} size={24} color={Colors.gold} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.exploreTitle}>{e.title}</Text>
                      <Text style={styles.exploreText}>{e.text}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.textMuted} />
                  </Card>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        <Text style={styles.footnote}>
          Her gün {DAILY_FREE_SCANS} ücretsiz analiz. Yapay zeka sonuçları tahminidir; kesin tespit için müze uzmanlarına danışın.
          Bulunan eserlerin 3 gün içinde müzeye bildirilmesi yasal zorunluluktur.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.lg, gap: Spacing.xl, paddingBottom: Spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  brandText: { fontFamily: Fonts.serif, fontSize: 26, fontWeight: '700', color: Colors.goldLight, letterSpacing: 0.5 },
  hero: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: '#5A4422',
    overflow: 'hidden',
  },
  heroBg: { position: 'absolute', right: -24, top: -12 },
  heroKicker: { color: Colors.gold, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  heroTitle: { fontFamily: Fonts.serif, color: Colors.text, fontSize: 30, fontWeight: '700', marginTop: 6 },
  heroText: { color: Colors.textSecondary, fontSize: 15, lineHeight: 22, marginTop: Spacing.sm },
  quota: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: Spacing.lg },
  quotaText: { color: Colors.goldLight, fontSize: 13, fontWeight: '600' },
  steps: { flexDirection: 'row', gap: Spacing.sm },
  step: { flex: 1, alignItems: 'center', gap: 4 },
  stepIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepTitle: { color: Colors.text, fontWeight: '700', fontSize: 14 },
  stepText: { color: Colors.textMuted, fontSize: 12, textAlign: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { color: Colors.gold, fontWeight: '700', marginBottom: Spacing.sm },
  recent: { width: 140, gap: 6 },
  recentImg: { width: 140, height: 140, borderRadius: Radius.md, backgroundColor: Colors.surface },
  recentTitle: { color: Colors.text, fontWeight: '700', fontSize: 14 },
  recentSub: { color: Colors.textMuted, fontSize: 12 },
  explore: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md },
  exploreIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreTitle: { color: Colors.text, fontWeight: '700', fontSize: 16 },
  exploreText: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },
  footnote: { color: Colors.textMuted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
