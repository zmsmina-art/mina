'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motionDelay } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Lightbulb,
  Hammer,
  Target,
  Sparkles,
} from 'lucide-react';
import useMotionProfile from '@/components/motion/useMotionProfile';
import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];


const valueProps = [
  {
    icon: Lightbulb,
    text: 'Frameworks for positioning and growth at early-stage AI startups',
  },
  {
    icon: Hammer,
    text: 'Behind-the-scenes lessons from building Olunix',
  },
  {
    icon: Target,
    text: 'Marketing strategy that treats your audience like adults',
  },
  {
    icon: Sparkles,
    text: 'Early access to new articles and projects',
  },
];

export default function NewsletterPageClient() {
  const motionProfile = useMotionProfile();
  const { email, state, errorMsg, handleEmailChange, submit } =
    useNewsletterSubscribe();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <main
      id="main-content"
      data-section-theme="newsletter"
      className="page-enter marketing-main site-theme pt-20"
    >
      {/* ── Hero ── */}
      <section
        className="command-section page-gutter section-block"
        data-section-theme="newsletter-hero"
      >
        <div className="mx-auto w-full max-w-3xl">
          <Link
            href="/"
            className="mb-12 flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            data-motion="rise"
            style={motionDelay(60)}
          >
            <ArrowLeft size={14} />
            Back home
          </Link>

          <p
            className="command-label mb-3"
            data-motion="rise"
            style={motionDelay(120)}
          >
            Newsletter
          </p>

          <h1
            className="home-heading-xl"
            data-motion="rise"
            style={motionDelay(180)}
          >
            Entrepreneurship, marketing, and building businesses worth talking
            about.
          </h1>

          <p
            className="mt-6 max-w-xl text-[var(--text-muted)]"
            data-motion="rise"
            style={motionDelay(240)}
          >
            Occasional essays on what I&rsquo;m learning as a founder, marketer,
            and operator. No fluff, no spam &mdash; just real frameworks and
            honest lessons, delivered when I have something worth sharing.
          </p>

          {/* Inline subscribe form */}
          <div data-motion="rise" style={motionDelay(300)}>
            <AnimatePresence mode="wait" initial={false}>
              {state === 'success' ? (
                <motion.div
                  key="success"
                  className="mt-8 flex items-center gap-3"
                  initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={
                    motionProfile.reduced
                      ? { duration: 0 }
                      : { duration: 0.32, ease: EASE_OUT_EXPO }
                  }
                >
                  <motion.div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.28)] bg-[rgba(255,255,255,0.08)]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={
                      motionProfile.reduced
                        ? { duration: 0 }
                        : {
                            type: 'spring',
                            stiffness: 400,
                            damping: 22,
                            delay: 0.1,
                          }
                    }
                  >
                    <Check
                      size={18}
                      className="text-[var(--text-primary)]"
                    />
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      You&rsquo;re in.
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Check your inbox for a confirmation email.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={submit}
                  className="mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={
                    motionProfile.reduced
                      ? { duration: 0 }
                      : { duration: 0.2 }
                  }
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
                      className="accent-btn"
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

                  <p className="mt-4 text-site-kicker leading-relaxed text-[var(--text-dim)]">
                    Powered by Buttondown. Read the{' '}
                    <Link
                      href="/privacy"
                      className="underline decoration-[rgba(255,255,255,0.25)] underline-offset-2 transition-colors hover:text-[var(--text-muted)]"
                    >
                      privacy policy
                    </Link>
                    .
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Value Proposition ── */}
      <section
        className="command-section page-gutter section-block"
        data-section-theme="newsletter-value"
      >
        <div className="mx-auto w-full max-w-3xl">
          <div
            className="glass-panel rounded-2xl px-7 py-8 sm:px-9 sm:py-10"
            data-motion="rise"
            style={motionDelay(360)}
          >
            <p className="command-label mb-6">What you&rsquo;ll get</p>
            <ul className="space-y-5">
              {valueProps.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4"
                  data-motion="rise"
                  style={motionDelay(400 + i * 50)}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.04)]">
                    <item.icon
                      size={14}
                      className="text-[var(--text-muted)]"
                    />
                  </span>
                  <span className="text-[0.95rem] leading-relaxed text-[var(--text-muted)]">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Author Brief ── */}
      <section
        className="command-section page-gutter section-block"
        data-section-theme="newsletter-author"
      >
        <div className="mx-auto w-full max-w-3xl">
          <div data-motion="rise" style={motionDelay(620)}>
            <p className="command-label mb-4">About the author</p>
            <p className="max-w-xl text-[0.95rem] leading-relaxed text-[var(--text-muted)]">
              I&rsquo;m Mina Mankarious &mdash; founder and CEO of{' '}
              <a
                href="https://olunix.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-[var(--stroke-soft)] underline-offset-4 transition-colors hover:text-[var(--text-primary)] hover:decoration-[var(--text-primary)]"
              >
                Olunix
              </a>
              , where we help AI startups turn technical depth into real market
              traction. I write about the intersection of engineering thinking
              and marketing strategy.{' '}
              <Link
                href="/about"
                className="underline decoration-[var(--stroke-soft)] underline-offset-4 transition-colors hover:text-[var(--text-primary)] hover:decoration-[var(--text-primary)]"
              >
                Read more &rarr;
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="command-section page-gutter pb-20 md:pb-24">
        <div className="mx-auto w-full max-w-3xl">
          <div
            className="site-divider"
            data-motion="rise"
            style={motionDelay(680)}
          />
          <div
            className="mt-8 flex flex-wrap gap-4"
            data-motion="rise"
            style={motionDelay(720)}
          >
            <Link href="/articles" className="ghost-btn">
              Read articles
              <ArrowRight size={14} />
            </Link>
            <Link href="/about" className="ghost-btn">
              About me
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
