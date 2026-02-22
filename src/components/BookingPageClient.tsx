'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BookingModal } from '@/components/BookingModal';

export default function BookingPageClient() {
  const router = useRouter();

  const handleClose = useCallback(() => {
    router.push('/');
  }, [router]);

  return <BookingModal open={true} onClose={handleClose} />;
}
