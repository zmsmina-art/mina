'use client';

export type RouteTransitionDirection = 'forward' | 'back';
export type RouteTransitionScope = 'article' | 'page';
export type RouteTransitionState = `${RouteTransitionScope}-${RouteTransitionDirection}`;
export type ArticleNavDirection = RouteTransitionDirection;

const ARTICLE_LIST_PATH = '/articles';
const ARTICLE_DETAIL_PREFIX = '/articles/';
const ROUTE_TRANSITION_ATTRIBUTE = 'data-route-transition';

export function isArticlesListPath(pathname: string): boolean {
  return pathname === ARTICLE_LIST_PATH;
}

export function isArticleDetailPath(pathname: string): boolean {
  return pathname.startsWith(ARTICLE_DETAIL_PREFIX) && pathname !== ARTICLE_LIST_PATH;
}

export function isArticlesListDetailPair(fromPathname: string, toPathname: string): boolean {
  if (fromPathname === toPathname) return false;

  const fromIsList = isArticlesListPath(fromPathname);
  const toIsList = isArticlesListPath(toPathname);
  const fromIsDetail = isArticleDetailPath(fromPathname);
  const toIsDetail = isArticleDetailPath(toPathname);

  return (fromIsList && toIsDetail) || (fromIsDetail && toIsList);
}

export function setRouteTransitionState(
  direction: RouteTransitionDirection,
  scope: RouteTransitionScope = 'page',
): void {
  if (typeof document === 'undefined') return;
  const state: RouteTransitionState = `${scope}-${direction}`;
  document.documentElement.setAttribute(ROUTE_TRANSITION_ATTRIBUTE, state);
}

export function clearRouteTransitionState(): void {
  if (typeof document === 'undefined') return;
  document.documentElement.removeAttribute(ROUTE_TRANSITION_ATTRIBUTE);
}

export function setArticleNavDirection(direction: ArticleNavDirection): void {
  setRouteTransitionState(direction, 'article');
}

export function clearArticleNavDirection(): void {
  clearRouteTransitionState();
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function supportsViewTransitions(): boolean {
  if (typeof document === 'undefined') return false;
  return typeof (document as Document & { startViewTransition?: unknown }).startViewTransition === 'function';
}
