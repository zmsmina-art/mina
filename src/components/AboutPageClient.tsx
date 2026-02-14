import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, MapPin } from 'lucide-react';

const LinkedInIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function AboutPageClient() {
  return (
    <div className="min-h-screen bg-[#050507] text-[#f0f0f5]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050507]/85 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl italic font-light tracking-wide cursor-pointer logo-glow flex-shrink-0" aria-label="Mina Mankarious home">
            <span className="text-[#8b5cf6]">m</span><span className="text-white">m</span><span className="text-[#8b5cf6] text-sm ml-0.5">.</span>
          </Link>
          <div className="flex gap-3 sm:gap-6 md:gap-8 text-xs sm:text-sm max-w-[72vw] overflow-x-auto scrollbar-hide whitespace-nowrap">
            <Link href="/" className="text-[#8a8a9a] hover:text-white">Home</Link>
            <Link href="/about" className="text-white">About</Link>
            <Link href="/#experience" className="text-[#8a8a9a] hover:text-white">Experience</Link>
            <Link href="/articles" className="text-[#8a8a9a] hover:text-white">Articles</Link>
            <Link href="/#contact" className="text-[#8a8a9a] hover:text-white">Contact</Link>
          </div>
        </div>
      </nav>

      <main id="main-content" className="pt-32 pb-28 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#8a8a9a] hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <div className="flex flex-col sm:flex-row items-start gap-6 mb-12">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#8b5cf6]/20 flex-shrink-0">
              <Image
                src="/headshot.png"
                alt="Mina Mankarious, Founder and CEO of Olunix"
                width={128}
                height={128}
                className="w-full h-full object-cover scale-110"
                priority
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                About <span className="gradient-text">Mina Mankarious</span>
              </h1>
              <p className="text-[#8b5cf6] text-lg mb-1">Founder & CEO of Olunix</p>
              <div className="flex items-center gap-2 text-[#6a6a7a] text-sm">
                <MapPin size={14} />
                <span>Toronto, Canada</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 text-[#b0b0c0] leading-relaxed">
            <p>
              Mina Mankarious is a Canadian entrepreneur, founder and CEO of{' '}
              <a href="https://olunix.com" target="_blank" rel="noopener noreferrer" className="text-[#8b5cf6] hover:underline">Olunix</a>,
              a marketing and consulting firm headquartered in Toronto, Ontario. Born in Egypt and raised in Canada, he has
              built a career at the intersection of engineering and marketing, helping technology companies, especially AI startups,
              develop strategic growth systems.
            </p>

            <h2 className="text-xl font-semibold text-white pt-4">Early Life and Education</h2>
            <p>
              Mina Mankarious was born in Egypt and immigrated to Canada at the age of eight. Growing up between two cultures gave
              him an early understanding of cross-cultural communication and adaptability.
            </p>
            <p>
              He is currently in his final year studying <span className="text-white">Automotive Engineering Technology</span> at{' '}
              <a href="https://mcmaster.ca" target="_blank" rel="noopener noreferrer" className="text-[#8b5cf6] hover:underline">McMaster University</a>{' '}
              in Hamilton, Ontario. His engineering education shaped a systems-oriented mindset he applies to marketing strategy.
            </p>

            <h2 className="text-xl font-semibold text-white pt-4">Career</h2>

            <h3 className="text-lg font-medium text-white pt-2">Early Ventures</h3>
            <p>
              Mankarious began his entrepreneurial journey during high school by founding <span className="text-white">ZMS Media</span>
              and expanded into e-commerce work during the COVID-19 period.
            </p>

            <h3 className="text-lg font-medium text-white pt-2">Toyota</h3>
            <p>
              From August 2022 to August 2024, he worked at{' '}
              <a href="https://miltontoyota.com" target="_blank" rel="noopener noreferrer" className="text-[#8b5cf6] hover:underline">Milton Toyota</a>,
              where he handled high-volume customer interactions in a fast-paced dealership environment.
            </p>

            <h3 className="text-lg font-medium text-white pt-2">Olunix</h3>
            <p>
              In September 2024, Mankarious founded <span className="text-white">Olunix</span> alongside his CTO and CMO.
              Originally launched as GrowByte Media, the company{' '}
              <Link href="/articles/how-we-rebranded-from-growbyte-to-olunix" className="text-[#8b5cf6] hover:underline">
                rebranded to Olunix
              </Link>{' '}
              as its focus shifted toward AI startups and technology companies.
            </p>

            <h3 className="text-lg font-medium text-white pt-2">Boardy</h3>
            <p>
              Since January 2026, Mankarious has served as a <span className="text-white">Deal Partner at{' '}
              <a href="https://boardy.ai" target="_blank" rel="noopener noreferrer" className="text-[#8b5cf6] hover:underline">Boardy</a></span>,
              expanding professional networks and creating business development opportunities.
            </p>

            <h2 className="text-xl font-semibold text-white pt-4">Approach and Philosophy</h2>
            <p>
              Mankarious is known for applying an{' '}
              <Link href="/articles/from-engineering-to-marketing-why-systems-thinking-matters" className="text-[#8b5cf6] hover:underline">
                engineering-driven approach to marketing
              </Link>.
              He emphasizes measurable outcomes over vanity metrics.
            </p>
            <p>
              He has written extensively on{' '}
              <Link href="/articles/how-ai-startups-should-think-about-marketing" className="text-[#8b5cf6] hover:underline">
                AI startup marketing strategy
              </Link>,{' '}
              <Link href="/articles/why-most-startups-waste-money-on-marketing" className="text-[#8b5cf6] hover:underline">
                startup marketing spend optimization
              </Link>, and{' '}
              <Link href="/articles/building-a-business-in-toronto-as-a-student" className="text-[#8b5cf6] hover:underline">
                student entrepreneurship in Toronto
              </Link>.
            </p>

            <h2 className="text-xl font-semibold text-white pt-4">Community Involvement</h2>
            <p>
              Mankarious is an intern at{' '}
              <a href="https://hopeoakville.ca" target="_blank" rel="noopener noreferrer" className="text-[#8b5cf6] hover:underline">Hope Bible Church</a>{' '}
              in Oakville, Ontario, and has contributed to open-source projects like{' '}
              <a href="https://habitstogether.app" target="_blank" rel="noopener noreferrer" className="text-[#8b5cf6] hover:underline">Habits Together</a>.
            </p>

            <h2 className="text-xl font-semibold text-white pt-4">External Links</h2>
            <div className="flex flex-wrap gap-3 pt-2">
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
                  className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-white/10 text-[#8a8a9a] hover:text-white hover:border-[#8b5cf6]/30 transition-all"
                >
                  {link.label}
                  <ExternalLink size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#5a5a6a] text-sm">
            &copy; {new Date().getFullYear()} Mina Mankarious
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/in/mina-mankarious"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mina Mankarious on LinkedIn"
              className="text-[#5a5a6a] hover:text-[#8b5cf6]"
            >
              <LinkedInIcon />
            </a>
            <a
              href="https://x.com/minamnkarious"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mina Mankarious on X"
              className="text-[#5a5a6a] hover:text-[#8b5cf6]"
            >
              <XIcon />
            </a>
            <a
              href="https://olunix.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Olunix website"
              className="text-[#5a5a6a] hover:text-[#8b5cf6]"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
