'use client';

import dynamic from 'next/dynamic';
import GSAPProvider from '@/components/motion/GSAPProvider';

const MotionRuntime = dynamic(() => import('@/components/MotionRuntime'), { ssr: false });

const MicroInteractions = dynamic(() => import('@/components/motion/MicroInteractions'), { ssr: false });

export default function LayoutRuntime() {
  return (
    <GSAPProvider>
      <MotionRuntime />
      <MicroInteractions />
    </GSAPProvider>
  );
}
