import Link from 'next/link';
import { NewsletterCTA } from '@/components/NewsletterModal';
import { motionDelay } from '@/lib/utils';

const navigationLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },

  { label: 'Articles', href: '/articles' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'Book a Call', href: '/book' },
  { label: 'Contact', href: '/#contact' },
];

const networkLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mina-mankarious' },
  { label: 'X', href: 'https://x.com/minamnkarious' },
  { label: 'GitHub', href: 'https://github.com/zmsmina-art' },
  { label: 'Olunix', href: 'https://olunix.com' },
];


export default function SiteFooter() {
  return (
    <footer className="site-footer" data-section-theme="footer">
      <div className="page-gutter mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 py-12 md:grid-cols-12 md:gap-6 md:py-14">
        <div className="md:col-span-5 lg:col-span-6" data-motion="footer-rise" style={motionDelay(40)}>
          <p className="brand-mark brand-mark--footer">mm.</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
            Mina Mankarious is the Founder &amp; CEO of <a href="https://olunix.com" target="_blank" rel="noopener noreferrer" className="text-[var(--text-primary)] transition-colors hover:text-[var(--accent-gold-soft)]">Olunix</a>, helping AI startups with positioning, growth systems, and founder-led marketing from Toronto.
          </p>
          <div className="mt-5">
            <NewsletterCTA />
          </div>
        </div>

        <div className="md:col-span-3 lg:col-span-3" data-motion="footer-rise" style={motionDelay(120)}>
          <p className="footer-heading">Navigation</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {navigationLinks.map((link) => (
              <Link key={link.label} href={link.href} prefetch={false} className="footer-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 lg:col-span-3" data-motion="footer-rise" style={motionDelay(200)}>
          <p className="footer-heading">Networks</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {networkLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="footer-link">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        className="page-gutter mx-auto w-full max-w-7xl border-t border-[var(--stroke-soft)] pb-8 pt-4 text-xs lowercase tracking-[0.12em] text-[var(--text-dim)]"
        data-motion="footer-rise"
        style={motionDelay(260)}
      >
        <span>© {new Date().getFullYear()} Mina Mankarious.</span>
        <span className="mx-2">·</span>
        <Link href="/privacy" prefetch={false} className="transition-colors hover:text-[var(--text-muted)]">Privacy</Link>
      </div>
    </footer>
  );
}
