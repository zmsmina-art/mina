'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Clock, User, Check, X, Copy, ArrowRight, ArrowLeft, Mail, Loader2 } from 'lucide-react';
import useMotionProfile from '@/components/motion/useMotionProfile';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Generate next N weekdays starting from tomorrow */
function getWeekdays(count: number): Date[] {
  const days: Date[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 1);
  while (days.length < count) {
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) {
      days.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

/** Format date for display */
function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

/** Format date for email */
function formatDateLong(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

/** 30-min time slots 10:00 AM - 4:30 PM ET */
const TIME_SLOTS = [
  '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM',
  '1:00 PM',  '1:30 PM',
  '2:00 PM',  '2:30 PM',
  '3:00 PM',  '3:30 PM',
  '4:00 PM',  '4:30 PM',
];

const COMPANY_STAGES = [
  'Pre-seed / Idea stage',
  'Seed',
  'Series A',
  'Series B+',
  'Bootstrapped / Profitable',
  'Other',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = 'date' | 'time' | 'details' | 'review' | 'success';
const STEP_ORDER: Step[] = ['date', 'time', 'details', 'review', 'success'];

/* ------------------------------------------------------------------ */
/*  Booking Modal                                                      */
/* ------------------------------------------------------------------ */

export function BookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const motionProfile = useMotionProfile();
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  /* Form state */
  const [step, setStep] = useState<Step>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [companyStage, setCompanyStage] = useState('');
  const [context, setContext] = useState('');
  const [emailError, setEmailError] = useState('');
  const [copied, setCopied] = useState(false);

  /* Calendar availability */
  const [availableSlots, setAvailableSlots] = useState<string[]>(TIME_SLOTS);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState('');

  const weekdays = useMemo(() => getWeekdays(10), []);

  /* Reset on close */
  const resetForm = useCallback(() => {
    setStep('date');
    setSelectedDate(null);
    setSelectedTime(null);
    setName('');
    setEmail('');
    setCompany('');
    setCompanyStage('');
    setContext('');
    setEmailError('');
    setCopied(false);
    setAvailableSlots(TIME_SLOTS);
    setLoadingSlots(false);
    setSlotsError('');
  }, []);

  /* Save trigger + manage focus on open */
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
  }, [open]);

  /* Escape to close */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  /* Lock body scroll */
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  /* Return focus + reset on close */
  useEffect(() => {
    if (!open) {
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
        triggerRef.current = null;
      }
      const timer = setTimeout(resetForm, 300);
      return () => clearTimeout(timer);
    }
  }, [open, resetForm]);

  /* Focus trap */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'input, button, select, textarea, a, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    []
  );

  /* Motion helpers */
  const dur = motionProfile.reduced ? 0 : 0.38;
  const stagger = motionProfile.reduced ? 0 : 0.06;
  const slideX = motionProfile.reduced ? 0 : 24;

  const stepTransition = (s: number) =>
    motionProfile.reduced
      ? { duration: 0 }
      : { duration: dur, delay: s * stagger, ease: EASE_OUT_EXPO };

  /* Navigation */
  const stepIndex = STEP_ORDER.indexOf(step);

  const goNext = () => {
    const next = STEP_ORDER[stepIndex + 1];
    if (next) setStep(next);
  };
  const goBack = () => {
    const prev = STEP_ORDER[stepIndex - 1];
    if (prev) setStep(prev);
  };

  /* Fetch calendar availability for a date */
  const fetchAvailability = useCallback(async (date: Date) => {
    setLoadingSlots(true);
    setSlotsError('');
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    try {
      const res = await fetch(`/api/calendar/availability?date=${dateStr}`);
      const data = await res.json();
      if (data.slots && data.slots.length > 0) {
        setAvailableSlots(data.slots);
      } else {
        setAvailableSlots([]);
        setSlotsError('No available slots on this date.');
      }
    } catch {
      // Fallback to all slots if API fails
      setAvailableSlots(TIME_SLOTS);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  /* Handle date selection: fetch availability then advance */
  const handleDateSelect = useCallback(async (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep('time');
    fetchAvailability(date);
  }, [fetchAvailability]);

  /* Validate details step */
  const validateDetails = (): boolean => {
    if (!name.trim()) return false;
    if (!email.trim() || !EMAIL_REGEX.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  /* Submit via mailto */
  const handleConfirm = () => {
    const subject = encodeURIComponent(
      `Booking Request — ${name.trim()} ${company ? `(${company.trim()})` : ''}`
    );
    const body = encodeURIComponent(
      [
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        company ? `Company: ${company.trim()}` : null,
        companyStage ? `Stage: ${companyStage}` : null,
        `Preferred Date: ${selectedDate ? formatDateLong(selectedDate) : ''}`,
        `Preferred Time: ${selectedTime} ET`,
        '',
        context ? `Context:\n${context.trim()}` : null,
      ]
        .filter(Boolean)
        .join('\n')
    );

    window.location.href = `mailto:mina@olunix.com?subject=${subject}&body=${body}`;
    setStep('success');
  };

  /* Copy email fallback */
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('mina@olunix.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: do nothing */
    }
  };

  /* Progress bars */
  const progressSteps = 4; // date, time, details, review (success not counted)
  const activeProgress = Math.min(stepIndex, progressSteps - 1);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={motionProfile.reduced ? { duration: 0 } : { duration: 0.26, ease: EASE_OUT_EXPO }}
          role="dialog"
          aria-modal="true"
          aria-label="Book a call"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[rgba(2,2,2,0.96)] backdrop-blur-md sm:bg-[rgba(2,2,2,0.92)]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={motionProfile.reduced ? { duration: 0 } : { duration: 0.3 }}
          />

          {/* Modal card — full-screen on mobile, centered card on desktop */}
          <motion.div
            ref={modalRef}
            className="relative flex w-full flex-col border-[var(--stroke-soft)] shadow-[0_28px_70px_rgba(0,0,0,0.7)] max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:rounded-none max-sm:border-0 sm:max-w-lg sm:rounded-2xl sm:border"
            style={{
              background: 'linear-gradient(160deg, rgb(11, 11, 11), rgb(24, 14, 40))',
              maxHeight: 'min(100dvh, 760px)',
            }}
            initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: motionProfile.reduced ? 0 : 40 }}
            transition={
              motionProfile.reduced
                ? { duration: 0 }
                : { duration: 0.4, ease: EASE_OUT_EXPO }
            }
          >
            {/* Decorative top gradient line (desktop only) */}
            <div
              className="absolute left-0 right-0 top-0 hidden h-px sm:block"
              style={{
                background:
                  'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.5) 40%, rgba(122,64,242,0.4) 60%, transparent 90%)',
              }}
            />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-dim)] transition-colors hover:text-[var(--text-primary)]"
            >
              <X size={16} />
            </button>

            <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-8 pt-8 sm:px-9 sm:pb-10 sm:pt-11">
              {/* Progress bars */}
              {step !== 'success' && (
                <div className="mb-6 flex gap-1.5">
                  {Array.from({ length: progressSteps }).map((_, i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-colors duration-300"
                      style={{
                        background: i <= activeProgress
                          ? 'rgba(255, 255, 255, 0.5)'
                          : 'rgba(255, 255, 255, 0.1)',
                      }}
                    />
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait" initial={false}>
                {/* ---- Step: Pick a date ---- */}
                {step === 'date' && (
                  <motion.div
                    key="date"
                    initial={{ opacity: 0, x: slideX }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -slideX }}
                    transition={motionProfile.reduced ? { duration: 0 } : { duration: 0.32, ease: EASE_OUT_EXPO }}
                  >
                    <motion.div
                      className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.06)]"
                      initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(0)}
                    >
                      <Calendar size={16} className="text-[var(--text-muted)]" />
                    </motion.div>

                    <motion.h3
                      className="mb-2 mt-5 text-[clamp(1.6rem,5vw,2rem)] leading-[1.1] text-[var(--text-primary)]"
                      style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond'), var(--font-eb-garamond, 'EB Garamond'), Georgia, serif" }}
                      initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(1)}
                    >
                      Pick a date
                    </motion.h3>

                    <motion.p
                      className="mb-6 text-sm text-[var(--text-muted)]"
                      initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(2)}
                    >
                      Select a weekday that works for you.
                    </motion.p>

                    <motion.div
                      className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                      initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(3)}
                    >
                      {weekdays.map((d) => {
                        const isSelected = selectedDate?.toDateString() === d.toDateString();
                        return (
                          <button
                            key={d.toISOString()}
                            type="button"
                            onClick={() => handleDateSelect(d)}
                            className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${
                              isSelected
                                ? 'border-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.12)] text-[var(--text-primary)]'
                                : 'border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.03)] text-[var(--text-muted)] hover:border-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.06)]'
                            }`}
                          >
                            {formatDate(d)}
                          </button>
                        );
                      })}
                    </motion.div>
                  </motion.div>
                )}

                {/* ---- Step: Pick a time ---- */}
                {step === 'time' && (
                  <motion.div
                    key="time"
                    initial={{ opacity: 0, x: slideX }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -slideX }}
                    transition={motionProfile.reduced ? { duration: 0 } : { duration: 0.32, ease: EASE_OUT_EXPO }}
                  >
                    <motion.div
                      className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.06)]"
                      initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(0)}
                    >
                      <Clock size={16} className="text-[var(--text-muted)]" />
                    </motion.div>

                    <motion.h3
                      className="mb-2 mt-5 text-[clamp(1.6rem,5vw,2rem)] leading-[1.1] text-[var(--text-primary)]"
                      style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond'), var(--font-eb-garamond, 'EB Garamond'), Georgia, serif" }}
                      initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(1)}
                    >
                      Pick a time
                    </motion.h3>

                    <motion.p
                      className="mb-6 text-sm text-[var(--text-muted)]"
                      initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(2)}
                    >
                      {selectedDate ? formatDate(selectedDate) : ''} &middot; 30-minute slots, Eastern Time
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(3)}
                    >
                      {loadingSlots ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 size={20} className="animate-spin text-[var(--text-dim)]" />
                          <span className="ml-2 text-sm text-[var(--text-dim)]">Checking availability&hellip;</span>
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="py-8 text-center">
                          <p className="text-sm text-[var(--text-muted)]">
                            {slotsError || 'No available slots on this date.'}
                          </p>
                          <button
                            type="button"
                            onClick={goBack}
                            className="mt-4 inline-flex items-center gap-1.5 text-xs text-[var(--text-dim)] transition-colors hover:text-[var(--text-primary)]"
                          >
                            <ArrowLeft size={12} /> Pick a different date
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {availableSlots.map((slot) => {
                            const isSelected = selectedTime === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => { setSelectedTime(slot); goNext(); }}
                                className={`rounded-lg border px-3 py-2.5 text-center text-sm transition-all ${
                                  isSelected
                                    ? 'border-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.12)] text-[var(--text-primary)]'
                                    : 'border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.03)] text-[var(--text-muted)] hover:border-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.06)]'
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>

                    {!loadingSlots && availableSlots.length > 0 && (
                      <button
                        type="button"
                        onClick={goBack}
                        className="mt-5 inline-flex items-center gap-1.5 text-xs text-[var(--text-dim)] transition-colors hover:text-[var(--text-primary)]"
                      >
                        <ArrowLeft size={12} /> Back
                      </button>
                    )}
                  </motion.div>
                )}

                {/* ---- Step: Your details ---- */}
                {step === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: slideX }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -slideX }}
                    transition={motionProfile.reduced ? { duration: 0 } : { duration: 0.32, ease: EASE_OUT_EXPO }}
                  >
                    <motion.div
                      className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.06)]"
                      initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(0)}
                    >
                      <User size={16} className="text-[var(--text-muted)]" />
                    </motion.div>

                    <motion.h3
                      className="mb-2 mt-5 text-[clamp(1.6rem,5vw,2rem)] leading-[1.1] text-[var(--text-primary)]"
                      style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond'), var(--font-eb-garamond, 'EB Garamond'), Georgia, serif" }}
                      initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(1)}
                    >
                      Your details
                    </motion.h3>

                    <motion.p
                      className="mb-6 text-sm text-[var(--text-muted)]"
                      initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(2)}
                    >
                      So I can come prepared.
                    </motion.p>

                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(3)}
                    >
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name *"
                        required
                        className="w-full rounded-lg border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] transition-colors focus:border-[rgba(255,255,255,0.4)] focus:outline-none"
                      />
                      <div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                          placeholder="Email address *"
                          required
                          className="w-full rounded-lg border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] transition-colors focus:border-[rgba(255,255,255,0.4)] focus:outline-none"
                        />
                        {emailError && (
                          <p className="mt-1.5 text-xs text-red-400/90">{emailError}</p>
                        )}
                      </div>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Company name"
                        className="w-full rounded-lg border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] transition-colors focus:border-[rgba(255,255,255,0.4)] focus:outline-none"
                      />
                      <select
                        value={companyStage}
                        onChange={(e) => setCompanyStage(e.target.value)}
                        className="booking-select w-full rounded-lg border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--text-primary)] transition-colors focus:border-[rgba(255,255,255,0.4)] focus:outline-none"
                      >
                        <option value="">Company stage (optional)</option>
                        {COMPANY_STAGES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <textarea
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="Brief context — what are you working on?"
                        maxLength={500}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-dim)] transition-colors focus:border-[rgba(255,255,255,0.4)] focus:outline-none"
                      />
                    </motion.div>

                    <div className="mt-5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-dim)] transition-colors hover:text-[var(--text-primary)]"
                      >
                        <ArrowLeft size={12} /> Back
                      </button>
                      <button
                        type="button"
                        onClick={() => { if (validateDetails()) goNext(); }}
                        className="inline-flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.12)] px-5 py-3 text-sm tracking-[0.04em] text-[var(--text-primary)] transition-all hover:border-[var(--accent-gold-soft)] hover:bg-[rgba(255,255,255,0.22)]"
                      >
                        Continue <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ---- Step: Review & confirm ---- */}
                {step === 'review' && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: slideX }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -slideX }}
                    transition={motionProfile.reduced ? { duration: 0 } : { duration: 0.32, ease: EASE_OUT_EXPO }}
                  >
                    <motion.div
                      className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.06)]"
                      initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(0)}
                    >
                      <Check size={16} className="text-[var(--text-muted)]" />
                    </motion.div>

                    <motion.h3
                      className="mb-2 mt-5 text-[clamp(1.6rem,5vw,2rem)] leading-[1.1] text-[var(--text-primary)]"
                      style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond'), var(--font-eb-garamond, 'EB Garamond'), Georgia, serif" }}
                      initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(1)}
                    >
                      Review &amp; confirm
                    </motion.h3>

                    <motion.div
                      className="mb-6 mt-5 space-y-2.5 rounded-xl border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.03)] p-5"
                      initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={stepTransition(2)}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-dim)]">Date</span>
                        <span className="text-[var(--text-primary)]">{selectedDate ? formatDate(selectedDate) : ''}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-dim)]">Time</span>
                        <span className="text-[var(--text-primary)]">{selectedTime} ET</span>
                      </div>
                      <div className="h-px bg-[var(--stroke-soft)]" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-dim)]">Name</span>
                        <span className="text-[var(--text-primary)]">{name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-dim)]">Email</span>
                        <span className="text-[var(--text-primary)]">{email}</span>
                      </div>
                      {company && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[var(--text-dim)]">Company</span>
                          <span className="text-[var(--text-primary)]">{company}</span>
                        </div>
                      )}
                      {companyStage && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[var(--text-dim)]">Stage</span>
                          <span className="text-[var(--text-primary)]">{companyStage}</span>
                        </div>
                      )}
                      {context && (
                        <>
                          <div className="h-px bg-[var(--stroke-soft)]" />
                          <p className="text-sm leading-relaxed text-[var(--text-muted)]">{context}</p>
                        </>
                      )}
                    </motion.div>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-dim)] transition-colors hover:text-[var(--text-primary)]"
                      >
                        <ArrowLeft size={12} /> Back
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirm}
                        className="inline-flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.12)] px-5 py-3 text-sm tracking-[0.04em] text-[var(--text-primary)] transition-all hover:border-[var(--accent-gold-soft)] hover:bg-[rgba(255,255,255,0.22)]"
                      >
                        Confirm &amp; send <Mail size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ---- Step: Success ---- */}
                {step === 'success' && (
                  <motion.div
                    key="success"
                    className="flex flex-col items-center py-6 text-center"
                    initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={motionProfile.reduced ? { duration: 0 } : { duration: 0.32, ease: EASE_OUT_EXPO }}
                  >
                    <motion.div
                      className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(255,255,255,0.28)] bg-[rgba(255,255,255,0.08)]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={
                        motionProfile.reduced
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 400, damping: 22, delay: 0.1 }
                      }
                    >
                      <Check size={22} className="text-[var(--text-primary)]" />
                    </motion.div>
                    <h3
                      className="mb-2 text-2xl text-[var(--text-primary)]"
                      style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond'), var(--font-eb-garamond, 'EB Garamond'), Georgia, serif" }}
                    >
                      Request received.
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      I&rsquo;ll confirm within 24 hours.
                    </p>

                    <div className="mt-5 flex items-center gap-2 rounded-lg border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5">
                      <span className="text-sm text-[var(--text-muted)]">mina@olunix.com</span>
                      <button
                        type="button"
                        onClick={copyEmail}
                        aria-label="Copy email address"
                        className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-dim)] transition-colors hover:text-[var(--text-primary)]"
                      >
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-7 text-xs tracking-[0.08em] text-[var(--text-dim)] transition-colors hover:text-[var(--text-primary)]"
                    >
                      Close
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
