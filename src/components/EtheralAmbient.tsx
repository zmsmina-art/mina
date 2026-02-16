'use client';

import { useEffect, useRef } from 'react';

export default function EtheralAmbient() {
  const layer1 = useRef<HTMLDivElement>(null);
  const layer2 = useRef<HTMLDivElement>(null);
  const layer3 = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);
  const current = useRef({ y: 0, rotation: 0 });
  const target = useRef({ y: 0, rotation: 0 });
  const idle = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;

      target.current.y = scrollY;
      target.current.rotation = progress * 12;

      // Wake up the loop if idle
      if (idle.current) {
        idle.current = false;
        raf.current = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      const lerp = 0.06;
      const c = current.current;
      const t = target.current;

      const dy = t.y - c.y;
      const dr = t.rotation - c.rotation;

      // If close enough, go idle
      if (Math.abs(dy) < 0.5 && Math.abs(dr) < 0.01) {
        c.y = t.y;
        c.rotation = t.rotation;
        idle.current = true;
        return;
      }

      c.y += dy * lerp;
      c.rotation += dr * lerp;

      const y1 = c.y * -0.04;
      const y2 = c.y * 0.06;
      const y3 = c.y * -0.025;

      const r1 = c.rotation * 0.8;
      const r2 = c.rotation * -1.2;
      const r3 = c.rotation * 0.5;

      const s1 = 1 + c.rotation * 0.004;
      const s2 = 1 + c.rotation * -0.003;
      const s3 = 1 + c.rotation * 0.002;

      if (layer1.current) {
        layer1.current.style.transform =
          `translate3d(0, ${y1}px, 0) rotate(${r1}deg) scale(${s1})`;
      }
      if (layer2.current) {
        layer2.current.style.transform =
          `translate3d(0, ${y2}px, 0) rotate(${r2}deg) scale(${s2})`;
      }
      if (layer3.current) {
        layer3.current.style.transform =
          `translate3d(0, ${y3}px, 0) rotate(${r3}deg) scale(${s3})`;
      }

      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      className="etheral-ambient"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: '-16%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Primary layer: CSS animated purple nebula */}
      <div
        ref={layer1}
        className="etheral-layer-primary"
        style={{ position: 'absolute', inset: 0, willChange: 'transform' }}
      />

      {/* Secondary layer: warm gold accents */}
      <div
        ref={layer2}
        className="etheral-layer-gold"
        style={{ position: 'absolute', inset: '-10%', willChange: 'transform' }}
      />

      {/* Tertiary layer: cream warmth */}
      <div
        ref={layer3}
        className="etheral-layer-cream"
        style={{ position: 'absolute', inset: '-5%', willChange: 'transform' }}
      />
    </div>
  );
}
