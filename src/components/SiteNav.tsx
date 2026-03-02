'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { User, Briefcase, BarChart3, Mail } from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { label: 'About', href: '/about', icon: User },
  { label: 'Work', href: '/work', icon: Briefcase },
  { label: 'Grader', href: '/positioning-grader', icon: BarChart3 },
  { label: 'Newsletter', href: '/newsletter', icon: Mail },
];

const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

export default function SiteNav() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(pathname !== '/');

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(href + '/'),
    [pathname]
  );

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
        className={`command-nav ${isScrolled ? 'command-nav--scrolled' : ''}`}
        aria-label="Main navigation"
      >
        <div className="page-gutter mx-auto flex h-20 w-full max-w-7xl items-center justify-between">
          {/* Brand mark */}
          <Link
            prefetch={false}
            href="/"
            aria-label="mm. Mina Mankarious — Home"
            className="command-brand brand-mark"
          >
            mm.
          </Link>

          {/* Desktop tubelight pill */}
          <div className="tubelight-pill hidden md:flex" role="navigation" aria-label="Site sections">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  prefetch={false}
                  href={item.href}
                  className={`tubelight-item ${active ? 'tubelight-item--active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="tubelight-label">{item.label}</span>
                  {active && (
                    <>
                      <motion.div
                        className="tubelight-glow-bar"
                        layoutId="tubelight-bar"
                        transition={springTransition}
                      />
                      <motion.div
                        className="tubelight-glow-spread"
                        layoutId="tubelight-spread"
                        transition={springTransition}
                      />
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── Mobile bottom pill ── */}
      <div
        className="tubelight-mobile-dock md:hidden"
        role="navigation"
        aria-label="Site sections"
      >
        <div className="tubelight-pill tubelight-pill--mobile">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                prefetch={false}
                href={item.href}
                className={`tubelight-item tubelight-item--icon ${active ? 'tubelight-item--active' : ''}`}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={18} />
                {active && (
                  <>
                    <motion.div
                      className="tubelight-glow-bar"
                      layoutId="tubelight-bar-mobile"
                      transition={springTransition}
                    />
                    <motion.div
                      className="tubelight-glow-spread"
                      layoutId="tubelight-spread-mobile"
                      transition={springTransition}
                    />
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
