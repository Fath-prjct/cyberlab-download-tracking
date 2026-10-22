import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/session';
import { getSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    const { data, error } = await getSupabase()
      .from('access_events')
      .select('id, event_type, ip_address, user_agent, referrer, path, created_at')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) throw error;
    return NextResponse.json({ events: data ?? [] }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Admin event fetch failed:', error);
    return NextResponse.json({ error: 'Could not load events.' }, { status: 503 });
  }
}
