import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { Colors } from '@/constants/theme';
import { AD_UNITS, adsReady, initAds } from '@/services/ads';
import { useIsPro } from '@/services/pro';

type Props = {
  /** 'anchored': ekranın altına yapışık uyarlanabilir banner. 'inline': içerik arasında orta dikdörtgen. */
  variant?: 'anchored' | 'inline';
};

/** AdMob banner alanı. Onay alınmadıysa veya reklam yüklenemezse yer kaplamaz. */
export function AdBanner({ variant = 'anchored' }: Props) {
  const [ready, setReady] = useState(adsReady());
  const [failed, setFailed] = useState(false);
  const pro = useIsPro();

  useEffect(() => {
    if (ready) return;
    let alive = true;
    initAds().then(() => alive && setReady(adsReady()));
    return () => {
      alive = false;
    };
  }, [ready]);

  if (pro || !ready || failed) return null; // Pro: reklamsız

  const inline = variant === 'inline';
  return (
    <View style={inline ? styles.inline : styles.anchored}>
      <BannerAd
        unitId={inline ? AD_UNITS.resultBanner : AD_UNITS.banner}
        size={inline ? BannerAdSize.MEDIUM_RECTANGLE : BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  anchored: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  inline: {
    alignItems: 'center',
    marginVertical: 16,
  },
});
