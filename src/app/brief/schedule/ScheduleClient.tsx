'use client';

import { T, sectionLabel, glassCard, mono, heading } from '@/lib/brief-styles';
import type { CalendarEvent, AgentReport } from '@/lib/school-events';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  school: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
  business: { bg: 'rgba(168,85,247,0.15)', text: '#c084fc' },
  fitness: { bg: 'rgba(74,222,128,0.15)', text: '#4ade80' },
  personal: { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24' },
  admin: { bg: 'rgba(156,163,175,0.15)', text: '#9ca3af' },
};

function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function ScheduleClient({ events, narrative }: { events: CalendarEvent[]; narrative: AgentReport | null }) {
  const grouped: Record<number, CalendarEvent[]> = {};
  for (const event of events) {
    const d = new Date(event.startTime);
    const day = (d.getDay() + 6) % 7;
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(event);
  }

  const today = new Date();
  const todayDay = (today.getDay() + 6) % 7;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={sectionLabel}>Schedule</div>
        <h2 style={heading}>This Week</h2>
      </div>

      {narrative && (
        <div style={{ ...glassCard, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 12, right: 12, height: 1, background: `linear-gradient(90deg, transparent, ${T.goldDim}, transparent)` }} />
          <h3 style={{ ...sectionLabel, marginBottom: '8px' }}>Week Overview</h3>
          <p style={{ fontSize: '14px', color: T.textSecondary, lineHeight: 1.7, whiteSpace: 'pre-line', fontStyle: 'italic' }}>{narrative.content}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }} className="brief-week-grid">
        {DAY_NAMES.map((name, i) => {
          const dayEvents = grouped[i] ?? [];
          const isToday = i === todayDay;
          const totalHours = dayEvents.reduce((sum, e) => sum + (new Date(e.endTime).getTime() - new Date(e.startTime).getTime()) / 3600000, 0);
          const overloaded = totalHours >= 8;

          return (
            <div key={name} style={{ ...glassCard, padding: '14px', borderTop: `2px solid ${isToday ? 'rgba(201,168,76,0.3)' : T.borderDefault}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ ...mono, fontSize: '12px', fontWeight: 500, color: isToday ? T.goldBright : T.textMuted }}>{name}</span>
                {overloaded && <span style={{ fontSize: '12px', color: T.statusYellow, background: 'rgba(250,204,21,0.1)', padding: '2px 6px', borderRadius: '4px' }}>8h+</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dayEvents.length === 0 ? (
                  <p style={{ fontSize: '12px', color: T.goldDim }}>Free</p>
                ) : (
                  dayEvents.map((event) => (
                    <div key={event.id} style={{ fontSize: '12px' }}>
                      <p style={{ color: T.textPrimary, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <span style={{ ...mono, fontSize: '11px', color: T.textMuted }}>{event.isAllDay ? 'All day' : formatTime(event.startTime)}</span>
                        {event.category && (
                          <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '9999px', background: CATEGORY_COLORS[event.category]?.bg ?? CATEGORY_COLORS.personal.bg, color: CATEGORY_COLORS[event.category]?.text ?? CATEGORY_COLORS.personal.text }}>{event.category}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .brief-week-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
