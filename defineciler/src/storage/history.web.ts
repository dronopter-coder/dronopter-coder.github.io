import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AnalysisResult, ScanRecord } from '@/types/analysis';

// Web önizlemesi için dosya sistemi kullanmayan sürüm.
const INDEX_KEY = 'scans:index:v1';
type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeHistory(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

async function readAll(): Promise<ScanRecord[]> {
  const raw = await AsyncStorage.getItem(INDEX_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function writeAll(records: ScanRecord[]) {
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(records));
  listeners.forEach((l) => l());
}

export const listScans = readAll;
export const getScan = async (id: string) => (await readAll()).find((r) => r.id === id) ?? null;

export async function saveScan(params: { imageUri: string; note?: string; result: AnalysisResult }) {
  const record: ScanRecord = {
    id: Date.now().toString(36),
    createdAt: Date.now(),
    imageUri: params.imageUri,
    note: params.note,
    result: params.result,
  };
  await writeAll([record, ...(await readAll())]);
  return record;
}

export const deleteScan = async (id: string) => writeAll((await readAll()).filter((r) => r.id !== id));
export const clearScans = () => writeAll([]);
