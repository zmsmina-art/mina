'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps, MouseEvent } from 'react';
import {
  clearArticleNavDirection,
  prefersReducedMotion,
  setArticleNavDirection,
  supportsViewTransitions,
  type ArticleNavDirection,
} from '@/components/navigation/articleTransitionUtils';

type FallbackMode = 'push' | 'backThenPush';

type BaseLinkProps = Omit<ComponentProps<typeof Link>, 'href'>;

interface ArticleTransitionLinkProps extends BaseLinkProps {
  href: string;
  direction: ArticleNavDirection;
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
  direction,
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
    setArticleNavDirection(direction);

    const cleanupTimer = window.setTimeout(() => {
      clearArticleNavDirection();
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
        clearArticleNavDirection();
        runFallbackNavigation();
        return;
      }

      transition.finished.finally(() => {
        window.clearTimeout(cleanupTimer);
        clearArticleNavDirection();
      });
    } catch {
      window.clearTimeout(cleanupTimer);
      clearArticleNavDirection();
      runFallbackNavigation();
    }
  };

  return (
    <Link href={href} target={target} onClick={handleClick} {...rest} />
  );
}
