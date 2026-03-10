import Link from 'next/link';
import { motionDelay } from '@/lib/utils';

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
    <main id="main-content" data-section-theme="about" className="page-enter marketing-main site-theme page-gutter pb-20 pt-32 md:pb-24 md:pt-40">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm lowercase tracking-[0.2em] text-[var(--text-dim)]" data-motion="rise" style={motionDelay(80)}>
          404
        </p>
        <h1 className="mobile-tight-title mb-4 text-[clamp(2.4rem,12vw,3.6rem)] text-[var(--text-primary)] md:text-7xl" data-motion="rise" style={motionDelay(140)}>
          This page doesn&apos;t exist.
        </h1>
        <p className="mb-10 text-[var(--text-muted)]" data-motion="rise" style={motionDelay(200)}>
          The link may be outdated, or the page may have moved.
        </p>

        <div className="mx-auto flex w-full max-w-sm flex-wrap justify-center gap-3" data-motion="rise" style={motionDelay(260)}>
          <Link href="/" className="accent-btn w-full justify-center sm:w-auto">Go home</Link>
          <Link href="/articles" className="ghost-btn w-full justify-center sm:w-auto">Read articles</Link>
        </div>
      </div>
    </main>
  );
}
