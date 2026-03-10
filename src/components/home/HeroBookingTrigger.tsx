'use client';

import { useState, type ComponentType } from 'react';
import { ArrowUpRight, Calendar } from 'lucide-react';

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
};

let bookingModalLoader: Promise<ComponentType<BookingModalProps>> | null = null;

async function loadBookingModal(): Promise<ComponentType<BookingModalProps>> {
  if (!bookingModalLoader) {
    bookingModalLoader = import('@/components/BookingModal').then((module) => module.BookingModal);
  }
  return bookingModalLoader;
}

export default function HeroBookingTrigger() {
  const [open, setOpen] = useState(false);
  const [BookingModalDialog, setBookingModalDialog] = useState<ComponentType<BookingModalProps> | null>(null);

  const handleOpen = async () => {
    if (!BookingModalDialog) {
      const modal = await loadBookingModal();
      setBookingModalDialog(() => modal);
    }
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="accent-btn w-full justify-center sm:w-auto"
      >
        <Calendar size={15} />
        Book a call
        <ArrowUpRight size={15} />
      </button>
      {open && BookingModalDialog ? (
        <BookingModalDialog open={open} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}
