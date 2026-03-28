'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { User, Briefcase, BookOpen, Mail } from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { label: 'About', href: '/about', icon: User },
  { label: 'Work', href: '/work', icon: Briefcase },
  { label: 'Articles', href: '/articles', icon: BookOpen },
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
      {/* ── Desktop nav ── */}
      <nav
        className={`site-nav ${isScrolled ? 'site-nav--scrolled' : ''}`}
        aria-label="Main navigation"
      >
        <div className="site-nav-inner page-gutter">
          <Link href="/" aria-label="Mina Mankarious — Home" className="site-nav-brand">
            mm.
          </Link>

          <div className="site-nav-links hidden md:flex">
            {navItems.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                className={`site-nav-link ${i === activeIndex ? 'site-nav-link--active' : ''}`}
                aria-current={i === activeIndex ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Mobile bottom dock ── */}
      <div className="site-mobile-dock md:hidden" aria-label="Site sections">
        <div className="site-mobile-pill">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`site-mobile-item ${i === activeIndex ? 'site-mobile-item--active' : ''}`}
                aria-current={i === activeIndex ? 'page' : undefined}
              >
                <Icon size={20} />
                <span className="site-mobile-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
