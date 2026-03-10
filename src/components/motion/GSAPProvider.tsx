'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

type GSAPContextValue = {
  ready: boolean;
  gsap: typeof import('gsap').gsap | null;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger | null;
};

const GSAPContext = createContext<GSAPContextValue>({
  ready: false,
  gsap: null,
  ScrollTrigger: null,
});

export function useGSAPContext() {
  return useContext(GSAPContext);
}

export default function GSAPProvider({ children }: { children: React.ReactNode }) {
  const [ctx, setCtx] = useState<GSAPContextValue>({ ready: false, gsap: null, ScrollTrigger: null });
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // Respect reduced motion
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.globalTimeline.timeScale(100); // jump to end
      }

      if (!cancelled) {
        setCtx({ ready: true, gsap, ScrollTrigger });
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  // Refresh ScrollTrigger on route change
  useEffect(() => {
    if (!ctx.ready || !ctx.ScrollTrigger) return;
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      // Give DOM time to settle after route change
      requestAnimationFrame(() => {
        ctx.ScrollTrigger!.refresh();
      });
    }
  }, [pathname, ctx.ready, ctx.ScrollTrigger]);

  return <GSAPContext.Provider value={ctx}>{children}</GSAPContext.Provider>;
}
