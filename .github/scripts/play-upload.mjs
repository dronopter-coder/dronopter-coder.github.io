// İmzalı AAB'yi Play Console'a yükler ve dahili test kanalında yayınlar.
// Kullanım: node play-upload.mjs <aab> [kanal=internal] ; sürüm notu PLAY_RELEASE_NOTES (tr-TR).
import { readFile } from 'node:fs/promises';

import { accessToken, client, PlayError } from './play-api.mjs';

const [aabPath, track = 'internal'] = process.argv.slice(2);
if (!aabPath) throw new Error('AAB yolu verilmedi');
const notes = (process.env.PLAY_RELEASE_NOTES || 'Hata düzeltmeleri ve iyileştirmeler.').slice(0, 500);

const call = client(await accessToken());
const { id: edit } = await call('POST', '/edits');

const bundle = await call('POST', `/edits/${edit}/bundles`, { upload: await readFile(aabPath) });
console.log(`Yüklendi: sürüm kodu ${bundle.versionCode}`);

const release = (status) => ({
  track,
  releases: [
    {
      name: process.env.PLAY_RELEASE_NAME || undefined,
      versionCodes: [String(bundle.versionCode)],
      status,
      releaseNotes: [{ language: 'tr-TR', text: notes }],
    },
  ],
});

let status = 'completed';
try {
  await call('PUT', `/edits/${edit}/tracks/${track}`, { body: release(status) });
  await call('POST', `/edits/${edit}:commit`);
} catch (e) {
  // Hiç yayınlanmamış (taslak) uygulamalarda Play yalnızca taslak sürüme izin verir.
  if (!(e instanceof PlayError) || !/draft/i.test(JSON.stringify(e.body))) throw e;
  status = 'draft';
  console.log('Uygulama taslak durumunda; sürüm taslak olarak kaydediliyor.');
  await call('PUT', `/edits/${edit}/tracks/${track}`, { body: release(status) });
  await call('POST', `/edits/${edit}:commit`);
}
console.log(`Kanal: ${track} · durum: ${status}`);
if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFile } = await import('node:fs/promises');
  await appendFile(
    process.env.GITHUB_STEP_SUMMARY,
    `### Play Console: sürüm kodu ${bundle.versionCode} → ${track} (${status === 'completed' ? 'yayında' : 'taslak, Play Console’dan yayınlayın'})\n`,
  );
}
