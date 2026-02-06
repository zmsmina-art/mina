'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import ReadingProgress from '@/components/ReadingProgress';
import type { Article } from '@/data/articles';

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function ArticlePageClient({ article }: { article: Article }) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#050507] text-[#f0f0f5]">
      <ReadingProgress />

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

      <main className="pt-32 pb-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.08 }}
          >
            <motion.div variants={fade} transition={{ duration: 0.5 }}>
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 text-sm text-[#6a6a7a] hover:text-[#8b5cf6] transition-colors mb-8"
              >
                <ArrowLeft size={14} />
                All articles
              </Link>
            </motion.div>

            <motion.div variants={fade} transition={{ duration: 0.5 }} className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-md bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {article.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-[#6a6a7a]">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {article.readingTime}
                </span>
              </div>
            </motion.div>

            <motion.div variants={fade} transition={{ duration: 0.5 }}>
              <div className="divider mb-10" />
            </motion.div>

            <motion.article variants={fade} transition={{ duration: 0.6 }} className="article-prose">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSlug]}
              >
                {article.content}
              </ReactMarkdown>
            </motion.article>

            <motion.div variants={fade} transition={{ duration: 0.5 }} className="mt-16">
              <div className="divider mb-8" />
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 text-sm text-[#6a6a7a] hover:text-[#8b5cf6] transition-colors"
              >
                <ArrowLeft size={14} />
                All articles
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
