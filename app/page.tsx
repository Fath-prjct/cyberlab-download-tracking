'use client';

import { useEffect, useRef, useState } from 'react';

export default function HomePage() {
  const [notice, setNotice] = useState('');
  const pageViewSent = useRef(false);

  useEffect(() => {
    if (pageViewSent.current) return;
    pageViewSent.current = true;
    void fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'page_view' }),
      keepalive: true,
    }).catch(() => { /* Logging errors must not block the page. */ });
  }, []);

  async function downloadSample() {
    setNotice('Menyiapkan file contoh…');
    try {
      const response = await fetch('/api/download', { method: 'GET', cache: 'no-store' });
      if (!response.ok) throw new Error('Download gagal. Coba lagi.');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'security-sample.txt';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setNotice('Download dimulai. Aktivitas ini dicatat untuk demonstrasi keamanan.');
    } catch {
      setNotice('Download gagal. Periksa konfigurasi server lalu coba lagi.');
    }
  }

  return (
    <main className="page-shell">
      <nav className="topbar"><a className="brand" href="/">◈ CyberLab</a><span className="pill">SECURITY AWARENESS LAB</span></nav>
      <section className="hero">
        <div className="eyebrow"><span className="pulse" /> WEB SECURITY / ACCESS LOGGING</div>
        <h1>Understand what a website can <span>actually see.</span></h1>
        <p className="intro">Eksperimen edukasi tentang informasi teknis yang dapat diterima server ketika seseorang membuka halaman atau mengunduh file.</p>
        <div className="download-card">
          <div className="file-icon">TXT</div>
          <div className="file-info"><strong>security-sample.txt</strong><span>File teks aman · 1 KB</span></div>
          <button className="download-button" onClick={downloadSample}>↓ Download sample</button>
        </div>
        <p className="notice"><span>ⓘ</span> Transparansi: server mencatat waktu, jenis event, alamat IP yang terlihat server, dan User-Agent. Data ini digunakan untuk demonstrasi kelas. Jangan gunakan untuk melacak orang tanpa sepengetahuan mereka.</p>
        {notice && <p className="status" role="status">{notice}</p>}
      </section>
      <section className="info-grid">
        <article className="info-card"><span className="number">01</span><h2>Request metadata</h2><p>Server dapat menerima IP koneksi, waktu request, path, dan User-Agent. Informasi perangkat dan lokasi hanya perkiraan.</p></article>
        <article className="info-card"><span className="number">02</span><h2>Not device access</h2><p>Klik download tidak otomatis memberikan akses ke password, kontak, IMEI, kamera, atau file pribadi.</p></article>
        <article className="info-card"><span className="number">03</span><h2>Learn defensively</h2><p>Bandingkan log kunjungan dan download, lalu diskusikan minimisasi data, retensi, dan kontrol akses.</p></article>
      </section>
      <footer><span>CYBERLAB · EDUCATIONAL DEMO</span><a href="/admin">Admin dashboard ↗</a></footer>
    </main>
  );
}
