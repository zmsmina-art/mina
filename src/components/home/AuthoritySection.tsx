import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import CardGlow from '@/components/ui/card-glow';

function motionDelay(ms: number): CSSProperties {
  return { '--motion-delay': `${ms}ms` } as CSSProperties;
}

const authorityTimeline = [
  {
    title: 'Founder & CEO',
    org: 'Olunix',
    period: 'Sep 2024 - Present',
    detail: 'Marketing and consulting for AI startups with an execution-first operating model.',
    logo: '/olunix.svg',
    logoAlt: 'Olunix',
    href: 'https://olunix.com',
    logoClassName: 'timeline-logo h-10 w-10 object-contain md:h-11 md:w-11',
  },
  {
    title: 'Deal Partner',
    org: 'Boardy',
    period: 'Jan 2026 - Present',
    detail: 'Building high-leverage founder connections and business development pathways.',
    logo: '/boardy-logo.png',
    logoAlt: 'Boardy',
    href: 'https://boardy.ai',
    logoClassName: 'timeline-logo h-10 w-10 object-contain md:h-11 md:w-11',
  },
  {
    title: 'Product Collaborator',
    org: 'Habits Together',
    period: 'Summer 2024',
    detail: 'Collaborative habit-tracking app work focused on accountability loops and consistent team execution.',
    logo: '/habits-together-logo.png',
    logoAlt: 'Habits Together',
    href: 'https://habitstogether.app',
    logoClassName: 'timeline-logo h-10 w-10 object-contain md:h-11 md:w-11',
  },
  {
    title: 'Customer Service Attendant',
    org: 'Milton Toyota',
    period: 'Aug 2022 - Aug 2024',
    detail: 'Two years in high-volume frontline operations, customer communication, and consistency.',
    logo: '/toyota-logo.png',
    logoAlt: 'Toyota',
    href: 'https://miltontoyota.com',
    logoClassName: 'timeline-logo h-8 w-11 object-contain md:h-9 md:w-11 invert brightness-[1.8]',
  },
];

export default function AuthoritySection() {
  return (
    <section id="experience" data-section-theme="authority" className="command-section page-gutter section-block">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-9 md:grid-cols-12 md:gap-8 lg:gap-12">
        <div className="md:col-span-5 lg:col-span-4">
          <p className="command-label" data-motion="sweep-left">
            Authority
          </p>
          <h2
            className="home-heading-xl mt-4 max-w-xl text-[clamp(2.1rem,7vw,3.1rem)] leading-[1.05] text-[var(--text-primary)]"
            data-motion="rise"
            style={motionDelay(90)}
          >
            Engineering precision, market command.
          </h2>

          <article className="authority-intro-card relative mt-8 overflow-hidden" data-motion="rise" style={motionDelay(180)}>
            <CardGlow />
            <div className="relative z-[1] grid gap-4">
              <p>
                I&apos;m the Founder and CEO of <span className="text-[var(--text-primary)]">Olunix</span>, where I help AI startups create traction through strategic clarity and disciplined execution.
              </p>
              <p>
                My operating style blends technical systems thinking with narrative design, shaped by real-world execution at <span className="text-[var(--text-primary)]">Toyota</span>, founder work at <span className="text-[var(--text-primary)]">Olunix</span>, and ecosystem collaboration through <span className="text-[var(--text-primary)]">Boardy</span>.
              </p>
              <p className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <MapPin size={14} />
                Toronto, Canada
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-sm text-[var(--accent-brass)] transition-colors hover:text-[var(--accent-brass-soft)]">
                Read full background
                <ArrowRight size={14} />
              </Link>
            </div>
          </article>
        </div>

        <div className="relative md:col-span-7 lg:col-span-8">
          <div className="timeline-guide hidden md:block" aria-hidden="true" data-motion="rail" />
          <div className="timeline-stack">
            {authorityTimeline.map((item, index) => (
              <article
                key={item.title + item.org}
                className="timeline-item"
                data-motion="timeline-card"
                style={motionDelay(210)}
              >
                <div className="timeline-dot" aria-hidden="true" />
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="timeline-item-shell timeline-item-shell--link relative overflow-hidden"
                >
                  <CardGlow spread={16} proximity={48} />
                  <div className="relative z-[1] flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="timeline-content flex items-start gap-4">
                      <div className="logo-pill timeline-logo-shell">
                        <Image
                          src={item.logo}
                          alt={item.logoAlt}
                          width={56}
                          height={56}
                          className={item.logoClassName}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl text-[var(--text-primary)]">{item.title}</h3>
                        <p className="mt-0.5 text-sm lowercase tracking-[0.12em] text-[var(--accent-oxide)]">{item.org}</p>
                        <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{item.detail}</p>
                      </div>
                    </div>
                    <div className="timeline-period flex items-center gap-2 text-xs lowercase tracking-[0.14em] text-[var(--text-dim)]">
                      <span>{item.period}</span>
                      <ArrowUpRight size={13} className="shrink-0 text-[var(--accent-gold-soft)]" />
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
