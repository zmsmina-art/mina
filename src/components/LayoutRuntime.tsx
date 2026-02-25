'use client';

import dynamic from 'next/dynamic';

const MotionRuntime = dynamic(() => import('@/components/MotionRuntime'), { ssr: false });
const EtheralAmbient = dynamic(() => import('@/components/EtheralAmbient'), { ssr: false });

export default function LayoutRuntime() {
  return (
    <>
      <EtheralAmbient />
      <MotionRuntime />
    </>
  );
}
