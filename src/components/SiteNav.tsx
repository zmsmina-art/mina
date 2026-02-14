'use client';

import Link from 'next/link';
import { ChevronRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const { style } = document.body;
    const originalOverflow = style.overflow;
    style.overflow = 'hidden';
    return () => {
      style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050507]/85 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" aria-label="Mina Mankarious home" className="text-2xl italic font-light tracking-wide logo-glow flex-shrink-0">
            <span className="text-[#8b5cf6]">m</span><span className="text-white">m</span><span className="text-[#8b5cf6] text-sm ml-0.5">.</span>
          </Link>

          <div className="hidden md:flex gap-3 sm:gap-6 md:gap-8 text-xs sm:text-sm max-w-[72vw] overflow-x-auto scrollbar-hide whitespace-nowrap">
            {navItems.map((item) =>
              item.kind === 'route' ? (
                <Link key={item.label} href={item.href} className="text-[#8a8a9a] hover:text-white">
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.href} className="text-[#8a8a9a] hover:text-white">
                  {item.label}
                </a>
              ),
            )}
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/[0.03] text-[#c4b5fd]"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-panel"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <div
        className={`md:hidden fixed inset-0 z-[60] transition ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-[#050507]/74 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Close menu overlay"
          onClick={closeMenu}
        />

        <aside
          id="mobile-nav-panel"
          className={`absolute top-0 right-0 h-full w-[min(82vw,340px)] border-l border-white/10 bg-[#070710]/96 shadow-[-24px_0_60px_rgba(0,0,0,0.5)] transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#b9b4d7]">Navigation</p>
            <button
              type="button"
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/[0.03] text-[#c4b5fd]"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-3 py-4 space-y-1">
            {navItems.map((item) =>
              item.kind === 'route' ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-[15px] font-medium text-[#e8e4ff] hover:border-[#8b5cf6]/45 hover:bg-[#8b5cf6]/10"
                  onClick={closeMenu}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={15} className="text-[#a78bfa] transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-[15px] font-medium text-[#e8e4ff] hover:border-[#8b5cf6]/45 hover:bg-[#8b5cf6]/10"
                  onClick={closeMenu}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={15} className="text-[#a78bfa] transition-transform group-hover:translate-x-0.5" />
                </a>
              ),
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
