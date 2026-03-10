'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="marketing-main site-theme page-gutter flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl text-[var(--text-primary)]">Something went wrong</h1>
      <p className="mt-3 text-sm text-[var(--text-muted)]">
        An unexpected error occurred. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.12)] px-5 py-3 text-sm tracking-[0.04em] text-[var(--text-primary)] transition-all hover:border-[var(--accent-gold-soft)] hover:bg-[rgba(255,255,255,0.22)]"
      >
        Try again
      </button>
    </main>
  );
}
