import type { CSSProperties } from 'react';

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function motionDelay(ms: number): CSSProperties {
  return { '--motion-delay': `${ms}ms` } as CSSProperties;
}

