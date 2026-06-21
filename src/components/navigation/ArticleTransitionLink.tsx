'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import type {
  RouteTransitionDirection,
  RouteTransitionScope,
} from '@/components/navigation/articleTransitionUtils';

type FallbackMode = 'push' | 'backThenPush';

type BaseLinkProps = Omit<ComponentProps<typeof Link>, 'href'>;

interface ArticleTransitionLinkProps extends BaseLinkProps {
  href: string;
  // Kept for API compatibility with callers; the entrance is now handled by a
  // reliable CSS mount animation on the destination (.article-motion-shell)
  // rather than the native View Transitions API, which does not animate
  // dependably across Next App Router navigations on React 18.
  direction?: RouteTransitionDirection;
  scope?: RouteTransitionScope;
  fallbackMode?: FallbackMode;
}

export default function ArticleTransitionLink({
  href,
  prefetch = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  direction,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scope,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fallbackMode,
  ...rest
}: ArticleTransitionLinkProps) {
  return <Link href={href} prefetch={prefetch} {...rest} />;
}
