'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { CaseStudy } from '@/data/case-studies';
import { motionDelay } from '@/lib/utils';
import AnimatedCounter from '@/components/work/AnimatedCounter';
import EngagementTimeline from '@/components/work/EngagementTimeline';
import CaseStudyCard from '@/components/work/CaseStudyCard';

interface WorkPageClientProps {
  hero: CaseStudy;
  supporting: CaseStudy[];
}

export default function WorkPageClient({ hero, supporting }: WorkPageClientProps) {
  return (
    <div className="marketing-main site-theme">
      <div className="page-gutter section-block mx-auto w-full max-w-7xl">
        {/* Back link */}
        <Link
          href="/"
          className="mb-10 flex w-fit items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          data-motion="fade"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>

        {/* Page header */}
        <p className="command-label" data-motion="sweep-left" style={motionDelay(60)}>
          Case Studies
        </p>
        <h1
          className="home-heading-xl mt-4 max-w-3xl text-[var(--text-primary)]"
          data-motion="rise"
          style={motionDelay(120)}
        >
          Real work, real outcomes. Here&rsquo;s what partnering with Olunix looks like.
        </h1>
        <p
          className="mt-4 max-w-2xl text-[var(--text-muted)]"
          data-motion="rise"
          style={motionDelay(180)}
        >
          Each engagement is tailored to the client&rsquo;s stage, market, and goals. These case studies show the thinking behind the results.
        </p>

        {/* Hero case study */}
        <div className="mt-12" data-motion="flip" style={motionDelay(240)}>
          <CaseStudyCard variant="hero">
            <p className="text-site-kicker tracking-[0.2em] text-[var(--text-dim)]">
              Featured Engagement
            </p>
            <h2 className="mt-2 text-2xl text-[var(--text-primary)]">{hero.title}</h2>
            <p className="mt-1 text-sm text-[var(--accent-purple-soft)]">{hero.subtitle}</p>

            <div className="mt-5 space-y-3 text-sm text-[var(--text-muted)]">
              <p>
                <span className="text-[var(--accent-brass-soft)]">Problem:</span> {hero.problem}
              </p>
              <p>
                <span className="text-[var(--accent-brass-soft)]">Approach:</span> {hero.approach}
              </p>
              <p>
                <span className="text-[var(--accent-brass-soft)]">Result:</span> {hero.result}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {hero.metrics.map((metric) => (
                <AnimatedCounter
                  key={metric.label}
                  value={metric.value}
                  display={metric.display}
                  label={metric.label}
                />
              ))}
            </div>

            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium text-[var(--text-primary)]">Engagement Timeline</h3>
              <EngagementTimeline phases={hero.phases} baseDelay={400} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {hero.tags.map((tag) => (
                <span key={tag} className="tag-chip">{tag}</span>
              ))}
            </div>
          </CaseStudyCard>
        </div>

        {/* Supporting case studies */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {supporting.map((study, i) => (
            <div key={study.slug} data-motion="flip" style={motionDelay(300 + i * 90)}>
              <CaseStudyCard variant="supporting">
                <h3 className="text-xl text-[var(--text-primary)]">{study.title}</h3>
                <p className="mt-1 text-xs text-[var(--accent-purple-soft)]">{study.subtitle}</p>

                <div className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
                  <p>
                    <span className="text-[var(--accent-brass-soft)]">Problem:</span> {study.problem}
                  </p>
                  <p>
                    <span className="text-[var(--accent-brass-soft)]">Result:</span> {study.result}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {study.metrics.map((metric) => (
                    <AnimatedCounter
                      key={metric.label}
                      value={metric.value}
                      display={metric.display}
                      label={metric.label}
                    />
                  ))}
                </div>

                <div className="mt-4">
                  <EngagementTimeline phases={study.phases} baseDelay={420 + i * 90} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {study.tags.map((tag) => (
                    <span key={tag} className="tag-chip">{tag}</span>
                  ))}
                </div>
              </CaseStudyCard>
            </div>
          ))}
        </div>

        {/* CTA band */}
        <div
          className="mt-14 border-t border-[var(--stroke-soft)] pt-10 text-center"
          data-motion="rise"
          style={motionDelay(500)}
        >
          <p className="text-lg text-[var(--text-muted)]">
            Ready to see what this looks like for your business?
          </p>
          <a
            href="mailto:mina@olunix.com?subject=Project%20Inquiry%20for%20Mina%20Mankarious"
            className="accent-btn mt-4 inline-flex"
          >
            Start a conversation
            <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}
