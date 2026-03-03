'use client';

import { useEffect, useRef } from 'react';
import { useGSAPContext } from './GSAPProvider';

/**
 * Hook wrapping gsap.context() with auto-cleanup tied to component lifecycle.
 * The callback receives { gsap, ScrollTrigger } and runs once GSAP is ready.
 * Returns a ref to attach to the scope element.
 */
export default function useGSAP<T extends HTMLElement = HTMLDivElement>(
  callback: (ctx: {
    gsap: typeof import('gsap').gsap;
    ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
  }) => void,
  deps: React.DependencyList = [],
) {
  const scopeRef = useRef<T>(null);
  const { ready, gsap, ScrollTrigger } = useGSAPContext();

  useEffect(() => {
    if (!ready || !gsap || !ScrollTrigger || !scopeRef.current) return;

    const ctx = gsap.context(() => {
      callback({ gsap, ScrollTrigger });
    }, scopeRef.current);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, gsap, ScrollTrigger, ...deps]);

  return scopeRef;
}
