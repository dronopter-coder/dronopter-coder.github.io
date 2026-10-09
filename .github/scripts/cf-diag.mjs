// Cloudflare'in son 24 saatlik Worker istek kayıtlarını (durum ve süre) okur: telefondaki tarama denemeleri sunucuya ulaştı mı?
// Kullanım: CLOUDFLARE_API_TOKEN=... [CF_ACCOUNT_ID=...] node .github/scripts/cf-diag.mjs
const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) throw new Error('CLOUDFLARE_API_TOKEN yok');
const api = async (path, init) => {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  return res.json();
};

let account = process.env.CF_ACCOUNT_ID;
if (!account) {
  const accounts = await api('/accounts');
  account = accounts?.result?.[0]?.id;
  console.log('Hesap bulundu:', accounts?.result?.map((a) => a.name).join(', ') || JSON.stringify(accounts?.errors));
}
if (!account) throw new Error('Hesap kimliği bulunamadı (token "Account Settings: Read" iznine sahip olmayabilir)');

const until = new Date();
const hours = Number(process.env.CF_HOURS ?? 6);
const gran = process.env.CF_GRAN ?? 'datetimeMinute';
const since = new Date(until.getTime() - hours * 3600 * 1000);
const run = async (fields) => {
  const query = `query($acc:String!,$since:Time!,$until:Time!){viewer{accounts(filter:{accountTag:$acc}){
    workersInvocationsAdaptive(limit:500,filter:{scriptName:"defineciler-api",datetime_geq:$since,datetime_leq:$until},orderBy:[${gran}_ASC]){
      ${fields}}}}}`;
  return api('/graphql', {
    method: 'POST',
    body: JSON.stringify({ query, variables: { acc: account, since: since.toISOString(), until: until.toISOString() } }),
  });
};

let out = await run('dimensions{${gran} status} sum{requests errors subrequests} quantiles{cpuTimeP50 cpuTimeP99 wallTimeP50 wallTimeP99}');
if (out.errors?.length) {
  console.log('Ayrıntılı sorgu reddedildi:', out.errors.map((e) => e.message).join(' | '));
  out = await run('dimensions{${gran} status} sum{requests errors subrequests}');
}
if (out.errors?.length) {
  console.log('::warning::Cloudflare analitik okunamadı:', out.errors.map((e) => e.message).join(' | '));
  process.exit(0);
}
const rows = out.data?.viewer?.accounts?.[0]?.workersInvocationsAdaptive ?? [];
console.log(`\nSon ${hours} saat, ${rows.length} satır (saat · durum · istek · hata · alt istek · cpu ms p50/p99 · süre ms p50/p99):`);
const total = {};
for (const r of rows) {
  const q = r.quantiles ?? {};
  console.log(
    `${r.dimensions[gran]} · ${r.dimensions.status.padEnd(18)} · ${String(r.sum.requests).padStart(4)} · ${r.sum.errors} · ${r.sum.subrequests}` +
      (q.cpuTimeP50 != null ? ` · cpu ${(q.cpuTimeP50 / 1000).toFixed(1)}/${(q.cpuTimeP99 / 1000).toFixed(1)}` : '') +
      (q.wallTimeP50 != null ? ` · süre ${Math.round(q.wallTimeP50 / 1000)}/${Math.round(q.wallTimeP99 / 1000)}` : ''),
  );
  total[r.dimensions.status] = (total[r.dimensions.status] ?? 0) + r.sum.requests;
}
console.log('\nToplam durum dağılımı:', JSON.stringify(total));
