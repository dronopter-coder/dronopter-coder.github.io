// Forum kimlik doğrulama: PBKDF2 şifreler, çerez oturumları, CSRF, Google ile giriş (OIDC) ve Cloudflare Turnstile.
import type { ForumEnv, User } from './types';

const enc = new TextEncoder();
const b64url = (b: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
export const randomToken = (bytes = 32) => b64url(crypto.getRandomValues(new Uint8Array(bytes)));
export const sha256 = async (s: string) => b64url(await crypto.subtle.digest('SHA-256', enc.encode(s)));

const ITER = 100_000; // Workers'ta PBKDF2 için üst sınır

export async function hashPassword(pw: string, salt = crypto.getRandomValues(new Uint8Array(16))): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITER }, key, 256);
  return `pbkdf2$${ITER}$${b64url(salt)}$${b64url(bits)}`;
}

export async function verifyPassword(pw: string, stored: string | null): Promise<boolean> {
  if (!stored) return false;
  const [, iter, salt, hash] = stored.split('$');
  if (Number(iter) !== ITER || !salt || !hash) return false;
  const again = (await hashPassword(pw, fromB64url(salt))).split('$')[3];
  // Sabit zamanlı karşılaştırma
  let diff = again.length ^ hash.length;
  for (let i = 0; i < Math.min(again.length, hash.length); i++) diff |= again.charCodeAt(i) ^ hash.charCodeAt(i);
  return diff === 0;
}

const SESSION_DAYS = 30;
export const COOKIE = 'dfs';

export function cookie(name: string, value: string, maxAge: number) {
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export function readCookie(req: Request, name: string): string | null {
  const m = (req.headers.get('Cookie') ?? '').match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? m[1] : null;
}

export async function createSession(env: ForumEnv, userId: number): Promise<string> {
  const token = randomToken();
  await env.FORUM_DB!.prepare('INSERT INTO sessions (token_hash, user_id, csrf, expires_at) VALUES (?, ?, ?, ?)')
    .bind(await sha256(token), userId, randomToken(18), Date.now() + SESSION_DAYS * 864e5)
    .run();
  return cookie(COOKIE, token, SESSION_DAYS * 86400);
}

export type Session = { user: User; csrf: string; tokenHash: string };

export async function getSession(req: Request, env: ForumEnv): Promise<Session | null> {
  const token = readCookie(req, COOKIE);
  if (!token || !env.FORUM_DB) return null;
  const tokenHash = await sha256(token);
  const row = await env.FORUM_DB.prepare(
    `SELECT s.csrf, s.expires_at, u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?`,
  ).bind(tokenHash).first<User & { csrf: string; expires_at: number }>();
  if (!row || row.expires_at < Date.now() || row.status === 'banned') return null;
  const { csrf, expires_at: _e, ...user } = row;
  return { user: { ...user, role: isAdmin(env, user.username) ? 'admin' : user.role }, csrf, tokenHash };
}

export const isAdmin = (env: ForumEnv, username: string) =>
  (env.FORUM_ADMINS ?? '').split(',').map((s) => s.trim().toLocaleLowerCase('tr-TR')).filter(Boolean)
    .includes(username.toLocaleLowerCase('tr-TR'));

/** Durum değiştiren isteklerin aynı siteden geldiğini doğrular (CSRF'e karşı ikinci savunma). */
export function sameOrigin(req: Request): boolean {
  const url = new URL(req.url);
  const origin = req.headers.get('Origin') ?? req.headers.get('Referer');
  if (!origin) return false;
  try {
    return new URL(origin).host === url.host;
  } catch {
    return false;
  }
}

export async function verifyTurnstile(env: ForumEnv, token: string | null, ip: string): Promise<boolean> {
  if (!env.TURNSTILE_SECRET) return true; // Anahtar yoksa honeypot ve hız sınırı korur
  if (!token) return false;
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET);
  body.append('response', token);
  body.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    return ((await r.json()) as { success?: boolean }).success === true;
  } catch {
    return false;
  }
}

// ---------- Google ile giriş (OpenID Connect, yetkilendirme kodu akışı) ----------
export const googleEnabled = (env: ForumEnv) => Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
const redirectUri = (req: Request) => `${new URL(req.url).origin}/forum/auth/google`;

export function googleStart(req: Request, env: ForumEnv): Response {
  const state = randomToken(18);
  const u = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  u.search = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID!, redirect_uri: redirectUri(req), response_type: 'code',
    scope: 'openid profile', state, prompt: 'select_account',
  }).toString();
  return new Response(null, { status: 302, headers: { Location: u.toString(), 'Set-Cookie': cookie('dfg', state, 600) } });
}

/** Google'dan dönen kodu doğrular; başarılıysa { sub, name } döner. */
export async function googleCallback(req: Request, env: ForumEnv): Promise<{ sub: string; name: string } | null> {
  const url = new URL(req.url);
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');
  if (!state || !code || state !== readCookie(req, 'dfg')) return null;
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code, client_id: env.GOOGLE_CLIENT_ID!, client_secret: env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri(req), grant_type: 'authorization_code',
    }),
  });
  if (!r.ok) return null;
  const { id_token } = (await r.json()) as { id_token?: string };
  if (!id_token) return null;
  // Kimlik belirteci TLS üzerinden doğrudan Google'ın token uç noktasından alındığı için imza yeniden doğrulanmaz (OIDC 3.1.3.7).
  const payload = JSON.parse(new TextDecoder().decode(fromB64url(id_token.split('.')[1] ?? ''))) as {
    sub?: string; aud?: string; iss?: string; exp?: number; name?: string; given_name?: string;
  };
  if (!payload.sub || payload.aud !== env.GOOGLE_CLIENT_ID) return null;
  if (!['accounts.google.com', 'https://accounts.google.com'].includes(payload.iss ?? '')) return null;
  if (!payload.exp || payload.exp * 1000 < Date.now()) return null;
  return { sub: payload.sub, name: (payload.name ?? payload.given_name ?? 'Üye').slice(0, 40) };
}
