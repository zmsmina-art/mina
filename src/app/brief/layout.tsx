import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google';
import BriefShell from '@/components/BriefShell';

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

export default function BriefLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${playfair.variable} ${inter.variable} ${jetbrains.variable}`}>
      <BriefShell>{children}</BriefShell>
    </div>
  );
}
