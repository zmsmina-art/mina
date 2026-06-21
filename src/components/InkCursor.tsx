'use client';

import { useEffect, useRef } from 'react';

/**
 * InkCursor — a tapering "wet ink" trail that follows the pointer, echoing the
 * cursive signature. Desktop + fine pointer only; disabled for reduced motion.
 */
export default function InkCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const points: { x: number; y: number }[] = [];
    const MAX = 18;
    let mouseX = -100;
    let mouseY = -100;
    let active = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      active = true;
    };
    const onLeave = () => { active = false; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);
    window.addEventListener('resize', resize);

    let raf = 0;
    const render = () => {
      // ease the head toward the mouse for a smooth ink flow
      const head = points[points.length - 1] || { x: mouseX, y: mouseY };
      const nx = head.x + (mouseX - head.x) * 0.35;
      const ny = head.y + (mouseY - head.y) * 0.35;
      if (active) points.push({ x: nx, y: ny });
      while (points.length > MAX) points.shift();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (points.length > 1) {
        for (let i = 1; i < points.length; i++) {
          const t = i / points.length;
          ctx.beginPath();
          ctx.moveTo(points[i - 1].x, points[i - 1].y);
          ctx.lineTo(points[i].x, points[i].y);
          ctx.strokeStyle = `rgba(255,255,255,${0.5 * t})`;
          ctx.lineWidth = 2.4 * t;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }
      }

      // let the tail dissolve when the pointer is idle
      if (!active && points.length) points.shift();

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="ink-cursor"
    />
  );
}
