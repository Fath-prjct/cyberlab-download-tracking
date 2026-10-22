import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'cyberlab_admin';
const SESSION_SECONDS = 60 * 60 * 8;

function signature(expires: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET must contain at least 32 characters.');
  return createHmac('sha256', secret).update(expires).digest('hex');
}

export function createSessionValue() {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${expires}.${signature(expires)}`;
}

export function verifySessionValue(value?: string) {
  if (!value) return false;
  const [expires, suppliedSignature, ...rest] = value.split('.');
  if (!expires || !suppliedSignature || rest.length || !/^\d+$/.test(expires)) return false;
  if (Number(expires) < Math.floor(Date.now() / 1000)) return false;
  try {
    const expected = Buffer.from(signature(expires), 'hex');
    const supplied = Buffer.from(suppliedSignature, 'hex');
    return expected.length === supplied.length && timingSafeEqual(expected, supplied);
  } catch {
    return false;
  }
}

export async function isAdmin() {
  const jar = await cookies();
  return verifySessionValue(jar.get(COOKIE_NAME)?.value);
}

export const sessionCookieName = COOKIE_NAME;
export const sessionMaxAge = SESSION_SECONDS;
