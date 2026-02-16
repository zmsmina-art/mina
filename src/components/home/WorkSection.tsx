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
        </div>
      </div>
    </section>
  );
}
