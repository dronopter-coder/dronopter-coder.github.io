// Forum altyapısı: D1 veritabanını (defineciler-forum) ve R2 fotoğraf kovasını (defineciler-forum-img) bulur ya da
// oluşturur, wrangler.ci.jsonc'ye bağlar, veritabanı tablolarını (migrations/) uygular ve forum ayarlarını (vars) ekler.
// Her adım bağımsızdır: biri başarısız olursa yalnızca uyarı verilir; forum o özellik olmadan çalışır, site bozulmaz.
// Kullanım (defineciler/worker içinde, ensure-kv.mjs'ten sonra): node ../../.github/scripts/ensure-forum.mjs
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const DB = 'defineciler-forum';
const BUCKET = 'defineciler-forum-img';
const CFG = 'wrangler.ci.jsonc';
// Veritabanı Cloudflare panelinden/bağlantısından bir kez oluşturuldu (tablolar kurulu). Token'ın D1 izni yoksa bu kimlikle bağlanır.
const KNOWN_DB_ID = 'f7838aff-a164-4334-9240-8bea93e6e328';
// Varsayılan forum yöneticisi; GitHub değişkeni FORUM_ADMINS ile değiştirilebilir.
const DEFAULT_ADMINS = 'dronopter';
const run = (args) => execFileSync('npx', ['wrangler', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
// wrangler'ın uyarı satırlarını atlayıp asıl hatayı (✘ [ERROR] …, Authentication error …) gösterir.
const short = (e) => {
  const lines = `${e.stderr ?? ''}\n${e.stdout ?? ''}\n${e.message ?? ''}`.split('\n').map((l) => l.replace(/\x1b\[[0-9;]*m/g, '').trim()).filter(Boolean);
  return lines.find((l) => /ERROR|error|Error|denied|not authorized|10000|7403/.test(l) && !/CF_ACCOUNT_ID/.test(l)) ?? lines.find((l) => !/CF_ACCOUNT_ID|^▲|WARNING/.test(l)) ?? 'bilinmeyen hata';
};

let cfg = readFileSync(existsSync(CFG) ? CFG : 'wrangler.jsonc', 'utf8');
if (!cfg.includes('"ratelimits"') || !cfg.includes('"vars": {')) throw new Error('wrangler yapılandırması beklenen biçimde değil');
const insert = (block) => (cfg = cfg.replace('"ratelimits"', `${block},\n  "ratelimits"`));

// --- D1 ---
let dbOk = false;
try {
  let id;
  try {
    const list = JSON.parse(run(['d1', 'list', '--json']));
    id = list.find((d) => d.name === DB)?.uuid;
  } catch (e) {
    console.log('D1 listesi okunamadı:', short(e));
  }
  if (!id) id = KNOWN_DB_ID;
  if (!id) {
    const out = run(['d1', 'create', DB]);
    id = out.match(/"database_id":\s*"([0-9a-f-]{36})"/)?.[1] ?? out.match(/\b([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/)?.[1];
    console.log('D1 oluşturuldu:', id);
  } else console.log('D1 bulundu:', id);
  if (!id) throw new Error('D1 kimliği bulunamadı');
  insert(`"d1_databases": [{ "binding": "FORUM_DB", "database_name": "${DB}", "database_id": "${id}", "migrations_dir": "migrations" }]`);
  writeFileSync(CFG, cfg);
  dbOk = true;
  try {
    console.log(run(['d1', 'migrations', 'apply', DB, '--remote', '--config', CFG]).split('\n').slice(-6).join('\n'));
  } catch (e) {
    console.log(`::warning::Veritabanı tabloları güncellenemedi (${short(e)}); mevcut tablolarla devam ediliyor. Yeni bir migrations/ dosyası eklendiyse token'a "D1 Edit" izni gerekir.`);
  }
} catch (e) {
  console.log(`::warning::Forum veritabanı (D1) hazırlanamadı: ${short(e)}. Cloudflare API token'ına "D1 Edit" izni ekleyin; forum o zamana kadar "yakında" gösterir.`);
  cfg = cfg.replace(/"d1_databases":[^\n]*\n\s*/, '');
}

// --- R2 (fotoğraflar) ---
if (dbOk) {
  try {
    let exists = false;
    try {
      exists = run(['r2', 'bucket', 'list']).includes(BUCKET);
    } catch (e) {
      console.log('R2 listesi okunamadı:', short(e));
    }
    if (!exists) {
      run(['r2', 'bucket', 'create', BUCKET]);
      console.log('R2 kovası oluşturuldu:', BUCKET);
    } else console.log('R2 kovası bulundu:', BUCKET);
    insert(`"r2_buckets": [{ "binding": "FORUM_IMG", "bucket_name": "${BUCKET}" }]`);
  } catch (e) {
    console.log(`::warning::Forum fotoğraf deposu (R2) hazırlanamadı: ${short(e)}. Cloudflare panelinden R2'yi etkinleştirip token'a "Workers R2 Storage Edit" izni ekleyin; o zamana kadar fotoğraf yükleme kapalı.`);
  }
}

// --- herkese açık ayarlar (gizli olmayanlar) ---
const vars = Object.fromEntries(
  ['FORUM_ADMINS', 'TURNSTILE_SITE_KEY', 'GOOGLE_CLIENT_ID'].map((k) => [k, (process.env[k] ?? '').trim() || (k === 'FORUM_ADMINS' ? DEFAULT_ADMINS : '')]).filter(([, v]) => v),
);
for (const [k, v] of Object.entries(vars)) cfg = cfg.replace('"vars": {', `"vars": {\n    ${JSON.stringify(k)}: ${JSON.stringify(v)},`);
console.log('Forum ayarları:', Object.keys(vars).join(', ') || '(yok)');

writeFileSync(CFG, cfg);
console.log(`${CFG} yazıldı.`);
