import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google';
import BriefShell from '@/components/BriefShell';
import BriefAutoSync from '@/components/BriefAutoSync';
import { BriefServiceWorker } from '@/components/BriefServiceWorker';
import { sql } from '@/lib/neon';

const playfair = Playfair_Display({
  variable: '--font-playfair-display',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  manifest: '/brief-manifest.json',
  icons: { apple: '/brief-apple-touch-icon.png' },
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Command Centre',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0C',
};

const STALE_MS = 60 * 60 * 1000; // 1 hour

async function checkStaleness(): Promise<boolean> {
  try {
    const db = sql();
    const rows = await db`
      SELECT created_at FROM agent_reports ORDER BY created_at DESC LIMIT 1
    ` as Record<string, unknown>[];
    if (rows.length === 0) return true;
    const age = Date.now() - new Date(rows[0].created_at as string).getTime();
    return age > STALE_MS;
  } catch {
    return false; // Don't trigger sync on DB error
  }
}

export default async function BriefLayout({ children }: { children: React.ReactNode }) {
  const stale = await checkStaleness();

  return (
    <div className={`${playfair.variable} ${inter.variable} ${jetbrains.variable}`}>
      <BriefShell>{children}</BriefShell>
      <BriefAutoSync stale={stale} />
      <BriefServiceWorker />
    </div>
  );
}
