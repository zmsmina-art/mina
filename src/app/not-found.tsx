import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050507] text-[#f0f0f5] flex flex-col items-center justify-center px-6">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050507]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl italic font-light tracking-wide logo-glow flex-shrink-0">
            <span className="text-[#8b5cf6]">m</span>
            <span className="text-white">m</span>
            <span className="text-[#8b5cf6] text-sm ml-0.5">.</span>
          </Link>
          <div className="flex gap-3 sm:gap-6 md:gap-8 text-xs sm:text-sm">
            <Link href="/" className="text-[#8a8a9a] hover:text-white">Home</Link>
            <Link href="/articles" className="text-[#8a8a9a] hover:text-white">Articles</Link>
          </div>
        </div>
      </nav>

      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-4 gradient-text">404</h1>
        <p className="text-xl text-[#8a8a9a] mb-8">This page doesn&apos;t exist.</p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="btn-primary px-5 py-2.5 rounded-lg font-medium text-sm"
          >
            Go home
          </Link>
          <Link
            href="/articles"
            className="btn-secondary px-5 py-2.5 rounded-lg font-medium text-sm"
          >
            Read articles
          </Link>
        </div>
      </div>
    </div>
  );
}
