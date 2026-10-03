import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LogoMark } from '@/components/logo';
import { Body, Button, Card, SectionTitle } from '@/components/ui';
import { APP_NAME, CONTACT_EMAIL, DAILY_FREE_SCANS, PRIVACY_URL } from '@/constants/config';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { showPrivacyOptions } from '@/services/ads';
import { clearScans } from '@/storage/history';

export default function SettingsScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';

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
          Defineciler, tarihi eser meraklıları için yapay zeka destekli bir tanımlama ve öğrenme uygulamasıdır. Her gün{' '}
          {DAILY_FREE_SCANS} ücretsiz analiz hakkınız vardır; reklam izleyerek ek hak kazanabilirsiniz. Yapay zeka sonuçları
          tahmini niteliktedir ve uzman görüşünün yerini tutmaz.
        </Body>
      </Card>

      <Card style={{ gap: Spacing.md }}>
        <SectionTitle icon="shield-account-outline">Gizlilik</SectionTitle>
        <Body muted>
          Analiz için gönderdiğiniz fotoğraf ve not, yalnızca tanımlama amacıyla Google Gemini yapay zeka servisine iletilir;
          sunucumuzda saklanmaz. Tarama geçmişiniz yalnızca cihazınızda tutulur. Reklamlar Google AdMob tarafından gösterilir.
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
          Bölge ve rehber görselleri ile özetleri Wikipedia ve Wikimedia Commons’tan (CC BY-SA) alınır. Haber başlıkları ilgili
          yayın kuruluşlarına aittir; habere dokunduğunuzda kaynağın kendi sayfası açılır. Eser analizi Google Gemini yapay zeka
          modeliyle yapılır.
        </Body>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxl },
  brand: { alignItems: 'center', gap: 6, paddingVertical: Spacing.lg },
  name: { fontFamily: Fonts.serif, fontSize: 28, fontWeight: '700', color: Colors.goldLight },
  version: { color: Colors.textMuted, fontSize: 13 },
});
