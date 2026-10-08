// Web önizlemesinde ses efektleri devre dışı.
let enabled = true;
export const preloadSfx = () => {};
export const getSfxEnabled = async () => enabled;
export const setSfxEnabled = async (v: boolean) => {
  enabled = v;
};
export const startScanLoop = async () => {};
export const stopScanLoop = () => {};
export const playDone = async () => {};
export const playError = async () => {};
export const playRoll = async () => {};
export const playPortal = async () => {};
