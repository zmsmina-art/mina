'use client';

import { useState, type ComponentType } from 'react';
import { Calendar, ArrowUpRight, Clock, MessageCircle, Sparkles } from 'lucide-react';

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

const DETAILS = [
  { icon: Clock, text: '30 minutes, no strings attached' },
  { icon: MessageCircle, text: 'Positioning, growth, or go-to-market' },
  { icon: Sparkles, text: 'For AI founders and operators' },
];

export default function BookingPageClient() {
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
    <div className="relative z-[3]">
      <main id="main-content" className="page-enter marketing-main site-theme pt-20">
        <section className="page-gutter command-section">
          <div className="mx-auto flex min-h-[calc(100vh-86px)] w-full max-w-3xl flex-col items-center justify-center py-16 text-center">

            {/* Kicker */}
            <p
              className="command-kicker"
              data-motion="rise"
            >
              Open Invitation
            </p>

            {/* Heading */}
            <h1
              className="home-heading-xl mt-6 text-[clamp(2.4rem,8vw,4rem)] leading-[1.02] text-[var(--text-primary)]"
              data-motion="rise"
            >
              Let&rsquo;s talk
            </h1>

            {/* Body copy */}
            <p
              className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--text-muted)]"
              data-motion="rise"
            >
              I keep a few slots open every week for conversations with founders
              and operators building in AI. These calls are free &mdash; no pitch,
              no invoice, no catch.
            </p>
            <p
              className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--text-muted)]"
              data-motion="rise"
            >
              If anything I&rsquo;m working on resonates, or you want to
              think through a problem together, grab a time.
            </p>

            {/* Detail chips */}
            <div
              className="mt-10 flex flex-wrap items-center justify-center gap-3"
              data-motion="rise"
            >
              {DETAILS.map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm text-[var(--text-dim)]"
                >
                  <Icon size={14} className="shrink-0 opacity-60" />
                  {text}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10" data-motion="rise">
              <button
                type="button"
                onClick={handleOpen}
                className="accent-btn text-base"
              >
                <Calendar size={15} />
                Book a call
                <ArrowUpRight size={15} />
              </button>
            </div>

            {/* Email fallback */}
            <p
              className="mt-8 text-sm text-[var(--text-dim)]"
              data-motion="rise"
            >
              Or reach out directly at{' '}
              <a
                href="mailto:mina@olunix.com"
                className="link-underline text-[var(--accent-brass)] transition-colors hover:text-[var(--accent-brass-soft)]"
              >
                mina@olunix.com
              </a>
            </p>
          </div>
        </section>
      </main>

      {open && BookingModalDialog ? (
        <BookingModalDialog open={open} onClose={() => setOpen(false)} />
      ) : null}
    </div>
  );
}
