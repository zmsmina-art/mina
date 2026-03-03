'use client';

import dynamic from 'next/dynamic';
import GSAPProvider from '@/components/motion/GSAPProvider';

const MotionRuntime = dynamic(() => import('@/components/MotionRuntime'), { ssr: false });
const EtheralAmbient = dynamic(() => import('@/components/EtheralAmbient'), { ssr: false });
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });
const MicroInteractions = dynamic(() => import('@/components/motion/MicroInteractions'), { ssr: false });

export default function LayoutRuntime() {
  return (
    <GSAPProvider>
      <EtheralAmbient />
      <MotionRuntime />
      <CustomCursor />
      <MicroInteractions />
    </GSAPProvider>
  );
}
