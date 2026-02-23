'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, X, Check, Loader2, ArrowUpRight } from 'lucide-react';
import useMotionProfile from '@/components/motion/useMotionProfile';
import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ------------------------------------------------------------------ */
/*  Newsletter Modal                                                   */
/* ------------------------------------------------------------------ */

export function NewsletterModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const motionProfile = useMotionProfile();
  const { email, state, errorMsg, handleEmailChange, submit, reset } =
    useNewsletterSubscribe();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  /* Save trigger + focus input on open ------------------------------ */
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    const timer = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, [open]);

  /* Escape to close ----------------------------------------------- */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  /* Lock body scroll ---------------------------------------------- */
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  /* Return focus + reset on close ---------------------------------- */
  useEffect(() => {
    if (!open) {
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
        triggerRef.current = null;
      }
      const timer = setTimeout(reset, 300);
      return () => clearTimeout(timer);
    }
  }, [open, reset]);

  /* Focus trap keyboard handler ----------------------------------- */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'input, button, a, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    []
  );

  /* Motion helpers ------------------------------------------------ */
  const dur = motionProfile.reduced ? 0 : 0.38;
  const stagger = motionProfile.reduced ? 0 : 0.06;
  const enterY = motionProfile.reduced ? 0 : 14;

  const stepTransition = (step: number) =>
    motionProfile.reduced
      ? { duration: 0 }
      : { duration: dur, delay: step * stagger, ease: EASE_OUT_EXPO };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={motionProfile.reduced ? { duration: 0 } : { duration: 0.26, ease: EASE_OUT_EXPO }}
          role="dialog"
          aria-modal="true"
          aria-label="Subscribe to newsletter"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[rgba(2,2,2,0.72)] backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={motionProfile.reduced ? { duration: 0 } : { duration: 0.3 }}
          />

          {/* Modal card */}
          <motion.div
            ref={modalRef}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--stroke-soft)] shadow-[0_28px_70px_rgba(0,0,0,0.56)]"
            style={{
              background: 'linear-gradient(160deg, rgba(11, 11, 11, 0.92), rgba(32, 18, 52, 0.88))',
              backdropFilter: 'blur(24px)',
            }}
            initial={{ opacity: 0, scale: 0.96, y: enterY }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: enterY }}
            transition={
              motionProfile.reduced
                ? { duration: 0 }
                : { duration: 0.4, ease: EASE_OUT_EXPO }
            }
          >
            {/* Decorative top gradient line */}
            <div
              className="absolute left-0 right-0 top-0 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.5) 40%, rgba(122,64,242,0.4) 60%, transparent 90%)',
              }}
            />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-dim)] transition-colors hover:text-[var(--text-primary)]"
            >
              <X size={16} />
            </button>

            <div className="px-7 pb-8 pt-9 sm:px-9 sm:pb-10 sm:pt-11">
              <AnimatePresence mode="wait" initial={false}>
                {state === 'success' ? (
                  /* ---- Success state ---- */
                  <motion.div
                    key="success"
                    className="flex flex-col items-center py-6 text-center"
                    initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={motionProfile.reduced ? { duration: 0 } : { duration: 0.32, ease: EASE_OUT_EXPO }}
                  >
                    <motion.div
                      className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(255,255,255,0.28)] bg-[rgba(255,255,255,0.08)]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={
                        motionProfile.reduced
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 400, damping: 22, delay: 0.1 }
                      }
                    >
                      <Check size={22} className="text-[var(--text-primary)]" />
                    </motion.div>
                    <h3
                      className="mb-2 text-2xl text-[var(--text-primary)]"
                      style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond'), var(--font-eb-garamond, 'EB Garamond'), Georgia, serif" }}
                    >
                      You&rsquo;re in.
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      Check your inbox for a confirmation email.
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-7 text-xs tracking-[0.08em] text-[var(--text-dim)] transition-colors hover:text-[var(--text-primary)]"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  /* ---- Form state ---- */
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={motionProfile.reduced ? { duration: 0 } : { duration: 0.2 }}
                  >
                    <motion.div
                      className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.06)]"
                      initial={{ opacity: 0, y: enterY }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(0)}
                    >
                      <Mail size={16} className="text-[var(--text-muted)]" />
                    </motion.div>

                    <motion.h3
                      className="mb-2 mt-5 text-[clamp(1.6rem,5vw,2rem)] leading-[1.1] text-[var(--text-primary)]"
                      style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond'), var(--font-eb-garamond, 'EB Garamond'), Georgia, serif" }}
                      initial={{ opacity: 0, y: enterY }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(1)}
                    >
                      Stay in the loop
                    </motion.h3>

                    <motion.p
                      className="mb-7 max-w-xs text-sm leading-relaxed text-[var(--text-muted)]"
                      initial={{ opacity: 0, y: enterY }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(2)}
                    >
                      Occasional essays on entrepreneurship, marketing, and building
                      businesses worth talking about. No spam, unsubscribe anytime.
                    </motion.p>

                    <motion.form
                      onSubmit={submit}
                      initial={{ opacity: 0, y: enterY }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(3)}
                    >
                      <div className="flex gap-2.5">
                        <input
                          ref={inputRef}
                          type="email"
                          name="email"
                          value={email}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          placeholder="your@email.com"
                          required
                          aria-label="Email address"
                          disabled={state === 'loading'}
                          className="min-w-0 flex-1 rounded-lg border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] transition-colors focus:border-[rgba(255,255,255,0.4)] focus:outline-none disabled:opacity-50"
                        />
                        <button
                          type="submit"
                          disabled={state === 'loading' || !email.trim()}
                          className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.12)] px-5 py-3 text-sm tracking-[0.04em] text-[var(--text-primary)] transition-all hover:border-[var(--accent-gold-soft)] hover:bg-[rgba(255,255,255,0.22)] disabled:pointer-events-none disabled:opacity-40"
                        >
                          {state === 'loading' ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            'Subscribe'
                          )}
                        </button>
                      </div>

                      <AnimatePresence>
                        {state === 'error' && errorMsg && (
                          <motion.p
                            className="mt-3 text-xs text-red-400/90"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                          >
                            {errorMsg}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      <motion.p
                        className="mt-4 text-site-kicker leading-relaxed text-[var(--text-dim)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={stepTransition(4)}
                      >
                        Powered by Buttondown. Read the{' '}
                        <a
                          href="/privacy"
                          className="underline decoration-[rgba(255,255,255,0.25)] underline-offset-2 transition-colors hover:text-[var(--text-muted)]"
                        >
                          privacy policy
                        </a>
                        .
                      </motion.p>
                    </motion.form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Newsletter CTA (inline banner for footer / article pages)          */
/* ------------------------------------------------------------------ */

export function NewsletterCTA({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
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
      <NewsletterModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
