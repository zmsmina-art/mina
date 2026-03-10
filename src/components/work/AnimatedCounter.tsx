'use client';

import { useEffect, useRef, useState } from 'react';
import useMotionProfile from '@/components/motion/useMotionProfile';

interface AnimatedCounterProps {
  value: number;
  display: string;
  label: string;
}

function formatIntermediate(current: number, display: string): string {
  if (display.endsWith('M+')) {
    return current.toFixed(1) + 'M+';
  }
  if (display.endsWith('x')) {
    return current % 1 === 0 ? current.toFixed(0) + 'x' : current.toFixed(1) + 'x';
  }
  if (display.endsWith('%')) {
    return Math.round(current) + '%';
  }
  return Math.round(current).toString();
}

export default function AnimatedCounter({ value, display, label }: AnimatedCounterProps) {
  const motionProfile = useMotionProfile();
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [displayValue, setDisplayValue] = useState(motionProfile.reduced ? display : formatIntermediate(0, display));

  useEffect(() => {
    if (motionProfile.reduced) {
      setDisplayValue(display);
      return;
    }

    const el = containerRef.current;
    if (!el || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();

        const duration = 1600;
        let start: number | null = null;

        const step = (timestamp: number) => {
          if (start === null) start = timestamp;
          const elapsed = timestamp - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * value;

          setDisplayValue(formatIntermediate(current, display));

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            setDisplayValue(display);
          }
        };

        requestAnimationFrame(step);
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, display, motionProfile.reduced]);

  return (
    <div ref={containerRef} className="stat-card text-center">
      <p className="stat-value">{displayValue}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}
