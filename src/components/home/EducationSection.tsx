import Image from 'next/image';
import { ArrowUpRight, GraduationCap } from 'lucide-react';
import CardGlow from '@/components/ui/card-glow';
import { motionDelay } from '@/lib/utils';


export default function EducationSection() {
  return (
    <section id="education" data-section-theme="education" className="command-section page-gutter section-block">
      <div className="mx-auto w-full max-w-7xl">
        <p className="command-label" data-motion="sweep-left">
          Education
        </p>

        <article className="support-card relative mt-6 overflow-hidden" data-motion="rise" style={motionDelay(120)}>
          <CardGlow spread={16} proximity={48} />
          <div className="relative z-[1]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="logo-pill timeline-logo-shell" data-motion="crest" style={motionDelay(190)}>
                  <Image
                    src="/mcmaster-university-crest.png"
                    alt="McMaster University crest"
                    width={64}
                    height={64}
                    className="timeline-logo h-12 w-12 object-contain md:h-14 md:w-14 drop-shadow-[0_0_6px_rgba(212,175,55,0.3)]"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[clamp(1.35rem,3.2vw,1.95rem)] leading-tight text-[var(--text-primary)]">
                    McMaster University
                  </h3>
                  <p className="mt-1 text-sm lowercase tracking-[0.12em] text-[var(--accent-oxide)]">
                    Automotive Engineering Technology
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                    Degree focus in automotive systems, controls, and practical engineering execution.
                  </p>
                </div>
              </div>

              <p className="text-xs lowercase tracking-[0.14em] text-[var(--text-dim)]">
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap size={13} />
                  Degree
                </span>
              </p>
            </div>

            <div className="mt-5 border-t border-[var(--stroke-soft)] pt-4" data-motion="rise" style={motionDelay(260)}>
              <a
                href="https://www.mcmaster.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm lowercase tracking-[0.12em] text-[var(--accent-brass)] transition-colors hover:text-[var(--accent-brass-soft)]"
              >
                Visit university
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
