'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  PenTool,
  Plus,
  Trash2,
  Trophy,
} from 'lucide-react';
import type { HeadlineVariants, PositioningSnapshot } from '@/lib/lab/types';
import type { PositioningResult } from '@/lib/positioning-grader';

type Phase = 'input' | 'scoring' | 'results';

type HeadlineEntry = {
  text: string;
  score: number | null;
  dimensions: Record<string, number>;
  isUserWritten: boolean;
  isAiGenerated: boolean;
};

function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return 'var(--accent-ruby-soft)';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

type Props = {
  workspaceId: string;
  existingHeadlines: HeadlineVariants | null;
  currentSnapshot: PositioningSnapshot | null;
};

export default function LabHeadlinesClient({
  workspaceId,
  existingHeadlines,
  currentSnapshot,
}: Props) {
  const [phase, setPhase] = useState<Phase>(existingHeadlines ? 'results' : 'input');
  const [startupName, setStartupName] = useState('');
  const [targetAudience, setTargetAudience] = useState(
    currentSnapshot?.targetAudience ?? ''
  );
  const [headlines, setHeadlines] = useState<HeadlineEntry[]>(
    existingHeadlines
      ? existingHeadlines.variants.map((v) => ({
          text: v.text,
          score: v.score,
          dimensions: v.dimensions,
          isUserWritten: v.isUserWritten,
          isAiGenerated: v.isAiGenerated,
        }))
      : [{ text: '', score: null, dimensions: {}, isUserWritten: true, isAiGenerated: false }]
  );
  const [selectedIndex, setSelectedIndex] = useState(
    existingHeadlines?.selectedIndex ?? 0
  );
  const [scoring, setScoring] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!existingHeadlines);
  const [error, setError] = useState('');

  const addHeadline = useCallback(() => {
    setHeadlines((prev) => [
      ...prev,
      { text: '', score: null, dimensions: {}, isUserWritten: true, isAiGenerated: false },
    ]);
  }, []);

  const removeHeadline = useCallback((index: number) => {
    setHeadlines((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateHeadline = useCallback((index: number, text: string) => {
    setHeadlines((prev) =>
      prev.map((h, i) => (i === index ? { ...h, text, score: null } : h))
    );
  }, []);

  const scoreAll = useCallback(async () => {
    const valid = headlines.filter((h) => h.text.trim());
    if (valid.length === 0) {
      setError('Add at least one headline to score.');
      return;
    }
    if (!startupName.trim()) {
      setError('Enter your startup name.');
      return;
    }

    setError('');
    setScoring(true);
    setPhase('scoring');
    setSaved(false);

    const scored: HeadlineEntry[] = [];

    for (const entry of headlines) {
      if (!entry.text.trim()) {
        scored.push(entry);
        continue;
      }

      try {
        const res = await fetch('/api/positioning-grader', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startupName: startupName.trim(),
            headline: entry.text.trim(),
            oneLiner: '',
            targetAudience: targetAudience.trim(),
          }),
        });

        if (res.ok) {
          const result: PositioningResult = await res.json();
          const dims: Record<string, number> = {};
          for (const d of result.dimensions) {
            dims[d.id] = d.score;
          }
          scored.push({
            ...entry,
            score: result.overallScore,
            dimensions: dims,
          });
        } else {
          scored.push(entry);
        }
      } catch {
        scored.push(entry);
      }
    }

    setHeadlines(scored);
    setScoring(false);
    setPhase('results');

    // Auto-select the highest-scoring headline
    let bestIdx = 0;
    let bestScore = -1;
    scored.forEach((h, i) => {
      if (h.score !== null && h.score > bestScore) {
        bestScore = h.score;
        bestIdx = i;
      }
    });
    setSelectedIndex(bestIdx);
  }, [headlines, startupName, targetAudience]);

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);

    const originalScore = currentSnapshot?.scores.overall ?? 0;
    const selectedScore = headlines[selectedIndex]?.score ?? 0;

    const artifact: HeadlineVariants = {
      completedAt: new Date().toISOString(),
      variants: headlines
        .filter((h) => h.text.trim())
        .map((h) => ({
          text: h.text,
          score: h.score ?? 0,
          dimensions: h.dimensions,
          isUserWritten: h.isUserWritten,
          isAiGenerated: h.isAiGenerated,
        })),
      selectedIndex,
      comparisonWithOriginal: {
        originalScore,
        selectedScore,
        delta: selectedScore - originalScore,
      },
    };

    try {
      const res = await fetch(`/api/lab/${workspaceId}/module/headlines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artifact),
      });

      if (res.ok) {
        setSaved(true);

        // Also save as a new snapshot if we have a selected headline
        const selected = headlines[selectedIndex];
        if (selected && selected.score !== null) {
          await fetch(`/api/lab/${workspaceId}/snapshot`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              headline: selected.text,
              oneLiner: currentSnapshot?.oneLiner ?? '',
              targetAudience: targetAudience || (currentSnapshot?.targetAudience ?? ''),
              valueProposition: currentSnapshot?.valueProposition ?? '',
              differentiators: currentSnapshot?.differentiators ?? [],
              proofPoints: currentSnapshot?.proofPoints ?? [],
              scores: {
                overall: selected.score,
                ...selected.dimensions,
              },
              percentile: 0,
              grade: selected.score >= 80 ? 'A' : selected.score >= 60 ? 'B' : selected.score >= 40 ? 'C' : 'D',
            }),
          });
        }
      }
    } catch {
      // silent fail
    } finally {
      setSaving(false);
    }
  }, [headlines, selectedIndex, workspaceId, currentSnapshot, targetAudience, saving]);

  const scoredHeadlines = headlines.filter((h) => h.score !== null && h.text.trim());

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
                5
              </span>
              <h1
                className="text-3xl font-semibold"
                style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-primary)' }}
              >
                Headline Forge
              </h1>
            </div>
            <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
              Write multiple headline variants, score them all, and pick the winner.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {(phase === 'input' || phase === 'scoring') && (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Startup name & audience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs mb-1.5"
                      style={{ color: 'var(--text-dim)', fontFamily: 'var(--royal-ui)' }}
                    >
                      Startup name *
                    </label>
                    <input
                      type="text"
                      placeholder="Acme AI"
                      value={startupName}
                      onChange={(e) => setStartupName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{
                        background: 'var(--bg-elev-2)',
                        border: '1px solid var(--stroke-soft)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs mb-1.5"
                      style={{ color: 'var(--text-dim)', fontFamily: 'var(--royal-ui)' }}
                    >
                      Target audience (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Series B infra companies"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{
                        background: 'var(--bg-elev-2)',
                        border: '1px solid var(--stroke-soft)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                </div>

                {/* Headline inputs */}
                <div className="space-y-3">
                  <label
                    className="block text-xs"
                    style={{ color: 'var(--text-dim)', fontFamily: 'var(--royal-ui)' }}
                  >
                    Headlines to score
                  </label>
                  {headlines.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Headline variant ${i + 1}...`}
                        value={entry.text}
                        onChange={(e) => updateHeadline(i, e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                        style={{
                          background: 'var(--bg-elev-2)',
                          border: '1px solid var(--stroke-soft)',
                          color: 'var(--text-primary)',
                        }}
                      />
                      {headlines.length > 1 && (
                        <button
                          onClick={() => removeHeadline(i)}
                          className="p-2 rounded-lg transition-opacity hover:opacity-80"
                          style={{ color: 'var(--text-dim)' }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  {headlines.length < 8 && (
                    <button
                      onClick={addHeadline}
                      className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-80"
                      style={{ color: 'var(--accent-ruby-soft)', fontFamily: 'var(--royal-ui)' }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add variant
                    </button>
                  )}
                </div>

                {error && (
                  <p className="text-sm" style={{ color: '#ef4444' }}>
                    {error}
                  </p>
                )}

                <button
                  onClick={scoreAll}
                  disabled={scoring}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold transition-all"
                  style={{
                    background: 'var(--accent-ruby)',
                    color: '#fff',
                    fontFamily: 'var(--royal-ui)',
                    opacity: scoring ? 0.7 : 1,
                  }}
                >
                  {scoring ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Scoring headlines...
                    </>
                  ) : (
                    <>
                      <PenTool className="w-4 h-4" />
                      Score All Headlines
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {phase === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Ranked headlines */}
                <h3
                  className="text-sm tracking-[0.1em] uppercase"
                  style={{ color: 'var(--text-dim)', fontFamily: 'var(--royal-ui)' }}
                >
                  Results — tap to select your winner
                </h3>

                {scoredHeadlines
                  .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
                  .map((entry, i) => {
                    const originalIdx = headlines.indexOf(entry);
                    const isSelected = originalIdx === selectedIndex;

                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedIndex(originalIdx)}
                        className="w-full text-left rounded-2xl p-5 transition-all"
                        style={{
                          background: isSelected ? 'rgba(122, 64, 242, 0.08)' : 'var(--bg-panel)',
                          border: `1px solid ${
                            isSelected ? 'rgba(122, 64, 242, 0.4)' : 'var(--stroke-soft)'
                          }`,
                          backdropFilter: 'blur(12px)',
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-base font-semibold mb-1"
                              style={{
                                fontFamily: 'var(--royal-display)',
                                color: 'var(--text-primary)',
                              }}
                            >
                              {entry.text}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {Object.entries(entry.dimensions).map(([key, val]) => (
                                <span
                                  key={key}
                                  className="text-xs px-2 py-0.5 rounded-full"
                                  style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    color: 'var(--text-dim)',
                                  }}
                                >
                                  {key.replace('_', ' ')}: {val}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col items-end shrink-0">
                            <span
                              className="text-2xl font-semibold tabular-nums"
                              style={{
                                fontFamily: 'var(--royal-display)',
                                color: scoreColor(entry.score!),
                              }}
                            >
                              {entry.score}
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-1 text-xs mt-1" style={{ color: 'var(--accent-ruby)' }}>
                                <Trophy className="w-3 h-3" /> Selected
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}

                {/* Before/After comparison */}
                {currentSnapshot && headlines[selectedIndex]?.score !== null && (
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      background: 'var(--bg-elev-1)',
                      border: '1px solid var(--stroke-soft)',
                    }}
                  >
                    <h3
                      className="text-sm tracking-[0.1em] uppercase mb-3"
                      style={{ color: 'var(--text-dim)', fontFamily: 'var(--royal-ui)' }}
                    >
                      Before vs. After
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>Original</p>
                        <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                          {currentSnapshot.headline}
                        </p>
                        <span
                          className="text-xl font-semibold"
                          style={{
                            fontFamily: 'var(--royal-display)',
                            color: scoreColor(currentSnapshot.scores.overall),
                          }}
                        >
                          {currentSnapshot.scores.overall}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>Selected</p>
                        <p className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                          {headlines[selectedIndex]?.text}
                        </p>
                        <span
                          className="text-xl font-semibold"
                          style={{
                            fontFamily: 'var(--royal-display)',
                            color: scoreColor(headlines[selectedIndex]?.score ?? 0),
                          }}
                        >
                          {headlines[selectedIndex]?.score}
                        </span>
                        {(() => {
                          const delta = (headlines[selectedIndex]?.score ?? 0) - currentSnapshot.scores.overall;
                          if (delta === 0) return null;
                          return (
                            <span
                              className="ml-2 text-sm font-semibold"
                              style={{ color: delta > 0 ? '#22c55e' : '#ef4444' }}
                            >
                              {delta > 0 ? '+' : ''}{delta}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
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
                    <span className="flex items-center gap-1.5 text-sm" style={{ color: '#22c55e' }}>
                      <CheckCircle2 className="w-4 h-4" />
                      Saved to workspace
                    </span>
                  )}

                  <button
                    onClick={() => {
                      setPhase('input');
                      setSaved(false);
                    }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all"
                    style={{
                      background: 'var(--bg-elev-2)',
                      border: '1px solid var(--stroke-soft)',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--royal-ui)',
                    }}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    Edit & Re-score
                  </button>

                  <Link
                    href={`/lab/${workspaceId}`}
                    className="flex items-center gap-1 text-sm transition-opacity hover:opacity-80"
                    style={{ color: 'var(--accent-ruby-soft)', fontFamily: 'var(--royal-ui)' }}
                  >
                    Back to Dashboard <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
