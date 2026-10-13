import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, type IconName } from '@/components/ui';
import { PRIVACY_URL, PRO_DAILY_SCANS } from '@/constants/config';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { getPlans, planErrorText, proAvailable, purchase, restore, useIsPro, type ProPlan } from '@/services/pro';

const TERMS_URL = 'https://dronopter-coder.github.io/abonelik.html';
const MANAGE_URL = 'https://play.google.com/store/account/subscriptions?package=online.defineciler.app';

const BENEFITS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'advertisements-off', title: 'Reklamsız', text: 'Hiçbir ekranda reklam görmezsiniz.' },
  { icon: 'line-scan', title: `Günde ${PRO_DAILY_SCANS} analiz`, text: 'Reklam izlemeden, bekletmeden.' },
  {
    icon: 'file-document-multiple-outline',
    title: 'Ayrıntılı rapor ve PDF',
    text: 'Ön ve arka yüz birlikte, yazı okuma denemesi, müze örnekleri; raporu PDF olarak kaydedin.',
  },
  { icon: 'lock-open-variant-outline', title: 'Tüm içerik açık', text: 'Belgeler ve Define İşaretleri’nin tamamı.' },
];

export default function PaywallScreen() {
  const pro = useIsPro();
  const [plans, setPlans] = useState<ProPlan[] | null>(null);
  const [selected, setSelected] = useState<ProPlan['id']>('annual');
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchPlans = useCallback(() => {
    getPlans()
      .then((p) => {
        setPlans(p);
        if (p.length && !p.some((x) => x.id === 'annual')) setSelected(p[0].id);
      })
      .catch((e) => {
        setLoadError(planErrorText(e) || 'Bilinmeyen hata');
        setPlans([]);
      });
  }, []);

  useEffect(fetchPlans, [fetchPlans]);

  function retry() {
    setPlans(null);
    setLoadError(null);
    fetchPlans();
  }

  const plan = plans?.find((p) => p.id === selected);

  async function buy() {
    if (!plan) return;
    setBusy(true);
    const outcome = await purchase(plan);
    setBusy(false);
    if (outcome === 'purchased') {
      Alert.alert('Hoş geldiniz!', 'Defineciler Pro etkin. İyi keşifler!', [{ text: 'Tamam', onPress: () => router.back() }]);
    } else if (outcome === 'failed') {
      Alert.alert('Satın alma tamamlanamadı', 'Lütfen biraz sonra tekrar deneyin. Ücret alınmadıysa işlem iptal olmuştur.');
    }
  }

  async function onRestore() {
    setBusy(true);
    const ok = await restore();
    setBusy(false);
    Alert.alert(
      ok ? 'Abonelik geri yüklendi' : 'Etkin abonelik bulunamadı',
      ok ? 'Defineciler Pro yeniden etkin.' : 'Bu Google hesabına ait etkin bir Defineciler Pro aboneliği bulunamadı.',
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.crown}>
          <MaterialCommunityIcons name="crown" size={34} color={Colors.onGold} />
        </View>
        <Text style={styles.title}>Defineciler Pro</Text>
        <Text style={styles.subtitle}>Eserlerinizi daha derinlemesine tanıyın, reklamsız keşfedin.</Text>
      </View>

      <View style={styles.benefits}>
        {BENEFITS.map((b) => (
          <View key={b.title} style={styles.benefit}>
            <MaterialCommunityIcons name={b.icon} size={22} color={Colors.gold} />
            <View style={{ flex: 1 }}>
              <Text style={styles.benefitTitle}>{b.title}</Text>
              <Text style={styles.benefitText}>{b.text}</Text>
            </View>
          </View>
        ))}
      </View>

      {pro ? (
        <View style={{ gap: Spacing.md }}>
          <View style={styles.active}>
            <MaterialCommunityIcons name="check-decagram" size={22} color={Colors.success} />
            <Text style={styles.activeText}>Defineciler Pro üyeliğiniz etkin.</Text>
          </View>
          <Button title="Aboneliği Yönet" icon="cog-outline" variant="secondary" onPress={() => Linking.openURL(MANAGE_URL)} />
        </View>
      ) : plans === null ? (
        <ActivityIndicator color={Colors.gold} style={{ marginVertical: Spacing.xl }} />
      ) : plans.length === 0 && (loadError || proAvailable()) ? (
        <View style={styles.soon}>
          <Text style={styles.soonTitle}>Planlar şu an yüklenemedi</Text>
          <Text style={styles.soonText}>
            Google Play’e ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin. Uygulamayı Google Play’den
            yüklediğinizden emin olun.
          </Text>
          {loadError ? <Text style={styles.errorCode}>{loadError}</Text> : null}
          <Button title="Tekrar dene" icon="refresh" variant="secondary" onPress={retry} />
        </View>
      ) : plans.length === 0 ? (
        <View style={styles.soon}>
          <Text style={styles.soonTitle}>Çok yakında</Text>
          <Text style={styles.soonText}>
            Defineciler Pro birkaç gün içinde açılacak: aylık 79,99 TL veya yıllık 499,99 TL (7 gün ücretsiz deneme).
          </Text>
        </View>
      ) : (
        <View style={{ gap: Spacing.md }}>
          {plans.map((p) => {
            const active = p.id === selected;
            return (
              <Pressable key={p.id} onPress={() => setSelected(p.id)} style={[styles.plan, active && styles.planActive]}>
                <MaterialCommunityIcons
                  name={active ? 'radiobox-marked' : 'radiobox-blank'}
                  size={22}
                  color={active ? Colors.gold : Colors.textMuted}
                />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.planName}>{p.id === 'annual' ? 'Yıllık' : 'Aylık'}</Text>
                  {p.trial ? <Text style={styles.planTrial}>{p.trial}, sonra</Text> : null}
                  <Text style={styles.planPrice}>
                    {p.price} / {p.id === 'annual' ? 'yıl' : 'ay'}
                    {p.perMonth && p.id === 'annual' ? `  (ayda ${p.perMonth})` : ''}
                  </Text>
                </View>
                {p.id === 'annual' && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>EN AVANTAJLI</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
          <Button
            title={plan?.trial ? `${plan.trial.replace(' ücretsiz', '')} ücretsiz dene` : 'Abone ol'}
            icon="crown-outline"
            onPress={buy}
            loading={busy}
            style={{ minHeight: 56 }}
          />
          <Text style={styles.legal}>
            {plan?.trial
              ? `Deneme süresi bitmeden iptal ederseniz ücret alınmaz. Deneme bitince ${plan.price} tahsil edilir. `
              : ''}
            Abonelik, siz iptal edene kadar her dönem sonunda otomatik yenilenir. Google Play → Abonelikler’den istediğiniz zaman
            iptal edebilirsiniz.
          </Text>
        </View>
      )}

      <View style={styles.links}>
        {!pro && (
          <Pressable onPress={onRestore} disabled={busy}>
            <Text style={styles.link}>Satın alımları geri yükle</Text>
          </Pressable>
        )}
        <Pressable onPress={() => WebBrowser.openBrowserAsync(TERMS_URL)}>
          <Text style={styles.link}>Abonelik koşulları</Text>
        </Pressable>
        <Pressable onPress={() => WebBrowser.openBrowserAsync(PRIVACY_URL)}>
          <Text style={styles.link}>Gizlilik</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.lg, gap: Spacing.xl, paddingBottom: Spacing.xxl },
  hero: { alignItems: 'center', gap: Spacing.sm, paddingTop: Spacing.md },
  crown: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gold,
  },
  title: { fontFamily: Fonts.display, color: Colors.goldLight, fontSize: 30 },
  subtitle: { color: Colors.textSecondary, fontSize: 15, textAlign: 'center', lineHeight: 21 },
  benefits: {
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  benefit: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  benefitTitle: { color: Colors.text, fontSize: 15, fontWeight: '700' },
  benefitText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 18 },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  planActive: { borderColor: Colors.gold, backgroundColor: 'rgba(212,162,76,0.1)' },
  planName: { color: Colors.text, fontSize: 17, fontWeight: '800' },
  planTrial: { color: Colors.success, fontSize: 13, fontWeight: '700' },
  planPrice: { color: Colors.textSecondary, fontSize: 14 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: Colors.gold },
  badgeText: { color: Colors.onGold, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  legal: { color: Colors.textMuted, fontSize: 11, lineHeight: 16, textAlign: 'center' },
  active: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(127,176,105,0.12)',
  },
  activeText: { color: Colors.text, fontSize: 15, fontWeight: '700' },
  soon: { gap: Spacing.sm, padding: Spacing.lg, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center' },
  soonTitle: { fontFamily: Fonts.display, color: Colors.goldLight, fontSize: 20 },
  soonText: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  errorCode: { color: Colors.textMuted, fontSize: 11, lineHeight: 16, textAlign: 'center', fontFamily: Fonts.mono },
  links: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Spacing.lg },
  link: { color: Colors.gold, fontSize: 13, fontWeight: '600' },
});
