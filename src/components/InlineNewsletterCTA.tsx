'use client';

import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';

export default function InlineNewsletterCTA() {
  const { email, state, errorMsg, handleEmailChange, submit } = useNewsletterSubscribe();

  return (
    <div className="my-10 rounded-xl border border-[var(--stroke-soft)] bg-[var(--bg-elev-1)]/60 p-6 backdrop-blur-md sm:p-8">
      {state === 'success' ? (
        <p className="text-center font-[family-name:var(--font-cormorant)] text-xl text-[var(--text-primary)]">
          You&rsquo;re in.
        </p>
      ) : (
        <>
          <h3 className="mb-1 font-[family-name:var(--font-cormorant)] text-xl text-[var(--text-primary)] sm:text-2xl">
            Enjoying this article?
          </h3>
          <p className="mb-4 text-sm text-[var(--text-muted)]">
            Get essays like this delivered to your inbox. No spam.
          </p>

          <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-[var(--stroke-soft)] bg-[var(--bg-canvas)]/60 px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:border-[var(--accent-purple-soft)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              className="shrink-0 rounded-lg bg-[var(--accent-purple-soft)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {state === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {state === 'error' && (
            <p className="mt-2 text-sm text-red-400">{errorMsg}</p>
          )}
        </>
      )}
    </div>
  );
}
