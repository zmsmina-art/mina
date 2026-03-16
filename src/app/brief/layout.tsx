import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google';
import BriefShell from '@/components/BriefShell';
import { BriefServiceWorker } from '@/components/BriefServiceWorker';

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

export default function BriefLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${playfair.variable} ${inter.variable} ${jetbrains.variable}`}>
      <BriefShell>{children}</BriefShell>
      <BriefServiceWorker />
    </div>
  );
}
