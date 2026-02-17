import Image from 'next/image';
import { ArrowUpRight, Fan } from 'lucide-react';
import type { CSSProperties } from 'react';
import FanControllerMiniPreview from '@/components/FanControllerMiniPreview';
import CardGlow from '@/components/ui/card-glow';

function motionDelay(ms: number): CSSProperties {
  return { '--motion-delay': `${ms}ms` } as CSSProperties;
}

export default function WorkSection() {
  return (
    <section data-section-theme="work" className="command-section page-gutter section-block section-band">
      <div className="mx-auto w-full max-w-7xl">
        <p className="command-label" data-motion="sweep-left">
          Selected Work
        </p>
        <div className="mt-5 grid grid-cols-1 gap-7 md:grid-cols-12 md:gap-8 lg:gap-10">
          <article className="feature-card relative overflow-hidden md:col-span-12" data-motion="spotlight" style={motionDelay(120)}>
            <CardGlow />
            <div className="relative z-[1]">
              <div className="feature-header">
                <div className="feature-icon" aria-hidden="true">
                  <Fan size={18} />
                </div>
                <div>
                  <h3 className="text-[clamp(1.4rem,4vw,2rem)] leading-tight text-[var(--text-primary)]">
                    Engine Cooling Fan Controller
                  </h3>
                  <p className="mt-2 text-sm lowercase tracking-[0.14em] text-[var(--accent-oxide)]">Embedded Systems / CAN Bus / Simulator</p>
                </div>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                Built and tested as a physical HCS12 controller, then transformed into an interactive web simulator featuring CAN communication,
                PWM motor control, ADC sensing, and safety override logic.
              </p>

              <div data-motion="rise" style={motionDelay(120)}>
                <FanControllerMiniPreview />
              </div>

              <div className="mt-6" data-motion="rise" style={motionDelay(120)}>
                <a
                  href="/fan-controller/index.html"
                  className="inline-flex items-center gap-2 text-sm lowercase tracking-[0.12em] text-[var(--accent-brass)] transition-colors hover:text-[var(--accent-brass-soft)]"
                >
                  Open Full Simulator
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </article>

          <article className="feature-card relative overflow-hidden md:col-span-12" data-motion="spotlight" style={motionDelay(200)}>
            <CardGlow />
            <div className="relative z-[1]">
              <a
                href="https://habitstogether.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="logo-pill timeline-logo-shell">
                    <Image
                      src="/habits-together-logo.png"
                      alt="Habits Together"
                      width={56}
                      height={56}
                      className="timeline-logo h-10 w-10 object-contain md:h-11 md:w-11"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl text-[var(--text-primary)]">Product Collaborator</h3>
                    <p className="mt-0.5 text-sm lowercase tracking-[0.12em] text-[var(--accent-oxide)]">Habits Together</p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">Collaborative habit-tracking app work focused on accountability loops and consistent team execution.</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-xs lowercase tracking-[0.14em] text-[var(--text-dim)]">
                  <span>Summer 2024</span>
                  <ArrowUpRight size={13} className="shrink-0 text-[var(--accent-gold-soft)]" />
                </div>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
