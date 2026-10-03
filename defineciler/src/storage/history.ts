import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';

import type { AnalysisResult, ScanRecord } from '@/types/analysis';

const INDEX_KEY = 'scans:index:v1';
const MAX_RECORDS = 200;

type Listener = () => void;
const listeners = new Set<Listener>();
const emit = () => listeners.forEach((l) => l());

export function subscribeHistory(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function scansDir() {
  const dir = new Directory(Paths.document, 'scans');
  if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
  return dir;
}

async function readAll(): Promise<ScanRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(INDEX_KEY);
    return raw ? (JSON.parse(raw) as ScanRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(records: ScanRecord[]) {
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(records));
  emit();
}

export const listScans = readAll;

export async function getScan(id: string) {
  return (await readAll()).find((r) => r.id === id) ?? null;
}

/** Analiz sonucunu ve fotoğrafın kalıcı bir kopyasını kaydeder. */
export async function saveScan(params: { imageUri: string; note?: string; result: AnalysisResult }) {
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  let imageUri = params.imageUri;
  try {
    const target = new File(scansDir(), `${id}.jpg`);
    new File(params.imageUri).copySync(target);
    imageUri = target.uri;
  } catch {
    // Kopyalanamazsa geçici adresle devam et.
  }
  const record: ScanRecord = { id, createdAt: Date.now(), imageUri, note: params.note, result: params.result };
  const all = await readAll();
  const next = [record, ...all];
  for (const old of next.splice(MAX_RECORDS)) removeImage(old.imageUri);
  await writeAll(next);
  return record;
}

function removeImage(uri: string) {
  try {
    const f = new File(uri);
    if (f.exists) f.delete();
  } catch {}
}

export async function deleteScan(id: string) {
  const all = await readAll();
  const rec = all.find((r) => r.id === id);
  if (rec) removeImage(rec.imageUri);
  await writeAll(all.filter((r) => r.id !== id));
}

export async function clearScans() {
  const all = await readAll();
  all.forEach((r) => removeImage(r.imageUri));
  await writeAll([]);
}
