import { NextRequest, NextResponse } from 'next/server';
import { createSessionValue, sessionCookieName, sessionMaxAge } from '@/lib/session';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword || !process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    return NextResponse.json({ error: 'Admin environment variables are not configured.' }, { status: 503 });
  }
  let password = '';
  try { password = String((await request.json())?.password ?? ''); } catch {}
  if (password.length > 256 || password !== configuredPassword) {
    return NextResponse.json({ error: 'Password salah.' }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: sessionMaxAge,
  });
  return response;
}
