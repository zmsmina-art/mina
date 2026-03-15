'use client';

import { usePathname } from 'next/navigation';

export default function BriefGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/brief')) return null;
  return <>{children}</>;
}
