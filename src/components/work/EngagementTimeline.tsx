import type { CaseStudyPhase } from '@/data/case-studies';
import { motionDelay } from '@/lib/utils';

interface EngagementTimelineProps {
  phases: CaseStudyPhase[];
  baseDelay?: number;
}

export default function EngagementTimeline({ phases, baseDelay = 0 }: EngagementTimelineProps) {
  return (
    <div className="engagement-timeline">
      <div className="engagement-timeline-guide hidden md:block" aria-hidden="true" />
      <ol className="list-none p-0 m-0">
        {phases.map((phase, i) => (
          <li
            key={phase.title}
            className="engagement-phase"
            data-motion="rise"
            style={motionDelay(baseDelay + i * 90)}
          >
            <div className="engagement-phase-dot hidden md:block" aria-hidden="true" />
            <div className="flex items-baseline gap-3">
              <span className="text-xs text-[var(--accent-purple-soft)] font-medium tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h4 className="text-base text-[var(--text-primary)] font-medium">{phase.title}</h4>
              <span className="ml-auto shrink-0 rounded-full border border-[var(--stroke-soft)] bg-[rgba(255,255,255,0.08)] px-2 py-0.5 text-xs text-[var(--text-dim)]">
                {phase.duration}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-[var(--text-muted)] leading-relaxed md:pl-7">
              {phase.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
