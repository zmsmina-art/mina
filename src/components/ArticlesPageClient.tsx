'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import type { Article } from '@/data/articles';

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function ArticlesPageClient({ articles }: { articles: Article[] }) {
  return (
    <div className="min-h-screen bg-[#050507] text-[#f0f0f5]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050507]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl italic font-light tracking-wide logo-glow flex-shrink-0">
            <span className="text-[#8b5cf6]">m</span>
            <span className="text-white">m</span>
            <span className="text-[#8b5cf6] text-sm ml-0.5">.</span>
          </Link>
          <div className="flex gap-3 sm:gap-6 md:gap-8 text-xs sm:text-sm">
            <Link href="/" className="text-[#8a8a9a] hover:text-white">Home</Link>
            <Link href="/articles" className="text-white">Articles</Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.1 }}
          >
            <motion.div variants={fade} transition={{ duration: 0.5 }}>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-[#6a6a7a] hover:text-[#8b5cf6] transition-colors mb-8"
              >
                <ArrowLeft size={14} />
                Back to home
              </Link>
            </motion.div>

            <motion.h1
              variants={fade}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Articles
            </motion.h1>

            <motion.p
              variants={fade}
              transition={{ duration: 0.5 }}
              className="text-[#8a8a9a] mb-12 text-lg"
            >
              Thoughts on entrepreneurship, marketing, and building businesses.
            </motion.p>

            <div className="space-y-6">
              {articles.map((article, i) => (
                <ArticleCard key={article.slug} article={article} index={i} />
              ))}
            </div>

            {articles.length === 0 && (
              <motion.p variants={fade} className="text-[#6a6a7a] text-center py-12">
                No articles yet. Check back soon.
              </motion.p>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
