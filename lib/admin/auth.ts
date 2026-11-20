// Edge-safe (uses Web Crypto only) so middleware and server code share one implementation.
export const SESSION_COOKIE = "admin_session";
export const SESSION_SECONDS = 60 * 60 * 24 * 7;

const enc = new TextEncoder();

function secret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

async function hmac(data: string): Promise<string> {
  const s = secret();
  if (!s) throw new Error("ADMIN_PASSWORD is not set");
  const key = await crypto.subtle.importKey("raw", enc.encode(s), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
  return Array.from(sig, (b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function checkPassword(input: string): Promise<boolean> {
  const real = process.env.ADMIN_PASSWORD;
  if (!real || !input) return false;
  // Compare HMACs so length/timing never leak the password.
  return safeEqual(await hmac(`pw:${input}`), await hmac(`pw:${real}`));
}

export async function createSessionToken(): Promise<string> {
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${exp}.${await hmac(`session:${exp}`)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token || !secret()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp)) return false;
  if (Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, await hmac(`session:${exp}`));
}
