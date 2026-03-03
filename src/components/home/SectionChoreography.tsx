'use client';

import { useEffect, useRef } from 'react';
import { useGSAPContext } from '@/components/motion/GSAPProvider';

/**
 * Client-only component that adds GSAP ScrollTrigger choreography
 * to all homepage sections beyond the hero.
 */
export default function SectionChoreography() {
  const { ready, gsap, ScrollTrigger } = useGSAPContext();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!ready || !gsap || !ScrollTrigger || hasRun.current) return;
    hasRun.current = true;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const d = isMobile ? 0.5 : 0.55; // duration scale — fast, snappy

    const ctx = gsap.context(() => {
      // ── Authority Section: timeline guide draw + card cascade ──
      const authoritySection = document.querySelector('[data-section-theme="authority"]');
      if (authoritySection) {
        // Timeline guide: scroll-linked scaleY
        const guide = authoritySection.querySelector('.timeline-guide') as HTMLElement;
        if (guide) {
          gsap.fromTo(guide, { scaleY: 0 }, {
            scaleY: 1,
            transformOrigin: 'top',
            ease: 'none',
            scrollTrigger: {
              trigger: authoritySection.querySelector('.timeline-stack'),
              start: 'top 80%',
              end: 'bottom 60%',
              scrub: 0.5,
            },
          });
        }

        // Timeline cards: slide from right with stagger
        const timelineCards = authoritySection.querySelectorAll('.timeline-item');
        if (timelineCards.length) {
          gsap.set(timelineCards, { opacity: 0, x: 25, y: 0 });
          ScrollTrigger.batch(Array.from(timelineCards), {
            start: 'top 85%',
            onEnter: (batch) => {
              gsap.to(batch, {
                opacity: 1,
                x: 0,
                duration: 0.45 * d,
                stagger: 0.08,
                ease: 'power3.out',
                onComplete: () => batch.forEach((el) => el.classList.add('is-visible')),
              });
            },
            once: true,
          });
        }

        // Intro card: depth reveal
        const introCard = authoritySection.querySelector('.authority-intro-card') as HTMLElement;
        if (introCard) {
          gsap.set(introCard, { opacity: 0, y: 20, scale: 0.98 });
          gsap.to(introCard, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.45 * d,
            ease: 'power3.out',
            scrollTrigger: { trigger: introCard, start: 'top 86%', once: true },
            onComplete: () => introCard.classList.add('is-visible'),
          });
        }
      }

      // ── Writing Section: article card cascade ──
      const writingSection = document.querySelector('[data-section-theme="writing"]');
      if (writingSection) {
        const articleCards = writingSection.querySelectorAll('.article-card-motion, .glass-panel');
        if (articleCards.length) {
          gsap.set(articleCards, { opacity: 0, y: 20 });
          // First card: 3D flip
          const first = articleCards[0] as HTMLElement;
          if (first) {
            gsap.set(first, { rotateX: 8, transformPerspective: 1100, transformOrigin: '50% 0%' });
          }

          ScrollTrigger.batch(Array.from(articleCards), {
            start: 'top 86%',
            onEnter: (batch) => {
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.45 * d,
                stagger: 0.06,
                ease: 'power3.out',
                onComplete: () => batch.forEach((el) => el.classList.add('is-visible')),
              });
            },
            once: true,
          });
        }
      }

      // ── Work Section: spotlight entrance with glow ──
      const workSection = document.querySelector('[data-section-theme="work"]');
      if (workSection) {
        const featureCards = workSection.querySelectorAll('.feature-card');
        featureCards.forEach((card) => {
          gsap.set(card, { opacity: 0, y: 25, scale: 0.96 });
          gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45 * d,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 84%', once: true },
            onComplete: () => {
              card.classList.add('is-visible');
              // Glow bloom on arrival
              gsap.fromTo(card, {
                boxShadow: '0 24px 54px rgba(5,5,5,0.38), 0 0 0 1px rgba(255,255,255,0.12)',
              }, {
                boxShadow: '0 24px 54px rgba(5,5,5,0.38), 0 0 0 1px rgba(255,255,255,0.22), inset 0 1px 0 rgba(246,246,246,0.08)',
                duration: 0.35 * d,
                ease: 'power2.out',
              });
            },
          });
        });
      }

      // ── Education Section: crest 3D reveal ──
      const educationSection = document.querySelector('[data-section-theme="education"]');
      if (educationSection) {
        const crest = educationSection.querySelector('[data-motion="crest"]') as HTMLElement;
        if (crest && !isMobile) {
          gsap.set(crest, { opacity: 0, rotateY: 120, scale: 0.85, transformPerspective: 800 });
          gsap.to(crest, {
            opacity: 1,
            rotateY: 0,
            scale: 1,
            duration: 0.55 * d,
            ease: 'back.out(1.4)',
            scrollTrigger: { trigger: crest, start: 'top 86%', once: true },
            onComplete: () => crest.classList.add('is-visible'),
          });
        }
      }

      // ── Services Section: alternating sweep ──
      const servicesSection = document.querySelector('[data-section-theme="services"]');
      if (servicesSection) {
        const serviceCards = servicesSection.querySelectorAll('.service-card-v2');
        serviceCards.forEach((card, i) => {
          const fromX = i % 2 === 0 ? -35 : 35;
          gsap.set(card, { opacity: 0, x: fromX });
          gsap.to(card, {
            opacity: 1,
            x: 0,
            duration: 0.4 * d,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
            onComplete: () => card.classList.add('is-visible'),
          });
        });

        // Service numbers: count up
        const serviceIndices = servicesSection.querySelectorAll('.service-index');
        serviceIndices.forEach((el) => {
          const text = (el as HTMLElement).textContent || '';
          const num = parseInt(text.replace(/\D/g, ''), 10);
          if (isNaN(num)) return;

          const obj = { val: 0 };
          gsap.to(obj, {
            val: num,
            duration: 0.45 * d,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            onUpdate: () => {
              (el as HTMLElement).textContent = `0${Math.round(obj.val)}`;
            },
          });
        });
      }

      // ── Contact Section: crescendo bloom ──
      const contactSection = document.querySelector('[data-section-theme="contact"]');
      if (contactSection) {
        const panel = contactSection.querySelector('.contact-panel') as HTMLElement;
        if (panel) {
          gsap.set(panel, { opacity: 0, y: 30, scale: 0.95 });
          gsap.to(panel, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5 * d,
            ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 82%', once: true },
            onComplete: () => {
              panel.classList.add('is-visible');
              // Glow bloom
              gsap.fromTo(panel, {
                boxShadow: '0 10px 20px rgba(5,5,5,0.2)',
              }, {
                boxShadow: '0 26px 48px rgba(5,5,5,0.34), 0 0 0 1px rgba(255,255,255,0.18), 0 0 42px rgba(255,255,255,0.1)',
                duration: 0.4 * d,
                ease: 'power2.out',
              });
            },
          });
        }
      }

      // ── Footer: rise with line-draw ──
      const footer = document.querySelector('.site-footer');
      if (footer) {
        const footerItems = footer.querySelectorAll('[data-motion="footer-rise"]');
        if (footerItems.length) {
          gsap.set(footerItems, { opacity: 0, y: 18 });
          ScrollTrigger.batch(Array.from(footerItems), {
            start: 'top 92%',
            onEnter: (batch) => {
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 0.35 * d,
                stagger: 0.06,
                ease: 'power3.out',
                onComplete: () => batch.forEach((el) => el.classList.add('is-visible')),
              });
            },
            once: true,
          });
        }
      }

      // ── Section heading split reveals (command-label clip-path wipes) ──
      const labels = document.querySelectorAll('.command-label');
      labels.forEach((label) => {
        const el = label as HTMLElement;
        // Only do this for non-hero labels
        if (el.closest('.section-hero')) return;

        gsap.set(el, { clipPath: 'inset(0 100% 0 0)', opacity: 1, x: 0 });
        gsap.to(el, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.4 * d,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onComplete: () => el.classList.add('is-visible'),
        });

        // Line draw for ::after
        const afterLine = el.querySelector('::after');
        if (!afterLine) {
          // CSS ::after can't be animated with GSAP directly, so the clip-path wipe handles it
        }
      });

    });

    return () => ctx.revert();
  }, [ready, gsap, ScrollTrigger]);

  return null;
}
