'use client';

import useMotionProfile from '@/components/motion/useMotionProfile';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { cn } from '@/lib/utils';

interface CardGlowProps {
  className?: string;
  blur?: number;
  spread?: number;
  proximity?: number;
  inactiveZone?: number;
  borderWidth?: number;
}

export default function CardGlow({
  className,
  blur = 0,
  spread = 18,
  proximity = 56,
  inactiveZone = 0.5,
  borderWidth = 1.35,
}: CardGlowProps) {
  const { reduced } = useMotionProfile();
  const disabled = reduced;

  return (
    <GlowingEffect
      blur={blur}
      spread={spread}
      proximity={proximity}
      inactiveZone={inactiveZone}
      borderWidth={borderWidth}
      glow
      disabled={disabled}
      className={cn('z-0', className)}
    />
  );
}
