// Defineciler Pro abonelik ürününü Play Console'da oluşturur ve etkinleştirir (tekrar çalıştırmak güvenlidir):
//   defineciler_pro · temel planlar: aylik (79,99 TL) ve yillik (499,99 TL) · yıllıkta 7 gün ücretsiz deneme.
import { accessToken, client, PACKAGE, PlayError } from './play-api.mjs';

const PRODUCT = 'defineciler_pro';
const RV = { 'regionsVersion.version': '2022/02' };
const tl = (units, kurus) => ({ currencyCode: 'TRY', units: String(units), nanos: kurus * 10_000_000 });

const PLANS = [
  { id: 'aylik', period: 'P1M', price: tl(79, 99) },
  { id: 'yillik', period: 'P1Y', price: tl(499, 99) },
];
const TRIAL = { basePlan: 'yillik', id: 'deneme-7-gun', duration: 'P1W' };

const call = client(await accessToken());
const notFound = (e) => e instanceof PlayError && e.status === 404;
const base = `/subscriptions/${PRODUCT}`;

let sub;
try {
  sub = await call('GET', base);
  console.log(`Abonelik zaten var: ${PRODUCT}`);
} catch (e) {
  if (!notFound(e)) throw e;
  sub = await call('POST', '/subscriptions', {
    query: { productId: PRODUCT, ...RV },
    body: {
      packageName: PACKAGE,
      productId: PRODUCT,
      listings: [
        {
          languageCode: 'tr-TR',
          title: 'Defineciler Pro',
          description: 'Reklamsız, günde 30 analiz, ayrıntılı rapor ve tüm içerik.',
          benefits: ['Reklamsız kullanım', 'Günde 30 analiz', 'Ayrıntılı rapor ve PDF', 'Tüm belgeler ve işaretler'],
        },
      ],
      basePlans: PLANS.map((p) => ({
        basePlanId: p.id,
        autoRenewingBasePlanType: {
          billingPeriodDuration: p.period,
          gracePeriodDuration: 'P3D',
          resubscribeState: 'RESUBSCRIBE_STATE_ACTIVE',
          prorationMode: 'SUBSCRIPTION_PRORATION_MODE_CHARGE_ON_NEXT_BILLING_DATE',
        },
        regionalConfigs: [{ regionCode: 'TR', newSubscriberAvailability: true, price: p.price }],
      })),
    },
  });
  console.log(`Abonelik oluşturuldu: ${PRODUCT}`);
}

for (const p of PLANS) {
  const bp = sub.basePlans?.find((b) => b.basePlanId === p.id);
  if (!bp) throw new Error(`Temel plan bulunamadı: ${p.id} (Play Console'da elle eklenmeli)`);
  if (bp.state !== 'ACTIVE') {
    await call('POST', `${base}/basePlans/${p.id}:activate`, {
      body: { packageName: PACKAGE, productId: PRODUCT, basePlanId: p.id },
    });
    console.log(`Temel plan etkinleştirildi: ${p.id}`);
  } else console.log(`Temel plan etkin: ${p.id}`);
}

const offerPath = `${base}/basePlans/${TRIAL.basePlan}/offers/${TRIAL.id}`;
let offer;
try {
  offer = await call('GET', offerPath);
} catch (e) {
  if (!notFound(e)) throw e;
  offer = await call('POST', `${base}/basePlans/${TRIAL.basePlan}/offers`, {
    query: { offerId: TRIAL.id, ...RV },
    body: {
      packageName: PACKAGE,
      productId: PRODUCT,
      basePlanId: TRIAL.basePlan,
      offerId: TRIAL.id,
      phases: [{ recurrenceCount: 1, duration: TRIAL.duration, regionalConfigs: [{ regionCode: 'TR', free: {} }] }],
      // Yalnızca bu aboneliği daha önce hiç almamış kullanıcılar.
      targeting: { acquisitionRule: { scope: { thisSubscription: {} } } },
      regionalConfigs: [{ regionCode: 'TR', newSubscriberAvailability: true }],
    },
  });
  console.log(`Deneme teklifi oluşturuldu: ${TRIAL.id}`);
}
if (offer.state !== 'ACTIVE') {
  await call('POST', `${offerPath}:activate`, {
    body: { packageName: PACKAGE, productId: PRODUCT, basePlanId: TRIAL.basePlan, offerId: TRIAL.id },
  });
  console.log(`Deneme teklifi etkinleştirildi: ${TRIAL.id}`);
} else console.log(`Deneme teklifi etkin: ${TRIAL.id}`);

if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFile } = await import('node:fs/promises');
  await appendFile(
    process.env.GITHUB_STEP_SUMMARY,
    `### Play abonelik: ${PRODUCT} · aylik 79,99 TL · yillik 499,99 TL · ${TRIAL.id} etkin\n`,
  );
}
