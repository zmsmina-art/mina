'use client';

import { useEffect, useRef } from 'react';
import { EtheralShadow } from '@/components/ui/etheral-shadow';

export default function EtheralAmbient() {
  const layer1 = useRef<HTMLDivElement>(null);
  const layer2 = useRef<HTMLDivElement>(null);
  const layer3 = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);
  const current = useRef({ y: 0, rotation: 0 });
  const target = useRef({ y: 0, rotation: 0 });

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;

      target.current.y = scrollY;
      target.current.rotation = progress * 12;
    };

    const tick = () => {
      const lerp = 0.06;
      const c = current.current;
      const t = target.current;

      c.y += (t.y - c.y) * lerp;
      c.rotation += (t.rotation - c.rotation) * lerp;

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
      {/* Primary layer: the one real turbulence — deep purple */}
      <div ref={layer1} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
        <EtheralShadow
          color="rgba(111, 74, 199, 0.52)"
          animation={{ scale: 64, speed: 28 }}
          noise={{ opacity: 0.3, scale: 1.4 }}
          sizing="fill"
          style={{
            position: 'absolute',
            inset: 0,
          }}
        />
      </div>

      {/* Secondary layer: CSS radial gradient — warm gold */}
      <div
        ref={layer2}
        style={{
          position: 'absolute',
          inset: '-10%',
          willChange: 'transform',
          mixBlendMode: 'screen',
          opacity: 0.55,
          background:
            'radial-gradient(ellipse 70% 60% at 25% 35%, rgba(212, 175, 55, 0.28), transparent 70%), ' +
            'radial-gradient(ellipse 60% 50% at 80% 70%, rgba(214, 163, 63, 0.22), transparent 65%)',
        }}
      />

      {/* Tertiary layer: CSS radial gradient — cream warmth */}
      <div
        ref={layer3}
        style={{
          position: 'absolute',
          inset: '-5%',
          willChange: 'transform',
          mixBlendMode: 'soft-light',
          opacity: 0.45,
          background:
            'radial-gradient(ellipse 80% 70% at 50% 20%, rgba(246, 240, 228, 0.18), transparent 72%), ' +
            'radial-gradient(ellipse 50% 50% at 15% 80%, rgba(155, 126, 230, 0.14), transparent 60%), ' +
            'radial-gradient(ellipse 50% 50% at 85% 60%, rgba(246, 240, 228, 0.1), transparent 55%)',
        }}
      />
    </div>
  );
}
