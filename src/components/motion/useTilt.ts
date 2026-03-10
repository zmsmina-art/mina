'use client';

import { useEffect, useRef } from 'react';
import { useGSAPContext } from './GSAPProvider';

interface TiltOptions {
  maxTilt?: number;
  perspective?: number;
  speed?: number;
  scale?: number;
}

/**
 * 3D perspective tilt on hover for cards.
 * rotateX/Y from pointer position within the element.
 */
export default function useTilt<T extends HTMLElement = HTMLElement>(
  options: TiltOptions = {},
) {
  const ref = useRef<T>(null);
  const { ready, gsap } = useGSAPContext();
  const { maxTilt = 5, perspective = 800, speed = 0.4, scale = 1.02 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready || !gsap) return;

    // Skip on touch / reduced motion
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';

    const onEnter = () => {
      gsap.to(el, { scale, duration: speed, ease: 'power2.out' });
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
        duration: speed,
        ease: 'power2.out',
      });
    };

    const onLeave = () => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    el.addEventListener('mouseenter', onEnter, { passive: true });
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave, { passive: true });

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.set(el, { clearProps: 'all' });
    };
  }, [ready, gsap, maxTilt, perspective, speed, scale]);

  return ref;
}
