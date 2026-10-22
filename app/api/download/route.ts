import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
    const { error } = await getSupabase().from('access_events').insert({
      event_type: 'download',
      ip_address: ip,
      user_agent: (request.headers.get('user-agent') || 'unknown').slice(0, 500),
      referrer: (request.headers.get('referer') || '').slice(0, 1000),
      path: '/api/download',
    });
    if (error) throw error;
    const content = 'CyberLab Security Sample\n\nThis is a harmless text file for an educational web security demonstration.\nNo executable code is included.\n';
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="security-sample.txt"',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Download event logging failed:', error);
    return NextResponse.json({ error: 'Download logging is not configured or failed.' }, { status: 503 });
  }
}
