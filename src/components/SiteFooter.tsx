import Link from 'next/link';
import type { CSSProperties } from 'react';

const navigationLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Articles', href: '/articles' },
  { label: 'Contact', href: '/#contact' },
];

const networkLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mina-mankarious' },
  { label: 'X', href: 'https://x.com/minamnkarious' },
  { label: 'GitHub', href: 'https://github.com/zmsmina-art' },
  { label: 'Olunix', href: 'https://olunix.com' },
];

function motionDelay(ms: number): CSSProperties {
  return { '--motion-delay': `${ms}ms` } as CSSProperties;
}

export default function SiteFooter() {
  return (
    <footer className="site-footer" data-section-theme="footer">
      <div className="page-gutter mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 py-12 md:grid-cols-12 md:gap-6 md:py-14">
        <div className="md:col-span-5 lg:col-span-6" data-motion="footer-rise" style={motionDelay(40)}>
          <p className="brand-mark brand-mark--footer">mm.</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
            Founder and operator building growth systems for AI startups through narrative clarity and disciplined execution.
          </p>
        </div>

        <div className="md:col-span-3 lg:col-span-3" data-motion="footer-rise" style={motionDelay(120)}>
          <p className="footer-heading">Navigation</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {navigationLinks.map((link) => (
              <Link key={link.label} href={link.href} className="footer-link">
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
        © {new Date().getFullYear()} Mina Mankarious.
      </div>
    </footer>
  );
}
