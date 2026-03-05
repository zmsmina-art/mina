'use client';

import { useEffect, useRef, useState } from 'react';
import { useGSAPContext } from '@/components/motion/GSAPProvider';

export default function EtheralAmbient() {
  const [enabled, setEnabled] = useState(false);
  const wrap1 = useRef<HTMLDivElement>(null);
  const wrap2 = useRef<HTMLDivElement>(null);
  const wrap3 = useRef<HTMLDivElement>(null);
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
          scrub: 0.6,
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
          scrub: 0.8,
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
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, [enabled, ready, gsap, ScrollTrigger]);

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
