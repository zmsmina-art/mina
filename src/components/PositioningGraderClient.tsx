'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { track } from '@vercel/analytics/react';
import { ArrowLeft, ArrowUpRight, Check, ChevronDown, Copy, Loader2, Pencil, RefreshCw } from 'lucide-react';
import {
  FAQ_ITEMS,
  POSITIONING_DIMENSIONS,
  REWRITE_TEMPLATES,
} from '@/data/positioning-grader';
import {
  compareResults,
  compareWithCompetitor,
  computePositioningResult,
  decodeResult,
  encodeResult,
  getSmartCTA,
  validateInput,
  type ComparisonResult,
  type CompetitorResult,
  type EncodedResult,
  type PositioningResult,
} from '@/lib/positioning-grader';
import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';
import { cn, motionDelay } from '@/lib/utils';

// ── Types ────────────────────────────────────────────────────────────

type FormInput = {
  startupName: string;
  headline: string;
  oneLiner: string;
  targetAudience: string;
};

type Phase = 'form' | 'analyzing' | 'result';

export type PersonaOverrides = {
  heading?: string;
  subheading?: string;
  placeholders?: {
    startupName?: string;
    targetAudience?: string;
    headline?: string;
    oneLiner?: string;
  };
  backLink?: { href: string; text: string };
};

// ── Constants ────────────────────────────────────────────────────────

const INITIAL_INPUT: FormInput = {
  startupName: '',
  headline: '',
  oneLiner: '',
  targetAudience: '',
};

const SESSION_KEY = 'positioning_grader_input';
const ANALYZE_DURATION_MS = 1600;
const STAGGER = 100;

// ── Helpers ──────────────────────────────────────────────────────────

function loadSession<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeTrack(name: string, properties?: Record<string, string | number | boolean>) {
  try {
    track(name, properties);
  } catch {
    // no-op
  }
}

function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return 'var(--accent-purple-soft)';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

function gradeColor(letter: string): string {
  if (letter.startsWith('A')) return '#22c55e';
  if (letter.startsWith('B')) return 'var(--accent-purple-soft)';
  if (letter.startsWith('C')) return '#f59e0b';
  return '#ef4444';
}

// ── Animated Score Bar ───────────────────────────────────────────────

function AnimatedBar({ score, delay = 0 }: { score: number; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), delay + 50);
    return () => clearTimeout(t);
  }, [score, delay]);

  return (
    <div className="relative h-1.5 flex-1 rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: `${width}%`,
          background: scoreColor(score),
          transition: `width 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        }}
      />
    </div>
  );
}

// ── Animated Counter ─────────────────────────────────────────────────

function Counter({ target, duration = 900, delay = 0 }: { target: number; duration?: number; delay?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return <>{value}</>;
}

// ── Reveal Wrapper ───────────────────────────────────────────────────

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0,0,0)' : 'translate3d(0,18px,0)',
        transition: 'opacity 450ms cubic-bezier(0.22,1,0.36,1), transform 450ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {children}
    </div>
  );
}

// ── Mini Grade Card (used in comparisons) ────────────────────────────

function MiniGradeCard({ result, label }: { result: PositioningResult; label: string }) {
  return (
    <div className="rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-4 text-center">
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-dim)]">{label}</p>
      <p className="mt-1 text-[clamp(2rem,6vw,3rem)] font-semibold leading-none" style={{ color: gradeColor(result.grade.letter), fontFamily: 'var(--font-cormorant)' }}>
        {result.grade.letter}
      </p>
      <p className="mt-1 text-lg text-[var(--text-primary)]">
        {result.overallScore}<span className="ml-0.5 text-xs text-[var(--text-dim)]">/100</span>
      </p>
      <p className="mt-1 text-xs italic text-[var(--text-muted)] line-clamp-2">&ldquo;{result.input.headline}&rdquo;</p>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────

export default function PositioningGraderClient({ sharedParam, personaOverrides }: { sharedParam: string | null; personaOverrides?: PersonaOverrides }) {
  const [input, setInput] = useState<FormInput>(() => loadSession(SESSION_KEY, INITIAL_INPUT));
  const [result, setResult] = useState<PositioningResult | null>(null);
  const [phase, setPhase] = useState<Phase>('form');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const resultRef = useRef<HTMLElement>(null);
  const analyzeRef = useRef<HTMLElement>(null);

  // Rewrite mode state
  const [rewriteMode, setRewriteMode] = useState(false);
  const [rewriteHeadline, setRewriteHeadline] = useState('');
  const [rewriteError, setRewriteError] = useState('');
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);

  // Competitor comparison state
  const [competitorOpen, setCompetitorOpen] = useState(false);
  const [competitorName, setCompetitorName] = useState('');
  const [competitorHeadline, setCompetitorHeadline] = useState('');
  const [competitorError, setCompetitorError] = useState('');
  const [competitorResult, setCompetitorResult] = useState<CompetitorResult | null>(null);

  // Loading states for API calls
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [competitorLoading, setCompetitorLoading] = useState(false);

  // Email capture
  const { email: nlEmail, state: nlState, errorMsg: nlError, handleEmailChange: nlHandleEmail, submit: nlSubmit } =
    useNewsletterSubscribe('positioning-grader');

  const sharedResult = useMemo<EncodedResult | null>(() => {
    if (!sharedParam) return null;
    return decodeResult(sharedParam);
  }, [sharedParam]);

  const sharedDimensions = useMemo(() => {
    if (!sharedResult?.d) return null;
    const dims: Record<string, number> = {};
    sharedResult.d.split(',').forEach((pair) => {
      const [key, val] = pair.split(':');
      if (key && val) dims[key] = parseInt(val, 10);
    });
    return dims;
  }, [sharedResult]);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(input));
  }, [input]);

  useEffect(() => {
    safeTrack('positioning_grader_viewed', { shared: !!sharedParam });
  }, [sharedParam]);

  const smartCTA = useMemo(() => {
    if (!result) return null;
    return getSmartCTA(result.overallScore);
  }, [result]);

  // Track smart CTA shown
  useEffect(() => {
    if (smartCTA && result) {
      safeTrack('positioning_grader_smart_cta_shown', { cta_id: smartCTA.id, grade: result.grade.letter, score: result.overallScore });
    }
  }, [smartCTA, result]);

  const updateField = useCallback((field: keyof FormInput, value: string) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!input.startupName.trim()) { setError('Enter your startup name.'); return; }
    if (!input.headline.trim()) { setError('Enter your headline or tagline.'); return; }

    const validationError = validateInput({ headline: input.headline.trim(), startupName: input.startupName.trim() });
    if (validationError) { setError(validationError); return; }

    setError('');
    safeTrack('positioning_grader_submitted');
    setPhase('analyzing');

    requestAnimationFrame(() => {
      analyzeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    const trimmedInput = {
      startupName: input.startupName.trim(),
      headline: input.headline.trim(),
      oneLiner: input.oneLiner.trim(),
      targetAudience: input.targetAudience.trim(),
    };

    const minDelay = new Promise((r) => setTimeout(r, ANALYZE_DURATION_MS));

    let nextResult: PositioningResult;
    try {
      const [res] = await Promise.all([
        fetch('/api/positioning-grader', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trimmedInput),
        }),
        minDelay,
      ]);
      if (!res.ok) throw new Error(`API ${res.status}`);
      nextResult = await res.json() as PositioningResult;
    } catch {
      await minDelay;
      nextResult = computePositioningResult(trimmedInput);
    }

    setResult(nextResult);
    setPhase('result');
    setCopied(false);
    sessionStorage.removeItem(SESSION_KEY);

    requestAnimationFrame(() => {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    });

    safeTrack('positioning_grader_completed', {
      score: nextResult.overallScore,
      grade: nextResult.grade.letter,
      tier: nextResult.grade.name,
    });
  }, [input]);

  const handleReset = useCallback(() => {
    setInput(INITIAL_INPUT);
    setResult(null);
    setPhase('form');
    setError('');
    setCopied(false);
    setRewriteMode(false);
    setRewriteHeadline('');
    setRewriteError('');
    setComparison(null);
    setCompetitorOpen(false);
    setCompetitorName('');
    setCompetitorHeadline('');
    setCompetitorError('');
    setCompetitorResult(null);
    sessionStorage.removeItem(SESSION_KEY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    safeTrack('positioning_grader_reset');
  }, []);

  const shareUrl = useMemo(() => {
    if (!result) return '';
    return `https://minamankarious.com/positioning-grader?r=${encodeResult(result)}`;
  }, [result]);

  const handleShareX = useCallback(() => {
    if (!result) return;
    const text = `My startup positioning just got graded: ${result.grade.letter} (${result.overallScore}/100) — better than ${result.percentile}% of AI startup headlines\n\nGrade yours free:\n${shareUrl}\n\n@olmnix`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    safeTrack('positioning_grader_shared_x', { grade: result.grade.letter });
  }, [result, shareUrl]);

  const handleShareLinkedIn = useCallback(() => {
    if (!result) return;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    safeTrack('positioning_grader_shared_linkedin', { grade: result.grade.letter });
  }, [result, shareUrl]);

  const handleCopyLink = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      safeTrack('positioning_grader_shared_copy');
    } catch { setCopied(false); }
  }, [shareUrl]);

  // ── Rewrite handlers ──────────────────────────────────────────────

  const handleOpenRewrite = useCallback(() => {
    if (!result) return;
    setRewriteMode(true);
    setRewriteHeadline(result.input.headline);
    setRewriteError('');
    setComparison(null);
    safeTrack('positioning_grader_rewrite_opened');
  }, [result]);

  const handleRewriteScore = useCallback(async () => {
    if (!result || !rewriteHeadline.trim()) return;

    const validationError = validateInput({ headline: rewriteHeadline.trim(), startupName: result.input.startupName });
    if (validationError) { setRewriteError(validationError); return; }

    setRewriteError('');
    setRewriteLoading(true);

    const rewriteInput = {
      startupName: result.input.startupName,
      headline: rewriteHeadline.trim(),
      oneLiner: result.input.oneLiner,
      targetAudience: result.input.targetAudience,
    };

    let rewriteResult: PositioningResult;
    try {
      const res = await fetch('/api/positioning-grader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rewriteInput),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      rewriteResult = await res.json() as PositioningResult;
    } catch {
      rewriteResult = computePositioningResult(rewriteInput);
    }

    const comp = compareResults(result, rewriteResult);
    setComparison(comp);
    setRewriteLoading(false);

    safeTrack('positioning_grader_rewrite_compared', {
      original_score: result.overallScore,
      rewrite_score: rewriteResult.overallScore,
      delta: comp.overallDelta,
      improved: comp.overallDelta > 0,
    });
  }, [result, rewriteHeadline]);

  // ── Competitor handlers ───────────────────────────────────────────

  const handleCompetitorCompare = useCallback(async () => {
    if (!result || !competitorName.trim() || !competitorHeadline.trim()) return;

    const validationError = validateInput({ headline: competitorHeadline.trim(), startupName: competitorName.trim() });
    if (validationError) { setCompetitorError(validationError); return; }

    setCompetitorError('');
    setCompetitorLoading(true);

    const compInput = {
      startupName: competitorName.trim(),
      headline: competitorHeadline.trim(),
      oneLiner: '',
      targetAudience: '',
    };

    let compResult: PositioningResult;
    try {
      const res = await fetch('/api/positioning-grader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compInput),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      compResult = await res.json() as PositioningResult;
    } catch {
      compResult = computePositioningResult(compInput);
    }

    const comp = compareWithCompetitor(result, compResult);
    setCompetitorResult(comp);
    setCompetitorLoading(false);

    safeTrack('positioning_grader_competitor_compared', {
      user_score: result.overallScore,
      competitor_score: compResult.overallScore,
      winner: result.overallScore > compResult.overallScore ? 'user' : result.overallScore < compResult.overallScore ? 'competitor' : 'tie',
    });
  }, [result, competitorName, competitorHeadline]);

  // ── Email capture handler ─────────────────────────────────────────

  const handleEmailSubmit = useCallback((e: React.FormEvent) => {
    if (result) {
      safeTrack('positioning_grader_email_captured', { grade: result.grade.letter, score: result.overallScore });
    }
    nlSubmit(e);
  }, [result, nlSubmit]);

  const bookHref = result
    ? `/book?source=positioning-grader&score=${result.overallScore}&grade=${encodeURIComponent(result.grade.letter)}`
    : '/book?source=positioning-grader';

  // ── Shared View ────────────────────────────────────────────────────

  if (sharedResult && !result) {
    return (
      <main id="main-content" className="page-enter marketing-main site-theme pt-20">
        <section className="command-section page-gutter pt-8 pb-6 md:pt-12 md:pb-8">
          <div className="mx-auto w-full max-w-3xl">
            <Link
              href={personaOverrides?.backLink?.href ?? '/'}
              className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              data-motion="rise"
              style={motionDelay(60)}
            >
              <ArrowLeft size={14} />
              {personaOverrides?.backLink?.text ?? 'Back home'}
            </Link>

            <article
              className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.03)] p-6 text-center sm:p-8"
              data-motion="rise"
              style={motionDelay(140)}
            >
              <p className="command-label mb-1">Positioning Grade</p>
              <p className="text-[clamp(3.5rem,10vw,6rem)] font-semibold leading-none" style={{ color: gradeColor(sharedResult.g), fontFamily: 'var(--font-cormorant)' }}>
                {sharedResult.g}
              </p>
              <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[var(--accent-purple-soft)]">{sharedResult.t}</p>
              <p className="mt-1 text-xl text-[var(--text-primary)]">{sharedResult.s}<span className="ml-1 text-sm text-[var(--text-dim)]">/100</span></p>
              <p className="mt-3 text-base italic text-[var(--text-muted)]">&ldquo;{sharedResult.h}&rdquo;</p>
              <p className="mt-1 text-sm text-[var(--text-dim)]">{sharedResult.n}</p>

              {sharedDimensions && (
                <div className="mx-auto mt-5 grid max-w-sm gap-2">
                  {POSITIONING_DIMENSIONS.map((dim, i) => {
                    const score = sharedDimensions[dim.id] ?? 0;
                    return (
                      <div key={dim.id} className="flex items-center gap-3">
                        <span className="w-24 text-right text-xs text-[var(--text-dim)]">{dim.label}</span>
                        <AnimatedBar score={score} delay={300 + i * 80} />
                        <span className="w-7 text-xs text-[var(--text-muted)]">{score}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="mt-4 text-xs text-[var(--text-dim)]">minamankarious.com/positioning-grader</p>
            </article>

            <div className="mt-6 text-center" data-motion="rise" style={motionDelay(240)}>
              <Link href="/positioning-grader" className="accent-btn">
                Grade your own headline
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </section>
        <SEOContent openFaq={openFaq} setOpenFaq={setOpenFaq} />
      </main>
    );
  }

  // ── Main View ──────────────────────────────────────────────────────

  return (
    <main id="main-content" className="page-enter marketing-main site-theme pt-20">
      {/* Hero */}
      <section className="command-section page-gutter pt-8 pb-6 md:pt-12 md:pb-8" data-section-theme="positioning-hero">
        <div className="mx-auto w-full max-w-3xl">
          <Link
            href={personaOverrides?.backLink?.href ?? '/'}
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            data-motion="rise"
            style={motionDelay(60)}
          >
            <ArrowLeft size={14} />
            {personaOverrides?.backLink?.text ?? 'Back home'}
          </Link>

          <p className="command-label mb-2" data-motion="rise" style={motionDelay(100)}>
            Positioning Grader
          </p>

          <h1 className="home-heading-xl max-w-3xl" data-motion="rise" style={motionDelay(160)}>
            {personaOverrides?.heading ?? 'Grade your AI startup\u2019s positioning in seconds.'}
          </h1>

          <p className="mt-3 max-w-2xl text-[var(--text-muted)]" data-motion="rise" style={motionDelay(220)}>
            {personaOverrides?.subheading ?? 'Paste your headline and get a scored assessment across clarity, specificity, differentiation, brevity, and value clarity.'}
          </p>
        </div>
      </section>

      {/* Input Form */}
      {phase === 'form' && (
        <section className="command-section page-gutter pt-4 pb-10 md:pt-6 md:pb-14" data-section-theme="positioning-form">
          <div className="mx-auto w-full max-w-3xl space-y-4" data-motion="rise" style={motionDelay(280)}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-site-kicker text-[var(--text-dim)]">Startup Name *</span>
                <input
                  type="text"
                  value={input.startupName}
                  onChange={(e) => updateField('startupName', e.target.value)}
                  placeholder={personaOverrides?.placeholders?.startupName ?? 'e.g. Acme AI'}
                  className="rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] transition-colors focus:border-[rgba(255,255,255,0.4)] focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-site-kicker text-[var(--text-dim)]">Target Audience</span>
                <input
                  type="text"
                  value={input.targetAudience}
                  onChange={(e) => updateField('targetAudience', e.target.value)}
                  placeholder={personaOverrides?.placeholders?.targetAudience ?? 'e.g. Series A SaaS founders'}
                  className="rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] transition-colors focus:border-[rgba(255,255,255,0.4)] focus:outline-none"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-site-kicker text-[var(--text-dim)]">Headline / Tagline *</span>
              <textarea
                value={input.headline}
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder={personaOverrides?.placeholders?.headline ?? 'e.g. AI-powered analytics for modern teams'}
                rows={2}
                className="rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] transition-colors focus:border-[rgba(255,255,255,0.4)] focus:outline-none resize-none"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-site-kicker text-[var(--text-dim)]">One-Liner Description</span>
              <textarea
                value={input.oneLiner}
                onChange={(e) => updateField('oneLiner', e.target.value)}
                placeholder={personaOverrides?.placeholders?.oneLiner ?? 'e.g. We help SaaS founders close deals faster by auto-generating personalized proposals.'}
                rows={2}
                className="rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] transition-colors focus:border-[rgba(255,255,255,0.4)] focus:outline-none resize-none"
              />
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button type="button" className="accent-btn" onClick={handleSubmit}>
              Grade my positioning
              <ArrowUpRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* Analyzing Animation */}
      {phase === 'analyzing' && (
        <section ref={analyzeRef} className="command-section page-gutter pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center py-12">
            {/* Spinning ring */}
            <div className="relative mb-6 h-20 w-20">
              <div
                className="absolute inset-0 rounded-full border-2 border-[var(--accent-purple)]"
                style={{ animation: 'pg-spin 1.2s cubic-bezier(0.22,1,0.36,1) infinite', borderTopColor: 'transparent', borderRightColor: 'transparent' }}
              />
              <div className="absolute inset-3 rounded-full bg-[rgba(122,64,242,0.12)]" style={{ animation: 'pg-pulse 1.2s ease-in-out infinite' }} />
              <div className="absolute inset-6 rounded-full bg-[rgba(122,64,242,0.22)]" style={{ animation: 'pg-pulse 1.2s ease-in-out infinite 0.2s' }} />
            </div>

            <p className="text-sm uppercase tracking-[0.14em] text-[var(--accent-purple-soft)]" style={{ animation: 'pg-in 400ms ease forwards' }}>
              Analyzing positioning
            </p>

            <p className="mt-3 max-w-md text-center text-sm italic text-[var(--text-muted)]" style={{ animation: 'pg-in 400ms ease 200ms forwards', opacity: 0 }}>
              &ldquo;{input.headline}&rdquo;
            </p>

            <div className="mt-4 space-y-1.5">
              {POSITIONING_DIMENSIONS.map((dim, i) => (
                <div key={dim.id} className="flex items-center gap-2 text-xs text-[var(--text-dim)]" style={{ animation: `pg-in 300ms ease ${300 + i * 180}ms forwards`, opacity: 0 }}>
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-purple)]" style={{ animation: `pg-pulse 0.8s ease-in-out ${400 + i * 180}ms infinite` }} />
                  Scoring {dim.label.toLowerCase()}...
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes pg-spin { to { transform: rotate(360deg); } }
            @keyframes pg-pulse { 0%,100% { opacity:.4; transform:scale(.92); } 50% { opacity:1; transform:scale(1.08); } }
            @keyframes pg-in { to { opacity:1; } }
          `}</style>
        </section>
      )}

      {/* Results */}
      {phase === 'result' && result && (
        <section ref={resultRef} className="command-section page-gutter pb-20 md:pb-24" data-section-theme="positioning-result">
          <div className="mx-auto w-full max-w-3xl space-y-6">

            {/* 1. Grade Card (with benchmark percentile) */}
            <Reveal delay={0}>
              <article className="relative overflow-hidden rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.03)] p-6 text-center sm:p-8">
                <p className="command-label mb-1">Positioning Grade</p>

                <p className="text-[clamp(3.5rem,10vw,6rem)] font-semibold leading-none" style={{ color: gradeColor(result.grade.letter), fontFamily: 'var(--font-cormorant)', animation: 'pg-pop 550ms cubic-bezier(0.16,1,0.3,1) 200ms both' }}>
                  {result.grade.letter}
                </p>

                <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[var(--accent-purple-soft)]" style={{ animation: 'pg-in 350ms ease 380ms both', opacity: 0 }}>
                  {result.grade.name}
                </p>

                <p className="mt-1 text-xl text-[var(--text-primary)]" style={{ animation: 'pg-in 350ms ease 460ms both', opacity: 0 }}>
                  <Counter target={result.overallScore} duration={900} delay={460} />
                  <span className="ml-1 text-sm text-[var(--text-dim)]">/100</span>
                </p>

                <p className="mt-3 text-base italic text-[var(--text-muted)]" style={{ animation: 'pg-in 350ms ease 520ms both', opacity: 0 }}>
                  &ldquo;{result.input.headline}&rdquo;
                </p>

                <div className="mx-auto mt-5 grid max-w-sm gap-2">
                  {result.dimensions.map((dim, i) => (
                    <div key={dim.id} className="flex items-center gap-3" style={{ animation: `pg-in 250ms ease ${660 + i * 70}ms both`, opacity: 0 }}>
                      <span className="w-24 text-right text-xs text-[var(--text-dim)]">{dim.label}</span>
                      <AnimatedBar score={dim.score} delay={740 + i * 100} />
                      <span className="w-7 text-xs text-[var(--text-muted)]">{dim.score}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-sm text-[var(--text-muted)]" style={{ animation: 'pg-in 350ms ease 1040ms both', opacity: 0 }}>
                  {result.grade.summary}
                </p>
                <p className="mt-4 text-xs text-[var(--text-dim)]">minamankarious.com/positioning-grader</p>
              </article>
            </Reveal>

            {/* 2. Share */}
            <Reveal delay={STAGGER * 2}>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button type="button" className="accent-btn" onClick={handleShareX}>Share on X<ArrowUpRight size={15} /></button>
                <button type="button" className="ghost-btn px-4 py-2 text-sm" onClick={handleShareLinkedIn}>LinkedIn</button>
                <button type="button" className="ghost-btn px-4 py-2 text-sm" onClick={handleCopyLink}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy link'}
                </button>
              </div>
            </Reveal>

            {/* 3. Dimension Breakdown */}
            <Reveal delay={STAGGER * 3}>
              <div className="space-y-3">
                <p className="command-label">Dimension Breakdown</p>
                {result.dimensions.map((dim, i) => (
                  <Reveal key={dim.id} delay={STAGGER * 3 + (i + 1) * 80}>
                    <article className="rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{dim.label}</p>
                        <p className="text-base" style={{ color: scoreColor(dim.score) }}>
                          <Counter target={dim.score} duration={700} delay={STAGGER * 3 + (i + 1) * 80 + 150} />
                          <span className="ml-0.5 text-xs text-[var(--text-dim)]">/100</span>
                        </p>
                      </div>
                      <div className="mt-1.5">
                        <AnimatedBar score={dim.score} delay={STAGGER * 3 + (i + 1) * 80 + 80} />
                      </div>
                      <p className="mt-2 text-sm leading-snug text-[var(--text-muted)]">{dim.feedback}</p>
                      {dim.suggestion && <p className="mt-1.5 text-sm leading-snug text-[var(--accent-purple-soft)]">{dim.suggestion}</p>}
                    </article>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            {/* 4. Red Flags */}
            {result.redFlags.length > 0 && (
              <Reveal delay={STAGGER * 9}>
                <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-5">
                  <p className="command-label mb-3">Red Flags Detected</p>
                  <div className="space-y-2">
                    {result.redFlags.map((flag, i) => (
                      <div key={i} className="flex gap-2.5 text-sm" style={{ animation: `pg-in 250ms ease ${i * 50}ms both`, opacity: 0 }}>
                        <span className={cn(
                          'mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-xs',
                          flag.category === 'buzzword' && 'bg-red-500/20 text-red-400',
                          flag.category === 'vague' && 'bg-amber-500/20 text-amber-400',
                          flag.category === 'self_referential' && 'bg-purple-500/20 text-purple-300',
                        )}>
                          {flag.category === 'buzzword' ? 'Buzzword' : flag.category === 'vague' ? 'Vague' : 'Self-ref'}
                        </span>
                        <div className="leading-snug">
                          <span className="text-[var(--text-primary)]">&ldquo;{flag.phrase}&rdquo;</span>
                          <span className="ml-1.5 text-[var(--text-dim)]">{flag.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              </Reveal>
            )}

            {/* 5. Quick Wins */}
            <Reveal delay={STAGGER * 10}>
              <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-5">
                <p className="command-label mb-3">Quick Wins</p>
                <ol className="list-decimal space-y-2 pl-5 text-sm leading-snug text-[var(--text-muted)]">
                  {result.quickWins.map((win, i) => <li key={i}>{win}</li>)}
                </ol>
              </article>
            </Reveal>

            {/* 6. Rewrite Templates */}
            <Reveal delay={STAGGER * 11}>
              <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-5">
                <p className="command-label mb-3">Rewrite Templates</p>
                <div className="space-y-3">
                  {REWRITE_TEMPLATES.map((tmpl, i) => (
                    <div key={i} className="rounded-lg border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-3">
                      <p className="text-xs uppercase tracking-wider text-[var(--accent-purple-soft)]">{tmpl.label}</p>
                      <p className="mt-1.5 text-sm text-[var(--text-primary)]">{result.rewrites[i]}</p>
                      <p className="mt-1 text-xs text-[var(--text-dim)]">Example: {tmpl.example}</p>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>

            {/* 7. Competitor Comparison (collapsible) */}
            <Reveal delay={STAGGER * 12}>
              <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)]">
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                  onClick={() => {
                    const willOpen = !competitorOpen;
                    setCompetitorOpen(willOpen);
                    if (willOpen) safeTrack('positioning_grader_competitor_opened');
                  }}
                >
                  <p className="command-label">Compare with a competitor</p>
                  <ChevronDown size={16} className={cn('shrink-0 text-[var(--text-dim)] transition-transform duration-200', competitorOpen && 'rotate-180')} />
                </button>
                <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: competitorOpen ? '800px' : '0px', opacity: competitorOpen ? 1 : 0 }}>
                  <div className="space-y-4 px-5 pb-5">
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="flex flex-col gap-1.5">
                        <span className="text-site-kicker text-[var(--text-dim)]">Competitor Name</span>
                        <input
                          type="text"
                          value={competitorName}
                          onChange={(e) => { setCompetitorName(e.target.value); setCompetitorError(''); }}
                          placeholder="e.g. Rival AI"
                          className="rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] transition-colors focus:border-[rgba(255,255,255,0.4)] focus:outline-none"
                        />
                      </label>
                      <label className="flex flex-col gap-1.5">
                        <span className="text-site-kicker text-[var(--text-dim)]">Competitor Headline</span>
                        <input
                          type="text"
                          value={competitorHeadline}
                          onChange={(e) => { setCompetitorHeadline(e.target.value); setCompetitorError(''); }}
                          placeholder="e.g. AI-powered automation for teams"
                          className="rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] transition-colors focus:border-[rgba(255,255,255,0.4)] focus:outline-none"
                        />
                      </label>
                    </div>
                    {competitorError && <p className="text-sm text-red-400">{competitorError}</p>}
                    <button
                      type="button"
                      className="ghost-btn px-4 py-2 text-sm"
                      onClick={handleCompetitorCompare}
                      disabled={!competitorName.trim() || !competitorHeadline.trim() || competitorLoading}
                    >
                      {competitorLoading && <Loader2 size={14} className="animate-spin" />}
                      Compare
                    </button>

                    {competitorResult && (
                      <div className="space-y-4 pt-2">
                        <div className="grid gap-3 md:grid-cols-2">
                          <MiniGradeCard result={competitorResult.user} label="You" />
                          <MiniGradeCard result={competitorResult.competitor} label={competitorName || 'Competitor'} />
                        </div>

                        {/* Per-dimension bar comparison */}
                        <div className="space-y-2">
                          {result.dimensions.map((userDim, i) => {
                            const compDim = competitorResult.competitor.dimensions[i];
                            return (
                              <div key={userDim.id} className="space-y-1">
                                <div className="flex items-center justify-between text-xs text-[var(--text-dim)]">
                                  <span>{userDim.label}</span>
                                  <span>{userDim.score} vs {compDim.score}</span>
                                </div>
                                <div className="flex gap-1">
                                  <div className="h-1.5 flex-1 rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${userDim.score}%`, background: scoreColor(userDim.score), transition: 'width 500ms ease' }} />
                                  </div>
                                  <div className="h-1.5 flex-1 rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${compDim.score}%`, background: scoreColor(compDim.score), transition: 'width 500ms ease' }} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Win/loss summary */}
                        <div className="space-y-1.5 text-sm">
                          {competitorResult.userWins.length > 0 && (
                            <p className="text-[#22c55e]">You win on: {competitorResult.userWins.join(', ')}</p>
                          )}
                          {competitorResult.competitorWins.length > 0 && (
                            <p className="text-[#ef4444]">They beat you on: {competitorResult.competitorWins.join(', ')}</p>
                          )}
                          {competitorResult.ties.length > 0 && (
                            <p className="text-[var(--text-dim)]">Tied on: {competitorResult.ties.join(', ')}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>

            {/* 8. Email My Report (soft gate) */}
            <Reveal delay={STAGGER * 13}>
              <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.03)] p-5">
                {nlState === 'success' ? (
                  <div className="flex items-center gap-3 text-center">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.28)] bg-[rgba(255,255,255,0.08)]">
                      <Check size={14} className="text-[#22c55e]" />
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">Check your inbox — and welcome to the newsletter.</p>
                  </div>
                ) : (
                  <>
                    <p className="command-label mb-1">Get your full report emailed to you</p>
                    <p className="mb-3 text-sm text-[var(--text-muted)]">We&apos;ll send your results plus actionable positioning tips. You&apos;ll also join the newsletter (unsubscribe anytime).</p>
                    <form onSubmit={handleEmailSubmit} className="flex gap-2.5">
                      <input
                        type="email"
                        value={nlEmail}
                        onChange={(e) => nlHandleEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        disabled={nlState === 'loading'}
                        className="min-w-0 flex-1 rounded-lg border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.05)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] transition-colors focus:border-[rgba(255,255,255,0.4)] focus:outline-none disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={nlState === 'loading' || !nlEmail.trim()}
                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.12)] px-4 py-2.5 text-sm tracking-[0.04em] text-[var(--text-primary)] transition-all hover:border-[var(--accent-gold-soft)] hover:bg-[rgba(255,255,255,0.22)] disabled:pointer-events-none disabled:opacity-40"
                      >
                        {nlState === 'loading' ? <Loader2 size={14} className="animate-spin" /> : 'Email my report'}
                      </button>
                    </form>
                    {nlState === 'error' && nlError && (
                      <p className="mt-2 text-xs text-red-400/90">{nlError}</p>
                    )}
                  </>
                )}
              </article>
            </Reveal>

            {/* 9. Smart CTA (dynamic) */}
            {smartCTA && (
              <Reveal delay={STAGGER * 14}>
                <article className="rounded-2xl border p-6 text-center" style={{ borderColor: smartCTA.borderColor, backgroundColor: `color-mix(in srgb, ${smartCTA.borderColor} 8%, transparent)` }}>
                  <p className="text-base text-[var(--text-primary)]">{smartCTA.headline}</p>
                  <p className="mt-1.5 text-sm text-[var(--text-muted)]">{smartCTA.subtext}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    {smartCTA.primaryAction === 'share' ? (
                      <>
                        <button type="button" className="accent-btn" onClick={handleShareX}>
                          Share on X
                          <ArrowUpRight size={15} />
                        </button>
                        <Link href={bookHref} className="ghost-btn px-4 py-2 text-sm" onClick={() => safeTrack('positioning_grader_book_click', { grade: result.grade.letter, score: result.overallScore })}>
                          Book a call
                          <ArrowUpRight size={15} />
                        </Link>
                      </>
                    ) : (
                      <Link href={bookHref} className="accent-btn inline-flex" onClick={() => safeTrack('positioning_grader_book_click', { grade: result.grade.letter, score: result.overallScore })}>
                        Book a positioning call
                        <ArrowUpRight size={15} />
                      </Link>
                    )}
                  </div>
                </article>
              </Reveal>
            )}

            {/* 10. Reset + Try a Rewrite */}
            <Reveal delay={STAGGER * 15}>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button type="button" className="ghost-btn px-4 py-2 text-sm" onClick={handleReset}>
                  <RefreshCw size={14} />
                  Grade another headline
                </button>
                {!rewriteMode && (
                  <button type="button" className="ghost-btn px-4 py-2 text-sm" onClick={handleOpenRewrite}>
                    <Pencil size={14} />
                    Try a rewrite
                  </button>
                )}
              </div>
            </Reveal>

            {/* Rewrite Mode (inline editor + comparison) */}
            {rewriteMode && (
              <Reveal delay={0}>
                <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.03)] p-5 space-y-4">
                  <p className="command-label">Rewrite &amp; Re-score</p>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-site-kicker text-[var(--text-dim)]">Your rewritten headline</span>
                    <textarea
                      value={rewriteHeadline}
                      onChange={(e) => { setRewriteHeadline(e.target.value); setRewriteError(''); }}
                      rows={2}
                      className="rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] transition-colors focus:border-[rgba(255,255,255,0.4)] focus:outline-none resize-none"
                    />
                  </label>
                  {rewriteError && <p className="text-sm text-red-400">{rewriteError}</p>}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="accent-btn"
                      onClick={handleRewriteScore}
                      disabled={!rewriteHeadline.trim() || rewriteLoading}
                    >
                      {rewriteLoading && <Loader2 size={14} className="animate-spin" />}
                      Re-score
                    </button>
                    <button
                      type="button"
                      className="ghost-btn px-4 py-2 text-sm"
                      onClick={() => { setRewriteMode(false); setComparison(null); }}
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Comparison view */}
                  {comparison && (
                    <div className="space-y-4 pt-2">
                      <div className="grid gap-3 md:grid-cols-2">
                        <MiniGradeCard result={comparison.original} label="Original" />
                        <MiniGradeCard result={comparison.rewrite} label="Rewrite" />
                      </div>

                      {/* Overall delta */}
                      <div className="text-center">
                        <span className={cn(
                          'inline-block rounded-full px-4 py-1.5 text-lg font-semibold',
                          comparison.overallDelta > 0 && 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]',
                          comparison.overallDelta < 0 && 'bg-[rgba(239,68,68,0.15)] text-[#ef4444]',
                          comparison.overallDelta === 0 && 'bg-[rgba(255,255,255,0.08)] text-[var(--text-muted)]',
                        )}>
                          {comparison.overallDelta > 0 ? '+' : ''}{comparison.overallDelta} points
                        </span>
                      </div>

                      {/* Per-dimension deltas */}
                      <div className="space-y-1.5">
                        {comparison.dimensionDeltas.map((dd) => (
                          <div key={dd.id} className="flex items-center justify-between text-sm">
                            <span className="text-[var(--text-dim)]">{dd.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[var(--text-muted)]">{dd.originalScore} &rarr; {dd.rewriteScore}</span>
                              {dd.delta !== 0 && (
                                <span className={dd.delta > 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                                  {dd.delta > 0 ? '\u2191' : '\u2193'}{Math.abs(dd.delta)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              </Reveal>
            )}
          </div>

          <style>{`
            @keyframes pg-pop { 0% { opacity:0; transform:scale(0.3); } 60% { opacity:1; transform:scale(1.06); } 100% { opacity:1; transform:scale(1); } }
            @keyframes pg-in { to { opacity:1; } }
          `}</style>
        </section>
      )}

      {/* SEO + FAQ */}
      <SEOContent openFaq={openFaq} setOpenFaq={setOpenFaq} />
    </main>
  );
}

// ── SEO Content ──────────────────────────────────────────────────────

function SEOContent({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (i: number | null) => void }) {
  return (
    <>
      <section className="command-section page-gutter pt-10 pb-6 md:pt-14 md:pb-8">
        <div className="mx-auto w-full max-w-3xl" data-motion="rise" style={motionDelay(100)}>
          <h2 className="home-heading-lg mb-4">What is AI startup positioning?</h2>
          <div className="space-y-3 text-sm text-[var(--text-muted)] leading-relaxed">
            <p>
              Positioning is the strategic act of defining how your startup occupies a unique, valuable space in your buyer&apos;s mind. For AI startups, this is especially critical because the market is flooded with companies claiming to be &ldquo;AI-powered&rdquo; — making it nearly impossible for buyers to distinguish one from another.
            </p>
            <p>
              Strong positioning answers three questions instantly: <em>What do you do?</em> <em>Who is it for?</em> and <em>Why should I care?</em> When your headline nails all three, buyers self-select in seconds. When it doesn&apos;t, you lose them to a competitor who communicates more clearly.
            </p>
            <p>
              This free positioning grader analyzes your headline across five evidence-based dimensions — clarity, specificity, differentiation, brevity, and value clarity — and returns an instant scored assessment with actionable suggestions. Your headline is analyzed by AI (Gemini 2.0 Flash) for personalized feedback. No data is stored, no signup required.
            </p>
          </div>
        </div>
      </section>

      <section className="command-section page-gutter pt-6 pb-10 md:pt-8 md:pb-14">
        <div className="mx-auto w-full max-w-3xl" data-motion="rise" style={motionDelay(100)}>
          <h2 className="home-heading-lg mb-4">Frequently asked questions</h2>
          <div className="divide-y divide-[var(--stroke-soft)]">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-4 text-left text-[var(--text-primary)] transition-colors hover:text-[var(--accent-purple-soft)]"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="pr-4 text-sm font-medium">{item.question}</span>
                  <ChevronDown size={16} className={cn('shrink-0 text-[var(--text-dim)] transition-transform duration-200', openFaq === i && 'rotate-180')} />
                </button>
                <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: openFaq === i ? '280px' : '0px', opacity: openFaq === i ? 1 : 0 }}>
                  <p className="pb-4 text-sm leading-relaxed text-[var(--text-muted)]">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
