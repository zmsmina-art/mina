'use client';

import useMagnetic from './useMagnetic';

interface MagneticWrapProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Wrapper component for magnetic hover effect.
 */
export default function MagneticWrap({
  children,
  className,
  strength = 0.35,
  radius = 80,
  as: Tag = 'div',
}: MagneticWrapProps) {
  const ref = useMagnetic<HTMLElement>({ strength, radius });

  return (
    // @ts-expect-error -- dynamic tag element
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
