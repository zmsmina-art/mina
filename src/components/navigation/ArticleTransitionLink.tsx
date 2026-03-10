'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps, MouseEvent } from 'react';
import {
  clearRouteTransitionState,
  prefersReducedMotion,
  setRouteTransitionState,
  supportsViewTransitions,
  type RouteTransitionDirection,
  type RouteTransitionScope,
} from '@/components/navigation/articleTransitionUtils';

type FallbackMode = 'push' | 'backThenPush';

type BaseLinkProps = Omit<ComponentProps<typeof Link>, 'href'>;

interface ArticleTransitionLinkProps extends BaseLinkProps {
  href: string;
  direction: RouteTransitionDirection;
  scope?: RouteTransitionScope;
  fallbackMode?: FallbackMode;
}

const DIRECTION_CLEANUP_MS = 1100;

function shouldIgnoreClick(event: MouseEvent<HTMLAnchorElement>, target?: string): boolean {
  if (event.defaultPrevented || event.button !== 0) return true;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return true;

  if (target && target.toLowerCase() !== '_self') {
    return true;
  }

  return false;
}

export default function ArticleTransitionLink({
  href,
  prefetch = false,
  direction,
  scope = 'article',
  fallbackMode = 'push',
  onClick,
  target,
  ...rest
}: ArticleTransitionLinkProps) {
  const router = useRouter();

  const runFallbackNavigation = () => {
    if (fallbackMode === 'backThenPush' && direction === 'back') {
      const hasHistory = window.history.length > 1;
      const isInternalReferrer = document.referrer.startsWith(window.location.origin);

      if (hasHistory && isInternalReferrer) {
        router.back();
        window.setTimeout(() => {
          if (window.location.pathname !== href) {
            router.push(href);
          }
        }, 150);
        return;
      }
    }

    router.push(href);
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (shouldIgnoreClick(event, target)) return;

    if (prefersReducedMotion() || !supportsViewTransitions()) {
      return;
    }

    event.preventDefault();
    setRouteTransitionState(direction, scope);

    const cleanupTimer = window.setTimeout(() => {
      clearRouteTransitionState();
    }, DIRECTION_CLEANUP_MS);

    try {
      const documentWithViewTransition = document as Document & {
        startViewTransition?: (callback: () => void | Promise<void>) => {
          finished: Promise<void>;
        };
      };

      const transition = documentWithViewTransition.startViewTransition?.(() => {
        router.push(href);
      });

      if (!transition) {
        window.clearTimeout(cleanupTimer);
        clearRouteTransitionState();
        runFallbackNavigation();
        return;
      }

      transition.finished.finally(() => {
        window.clearTimeout(cleanupTimer);
        clearRouteTransitionState();
      });
    } catch {
      window.clearTimeout(cleanupTimer);
      clearRouteTransitionState();
      runFallbackNavigation();
    }
  };

  return (
    <Link href={href} prefetch={prefetch} target={target} onClick={handleClick} {...rest} />
  );
}
