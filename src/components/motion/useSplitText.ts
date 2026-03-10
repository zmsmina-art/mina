'use client';

import { useRef, useEffect, useCallback } from 'react';

export type SplitMode = 'chars' | 'words' | 'lines';

/**
 * Splits heading text into <span> per char/word with ARIA preservation.
 * Returns a ref to attach to the element to be split.
 * The element's innerHTML is replaced with spans; original text is preserved
 * as aria-label on the parent.
 */
export default function useSplitText<T extends HTMLElement = HTMLElement>(
  mode: SplitMode = 'chars',
) {
  const ref = useRef<T>(null);
  const splitRef = useRef(false);

  const split = useCallback(() => {
    const el = ref.current;
    if (!el || splitRef.current) return;
    splitRef.current = true;

    const text = el.textContent || '';
    el.setAttribute('aria-label', text);

    let units: string[];
    if (mode === 'chars') {
      units = text.split('');
    } else if (mode === 'words') {
      units = text.split(/(\s+)/);
    } else {
      units = text.split('\n');
    }

    el.innerHTML = '';
    units.forEach((unit) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.setAttribute('aria-hidden', 'true');

      if (unit === ' ' || /^\s+$/.test(unit)) {
        span.innerHTML = '&nbsp;';
        span.style.width = mode === 'chars' ? '0.3em' : undefined as unknown as string;
      } else {
        span.textContent = unit;
      }

      span.classList.add(`split-${mode === 'chars' ? 'char' : mode === 'words' ? 'word' : 'line'}`);
      el.appendChild(span);
    });
  }, [mode]);

  useEffect(() => {
    split();
  }, [split]);

  return ref;
}
