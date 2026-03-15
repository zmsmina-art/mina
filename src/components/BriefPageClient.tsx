'use client';

import { useEffect, useState } from 'react';
import {
  BookOpen,
  AlertTriangle,
  GraduationCap,
  Cloud,
  Clock,
  Crosshair,
} from 'lucide-react';
import type {
  AgentReport,
  CalendarEvent,
  SchoolEvent,
  WeatherData,
} from '@/lib/school-events';

/* ── MI6 Theme Tokens ─────────────────────────────────────────────── */
const T = {
  bg: '#0A0A0C',
  elevated: 'rgba(255,255,255,0.025)',
  surface: 'rgba(255,255,255,0.015)',
  gold: '#C9A84C',
  goldDim: '#8A7233',
  goldBright: '#E8C65A',
  ice: '#7EB8DA',
  textPrimary: '#E8E4DC',
  textSecondary: 'rgba(232,228,220,0.55)',
  textMuted: 'rgba(232,228,220,0.30)',
  borderDefault: 'rgba(255,255,255,0.05)',
  borderGold: 'rgba(201,168,76,0.12)',
  borderHover: 'rgba(201,168,76,0.25)',
  statusRed: '#F87171',
} as const;

const URGENT_KEYWORDS = ['exam', 'midterm', 'final', 'test', 'quiz', 'due', 'deadline', 'submission'];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  school: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
  business: { bg: 'rgba(168,85,247,0.15)', text: '#c084fc' },
  fitness: { bg: 'rgba(74,222,128,0.15)', text: '#4ade80' },
  personal: { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24' },
  admin: { bg: 'rgba(156,163,175,0.15)', text: '#9ca3af' },
};

/* ── Helpers ───────────────────────────────────────────────────────── */

function isUrgent(title: string) {
  return URGENT_KEYWORDS.some((kw) => title.toLowerCase().includes(kw));
}

function formatRelativeDay(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return target.toLocaleDateString('en-CA', { weekday: 'long' });
  return target.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function timeUntil(target: Date): string {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return 'now';
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ── Inline Style Helpers ─────────────────────────────────────────── */

const sectionLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: T.goldDim,
  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
  marginBottom: '12px',
};

const glassCard: React.CSSProperties = {
  background: T.elevated,
  border: `1px solid ${T.borderDefault}`,
  borderRadius: '4px',
  padding: '20px',
};

const mono: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
};

/* ── Sub-Components ───────────────────────────────────────────────── */

function Countdown({ target }: { target: string }) {
  const [text, setText] = useState(timeUntil(new Date(target)));
  useEffect(() => {
    const interval = setInterval(() => setText(timeUntil(new Date(target))), 60000);
    return () => clearInterval(interval);
  }, [target]);
  return <span style={{ ...mono, fontSize: '12px', color: T.gold }}>{text}</span>;
}

function CategoryBadge({ category }: { category: string }) {
  const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.personal;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '9999px',
        padding: '2px 10px',
        fontSize: '11px',
        fontWeight: 500,
        background: colors.bg,
        color: colors.text,
      }}
    >
      {category}
    </span>
  );
}

/* ── Main Component ───────────────────────────────────────────────── */

interface BriefPageProps {
  briefing: AgentReport | null;
  priorities: AgentReport | null;
  upcoming: CalendarEvent[];
  weather: WeatherData | null;
  schoolEvents: SchoolEvent[];
}

export default function BriefPageClient({
  briefing,
  priorities,
  upcoming,
  weather,
  schoolEvents,
}: BriefPageProps) {
  // Group school events by date
  const grouped: Record<string, SchoolEvent[]> = {};
  for (const event of schoolEvents) {
    const key = new Date(event.startTime).toISOString().slice(0, 10);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(event);
  }
  const dateKeys = Object.keys(grouped).sort();

  // Parse priority lines
  const priorityLines =
    priorities?.content
      ?.split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0) ?? [];

  return (
    <div
      style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '48px 24px 80px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* ── Header ────────────────────────────────────────────── */}
        <div className="animate-fade-in-up">
          <div style={sectionLabel}>Daily Briefing</div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 500,
              fontFamily: "var(--font-playfair-display), 'Playfair Display', Georgia, serif",
              color: T.textPrimary,
              letterSpacing: '-0.01em',
              marginTop: '8px',
            }}
          >
            {getGreeting()}, Mr. Mankarious
          </h1>
          {weather && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: T.textMuted,
                marginTop: '6px',
              }}
            >
              <Cloud size={14} style={{ color: T.ice }} />
              <span style={{ ...mono, fontSize: '12px' }}>
                {weather.city} — {weather.description}, {weather.tempC}°C
                {weather.feelsLikeC && ` (feels ${weather.feelsLikeC}°C)`}
              </span>
            </div>
          )}
        </div>

        {/* ── Divider ───────────────────────────────────────────── */}
        <div style={{ height: '1px', background: T.borderGold }} />

        {/* ── Intelligence Report ───────────────────────────────── */}
        <div
          style={{
            ...glassCard,
            position: 'relative',
          }}
          className="animate-fade-in-up"
        >
          {/* Gold line accent */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '12px',
              right: '12px',
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${T.goldDim}, transparent)`,
              pointerEvents: 'none',
            }}
          />
          <h2 style={sectionLabel}>Intelligence Report</h2>
          {briefing?.content ? (
            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.7,
                color: T.textSecondary,
                whiteSpace: 'pre-line',
                fontStyle: 'italic',
              }}
            >
              {briefing.content}
            </p>
          ) : (
            <p style={{ fontSize: '14px', color: T.textMuted, fontStyle: 'italic' }}>
              Awaiting intelligence, sir. The synthesis operatives have not yet reported.
            </p>
          )}
        </div>

        {/* ── Imminent + Standing Orders ─────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
          className="animate-fade-in-up"
        >
          {/* Imminent */}
          <div style={glassCard}>
            <h2 style={sectionLabel}>Imminent</h2>
            {upcoming.length === 0 ? (
              <p style={{ fontSize: '14px', color: T.textMuted, fontStyle: 'italic' }}>
                Your schedule is clear, sir.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {upcoming.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', minWidth: 0 }}>
                      <Clock
                        size={14}
                        style={{ color: T.goldDim, marginTop: '2px', flexShrink: 0 }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: '14px',
                            color: T.textPrimary,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {event.title}
                        </p>
                        <p style={{ ...mono, fontSize: '12px', color: T.textMuted }}>
                          {formatTime(event.startTime)}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexShrink: 0,
                      }}
                    >
                      <CategoryBadge category={event.category} />
                      <Countdown target={event.startTime} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Standing Orders */}
          {priorityLines.length > 0 && (
            <div style={glassCard}>
              <h2 style={sectionLabel}>Standing Orders</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {priorityLines.map((line, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <Crosshair
                      size={14}
                      style={{ color: T.gold, marginTop: '2px', flexShrink: 0 }}
                    />
                    <p style={{ fontSize: '14px', color: T.textSecondary }}>
                      {line.replace(/^\d+[\.\)]\s*/, '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Academics ─────────────────────────────────────────── */}
        <div style={glassCard} className="animate-fade-in-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <GraduationCap size={16} style={{ color: '#60a5fa' }} />
            <h2 style={{ ...sectionLabel, marginBottom: 0 }}>Academics — Next 2 Weeks</h2>
          </div>

          {dateKeys.length === 0 ? (
            <p style={{ fontSize: '14px', color: T.textMuted, fontStyle: 'italic' }}>
              No school commitments in the next 2 weeks, sir.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {dateKeys.map((dateKey) => {
                const dayEvents = grouped[dateKey];
                const dayDate = new Date(dayEvents[0].startTime);
                const label = formatRelativeDay(dayDate);

                return (
                  <div key={dateKey}>
                    <p
                      style={{
                        ...mono,
                        fontSize: '12px',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: T.goldDim,
                        marginBottom: '6px',
                      }}
                    >
                      {label}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {dayEvents.map((event) => {
                        const urgent = isUrgent(event.title);
                        return (
                          <div
                            key={event.id}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px',
                              borderRadius: '4px',
                              padding: '8px 12px',
                              background: urgent ? 'rgba(248,113,113,0.08)' : T.surface,
                              border: urgent ? '1px solid rgba(248,113,113,0.2)' : 'none',
                            }}
                          >
                            {urgent ? (
                              <AlertTriangle
                                size={14}
                                style={{ color: T.statusRed, marginTop: '2px', flexShrink: 0 }}
                              />
                            ) : (
                              <BookOpen
                                size={14}
                                style={{ color: '#60a5fa', marginTop: '2px', flexShrink: 0 }}
                              />
                            )}
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <p
                                style={{
                                  fontSize: '14px',
                                  color: T.textPrimary,
                                  fontWeight: urgent ? 500 : 400,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {event.title}
                              </p>
                              <p style={{ ...mono, fontSize: '11px', color: T.textMuted }}>
                                {event.isAllDay ? 'All day' : formatTime(event.startTime)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
