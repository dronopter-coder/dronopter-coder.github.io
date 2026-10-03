import { useEffect, useState } from 'react';

import { getRemainingScans, subscribeQuota } from '@/services/quota';

export function useRemainingScans() {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    getRemainingScans().then(setRemaining);
    return subscribeQuota(setRemaining);
  }, []);
  return remaining;
}
