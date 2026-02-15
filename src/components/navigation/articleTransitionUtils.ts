'use client';

export type ArticleNavDirection = 'forward' | 'back';

const ARTICLE_LIST_PATH = '/articles';
const ARTICLE_DETAIL_PREFIX = '/articles/';
const ARTICLE_NAV_ATTRIBUTE = 'data-article-nav';

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

export function setArticleNavDirection(direction: ArticleNavDirection): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute(ARTICLE_NAV_ATTRIBUTE, direction);
}

export function clearArticleNavDirection(): void {
  if (typeof document === 'undefined') return;
  document.documentElement.removeAttribute(ARTICLE_NAV_ATTRIBUTE);
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function supportsViewTransitions(): boolean {
  if (typeof document === 'undefined') return false;
  return typeof (document as Document & { startViewTransition?: unknown }).startViewTransition === 'function';
}
