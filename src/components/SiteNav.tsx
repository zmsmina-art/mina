'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type NavItem = {
  label: string;
  href: string;
  kind: 'route' | 'hash';
};

const navItems: NavItem[] = [
  { label: 'About', href: '/about', kind: 'route' },
  { label: 'Experience', href: '#experience', kind: 'hash' },
  { label: 'Work With Me', href: '#work-with-me', kind: 'hash' },
  { label: 'Articles', href: '/articles', kind: 'route' },
  { label: 'Contact', href: '#contact', kind: 'hash' },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(pathname !== '/');

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (pathname !== '/') {
      setIsScrolled(true);
      return;
    }

    let observer: IntersectionObserver | null = null;

    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    const mountHeroObserver = () => {
      const hero = document.getElementById('hero');
      if (!hero) return;

      observer?.disconnect();
      observer = new IntersectionObserver(
        ([entry]) => {
          setIsScrolled(!entry.isIntersecting);
        },
        { threshold: 0.08 },
      );
      observer.observe(hero);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    mountHeroObserver();
    const delayedMount = window.setTimeout(mountHeroObserver, 180);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(delayedMount);
      observer?.disconnect();
    };
  }, [pathname]);

  const resolvedItems = useMemo(() => {
    return navItems.map((item) => {
      if (item.kind === 'route') {
        return { ...item, resolvedHref: item.href, active: pathname === item.href };
      }

      const resolvedHref = pathname === '/' ? item.href : `/${item.href}`;
      return { ...item, resolvedHref, active: false };
    });
  }, [pathname]);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-[90] transition-all duration-500 ${
          isScrolled ? 'border-b border-[#292524]/70 bg-[#141311]/85 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="page-gutter mx-auto flex h-20 w-full max-w-7xl items-center justify-between">
          <Link href="/" aria-label="Mina Mankarious home" className="text-[0.68rem] font-medium uppercase tracking-[0.19em] text-[#f5f0e8] transition-colors hover:text-[#e8c97a] sm:text-sm">
            Mina Mankarious
          </Link>

          <div className="hidden items-center gap-8 lg:gap-10 md:flex">
            {resolvedItems.map((item) => (
              item.kind === 'route' ? (
                <Link
                  key={item.label}
                  href={item.resolvedHref}
                  className={`link-underline text-sm font-light tracking-wide transition-colors ${
                    item.active ? 'text-[#d4a853]' : 'text-[#c8c2b6] hover:text-[#f5f0e8]'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.resolvedHref}
                  className="link-underline text-sm font-light tracking-wide text-[#c8c2b6] transition-colors hover:text-[#f5f0e8]"
                >
                  {item.label}
                </a>
              )
            ))}
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#2d2923] bg-[#141311]/70 text-[#f5f0e8] transition-colors hover:text-[#e8c97a] md:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        className={`fixed inset-0 z-[85] flex bg-[#0d0c0b]/95 backdrop-blur-xl transition-opacity duration-500 md:hidden ${
          isOpen ? 'pointer-events-auto opacity-100 mobile-nav-open' : 'pointer-events-none opacity-0'
        }`}
        style={{
          paddingTop: 'max(6rem, env(safe-area-inset-top))',
          paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))',
          paddingLeft: 'max(var(--page-gutter-mobile), env(safe-area-inset-left))',
          paddingRight: 'max(var(--page-gutter-mobile), env(safe-area-inset-right))',
        }}
      >
        <div className="mx-auto flex w-full max-w-sm flex-col items-start gap-5">
          {resolvedItems.map((item) => (
            item.kind === 'route' ? (
              <Link
                key={item.label}
                href={item.resolvedHref}
                onClick={() => setIsOpen(false)}
                className="mobile-nav-link w-full border-b border-[#292524]/70 pb-3 text-3xl leading-tight text-[#f5f0e8] transition-colors hover:text-[#d4a853] sm:text-4xl"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.resolvedHref}
                onClick={() => setIsOpen(false)}
                className="mobile-nav-link w-full border-b border-[#292524]/70 pb-3 text-3xl leading-tight text-[#f5f0e8] transition-colors hover:text-[#d4a853] sm:text-4xl"
              >
                {item.label}
              </a>
            )
          ))}
        </div>
      </div>
    </>
  );
}
