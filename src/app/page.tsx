import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowDown, ArrowRight, ArrowUpRight, ExternalLink, Fan, MapPin } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import FanControllerMiniPreview from '@/components/FanControllerMiniPreview';
import { getAllArticlesSorted, articles } from '@/data/articles';

const LinkedInIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export const metadata: Metadata = {
  title: 'Mina Mankarious | Founder & CEO of Olunix',
  description:
    'Mina Mankarious helps AI startups with positioning, founder-led demand, and growth systems through Olunix in Toronto.',
  alternates: {
    canonical: 'https://minamankarious.com',
  },
  keywords: [
    'Mina Mankarious',
    'Olunix',
    'AI startup marketing consultant',
    'founder-led growth',
    'Toronto startup advisor',
  ],
};

function delay(ms: number) {
  return { transitionDelay: `${ms}ms` };
}

export default function Home() {
  const displayedArticles = getAllArticlesSorted().slice(0, 3);

  const homeBreadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://minamankarious.com',
      },
    ],
  };

  return (
    <div className="relative z-[3]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeBreadcrumbJsonLd) }}
      />

      <main id="main-content" className="page-enter pt-20">
        <section id="hero" className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden page-gutter pb-14 pt-10 sm:pb-12 sm:pt-14 md:pt-16">
          <div className="pointer-events-none absolute right-[-5vw] top-1/2 hidden -translate-y-1/2 select-none lg:block">
            <span className="font-serif text-[20vw] leading-none tracking-tight text-[#292524]/40">MM</span>
          </div>

          <div className="relative z-10 max-w-4xl pb-10 sm:pb-4 md:pb-0">
            <div className="hero-line mb-2" style={delay(80)}>
              <span className="mobile-tight-title font-serif text-[clamp(2.9rem,14vw,3.9rem)] leading-[1.04] text-[#f5f0e8] sm:text-6xl md:text-7xl lg:text-8xl">Mina</span>
            </div>
            <div className="hero-line mb-6 sm:mb-8" style={delay(180)}>
              <span className="mobile-tight-title font-serif text-[clamp(2.9rem,14vw,3.9rem)] leading-[1.04] text-[#f5f0e8] sm:text-6xl md:text-7xl lg:text-8xl">Mankarious</span>
            </div>

            <p className="reveal reveal--up mb-3 text-xs uppercase tracking-[0.2em] text-[#c8c2b6] md:text-sm" style={delay(320)}>
              Founder &amp; CEO, Olunix
            </p>

            <p className="reveal reveal--up mb-6 max-w-2xl text-base text-[#e8c97a] sm:text-lg md:text-2xl" style={delay(430)}>
              Helping AI startups turn technical products into clear positioning, founder-led demand, and compounding growth systems.
            </p>

            <div className="reveal reveal--up mb-7 flex w-full max-w-sm flex-wrap items-center gap-2.5 sm:max-w-none sm:gap-3" style={delay(520)}>
              <a href="mailto:mina@olunix.com?subject=Project%20Inquiry%20for%20Mina%20Mankarious" className="accent-btn w-full justify-center sm:w-auto">
                Get in touch
                <ArrowUpRight size={15} />
              </a>
              <a href="https://www.linkedin.com/in/mina-mankarious" target="_blank" rel="noopener noreferrer" className="ghost-btn w-full justify-center sm:w-auto">
                <LinkedInIcon size={14} />
                LinkedIn
              </a>
              <a href="https://olunix.com" target="_blank" rel="noopener noreferrer" className="ghost-btn w-full justify-center sm:w-auto">
                <ExternalLink size={14} />
                Olunix
              </a>
            </div>

            <div className="reveal reveal--up flex items-center gap-2 text-xs text-[#b2ab9f] sm:text-sm" style={delay(620)}>
              <MapPin size={14} />
              <span>Toronto, Canada</span>
            </div>
          </div>

          <div className="reveal reveal--fade absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-[#615a50] sm:block" style={delay(960)}>
            <div className="scroll-indicator flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.2em]">
              <span>Scroll</span>
              <ArrowDown size={14} />
            </div>
          </div>
        </section>

        <section id="about" className="section-block page-gutter">
          <div className="mx-auto max-w-7xl">
            <p className="section-label reveal reveal--left">01 About</p>

            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16">
              <div className="reveal reveal--up md:col-span-8" style={delay(120)}>
                <h2 className="mobile-tight-title mb-6 max-w-2xl text-[clamp(2rem,9vw,2.35rem)] leading-[1.15] text-[#f5f0e8] md:text-5xl">Engineering meets marketing.</h2>
                <div className="space-y-4 text-[#c8c2b6] sm:space-y-5">
                  <p>
                    I&apos;m the Founder and CEO of <span className="text-[#f5f0e8]">Olunix</span>, where I help AI startups create real market traction through strategic clarity and disciplined execution.
                  </p>
                  <p>
                    As a <span className="text-[#f5f0e8]">Deal Partner at Boardy</span>, I focus on connecting founders to opportunities and relationships that accelerate growth.
                  </p>
                  <p>
                    My background combines frontline business experience at <span className="text-[#f5f0e8]">Toyota</span> with technical training in <span className="text-[#f5f0e8]">Automotive Engineering Technology at McMaster University</span>.
                  </p>
                </div>

                <Link href="/about" className="mt-7 inline-flex items-center gap-2 text-sm text-[#d4a853] transition-all duration-300 hover:gap-3">
                  Read full background
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="reveal reveal--right justify-self-center md:col-span-4 md:justify-self-end" style={delay(220)}>
                <div className="glass-panel compact-card w-full max-w-[250px] sm:max-w-[280px]">
                  <div className="mx-auto w-fit rounded-xl border border-[#3d352a] p-1">
                    <Image
                      src="/headshot.png"
                      alt="Mina Mankarious"
                      width={128}
                      height={160}
                      className="h-40 w-32 rounded-lg object-cover object-top"
                      priority
                    />
                  </div>
                  <p className="mt-3 text-[0.68rem] uppercase tracking-[0.18em] text-[#8f8268]">Profile</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#f5f0e8]">Founder-led operator with engineering systems thinking.</p>
                  <p className="mt-2 text-xs text-[#a89f90]">Toronto, Canada</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="section-block page-gutter">
          <div className="mx-auto max-w-7xl">
            <p className="section-label reveal reveal--left">02 Experience</p>
            <h2 className="mobile-tight-title reveal reveal--up mb-10 max-w-3xl text-[clamp(2rem,9vw,2.35rem)] leading-[1.15] text-[#f5f0e8] md:mb-12 md:text-5xl" style={delay(100)}>
              Operator, founder, partner.
            </h2>

            <div className="relative space-y-6">
              <div className="timeline-line reveal absolute left-[1.375rem] top-6 bottom-6 hidden w-px bg-[#292524] md:block" aria-hidden="true" />

              <article className="glass-panel compact-card card-lift reveal reveal--up" style={delay(180)}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <Image src="/olunix-logo.png" alt="Olunix" width={44} height={44} className="h-11 w-11 shrink-0 rounded-md object-cover" />
                    <div>
                      <h3 className="font-sans text-lg font-medium text-[#f5f0e8]">Founder &amp; CEO</h3>
                      <p className="text-sm text-[#d4a853]">Olunix</p>
                      <p className="mt-2 text-sm text-[#c8c2b6]">Marketing & consulting for AI startups.</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#8b857b]">Sep 2024 - Present</p>
                </div>
              </article>

              <a href="https://boardy.ai" target="_blank" rel="noopener noreferrer" className="glass-panel compact-card card-lift reveal reveal--up block" style={delay(220)}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <Image src="/boardy-logo.png" alt="Boardy" width={44} height={44} className="h-11 w-11 shrink-0 rounded-md object-cover" />
                    <div>
                      <h3 className="font-sans text-lg font-medium text-[#f5f0e8]">Deal Partner</h3>
                      <p className="text-sm text-[#d4a853]">Boardy</p>
                      <p className="mt-2 text-sm text-[#c8c2b6]">Boardy Fellowship Fall 2025. Expanding network and opportunities for Olunix.</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#8b857b]">Jan 2026 - Present</p>
                </div>
              </a>

              <article className="glass-panel compact-card card-lift reveal reveal--up" style={delay(260)}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#3f372d] bg-[#1c1b18] text-[#d4a853]">
                      <Fan size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <a href="/fan-controller/index.html" className="inline-flex items-start gap-2 font-sans text-lg font-medium text-[#f5f0e8] transition-colors hover:text-[#e8c97a]">
                        Engine Cooling Fan Controller
                        <ArrowUpRight size={14} />
                      </a>
                      <p className="mt-2 text-sm text-[#c8c2b6]">
                        Built and tested as a physical HCS12 controller, then transformed into an interactive web simulator with CAN bus communication, PWM motor control, ADC sensing, and safety override logic.
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#8b857b]">Feb 2026</p>
                </div>

                <FanControllerMiniPreview />

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="tag-chip">Embedded Systems</span>
                  <span className="tag-chip">CAN Bus</span>
                  <span className="tag-chip">Simulator</span>
                </div>
              </article>

              <a href="https://habitstogether.app/" target="_blank" rel="noopener noreferrer" className="glass-panel compact-card card-lift reveal reveal--up block" style={delay(300)}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <Image src="/habits-together-logo.png" alt="Habits Together" width={44} height={44} className="h-11 w-11 shrink-0 rounded-md object-cover" />
                    <div>
                      <h3 className="font-sans text-lg font-medium text-[#f5f0e8]">Habits Together</h3>
                      <p className="mt-1 text-sm text-[#d4a853]">Open-source mobile app</p>
                      <p className="mt-2 text-sm text-[#c8c2b6]">A habit tracking app built with a team to help friends stay accountable.</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#8b857b]">Summer 2024</p>
                </div>
              </a>

              <a href="https://miltontoyota.com" target="_blank" rel="noopener noreferrer" className="glass-panel compact-card card-lift reveal reveal--up block" style={delay(340)}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <Image src="/toyota-logo.png" alt="Toyota" width={44} height={44} className="h-11 w-11 shrink-0 rounded-md bg-white p-1 object-contain" />
                    <div>
                      <h3 className="font-sans text-lg font-medium text-[#f5f0e8]">Customer Service Attendant</h3>
                      <p className="text-sm text-[#d4a853]">Milton Toyota</p>
                      <p className="mt-2 text-sm text-[#c8c2b6]">2+ years in automotive customer service.</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#8b857b]">Aug 2022 - Aug 2024</p>
                </div>
              </a>
            </div>
          </div>
        </section>

        <section id="work-with-me" className="section-block page-gutter bg-[#141311]">
          <div className="mx-auto max-w-7xl">
            <p className="section-label reveal reveal--left">03 Services</p>
            <h2 className="mobile-tight-title reveal reveal--up mb-4 text-[clamp(2rem,9vw,2.35rem)] leading-[1.15] text-[#f5f0e8] md:mb-5 md:text-5xl" style={delay(100)}>
              Let&apos;s build something together.
            </h2>
            <p className="reveal reveal--up mb-10 max-w-2xl text-[#c8c2b6] md:mb-12" style={delay(180)}>
              If you&apos;re building a technical product and need stronger market traction, I work hands-on at the strategy and execution layer.
            </p>

            <div className="grid gap-0 border-t border-[#292524] md:grid-cols-3">
              {[
                {
                  title: 'Positioning & Messaging',
                  desc: 'Clarify your category, ICP, and value story so buyers understand you quickly.',
                },
                {
                  title: 'Founder-Led Growth',
                  desc: 'Build a credible content and relationship engine around the founder voice.',
                },
                {
                  title: 'Marketing Systems',
                  desc: 'Design operating cadences and channel priorities tied to pipeline and revenue.',
                },
              ].map((service, index) => (
                <article
                  key={service.title}
                  className={`service-card reveal reveal--up border-b border-[#292524] py-8 md:border-b-0 md:px-8 md:py-12 ${index < 2 ? 'md:border-r' : ''} ${index === 0 ? 'md:pl-0' : ''} ${index === 2 ? 'md:pr-0' : ''}`}
                  style={delay(220 + index * 90)}
                >
                  <p className="mb-3 font-serif text-3xl text-[#7a6640]">0{index + 1}</p>
                  <h3 className="mb-2 font-sans text-lg font-medium text-[#f5f0e8]">{service.title}</h3>
                  <p className="text-sm text-[#c8c2b6]">{service.desc}</p>
                </article>
              ))}
            </div>

            <div className="reveal reveal--up mt-10 border-t border-[#292524] pt-7" style={delay(520)}>
              <p className="mb-5 text-sm text-[#b2ab9f]">
                Best fit: early-stage to growth-stage AI startups, founders seeking clarity, and teams that value disciplined execution.
              </p>
              <a href="mailto:mina@olunix.com?subject=Project%20Inquiry%20for%20Mina%20Mankarious" className="accent-btn">
                Start a conversation
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>

        <section id="education" className="section-block page-gutter">
          <div className="mx-auto max-w-7xl">
            <p className="section-label reveal reveal--left">04 Education</p>
            <a href="https://mcmaster.ca" target="_blank" rel="noopener noreferrer" className="glass-panel compact-card card-lift reveal reveal--up block" style={delay(130)}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <Image
                  src="/mcmaster-university-crest.png"
                  alt="McMaster University crest"
                  width={48}
                  height={48}
                  className="h-11 w-11 shrink-0 rounded-md border border-[#3f372d] bg-[#f5f0e8] p-1 object-contain sm:h-12 sm:w-12"
                />
                <div>
                  <h3 className="font-sans text-lg font-medium text-[#f5f0e8] sm:text-xl">McMaster University</h3>
                  <p className="text-sm text-[#d4a853]">Automotive Engineering Technology</p>
                  <p className="mt-2 text-sm text-[#c8c2b6]">Final year, applying systems engineering thinking to marketing and growth execution.</p>
                </div>
              </div>
            </a>
          </div>
        </section>

        <section id="articles" className="section-block page-gutter">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-label reveal reveal--left">05 Writing</p>
                <h2 className="mobile-tight-title reveal reveal--up text-[clamp(2rem,9vw,2.35rem)] leading-[1.15] text-[#f5f0e8] md:text-5xl" style={delay(100)}>
                  Thinking out loud.
                </h2>
              </div>
              <Link href="/articles" className="reveal reveal--fade hidden text-sm text-[#d4a853] md:inline-flex" style={delay(180)}>
                View all
              </Link>
            </div>

            <div className="reveal reveal--up glass-panel compact-card card-lift mb-10 border-[#2d281f] bg-[#141311]/70" style={delay(220)}>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#8f8268]">Case Snapshot</p>
              <h3 className="mb-2 font-sans text-lg font-medium text-[#f5f0e8]">Repositioning GrowByte into Olunix</h3>
              <div className="space-y-2 text-sm text-[#c8c2b6]">
                <p><span className="text-[#e8c97a]">Problem:</span> Broad agency framing attracted misaligned demand.</p>
                <p><span className="text-[#e8c97a]">Approach:</span> Rebuilt messaging around AI startup growth and founder-led trust.</p>
                <p><span className="text-[#e8c97a]">Result:</span> Higher-quality inbound conversations and clearer fit.</p>
              </div>
            </div>

            <div className="space-y-6">
              {displayedArticles.map((article, index) => (
                <ArticleCard key={article.slug} article={article} index={index} />
              ))}
            </div>

            {articles.length > 3 && (
              <div className="mt-8 text-center">
                <Link href="/articles" className="accent-btn">
                  View all articles
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </section>

        <section id="contact" className="section-block page-gutter pb-20 md:pb-28">
          <div className="mx-auto max-w-7xl">
            <p className="section-label reveal reveal--left">06 Contact</p>
            <div className="max-w-2xl">
              <h2 className="mobile-tight-title reveal reveal--up mb-4 text-[clamp(2.2rem,10vw,2.85rem)] leading-[1.08] text-[#f5f0e8] md:mb-5 md:text-6xl" style={delay(100)}>
                Let&apos;s talk.
              </h2>
              <p className="reveal reveal--up mb-8 text-[#c8c2b6]" style={delay(180)}>
                Looking for a strategic partner for your startup&apos;s marketing and growth? Send context on your company, stage, and goals.
              </p>
              <a
                href="mailto:mina@olunix.com?subject=Project%20Inquiry%20for%20Mina%20Mankarious"
                className="reveal reveal--up link-underline inline-block text-xl text-[#d4a853] transition-colors hover:text-[#e8c97a] sm:text-2xl md:text-3xl"
                style={delay(260)}
              >
                mina@olunix.com
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
