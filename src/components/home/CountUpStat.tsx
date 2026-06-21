'use client';

import { useEffect, useRef, useState } from 'react';

interface CountUpStatProps {
  value: number;
  suffix?: string;
}

/** Counts up to `value` when scrolled into view; respects reduced motion. */
export default function CountUpStat({ value, suffix = '' }: CountUpStatProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;
        observer.disconnect();

        const duration = 1500;
        let start = 0;
        const step = (t: number) => {
          if (!start) start = t;
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(eased * value));
          if (p < 1) requestAnimationFrame(step);
          else setN(value);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}
