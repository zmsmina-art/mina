'use client';

import type { CSSProperties } from 'react';
import { useEffect } from 'react';

const BAR_PATTERN = Array.from({ length: 78 }, (_, index) => {
  const waveA = (Math.sin(index * 0.46) + 1) * 0.5;
  const waveB = (Math.sin(index * 0.19 + 1.8) + 1) * 0.5;
  const waveC = (Math.sin(index * 0.93 + 0.7) + 1) * 0.5;
  return 40 + waveA * 110 + waveB * 58 + waveC * 34;
});

export default function FuturisticScrollBackdrop() {
  useEffect(() => {
    const root = document.documentElement;
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let loop = 0;
    let lastY = window.scrollY || 0;
    let lastTick = performance.now();
    let momentum = 0;

    const update = (now = performance.now()) => {
      const y = window.scrollY || 0;
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = clamp(y / max, 0, 1);
      const deltaY = Math.abs(y - lastY);
      const deltaT = Math.max(now - lastTick, 16);
      const velocity = Math.min(deltaY / deltaT, 2.4);
      momentum = momentum * 0.82 + velocity * 0.18;

      const wave = Math.sin(now * 0.0012 + progress * 4.6);
      const energyWave = 0.14 + (wave + 1) * 0.07;
      const energy = clamp(energyWave + momentum * 0.16, 0.1, 0.5);
      const hueShift = Math.sin(now * 0.00035 + progress * Math.PI * 0.9) * 3.2;
      const driftX = Math.sin(now * 0.0009 + progress * Math.PI * 2.1) * 12 + momentum * 11;
      const driftY = Math.sin(now * 0.0014 + progress * Math.PI * 1.6) * 6 + momentum * 4;
      const bandShiftY = (progress - 0.5) * 52 + wave * 4;
      const tilt = (progress - 0.5) * 1.4;
      const bandSpread = clamp(0.86 + energy * 0.15 + momentum * 0.06, 0.82, 1.08);
      const sheenPos = (12 + ((now * 0.006 + progress * 34) % 76));
      const shiftA = (now * 0.02) % 420;
      const shiftB = (now * 0.011) % 520;
      const top = clamp(1 - progress * 1.8, 0, 1);
      const mid = clamp(1 - Math.abs(progress - 0.5) * 2.2, 0, 1);
      const bottom = clamp((progress - 0.28) * 1.6, 0, 1);

      root.style.setProperty('--aurora-energy', String(energy));
      root.style.setProperty('--aurora-hue', String(hueShift));
      root.style.setProperty('--aurora-drift-x', String(driftX));
      root.style.setProperty('--aurora-drift-y', String(driftY));
      root.style.setProperty('--aurora-band-shift-y', String(bandShiftY));
      root.style.setProperty('--aurora-band-spread', String(bandSpread));
      root.style.setProperty('--aurora-sheen-pos', String(sheenPos));
      root.style.setProperty('--aurora-shift-a', `${shiftA}px`);
      root.style.setProperty('--aurora-shift-b', `${shiftB}px`);
      root.style.setProperty('--aurora-tilt', String(tilt));
      root.style.setProperty('--aurora-zone-top', String(top));
      root.style.setProperty('--aurora-zone-mid', String(mid));
      root.style.setProperty('--aurora-zone-bottom', String(bottom));
      root.style.setProperty('--page-scroll', String(y));
      root.style.setProperty('--page-scroll-progress', String(progress));
      root.style.setProperty('--page-momentum', String(clamp(momentum, 0, 1)));

      lastY = y;
      lastTick = now;
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame((time) => {
          update(time);
          frame = 0;
        });
      }
    };

    const tick = (time: number) => {
      update(time);
      loop = window.requestAnimationFrame(tick);
    };

    update(performance.now());
    if (!reducedMotion.matches) {
      loop = window.requestAnimationFrame(tick);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (loop) window.cancelAnimationFrame(loop);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="fx-backdrop fx-aurora-backdrop" aria-hidden="true">
      <div className="fx-aurora-core">
        <span className="fx-aurora-base" />
        <span className="fx-aurora-fog fx-aurora-fog--north" />
        <span className="fx-aurora-fog fx-aurora-fog--south" />
        <span className="fx-aurora-bars">
          {BAR_PATTERN.map((height, index) => {
            const style = {
              '--bar-x': `${(index / (BAR_PATTERN.length - 1)) * 100}%`,
              '--bar-h': height.toFixed(2),
              '--bar-delay': `${((index % 13) * -0.24).toFixed(2)}s`,
            } as CSSProperties;

            return <span key={index} className="fx-aurora-bar" style={style} />;
          })}
        </span>
        <span className="fx-aurora-sheen" />
      </div>
      <span className="fx-aurora-vignette" />
    </div>
  );
}
