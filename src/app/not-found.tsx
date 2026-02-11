import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050507] text-[#f0f0f5] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">
          4<span className="text-[#8b5cf6]">0</span>4
        </h1>
        <p className="text-[#8a8a9a] mb-8">This page doesn&apos;t exist.</p>
        <Link
          href="/"
          className="btn-primary px-5 py-2.5 rounded-lg font-medium text-sm inline-block"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
