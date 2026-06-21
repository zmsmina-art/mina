'use client';

import { useEffect, useState } from 'react';

const items = [
  { id: 'hero', label: 'Home' },
  { id: 'experience', label: 'Experience' },
  { id: 'articles', label: 'Writing' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'work-with-me', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

/** Fixed right-edge section index with scroll-spy (desktop only). */
export default function SectionRail() {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const sections = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // a section is "active" when it crosses the vertical middle of the viewport
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="section-rail" aria-label="Section navigation">
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              onClick={(e) => go(e, it.id)}
              className={`rail-item ${active === it.id ? 'is-active' : ''}`}
              aria-current={active === it.id ? 'true' : undefined}
            >
              <span className="rail-label">{it.label}</span>
              <span className="rail-tick" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
