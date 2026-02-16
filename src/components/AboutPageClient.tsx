import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowLeft, ExternalLink, MapPin } from 'lucide-react';
import CardGlow from '@/components/ui/card-glow';

function motionDelay(ms: number): CSSProperties {
  return { '--motion-delay': `${ms}ms` } as CSSProperties;
}

const externalLinks = [
  { label: 'Olunix', url: 'https://olunix.com' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/mina-mankarious' },
  { label: 'X / Twitter', url: 'https://x.com/minamnkarious' },
  { label: 'GitHub', url: 'https://github.com/minamankarious' },
  { label: 'Medium', url: 'https://mankarious.medium.com' },
  { label: 'Crunchbase', url: 'https://www.crunchbase.com/person/mina-mankarious' },
];

const dossierFacts = [
  { label: 'Role', value: 'Founder & CEO, Olunix' },
  { label: 'Focus', value: 'AI Startup Positioning + Growth' },
  { label: 'Education', value: 'Engineering, McMaster' },
  { label: 'Base', value: 'Toronto, Canada' },
];

export default function AboutPageClient() {
  return (
    <main id="main-content" data-section-theme="about" className="page-enter">
      {/* ── Hero ── */}
      <section className="command-section page-gutter section-block" data-section-theme="about-hero">
        <div className="mx-auto w-full max-w-7xl">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            data-motion="rise"
            style={motionDelay(60)}
          >
            <ArrowLeft size={14} />
            Back home
          </Link>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center md:gap-8 lg:gap-12">
            {/* Left column — text */}
            <div className="relative z-[2] md:col-span-7 lg:col-span-8">
              <p className="command-label mb-0" data-motion="rise" style={motionDelay(100)}>
                About
              </p>

              <h1
                className="home-heading-xl mt-4"
                data-motion="rise"
                style={motionDelay(160)}
              >
                Mina Mankarious
              </h1>

              <p
                className="mt-4 text-base text-[var(--accent-brass-soft)] sm:text-lg"
                data-motion="rise"
                style={motionDelay(220)}
              >
                Founder &amp; CEO of Olunix
              </p>

              <p
                className="mt-2 inline-flex items-center gap-2 text-sm text-[var(--text-muted)]"
                data-motion="rise"
                style={motionDelay(260)}
              >
                <MapPin size={14} />
                Toronto, Canada
              </p>

              <p
                className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg"
                data-motion="rise"
                style={motionDelay(320)}
              >
                Entrepreneur operating at the intersection of engineering systems thinking and startup marketing execution.
              </p>

              {/* Stat cards */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-motion="rise" style={motionDelay(400)}>
                {dossierFacts.map((fact) => (
                  <article key={fact.label} className="stat-card relative overflow-hidden">
                    <CardGlow spread={14} proximity={42} borderWidth={1.1} />
                    <div className="relative z-[1]">
                      <p className="stat-value">{fact.value}</p>
                      <p className="stat-label">{fact.label}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Right column — headshot */}
            <aside className="command-aside md:col-span-5 lg:col-span-4" data-motion="sweep-right" style={motionDelay(300)}>
              <div className="command-aside-frame">
                <Image
                  src="/headshot.png"
                  alt="Mina Mankarious"
                  width={320}
                  height={420}
                  className="block h-auto w-full object-cover object-top"
                  priority
                />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Biography ── */}
      <section className="command-section page-gutter section-block" data-section-theme="about-story">
        <div className="mx-auto w-full max-w-3xl">
          <article className="article-prose text-[0.98rem] sm:text-[1.04rem]" data-motion="rise" style={motionDelay(460)}>
            <p>
              Mina Mankarious is a Canadian entrepreneur, founder and CEO of <a href="https://olunix.com" target="_blank" rel="noopener noreferrer">Olunix</a>,
              a marketing and consulting firm headquartered in Toronto, Ontario. Born in Egypt and raised in Canada, he has
              built a career at the intersection of engineering and marketing, helping technology companies, especially AI startups,
              develop strategic growth systems.
            </p>

            <p className="command-label mb-0 mt-10" data-motion="rise" style={motionDelay(500)}>Early Life &amp; Education</p>
            <p>
              Mina Mankarious was born in Egypt and immigrated to Canada at the age of eight. Growing up between two cultures gave
              him an early understanding of cross-cultural communication and adaptability.
            </p>
            <p>
              He is currently in his final year studying <strong>Automotive Engineering Technology</strong> at{' '}
              <a href="https://mcmaster.ca" target="_blank" rel="noopener noreferrer">McMaster University</a> in Hamilton, Ontario.
              His engineering education shaped a systems-oriented mindset he applies to marketing strategy.
            </p>

            <p className="command-label mb-0 mt-10" data-motion="rise" style={motionDelay(540)}>Career</p>

            <h3>Early Ventures</h3>
            <p>
              Mankarious began his entrepreneurial journey during high school by founding <strong>ZMS Media</strong>
              and expanded into e-commerce work during the COVID-19 period.
            </p>

            <h3>Toyota</h3>
            <p>
              From August 2022 to August 2024, he worked at{' '}
              <a href="https://miltontoyota.com" target="_blank" rel="noopener noreferrer">Milton Toyota</a>,
              where he handled high-volume customer interactions in a fast-paced dealership environment.
            </p>

            <h3>Olunix</h3>
            <p>
              In September 2024, Mankarious founded <strong>Olunix</strong> alongside his CTO and CMO.
              Originally launched as GrowByte Media, the company{' '}
              <Link href="/articles/how-we-rebranded-from-growbyte-to-olunix">rebranded to Olunix</Link>
              {' '}as its focus shifted toward AI startups and technology companies.
            </p>

            <h3>Boardy</h3>
            <p>
              Since January 2026, Mankarious has served as a <strong>Deal Partner at{' '}
              <a href="https://boardy.ai" target="_blank" rel="noopener noreferrer">Boardy</a></strong>,
              expanding professional networks and creating business development opportunities.
            </p>

            <p className="command-label mb-0 mt-10" data-motion="rise" style={motionDelay(580)}>Approach &amp; Philosophy</p>
            <p>
              Mankarious is known for applying an{' '}
              <Link href="/articles/from-engineering-to-marketing-why-systems-thinking-matters">engineering-driven approach to marketing</Link>.
              He emphasizes measurable outcomes over vanity metrics.
            </p>
            <p>
              He has written extensively on{' '}
              <Link href="/articles/how-ai-startups-should-think-about-marketing">AI startup marketing strategy</Link>,{' '}
              <Link href="/articles/why-most-startups-waste-money-on-marketing">startup marketing spend optimization</Link>, and{' '}
              <Link href="/articles/building-a-business-in-toronto-as-a-student">student entrepreneurship in Toronto</Link>.
            </p>

            <p className="command-label mb-0 mt-10" data-motion="rise" style={motionDelay(620)}>Community Involvement</p>
            <p>
              Mankarious is an intern at{' '}
              <a href="https://hopeoakville.ca" target="_blank" rel="noopener noreferrer">Hope Bible Church</a>
              {' '}in Oakville, Ontario, and has contributed to open-source projects like{' '}
              <a href="https://habitstogether.app" target="_blank" rel="noopener noreferrer">Habits Together</a>.
            </p>
          </article>
        </div>
      </section>

      {/* ── External Links ── */}
      <section className="command-section page-gutter pb-20 md:pb-24">
        <div className="mx-auto w-full max-w-3xl border-t border-[var(--stroke-soft)] pt-8" data-motion="rise" style={motionDelay(680)}>
          <p className="command-label mb-4">Elsewhere</p>
          <div className="flex flex-wrap gap-3">
            {externalLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ghost-btn"
              >
                {link.label}
                <ExternalLink size={12} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
