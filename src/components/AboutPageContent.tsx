import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import CardGlow from '@/components/ui/card-glow';
import { motionDelay } from '@/lib/utils';


const elsewhereLinks = [
  { label: 'Olunix', url: 'https://olunix.com' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/mina-mankarious' },
  { label: 'X / Twitter', url: 'https://x.com/minamnkarious' },
  { label: 'GitHub', url: 'https://github.com/zmsmina-art' },
  { label: 'Medium', url: 'https://mankarious.medium.com' },
  { label: 'Crunchbase', url: 'https://www.crunchbase.com/person/mina-mankarious' },
];

const milestones = [
  { year: '2016', text: 'First marketing projects in high school' },
  { year: '2020', text: 'E-commerce work during COVID' },
  { year: '2022', text: 'Joined Toyota, two years in frontline operations' },
  { year: '2024', text: 'Founded Olunix (originally GrowByte Media)' },
  { year: '2025', text: 'Ministry intern at Hope Bible Church' },
  { year: '2026', text: 'Deal Partner at Boardy, final year at McMaster' },
];

export default function AboutPageContent() {
  return (
    <main id="main-content" data-section-theme="about" className="page-enter marketing-main site-theme pt-20">

      {/* ── Hero ── */}
      <section className="command-section page-gutter section-block" data-section-theme="about-hero">
        <div className="mx-auto w-full max-w-5xl">

          <Link
            href="/"
            className="mb-12 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            data-motion="rise"
            style={motionDelay(60)}
          >
            <ArrowLeft size={14} />
            Back home
          </Link>

          {/* Photo + name — stacked on mobile, side by side on desktop */}
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-end md:gap-12">

            {/* Headshot */}
            <div
              className="about-hero-photo shrink-0"
              data-motion="rise"
              style={motionDelay(120)}
            >
              <div className="command-aside-frame about-photo-frame">
                <Image
                  src="/headshot.png"
                  alt="Mina Mankarious"
                  width={280}
                  height={360}
                  className="block h-auto w-full object-cover object-top"
                  priority
                />
              </div>
            </div>

            {/* Name + intro */}
            <div className="flex-1 text-center md:text-left">
              <p className="command-label mb-3" data-motion="rise" style={motionDelay(180)}>
                About
              </p>
              <h1
                className="home-heading-xl"
                data-motion="rise"
                style={motionDelay(240)}
              >
                Mina Mankarious
              </h1>
              <p
                className="mt-3 text-[var(--accent-brass-soft)]"
                data-motion="rise"
                style={motionDelay(300)}
              >
                Founder &amp; CEO of{' '}
                <a
                  href="https://olunix.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-[var(--stroke-soft)] underline-offset-4 transition-colors hover:text-[var(--text-primary)] hover:decoration-[var(--text-primary)]"
                >
                  Olunix
                </a>
              </p>
              <p
                className="mt-6 max-w-xl text-[var(--text-muted)]"
                data-motion="rise"
                style={motionDelay(360)}
              >
                Born in Egypt. Raised in Canada. Building at the intersection of engineering and marketing,
                helping AI startups turn technical depth into real market traction.
              </p>

              <div
                className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start"
                data-motion="rise"
                style={motionDelay(420)}
              >
                <a
                  href="mailto:mina@olunix.com?subject=Project%20Inquiry%20for%20Mina%20Mankarious"
                  className="accent-btn"
                >
                  Get in touch
                  <ArrowUpRight size={14} />
                </a>
                <a
                  href="https://www.linkedin.com/in/mina-mankarious"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ghost-btn"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Story ── */}
      <section className="command-section page-gutter section-block" data-section-theme="about-story">
        <div className="mx-auto w-full max-w-3xl">

          <article
            className="article-prose text-[0.98rem] sm:text-[1.04rem]"
            data-motion="rise"
            style={motionDelay(480)}
          >
            <p>
              I moved to Canada from Egypt when I was eight years old. Growing up between two cultures
              taught me how to adapt, read people, and communicate across different contexts. I didn&apos;t
              realize it at the time, but those were some of the earliest marketing skills I ever developed.
            </p>

            <p>
              For most of my life, I was set on engineering. I loved understanding how things worked,
              breaking systems down, and rebuilding them. That hasn&apos;t changed. But somewhere in high school,
              I discovered something that lit me up in a completely different way: <strong>marketing</strong>. Not the
              surface-level kind. The real stuff. Understanding people, figuring out what makes them care,
              and building a bridge between what someone offers and what someone needs.
            </p>

            {/* Pull quote */}
            <blockquote className="about-pullquote">
              <p>
                The best marketing doesn&apos;t feel like marketing. It feels like engineering applied to people.
              </p>
            </blockquote>

            <p>
              I&apos;m currently in my final year studying <strong>Automotive Engineering Technology</strong> at{' '}
              <a href="https://mcmaster.ca" target="_blank" rel="noopener noreferrer">McMaster University</a>.
              The combination sounds strange to most people, but to me it works. Engineering taught me how
              to think in{' '}
              <Link href="/articles/from-engineering-to-marketing-why-systems-thinking-matters">systems</Link>.
              Marketing taught me how to think about people. Together, they became the foundation of
              everything I build.
            </p>

            <p>
              In September 2024, I founded <strong>Olunix</strong> alongside my CTO and CMO. We started as
              GrowByte Media, working with automotive dealerships and dental offices. As our approach matured
              and our clients evolved, we{' '}
              <Link href="/articles/how-we-rebranded-from-growbyte-to-olunix">rebranded</Link> into
              something that better reflects who we are: not just an agency, but a consulting and growth
              partner for companies building the future.
            </p>

            <p>
              Today, we work predominantly with AI startups. The companies we partner with are creating
              the future, and our job is to help them get the right message in front of the right people
              at the right time. It&apos;s strategic. It&apos;s technical. And it&apos;s deeply human.
            </p>

            <p>
              Before Olunix, I spent two years at{' '}
              <a href="https://miltontoyota.com" target="_blank" rel="noopener noreferrer">Milton Toyota</a>,
              handling high-volume customer interactions in a fast-paced environment. Before that, I was
              running e-commerce projects during COVID and learning more about scalable marketing than any
              classroom could teach.
            </p>

            <p>
              Outside of work, I&apos;m a ministry intern at{' '}
              <a href="https://hopeoakville.ca" target="_blank" rel="noopener noreferrer">Hope Bible Church</a> in
              Oakville, and since January 2026 I&apos;ve been a Deal Partner at{' '}
              <a href="https://boardy.ai" target="_blank" rel="noopener noreferrer">Boardy</a>, building
              connections and business development pathways for founders.
            </p>
          </article>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="command-section page-gutter section-block" data-section-theme="about-timeline">
        <div className="mx-auto w-full max-w-3xl">
          <p className="command-label mb-8" data-motion="rise" style={motionDelay(540)}>
            Timeline
          </p>

          <div className="about-timeline" data-motion="rise" style={motionDelay(580)}>
            {milestones.map((m, i) => (
              <div key={m.year + i} className="about-timeline-item">
                <span className="about-timeline-year">{m.year}</span>
                <span className="about-timeline-line" aria-hidden="true" />
                <span className="about-timeline-text">{m.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Elsewhere ── */}
      <section className="command-section page-gutter pb-20 md:pb-24">
        <div
          className="mx-auto w-full max-w-3xl border-t border-[var(--stroke-soft)] pt-8"
          data-motion="rise"
          style={motionDelay(640)}
        >
          <p className="command-label mb-5">Elsewhere</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {elsewhereLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="about-link-card relative overflow-hidden"
              >
                <CardGlow spread={12} proximity={36} borderWidth={1} />
                <span className="relative z-[1] flex items-center justify-between gap-2">
                  <span>{link.label}</span>
                  <ExternalLink size={13} className="shrink-0 text-[var(--text-dim)]" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
