'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  AlertTriangle,
  GraduationCap,
  Cloud,
  Clock,
  Crosshair,
} from 'lucide-react';
import { motion } from 'framer-motion';
import useMotionProfile from '@/components/motion/useMotionProfile';
import type {
  AgentReport,
  CalendarEvent,
  SchoolEvent,
  WeatherData,
} from '@/lib/school-events';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const URGENT_KEYWORDS = ['exam', 'midterm', 'final', 'test', 'quiz', 'due', 'deadline', 'submission'];

const CATEGORY_COLORS: Record<string, string> = {
  school: 'bg-blue-500/15 text-blue-400',
  business: 'bg-purple-500/15 text-purple-400',
  fitness: 'bg-green-500/15 text-green-400',
  personal: 'bg-amber-500/15 text-amber-400',
  admin: 'bg-gray-500/15 text-gray-400',
};

function isUrgent(title: string) {
  const lower = title.toLowerCase();
  return URGENT_KEYWORDS.some((kw) => lower.includes(kw));
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

function Countdown({ target }: { target: string }) {
  const [text, setText] = useState(timeUntil(new Date(target)));
  useEffect(() => {
    const interval = setInterval(() => setText(timeUntil(new Date(target))), 60000);
    return () => clearInterval(interval);
  }, [target]);
  return <span className="font-mono text-xs text-amber-400">{text}</span>;
}

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
  const motionProfile = useMotionProfile();
  const introOffset = motionProfile.reduced ? 0 : Math.min(motionProfile.distances.enterY, 12);

  const introTransitionForStep = (step: number) =>
    motionProfile.reduced
      ? { duration: 0 }
      : {
          duration: motionProfile.durations.enter,
          delay: step * motionProfile.durations.stagger,
          ease: EASE_OUT_EXPO,
        };

  // Group school events by date
  const grouped: Record<string, SchoolEvent[]> = {};
  for (const event of schoolEvents) {
    const key = new Date(event.startTime).toISOString().slice(0, 10);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(event);
  }
  const dateKeys = Object.keys(grouped).sort();

  // Parse priority lines
  const priorityLines = priorities?.content
    ?.split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0) ?? [];

  return (
    <main
      id="main-content"
      data-section-theme="articles"
      className="page-enter marketing-main site-theme page-gutter pb-20 pt-28 md:pb-24 md:pt-32"
    >
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: introOffset }}
          animate={{ opacity: 1, y: 0 }}
          transition={introTransitionForStep(1)}
        >
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
            Back home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: introOffset }}
          animate={{ opacity: 1, y: 0 }}
          transition={introTransitionForStep(2)}
        >
          <p className="mb-2 text-xs font-mono uppercase tracking-wider text-[var(--text-dim)]">
            Daily Briefing
          </p>
          <h1 className="text-[clamp(2.1rem,9.6vw,2.7rem)] text-[var(--text-primary)] md:text-5xl">
            {getGreeting()}, Mr. Mankarious
          </h1>
          {weather && (
            <div className="mt-2 flex items-center gap-2 text-sm text-[var(--text-dim)]">
              <Cloud className="h-3.5 w-3.5" />
              <span className="font-mono text-xs">
                {weather.city} &mdash; {weather.description}, {weather.tempC}&deg;C
                {weather.feelsLikeC && ` (feels ${weather.feelsLikeC}\u00B0C)`}
              </span>
            </div>
          )}
        </motion.div>

        {/* Divider */}
        <motion.div
          className="h-px bg-[var(--stroke-soft)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={introTransitionForStep(3)}
        />

        {/* Intelligence Report */}
        <motion.div
          className="rounded-lg border border-[var(--stroke-soft)] bg-[var(--bg-elev-1)] p-5"
          initial={{ opacity: 0, y: introOffset }}
          animate={{ opacity: 1, y: 0 }}
          transition={introTransitionForStep(4)}
        >
          <h2 className="mb-3 text-xs font-mono uppercase tracking-wider text-amber-400">
            Intelligence Report
          </h2>
          {briefing?.content ? (
            <p className="text-sm leading-relaxed text-[var(--text-muted)] whitespace-pre-line italic">
              {briefing.content}
            </p>
          ) : (
            <p className="text-sm text-[var(--text-dim)] italic">
              Awaiting intelligence, sir. The synthesis operatives have not yet reported.
            </p>
          )}
        </motion.div>

        {/* Imminent + Standing Orders */}
        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
          initial={{ opacity: 0, y: introOffset }}
          animate={{ opacity: 1, y: 0 }}
          transition={introTransitionForStep(5)}
        >
          {/* Imminent */}
          <div className="rounded-lg border border-[var(--stroke-soft)] bg-[var(--bg-elev-1)] p-5">
            <h2 className="mb-3 text-xs font-mono uppercase tracking-wider text-amber-400">
              Imminent
            </h2>
            {upcoming.length === 0 ? (
              <p className="text-sm text-[var(--text-dim)] italic">Your schedule is clear, sir.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((event) => (
                  <div key={event.id} className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 min-w-0">
                      <Clock className="h-3.5 w-3.5 text-[var(--text-dim)] mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-[var(--text-primary)] truncate">{event.title}</p>
                        <p className="text-xs text-[var(--text-dim)] font-mono">
                          {formatTime(event.startTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.personal
                        }`}
                      >
                        {event.category}
                      </span>
                      <Countdown target={event.startTime} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Standing Orders */}
          {priorityLines.length > 0 && (
            <div className="rounded-lg border border-[var(--stroke-soft)] bg-[var(--bg-elev-1)] p-5">
              <h2 className="mb-3 text-xs font-mono uppercase tracking-wider text-amber-400">
                Standing Orders
              </h2>
              <div className="space-y-2.5">
                {priorityLines.map((line, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Crosshair className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-[var(--text-muted)]">
                      {line.replace(/^\d+[\.\)]\s*/, '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Academics */}
        <motion.div
          className="rounded-lg border border-[var(--stroke-soft)] bg-[var(--bg-elev-1)] p-5"
          initial={{ opacity: 0, y: introOffset }}
          animate={{ opacity: 1, y: 0 }}
          transition={introTransitionForStep(6)}
        >
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="h-4 w-4 text-[var(--text-dim)]" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-amber-400">
              Academics
            </h2>
          </div>

          {dateKeys.length === 0 ? (
            <p className="text-sm text-[var(--text-dim)] italic">
              No school commitments in the next 2 weeks, sir.
            </p>
          ) : (
            <div className="space-y-4">
              {dateKeys.map((dateKey) => {
                const dayEvents = grouped[dateKey];
                const dayDate = new Date(dayEvents[0].startTime);
                const label = formatRelativeDay(dayDate);

                return (
                  <div key={dateKey}>
                    <p className="mb-1.5 text-xs font-mono uppercase tracking-wider text-[var(--text-dim)]">
                      {label}
                    </p>
                    <div className="space-y-2">
                      {dayEvents.map((event) => {
                        const urgent = isUrgent(event.title);
                        return (
                          <div
                            key={event.id}
                            className={`flex items-start gap-2.5 rounded px-3 py-2 ${
                              urgent
                                ? 'bg-red-500/[0.06] border border-red-500/20'
                                : 'bg-[var(--bg-elev-2)]'
                            }`}
                          >
                            {urgent ? (
                              <AlertTriangle className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                            ) : (
                              <BookOpen className="h-3.5 w-3.5 text-[var(--text-dim)] mt-0.5 shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-sm truncate ${
                                  urgent
                                    ? 'text-[var(--text-primary)] font-medium'
                                    : 'text-[var(--text-primary)]'
                                }`}
                              >
                                {event.title}
                              </p>
                              <p className="text-[11px] text-[var(--text-dim)] font-mono">
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
        </motion.div>
      </div>
    </main>
  );
}
