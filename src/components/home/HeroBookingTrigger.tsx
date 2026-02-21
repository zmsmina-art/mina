'use client';

import { useState } from 'react';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { BookingModal } from '@/components/BookingModal';

export default function HeroBookingTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="accent-btn w-full justify-center sm:w-auto"
      >
        <Calendar size={15} />
        Book a call
        <ArrowUpRight size={15} />
      </button>
      <BookingModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
