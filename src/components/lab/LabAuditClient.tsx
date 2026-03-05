'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flame,
  Globe,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import type { AuditResult } from '@/lib/lab/types';
import type { RoastResult } from '@/lib/roast';

type Phase = 'form' | 'analyzing' | 'result';

const ANALYSIS_STEPS = [
  'Scraping your homepage...',
  'Reading the copy...',
  'Detecting positioning cliches...',
  'Scoring clarity and differentiation...',
  'Preparing your roast...',
];

function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return 'var(--accent-ruby-soft)';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

type Props = {
  workspaceId: string;
  existingAudit: AuditResult | null;
};

export default function LabAuditClient({ workspaceId, existingAudit }: Props) {
  const [url, setUrl] = useState('');
  const [phase, setPhase] = useState<Phase>(existingAudit ? 'result' : 'form');
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');
  const [audit, setAudit] = useState<AuditResult | null>(existingAudit);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!existingAudit);
  const resultRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (phase !== 'analyzing') return;
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % ANALYSIS_STEPS.length);
    }, 780);
    return () => clearInterval(timer);
  }, [phase]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const normalized = normalizeUrl(url);
      if (!normalized) {
        setError('Enter a startup URL to audit.');
        return;
      }

      try {
        new URL(normalized);
      } catch {
        setError('Enter a valid URL (example: https://acme.com).');
        return;
      }

      setError('');
      setPhase('analyzing');
      setSaved(false);

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
          throw new Error(
            typeof payload?.error === 'string' ? payload.error : 'Could not analyze this URL.'
          );
        }

        const roast = payload as RoastResult;

        // Map RoastResult → AuditResult
        const auditResult: AuditResult = {
          completedAt: new Date().toISOString(),
          url: normalized,
          domain: roast.domain,
          score: roast.score,
          grade: roast.grade.letter ?? roast.grade,
          verdict: roast.verdict,
          roastLine: roast.roastLine,
          tips: roast.tips,
          dimensions: roast.analysis?.dimensions ?? [],
          improvedHeadline: roast.improvedHeadline,
          improvedMetaDescription: roast.improvedMetaDescription,
          judgedHeadline: roast.judged.headline,
          judgedDescription: roast.judged.description,
        };

        setAudit(auditResult);
        setPhase('result');
        requestAnimationFrame(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      } catch (err) {
        setPhase('form');
        setError(err instanceof Error ? err.message : 'Could not analyze this URL.');
      }
    },
    [url]
  );

  const handleSave = useCallback(async () => {
    if (!audit || saving) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/lab/${workspaceId}/module/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(audit),
      });

      if (res.ok) {
        setSaved(true);
      }
    } catch {
      // silent fail
    } finally {
      setSaving(false);
    }
  }, [audit, workspaceId, saving]);

  const handleRerun = useCallback(() => {
    setPhase('form');
    setAudit(null);
    setSaved(false);
    setUrl('');
  }, []);

  return (
    <main className="site-theme marketing-main" id="main-content">
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto pt-28">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Link
              href={`/lab/${workspaceId}`}
              className="flex items-center gap-1 text-sm transition-opacity hover:opacity-80"
              style={{ color: 'var(--text-dim)', fontFamily: 'var(--royal-ui)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold"
                style={{ background: 'rgba(122, 64, 242, 0.15)', color: 'var(--accent-ruby)' }}
              >
                1
              </span>
              <h1
                className="text-3xl font-semibold"
                style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-primary)' }}
              >
                The Audit
              </h1>
            </div>
            <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
              Paste your startup URL for a brutal analysis of your current positioning.
            </p>
          </motion.div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {phase === 'form' && (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="relative">
                  <Globe
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: 'var(--text-dim)' }}
                  />
                  <input
                    type="url"
                    placeholder="https://your-startup.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-base outline-none transition-all"
                    style={{
                      background: 'var(--bg-elev-2)',
                      border: '1px solid var(--stroke-soft)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--royal-ui)',
                    }}
                  />
                </div>

                {error && (
                  <p className="text-sm" style={{ color: '#ef4444' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold transition-all"
                  style={{
                    background: 'var(--accent-ruby)',
                    color: '#fff',
                    fontFamily: 'var(--royal-ui)',
                  }}
                >
                  <Flame className="w-4 h-4" />
                  Audit My Positioning
                </button>
              </motion.form>
            )}

            {phase === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-16"
              >
                <Loader2
                  className="w-8 h-8 animate-spin mb-4"
                  style={{ color: 'var(--accent-ruby)' }}
                />
                <p className="text-base" style={{ color: 'var(--text-muted)' }}>
                  {ANALYSIS_STEPS[stepIndex]}
                </p>
              </motion.div>
            )}

            {phase === 'result' && audit && (
              <motion.section
                key="result"
                ref={resultRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Score card */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--stroke-soft)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5" style={{ color: scoreColor(audit.score) }} />
                      <span className="text-sm" style={{ color: 'var(--text-dim)' }}>
                        {audit.domain}
                      </span>
                    </div>
                    <span
                      className="text-sm font-semibold px-2 py-0.5 rounded-md"
                      style={{
                        background: `${scoreColor(audit.score)}20`,
                        color: scoreColor(audit.score),
                      }}
                    >
                      {audit.grade}
                    </span>
                  </div>

                  <div className="flex items-end gap-3 mb-3">
                    <span
                      className="text-5xl font-semibold tabular-nums"
                      style={{
                        fontFamily: 'var(--royal-display)',
                        color: scoreColor(audit.score),
                      }}
                    >
                      {audit.score}
                    </span>
                    <span
                      className="text-xl pb-1"
                      style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-dim)' }}
                    >
                      /100
                    </span>
                  </div>

                  <p
                    className="text-lg font-semibold mb-2"
                    style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-primary)' }}
                  >
                    {audit.verdict}
                  </p>

                  <p
                    className="text-base italic leading-relaxed"
                    style={{ fontFamily: 'var(--royal-text)', color: 'var(--accent-ruby-soft)' }}
                  >
                    &ldquo;{audit.roastLine}&rdquo;
                  </p>
                </div>

                {/* What we judged */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: 'var(--bg-elev-1)',
                    border: '1px solid var(--stroke-soft)',
                  }}
                >
                  <h3
                    className="text-sm tracking-[0.1em] uppercase mb-3"
                    style={{ color: 'var(--text-dim)', fontFamily: 'var(--royal-ui)' }}
                  >
                    What we judged
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>Headline</p>
                      <p className="text-base" style={{ color: 'var(--text-primary)' }}>
                        {audit.judgedHeadline || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>Description</p>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {audit.judgedDescription || '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dimension scores */}
                {audit.dimensions.length > 0 && (
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      background: 'var(--bg-elev-1)',
                      border: '1px solid var(--stroke-soft)',
                    }}
                  >
                    <h3
                      className="text-sm tracking-[0.1em] uppercase mb-4"
                      style={{ color: 'var(--text-dim)', fontFamily: 'var(--royal-ui)' }}
                    >
                      Dimensions
                    </h3>
                    <div className="space-y-3">
                      {audit.dimensions.map((dim) => (
                        <div key={dim.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span style={{ color: 'var(--text-muted)' }}>{dim.label}</span>
                            <span style={{ color: scoreColor(dim.score) }}>{dim.score}</span>
                          </div>
                          <div
                            className="h-2 rounded-full overflow-hidden"
                            style={{ background: 'rgba(255,255,255,0.08)' }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${dim.score}%`,
                                background: scoreColor(dim.score),
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {audit.tips.length > 0 && (
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      background: 'var(--bg-elev-1)',
                      border: '1px solid var(--stroke-soft)',
                    }}
                  >
                    <h3
                      className="text-sm tracking-[0.1em] uppercase mb-3"
                      style={{ color: 'var(--text-dim)', fontFamily: 'var(--royal-ui)' }}
                    >
                      Priority Fixes
                    </h3>
                    <ul className="space-y-2">
                      {audit.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Sparkles
                            className="w-4 h-4 mt-0.5 shrink-0"
                            style={{ color: 'var(--accent-ruby-soft)' }}
                          />
                          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {tip}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improved suggestions */}
                {(audit.improvedHeadline || audit.improvedMetaDescription) && (
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      background: 'var(--bg-elev-1)',
                      border: '1px solid rgba(122, 64, 242, 0.2)',
                    }}
                  >
                    <h3
                      className="text-sm tracking-[0.1em] uppercase mb-3"
                      style={{ color: 'var(--accent-ruby-soft)', fontFamily: 'var(--royal-ui)' }}
                    >
                      AI Suggestions
                    </h3>
                    {audit.improvedHeadline && (
                      <div className="mb-3">
                        <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>
                          Improved headline
                        </p>
                        <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {audit.improvedHeadline}
                        </p>
                      </div>
                    )}
                    {audit.improvedMetaDescription && (
                      <div>
                        <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>
                          Improved description
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          {audit.improvedMetaDescription}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {!saved ? (
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: 'var(--accent-ruby)',
                        color: '#fff',
                        fontFamily: 'var(--royal-ui)',
                        opacity: saving ? 0.7 : 1,
                      }}
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      Save to Workspace
                    </button>
                  ) : (
                    <span
                      className="flex items-center gap-1.5 text-sm"
                      style={{ color: '#22c55e' }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Saved to workspace
                    </span>
                  )}

                  <button
                    onClick={handleRerun}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all"
                    style={{
                      background: 'var(--bg-elev-2)',
                      border: '1px solid var(--stroke-soft)',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--royal-ui)',
                    }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Audit another URL
                  </button>

                  <Link
                    href={`/lab/${workspaceId}`}
                    className="flex items-center gap-1 text-sm transition-opacity hover:opacity-80"
                    style={{ color: 'var(--accent-ruby-soft)', fontFamily: 'var(--royal-ui)' }}
                  >
                    Back to Dashboard <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
