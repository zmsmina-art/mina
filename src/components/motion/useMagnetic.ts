'use client';

import { useEffect, useRef } from 'react';
import { useGSAPContext } from './GSAPProvider';

interface MagneticOptions {
  strength?: number;
  radius?: number;
  ease?: number;
}

/**
 * Magnetic pull effect for buttons/links.
 * On pointer approach within radius: element translates toward cursor.
 * Spring back on leave.
 */
export default function useMagnetic<T extends HTMLElement = HTMLElement>(
  options: MagneticOptions = {},
) {
  const ref = useRef<T>(null);
  const { ready, gsap } = useGSAPContext();
  const { strength = 0.35, radius = 80, ease = 0.2 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready || !gsap) return;

    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let rafId = 0;
    let active = false;

    const tick = () => {
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      if (Math.abs(targetX - currentX) < 0.1 && Math.abs(targetY - currentY) < 0.1) {
        currentX = targetX;
        currentY = targetY;
        el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        if (!active) return;
      } else {
        el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (dist < radius) {
        active = true;
        targetX = distX * strength;
        targetY = distY * strength;
        if (!rafId) rafId = requestAnimationFrame(tick);
      } else if (active) {
        active = false;
        targetX = 0;
        targetY = 0;
        if (!rafId) rafId = requestAnimationFrame(tick);
      }
    };

    const onLeave = () => {
      active = false;
      targetX = 0;
      targetY = 0;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
      el.style.transform = '';
    };
  }, [ready, gsap, strength, radius, ease]);

  return ref;
}
