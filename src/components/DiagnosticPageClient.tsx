'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { track } from '@vercel/analytics/react';
import { ArrowLeft, ArrowUpRight, Check, Copy, Download } from 'lucide-react';
import {
  DIAGNOSTIC_DIMENSIONS,
  DIAGNOSTIC_QUESTIONS,
  RECOMMENDED_ARTICLES,
  STAGE_OPTIONS,
  TEAM_SIZE_OPTIONS,
  TRACTION_OPTIONS,
} from '@/data/diagnostic';
import {
  buildAlignmentBriefMarkdown,
  computeDiagnosticResult,
  type DiagnosticAnswers,
  type DiagnosticProfile,
  type DiagnosticResult,
} from '@/lib/diagnostic';
import { cn, motionDelay } from '@/lib/utils';

const INITIAL_PROFILE: DiagnosticProfile = {
  stage: '',
  teamSize: '',
  traction: '',
};

const SESSION_KEYS = {
  profile: 'diagnostic_profile',
  answers: 'diagnostic_answers',
  hasStarted: 'diagnostic_hasStarted',
} as const;

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
    // no-op: analytics should never block UX
  }
}

export default function DiagnosticPageClient() {
  const [profile, setProfile] = useState<DiagnosticProfile>(() => loadSession(SESSION_KEYS.profile, INITIAL_PROFILE));
  const [answers, setAnswers] = useState<DiagnosticAnswers>(() => loadSession(SESSION_KEYS.answers, {}));
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState('');
  const [hasStarted, setHasStarted] = useState(() => loadSession(SESSION_KEYS.hasStarted, false));
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLElement>(null);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEYS.profile, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEYS.answers, JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEYS.hasStarted, JSON.stringify(hasStarted));
  }, [hasStarted]);

  const groupedQuestions = useMemo(
    () =>
      DIAGNOSTIC_DIMENSIONS.map((dimension) => ({
        ...dimension,
        questions: DIAGNOSTIC_QUESTIONS.filter((question) => question.dimension === dimension.id),
      })),
    [],
  );

  const answeredCount = useMemo(
    () =>
      DIAGNOSTIC_QUESTIONS.reduce(
        (count, question) => count + (typeof answers[question.id] === 'number' ? 1 : 0),
        0,
      ),
    [answers],
  );

  const completion = Math.round((answeredCount / DIAGNOSTIC_QUESTIONS.length) * 100);

  const recommendedResources = useMemo(() => {
    if (!result) return [];

    const uniqueResources = new Map<string, { title: string; href: string; dimension: string }>();
    result.bottlenecks.forEach((dimension) => {
      const resources = RECOMMENDED_ARTICLES[dimension.id] ?? [];
      resources.forEach((resource) => {
        if (!uniqueResources.has(resource.href)) {
          uniqueResources.set(resource.href, {
            ...resource,
            dimension: dimension.label,
          });
        }
      });
    });

    return Array.from(uniqueResources.values()).slice(0, 4);
  }, [result]);

  const handleAnswer = (questionId: string, score: number) => {
    if (!hasStarted) {
      setHasStarted(true);
      safeTrack('diagnostic_started', { entry: 'diagnostic_page' });
    }

    setAnswers((previous) => {
      const wasAnswered = typeof previous[questionId] === 'number';
      const next = { ...previous, [questionId]: score };
      if (!wasAnswered) {
        safeTrack('diagnostic_question_answered', {
          question_id: questionId,
          answered_count: Object.keys(next).length,
        });
      }
      return next;
    });
  };

  const handleGenerateResult = () => {
    const missingProfileFields = ['stage', 'teamSize', 'traction'].filter(
      (key) => !profile[key as keyof DiagnosticProfile],
    );

    if (missingProfileFields.length > 0) {
      setError('Complete stage, team size, and traction before generating your diagnostic.');
      return;
    }

    if (answeredCount < DIAGNOSTIC_QUESTIONS.length) {
      setError('Answer every diagnostic question to generate a complete score.');
      return;
    }

    const nextResult = computeDiagnosticResult({ answers, profile });
    setResult(nextResult);
    setError('');
    setCopied(false);

    Object.values(SESSION_KEYS).forEach((key) => sessionStorage.removeItem(key));

    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    safeTrack('diagnostic_completed', {
      score: nextResult.overallScore,
      unweighted_score: nextResult.unweightedScore,
      tier: nextResult.tier.id,
      bottleneck_primary: nextResult.bottlenecks[0]?.id ?? 'none',
      stage: profile.stage,
    });
  };

  const handleDownloadBrief = () => {
    if (!result) return;

    const markdown = buildAlignmentBriefMarkdown(result, {
      stageOptions: STAGE_OPTIONS,
      teamSizeOptions: TEAM_SIZE_OPTIONS,
      tractionOptions: TRACTION_OPTIONS,
    });

    const file = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const href = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = `gtm-alignment-brief-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(href);

    safeTrack('diagnostic_brief_downloaded', {
      score: result.overallScore,
      tier: result.tier.id,
    });
  };

  const handleCopyBrief = async () => {
    if (!result) return;

    const markdown = buildAlignmentBriefMarkdown(result, {
      stageOptions: STAGE_OPTIONS,
      teamSizeOptions: TEAM_SIZE_OPTIONS,
      tractionOptions: TRACTION_OPTIONS,
    });

    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      safeTrack('diagnostic_brief_copied', {
        score: result.overallScore,
        tier: result.tier.id,
      });
    } catch {
      setCopied(false);
    }
  };

  const resetDiagnostic = useCallback(() => {
    setProfile(INITIAL_PROFILE);
    setAnswers({});
    setResult(null);
    setError('');
    setHasStarted(false);
    setCopied(false);
    Object.values(SESSION_KEYS).forEach((key) => sessionStorage.removeItem(key));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    safeTrack('diagnostic_reset');
  }, []);

  const bookHref = result
    ? `/book?source=diagnostic&score=${result.overallScore}&tier=${encodeURIComponent(result.tier.id)}`
    : '/book?source=diagnostic';

  return (
    <main id="main-content" className="page-enter marketing-main site-theme pt-20" data-section-theme="diagnostic">
      <section className="command-section page-gutter section-block" data-section-theme="diagnostic-hero">
        <div className="mx-auto w-full max-w-5xl">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            data-motion="rise"
            style={motionDelay(60)}
          >
            <ArrowLeft size={14} />
            Back home
          </Link>

          <p className="command-label mb-3" data-motion="rise" style={motionDelay(100)}>
            GTM Diagnostic
          </p>

          <h1 className="home-heading-xl max-w-4xl" data-motion="rise" style={motionDelay(160)}>
            Diagnose your AI startup&apos;s go-to-market system in 10 minutes.
          </h1>

          <p
            className="mt-5 max-w-3xl text-[var(--text-muted)]"
            data-motion="rise"
            style={motionDelay(220)}
          >
            Get a scored GTM assessment, top bottlenecks, and a 90-day execution brief designed for
            founder, product, and revenue alignment.
          </p>

          <div className="mt-8 rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.03)] p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-[var(--text-muted)]">Assessment progress</p>
              <p className="text-sm text-[var(--text-primary)]">{completion}%</p>
            </div>
            <div className="mt-3 h-2 rounded-full bg-[rgba(255,255,255,0.12)]">
              <div
                className="h-full rounded-full bg-[var(--accent-gold-soft)] transition-all duration-300"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          <p className="mt-4 text-sm text-[var(--text-dim)]">
            Stage-aware scoring: early-stage teams are weighted more on positioning and ICP, while growth-stage teams are weighted more on conversion and operating cadence.
          </p>
        </div>
      </section>

      <section className="command-section page-gutter section-block" data-section-theme="diagnostic-profile">
        <div className="mx-auto grid w-full max-w-5xl gap-5 md:grid-cols-3">
          <label className="flex flex-col gap-2">
            <span className="text-site-kicker text-[var(--text-dim)]">Stage</span>
            <select
              className="booking-select rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--text-primary)]"
              value={profile.stage}
              onChange={(event) => setProfile((previous) => ({ ...previous, stage: event.target.value }))}
            >
              <option value="">Select stage</option>
              {STAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-site-kicker text-[var(--text-dim)]">Team Size</span>
            <select
              className="booking-select rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--text-primary)]"
              value={profile.teamSize}
              onChange={(event) => setProfile((previous) => ({ ...previous, teamSize: event.target.value }))}
            >
              <option value="">Select team size</option>
              {TEAM_SIZE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-site-kicker text-[var(--text-dim)]">Traction</span>
            <select
              className="booking-select rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--text-primary)]"
              value={profile.traction}
              onChange={(event) => setProfile((previous) => ({ ...previous, traction: event.target.value }))}
            >
              <option value="">Select traction stage</option>
              {TRACTION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

        </div>
      </section>

      <section className="command-section page-gutter section-block" data-section-theme="diagnostic-assessment">
        <div className="mx-auto w-full max-w-5xl space-y-10">
          {groupedQuestions.map((group, groupIndex) => (
            <article
              key={group.id}
              className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-6"
              data-motion="rise"
              style={motionDelay(280 + groupIndex * 70)}
            >
              <p className="command-label mb-4">{group.label}</p>
              <p className="mb-5 text-sm text-[var(--text-muted)]">{group.description}</p>

              <div className="space-y-6">
                {group.questions.map((question) => {
                  const selected = answers[question.id];
                  return (
                    <fieldset key={question.id} className="space-y-3">
                      <legend className="text-[0.98rem] leading-relaxed text-[var(--text-primary)]">
                        {question.prompt}
                      </legend>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {question.options.map((option) => (
                          <button
                            key={option.label}
                            type="button"
                            onClick={() => handleAnswer(question.id, option.score)}
                            className={cn(
                              'rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                              selected === option.score
                                ? 'border-[rgba(255,255,255,0.62)] bg-[rgba(255,255,255,0.13)] text-[var(--text-primary)]'
                                : 'border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] text-[var(--text-muted)] hover:border-[rgba(255,255,255,0.4)]',
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            </article>
          ))}

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="accent-btn" onClick={handleGenerateResult}>
              Generate diagnostic
              <ArrowUpRight size={15} />
            </button>
            <span className="text-xs text-[var(--text-dim)]">
              {answeredCount}/{DIAGNOSTIC_QUESTIONS.length} questions answered
            </span>
          </div>
        </div>
      </section>

      {result ? (
        <section ref={resultRef} className="command-section page-gutter pb-24 md:pb-28" data-section-theme="diagnostic-result">
          <div className="mx-auto w-full max-w-5xl space-y-8">
            <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.03)] p-6">
              <p className="command-label">Diagnostic Result</p>
              <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-3">
                <p className="text-[clamp(2.2rem,7vw,4rem)] leading-none text-[var(--text-primary)]">
                  {result.overallScore}
                  <span className="ml-2 text-base text-[var(--text-dim)]">/100</span>
                </p>
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-[var(--text-dim)]">{result.tier.label}</p>
                  <p className="mt-1 max-w-2xl text-[var(--text-muted)]">{result.tier.summary}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-[var(--text-muted)]">
                Unweighted baseline score: {result.unweightedScore}/100. Weighted score is calibrated to your selected stage ({result.stageKey.replace('_', ' ')}).
              </p>
            </article>

            <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-6">
              <p className="command-label mb-3">{result.allAboveTarget ? 'Stage Performance' : 'Stage Benchmark'}</p>
              <p className="text-[var(--text-primary)]">{result.stageBenchmark}</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{result.stageFocus}</p>
              {!result.allAboveTarget && (
                <ul className="mt-4 space-y-2 text-sm text-[var(--text-dim)]">
                  {result.failureModes.map((mode) => (
                    <li key={mode}>{mode}</li>
                  ))}
                </ul>
              )}
            </article>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {result.dimensions.map((dimension) => (
                <article
                  key={dimension.id}
                  className="rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-4"
                >
                  <p className="text-site-kicker text-[var(--text-dim)]">{dimension.label}</p>
                  <p className="mt-2 text-2xl text-[var(--text-primary)]">{dimension.percentage}%</p>
                  <p className="mt-1 text-xs text-[var(--text-dim)]">
                    Target {dimension.target}% · Gap {dimension.gap > 0 ? `-${dimension.gap}%` : `+${Math.abs(dimension.gap)}%`}
                  </p>
                </article>
              ))}
            </div>

            <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-6">
              <p className="command-label mb-4">{result.allAboveTarget ? 'Optimization Opportunities' : 'Priority Actions (Next 30 Days)'}</p>
              <ul className="space-y-3 text-[var(--text-muted)]">
                {result.priorityActions.map((action) => (
                  <li key={action} className="leading-relaxed">
                    {action}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-6">
              <p className="command-label mb-4">This Week: Owner-Assigned Actions</p>
              <div className="grid gap-4 md:grid-cols-3">
                {result.thisWeekActions.map((item) => (
                  <div key={item.title} className="rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-4">
                    <p className="text-sm text-[var(--text-primary)]">{item.title}</p>
                    <p className="mt-2 text-xs text-[var(--text-dim)]">
                      Owner: {item.owner} · Impact: {item.impact}
                    </p>
                    <p className="mt-3 text-sm text-[var(--text-muted)]">{item.action}</p>
                    <p className="mt-3 text-xs text-[var(--text-dim)]">Signal: {item.leadingIndicator}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-6">
              <p className="command-label mb-4">90-Day Execution Plan</p>
              <div className="space-y-6">
                {result.ninetyDayPlan.map((phase) => (
                  <div key={phase.phase} className="border-l border-[var(--stroke-soft)] pl-4">
                    <p className="text-sm text-[var(--text-dim)]">
                      {phase.phase} · {phase.window}
                    </p>
                    <p className="mt-1 text-[var(--text-primary)]">{phase.objective}</p>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--text-muted)]">
                      {phase.actions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-6">
              <p className="command-label mb-4">KPI Scoreboard To Install</p>
              <div className="space-y-3">
                {result.kpiPack.map((kpi) => (
                  <div key={kpi.metric} className="rounded-lg border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-3">
                    <p className="text-sm text-[var(--text-primary)]">{kpi.metric}</p>
                    <p className="mt-1 text-xs text-[var(--text-dim)]">
                      Target: {kpi.target} · Cadence: {kpi.cadence} · Owner: {kpi.owner}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-6">
              <p className="command-label mb-4">Weekly GTM Cadence</p>
              <div className="space-y-3">
                {result.operatingCadence.map((block) => (
                  <div key={block.day} className="rounded-lg border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-3">
                    <p className="text-sm text-[var(--text-primary)]">
                      {block.day} · {block.ritual}
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-dim)]">{block.outcome}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-6">
              <p className="command-label mb-4">Leadership Alignment Checklist</p>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                {result.alignmentChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            {recommendedResources.length > 0 ? (
              <article className="rounded-2xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.02)] p-6">
                <p className="command-label mb-4">Recommended Reading</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {recommendedResources.map((resource) => (
                    <Link
                      key={resource.href}
                      href={resource.href}
                      className="rounded-lg border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.03)] p-4 transition-colors hover:border-[rgba(255,255,255,0.48)]"
                    >
                      <p className="text-site-kicker text-[var(--text-dim)]">{resource.dimension}</p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
                        {resource.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </article>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="ghost-btn" onClick={resetDiagnostic}>
                <ArrowLeft size={15} />
                Start over
              </button>

              <button type="button" className="ghost-btn" onClick={handleDownloadBrief}>
                <Download size={15} />
                Download alignment brief
              </button>

              <button type="button" className="ghost-btn" onClick={handleCopyBrief}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? 'Brief copied' : 'Copy brief'}
              </button>

              <Link
                href={bookHref}
                className="accent-btn"
                onClick={() =>
                  safeTrack('diagnostic_book_click', {
                    score: result.overallScore,
                    tier: result.tier.id,
                  })
                }
              >
                Book a GTM strategy call
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
