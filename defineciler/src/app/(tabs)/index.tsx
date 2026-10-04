import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DustField } from '@/components/dust-field';
import { LogoMark, Wordmark } from '@/components/logo';
import { Sparkle } from '@/components/sparkle';
import { Button, type IconName } from '@/components/ui';
import { DAILY_FREE_SCANS } from '@/constants/config';
import { Colors, Fonts, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useRemainingScans } from '@/hooks/use-quota';
import { useScans } from '@/hooks/use-scans';
import { pickFromGallery, takePhoto, type PickedImage } from '@/services/picker';

const HERO = require('../../../assets/images/home-hero.jpg');

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

/**
 * Kahraman görseli: kare fotoğraf; içindeki hazır cam kartın (x %51–94, y %78–94) üstüne yazılar
 * görselin genişliğine oranlı konumlanır, böylece her ekran boyutunda karta oturur.
 */
function Hero({ width }: { width: number }) {
  const W = width;
  return (
    <View style={{ width: W, height: W }}>
      <Image source={HERO} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
      {/* görselin üst kenarını zemine erit */}
      <LinearGradient colors={[Colors.night, 'transparent']} style={[styles.fade, { height: W * 0.22 }]} />
      <LinearGradient
        colors={['transparent', Colors.night]}
        style={[styles.fade, { top: undefined, bottom: 0, height: W * 0.05 }]}
      />
      <DustField />
      <View style={{ position: 'absolute', left: W * 0.575, top: W * 0.792, right: W * 0.075 }} pointerEvents="none">
        <Text
          style={[styles.cardLabel, { fontSize: Math.max(7.5, W * 0.0195), letterSpacing: W * 0.0018 }]}
          numberOfLines={1}
          adjustsFontSizeToFit>
          HER DETAY BİR İPUCU
        </Text>
        <Text style={[styles.cardTitle, { fontSize: W * 0.045, lineHeight: W * 0.052, marginTop: W * 0.012 }]} numberOfLines={2}>
          Görünenden{'\n'}fazlası.
        </Text>
      </View>
    </View>
  );
}

export default function ScanHome() {
  const remaining = useRemainingScans();
  const scans = useScans();
  const recent = scans?.slice(0, 8) ?? [];
  const { width } = useWindowDimensions();
  const heroWidth = Math.min(width, MaxContentWidth);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.brand}>
              <LogoMark size={44} />
              <Wordmark />
            </View>
            <Link href="/settings" asChild>
              <Pressable hitSlop={12} accessibilityLabel="Ayarlar">
                <MaterialCommunityIcons name="cog-outline" size={24} color={Colors.sage} />
              </Pressable>
            </Link>
          </View>

          <View style={styles.intro}>
            <View style={styles.eyebrowRow}>
              <View style={styles.eyebrowDot} />
              <Text style={styles.eyebrow}>MERHABA, KAŞİF.</Text>
            </View>
            <Text style={styles.title}>
              Geçmişin{'\n'}kilidini <Text style={styles.titleAccent}>aç.</Text>
            </Text>
            <Text style={styles.subtitle}>Bir sikke. Bir sembol. Bir sır.</Text>
            <Text style={styles.subtitle}>Elindeki izin hikâyesini bir fotoğrafla keşfet.</Text>
          </View>

          {/* Görselin boş, karanlık üst kısmı metnin altına girer */}
          <View style={{ marginTop: -heroWidth * 0.3, alignSelf: 'center' }}>
            <Hero width={heroWidth} />
          </View>
          <Text style={styles.caption}>TEMSİLİ ESER GÖRSELİ</Text>

          <View style={styles.actions}>
            <Button
              title="Fotoğraf Çek ve Tara"
              icon="camera"
              onPress={async () => openScan(await takePhoto())}
              style={styles.primaryBtn}
            />
            <Pressable
              onPress={async () => openScan(await pickFromGallery())}
              style={({ pressed }) => [styles.glassBtn, pressed && { opacity: 0.8 }]}>
              <MaterialCommunityIcons name="image-multiple" size={20} color={Colors.goldLight} />
              <Text style={styles.glassBtnText}>Galeriden Seç</Text>
            </Pressable>
            <View style={styles.quota}>
              <Sparkle size={14} filled pulse={false} color={Colors.goldLight} />
              <Text style={styles.quotaText}>
                {remaining === null
                  ? ' '
                  : remaining > 0
                    ? `Bugün ${remaining} analiz hakkınız var`
                    : 'Günlük hakkınız bitti · reklam izleyerek ek hak kazanın'}
              </Text>
            </View>
          </View>

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
            <View style={styles.section}>
              <View style={styles.rowBetween}>
                <Text style={styles.sectionTitle}>Son Taramalar</Text>
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Keşfet</Text>
            <View style={{ gap: Spacing.md }}>
              {EXPLORE.map((e) => (
                <Link key={e.href} href={e.href} asChild>
                  <Pressable style={({ pressed }) => [styles.explore, pressed && { opacity: 0.85 }]}>
                    <View style={styles.exploreIcon}>
                      <MaterialCommunityIcons name={e.icon} size={22} color={Colors.gold} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.exploreTitle}>{e.title}</Text>
                      <Text style={styles.exploreText}>{e.text}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.sage} />
                  </Pressable>
                </Link>
              ))}
            </View>
          </View>

          <Text style={styles.footnote}>
            Her gün {DAILY_FREE_SCANS} ücretsiz analiz. Yapay zeka sonuçları tahminidir; kesin tespit için müze uzmanlarına
            danışın. Bulunan eserlerin 3 gün içinde müzeye bildirilmesi yasal zorunluluktur.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const glass = {
  backgroundColor: 'rgba(255,255,255,0.06)',
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: 'rgba(232,199,122,0.28)',
} as const;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.night },
  scroll: { paddingBottom: Spacing.xxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  intro: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, zIndex: 2 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  eyebrowDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.sage,
    shadowColor: Colors.sage,
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  eyebrow: { color: Colors.sage, fontSize: 13, letterSpacing: 3.2, fontWeight: '600' },
  title: {
    fontFamily: Fonts.display,
    color: '#F2EBDD',
    fontSize: 52,
    lineHeight: 58,
    marginTop: Spacing.lg,
    letterSpacing: -0.5,
  },
  titleAccent: { fontFamily: Fonts.displayItalic, color: '#D9B46A' },
  subtitle: { color: Colors.sage, fontSize: 16, lineHeight: 24, marginTop: Spacing.sm },
  fade: { position: 'absolute', top: 0, left: 0, right: 0 },
  cardLabel: { color: 'rgba(242,235,221,0.75)', fontWeight: '600' },
  cardTitle: { fontFamily: Fonts.display, color: '#F2EBDD' },
  caption: {
    color: 'rgba(169,184,164,0.55)',
    fontSize: 10,
    letterSpacing: 2.5,
    textAlign: 'right',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
  },
  actions: { paddingHorizontal: Spacing.xl, gap: Spacing.md, marginTop: Spacing.lg },
  primaryBtn: {
    minHeight: 58,
    borderRadius: Radius.lg,
    shadowColor: Colors.gold,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  glassBtn: {
    ...glass,
    minHeight: 54,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  glassBtnText: { color: Colors.goldLight, fontSize: 16, fontWeight: '700' },
  quota: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 2 },
  quotaText: { color: Colors.sage, fontSize: 13, fontWeight: '600' },
  steps: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.xl, marginTop: Spacing.xxl },
  step: { flex: 1, alignItems: 'center', gap: 4 },
  stepIcon: {
    ...glass,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepTitle: { color: '#F2EBDD', fontWeight: '700', fontSize: 14 },
  stepText: { color: Colors.sage, fontSize: 12, textAlign: 'center', opacity: 0.8 },
  section: { paddingHorizontal: Spacing.xl, marginTop: Spacing.xxl },
  sectionTitle: { fontFamily: Fonts.display, color: '#E8C77A', fontSize: 20, marginBottom: Spacing.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  link: { color: Colors.gold, fontWeight: '700' },
  recent: { width: 140, gap: 6 },
  recentImg: { width: 140, height: 140, borderRadius: Radius.md, backgroundColor: 'rgba(255,255,255,0.05)' },
  recentTitle: { color: '#F2EBDD', fontWeight: '700', fontSize: 14 },
  recentSub: { color: Colors.sage, fontSize: 12 },
  explore: {
    ...glass,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
  },
  exploreIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(212,162,76,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreTitle: { color: '#F2EBDD', fontWeight: '700', fontSize: 16 },
  exploreText: { color: Colors.sage, fontSize: 13, marginTop: 2 },
  footnote: {
    color: 'rgba(169,184,164,0.6)',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xxl,
  },
});
