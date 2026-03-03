'use client';

import { useEffect, useRef } from 'react';
import { useGSAPContext } from '@/components/motion/GSAPProvider';

/**
 * Client-only component that creates the cinematic hero entrance timeline.
 * Mounts invisibly and orchestrates all hero elements via GSAP selectors.
 */
export default function HeroTimeline() {
  const { ready, gsap, ScrollTrigger } = useGSAPContext();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!ready || !gsap || !ScrollTrigger || hasRun.current) return;
    hasRun.current = true;

    const hero = document.querySelector('.section-hero');
    if (!hero) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const durationScale = isMobile ? 0.7 : 1;

    if (reduced) {
      // Jump everything to final state
      hero.querySelectorAll('[data-motion]').forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
        el.classList.add('is-visible');
      });
      hero.querySelectorAll('.hero-line span').forEach((el) => {
        (el as HTMLElement).style.transform = 'none';
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out', duration: 0.5 * durationScale },
      });

      // Disable CSS animations on hero elements — GSAP takes over
      hero.querySelectorAll('[data-motion]').forEach((el) => {
        (el as HTMLElement).style.animation = 'none';
        (el as HTMLElement).style.opacity = '0';
      });
      hero.querySelectorAll('.hero-line span').forEach((el) => {
        (el as HTMLElement).style.animation = 'none';
      });

      // ── Kicker pill: clip-path reveal ──
      const kicker = hero.querySelector('.command-kicker') as HTMLElement;
      if (kicker) {
        gsap.set(kicker, { clipPath: 'inset(0 100% 0 0)', opacity: 1, y: 0 });
        tl.to(kicker, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.4 * durationScale,
          ease: 'power3.inOut',
        }, 0);
      }

      // ── Wordmark: split chars reveal with rotateX perspective ──
      const wordmarkRows = hero.querySelectorAll('.hero-wordmark-row');
      wordmarkRows.forEach((row, rowIndex) => {
        const mastheadSpan = row.querySelector('.masthead') as HTMLElement;
        if (!mastheadSpan) return;

        // Set parent visible
        gsap.set(row, { opacity: 1, y: 0 });

        // Split text into chars
        const text = mastheadSpan.textContent || '';
        mastheadSpan.setAttribute('aria-label', text);
        mastheadSpan.innerHTML = '';

        const chars: HTMLSpanElement[] = [];
        text.split('').forEach((char) => {
          const span = document.createElement('span');
          span.style.display = 'inline-block';
          span.style.transformOrigin = 'center bottom';
          span.setAttribute('aria-hidden', 'true');
          if (char === ' ') {
            span.innerHTML = '&nbsp;';
          } else {
            span.textContent = char;
          }
          mastheadSpan.appendChild(span);
          chars.push(span);
        });

        // Animate chars
        gsap.set(chars, {
          opacity: 0,
          y: '120%',
          rotateX: 90,
          transformPerspective: 600,
          transformOrigin: 'center bottom',
        });

        const startTime = 0.1 + rowIndex * 0.08;
        tl.to(chars, {
          opacity: 1,
          y: '0%',
          rotateX: 0,
          duration: 0.6 * durationScale,
          stagger: 0.02,
          ease: 'power4.out',
        }, startTime);
      });

      // ── Role text: word-by-word ──
      const role = hero.querySelector('.hero-role') as HTMLElement;
      if (role) {
        gsap.set(role, { opacity: 1, y: 0 });
        const text = role.textContent || '';
        role.setAttribute('aria-label', text);
        const words = text.split(/(\s+)/);
        role.innerHTML = '';
        const wordSpans: HTMLSpanElement[] = [];
        words.forEach((w) => {
          const span = document.createElement('span');
          span.style.display = 'inline-block';
          span.setAttribute('aria-hidden', 'true');
          if (/^\s+$/.test(w)) {
            span.innerHTML = '&nbsp;';
          } else {
            span.textContent = w;
            wordSpans.push(span);
          }
          role.appendChild(span);
        });

        gsap.set(wordSpans, { opacity: 0, y: 14 });
        tl.to(wordSpans, {
          opacity: 1,
          y: 0,
          duration: 0.35 * durationScale,
          stagger: 0.025,
          ease: 'power3.out',
        }, 0.35);
      }

      // ── Lead paragraph: fade + translateY ──
      const lead = hero.querySelector('.hero-lead') as HTMLElement;
      if (lead) {
        gsap.set(lead, { opacity: 0, y: 10 });
        tl.to(lead, {
          opacity: 1,
          y: 0,
          duration: 0.4 * durationScale,
          ease: 'power3.out',
        }, 0.5);
      }

      // ── CTA buttons: spring entrance ──
      const ctaWrap = lead?.parentElement?.querySelector('[data-motion="rise"]:has(.accent-btn, .ghost-btn)') as HTMLElement
        ?? hero.querySelector('[data-motion="rise"]:has(.accent-btn)') as HTMLElement;
      if (ctaWrap) {
        const buttons = ctaWrap.querySelectorAll('.accent-btn, .ghost-btn');
        gsap.set(ctaWrap, { opacity: 1, y: 0 });
        gsap.set(buttons, { opacity: 0, scale: 0.9, y: 16 });
        tl.to(buttons, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.45 * durationScale,
          stagger: 0.05,
          ease: 'elastic.out(1, 0.75)',
        }, 0.6);
      }

      // ── Stat cards: 3D flip entry ──
      const statGrid = hero.querySelector('[data-motion="rise"]:has(.stat-card)') as HTMLElement;
      if (statGrid) {
        const cards = statGrid.querySelectorAll('.stat-card');
        gsap.set(statGrid, { opacity: 1, y: 0 });
        gsap.set(cards, {
          opacity: 0,
          y: 14,
          rotateY: -10,
          translateZ: -20,
          transformPerspective: 800,
        });
        tl.to(cards, {
          opacity: 1,
          y: 0,
          rotateY: 0,
          translateZ: 0,
          duration: 0.45 * durationScale,
          stagger: 0.07,
          ease: 'power3.out',
        }, 0.65);
      }

      // ── Headshot aside: slide from right ──
      const aside = hero.querySelector('.command-aside') as HTMLElement;
      if (aside) {
        gsap.set(aside, {
          opacity: 0,
          x: isMobile ? 0 : 40,
          y: isMobile ? 20 : 0,
          rotateY: isMobile ? 0 : -6,
          scale: 0.96,
          transformPerspective: 800,
        });
        tl.to(aside, {
          opacity: 1,
          x: 0,
          y: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.55 * durationScale,
          ease: 'power3.out',
        }, 0.15);

        // Headshot frame glow intensification
        const frame = aside.querySelector('.command-aside-frame') as HTMLElement;
        if (frame) {
          gsap.set(frame, { boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 0 0 rgba(255,255,255,0), 0 0 0 rgba(255,255,255,0)' });
          tl.to(frame, {
            boxShadow: '0 0 0 1px rgba(255,255,255,0.14), 0 0 26px rgba(255,255,255,0.34), 0 0 54px rgba(183,148,255,0.22)',
            duration: 0.6 * durationScale,
            ease: 'power2.out',
          }, 0.35);
        }
      }

      // ── Scroll indicator: fade in after everything ──
      const scrollIndicator = hero.querySelector('[data-motion="fade"]') as HTMLElement;
      if (scrollIndicator) {
        gsap.set(scrollIndicator, { opacity: 0 });
        tl.to(scrollIndicator, {
          opacity: 1,
          duration: 0.3 * durationScale,
          ease: 'power2.out',
        }, '>-0.05');

        // Fade out on scroll
        ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: '25% top',
          scrub: true,
          onUpdate: (self) => {
            scrollIndicator.style.opacity = String(1 - self.progress);
          },
        });
      }

      // ── Headshot parallax ──
      if (aside && !isMobile) {
        gsap.to(aside, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, hero);

    return () => ctx.revert();
  }, [ready, gsap, ScrollTrigger]);

  return null;
}
