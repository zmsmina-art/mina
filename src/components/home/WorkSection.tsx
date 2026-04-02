import Image from 'next/image';
import { ArrowUpRight, Fan, Layers, Terminal } from 'lucide-react';
import CardGlow from '@/components/ui/card-glow';
import { motionDelay } from '@/lib/utils';


export default function WorkSection() {
  return (
    <section data-section-theme="work" className="command-section page-gutter section-block section-band">
      <div className="mx-auto w-full max-w-7xl">
        <p className="command-label" data-motion="sweep-left">
          Projects
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {/* ── Vantage: hero project ── */}
          <article className="feature-card relative overflow-hidden md:col-span-2" data-motion="spotlight" style={motionDelay(120)}>
            <CardGlow />
            <div className="relative z-[1]">
              <div className="feature-header">
                <div className="feature-icon" aria-hidden="true">
                  <Layers size={18} />
                </div>
                <div>
                  <h2 className="text-[clamp(1.4rem,4vw,2rem)] leading-tight text-[var(--text-primary)]">
                    Olunix Vantage
                  </h2>
                  <p className="mt-2 text-sm lowercase tracking-[0.14em] text-[var(--accent-oxide)]">Positioning Lab / SaaS / AI Startups</p>
                </div>
              </div>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-[rgba(122,64,242,0.25)] bg-[rgba(122,64,242,0.08)] px-3 py-1 text-xs tracking-wide text-[var(--accent-purple-soft)]">
                9 modules shipped &middot; 3-phase framework &middot; Stripe-integrated
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                A self-serve positioning lab for AI startups. 9 interactive modules across 3 phases: Discover, Define, and Deploy.
                Founders work through guided exercises to build clear market narratives, ICPs, and competitive positioning without hiring a consultant.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="tag-chip">Next.js</span>
                <span className="tag-chip">Stripe</span>
                <span className="tag-chip">Drizzle ORM</span>
                <span className="tag-chip">Neon</span>
              </div>
              <div className="mt-6">
                <a
                  href="https://olunix.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm lowercase tracking-[0.12em] text-[var(--accent-brass)] transition-colors hover:text-[var(--accent-brass-soft)]"
                >
                  Visit Olunix
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </article>

          {/* ── Ovix: second hero project ── */}
          <article className="feature-card relative overflow-hidden" data-motion="spotlight" style={motionDelay(200)}>
            <CardGlow />
            <div className="relative z-[1]">
              <div className="feature-header">
                <div className="feature-icon" aria-hidden="true">
                  <Terminal size={18} />
                </div>
                <div>
                  <h2 className="text-[clamp(1.2rem,3vw,1.6rem)] leading-tight text-[var(--text-primary)]">
                    Ovix
                  </h2>
                  <p className="mt-1.5 text-sm lowercase tracking-[0.14em] text-[var(--accent-oxide)]">AI Coding Agent</p>
                </div>
              </div>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-[rgba(122,64,242,0.25)] bg-[rgba(122,64,242,0.08)] px-3 py-1 text-xs tracking-wide text-[var(--accent-purple-soft)]">
                Multi-model architecture &middot; Azure-deployed
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                Multi-model AI coding agent built on GPT-5.4 (reasoning) and GPT-5.3-codex (code generation).
                CLI tool with dev and prod workflows, code review, and autonomous task execution.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="tag-chip">GPT-5.4</span>
                <span className="tag-chip">Azure</span>
                <span className="tag-chip">CLI</span>
              </div>
            </div>
          </article>

          {/* ── Fan Controller: secondary ── */}
          <article className="feature-card relative overflow-hidden" data-motion="spotlight" style={motionDelay(280)}>
            <CardGlow />
            <div className="relative z-[1]">
              <div className="feature-header">
                <div className="feature-icon" aria-hidden="true">
                  <Fan size={18} />
                </div>
                <div>
                  <h2 className="text-[clamp(1.2rem,3vw,1.6rem)] leading-tight text-[var(--text-primary)]">
                    Engine Cooling Fan Controller
                  </h2>
                  <p className="mt-1.5 text-sm lowercase tracking-[0.14em] text-[var(--accent-oxide)]">Embedded Systems / Simulator</p>
                </div>
              </div>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-[rgba(122,64,242,0.25)] bg-[rgba(122,64,242,0.08)] px-3 py-1 text-xs tracking-wide text-[var(--accent-purple-soft)]">
                Hardware + web simulator &middot; Real-time CAN bus
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                Physical HCS12 controller turned interactive web simulator. CAN communication, PWM motor control, ADC sensing, and safety override logic.
              </p>
              <div className="mt-4">
                <a
                  href="/fan-controller/index.html"
                  className="inline-flex items-center gap-2 text-sm lowercase tracking-[0.12em] text-[var(--accent-brass)] transition-colors hover:text-[var(--accent-brass-soft)]"
                >
                  Open simulator
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </article>

          {/* ── Habits Together: compact ── */}
          <article className="feature-card relative overflow-hidden md:col-span-2" data-motion="spotlight" style={motionDelay(340)}>
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
                      alt="Habits Together logo"
                      width={56}
                      height={56}
                      loading="lazy"
                      sizes="56px"
                      className="timeline-logo h-10 w-10 object-contain md:h-11 md:w-11"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl text-[var(--text-primary)]">Product Collaborator</h2>
                    <p className="mt-0.5 text-sm lowercase tracking-[0.12em] text-[var(--accent-oxide)]">Habits Together</p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">Collaborative habit-tracking app focused on accountability loops and consistent team execution.</p>
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
