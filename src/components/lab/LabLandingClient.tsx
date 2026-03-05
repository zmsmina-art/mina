'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Beaker,
  Brain,
  ChevronRight,
  FlaskConical,
  Loader2,
  Mail,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { LAB_MODULES } from '@/lib/lab/types';

type Phase = 'landing' | 'submitting' | 'sent' | 'error';

const FEATURES = [
  {
    icon: FlaskConical,
    title: '8 Guided Modules',
    description: 'From auditing your current copy to building a shareable one-pager.',
  },
  {
    icon: Brain,
    title: 'AI Coaching',
    description: 'Contextual feedback that references your specific history, not generic advice.',
  },
  {
    icon: TrendingUp,
    title: 'Score Evolution',
    description: 'Track how your positioning improves over weeks and months.',
  },
  {
    icon: Target,
    title: 'Competitive Pulse',
    description: 'Monitor competitor positioning and get alerted when they sharpen up.',
  },
];

const VALUE_PROPS = [
  'No signup or password — just your email',
  'Return anytime with your magic link',
  'Free forever — it\'s a lead-gen tool, not a product',
];

export default function LabLandingClient() {
  const [phase, setPhase] = useState<Phase>('landing');
  const [email, setEmail] = useState('');
  const [devLink, setDevLink] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check for error param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) {
      setPhase('error');
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim() || phase === 'submitting') return;

      setPhase('submitting');
      try {
        const res = await fetch('/api/lab/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });

        const data = await res.json();
        if (!res.ok) {
          setPhase('error');
          return;
        }

        if (data.devLink) {
          setDevLink(data.devLink);
        }
        setPhase('sent');
      } catch {
        setPhase('error');
      }
    },
    [email, phase]
  );

  return (
    <main className="site-theme marketing-main" id="main-content">
      <div className="min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto pt-32 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Beaker className="w-5 h-5 text-[var(--accent-ruby)]" />
              <span
                className="text-sm tracking-[0.15em] uppercase"
                style={{ color: 'var(--accent-ruby-soft)', fontFamily: 'var(--royal-ui)' }}
              >
                Positioning Lab
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] mb-6"
              style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-primary)' }}
            >
              Positioning isn&apos;t a{' '}
              <span className="italic" style={{ color: 'var(--accent-ruby)' }}>
                one-time task.
              </span>
              <br />
              It&apos;s a living document.
            </h1>

            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--royal-text)' }}
            >
              Build, refine, and stress-test your startup positioning over time.
              Guided exercises, AI coaching, version history, and a shareable one-pager
              when you&apos;re done.
            </p>
          </motion.div>

          {/* Email Capture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <AnimatePresence mode="wait">
              {(phase === 'landing' || phase === 'submitting' || phase === 'error') && (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3"
                >
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: 'var(--text-dim)' }}
                    />
                    <input
                      ref={inputRef}
                      type="email"
                      placeholder="you@startup.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl text-base outline-none transition-all"
                      style={{
                        background: 'var(--bg-elev-2)',
                        border: '1px solid var(--stroke-soft)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--royal-ui)',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={phase === 'submitting'}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold transition-all"
                    style={{
                      background: 'var(--accent-ruby)',
                      color: '#fff',
                      fontFamily: 'var(--royal-ui)',
                      opacity: phase === 'submitting' ? 0.7 : 1,
                    }}
                  >
                    {phase === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending magic link...
                      </>
                    ) : (
                      <>
                        Open My Lab
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {phase === 'error' && (
                    <p className="text-sm" style={{ color: '#ef4444' }}>
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <ul className="flex flex-col gap-1.5 mt-2">
                    {VALUE_PROPS.map((prop) => (
                      <li
                        key={prop}
                        className="flex items-center gap-2 text-sm"
                        style={{ color: 'var(--text-dim)', fontFamily: 'var(--royal-ui)' }}
                      >
                        <Sparkles className="w-3 h-3 shrink-0" style={{ color: 'var(--accent-ruby-soft)' }} />
                        {prop}
                      </li>
                    ))}
                  </ul>
                </motion.form>
              )}

              {phase === 'sent' && (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl p-8 text-center"
                  style={{
                    background: 'var(--bg-elev-1)',
                    border: '1px solid var(--stroke-soft)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(122, 64, 242, 0.15)' }}
                  >
                    <Mail className="w-5 h-5" style={{ color: 'var(--accent-ruby)' }} />
                  </div>
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-primary)' }}
                  >
                    Check your email
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    We sent a magic link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
                    Click it to open your workspace.
                  </p>
                  {devLink && (
                    <a
                      href={devLink}
                      className="inline-flex items-center gap-1 mt-4 text-sm underline"
                      style={{ color: 'var(--accent-ruby-soft)' }}
                    >
                      Dev: Open directly <ChevronRight className="w-3 h-3" />
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="max-w-5xl mx-auto pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="rounded-2xl p-6 transition-all"
                style={{
                  background: 'var(--bg-panel)',
                  border: '1px solid var(--stroke-soft)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <feature.icon
                  className="w-5 h-5 mb-3"
                  style={{ color: 'var(--accent-ruby)' }}
                />
                <h3
                  className="text-lg font-semibold mb-1"
                  style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-primary)' }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Module Preview */}
        <section className="max-w-4xl mx-auto pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2
              className="text-2xl sm:text-3xl font-semibold text-center mb-8"
              style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-primary)' }}
            >
              8 modules. One sharp position.
            </h2>

            <div className="space-y-3">
              {LAB_MODULES.map((mod) => (
                <div
                  key={mod.id}
                  className="flex items-start gap-4 rounded-xl px-5 py-4 transition-all"
                  style={{
                    background: 'var(--bg-elev-1)',
                    border: '1px solid var(--stroke-soft)',
                  }}
                >
                  <span
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold"
                    style={{
                      background: mod.phase === 1 ? 'rgba(122, 64, 242, 0.15)' : 'rgba(255,255,255,0.06)',
                      color: mod.phase === 1 ? 'var(--accent-ruby)' : 'var(--text-dim)',
                      fontFamily: 'var(--royal-ui)',
                    }}
                  >
                    {mod.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <h3
                        className="text-base font-semibold"
                        style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-primary)' }}
                      >
                        {mod.title}
                      </h3>
                      <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
                        {mod.subtitle}
                      </span>
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {mod.description}
                    </p>
                  </div>
                  {mod.phase > 1 && (
                    <span
                      className="shrink-0 text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        color: 'var(--text-dim)',
                      }}
                    >
                      Phase {mod.phase}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-md mx-auto pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <p
              className="text-lg mb-4"
              style={{ fontFamily: 'var(--royal-text)', color: 'var(--text-muted)' }}
            >
              Ready to stop guessing and start positioning?
            </p>
            <button
              onClick={() => {
                inputRef.current?.scrollIntoView({ behavior: 'smooth' });
                inputRef.current?.focus();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold transition-all"
              style={{
                background: 'var(--accent-ruby)',
                color: '#fff',
                fontFamily: 'var(--royal-ui)',
              }}
            >
              <Zap className="w-4 h-4" />
              Start Free
            </button>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
