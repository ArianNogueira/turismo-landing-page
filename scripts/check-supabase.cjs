const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd(), false, { info() {}, error() {} });

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing Supabase environment variables.');
  for (const path of ['/auth/v1/settings', '/rest/v1/bookings?select=id&limit=0', '/rest/v1/vouchers?select=id&limit=0']) {
    const response = await fetch(`${url}${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    const body = await response.json();
    // Never print credentials, auth settings or customer records.
    console.log(`${path}: HTTP ${response.status}${body.code ? ` (${body.code})` : ''}`);
  }
}
main().catch(() => { console.error('Connection check failed. No credentials were printed.'); process.exitCode = 1; });
