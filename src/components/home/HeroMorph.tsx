'use client';

import { useEffect } from 'react';

/**
 * Scroll-scrubbed hero signature: as the hero scrolls away, the giant "mm."
 * shrinks and rises, handing off to the nav brand mark. Transforms an inner
 * wrapper (no CSS transition) so it tracks scroll 1:1.
 */
export default function HeroMorph() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const mark = document.querySelector<HTMLElement>('.hero-mark-inner');
    const hero = document.getElementById('hero');
    if (!mark || !hero) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const span = hero.offsetHeight * 0.72;
        const p = Math.min(1, Math.max(0, window.scrollY / span));
        const scale = 1 - 0.5 * p;
        const ty = -130 * p;
        mark.style.transform = `translateY(${ty}px) scale(${scale})`;
        mark.style.opacity = String(Math.max(0, 1 - p * 1.15));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
