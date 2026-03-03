'use client';

import { useEffect, useRef } from 'react';
import { useGSAPContext } from '@/components/motion/GSAPProvider';

/**
 * GSAP-enhanced reveals for the about page.
 */
export default function AboutChoreography() {
  const { ready, gsap, ScrollTrigger } = useGSAPContext();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!ready || !gsap || !ScrollTrigger || hasRun.current) return;
    hasRun.current = true;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const d = isMobile ? 0.5 : 0.55;

    const ctx = gsap.context(() => {
      // Photo entrance: slide up with scale
      const photo = document.querySelector('.about-hero-photo') as HTMLElement;
      if (photo) {
        gsap.set(photo, { opacity: 0, y: 25, scale: 0.97 });
        gsap.to(photo, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5 * d,
          ease: 'power3.out',
          scrollTrigger: { trigger: photo, start: 'top 88%', once: true },
          onComplete: () => photo.classList.add('is-visible'),
        });
      }

      // About headshot frame glow
      const frame = document.querySelector('.about-photo-frame') as HTMLElement;
      if (frame) {
        gsap.fromTo(frame, {
          boxShadow: '0 0 0 rgba(255,255,255,0), 0 0 0 rgba(183,148,255,0)',
        }, {
          boxShadow: '0 0 22px rgba(255,255,255,0.28), 0 0 44px rgba(183,148,255,0.18)',
          duration: 0.6 * d,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: frame, start: 'top 88%', once: true },
        });
      }

      // Pullquote: border-left draw effect
      const pullquote = document.querySelector('.about-pullquote') as HTMLElement;
      if (pullquote) {
        gsap.set(pullquote, { opacity: 0, x: -14 });
        gsap.to(pullquote, {
          opacity: 1,
          x: 0,
          duration: 0.4 * d,
          ease: 'power3.out',
          scrollTrigger: { trigger: pullquote, start: 'top 85%', once: true },
        });
      }

      // Timeline items: stagger
      const timelineItems = document.querySelectorAll('.about-timeline-item');
      if (timelineItems.length) {
        gsap.set(timelineItems, { opacity: 0, y: 20 });
        ScrollTrigger.batch(Array.from(timelineItems), {
          start: 'top 88%',
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.5 * d,
              stagger: 0.08,
              ease: 'power3.out',
              onComplete: () => batch.forEach((el) => el.classList.add('is-visible')),
            });
          },
          once: true,
        });
      }

      // Elsewhere link cards: grid stagger
      const linkCards = document.querySelectorAll('.about-link-card');
      if (linkCards.length) {
        gsap.set(linkCards, { opacity: 0, y: 16, scale: 0.97 });
        ScrollTrigger.batch(Array.from(linkCards), {
          start: 'top 90%',
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5 * d,
              stagger: 0.06,
              ease: 'power3.out',
              onComplete: () => batch.forEach((el) => el.classList.add('is-visible')),
            });
          },
          once: true,
        });
      }
    });

    return () => ctx.revert();
  }, [ready, gsap, ScrollTrigger]);

  return null;
}
