import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

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
import { adsReady, initAds, maybeShowInterstitial, rewardedConfigured, showRewarded } from '@/services/ads';
import { analyzeArtifact, ApiError } from '@/services/api';
import { addBonusScans, consumeScan } from '@/services/quota';
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

  const noQuota = remaining !== null && remaining <= 0;

  async function analyze() {
    if (!params.uri || busy) return;
    setBusy(true);
    setError(null);
    try {
      const { result, processedUri } = await analyzeArtifact({
        uri: params.uri,
        width: Number(params.width) || undefined,
        height: Number(params.height) || undefined,
        note,
      });
      await consumeScan();
      const record = await saveScan({ imageUri: processedUri, note: note.trim() || undefined, result });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      await maybeShowInterstitial();
      router.replace({ pathname: '/result/[id]', params: { id: record.id } });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    } finally {
      setBusy(false);
    }
  }

  async function watchAd() {
    setRewardBusy(true);
    try {
      await initAds();
      // Reklam onayı verilmemiş/AdMob kullanılamıyorsa kullanıcıyı bekletmeden hak ver (sunucu tarafı sınır yine geçerlidir).
      const earned = adsReady() && rewardedConfigured() ? await showRewarded() : true;
      if (earned) {
        await addBonusScans(1);
      } else {
        Alert.alert('Reklam şu anda hazır değil', 'Lütfen biraz sonra tekrar deneyin.');
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

        {error && <Notice tone="warning" icon="alert-circle-outline" text={error} />}

        {noQuota ? (
          <Card style={{ gap: Spacing.md, alignItems: 'center' }}>
            <MaterialCommunityIcons name="gift-outline" size={36} color={Colors.gold} />
            <Text style={styles.quotaTitle}>Bugünkü ücretsiz analiz hakkınız doldu</Text>
            <Text style={styles.hint}>Kısa bir reklam izleyerek hemen +1 analiz hakkı kazanabilirsiniz.</Text>
            <Button
              title="Reklam İzle, +1 Hak Kazan"
              icon="play-circle-outline"
              onPress={watchAd}
              loading={rewardBusy}
              style={{ alignSelf: 'stretch' }}
            />
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
  label: { color: Colors.goldLight, fontWeight: '700', fontSize: 14, fontFamily: Fonts.serif },
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
  quotaTitle: { color: Colors.text, fontWeight: '700', fontSize: 16, textAlign: 'center' },
});
