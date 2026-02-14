'use client';

import { useEffect } from 'react';

export default function FuturisticScrollBackdrop() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    let frame = 0;
    let loop = 0;
    let lastY = window.scrollY || 0;
    let lastTick = performance.now();
    let momentum = 0;
    let pointerX = 0.5;
    let pointerY = 0.45;
    let targetX = pointerX;
    let targetY = pointerY;

    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

    const update = (now = performance.now()) => {
      const y = window.scrollY || 0;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = clamp(y / maxScroll, 0, 1);

      const deltaY = Math.abs(y - lastY);
      const deltaT = Math.max(now - lastTick, 16);
      const velocity = Math.min(deltaY / deltaT, 2);
      momentum = momentum * 0.88 + velocity * 0.12;
      pointerX += (targetX - pointerX) * 0.07;
      pointerY += (targetY - pointerY) * 0.07;

      const breath = Math.sin(now * 0.0006) * 0.5 + 0.5;
      const drift = now * 0.0002;
      const energy = clamp(0.24 + breath * 0.2 + momentum * 0.32, 0.18, 0.9);

      const auroraAX = 22 + Math.sin(drift * 1.2 + progress * Math.PI * 1.1) * 18 + (pointerX - 0.5) * 18;
      const auroraAY = 20 + progress * 14 + Math.cos(drift * 1.7) * 8 + (pointerY - 0.5) * 12;
      const auroraBX = 76 + Math.sin(drift * 1.1 + progress * Math.PI * 0.85) * 16 + (pointerX - 0.5) * -14;
      const auroraBY = 34 + progress * 22 + Math.sin(drift * 1.4 + 0.5) * 7 + (pointerY - 0.5) * 10;
      const auroraCX = 50 + Math.sin(drift * 1.5 + progress * Math.PI * 1.45) * 24 + (pointerX - 0.5) * 8;
      const auroraCY = 68 + progress * 10 + Math.cos(drift * 1.2 + 1.2) * 8 + (pointerY - 0.5) * -8;

      const gridOffset = (progress * 180 + now * 0.02) % 360;
      const gridWarp = clamp((pointerX - 0.5) * 26, -16, 16);
      const scanX = (progress * 120 + now * 0.015) % 120;

      root.style.setProperty('--aurora-a-x', `${auroraAX}%`);
      root.style.setProperty('--aurora-a-y', `${auroraAY}%`);
      root.style.setProperty('--aurora-b-x', `${auroraBX}%`);
      root.style.setProperty('--aurora-b-y', `${auroraBY}%`);
      root.style.setProperty('--aurora-c-x', `${auroraCX}%`);
      root.style.setProperty('--aurora-c-y', `${auroraCY}%`);
      root.style.setProperty('--aurora-energy', String(energy));
      root.style.setProperty('--grid-offset', `${gridOffset}px`);
      root.style.setProperty('--grid-warp', `${gridWarp}px`);
      root.style.setProperty('--scan-x', `${scanX}%`);

      lastY = y;
      lastTick = now;
      frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = clamp(event.clientX / Math.max(window.innerWidth, 1), 0, 1);
      targetY = clamp(event.clientY / Math.max(window.innerHeight, 1), 0, 1);
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
      if (coarsePointer.matches && time - lastTick < 42) {
        loop = requestAnimationFrame(tick);
        return;
      }
      update(time);
      loop = requestAnimationFrame(tick);
    };

    update(performance.now());
    if (!reducedMotion.matches) {
      loop = requestAnimationFrame(tick);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    if (!coarsePointer.matches) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (loop) cancelAnimationFrame(loop);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <div className="ambient-backdrop" aria-hidden="true">
      <div className="ambient-base" />
      <div className="aurora-layer aurora-layer--a" />
      <div className="aurora-layer aurora-layer--b" />
      <div className="aurora-layer aurora-layer--c" />
      <div className="neural-grid" />
      <div className="neural-grid neural-grid--subtle" />
      <div className="neural-nodes" />
      <div className="scan-beam" />
      <div className="vignette-overlay" />
    </div>
  );
}
