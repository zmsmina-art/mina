'use client';

import { useEffect } from 'react';

export default function FuturisticScrollBackdrop() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let loop = 0;
    let lastY = window.scrollY || 0;
    let lastTick = performance.now();
    let momentum = 0;

    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

    const update = (now = performance.now()) => {
      const y = window.scrollY || 0;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = clamp(y / maxScroll, 0, 1);

      const deltaY = Math.abs(y - lastY);
      const deltaT = Math.max(now - lastTick, 16);
      const velocity = Math.min(deltaY / deltaT, 2);
      momentum = momentum * 0.88 + velocity * 0.12;

      // Slow breathing cycle
      const breath = Math.sin(now * 0.0006) * 0.5 + 0.5;

      // Orb positions drift gently with scroll + time
      const orbAx = 30 + Math.sin(now * 0.00025 + progress * Math.PI) * 12;
      const orbAy = 18 + progress * 28 + Math.sin(now * 0.0004) * 6;
      const orbBx = 68 + Math.sin(now * 0.0003 + progress * Math.PI * 1.4) * 10;
      const orbBy = 35 + progress * 20 + Math.cos(now * 0.00035) * 5;
      const orbCx = 50 + Math.sin(now * 0.00018 + progress * Math.PI * 0.7) * 14;
      const orbCy = 60 + progress * 15 + Math.sin(now * 0.00045 + 1.2) * 4;

      // Subtle opacity pulse tied to breathing + momentum
      const glow = clamp(0.035 + breath * 0.025 + momentum * 0.06, 0.03, 0.12);

      root.style.setProperty('--glow-ax', `${orbAx}%`);
      root.style.setProperty('--glow-ay', `${orbAy}%`);
      root.style.setProperty('--glow-bx', `${orbBx}%`);
      root.style.setProperty('--glow-by', `${orbBy}%`);
      root.style.setProperty('--glow-cx', `${orbCx}%`);
      root.style.setProperty('--glow-cy', `${orbCy}%`);
      root.style.setProperty('--glow-opacity', String(glow));
      root.style.setProperty('--glow-breath', String(breath));
      root.style.setProperty('--glow-momentum', String(clamp(momentum, 0, 1)));

      lastY = y;
      lastTick = now;
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame((t) => {
          update(t);
          frame = 0;
        });
      }
    };

    const tick = (time: number) => {
      update(time);
      loop = requestAnimationFrame(tick);
    };

    update(performance.now());
    if (!reducedMotion.matches) {
      loop = requestAnimationFrame(tick);
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (loop) cancelAnimationFrame(loop);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="ambient-backdrop" aria-hidden="true">
      <div className="ambient-orb ambient-orb--a" />
      <div className="ambient-orb ambient-orb--b" />
      <div className="ambient-orb ambient-orb--c" />
    </div>
  );
}
