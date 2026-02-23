'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import {
  clearRouteTransitionState,
  isArticleDetailPath,
  isArticlesListDetailPair,
  setRouteTransitionState,
} from '@/components/navigation/articleTransitionUtils';

const ROUTE_STATE_CLEANUP_MS = 950;
const MOTION_SELECTOR = '[data-motion]';
const SECTION_THEME_SELECTOR = '[data-section-theme]';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function setReducedMotionFlag(reduced: boolean): void {
  if (typeof document === 'undefined') return;
  if (reduced) {
    document.documentElement.setAttribute('data-reduced-motion', 'true');
    return;
  }

  document.documentElement.removeAttribute('data-reduced-motion');
}

function resolveDefaultTheme(pathname: string): string {
  if (pathname === '/') return 'hero';
  if (pathname === '/about') return 'about';
  if (pathname === '/articles') return 'articles';
  if (pathname.startsWith('/articles/')) return 'article';
  return 'default';
}

function setSectionTheme(theme: string): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-section-theme', theme);
}

export default function MotionRuntime() {
  const pathname = usePathname();
  const previousPathRef = useRef(pathname);
  const cleanupTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    const syncReducedMotion = () => {
      setReducedMotionFlag(reducedMotionQuery.matches);
    };

    syncReducedMotion();

    if (typeof reducedMotionQuery.addEventListener === 'function') {
      reducedMotionQuery.addEventListener('change', syncReducedMotion);
      return () => reducedMotionQuery.removeEventListener('change', syncReducedMotion);
    }

    reducedMotionQuery.addListener(syncReducedMotion);
    return () => reducedMotionQuery.removeListener(syncReducedMotion);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const html = document.documentElement;
    const defaultTheme = resolveDefaultTheme(pathname);
    setSectionTheme(defaultTheme);
    html.setAttribute('data-page-path', pathname);
    // has-site-theme is set by an inline script in layout.tsx before paint to avoid FOUC

    const motionNodes = Array.from(document.querySelectorAll<HTMLElement>(MOTION_SELECTOR));
    if (reducedMotion) {
      motionNodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }

    motionNodes.forEach((node) => node.classList.remove('is-visible'));

    const motionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          motionObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    );

    motionNodes.forEach((node) => motionObserver.observe(node));

    const themedSections = Array.from(document.querySelectorAll<HTMLElement>(SECTION_THEME_SELECTOR));
    let themeObserver: IntersectionObserver | null = null;

    if (themedSections.length > 0) {
      themeObserver = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (visibleEntries.length === 0) return;
          const winner = visibleEntries[0].target as HTMLElement;
          const nextTheme = winner.dataset.sectionTheme;
          if (!nextTheme) return;
          setSectionTheme(nextTheme);
        },
        {
          threshold: [0.16, 0.32, 0.48, 0.66],
          rootMargin: '-34% 0px -40% 0px',
        },
      );

      themedSections.forEach((section) => themeObserver?.observe(section));
    }

    return () => {
      motionObserver.disconnect();
      themeObserver?.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    previousPathRef.current = pathname;

    if (cleanupTimerRef.current !== null) {
      window.clearTimeout(cleanupTimerRef.current);
    }

    cleanupTimerRef.current = window.setTimeout(() => {
      clearRouteTransitionState();
      cleanupTimerRef.current = null;
    }, ROUTE_STATE_CLEANUP_MS);
  }, [pathname]);

  useEffect(() => {
    const scheduleCleanup = () => {
      if (cleanupTimerRef.current !== null) {
        window.clearTimeout(cleanupTimerRef.current);
      }

      cleanupTimerRef.current = window.setTimeout(() => {
        clearRouteTransitionState();
        cleanupTimerRef.current = null;
      }, ROUTE_STATE_CLEANUP_MS);
    };

    const onPopState = () => {
      const fromPathname = previousPathRef.current;
      const toPathname = window.location.pathname;

      if (isArticlesListDetailPair(fromPathname, toPathname)) {
        const direction = isArticleDetailPath(fromPathname) ? 'back' : 'forward';
        setRouteTransitionState(direction, 'article');
      } else {
        setRouteTransitionState('back', 'page');
      }

      scheduleCleanup();
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
      if (cleanupTimerRef.current !== null) {
        window.clearTimeout(cleanupTimerRef.current);
      }
    };
  }, []);

  return null;
}
