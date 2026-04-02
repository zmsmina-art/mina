'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar } from 'lucide-react';

type BookingModalProps = { open: boolean; onClose: () => void };

let loader: Promise<ComponentType<BookingModalProps>> | null = null;
function loadModal() {
  if (!loader) loader = import('@/components/BookingModal').then((m) => m.BookingModal);
  return loader;
}

export default function FloatingCTA() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [Modal, setModal] = useState<ComponentType<BookingModalProps> | null>(null);

  useEffect(() => {
    // Only show on homepage and main marketing pages
    const showOn = ['/', '/about', '/work', '/articles'];
    const isMarketing = showOn.some((p) => pathname === p || pathname.startsWith('/articles/'));
    if (!isMarketing) {
      setVisible(false);
      return;
    }

    const onScroll = () => {
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;

      // Show after scrolling 1 viewport height
      const pastHero = scrollY > viewportH * 0.85;

      // Hide when near the contact section (last 400px of page)
      const nearBottom = scrollY + viewportH > document.documentElement.scrollHeight - 400;

      setVisible(pastHero && !nearBottom);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  const handleClick = async () => {
    if (!Modal) {
      const m = await loadModal();
      setModal(() => m);
    }
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Book a call"
        className={`floating-cta ${visible ? 'floating-cta--visible' : ''}`}
      >
        <Calendar size={16} />
        <span className="floating-cta-label">Book a call</span>
      </button>
      {open && Modal ? <Modal open={open} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
