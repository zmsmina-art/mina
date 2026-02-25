'use client';

import { useState, type ComponentType } from 'react';
import { Mail, ArrowUpRight } from 'lucide-react';

type NewsletterModalProps = {
  open: boolean;
  onClose: () => void;
};

let newsletterModalLoader: Promise<ComponentType<NewsletterModalProps>> | null = null;

async function loadNewsletterModal(): Promise<ComponentType<NewsletterModalProps>> {
  if (!newsletterModalLoader) {
    newsletterModalLoader = import('@/components/NewsletterModalDialog').then((module) => module.NewsletterModal);
  }
  return newsletterModalLoader;
}

export function NewsletterCTA({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [NewsletterModalDialog, setNewsletterModalDialog] = useState<ComponentType<NewsletterModalProps> | null>(null);

  const handleOpen = async () => {
    if (!NewsletterModalDialog) {
      const modal = await loadNewsletterModal();
      setNewsletterModalDialog(() => modal);
    }
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={`group inline-flex items-center gap-2.5 text-sm tracking-[0.03em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] ${className}`}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--stroke-soft)] transition-colors group-hover:border-[rgba(255,255,255,0.4)]">
          <Mail size={12} />
        </span>
        Subscribe to newsletter
        <ArrowUpRight
          size={13}
          className="text-[var(--text-dim)] transition-colors group-hover:text-[var(--text-primary)]"
        />
      </button>

      {open && NewsletterModalDialog ? (
        <NewsletterModalDialog open={open} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}
