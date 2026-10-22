'use client';

import { FormEvent, useEffect, useState } from 'react';

type EventRow = {
  id: number; event_type: string; ip_address: string; user_agent: string;
  referrer: string | null; path: string; created_at: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadEvents() {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/admin/events', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal memuat log.');
      setEvents(data.events); setLoggedIn(true);
    } catch (e) { setError(e instanceof Error ? e.message : 'Terjadi kesalahan.'); setLoggedIn(false); }
    finally { setLoading(false); }
  }

  useEffect(() => { void loadEvents(); }, []);

  async function login(event: FormEvent) {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login gagal.');
      setPassword(''); await loadEvents();
    } catch (e) { setError(e instanceof Error ? e.message : 'Login gagal.'); }
    finally { setLoading(false); }
  }

  if (!loggedIn) return <main className="admin-shell"><a className="brand" href="/">← CyberLab</a><section className="login-card"><div className="eyebrow">RESTRICTED AREA</div><h1>Admin dashboard</h1><p>Masukkan password admin untuk melihat log akses.</p><form onSubmit={login}><label htmlFor="password">Admin password</label><input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"/><button className="download-button full" disabled={loading}>{loading ? 'Memeriksa…' : 'Login'}</button></form>{error && <p className="error" role="alert">{error}</p>}<p className="fine-print">Log berisi data teknis pengunjung. Akses hanya untuk kebutuhan demonstrasi yang sah.</p></section></main>;

  const downloads = events.filter(e => e.event_type === 'download').length;
  const pageViews = events.filter(e => e.event_type === 'page_view').length;
  return <main className="admin-shell wide"><nav className="topbar"><a className="brand" href="/">← CyberLab</a><button className="secondary-button" onClick={() => void loadEvents()}>{loading ? 'Memuat…' : '↻ Refresh'}</button></nav><div className="admin-heading"><div className="eyebrow">SECURITY OBSERVABILITY</div><h1>Access events</h1><p>Menampilkan hingga 200 event terbaru yang tercatat.</p></div>{error && <p className="error">{error}</p>}<section className="stats"><article><span>Total events</span><strong>{events.length}</strong></article><article><span>Downloads</span><strong>{downloads}</strong></article><article><span>Page views</span><strong>{pageViews}</strong></article></section><section className="table-wrap"><table><thead><tr><th>Waktu (UTC)</th><th>Event</th><th>IP address</th><th>User-Agent</th></tr></thead><tbody>{events.map(row => <tr key={row.id}><td>{new Date(row.created_at).toLocaleString('id-ID', { timeZone: 'UTC' })}</td><td><span className={row.event_type === 'download' ? 'event-tag download-tag' : 'event-tag'}>{row.event_type}</span></td><td className="mono">{row.ip_address}</td><td className="ua">{row.user_agent}</td></tr>)}</tbody></table>{events.length === 0 && <p className="empty">Belum ada event yang tercatat. Buka halaman utama dan coba download file.</p>}</section><p className="fine-print">Simpan log hanya selama diperlukan untuk tugas. Jangan memublikasikan IP atau User-Agent individu dalam laporan publik.</p></main>;
}
