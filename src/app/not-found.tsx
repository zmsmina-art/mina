import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main id="main-content" className="page-enter page-gutter pb-20 pt-32 md:pb-24 md:pt-40">
      <div className="mx-auto max-w-3xl text-center">
        <p className="reveal reveal--up mb-3 text-sm uppercase tracking-[0.2em] text-[#8f8268]" style={{ transitionDelay: '80ms' }}>404</p>
        <h1 className="mobile-tight-title reveal reveal--up mb-4 text-[clamp(2.4rem,12vw,3.6rem)] text-[#f5f0e8] md:text-7xl" style={{ transitionDelay: '140ms' }}>
          This page doesn&apos;t exist.
        </h1>
        <p className="reveal reveal--up mb-10 text-[#c8c2b6]" style={{ transitionDelay: '200ms' }}>
          The link may be outdated, or the page may have moved.
        </p>

        <div className="reveal reveal--up mx-auto flex w-full max-w-sm flex-wrap justify-center gap-3" style={{ transitionDelay: '260ms' }}>
          <Link href="/" className="accent-btn w-full justify-center sm:w-auto">Go home</Link>
          <Link href="/articles" className="ghost-btn w-full justify-center sm:w-auto">Read articles</Link>
        </div>
      </div>
    </main>
  );
}
