'use client';

import { useEffect, useRef } from 'react';
import { useGSAPContext } from './GSAPProvider';

/**
 * Global micro-interactions: magnetic buttons, 3D tilt on cards.
 * Attaches event listeners via delegation to avoid per-component wiring.
 */
export default function MicroInteractions() {
  const { ready, gsap } = useGSAPContext();
  const hasInit = useRef(false);

  useEffect(() => {
    if (!ready || !gsap || hasInit.current) return;
    hasInit.current = true;

    // Skip on touch / reduced motion
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cleanups: (() => void)[] = [];

    // ── 3D Tilt on cards ──
    const tiltSelectors = '.glass-panel, .stat-card, .timeline-item-shell, .feature-card, .support-card, .about-link-card';
    const tiltElements = document.querySelectorAll<HTMLElement>(tiltSelectors);
    const maxTilt = 4;
    const perspective = 800;
    const tiltSpeed = 0.35;

    tiltElements.forEach((el) => {
      el.style.transformStyle = 'preserve-3d';

      const onEnter = () => {
        gsap.to(el, { scale: 1.015, duration: tiltSpeed, ease: 'power2.out', overwrite: 'auto' });
      };

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * maxTilt * 2;
        const rotateX = (0.5 - y) * maxTilt * 2;

        gsap.to(el, {
          rotateX,
          rotateY,
          transformPerspective: perspective,
          duration: tiltSpeed,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      const onLeave = () => {
        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.55,
          ease: 'elastic.out(1, 0.5)',
          overwrite: 'auto',
        });
      };

      el.addEventListener('mouseenter', onEnter, { passive: true });
      el.addEventListener('mousemove', onMove, { passive: true });
      el.addEventListener('mouseleave', onLeave, { passive: true });

      cleanups.push(() => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
        gsap.set(el, { clearProps: 'rotateX,rotateY,scale,transformPerspective' });
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [ready, gsap]);

  return null;
}
