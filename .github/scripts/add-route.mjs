// Worker yapılandırmasına özel alan adı (custom domain) ekler.
// Kullanım (defineciler/worker içinde): node ../../.github/scripts/add-route.mjs <girdi.jsonc> <çıktı.jsonc> <api.alanadi.com>
// Neden ayrı dosya: token'ın alan adı izni eksikse yalnızca bu yapılandırma başarısız olur;
// iş akışı özel alan adsız yapılandırmayla yayınlamaya devam eder.
// workers_dev açıkça true: routes verilince Wrangler workers.dev adresini varsayılan olarak kapatır;
// workers.dev yedek adres olarak açık kalmalı (eski APK'lar ve yedek için).
import { readFileSync, writeFileSync } from 'node:fs';

const [input, output, domain] = process.argv.slice(2);
if (!input || !output || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain ?? '')) {
  console.error('Kullanım: add-route.mjs <girdi> <çıktı> <alan.adı>');
  process.exit(1);
}
const cfg = readFileSync(input, 'utf8');
if (!cfg.includes('"ratelimits"')) throw new Error('wrangler yapılandırması beklenen biçimde değil');
writeFileSync(output, cfg.replace('"ratelimits"', `"workers_dev": true,\n  "routes": [{ "pattern": "${domain}", "custom_domain": true }],\n  "ratelimits"`));
console.log(`${output} yazıldı (özel alan adı: ${domain}).`);
