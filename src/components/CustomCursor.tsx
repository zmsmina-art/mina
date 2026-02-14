'use client';

import { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, summary';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!media.matches || reduceMotion.matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let raf = 0;

    const move = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const tick = () => {
      ringX += (x - ringX) * 0.18;
      ringY += (y - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = window.requestAnimationFrame(tick);
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = !!target?.closest(INTERACTIVE_SELECTOR);
      ring.classList.toggle('cursor-ring--active', interactive);
    };

    const onDown = () => ring.classList.add('cursor-ring--pressed');
    const onUp = () => ring.classList.remove('cursor-ring--pressed');

    document.documentElement.classList.add('custom-cursor-enabled');
    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    raf = window.requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove('custom-cursor-enabled');
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
