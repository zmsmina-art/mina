'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type SyntheticEvent } from 'react';
import { track } from '@vercel/analytics/react';
import { ArrowLeft, ArrowUpRight, Check, Copy, Flame, Loader2 } from 'lucide-react';
import { decodeRoast, encodeRoast, type RoastResult } from '@/lib/roast';

type Phase = 'form' | 'analyzing' | 'result';

const SHARE_BASE_URL = 'https://minamankarious.com/roast';
const ANALYSIS_STEPS = [
  'Reading your homepage copy...',
  'Detecting positioning cliches...',
  'Scoring clarity, specificity, and differentiation...',
  'Preparing your improvement plan...',
];
const SOCIAL_PROOF_LINE = '1,000+ founders already got roasted and lived to tell the tale.';
const FORM_BENEFITS = [
  'Brutal scorecard in seconds',
  '3-5 clear fixes you can ship today',
  'Shareable result link for X and LinkedIn',
];
const GENERIC_BLOB_VARIANTS = [
  'Generic Blob',
  'Category Oatmeal',
  'Buzzword Soup',
  'Vague by Design',
  'Copycat Copy',
  'Blended In',
  'Positioning Beige',
  'Safe and Forgettable',
  'Corporate Plain Toast',
  'Too Broad to Stick',
  'Everyone and No One',
  'Same as the Rest',
  'Vanilla Positioning',
  'All Noise No Edge',
  'Commodity Copy',
  'Buzzword Blanket',
  'Middle of the Pack',
  'Nothing to Own',
  'Signal Too Faint',
  'Template Level Messaging',
  'Generic SaaS Fog',
  'Category Echo',
  'Broad and Blurry',
  'Differentiation Missing',
  'Promise Without Proof',
  'Positioning by Committee',
  'Copy With No Teeth',
  'Safe but Soft',
  'Beige Value Prop',
  'Familiar to a Fault',
  'Same Song New Logo',
  'Sounds Like Everyone',
  'All Category No Claim',
  'Forgettable Framing',
  'Low Contrast Messaging',
  'No Sharp Angle',
  'Generic Market Chatter',
  'Mild Positioning Energy',
  'Blunt Instrument Copy',
  'No Defensible Wedge',
  'Positioning in Soft Focus',
  'Big Words Thin Meaning',
  'Polished but Interchangeable',
  'Category Filler Copy',
  'All Platform No Point',
  'Undercooked Positioning',
  'Generic Pitch Deck Voice',
  'Blends Into the Feed',
  'Same Promise Different Skin',
  'Crowd Noise Messaging',
];

function safeTrack(name: string, properties?: Record<string, string | number | boolean>) {
  try {
    track(name, properties);
  } catch {
    // analytics should never block UX
  }
}

function normalizeInputUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return 'var(--accent-purple-soft)';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

function verdictTone(verdict: string): string {
  if (verdict === 'Positioning Weapon' || verdict === 'Clear Contender') return 'text-[#22c55e]';
  if (verdict === 'Promising but Fuzzy' || verdict === 'Generic Blob') return 'text-[var(--accent-purple-soft)]';
  // Backward compatibility for previously shared labels.
  if (verdict === 'Category Flame' || verdict === 'Crispy Clean') return 'text-[#22c55e]';
  if (verdict === 'Almost There' || verdict === 'Needs Seasoning') return 'text-[var(--accent-purple-soft)]';
  return 'text-[#ef4444]';
}

function splitTips(value: string): string[] {
  return value
    .split('~')
    .map((tip) => tip.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  return hash;
}

function displayVerdict(verdict: string, seed: string): string {
  if (verdict !== 'Generic Blob') return verdict;
  const index = Math.abs(hashSeed(seed)) % GENERIC_BLOB_VARIANTS.length;
  return GENERIC_BLOB_VARIANTS[index] ?? verdict;
}

export default function RoastPageClient({ sharedParam }: { sharedParam: string | null }) {
  const [url, setUrl] = useState('');
  const [phase, setPhase] = useState<Phase>('form');
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState<RoastResult | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLElement>(null);
  const analyzeRef = useRef<HTMLElement>(null);

  const shared = useMemo(() => {
    if (!sharedParam) return null;
    return decodeRoast(sharedParam);
  }, [sharedParam]);

  useEffect(() => {
    safeTrack('roast_viewed', { shared: !!shared });
  }, [shared]);

  useEffect(() => {
    if (phase !== 'analyzing') {
      setStepIndex(0);
      return;
    }

    const timer = window.setInterval(() => {
      setStepIndex((prev) => (prev + 1) % ANALYSIS_STEPS.length);
    }, 780);

    return () => window.clearInterval(timer);
  }, [phase]);

  const shareUrl = useMemo(() => {
    if (!result) return SHARE_BASE_URL;
    const encoded = encodeRoast(result);
    if (!encoded) return SHARE_BASE_URL;
    return `${SHARE_BASE_URL}?r=${encodeURIComponent(encoded)}`;
  }, [result]);

  const smartCta = useMemo(() => {
    if (!result) return null;
    const bookHref = `/book?source=roast&score=${result.score}&verdict=${encodeURIComponent(result.verdict)}`;
    if (result.score < 65) {
      return {
        href: bookHref,
        label: 'Book a positioning call',
        helper: 'Your messaging is leaking trust. Rebuild the angle before your next pitch.',
        secondaryHref: '/positioning-grader?source=roast',
        secondaryLabel: 'Run the headline grader',
      };
    }

    return {
      href: bookHref,
      label: 'Book a positioning call',
      helper: 'You survived the roast. Want to go from good to category-defining?',
      secondaryHref: '/positioning-grader?source=roast',
      secondaryLabel: 'Run the headline grader',
    };
  }, [result]);

  const resultVerdict = useMemo(() => {
    if (!result) return '';
    return displayVerdict(result.verdict, `${result.domain}|${result.score}|${result.roastLine}`);
  }, [result]);

  const reset = useCallback(() => {
    setUrl('');
    setPhase('form');
    setError('');
    setResult(null);
    setCopied(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    safeTrack('roast_reset');
  }, []);

  const handleSubmit = useCallback(async () => {
    const normalized = normalizeInputUrl(url);
    if (!normalized) {
      setError('Enter a startup URL to roast.');
      return;
    }

    try {
      // client-side sanity check before API
      new URL(normalized);
    } catch {
      setError('Enter a valid URL (example: https://acme.com).');
      return;
    }

    setError('');
    setPhase('analyzing');
    safeTrack('roast_submitted');

    requestAnimationFrame(() => {
      analyzeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    try {
      const minDelay = new Promise((resolve) => setTimeout(resolve, 2100));

      const [response] = await Promise.all([
        fetch('/api/roast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: normalized }),
        }),
        minDelay,
      ]);

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const apiError = typeof payload?.error === 'string' ? payload.error : 'Could not roast this URL.';
        throw new Error(apiError);
      }

      const nextResult = payload as RoastResult;
      setResult(nextResult);
      setPhase('result');
      setCopied(false);

      requestAnimationFrame(() => {
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
      });

      safeTrack('roast_completed', {
        score: nextResult.score,
        grade: nextResult.grade.letter,
        verdict: nextResult.verdict,
        domain: nextResult.domain,
        source: nextResult.source,
      });
    } catch (submitError) {
      setPhase('form');
      setError(submitError instanceof Error ? submitError.message : 'Could not roast this URL.');
    }
  }, [url]);

  const handleCopyShare = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      safeTrack('roast_share_clicked', { channel: 'copy', score: result.score, verdict: result.verdict });
    } catch {
      setCopied(false);
    }
  }, [result, shareUrl]);

  const handleShareX = useCallback(() => {
    if (!result) return;
    const text = `I got ${result.score}/100 (${result.verdict}) on Roast My Startup. ${result.roastLine}`;
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(intentUrl, '_blank', 'noopener,noreferrer,width=560,height=520');
    safeTrack('roast_share_clicked', { channel: 'x', score: result.score, verdict: result.verdict });
  }, [result, shareUrl]);

  const handleShareLinkedIn = useCallback(() => {
    if (!result) return;
    const intentUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(intentUrl, '_blank', 'noopener,noreferrer,width=760,height=620');
    safeTrack('roast_share_clicked', { channel: 'linkedin', score: result.score, verdict: result.verdict });
  }, [result, shareUrl]);

  if (shared && !result) {
    const tips = splitTips(shared.p);
    const sharedVerdict = displayVerdict(shared.v, `${shared.d}|${shared.s}|${shared.r}`);
    return (
      <main id="main-content" className="page-enter marketing-main site-theme pt-20" data-static-motion="true">
        <section className="command-section page-gutter section-block">
          <div className="mx-auto w-full max-w-4xl">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={14} />
              Back home
            </Link>

            <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.03)] p-6 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="command-label mb-2">Public Roast Scorecard</p>
                  <p
                    className="text-[clamp(2.9rem,10vw,5rem)] leading-none"
                    style={{ color: scoreColor(shared.s), fontFamily: 'var(--font-cormorant)' }}
                  >
                    {shared.s}
                    <span className="ml-2 text-base text-[var(--text-dim)]">/100</span>
                  </p>
                  <p className={`mt-2 text-sm uppercase tracking-[0.14em] ${verdictTone(shared.v)}`}>{sharedVerdict}</p>
                  <p className="mt-1 text-xs text-[var(--text-dim)]">{shared.d}</p>
                </div>
                <p className="text-xs text-[var(--text-dim)]">minamankarious.com/roast</p>
              </div>

              <p className="mt-4 text-lg italic leading-relaxed text-[var(--text-primary)]">&ldquo;{shared.r}&rdquo;</p>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-4">
                  <p className="text-site-kicker text-[var(--text-dim)]">Headline judged</p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">{shared.h}</p>
                </div>
                <div className="rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-4">
                  <p className="text-site-kicker text-[var(--text-dim)]">Description judged</p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">{shared.m}</p>
                </div>
              </div>

              {tips.length > 0 && (
                <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-[var(--text-muted)]">
                  {tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ol>
              )}
            </article>

            <div className="mt-6 text-center">
              <Link
                href="/roast"
                className="accent-btn"
                onClick={() => safeTrack('roast_share_run_clicked', { source: 'shared_result' })}
              >
                Roast your own startup
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="page-enter marketing-main site-theme pt-20" data-static-motion="true">
      <section className="command-section page-gutter pt-8 pb-6 md:pt-12 md:pb-8" data-section-theme="roast-hero">
        <div className="mx-auto w-full max-w-4xl">
          <Link
            href="/"
            className="mb-8 flex w-fit items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
            Back home
          </Link>

          <p className="command-label mb-2">Roast My Startup</p>
          <h1 className="home-heading-xl max-w-3xl">
            Get your startup roasted.
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--text-muted)]">
            Paste your URL. Get a funny positioning roast, a shareable scorecard, and practical fixes.
          </p>
        </div>
      </section>

      {phase === 'form' && (
        <section className="command-section page-gutter pt-4 pb-12 md:pt-6 md:pb-14" data-section-theme="roast-form">
          <div className="mx-auto w-full max-w-4xl space-y-4">
            <div className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.03)] p-5 sm:p-6">
              <label className="flex flex-col gap-2">
                <span className="text-site-kicker text-[var(--text-dim)]">Startup URL</span>
                <input
                  type="url"
                  value={url}
                  onChange={(event) => {
                    setUrl(event.target.value);
                    setError('');
                  }}
                  placeholder="https://yourstartup.com"
                  className="rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] transition-colors focus:border-[rgba(255,255,255,0.4)] focus:outline-none"
                />
              </label>

              <p className="mt-2 text-xs text-[var(--text-dim)]">
                Yes, we read your homepage. No, generic messaging is not a moat.
              </p>

              {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button type="button" className="accent-btn" onClick={handleSubmit}>
                  Get your startup roasted
                  <Flame size={15} />
                </button>

                <p className="text-xs text-[var(--text-dim)]">
                  Every roast generates a unique scorecard link you can share.
                </p>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {FORM_BENEFITS.map((benefit) => (
                  <div
                    key={benefit}
                    className="rounded-lg border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-xs text-[var(--text-muted)]"
                  >
                    {benefit}
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-[var(--text-dim)]">
                <Link href="/articles/why-i-built-a-startup-roaster" className="underline decoration-[var(--text-dim)] underline-offset-2 transition-colors hover:text-[var(--text-muted)]">
                  Read the story behind the roaster
                </Link>
              </p>
            </div>
          </div>
        </section>
      )}

      {phase === 'analyzing' && (
        <section ref={analyzeRef} className="command-section page-gutter pb-14">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] py-14 text-center">
            <Loader2 size={26} className="animate-spin text-[var(--accent-purple-soft)]" />
            <p className="mt-4 text-sm uppercase tracking-[0.16em] text-[var(--text-dim)]">Analyzing your copy</p>
            <p className="mt-2 text-base italic text-[var(--text-primary)]">{ANALYSIS_STEPS[stepIndex]}</p>
          </div>
        </section>
      )}

      {phase === 'result' && result && smartCta && (
        <section ref={resultRef} className="command-section page-gutter pb-20 md:pb-24" data-section-theme="roast-result">
          <div className="mx-auto w-full max-w-4xl space-y-6">

            {/* ── THE ROAST — hero moment ── */}
            <article className="roast-hero-card relative overflow-hidden rounded-2xl border border-[var(--stroke-soft)] p-8 sm:p-10 text-center">
              <div className="roast-hero-glow" aria-hidden="true" />

              <p className="roast-hero-domain relative text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">
                {result.domain}
              </p>
              <p
                className="roast-hero-line relative mt-6 text-[clamp(2.5rem,7vw,4rem)] font-bold leading-tight text-white"
                style={{ fontFamily: 'var(--font-cormorant, Cormorant Garamond, Georgia, serif)' }}
              >
                {result.roastLine}
              </p>

              <div className="roast-hero-footer mt-8">
                <div className="roast-hero-scoregroup">
                  <p
                    className="roast-hero-score text-[clamp(2.8rem,9vw,4.5rem)] leading-none"
                    style={{ color: scoreColor(result.score), fontFamily: 'var(--font-cormorant)' }}
                  >
                    {result.score}
                  </p>
                  <p className="text-base text-[var(--text-dim)]">/100</p>
                  <p className={`roast-hero-verdict ml-2 text-sm uppercase tracking-[0.12em] ${verdictTone(result.verdict)}`}>{resultVerdict}</p>
                </div>

                <img
                  src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(result.domain)}&sz=64`}
                  alt=""
                  width={32}
                  height={32}
                  className="roast-hero-favicon opacity-0 transition-opacity duration-300"
                  onLoad={(e: SyntheticEvent<HTMLImageElement>) => {
                    const img = e.currentTarget;
                    // Google returns a 16x16 default globe for missing favicons;
                    // naturalWidth > 16 means we got a real icon.
                    if (img.naturalWidth > 16) {
                      img.classList.replace('opacity-0', 'opacity-60');
                    }
                  }}
                  onError={(e: SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

            </article>

            {/* ── Share — just a copy button ── */}
            <div className="flex justify-center">
              <button type="button" className="accent-btn whitespace-nowrap" onClick={handleCopyShare}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Link copied!' : 'Copy scorecard link'}
              </button>
            </div>

            {/* ── THE VALUE — analysis & fixes ── */}
            <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-6 sm:p-8">
              <h2 className="text-lg text-[var(--text-primary)]">OK but seriously &mdash; here&apos;s how to fix it</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {result.analysis?.summary || 'Tighten your positioning with clearer audience language, stronger differentiation, and explicit outcomes.'}
              </p>

              {result.analysis?.dimensions?.length ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {result.analysis.dimensions.map((dimension) => (
                    <div
                      key={dimension.id}
                      className="rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-4"
                    >
                      <p className="text-site-kicker text-[var(--text-dim)]">{dimension.label}</p>
                      <p className="mt-2 text-2xl" style={{ color: scoreColor(dimension.score), fontFamily: 'var(--font-cormorant)' }}>
                        {dimension.score}
                        <span className="ml-1 text-xs text-[var(--text-dim)]">/100</span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}

              <ol className="mt-5 space-y-3 pl-0 text-sm leading-relaxed text-[var(--text-muted)]">
                {result.tips.map((tip, i) => (
                  <li key={tip} className="flex gap-3">
                    <span
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs"
                      style={{ background: 'rgba(122, 64, 242, 0.15)', color: 'var(--accent-purple-soft)' }}
                    >
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{tip}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-4">
                  <p className="text-site-kicker text-[var(--text-dim)]">Headline judged</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{result.judged.headline}</p>
                </div>
                <div className="rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-4">
                  <p className="text-site-kicker text-[var(--text-dim)]">Description judged</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{result.judged.description}</p>
                </div>
              </div>

              {(result.improvedHeadline || result.improvedMetaDescription) ? (
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.06)] p-4">
                    <p className="text-site-kicker text-[var(--text-dim)]">Improved headline</p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
                      {result.improvedHeadline}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.06)] p-4">
                    <p className="text-site-kicker text-[var(--text-dim)]">Improved meta description</p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
                      {result.improvedMetaDescription}
                    </p>
                  </div>
                </div>
              ) : null}
            </article>

            {/* ── CTA ── */}
            <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-6 text-center">
              <p className="text-base text-[var(--text-primary)]">{smartCta.helper}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Link href={smartCta.href} className="accent-btn">
                  {smartCta.label}
                  <ArrowUpRight size={15} />
                </Link>
                {smartCta.secondaryHref && (
                  <Link href={smartCta.secondaryHref} className="ghost-btn px-4 py-2 text-sm">
                    {smartCta.secondaryLabel}
                    <ArrowUpRight size={14} />
                  </Link>
                )}
                <button type="button" className="ghost-btn px-4 py-2 text-sm" onClick={reset}>
                  Roast another startup
                </button>
              </div>
            </article>

            {/* ── Newsletter Capture ── */}
            <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-6">
              <p className="text-site-kicker text-[var(--text-dim)]">Stay sharp</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Weekly positioning breakdowns, roast recaps, and frameworks for AI startup founders.</p>
              <form
                className="mt-4 flex gap-2"
                onSubmit={async (e: SyntheticEvent) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const emailInput = form.elements.namedItem('nl_email') as HTMLInputElement;
                  const email = emailInput?.value?.trim();
                  if (!email) return;
                  try {
                    const res = await fetch('/api/newsletter/subscribe', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email, tag: 'roast-tool' }),
                    });
                    if (res.ok) {
                      track('newsletter_subscribe', { source: 'roast-result' });
                      emailInput.value = '';
                      emailInput.placeholder = 'You\u2019re in!';
                    }
                  } catch { /* silent */ }
                }}
              >
                <input
                  name="nl_email"
                  type="email"
                  required
                  placeholder="you@startup.com"
                  className="flex-1 rounded-lg border border-[var(--stroke-soft)] bg-transparent px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:border-[rgba(255,255,255,0.2)] focus:outline-none"
                />
                <button type="submit" className="accent-btn whitespace-nowrap text-sm">Subscribe</button>
              </form>
            </article>

            {/* ── Go Deeper ── */}
            <Link
              href="/articles/why-i-built-a-startup-roaster"
              className="flex items-center justify-between rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-5 transition-colors hover:border-[rgba(255,255,255,0.15)]"
            >
              <div>
                <p className="text-site-kicker text-[var(--text-dim)]">Go Deeper</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Learn the positioning framework behind every roast.</p>
              </div>
              <ArrowUpRight size={16} className="flex-shrink-0 text-[var(--text-dim)]" />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
