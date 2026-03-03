'use client';

import { useEffect, useRef, useState } from 'react';
import { useGSAPContext } from '@/components/motion/GSAPProvider';

export default function EtheralAmbient() {
  const [enabled, setEnabled] = useState(false);
  const wrap1 = useRef<HTMLDivElement>(null);
  const wrap2 = useRef<HTMLDivElement>(null);
  const wrap3 = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);
  const current = useRef({ y: 0, rotation: 0 });
  const target = useRef({ y: 0, rotation: 0 });
  const idle = useRef(false);
  const { ready, gsap, ScrollTrigger } = useGSAPContext();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    if (prefersReducedMotion || hasCoarsePointer) return;
    setEnabled(true);
  }, []);

  // GSAP scroll-linked layer morphs
  useEffect(() => {
    if (!enabled || !ready || !gsap || !ScrollTrigger) return;
    if (!wrap1.current || !wrap2.current || !wrap3.current) return;

    const ctx = gsap.context(() => {
      // Layer 1: scroll-linked position + opacity morph
      gsap.to(wrap1.current, {
        y: '-8%',
        opacity: 0.7,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      // Layer 2: counter-direction movement
      gsap.to(wrap2.current, {
        y: '12%',
        opacity: 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      });

      // Layer 3: subtle shift
      gsap.to(wrap3.current, {
        y: '-5%',
        opacity: 0.6,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2,
        },
      });
    });

    return () => ctx.revert();
  }, [enabled, ready, gsap, ScrollTrigger]);

  // Keep the manual scroll parallax as additional layer
  useEffect(() => {
    if (!enabled) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;

      target.current.y = scrollY;
      target.current.rotation = progress * 12;

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

      if (wrap1.current) {
        wrap1.current.style.transform =
          `translate3d(0, ${y1}px, 0) rotate(${r1}deg) scale(${s1})`;
      }
      if (wrap2.current) {
        wrap2.current.style.transform =
          `translate3d(0, ${y2}px, 0) rotate(${r2}deg) scale(${s2})`;
      }
      if (wrap3.current) {
        wrap3.current.style.transform =
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
  }, [enabled]);

  // Smooth section theme transitions for ambient tokens
  useEffect(() => {
    if (!enabled || !ready || !gsap) return;

    const html = document.documentElement;
    let prevTheme = html.getAttribute('data-section-theme') || '';

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-section-theme') {
          const newTheme = html.getAttribute('data-section-theme') || '';
          if (newTheme !== prevTheme) {
            prevTheme = newTheme;
            // Smooth tween the layer opacities during theme transition
            const layers = [wrap1.current, wrap2.current, wrap3.current].filter(Boolean) as HTMLElement[];
            layers.forEach((layer, i) => {
              gsap.to(layer, {
                opacity: 0.85 - i * 0.1,
                duration: 0.8,
                ease: 'power2.inOut',
                yoyo: true,
                repeat: 1,
              });
            });
          }
        }
      }
    });

    observer.observe(html, { attributes: true, attributeFilter: ['data-section-theme'] });

    return () => observer.disconnect();
  }, [enabled, ready, gsap]);

  if (!enabled) return null;

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
      <div ref={wrap1} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
        <div className="etheral-layer-primary" style={{ position: 'absolute', inset: 0 }} />
      </div>

      <div ref={wrap2} style={{ position: 'absolute', inset: '-10%', willChange: 'transform' }}>
        <div className="etheral-layer-gold" style={{ position: 'absolute', inset: 0 }} />
      </div>

      <div ref={wrap3} style={{ position: 'absolute', inset: '-5%', willChange: 'transform' }}>
        <div className="etheral-layer-cream" style={{ position: 'absolute', inset: 0 }} />
      </div>
    </div>
  );
}
