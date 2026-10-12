import { useEffect, useState } from 'react';

import { useIsPro } from '@/services/pro';
import { getRemainingScans, subscribeQuota } from '@/services/quota';

export function useRemainingScans() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const pro = useIsPro();
  useEffect(() => {
    getRemainingScans().then(setRemaining);
    return subscribeQuota(setRemaining);
  }, [pro]);
  return remaining;
}
