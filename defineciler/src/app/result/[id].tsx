import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import { AdBanner } from '@/components/ad-banner';
import { ConfidenceMeter } from '@/components/confidence-meter';
import { Body, Bullets, Button, Card, Chip, EmptyState, SectionTitle, type IconName } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { deleteScan, getScan } from '@/storage/history';
import type { AuthenticityAssessment, ScanRecord, Verdict } from '@/types/analysis';

const VERDICTS: Record<Verdict, { label: string; color: string; icon: IconName }> = {
  artifact: { label: 'Tarihi eser', color: Colors.success, icon: 'check-decagram' },
  possible: { label: 'Muhtemel tarihi eser', color: Colors.warning, icon: 'help-circle' },
  not_artifact: { label: 'Tarihi eser değil', color: Colors.danger, icon: 'close-circle' },
  unclear: { label: 'Belirlenemedi', color: Colors.textSecondary, icon: 'image-filter-center-focus-weak' },
};

const AUTHENTICITY: Record<AuthenticityAssessment, { label: string; color: string; icon: IconName }> = {
  likely_original: { label: 'Orijinal olabilir', color: Colors.success, icon: 'shield-check' },
  suspicious: { label: 'Şüpheli', color: Colors.warning, icon: 'shield-alert' },
  likely_replica: { label: 'Replika / taklit olabilir', color: Colors.danger, icon: 'shield-off' },
  undetermined: { label: 'Fotoğraftan belirlenemedi', color: Colors.textSecondary, icon: 'shield-outline' },
};

function Fact({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  if (!value) return null;
  return (
    <View style={styles.fact}>
      <View style={styles.factHead}>
        <MaterialCommunityIcons name={icon} size={15} color={Colors.gold} />
        <Text style={styles.factLabel}>{label.toLocaleUpperCase('tr')}</Text>
      </View>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

function shareText(s: ScanRecord) {
  const r = s.result;
  return [
    `🏺 ${r.title}`,
    r.period && `Dönem: ${r.period}`,
    r.civilization && `Uygarlık: ${r.civilization}`,
    r.dateRange && `Tarih: ${r.dateRange}`,
    r.material && `Malzeme: ${r.material}`,
    '',
    r.summary,
    '',
    'Defineciler uygulaması ile yapay zeka analizi yapıldı.',
  ]
    .filter((x): x is string => typeof x === 'string')
    .join('\n');
}

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [scan, setScan] = useState<ScanRecord | null | undefined>(undefined);

  useEffect(() => {
    getScan(id).then(setScan);
  }, [id]);

  if (scan === undefined) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.gold} />
      </View>
    );
  }
  if (scan === null) {
    return <EmptyState icon="file-question-outline" title="Tarama bulunamadı" text="Bu kayıt silinmiş olabilir." />;
  }

  const r = scan.result;
  const verdict = VERDICTS[r.verdict] ?? VERDICTS.unclear;
  const auth = AUTHENTICITY[r.authenticity?.assessment] ?? AUTHENTICITY.undetermined;
  const isArtifact = r.verdict === 'artifact' || r.verdict === 'possible';

  const onDelete = () =>
    Alert.alert('Taramayı sil', 'Bu tarama geçmişten kalıcı olarak silinsin mi?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          await deleteScan(scan.id);
          router.back();
        },
      },
    ]);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable hitSlop={12} onPress={() => Share.share({ message: shareText(scan) })} accessibilityLabel="Paylaş">
              <MaterialCommunityIcons name="share-variant" size={22} color={Colors.goldLight} />
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: Spacing.xxl }}>
        <View style={styles.hero}>
          <Image source={{ uri: scan.imageUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={['transparent', '#14100CEE', Colors.background]}
            locations={[0.35, 0.85, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroText}>
            <View style={{ flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' }}>
              <Chip label={verdict.label} icon={verdict.icon} color={verdict.color} />
              {!!r.category && <Chip label={r.category} icon="tag-outline" />}
            </View>
            <Text style={styles.title}>{r.title}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Card style={{ gap: Spacing.md }}>
            <ConfidenceMeter value={r.confidence} />
            <Body>{r.summary}</Body>
          </Card>

          {isArtifact && (
            <View style={styles.facts}>
              <Fact icon="calendar-clock" label="Dönem" value={r.period} />
              <Fact icon="pillar" label="Uygarlık" value={r.civilization} />
              <Fact icon="timeline-clock-outline" label="Tahmini tarih" value={r.dateRange} />
              <Fact icon="cube-outline" label="Malzeme" value={r.material} />
              <Fact icon="map-marker-outline" label="Köken / bölge" value={r.origin} />
            </View>
          )}

          {!!r.description && (
            <Card>
              <SectionTitle icon="text-box-outline">Ayrıntılı açıklama</SectionTitle>
              <Body>{r.description}</Body>
            </Card>
          )}

          {r.features?.length > 0 && (
            <Card>
              <SectionTitle icon="magnify">Ayırt edici özellikler</SectionTitle>
              <Bullets items={r.features} />
            </Card>
          )}

          {!!r.inscriptions && (
            <Card>
              <SectionTitle icon="format-letter-case">Yazı ve semboller</SectionTitle>
              <Body>{r.inscriptions}</Body>
            </Card>
          )}

          {isArtifact && (
            <Card style={{ gap: Spacing.md }}>
              <SectionTitle icon="shield-search" style={{ marginBottom: 0 }}>
                Orijinallik değerlendirmesi
              </SectionTitle>
              <Chip label={auth.label} icon={auth.icon} color={auth.color} />
              {r.authenticity?.notes?.length > 0 && <Bullets items={r.authenticity.notes} icon="chevron-right" />}
            </Card>
          )}

          <AdBanner variant="inline" />

          {r.similarExamples?.length > 0 && (
            <Card>
              <SectionTitle icon="bank-outline">Benzer örnekler</SectionTitle>
              <Bullets items={r.similarExamples} />
            </Card>
          )}

          {r.preservationTips?.length > 0 && (
            <Card>
              <SectionTitle icon="hand-heart-outline">Koruma önerileri</SectionTitle>
              <Bullets items={r.preservationTips} />
            </Card>
          )}

          {r.photoTips?.length > 0 && (
            <Card>
              <SectionTitle icon="camera-enhance-outline">Daha iyi sonuç için</SectionTitle>
              <Bullets items={r.photoTips} />
            </Card>
          )}

          {scan.note && (
            <Card>
              <SectionTitle icon="note-text-outline">Notunuz</SectionTitle>
              <Body muted>{scan.note}</Body>
            </Card>
          )}

          {isArtifact && (
            <Link href={{ pathname: '/guide/[id]', params: { id: 'yasal' } }} asChild>
              <Pressable style={styles.legal}>
                <MaterialCommunityIcons name="scale-balance" size={22} color={Colors.warning} />
                <Text style={styles.legalText}>
                  Bu bir tarihi eserse, 2863 sayılı Kanun gereği 3 gün içinde en yakın müzeye veya mülki amirliğe bildirmeniz
                  gerekir. Bildirene ikramiye verilir. Ayrıntılar için dokunun.
                </Text>
              </Pressable>
            </Link>
          )}

          <Text style={styles.disclaimer}>
            Bu analiz yapay zeka tarafından fotoğraf üzerinden yapılmış bir tahmindir ve kesinlik taşımaz. Kesin tespit için müze
            uzmanlarına danışın.
          </Text>

          <View style={{ gap: Spacing.md }}>
            <Button
              title="Paylaş"
              icon="share-variant"
              variant="secondary"
              onPress={() => Share.share({ message: shareText(scan) })}
            />
            <Button title="Yeni Tarama" icon="camera-plus-outline" onPress={() => router.dismissTo('/')} />
            <Button title="Taramayı Sil" icon="trash-can-outline" variant="danger" onPress={onDelete} />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { height: 360, justifyContent: 'flex-end', backgroundColor: Colors.surface },
  heroText: { padding: Spacing.lg, gap: Spacing.sm },
  title: { fontFamily: Fonts.serif, fontSize: 28, fontWeight: '700', color: Colors.text, lineHeight: 34 },
  body: { paddingHorizontal: Spacing.lg, gap: Spacing.lg },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  fact: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: 4,
  },
  factHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  factLabel: { color: Colors.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  factValue: { color: Colors.text, fontSize: 15, fontWeight: '600', lineHeight: 21 },
  legal: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.warning + '55',
    backgroundColor: Colors.warning + '12',
  },
  legalText: { flex: 1, color: Colors.text, fontSize: 13, lineHeight: 19 },
  disclaimer: { color: Colors.textMuted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
