import { useCallback, useEffect, useState } from 'react';

import { listScans, subscribeHistory } from '@/storage/history';
import type { ScanRecord } from '@/types/analysis';

export function useScans() {
  const [scans, setScans] = useState<ScanRecord[] | null>(null);
  const reload = useCallback(() => {
    listScans().then(setScans);
  }, []);
  useEffect(() => {
    reload();
    return subscribeHistory(reload);
  }, [reload]);
  return scans;
}
