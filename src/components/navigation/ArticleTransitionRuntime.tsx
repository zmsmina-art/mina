'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  clearArticleNavDirection,
  isArticleDetailPath,
  isArticlesListDetailPair,
  setArticleNavDirection,
} from '@/components/navigation/articleTransitionUtils';

const MARKER_CLEANUP_MS = 900;

export default function ArticleTransitionRuntime() {
  const pathname = usePathname();
  const previousPathRef = useRef(pathname);
  const cleanupTimerRef = useRef<number | null>(null);

  useEffect(() => {
    previousPathRef.current = pathname;

    if (cleanupTimerRef.current !== null) {
      window.clearTimeout(cleanupTimerRef.current);
    }

    cleanupTimerRef.current = window.setTimeout(() => {
      clearArticleNavDirection();
      cleanupTimerRef.current = null;
    }, MARKER_CLEANUP_MS);
  }, [pathname]);

  useEffect(() => {
    const onPopState = () => {
      const fromPathname = previousPathRef.current;
      const toPathname = window.location.pathname;

      if (!isArticlesListDetailPair(fromPathname, toPathname)) {
        return;
      }

      const direction = isArticleDetailPath(fromPathname) ? 'back' : 'forward';
      setArticleNavDirection(direction);

      if (cleanupTimerRef.current !== null) {
        window.clearTimeout(cleanupTimerRef.current);
      }

      cleanupTimerRef.current = window.setTimeout(() => {
        clearArticleNavDirection();
        cleanupTimerRef.current = null;
      }, MARKER_CLEANUP_MS);
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
