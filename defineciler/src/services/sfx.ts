import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

/**
 * Tarama ses efektleri: analiz sırasında döngüde çalan "tarayıcı" sesi, sonuç ve hata sesleri.
 * Ses ayarı kapalıysa hiçbir şey çalmaz. Sesler scripts/generate-sounds.mjs ile sentezlenir.
 */
const KEY = 'settings:sfx';

let enabled = true;
let ready = false;
let loopPlayer: AudioPlayer | null = null;
let donePlayer: AudioPlayer | null = null;
let errorPlayer: AudioPlayer | null = null;

async function ensure() {
  if (ready) return;
  ready = true;
  try {
    enabled = (await AsyncStorage.getItem(KEY)) !== 'off';
  } catch {}
  try {
    await setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' });
  } catch {}
  loopPlayer = createAudioPlayer(require('../../assets/sounds/scan-loop.m4a'));
  loopPlayer.loop = true;
  loopPlayer.volume = 0.7;
  donePlayer = createAudioPlayer(require('../../assets/sounds/scan-done.m4a'));
  errorPlayer = createAudioPlayer(require('../../assets/sounds/scan-error.m4a'));
}

/** Uygulama açılışında oynatıcıları önceden hazırlar. */
export const preloadSfx = () => {
  ensure().catch(() => {});
};

export async function getSfxEnabled() {
  await ensure();
  return enabled;
}

export async function setSfxEnabled(value: boolean) {
  enabled = value;
  await AsyncStorage.setItem(KEY, value ? 'on' : 'off').catch(() => {});
  if (!value) stopScanLoop();
}

async function playOnce(p: AudioPlayer | null) {
  if (!p) return;
  try {
    await p.seekTo(0);
    p.play();
  } catch {}
}

export async function startScanLoop() {
  await ensure();
  if (!enabled || !loopPlayer) return;
  try {
    await loopPlayer.seekTo(0);
    loopPlayer.play();
  } catch {}
}

export function stopScanLoop() {
  try {
    loopPlayer?.pause();
  } catch {}
}

export async function playDone() {
  stopScanLoop();
  if (enabled) await playOnce(donePlayer);
}

export async function playError() {
  stopScanLoop();
  if (enabled) await playOnce(errorPlayer);
}
