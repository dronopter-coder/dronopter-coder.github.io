import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AdBanner } from '@/components/ad-banner';
import { Callout, Pairs } from '@/components/guide-blocks';
import { EvidenceChip, SIGNS_COVER, SignGlyph, signImage } from '@/components/sign-glyph';
import { Body, Bullets, Button, Card, EmptyState, SectionTitle } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { EVIDENCE, getSign, SIGN_CATEGORIES, SIGNS_GUIDE } from '@/data/signs';

/** "Okumadan önce: yorum sınırı" kılavuzu. */
function GuideArticle() {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: Spacing.xxl }}>
      <Stack.Screen options={{ title: 'Yorum Sınırı' }} />
      <View style={styles.hero}>
        <Image source={SIGNS_COVER} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient colors={['rgba(20,16,10,0.3)', 'rgba(20,16,10,0.95)']} style={StyleSheet.absoluteFill} />
        <MaterialCommunityIcons name="scale-balance" size={44} color={Colors.goldLight} />
      </View>
      <View style={styles.body}>
        <View style={{ gap: 4 }}>
          <Text style={styles.title}>{SIGNS_GUIDE.title}</Text>
          <Text style={styles.subtitle}>{SIGNS_GUIDE.subtitle}</Text>
        </View>
        {SIGNS_GUIDE.sections.map((s, i) => (
          <View key={s.heading} style={{ gap: Spacing.lg }}>
            <Card style={{ gap: Spacing.sm }}>
              <SectionTitle icon="bookmark-outline" style={{ marginBottom: 0 }}>
                {s.heading}
              </SectionTitle>
              {s.body && <Body>{s.body}</Body>}
              {s.bullets && <Bullets items={s.bullets} />}
              {s.pairs && <Pairs items={s.pairs} />}
              {s.callout && <Callout {...s.callout} />}
            </Card>
            {i === 1 && <AdBanner variant="inline" />}
          </View>
        ))}
        <Button title="İşaretlere dön" icon="sign-direction" variant="secondary" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

export default function SignScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (id === 'kilavuz') return <GuideArticle />;
  const sign = getSign(id);
  if (!sign) return <EmptyState icon="sign-direction-remove" title="İşaret bulunamadı" />;

  const photo = signImage(sign.id);
  const category = SIGN_CATEGORIES.find((c) => c.id === sign.category);
  const related = (sign.related ?? []).map(getSign).filter((s) => !!s);
  const evidence = EVIDENCE[sign.evidence];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: Spacing.xxl }}>
      <Stack.Screen options={{ title: sign.title }} />
      <View style={styles.hero}>
        <LinearGradient colors={['#2A2219', '#14100C']} style={StyleSheet.absoluteFill} />
        {photo ? (
          <>
            <Image source={photo.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
            <LinearGradient colors={['transparent', 'rgba(20,16,10,0.9)']} locations={[0.4, 1]} style={StyleSheet.absoluteFill} />
            <SignGlyph sign={sign} size={64} style={styles.heroGlyph} />
            {photo.credit ? (
              <Text style={styles.credit} numberOfLines={1}>
                {photo.credit}
              </Text>
            ) : null}
          </>
        ) : (
          <SignGlyph sign={sign} size={120} />
        )}
      </View>

      <View style={styles.body}>
        <View style={{ gap: 6 }}>
          <Text style={styles.kicker}>{category?.label}</Text>
          <Text style={styles.title}>{sign.title}</Text>
          {sign.aka ? <Text style={styles.aka}>Diğer adları: {sign.aka}</Text> : null}
          <Text style={styles.subtitle}>{sign.summary}</Text>
          <EvidenceChip evidence={sign.evidence} />
        </View>

        <Card style={{ gap: Spacing.sm }}>
          <SectionTitle icon="account-group-outline" style={{ marginBottom: 0 }}>
            Halk arasında nasıl yorumlanır?
          </SectionTitle>
          <Bullets items={sign.folk} />
          <Text style={styles.hint}>Bu yorumlar definecilik çevrelerinde anlatılanlardır; doğrulukları kanıtlanmamıştır.</Text>
        </Card>

        <Card style={{ gap: Spacing.sm }}>
          <SectionTitle icon="bank-outline" style={{ marginBottom: 0 }}>
            Tarih ve arkeolojideki karşılığı
          </SectionTitle>
          <Body>{sign.science}</Body>
        </Card>

        <AdBanner variant="inline" />

        <Card style={{ gap: Spacing.sm }}>
          <SectionTitle icon="map-marker-outline" style={{ marginBottom: 0 }}>
            Nerede ve hangi dönemde görülür?
          </SectionTitle>
          <Body>{sign.where}</Body>
        </Card>

        <View style={[styles.limit, { borderColor: evidence.color + '88', backgroundColor: evidence.color + '14' }]}>
          <View style={styles.limitHead}>
            <MaterialCommunityIcons name="scale-balance" size={20} color={evidence.color} />
            <Text style={[styles.limitTitle, { color: evidence.color }]}>Yorum sınırı · {evidence.label}</Text>
          </View>
          <Text style={styles.limitText}>{sign.limit}</Text>
        </View>

        <Callout
          kind="warning"
          text="Böyle bir işaret görürseniz kazmayın, boyamayın; fotoğrafını çekip konumunu en yakın müze müdürlüğüne bildirin (2863 sayılı Kanun)."
        />

        <Button title="Elindeki eseri tara" icon="line-scan" onPress={() => router.navigate('/')} />

        {related.length ? (
          <View style={{ gap: Spacing.sm }}>
            <Text style={styles.relatedTitle}>İlgili işaretler</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.md }}>
              {related.map((r) => (
                <Pressable
                  key={r.id}
                  onPress={() => router.push({ pathname: '/signs/[id]', params: { id: r.id } })}
                  style={({ pressed }) => [styles.related, pressed && { opacity: 0.85 }]}>
                  <SignGlyph sign={r} size={48} />
                  <Text style={styles.relatedName} numberOfLines={2}>
                    {r.title}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        <Pressable onPress={() => router.push({ pathname: '/signs/[id]', params: { id: 'kilavuz' } })}>
          <Text style={styles.link}>İşaretler nasıl okunur? Yorum sınırı kılavuzunu açın ›</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { height: 220, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  heroGlyph: { position: 'absolute', left: Spacing.lg, bottom: Spacing.lg, backgroundColor: 'rgba(20,16,10,0.75)' },
  credit: {
    position: 'absolute',
    right: 8,
    bottom: 6,
    left: 96,
    textAlign: 'right',
    color: '#F3E9DACC',
    fontSize: 10,
    textShadowColor: '#000',
    textShadowRadius: 3,
  },
  body: { padding: Spacing.lg, gap: Spacing.lg },
  kicker: { color: Colors.gold, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  title: { color: Colors.text, fontFamily: Fonts.serif, fontSize: 28 },
  aka: { color: Colors.textMuted, fontSize: 13 },
  subtitle: { color: Colors.textSecondary, fontSize: 15, lineHeight: 21 },
  hint: { color: Colors.textMuted, fontSize: 12, lineHeight: 17, fontStyle: 'italic' },
  limit: { gap: 8, padding: Spacing.md, borderRadius: Radius.md, borderWidth: StyleSheet.hairlineWidth },
  limitHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  limitTitle: { fontSize: 15, fontWeight: '800' },
  limitText: { color: Colors.text, fontSize: 14, lineHeight: 21 },
  relatedTitle: { fontFamily: Fonts.display, color: Colors.goldLight, fontSize: 18 },
  related: {
    width: 110,
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  relatedName: { color: Colors.text, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  link: { color: Colors.gold, fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
