'use client';

import { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, summary';
const CARD_SELECTOR = '.glass-panel, .stat-card, .timeline-item-shell, .feature-card, .support-card, .contact-panel, .about-link-card';

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

    // Trail dots
    const trailCount = 3;
    const trails: HTMLDivElement[] = [];
    const trailPositions: { x: number; y: number }[] = [];
    for (let i = 0; i < trailCount; i++) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.setAttribute('aria-hidden', 'true');
      trail.style.cssText = `
        position: fixed; top: 0; left: 0; z-index: 9998;
        width: ${5 - i}px; height: ${5 - i}px;
        border-radius: 50%;
        background: rgba(255,255,255,${0.15 - i * 0.04});
        pointer-events: none;
        transform: translate3d(${x}px, ${y}px, 0);
        will-change: transform;
      `;
      document.body.appendChild(trail);
      trails.push(trail);
      trailPositions.push({ x, y });
    }

    const move = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const tick = () => {
      ringX += (x - ringX) * 0.18;
      ringY += (y - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      // Trail positions with increasing lag
      for (let i = 0; i < trailCount; i++) {
        const prev = i === 0 ? { x: ringX, y: ringY } : trailPositions[i - 1];
        const lag = 0.12 - i * 0.02;
        trailPositions[i].x += (prev.x - trailPositions[i].x) * lag;
        trailPositions[i].y += (prev.y - trailPositions[i].y) * lag;
        trails[i].style.transform = `translate3d(${trailPositions[i].x}px, ${trailPositions[i].y}px, 0)`;
      }

      raf = window.requestAnimationFrame(tick);
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = !!target?.closest(INTERACTIVE_SELECTOR);
      const isCard = !!target?.closest(CARD_SELECTOR);
      const isButton = !!target?.closest('button, .accent-btn, .ghost-btn, [role="button"]');
      const isLink = !!target?.closest('a') && !isButton && !isCard;

      // Reset classes
      ring.classList.remove('cursor-ring--active', 'cursor-ring--pressed', 'cursor-ring--card', 'cursor-ring--link', 'cursor-ring--button');

      if (isButton) {
        ring.classList.add('cursor-ring--button');
      } else if (isCard) {
        ring.classList.add('cursor-ring--card');
      } else if (isLink) {
        ring.classList.add('cursor-ring--link');
      } else if (interactive) {
        ring.classList.add('cursor-ring--active');
      }
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
      trails.forEach((t) => t.remove());
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
