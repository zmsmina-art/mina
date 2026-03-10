'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const syncProgress = () => {
      frameRef.current = null;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(scrollPercent, 100));
    };

    const queueSync = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(syncProgress);
    };

    queueSync();
    window.addEventListener('scroll', queueSync, { passive: true });
    window.addEventListener('resize', queueSync);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('scroll', queueSync);
      window.removeEventListener('resize', queueSync);
    };
  }, []);

  const bar = (
    <div className="reading-progress-shell">
      <div
        className="reading-progress"
        style={{ transform: `scaleX(${progress / 100})` }}
        role="progressbar"
        aria-label="Article reading progress"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );

  if (!mounted) return null;
  return createPortal(bar, document.body);
}
