'use client';

import { useEffect, useRef } from 'react';
import { useGSAPContext } from './GSAPProvider';

interface ParallaxOptions {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
}

/**
 * ScrollTrigger-based parallax for any element.
 * speed > 0 = element moves slower (lags behind scroll).
 * speed < 0 = element moves faster.
 */
export default function useParallax<T extends HTMLElement = HTMLElement>(
  options: ParallaxOptions = {},
) {
  const ref = useRef<T>(null);
  const { ready, gsap, ScrollTrigger } = useGSAPContext();
  const { speed = 0.2, direction = 'vertical' } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready || !gsap || !ScrollTrigger) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const prop = direction === 'vertical' ? 'y' : 'x';
    const distance = speed * 100;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        [prop]: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [ready, gsap, ScrollTrigger, speed, direction]);

  return ref;
}
