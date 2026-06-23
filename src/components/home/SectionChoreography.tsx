'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The connective "ink thread": one continuous vertical spine at the content
 * column's left edge that runs the whole page. A node marks every section (and
 * divider), each with a short tick reaching into that section — so the linework
 * reads as a single branching system, not scattered marks. The bright fill
 * follows scroll progress. Desktop only; sits out under reduced-motion.
 */
export default function SectionChoreography() {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [nodes, setNodes] = useState<number[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = rootRef.current;
    const fill = fillRef.current;
    const main = root?.parentElement;
    if (!root || !fill || !main) return;

    let frame = 0;

    const measure = () => {
      const mainTop = main.getBoundingClientRect().top + window.scrollY;
      const marks = Array.from(
        main.querySelectorAll<HTMLElement>('[data-section-theme], .script-divider'),
      );
      const tops = marks.map((el) =>
        Math.round(el.getBoundingClientRect().top + window.scrollY - mainTop),
      );
      setNodes(tops);
    };

    const update = () => {
      frame = 0;
      const docHeight = document.documentElement.scrollHeight;
      const p = docHeight > 0 ? Math.min(1, Math.max(0, (window.scrollY + window.innerHeight) / docHeight)) : 0;
      fill.style.transform = `scaleY(${p})`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    // Re-measure once fonts/images settle and shift section offsets.
    const settle = window.setTimeout(measure, 700);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(settle);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="ink-thread" aria-hidden="true" ref={rootRef}>
      <span className="ink-thread-fill" ref={fillRef} />
      {nodes.map((top, i) => (
        <span key={i} className="ink-node" style={{ top: `${top}px` }} />
      ))}
    </div>
  );
}
