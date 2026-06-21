'use client';

import { useEffect, useRef, useState } from 'react';

type Phase = 'loading' | 'reveal' | 'done';

/**
 * SiteLoader — first-visit intro. Draws the cursive "mm." signature while a
 * counter climbs to 100, then wipes upward to reveal the page. Shows once per
 * tab session; collapses instantly under prefers-reduced-motion.
 */
export default function SiteLoader() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [pct, setPct] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (sessionStorage.getItem('mm-loaded')) {
      setPhase('done');
      return;
    }

    document.body.classList.add('is-loading');
    const duration = reduced ? 350 : 2200;
    let start = 0;

    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      // ease-out so the counter decelerates near 100
      const eased = 1 - Math.pow(1 - p, 2);
      setPct(Math.round(eased * 100));
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPhase('reveal');
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (phase !== 'reveal') return;
    const t = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem('mm-loaded', '1');
      document.body.classList.remove('is-loading');
    }, 950);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div className={`site-loader ${phase === 'reveal' ? 'site-loader--reveal' : ''}`} aria-hidden="true">
      <span className="site-loader-corner site-loader-corner--tl" />
      <span className="site-loader-corner site-loader-corner--tr" />
      <span className="site-loader-corner site-loader-corner--bl" />
      <span className="site-loader-corner site-loader-corner--br" />

      <div className="site-loader-meta site-loader-meta--top">
        <span>Mina Mankarious</span>
        <span>Portfolio — 2026</span>
      </div>

      <div className="site-loader-inner">
        <div className="site-loader-mark">
          <span className="mm-glyph mm-ink">mm.</span>
        </div>
        <div className="site-loader-bar">
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="site-loader-count">
        <span>{String(pct).padStart(3, '0')}</span>
        <span className="site-loader-count-label">Loading</span>
      </div>
    </div>
  );
}
