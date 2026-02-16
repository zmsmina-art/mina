import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowLeft, ExternalLink, MapPin } from 'lucide-react';

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
  { label: 'Primary Role', value: 'Founder & CEO, Olunix' },
  { label: 'Current Focus', value: 'AI Startup Positioning + Growth Systems' },
  { label: 'Academic Track', value: 'Automotive Engineering Technology, McMaster' },
  { label: 'Base', value: 'Toronto, Canada' },
];

export default function AboutPageClient() {
  return (
    <main id="main-content" data-section-theme="about" className="page-enter page-gutter pb-20 pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto w-full max-w-7xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          data-motion="rise"
          style={motionDelay(60)}
        >
          <ArrowLeft size={14} />
          Back home
        </Link>

        <section className="dossier-header" data-motion="rise" data-section-theme="about-hero" style={motionDelay(120)}>
          <div className="dossier-header-media">
            <Image
              src="/headshot.png"
              alt="Mina Mankarious"
              width={260}
              height={320}
              className="h-auto w-full rounded-xl object-cover object-top"
              priority
            />
          </div>
          <div>
            <p className="command-label mb-0">About</p>
            <h1 className="mt-3 text-[clamp(2.1rem,8vw,3.7rem)] leading-[1.02] text-[var(--text-primary)]">Mina Mankarious</h1>
            <p className="mt-4 text-base text-[var(--accent-brass-soft)] sm:text-lg">Founder &amp; CEO of Olunix</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <MapPin size={14} />
              Toronto, Canada
            </p>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
              Entrepreneur operating at the intersection of engineering systems thinking and startup marketing execution.
            </p>
          </div>
        </section>

        <section className="dossier-layout mt-10" data-section-theme="about-story">
          <aside className="dossier-rail" data-motion="sweep-left" style={motionDelay(200)}>
            <article className="dossier-rail-card">
              <p className="text-[0.66rem] lowercase tracking-[0.18em] text-[var(--text-dim)]">Dossier Facts</p>
              <div className="mt-4 space-y-3 text-xs text-[var(--text-muted)]">
                {dossierFacts.map((fact) => (
                  <div key={fact.label} className="dossier-fact-row">
                    <span>{fact.label}</span>
                    <span className="text-right text-[var(--text-primary)]">{fact.value}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="dossier-rail-card mt-4">
              <p className="text-[0.66rem] lowercase tracking-[0.18em] text-[var(--text-dim)]">External</p>
              <div className="mt-4 flex flex-wrap gap-2.5">
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
            </article>
          </aside>

          <article className="article-prose text-[0.98rem] sm:text-[1.04rem]" data-motion="rise" style={motionDelay(240)}>
            <p>
              Mina Mankarious is a Canadian entrepreneur, founder and CEO of <a href="https://olunix.com" target="_blank" rel="noopener noreferrer">Olunix</a>,
              a marketing and consulting firm headquartered in Toronto, Ontario. Born in Egypt and raised in Canada, he has
              built a career at the intersection of engineering and marketing, helping technology companies, especially AI startups,
              develop strategic growth systems.
            </p>

            <h2>Early Life and Education</h2>
            <p>
              Mina Mankarious was born in Egypt and immigrated to Canada at the age of eight. Growing up between two cultures gave
              him an early understanding of cross-cultural communication and adaptability.
            </p>
            <p>
              He is currently in his final year studying <strong>Automotive Engineering Technology</strong> at{' '}
              <a href="https://mcmaster.ca" target="_blank" rel="noopener noreferrer">McMaster University</a> in Hamilton, Ontario.
              His engineering education shaped a systems-oriented mindset he applies to marketing strategy.
            </p>

            <h2>Career</h2>

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

            <h2>Approach and Philosophy</h2>
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

            <h2>Community Involvement</h2>
            <p>
              Mankarious is an intern at{' '}
              <a href="https://hopeoakville.ca" target="_blank" rel="noopener noreferrer">Hope Bible Church</a>
              {' '}in Oakville, Ontario, and has contributed to open-source projects like{' '}
              <a href="https://habitstogether.app" target="_blank" rel="noopener noreferrer">Habits Together</a>.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
