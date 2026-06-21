import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import CardGlow from '@/components/ui/card-glow';
import { motionDelay } from '@/lib/utils';
import SectionHeading from '@/components/home/SectionHeading';
import CountUpStat from '@/components/home/CountUpStat';

const metrics = [
  {
    value: 9,
    suffix: '',
    label: 'Interactive modules shipped in Vantage',
  },
  {
    value: 15,
    suffix: '+',
    label: 'Long-form essays on AI startup growth',
  },
  {
    value: 4,
    suffix: '',
    label: 'Products built and shipped end-to-end',
  },
];

export default function ProofSection() {
  return (
    <section data-section-theme="authority" className="command-section page-gutter section-block">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeading index="02" label="By the numbers" />

        <div className="proof-strip mt-6">
          {metrics.map((item, i) => (
            <article
              key={item.label}
              className="proof-card relative overflow-hidden"
              data-motion="rise"
              style={motionDelay(100 + i * 80)}
            >
              <CardGlow spread={14} proximity={42} borderWidth={1.1} />
              <div className="relative z-[1]">
                <p className="proof-metric"><CountUpStat value={item.value} suffix={item.suffix} /></p>
                <p className="proof-label">{item.label}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm" data-motion="rise" style={motionDelay(420)}>
          <a
            href="https://olunix.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[var(--accent-brass)] transition-colors hover:text-[var(--accent-brass-soft)]"
          >
            See Vantage in action
            <ArrowUpRight size={14} />
          </a>
          <span className="text-[var(--text-dim)]">·</span>
          <Link
            href="/positioning-grader"
            className="inline-flex items-center gap-2 text-[var(--accent-brass)] transition-colors hover:text-[var(--accent-brass-soft)]"
          >
            Try the free Positioning Grader
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
