'use client';

import { useEffect } from 'react';
import Link from 'next/link';

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
    <main id="main-content" data-section-theme="about" className="page-enter marketing-main site-theme page-gutter pb-20 pt-32 md:pb-24 md:pt-40">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm lowercase tracking-[0.2em] text-[var(--text-dim)]">
          Error
        </p>
        <h1 className="mobile-tight-title mb-4 text-[clamp(2.4rem,12vw,3.6rem)] text-[var(--text-primary)] md:text-7xl">
          Something went wrong.
        </h1>
        <p className="mb-10 text-[var(--text-muted)]">
          An unexpected error occurred. You can try again or head back to safety.
        </p>

        <div className="mx-auto flex w-full max-w-sm flex-wrap justify-center gap-3">
          <button onClick={reset} className="accent-btn w-full justify-center sm:w-auto">
            Try again
          </button>
          <Link href="/" className="ghost-btn w-full justify-center sm:w-auto">Go home</Link>
          <Link href="/articles" className="ghost-btn w-full justify-center sm:w-auto">Read articles</Link>
        </div>
      </div>
    </main>
  );
}
