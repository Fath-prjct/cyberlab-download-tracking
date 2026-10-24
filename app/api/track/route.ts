import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = body?.event;
    if (event !== 'page_view' && event !== 'download') {
      return NextResponse.json({ error: 'Invalid event.' }, { status: 400 });
    }
    const realIp = request.headers.get('x-real-ip');
const forwarded = request.headers.get('x-forwarded-for');

console.log('ip headers', {
  realIp: request.headers.get('x-real-ip'),
  forwarded: request.headers.get('x-forwarded-for'),
});

const ip =
  realIp?.trim() ||
  forwarded?.split(',')[0]?.trim() ||
  'unknown';
    const userAgent = (request.headers.get('user-agent') || 'unknown').slice(0, 500);
    const referrer = (request.headers.get('referer') || '').slice(0, 1000);
    const { error } = await getSupabase().from('access_events').insert({
      event_type: event,
      ip_address: ip,
      user_agent: userAgent,
      referrer,
      path: event === 'download' ? '/api/download' : '/',
    });
    if (error) throw error;
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Access event logging failed:', error);
    return NextResponse.json({ error: 'Logging is not configured or failed.' }, { status: 503 });
  }
}
