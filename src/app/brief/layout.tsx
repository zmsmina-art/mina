import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google';

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
    <div
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable} brief-shell`}
      style={{
        minHeight: '100vh',
        background: '#0A0A0C',
        color: '#E8E4DC',
        fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        letterSpacing: '0.01em',
      }}
    >
      {children}
    </div>
  );
}
