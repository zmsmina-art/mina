'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { TocHeading } from '@/lib/article-headings';

export default function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-96px 0px -70% 0px' }
    );

    for (const el of elements) {
      observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: 'smooth' });
    setActiveId(id);
    setMobileOpen(false);
  };

  if (headings.length === 0) return null;

  const linkList = (
    <nav aria-label="Table of contents">
      <ul className="space-y-0.5">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => handleClick(e, h.id)}
              className={`toc-link${activeId === h.id ? ' toc-link--active' : ''}${h.level === 3 ? ' toc-link--h3' : ''}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <div className="hidden xl:block">
        <div className="sticky top-28">
          <p className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[var(--text-dim)]">
            On this page
          </p>
          {linkList}
        </div>
      </div>

      {/* Mobile: collapsible accordion */}
      <div className="xl:hidden">
        <div className="rounded-xl border border-[var(--stroke-soft)] bg-[var(--bg-elev-1)]/60 backdrop-blur-md">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm text-[var(--text-muted)]"
            aria-expanded={mobileOpen}
          >
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[var(--text-dim)]">
              On this page
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {mobileOpen && <div className="px-4 pb-4">{linkList}</div>}
        </div>
      </div>
    </>
  );
}
