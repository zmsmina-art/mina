'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { User, Briefcase, Flame, Mail } from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { label: 'About', href: '/about', icon: User },
  { label: 'Work', href: '/work', icon: Briefcase },
  { label: 'Roast', href: '/roast', icon: Flame },
  { label: 'Newsletter', href: '/newsletter', icon: Mail },
];

function getActiveIndex(pathname: string): number {
  return navItems.findIndex(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(pathname !== '/');
  const activeIndex = getActiveIndex(pathname);
  // Switch to 'command-nav--desktop-editorial' for the stronger tab treatment.
  const desktopVariantClass = 'command-nav--desktop-minimal';

  useEffect(() => {
    if (pathname !== '/') {
      setIsScrolled(true);
      return;
    }

    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  return (
    <>
      {/* ── Desktop + mobile top bar ── */}
      <nav
        className={`command-nav ${desktopVariantClass} ${isScrolled ? 'command-nav--scrolled' : ''}`}
        aria-label="Main navigation"
      >
        <div className="page-gutter mx-auto flex h-20 w-full max-w-7xl items-center justify-between">
          <Link
            href="/"
            aria-label="mm. Mina Mankarious — Home"
            className="command-brand brand-mark"
          >
            mm.
          </Link>

          {/* Desktop tubelight pill */}
          <div className="tubelight-pill hidden md:flex" aria-label="Site sections">
            {activeIndex >= 0 && (
              <span
                className="tubelight-indicator"
                aria-hidden="true"
                style={{
                  '--tubelight-index': activeIndex,
                  '--tubelight-count': navItems.length,
                } as React.CSSProperties}
              />
            )}
            {navItems.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                className={`tubelight-item ${i === activeIndex ? 'tubelight-item--active' : ''}`}
                aria-current={i === activeIndex ? 'page' : undefined}
              >
                <span className="tubelight-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Mobile bottom pill ── */}
      <div
        className="tubelight-mobile-dock md:hidden"
        aria-label="Site sections"
      >
        <div className="tubelight-pill tubelight-pill--mobile">
          {activeIndex >= 0 && (
            <span
              className="tubelight-indicator"
              aria-hidden="true"
              style={{
                '--tubelight-index': activeIndex,
                '--tubelight-count': navItems.length,
              } as React.CSSProperties}
            />
          )}
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`tubelight-item tubelight-item--icon ${i === activeIndex ? 'tubelight-item--active' : ''}`}
                aria-label={item.label}
                aria-current={i === activeIndex ? 'page' : undefined}
              >
                <Icon size={18} />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
