import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="relative z-[3] mt-24 border-t border-[#292524]">
      <div className="page-gutter mx-auto flex w-full max-w-7xl flex-col items-start gap-5 py-10 text-left text-sm font-light text-[#8b857b] md:flex-row md:items-center md:justify-between md:gap-8 md:py-12">
        <p>&copy; {new Date().getFullYear()} Mina Mankarious</p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/about" className="footer-link">About</Link>
          <Link href="/articles" className="footer-link">Articles</Link>
          <Link href="/#contact" className="footer-link">Contact</Link>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a href="https://www.linkedin.com/in/mina-mankarious" target="_blank" rel="noopener noreferrer" className="footer-link" aria-label="LinkedIn">LinkedIn</a>
          <a href="https://x.com/minamnkarious" target="_blank" rel="noopener noreferrer" className="footer-link" aria-label="X">X</a>
          <a href="https://github.com/minamankarious" target="_blank" rel="noopener noreferrer" className="footer-link" aria-label="GitHub">GitHub</a>
          <a href="https://olunix.com" target="_blank" rel="noopener noreferrer" className="footer-link uppercase tracking-[0.12em]" aria-label="Olunix">Olunix</a>
        </div>
      </div>
    </footer>
  );
}
