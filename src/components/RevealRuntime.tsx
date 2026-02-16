'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function RevealRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -18% 0px' },
    );

    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal, .timeline-line'));
    revealNodes.forEach((node) => revealObserver.observe(node));

    const heroLines = Array.from(document.querySelectorAll<HTMLElement>('.hero-line'));
    heroLines.forEach((line) => line.classList.remove('is-visible'));

    const timer = window.setTimeout(() => {
      heroLines.forEach((line, index) => {
        window.setTimeout(() => line.classList.add('is-visible'), index * 110);
      });
    }, 80);

    return () => {
      revealObserver.disconnect();
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
