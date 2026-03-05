'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp,
  Globe,
  Loader2,
  Pen,
  Search,
  Users,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Workspace } from '@/lib/lab/types';
import type {
  AgentCard,
  AgentMessage,
  AgentAction,
  AgentResponse,
  PositioningAnalysis,
  CompetitorMatrix,
  CopySuggestion,
} from '@/lib/lab/agent-types';

type SafeWorkspace = Omit<Workspace, 'token' | 'email'>;

type Props = {
  workspaceId: string;
  workspace: SafeWorkspace;
  initialHistory: AgentMessage[];
};

// ── Inline Card Components ───────────────────────────────────────────

function ScoreRing({ score, size = 64 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? '#22c55e' : score >= 60 ? '#7a40f2' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={4}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <span
        className="absolute text-sm font-semibold"
        style={{ color, fontFamily: 'var(--royal-display)' }}
      >
        {score}
      </span>
    </div>
  );
}

function DimensionBar({ label, score }: { label: string; score: number }) {
  const color =
    score >= 80 ? '#22c55e' : score >= 60 ? '#7a40f2' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--royal-ui)' }}>{label}</span>
        <span style={{ color: 'var(--text-dim)' }}>{score}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

function PositioningAnalysisCard({ data }: { data: PositioningAnalysis }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden my-2"
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--stroke-soft)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <ScoreRing score={data.score} size={56} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-semibold truncate"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--royal-display)' }}
            >
              {data.domain}
            </span>
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                background: 'rgba(122, 64, 242, 0.15)',
                color: 'var(--accent-ruby-soft)',
                fontFamily: 'var(--royal-ui)',
              }}
            >
              {data.grade}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
            {data.verdict}
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded-lg transition-colors"
          style={{ color: 'var(--text-dim)' }}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Dimensions */}
      <div className="px-4 pb-3 space-y-2">
        {data.dimensions.map((dim) => (
          <DimensionBar key={dim.id} label={dim.label} score={dim.score} />
        ))}
      </div>

      {/* Expandable details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 py-3 space-y-3"
              style={{ borderTop: '1px solid var(--stroke-soft)' }}
            >
              {/* Fixes */}
              <div>
                <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--royal-ui)' }}>
                  Priority Fixes
                </p>
                <ul className="space-y-1">
                  {data.fixes.map((fix, i) => (
                    <li key={i} className="text-xs leading-relaxed flex gap-2" style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--accent-ruby-soft)' }}>{i + 1}.</span>
                      {fix}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Before / After */}
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-dim)', fontFamily: 'var(--royal-ui)' }}>
                    Current
                  </p>
                  <p className="text-xs leading-relaxed px-2 py-1.5 rounded" style={{ background: 'rgba(239, 68, 68, 0.08)', color: 'var(--text-muted)' }}>
                    {data.judgedHeadline}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-dim)', fontFamily: 'var(--royal-ui)' }}>
                    Improved
                  </p>
                  <p className="text-xs leading-relaxed px-2 py-1.5 rounded" style={{ background: 'rgba(34, 197, 94, 0.08)', color: 'var(--text-muted)' }}>
                    {data.improvedHeadline}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CompetitorMatrixCard({ data }: { data: CompetitorMatrix }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden my-2"
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--stroke-soft)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="px-4 py-3">
        <p
          className="text-sm font-semibold mb-2"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--royal-display)' }}
        >
          Competitor Matrix
        </p>
        <p className="text-xs mb-3" style={{ color: 'var(--text-dim)' }}>
          {data.summary}
        </p>
      </div>

      <div className="px-4 pb-3 space-y-2">
        {/* User row (if available) */}
        {data.userDomain && data.userScore !== null && (
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(122, 64, 242, 0.1)', border: '1px solid rgba(122, 64, 242, 0.2)' }}
          >
            <ScoreRing score={data.userScore} size={40} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--accent-ruby-soft)' }}>
                {data.userDomain} (you)
              </p>
            </div>
          </div>
        )}

        {/* Competitor rows */}
        {data.competitors.map((comp, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <ScoreRing score={comp.score} size={40} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {comp.domain}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--text-dim)' }}>
                {comp.headline}
              </p>
            </div>
            <span
              className="text-xs px-1.5 py-0.5 rounded shrink-0"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--text-dim)',
                fontFamily: 'var(--royal-ui)',
              }}
            >
              {comp.grade}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CopySuggestionsCard({ data }: { data: CopySuggestion[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden my-2"
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--stroke-soft)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="px-4 py-3">
        <p
          className="text-sm font-semibold mb-2"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--royal-display)' }}
        >
          Copy Variants
        </p>
      </div>

      <div className="px-4 pb-3 space-y-3">
        {data.map((suggestion, i) => (
          <div
            key={i}
            className="rounded-lg px-3 py-2.5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-xs px-1.5 py-0.5 rounded font-semibold"
                style={{ background: 'rgba(122, 64, 242, 0.15)', color: 'var(--accent-ruby-soft)', fontFamily: 'var(--royal-ui)' }}
              >
                Variant {i + 1}
              </span>
              {suggestion.estimatedScoreImprovement > 0 && (
                <span className="text-xs" style={{ color: '#22c55e' }}>
                  +{suggestion.estimatedScoreImprovement} pts
                </span>
              )}
            </div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)', fontFamily: 'var(--royal-display)' }}>
              {suggestion.headline}
            </p>
            {suggestion.description && (
              <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                {suggestion.description}
              </p>
            )}
            <p className="text-xs italic" style={{ color: 'var(--text-dim)' }}>
              {suggestion.reasoning}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function InlineCard({ card }: { card: AgentCard }) {
  switch (card.type) {
    case 'positioning_analysis':
      return <PositioningAnalysisCard data={card.data} />;
    case 'competitor_matrix':
      return <CompetitorMatrixCard data={card.data} />;
    case 'copy_suggestions':
      return <CopySuggestionsCard data={card.data} />;
    default:
      return null;
  }
}

// ── Quick Action Bar ─────────────────────────────────────────────────

type QuickAction = {
  id: AgentAction;
  label: string;
  icon: typeof Globe;
  needsInput: boolean;
  placeholder?: string;
  multi?: boolean;
};

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'analyze_url', label: 'Analyze My Site', icon: Globe, needsInput: true, placeholder: 'Enter your URL...' },
  { id: 'analyze_competitors', label: 'Scan Competitors', icon: Users, needsInput: true, placeholder: 'Enter competitor URLs (one per line)...', multi: true },
  { id: 'rewrite', label: 'Rewrite My Copy', icon: Pen, needsInput: false },
];

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: 'var(--accent-ruby)' }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────

export default function LabAgentClient({ workspaceId, workspace, initialHistory }: Props) {
  const [messages, setMessages] = useState<AgentMessage[]>(initialHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeAction, setActiveAction] = useState<AgentAction | null>(null);
  const [actionInput, setActionInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const sendMessage = useCallback(
    async (text: string, action?: AgentAction, urls?: string[]) => {
      if ((!text.trim() && !action) || loading) return;

      const userMsg: AgentMessage = {
        role: 'user',
        content: text.trim() || (action === 'analyze_url' ? `Analyze ${urls?.[0]}` : action === 'analyze_competitors' ? `Scan competitors: ${urls?.join(', ')}` : 'Rewrite my copy'),
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setActionInput('');
      setActiveAction(null);
      setLoading(true);
      setError('');

      try {
        const body: Record<string, unknown> = { message: userMsg.content };
        if (action) body.action = action;
        if (urls?.length) body.urls = urls;

        const res = await fetch(`/api/lab/${workspaceId}/agent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data: AgentResponse & { error?: string } = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to get response');
          setLoading(false);
          return;
        }

        const assistantMsg: AgentMessage = {
          role: 'assistant',
          content: data.reply,
          createdAt: new Date().toISOString(),
          cards: data.cards,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [workspaceId, loading]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage]
  );

  const handleActionSubmit = useCallback(() => {
    if (!activeAction) return;

    if (activeAction === 'analyze_url') {
      const url = actionInput.trim();
      if (!url) return;
      sendMessage(`Analyze ${url}`, 'analyze_url', [url]);
    } else if (activeAction === 'analyze_competitors') {
      const urls = actionInput.split('\n').map((u) => u.trim()).filter(Boolean);
      if (urls.length === 0) return;
      sendMessage(`Scan competitors: ${urls.join(', ')}`, 'analyze_competitors', urls);
    }
  }, [activeAction, actionInput, sendMessage]);

  const handleRewrite = useCallback(() => {
    sendMessage('Rewrite my copy with improved positioning', 'rewrite');
  }, [sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
      }
    },
    [input, sendMessage]
  );

  const score = workspace.currentSnapshot?.scores.overall ?? null;

  return (
    <main className="site-theme" id="main-content">
      <div className="flex flex-col h-[100dvh]">
        {/* Header */}
        <div
          className="shrink-0 px-4 sm:px-6 py-3 flex items-center gap-3"
          style={{
            borderBottom: '1px solid var(--stroke-soft)',
            background: 'var(--bg-elev-1)',
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(122, 64, 242, 0.15)' }}
          >
            <Search className="w-4 h-4" style={{ color: 'var(--accent-ruby)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h1
              className="text-base font-semibold truncate"
              style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-primary)' }}
            >
              {workspace.startupName || 'Positioning Agent'}
            </h1>
          </div>
          {score !== null && (
            <div className="flex items-center gap-1.5">
              <span
                className="text-lg font-semibold tabular-nums"
                style={{
                  fontFamily: 'var(--royal-display)',
                  color: score >= 80 ? '#22c55e' : score >= 60 ? '#7a40f2' : score >= 40 ? '#f59e0b' : '#ef4444',
                }}
              >
                {score}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-dim)' }}>/100</span>
            </div>
          )}
        </div>

        {/* Messages area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4"
          style={{ background: 'var(--bg-elev-1)' }}
        >
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Welcome message if no history */}
            {messages.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="py-12 text-center"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(122, 64, 242, 0.12)' }}
                >
                  <Search className="w-8 h-8" style={{ color: 'var(--accent-ruby)' }} />
                </div>
                <h2
                  className="text-xl font-semibold mb-2"
                  style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-primary)' }}
                >
                  Olunix Positioning Agent
                </h2>
                <p className="text-sm max-w-md mx-auto mb-6" style={{ color: 'var(--text-dim)' }}>
                  I&apos;m your positioning strategist. Analyze your site, scan competitors, or just tell me about your startup.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    'Analyze my site',
                    'Tell me about positioning',
                    'What should I work on?',
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="text-sm px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                      style={{
                        background: 'rgba(122, 64, 242, 0.08)',
                        color: 'var(--accent-ruby-soft)',
                        border: '1px solid rgba(122, 64, 242, 0.15)',
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Message list */}
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1 mr-2"
                      style={{ background: 'rgba(122, 64, 242, 0.15)' }}
                    >
                      <Search className="w-3.5 h-3.5" style={{ color: 'var(--accent-ruby)' }} />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user' ? 'max-w-[80%]' : 'max-w-[85%]'
                    }`}
                    style={{
                      background:
                        msg.role === 'user'
                          ? 'rgba(122, 64, 242, 0.15)'
                          : 'rgba(255,255,255,0.04)',
                      color: 'var(--text-primary)',
                      borderBottomRightRadius: msg.role === 'user' ? '6px' : undefined,
                      borderBottomLeftRadius: msg.role === 'assistant' ? '6px' : undefined,
                      border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.06)' : undefined,
                    }}
                  >
                    {msg.content.split('\n').map((line, j) => (
                      <p key={j} className={j > 0 ? 'mt-2' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Inline cards */}
                {msg.cards?.map((card, j) => (
                  <div key={j} className="ml-9">
                    <InlineCard card={card} />
                  </div>
                ))}
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1 mr-2"
                  style={{ background: 'rgba(122, 64, 242, 0.15)' }}
                >
                  <Search className="w-3.5 h-3.5" style={{ color: 'var(--accent-ruby)' }} />
                </div>
                <div
                  className="rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <TypingIndicator />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-xs text-center py-2" style={{ color: '#ef4444' }}>
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Bottom area: Quick actions + Input */}
        <div
          className="shrink-0"
          style={{
            borderTop: '1px solid var(--stroke-soft)',
            background: 'var(--bg-elev-1)',
          }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 space-y-2">
            {/* Quick action bar */}
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  onClick={() => {
                    if (action.needsInput) {
                      setActiveAction(activeAction === action.id ? null : action.id);
                      setActionInput('');
                    } else {
                      handleRewrite();
                    }
                  }}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80 disabled:opacity-40"
                  style={{
                    background: activeAction === action.id ? 'rgba(122, 64, 242, 0.2)' : 'rgba(122, 64, 242, 0.08)',
                    color: 'var(--accent-ruby-soft)',
                    border: `1px solid ${activeAction === action.id ? 'rgba(122, 64, 242, 0.3)' : 'rgba(122, 64, 242, 0.12)'}`,
                    fontFamily: 'var(--royal-ui)',
                  }}
                >
                  <action.icon className="w-3 h-3" />
                  {action.label}
                </button>
              ))}
            </div>

            {/* Action input expansion */}
            <AnimatePresence>
              {activeAction && QUICK_ACTIONS.find((a) => a.id === activeAction)?.needsInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2">
                    {QUICK_ACTIONS.find((a) => a.id === activeAction)?.multi ? (
                      <textarea
                        value={actionInput}
                        onChange={(e) => setActionInput(e.target.value)}
                        placeholder="Enter URLs, one per line..."
                        rows={3}
                        className="flex-1 px-3 py-2 rounded-lg text-sm outline-none resize-none"
                        style={{
                          background: 'var(--bg-elev-2)',
                          border: '1px solid var(--stroke-soft)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={actionInput}
                        onChange={(e) => setActionInput(e.target.value)}
                        placeholder={QUICK_ACTIONS.find((a) => a.id === activeAction)?.placeholder}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleActionSubmit();
                          }
                        }}
                        className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                        style={{
                          background: 'var(--bg-elev-2)',
                          border: '1px solid var(--stroke-soft)',
                          color: 'var(--text-primary)',
                        }}
                        autoFocus
                      />
                    )}
                    <button
                      onClick={handleActionSubmit}
                      disabled={!actionInput.trim() || loading}
                      className="px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-40"
                      style={{
                        background: 'var(--accent-ruby)',
                        color: '#fff',
                        fontFamily: 'var(--royal-ui)',
                      }}
                    >
                      Go
                    </button>
                    <button
                      onClick={() => { setActiveAction(null); setActionInput(''); }}
                      className="p-2 rounded-lg transition-all"
                      style={{ color: 'var(--text-dim)' }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main text input */}
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your positioning..."
                rows={1}
                maxLength={4000}
                className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                style={{
                  background: 'var(--bg-elev-2)',
                  border: '1px solid var(--stroke-soft)',
                  color: 'var(--text-primary)',
                  maxHeight: 120,
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl transition-all disabled:opacity-30"
                style={{
                  background: input.trim() ? 'var(--accent-ruby)' : 'rgba(255,255,255,0.06)',
                  color: input.trim() ? '#fff' : 'var(--text-dim)',
                }}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUp className="w-4 h-4" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
