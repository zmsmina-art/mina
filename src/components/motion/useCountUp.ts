'use client';

import { useEffect, useRef, useState } from 'react';
import { useGSAPContext } from './GSAPProvider';

interface CountUpOptions {
  end: number;
  start?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

/**
 * Animated number counter triggered by scroll.
 */
export default function useCountUp(options: CountUpOptions) {
  const { end, start = 0, duration = 1.5, suffix = '', prefix = '', decimals = 0 } = options;
  const ref = useRef<HTMLElement>(null);
  const [value, setValue] = useState(`${prefix}${start}${suffix}`);
  const { ready, gsap, ScrollTrigger } = useGSAPContext();

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready || !gsap || !ScrollTrigger) return;

    const obj = { val: start };

    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: end,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
        onUpdate: () => {
          setValue(`${prefix}${obj.val.toFixed(decimals)}${suffix}`);
        },
      });
    }, el);

    return () => ctx.revert();
  }, [ready, gsap, ScrollTrigger, end, start, duration, suffix, prefix, decimals]);

  return { ref, value };
}
