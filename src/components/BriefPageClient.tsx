'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, AlertTriangle, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import useMotionProfile from '@/components/motion/useMotionProfile';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const URGENT_KEYWORDS = ['exam', 'midterm', 'final', 'test', 'quiz', 'due', 'deadline', 'submission'];

interface SerializedEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
}

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

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function BriefPageClient({ events }: { events: SerializedEvent[] }) {
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

  // Group events by date
  const grouped: Record<string, SerializedEvent[]> = {};
  for (const event of events) {
    const key = new Date(event.startTime).toISOString().slice(0, 10);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(event);
  }

  const dateKeys = Object.keys(grouped).sort();

  return (
    <main
      id="main-content"
      data-section-theme="articles"
      className="page-enter marketing-main site-theme page-gutter pb-20 pt-28 md:pb-24 md:pt-32"
    >
      <div className="mx-auto max-w-3xl">
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

        <motion.header
          className="mb-10"
          initial={{ opacity: 0, y: introOffset }}
          animate={{ opacity: 1, y: 0 }}
          transition={introTransitionForStep(2)}
        >
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="h-6 w-6 text-[var(--text-muted)]" />
            <h1 className="text-[clamp(2.1rem,9.6vw,2.7rem)] text-[var(--text-primary)] md:text-5xl">
              Brief
            </h1>
          </div>
          <p className="text-[var(--text-muted)]">School events — next 2 weeks.</p>
        </motion.header>

        {dateKeys.length === 0 ? (
          <motion.p
            className="py-12 text-center text-[var(--text-dim)]"
            initial={{ opacity: 0, y: introOffset }}
            animate={{ opacity: 1, y: 0 }}
            transition={introTransitionForStep(3)}
          >
            No school events in the next 2 weeks.
          </motion.p>
        ) : (
          <div className="space-y-8">
            {dateKeys.map((dateKey, groupIndex) => {
              const dayEvents = grouped[dateKey];
              const dayDate = new Date(dayEvents[0].startTime);
              const label = formatRelativeDay(dayDate);

              return (
                <motion.div
                  key={dateKey}
                  initial={{ opacity: 0, y: motionProfile.reduced ? 0 : motionProfile.distances.enterY }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    motionProfile.reduced
                      ? { duration: 0 }
                      : {
                          duration: motionProfile.durations.enter,
                          delay: (3 + groupIndex) * motionProfile.durations.stagger,
                          ease: EASE_OUT_EXPO,
                        }
                  }
                >
                  <p className="mb-3 text-xs font-mono uppercase tracking-wider text-[var(--text-dim)]">
                    {label}
                  </p>
                  <div className="space-y-2">
                    {dayEvents.map((event) => {
                      const urgent = isUrgent(event.title);
                      const eventDate = new Date(event.startTime);

                      return (
                        <div
                          key={event.id}
                          className={`flex items-start gap-3 rounded-lg px-4 py-3 border ${
                            urgent
                              ? 'border-red-500/20 bg-red-500/[0.06]'
                              : 'border-[var(--stroke-soft)] bg-[var(--bg-elev-1)]'
                          }`}
                        >
                          {urgent ? (
                            <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-[var(--text-dim)] mt-0.5 shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm ${
                                urgent
                                  ? 'text-[var(--text-primary)] font-medium'
                                  : 'text-[var(--text-primary)]'
                              }`}
                            >
                              {event.title}
                            </p>
                            <p className="text-xs text-[var(--text-dim)] mt-0.5">
                              {event.isAllDay ? 'All day' : formatTime(eventDate)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
