import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CyberLab | Download Tracking Lab',
  description: 'Demonstrasi edukasi tentang pencatatan akses web dan keamanan privasi.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
