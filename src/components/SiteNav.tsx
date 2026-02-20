'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';

type NavItem = {
  label: string;
  href: string;
  kind: 'route' | 'hash';
};

const navItems: NavItem[] = [
  { label: 'About', href: '/about', kind: 'route' },
  { label: 'Authority', href: '#experience', kind: 'hash' },
  { label: 'Operating Model', href: '#work-with-me', kind: 'hash' },
  { label: 'Writing', href: '#articles', kind: 'hash' },
  { label: 'Newsletter', href: '/newsletter', kind: 'route' },
  { label: 'Contact', href: '#contact', kind: 'hash' },
];

const sectionAnchors = ['#experience', '#work-with-me', '#articles', '#contact'];

type IndicatorState = {
  left: number;
  width: number;
  opacity: number;
};

export default function SiteNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(pathname !== '/');
  const [activeHash, setActiveHash] = useState('');
  const [indicatorState, setIndicatorState] = useState<IndicatorState>({ left: 0, width: 0, opacity: 0 });
  const desktopRailRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLElement | null>>({});
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first link when menu opens
    const timer = setTimeout(() => {
      const firstLink = mobileMenuRef.current?.querySelector<HTMLElement>('a, button');
      firstLink?.focus();
    }, 100);

    // Escape to close
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleEscape);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleMobileKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      if (e.key !== 'Tab' || !mobileMenuRef.current) return;
      const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    []
  );

  useEffect(() => {
    if (pathname !== '/') {
      setIsScrolled(true);
      setActiveHash('');
      return;
    }

    const updateScrolledState = () => {
      setIsScrolled(window.scrollY > 24);
    };

    const updateActiveHash = () => {
      const markerY = 170;
      const best = sectionAnchors.find((anchor) => {
        const section = document.querySelector(anchor);
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= markerY && rect.bottom > markerY;
      });

      if (best) {
        setActiveHash(best);
      } else if (window.scrollY < 120) {
        setActiveHash('');
      }
    };

    let scrollRaf = 0;
    const onScroll = () => {
      if (!scrollRaf) {
        scrollRaf = requestAnimationFrame(() => {
          scrollRaf = 0;
          updateScrolledState();
          updateActiveHash();
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateActiveHash);

    const hash = window.location.hash;
    if (sectionAnchors.includes(hash)) {
      setActiveHash(hash);
    }

    updateScrolledState();
    updateActiveHash();

    return () => {
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateActiveHash);
    };
  }, [pathname]);

  const resolvedItems = useMemo(() => {
    return navItems.map((item) => {
      if (item.kind === 'route') {
        return {
          ...item,
          resolvedHref: item.href,
          active: pathname === item.href,
        };
      }

      const resolvedHref = pathname === '/' ? item.href : `/${item.href}`;
      const active = pathname === '/' && activeHash === item.href;
      return { ...item, resolvedHref, active };
    });
  }, [pathname, activeHash]);

  const syncIndicator = useCallback(() => {
    const rail = desktopRailRef.current;
    if (!rail) return;

    const activeItem = resolvedItems.find((item) => item.active);
    if (!activeItem) {
      setIndicatorState((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    const activeNode = linkRefs.current[activeItem.label];
    if (!activeNode) return;

    const railRect = rail.getBoundingClientRect();
    const activeRect = activeNode.getBoundingClientRect();

    setIndicatorState({
      left: activeRect.left - railRect.left,
      width: activeRect.width,
      opacity: 1,
    });
  }, [resolvedItems]);

  useEffect(() => {
    syncIndicator();
    window.addEventListener('resize', syncIndicator);
    return () => window.removeEventListener('resize', syncIndicator);
  }, [syncIndicator]);

  const indicatorStyle = ({
    '--nav-indicator-left': `${indicatorState.left}px`,
    '--nav-indicator-width': `${indicatorState.width}px`,
    opacity: indicatorState.opacity,
  } as CSSProperties);

  return (
    <>
      <nav className={`command-nav ${isScrolled ? 'command-nav--scrolled' : ''}`}>
        <div className="page-gutter mx-auto flex h-20 w-full max-w-7xl items-center justify-between">
          <Link href="/" aria-label="Mina Mankarious home" className="command-brand brand-mark">
            mm.
          </Link>

          <div ref={desktopRailRef} className="command-link-rail hidden items-center gap-2 md:flex">
            <span className="command-link-indicator" aria-hidden="true" style={indicatorStyle} />
            {resolvedItems.map((item) => {
              const className = `command-link ${item.active ? 'command-link--active' : ''}`;
              return item.kind === 'route' ? (
                <Link
                  key={item.label}
                  href={item.resolvedHref}
                  className={className}
                  ref={(node) => {
                    linkRefs.current[item.label] = node;
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.resolvedHref}
                  className={className}
                  ref={(node) => {
                    linkRefs.current[item.label] = node;
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="command-menu-btn md:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      <div
        ref={mobileMenuRef}
        id="mobile-nav"
        role="dialog"
        aria-modal={isOpen ? true : undefined}
        aria-label="Navigation menu"
        onKeyDown={isOpen ? handleMobileKeyDown : undefined}
        className={`command-mobile-panel ${isOpen ? 'is-open mobile-nav-open' : ''}`}
        style={{
          paddingTop: 'max(6.2rem, env(safe-area-inset-top))',
          paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
          paddingLeft: 'max(var(--page-gutter-mobile), env(safe-area-inset-left))',
          paddingRight: 'max(var(--page-gutter-mobile), env(safe-area-inset-right))',
        }}
      >
        <div className="mx-auto flex w-full max-w-sm flex-col items-start gap-4">
          {resolvedItems.map((item) => {
            const className = `command-mobile-link ${item.active ? 'command-mobile-link--active' : ''}`;
            return item.kind === 'route' ? (
              <Link
                key={item.label}
                href={item.resolvedHref}
                onClick={() => setIsOpen(false)}
                className={className}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.resolvedHref}
                onClick={() => setIsOpen(false)}
                className={className}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}
