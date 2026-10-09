// USAGE KV alanını (günlük sayaçlar + sonuç önbelleği) bulur veya oluşturur ve
// defineciler/worker/wrangler.ci.jsonc dosyasına bağlar. Başarısız olursa dosya yazılmaz:
// sunucu KV'siz (sınırsız, önbelleksiz) yayınlanmaya devam eder, hiçbir zaman bozulmaz.
// Kullanım (defineciler/worker içinde): node ../../.github/scripts/ensure-kv.mjs
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const TITLE = 'defineciler-USAGE';
const run = (args) => execFileSync('npx', ['wrangler', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

try {
  let id;
  try {
    const raw = run(['kv', 'namespace', 'list']);
    const list = JSON.parse(raw.slice(raw.indexOf('[')));
    id = list.find((n) => n.title === TITLE)?.id;
  } catch (e) {
    console.log('KV listesi okunamadı:', String(e.message).split('\n')[0]);
  }
  if (!id) {
    const out = run(['kv', 'namespace', 'create', TITLE]);
    id = out.match(/"id":\s*"([0-9a-f]{32})"/)?.[1] ?? out.match(/\b([0-9a-f]{32})\b/)?.[1];
    console.log('KV oluşturuldu:', id);
  } else {
    console.log('KV bulundu:', id);
  }
  if (!id) throw new Error('KV kimliği bulunamadı');

  const cfg = readFileSync('wrangler.jsonc', 'utf8');
  if (!cfg.includes('"ratelimits"')) throw new Error('wrangler.jsonc beklenen biçimde değil');
  writeFileSync(
    'wrangler.ci.jsonc',
    cfg.replace('"ratelimits"', `"kv_namespaces": [{ "binding": "USAGE", "id": "${id}" }],\n  "ratelimits"`),
  );
  console.log('wrangler.ci.jsonc yazıldı (USAGE bağlı).');
} catch (e) {
  console.log(`::warning::KV hazırlanamadı (${String(e.message).split('\n')[0]}); sunucu günlük sınırlar ve önbellek olmadan yayınlanacak.`);
}
