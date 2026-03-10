'use client';

import useTilt from './useTilt';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Wrapper component for 3D tilt hover effect.
 */
export default function TiltCard({
  children,
  className,
  maxTilt = 5,
  scale = 1.02,
  as: Tag = 'div',
}: TiltCardProps) {
  const ref = useTilt<HTMLElement>({ maxTilt, scale });

  return (
    // @ts-expect-error -- dynamic tag element
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
