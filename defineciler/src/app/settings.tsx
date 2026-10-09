import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { LogoMark } from '@/components/logo';
import { Body, Button, Card, SectionTitle } from '@/components/ui';
import { APP_NAME, CONTACT_EMAIL, DAILY_FREE_SCANS, PRIVACY_URL } from '@/constants/config';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { showPrivacyOptions } from '@/services/ads';
import { runDiagnostics, type ProbeResult } from '@/services/api';
import { getSfxEnabled, setSfxEnabled } from '@/services/sfx';
import { clearScans } from '@/storage/history';

export default function SettingsScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const [sfx, setSfx] = useState(true);
  const [probing, setProbing] = useState(false);
  const [steps, setSteps] = useState<ProbeResult[]>([]);
  useEffect(() => {
    getSfxEnabled().then(setSfx);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.brand}>
        <LogoMark size={72} />
        <Text style={styles.name}>{APP_NAME}</Text>
        <Text style={styles.version}>Sürüm {version}</Text>
      </View>

      <Card style={{ gap: Spacing.sm }}>
        <SectionTitle icon="information-outline">Hakkında</SectionTitle>
        <Body muted>
          Defineciler, tarihi eser meraklıları için bir tanımlama ve öğrenme uygulamasıdır. Her gün {DAILY_FREE_SCANS} ücretsiz
          analiz hakkınız vardır; sonrasında her analiz için kısa bir reklam izlenir. Defineciler analizleri tahmini niteliktedir
          ve uzman görüşünün yerini tutmaz.
        </Body>
      </Card>

      <Card style={styles.row}>
        <View style={{ flex: 1 }}>
          <SectionTitle icon="volume-high" style={{ marginBottom: 2 }}>
            Ses efektleri
          </SectionTitle>
          <Text style={styles.rowHint}>Tarama sırasında analiz sesi ve sonuç zili</Text>
        </View>
        <Switch
          value={sfx}
          onValueChange={(v) => {
            setSfx(v);
            setSfxEnabled(v);
          }}
          trackColor={{ true: Colors.goldDark, false: Colors.border }}
          thumbColor={sfx ? Colors.goldLight : Colors.textMuted}
        />
      </Card>

      <Card style={{ gap: Spacing.md }}>
        <SectionTitle icon="wifi-check">Bağlantı testi</SectionTitle>
        <Body muted>Tarama çalışmıyorsa bu testi çalıştırıp sonucun ekran görüntüsünü gönderin.</Body>
        <Button
          title={probing ? 'Test ediliyor…' : 'Bağlantıyı test et'}
          icon="speedometer"
          variant="secondary"
          loading={probing}
          onPress={async () => {
            setProbing(true);
            setSteps([]);
            await runDiagnostics((r) => setSteps((prev) => [...prev, r]));
            setProbing(false);
          }}
        />
        {steps.map((r) => (
          <Text key={r.label} style={[styles.probe, { color: r.ok ? Colors.success : Colors.danger }]}>
            {r.ok ? '✓' : '✗'} {r.label}
            {r.ms ? ` · ${(r.ms / 1000).toFixed(1)} sn` : ''} · {r.detail}
          </Text>
        ))}
      </Card>

      <Card style={{ gap: Spacing.md }}>
        <SectionTitle icon="shield-account-outline">Gizlilik</SectionTitle>
        <Body muted>
          Analiz için gönderdiğiniz fotoğraf ve not, yalnızca tanımlama amacıyla Google bulut servislerine iletilir; sunucumuzda
          saklanmaz. Tarama geçmişiniz yalnızca cihazınızda tutulur. Reklamlar Google AdMob tarafından gösterilir.
        </Body>
        <Button
          title="Gizlilik Politikası"
          icon="file-document-outline"
          variant="secondary"
          onPress={() => WebBrowser.openBrowserAsync(PRIVACY_URL)}
        />
        {Platform.OS !== 'web' && (
          <Button
            title="Reklam Onay Tercihleri"
            icon="cookie-settings-outline"
            variant="secondary"
            onPress={() =>
              showPrivacyOptions().catch(() => Alert.alert('Şu anda açılamadı', 'Lütfen daha sonra tekrar deneyin.'))
            }
          />
        )}
      </Card>

      <Card style={{ gap: Spacing.md }}>
        <SectionTitle icon="database-outline">Veriler</SectionTitle>
        <Button
          title="Tarama Geçmişini Temizle"
          icon="trash-can-outline"
          variant="danger"
          onPress={() =>
            Alert.alert('Geçmişi temizle', 'Tüm taramalar ve fotoğrafları silinsin mi?', [
              { text: 'Vazgeç', style: 'cancel' },
              { text: 'Temizle', style: 'destructive', onPress: () => clearScans() },
            ])
          }
        />
      </Card>

      <Card style={{ gap: Spacing.md }}>
        <SectionTitle icon="email-outline">İletişim</SectionTitle>
        <Button
          title="Geri Bildirim Gönder"
          icon="send-outline"
          variant="secondary"
          onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}?subject=Defineciler`)}
        />
      </Card>

      <Card style={{ gap: Spacing.sm }}>
        <SectionTitle icon="creative-commons">Kaynaklar ve lisanslar</SectionTitle>
        <Body muted>
          Bölge ve rehber fotoğrafları Wikimedia Commons’tan alınmıştır; her fotoğrafın yazarı ve lisansı fotoğrafın üzerinde
          belirtilir. Özetler Wikipedia’dandır (CC BY-SA). Haber başlıkları ilgili yayın kuruluşlarına aittir; habere
          dokunduğunuzda kaynağın kendi sayfası açılır. Eser analizinde Google bulut servisleri kullanılır.
        </Body>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxl },
  brand: { alignItems: 'center', gap: 6, paddingVertical: Spacing.lg },
  name: { fontFamily: Fonts.serif, fontSize: 28, color: Colors.goldLight },
  version: { color: Colors.textMuted, fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  probe: { fontSize: 13, lineHeight: 19 },
  rowHint: { color: Colors.textMuted, fontSize: 12 },
});
