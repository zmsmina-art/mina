'use client';

import { useRef, useEffect } from 'react';
import { useGSAPContext } from './GSAPProvider';

interface SplitHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
  mode?: 'chars' | 'words';
  className?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
  y?: number;
  rotateX?: number;
  ease?: string;
  once?: boolean;
  scrollTrigger?: boolean;
}

/**
 * Reusable component: heading with char/word split + GSAP stagger reveal.
 */
export default function SplitHeading({
  text,
  as: Tag = 'h2',
  mode = 'chars',
  className,
  stagger = 0.035,
  duration = 1.2,
  delay = 0,
  y = 40,
  rotateX = 0,
  ease = 'power4.out',
  once = true,
  scrollTrigger = false,
}: SplitHeadingProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { ready, gsap, ScrollTrigger } = useGSAPContext();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !ready || !gsap || !ScrollTrigger) return;

    // Split text into spans
    const originalText = text;
    el.setAttribute('aria-label', originalText);

    let units: string[];
    if (mode === 'chars') {
      units = originalText.split('');
    } else {
      units = originalText.split(/(\s+)/);
    }

    el.innerHTML = '';
    const spans: HTMLSpanElement[] = [];

    units.forEach((unit) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.setAttribute('aria-hidden', 'true');

      if (unit === ' ' || /^\s+$/.test(unit)) {
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = unit;
        spans.push(span);
      }

      el.appendChild(span);
    });

    const ctx = gsap.context(() => {
      const fromVars: gsap.TweenVars = {
        opacity: 0,
        y,
        ...(rotateX ? { rotateX, transformPerspective: 800 } : {}),
      };

      const toVars: gsap.TweenVars = {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration,
        stagger,
        ease,
        delay,
      };

      if (scrollTrigger) {
        toVars.scrollTrigger = {
          trigger: el,
          start: 'top 88%',
          once,
        };
      }

      gsap.fromTo(spans, fromVars, toVars);
    }, el);

    return () => ctx.revert();
  }, [ready, gsap, ScrollTrigger, text, mode, stagger, duration, delay, y, rotateX, ease, once, scrollTrigger]);

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLHeadingElement>}
      className={className}
    >
      {text}
    </Tag>
  );
}
