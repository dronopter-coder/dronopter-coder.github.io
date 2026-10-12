import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Button, Card, Notice } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { useRemainingScans } from '@/hooks/use-quota';
import { adsReady, initAds, maybeShowInterstitial, rewardedConfigured, showRewarded, warmUpRewarded } from '@/services/ads';
import { analyzeArtifact, ApiError } from '@/services/api';
import { pickFromGallery, takePhoto, type PickedImage } from '@/services/picker';
import { useIsPro } from '@/services/pro';
import { addBonusScans, consumeScan, grantFallbackBonus } from '@/services/quota';
import { playDone, playError, startScanLoop, stopScanLoop } from '@/services/sfx';
import { saveScan } from '@/storage/history';

const MESSAGES = [
  'Fotoğraf hazırlanıyor…',
  'Biçim ve malzeme inceleniyor…',
  'Yazı ve semboller okunuyor…',
  'Dönem ve uygarlık karşılaştırılıyor…',
  'Orijinallik ipuçları değerlendiriliyor…',
  'Rapor yazılıyor…',
];

function ScanningOverlay() {
  const line = useSharedValue(0);
  const [msg, setMsg] = useState(0);

  useEffect(() => {
    line.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.quad) }), -1, true);
    const t = setInterval(() => setMsg((m) => Math.min(m + 1, MESSAGES.length - 1)), 2600);
    return () => {
      cancelAnimation(line);
      clearInterval(t);
    };
  }, [line]);

  const lineStyle = useAnimatedStyle(() => ({ transform: [{ translateY: line.value * 330 }] }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.overlayTint} />
      <Animated.View style={[styles.scanLine, lineStyle]} />
      <View style={styles.overlayMsg}>
        <MaterialCommunityIcons name="brain" size={18} color={Colors.goldLight} />
        <Text style={styles.overlayText}>{MESSAGES[msg]}</Text>
      </View>
    </View>
  );
}

export default function ScanScreen() {
  const params = useLocalSearchParams<{ uri: string; width?: string; height?: string }>();
  const remaining = useRemainingScans();
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rewardBusy, setRewardBusy] = useState(false);
  const pro = useIsPro();
  const [detail, setDetail] = useState(true);
  const [extra, setExtra] = useState<PickedImage[]>([]);

  const noQuota = remaining !== null && remaining <= 0;

  // Hak azaldığında ödüllü reklamı önceden yüklemeye başla; ekrandan çıkınca tarama sesini durdur.
  useEffect(() => {
    if (remaining !== null && remaining <= 1) initAds().then(warmUpRewarded);
  }, [remaining]);
  useEffect(() => () => stopScanLoop(), []);

  async function analyze() {
    if (!params.uri || busy) return;
    setBusy(true);
    setError(null);
    startScanLoop();
    try {
      const { result, processedUri } = await analyzeArtifact({
        uri: params.uri,
        width: Number(params.width) || undefined,
        height: Number(params.height) || undefined,
        note,
        detail: pro && detail,
        extra: pro ? extra : undefined,
      });
      await consumeScan();
      const record = await saveScan({ imageUri: processedUri, note: note.trim() || undefined, result });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      await playDone();
      await new Promise((r) => setTimeout(r, 700));
      await maybeShowInterstitial();
      router.replace({ pathname: '/result/[id]', params: { id: record.id } });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
      playError();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    } finally {
      setBusy(false);
    }
  }

  async function addExtra() {
    Alert.alert('Ek fotoğraf', 'Aynı eserin arka yüzü, yanı veya ölçekli bir fotoğrafı', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Galeriden seç', onPress: async () => add(await pickFromGallery()) },
      { text: 'Fotoğraf çek', onPress: async () => add(await takePhoto()) },
    ]);
    function add(p: PickedImage | null) {
      if (p) setExtra((prev) => [...prev, p].slice(0, 2));
    }
  }

  async function watchAd() {
    setRewardBusy(true);
    try {
      await initAds();
      const canShow = adsReady() && rewardedConfigured();
      const outcome = canShow ? await showRewarded() : 'unavailable';
      if (outcome === 'earned') {
        await addBonusScans(1);
      } else if (outcome === 'dismissed') {
        Alert.alert('Ödül alınamadı', 'Ek hak için reklamı sonuna kadar izlemeniz gerekiyor.');
      } else if (await grantFallbackBonus()) {
        Alert.alert('Bu analiz bizden 🎁', 'Şu an gösterilecek reklam bulunamadı. Size hediye +1 analiz hakkı tanımlandı.');
      } else {
        Alert.alert(
          'Bugünlük hediye haklarınız bitti',
          'Şu an gösterilecek reklam yok. Birkaç dakika sonra tekrar deneyebilir veya yarın yenilenen ücretsiz haklarınızı kullanabilirsiniz.',
        );
      }
    } finally {
      setRewardBusy(false);
    }
  }

  if (!params.uri) {
    return (
      <View style={styles.center}>
        <Text style={{ color: Colors.text }}>Fotoğraf bulunamadı.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.imageWrap}>
          <Image source={{ uri: params.uri }} style={styles.image} contentFit="cover" />
          {busy && <ScanningOverlay />}
        </View>

        <Card style={{ gap: Spacing.sm }}>
          <Text style={styles.label}>Ek bilgi (isteğe bağlı)</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            editable={!busy}
            placeholder="Örn: Yaklaşık 2 cm çapında, Manisa civarında tarlada bulundu, arka yüzünde yazı var."
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={400}
            style={styles.input}
          />
          <Text style={styles.hint}>Boyut, ağırlık, bulunduğu bölge gibi bilgiler sonucu iyileştirir.</Text>
        </Card>

        {pro ? (
          <Card style={{ gap: Spacing.md }}>
            <View style={styles.proRow}>
              <MaterialCommunityIcons name="crown-outline" size={20} color={Colors.gold} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Ayrıntılı rapor</Text>
                <Text style={styles.hint}>Daha kapsamlı inceleme, yazı okuma denemesi ve müze örnekleri</Text>
              </View>
              <Switch
                value={detail}
                onValueChange={setDetail}
                disabled={busy}
                trackColor={{ true: Colors.goldDark, false: Colors.border }}
                thumbColor={detail ? Colors.goldLight : Colors.textMuted}
              />
            </View>
            <View style={styles.extraRow}>
              {extra.map((x, i) => (
                <Pressable key={x.uri} disabled={busy} onPress={() => setExtra((p) => p.filter((_, j) => j !== i))}>
                  <Image source={{ uri: x.uri }} style={styles.extraImg} contentFit="cover" />
                  <MaterialCommunityIcons name="close-circle" size={20} color={Colors.text} style={styles.extraRemove} />
                </Pressable>
              ))}
              {extra.length < 2 && (
                <Pressable disabled={busy} onPress={addExtra} style={[styles.extraImg, styles.extraAdd]}>
                  <MaterialCommunityIcons name="camera-plus-outline" size={24} color={Colors.gold} />
                  <Text style={styles.extraAddText}>Arka yüz</Text>
                </Pressable>
              )}
            </View>
          </Card>
        ) : (
          <Pressable onPress={() => router.push('/paywall')} style={styles.proTeaser}>
            <MaterialCommunityIcons name="crown-outline" size={18} color={Colors.gold} />
            <Text style={styles.proTeaserText}>Ayrıntılı rapor ve arka yüz fotoğrafı Defineciler Pro’da</Text>
            <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.textMuted} />
          </Pressable>
        )}

        {error && <Notice tone="warning" icon="alert-circle-outline" text={error} />}

        {noQuota ? (
          <Card style={{ gap: Spacing.md, alignItems: 'center' }}>
            <MaterialCommunityIcons name="gift-outline" size={36} color={Colors.gold} />
            <Text style={styles.quotaTitle}>
              {pro ? 'Bugünkü analiz hakkınız doldu' : 'Bugünkü ücretsiz analiz hakkınız doldu'}
            </Text>
            <Text style={styles.hint}>Kısa bir reklam izleyerek hemen +1 analiz hakkı kazanabilirsiniz.</Text>
            <Button
              title="Reklam İzle, +1 Hak Kazan"
              icon="play-circle-outline"
              onPress={watchAd}
              loading={rewardBusy}
              loadingLabel="Reklam hazırlanıyor…"
              style={{ alignSelf: 'stretch' }}
            />
            {!pro && (
              <Button
                title="Pro ile devam et · günde 30 analiz"
                icon="crown-outline"
                variant="secondary"
                onPress={() => router.push('/paywall')}
                style={{ alignSelf: 'stretch' }}
              />
            )}
          </Card>
        ) : (
          <Button
            title={busy ? 'İnceleniyor…' : 'Analiz Et'}
            icon="line-scan"
            onPress={analyze}
            loading={busy}
            style={{ minHeight: 58 }}
          />
        )}

        {remaining !== null && remaining > 0 && (
          <Text style={[styles.hint, { textAlign: 'center' }]}>Kalan analiz hakkı: {remaining}</Text>
        )}

        <Button
          title="Başka Fotoğraf Seç"
          icon="image-refresh-outline"
          variant="ghost"
          onPress={() => router.back()}
          disabled={busy}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageWrap: {
    height: 340,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: { width: '100%', height: '100%' },
  overlayTint: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#14100C66' },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.goldLight,
    shadowColor: Colors.goldLight,
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  overlayMsg: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#14100CDD',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  overlayText: { color: Colors.text, fontWeight: '600', fontSize: 13 },
  label: { color: Colors.goldLight, fontSize: 14, fontFamily: Fonts.serif },
  input: {
    minHeight: 80,
    color: Colors.text,
    fontSize: 15,
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    padding: Spacing.md,
    textAlignVertical: 'top',
  },
  hint: { color: Colors.textMuted, fontSize: 12, lineHeight: 18 },
  proRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  extraRow: { flexDirection: 'row', gap: Spacing.sm },
  extraImg: { width: 72, height: 72, borderRadius: Radius.md },
  extraRemove: { position: 'absolute', top: -6, right: -6 },
  extraAdd: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.goldDark,
    backgroundColor: Colors.surfaceRaised,
  },
  extraAddText: { color: Colors.textSecondary, fontSize: 11 },
  proTeaser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(212,162,76,0.08)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(232,199,122,0.4)',
  },
  proTeaserText: { flex: 1, color: Colors.textSecondary, fontSize: 13 },
  quotaTitle: { color: Colors.text, fontWeight: '700', fontSize: 16, textAlign: 'center' },
});
