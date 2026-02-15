import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, MapPin } from 'lucide-react';

function delay(ms: number) {
  return { transitionDelay: `${ms}ms` };
}

export default function AboutPageClient() {
  return (
    <main id="main-content" className="page-enter page-gutter pb-20 pt-28 md:pb-24 md:pt-32">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="reveal reveal--up mb-8 inline-flex items-center gap-2 text-sm text-[#b2ab9f] transition-colors hover:text-[#f5f0e8]" style={delay(80)}>
          <ArrowLeft size={14} />
          Back home
        </Link>

        <div className="mb-10 flex flex-col items-start gap-4 sm:mb-12 sm:flex-row sm:items-center sm:gap-5">
          <div className="reveal reveal--right rounded-xl border border-[#3d352a] p-1.5" style={delay(150)}>
            <Image
              src="/headshot.png"
              alt="Mina Mankarious"
              width={96}
              height={120}
              className="h-20 w-16 rounded-lg object-cover object-top sm:h-24 sm:w-20"
              priority
            />
          </div>

          <div>
            <h1 className="mobile-tight-title reveal reveal--up mb-2 text-[clamp(2.1rem,9.8vw,2.7rem)] text-[#f5f0e8] md:text-5xl" style={delay(140)}>About Mina Mankarious</h1>
            <p className="reveal reveal--up text-base text-[#d4a853] sm:text-lg" style={delay(220)}>Founder &amp; CEO of Olunix</p>
            <div className="reveal reveal--up mt-2 flex items-center gap-2 text-sm text-[#a89f90]" style={delay(280)}>
              <MapPin size={14} />
              <span>Toronto, Canada</span>
            </div>
          </div>
        </div>

        <div className="site-divider mb-10" />

        <div className="article-prose reveal reveal--up text-[0.98rem] sm:text-[1.03rem]" style={delay(300)}>
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
        </div>

        <section className="reveal reveal--up mt-12" style={delay(420)}>
          <h2 className="mb-4 text-sm uppercase tracking-[0.18em] text-[#8f8268]">External Links</h2>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {[
              { label: 'Olunix', url: 'https://olunix.com' },
              { label: 'LinkedIn', url: 'https://www.linkedin.com/in/mina-mankarious' },
              { label: 'X / Twitter', url: 'https://x.com/minamnkarious' },
              { label: 'GitHub', url: 'https://github.com/minamankarious' },
              { label: 'Medium', url: 'https://mankarious.medium.com' },
              { label: 'Crunchbase', url: 'https://www.crunchbase.com/person/mina-mankarious' },
            ].map((link) => (
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
        </section>
      </article>
    </main>
  );
}
