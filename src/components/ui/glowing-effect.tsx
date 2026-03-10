'use client';

import { memo, useCallback, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { subscribePointer } from '@/lib/pointer';

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: 'default' | 'white';
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = 'default',
    glow = false,
    className,
    movementDuration = 0.42,
    borderWidth = 1,
    disabled = true,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const pointerAnimationFrameRef = useRef<number>(0);
    const angleAnimationFrameRef = useRef<number>(0);
    const currentAngleRef = useRef(0);
    const targetAngleRef = useRef(0);

    const animateAngle = useCallback(() => {
      const element = containerRef.current;
      if (!element) {
        angleAnimationFrameRef.current = 0;
        return;
      }

      const current = currentAngleRef.current;
      const target = targetAngleRef.current;
      const delta = target - current;

      if (Math.abs(delta) < 0.08) {
        currentAngleRef.current = target;
        element.style.setProperty('--start', String(target));
        angleAnimationFrameRef.current = 0;
        return;
      }

      const smoothing = Math.min(0.6, Math.max(0.08, 16 / Math.max(120, movementDuration * 1000)));
      const next = current + delta * smoothing;
      currentAngleRef.current = next;
      element.style.setProperty('--start', String(next));
      angleAnimationFrameRef.current = requestAnimationFrame(animateAngle);
    }, [movementDuration]);

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return;

        if (pointerAnimationFrameRef.current) {
          cancelAnimationFrame(pointerAnimationFrameRef.current);
        }

        pointerAnimationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(mouseX - center[0], mouseY - center[1]);
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;
          const relativeX = Math.min(100, Math.max(0, ((mouseX - left) / width) * 100));
          const relativeY = Math.min(100, Math.max(0, ((mouseY - top) / height) * 100));

          element.style.setProperty('--mouse-x', `${relativeX}%`);
          element.style.setProperty('--mouse-y', `${relativeY}%`);

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty('--active', '0');
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          element.style.setProperty('--active', isActive ? '1' : '0');

          if (!isActive) return;

          const currentAngle = currentAngleRef.current;
          const targetAngle = (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) / Math.PI + 90;
          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          targetAngleRef.current = currentAngle + angleDiff;

          if (!angleAnimationFrameRef.current) {
            angleAnimationFrameRef.current = requestAnimationFrame(animateAngle);
          }
        });
      },
      [inactiveZone, proximity, animateAngle],
    );

    useEffect(() => {
      if (disabled) return;

      const unsubscribe = subscribePointer((x, y) => handleMove({ x, y }));

      return () => {
        unsubscribe();
        if (pointerAnimationFrameRef.current) {
          cancelAnimationFrame(pointerAnimationFrameRef.current);
        }
        if (angleAnimationFrameRef.current) {
          cancelAnimationFrame(angleAnimationFrameRef.current);
        }
      };
    }, [handleMove, disabled]);

    return (
      <>
        <div
          className={cn(
            'pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity',
            glow && 'opacity-100',
            variant === 'white' && 'border-white',
            disabled && '!block',
          )}
        />
        <div
          ref={containerRef}
          style={
            {
              '--blur': `${blur}px`,
              '--spread': spread,
              '--start': '0',
              '--active': '0',
              '--mouse-x': '50%',
              '--mouse-y': '50%',
              '--glowingeffect-border-width': `${borderWidth}px`,
              '--repeating-conic-gradient-times': '5',
              '--gradient':
                variant === 'white'
                  ? `linear-gradient(135deg, rgba(255,255,255,0.96), rgba(255,255,255,0.72), rgba(255,255,255,0.96))`
                  : `linear-gradient(135deg, rgba(243,220,162,0.95), rgba(214,163,63,0.9), rgba(243,220,162,0.95))`,
            } as CSSProperties
          }
          className={cn(
            'pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity',
            glow && 'opacity-100',
            blur > 0 && 'blur-[var(--blur)]',
            className,
            disabled && '!hidden',
          )}
        >
          <div className="absolute inset-0 rounded-[inherit] opacity-[var(--active)] transition-opacity duration-300 [box-shadow:inset_0_0_0_1px_rgba(243,220,162,0.24)]" />
          <div
            className={cn(
              'glow',
              'rounded-[inherit]',
              'after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))] after:content-[""] after:rounded-[inherit]',
              'after:[border:var(--glowingeffect-border-width)_solid_transparent]',
              'after:[background:var(--gradient)] after:[background-attachment:fixed]',
              'after:[filter:drop-shadow(0_0_8px_rgba(214,163,63,0.32))]',
              'after:opacity-[var(--active)] after:transition-opacity after:duration-300',
              'after:[mask-clip:padding-box,border-box]',
              'after:[mask-composite:intersect]',
              'after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]',
            )}
          />
        </div>
      </>
    );
  },
);

GlowingEffect.displayName = 'GlowingEffect';

export { GlowingEffect };
