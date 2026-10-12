// Google Play Developer API (androidpublisher v3) için küçük istemci: hizmet hesabı JSON'undan erişim
// belirteci alır, JSON/medya istekleri yapar. Bağımlılık yok (Node 20+ fetch ve crypto).
import { createSign } from 'node:crypto';

const API = process.env.PLAY_API_BASE || 'https://androidpublisher.googleapis.com';
export const PACKAGE = process.env.PLAY_PACKAGE || 'online.defineciler.app';

const b64url = (b) => Buffer.from(b).toString('base64url');

export async function accessToken(json = process.env.PLAY_SERVICE_ACCOUNT_JSON) {
  if (!json) throw new Error('PLAY_SERVICE_ACCOUNT_JSON eksik');
  const sa = JSON.parse(json);
  const now = Math.floor(Date.now() / 1000);
  const tokenUri = process.env.PLAY_TOKEN_URI || sa.token_uri || 'https://oauth2.googleapis.com/token';
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/androidpublisher',
      aud: tokenUri,
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = createSign('RSA-SHA256');
  signer.update(`${head}.${claim}`);
  const jwt = `${head}.${claim}.${b64url(signer.sign(sa.private_key))}`;
  const res = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) throw new Error(`Erişim belirteci alınamadı (${res.status}): ${JSON.stringify(data)}`);
  console.log(`Hizmet hesabı: ${sa.client_email}`);
  return data.access_token;
}

export class PlayError extends Error {
  constructor(status, body, path) {
    super(`${status} ${path}: ${typeof body === 'string' ? body : JSON.stringify(body)}`);
    this.status = status;
    this.body = body;
  }
}

/** JSON isteği; `upload` verilirse gövde ham bayt olarak /upload/ uç noktasına gönderilir. */
export function client(token) {
  return async function call(method, path, { body, query, upload } = {}) {
    const url = new URL(`${upload ? '/upload' : ''}/androidpublisher/v3/applications/${PACKAGE}${path}`, API);
    for (const [k, v] of Object.entries(query ?? {})) url.searchParams.set(k, v);
    if (upload) url.searchParams.set('uploadType', 'media');
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': upload ? 'application/octet-stream' : 'application/json',
      },
      body: upload ?? (body === undefined ? undefined : JSON.stringify(body)),
    });
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = text;
    }
    if (!res.ok) throw new PlayError(res.status, data, `${method} ${path}`);
    return data;
  };
}
