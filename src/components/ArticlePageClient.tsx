import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { ArrowLeft, ArrowUpRight, Calendar, Clock } from 'lucide-react';
import ReadingProgress from '@/components/ReadingProgress';
import type { Article } from '@/data/articles';

export default function ArticlePageClient({ article, relatedArticles = [] }: { article: Article; relatedArticles?: Article[] }) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#050507] text-[#f0f0f5]">
      <ReadingProgress />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050507]/85 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl italic font-light tracking-wide logo-glow flex-shrink-0" aria-label="Mina Mankarious home">
            <span className="text-[#8b5cf6]">m</span>
            <span className="text-white">m</span>
            <span className="text-[#8b5cf6] text-sm ml-0.5">.</span>
          </Link>
          <div className="flex gap-3 sm:gap-6 md:gap-8 text-xs sm:text-sm">
            <Link href="/" className="text-[#8a8a9a] hover:text-white">Home</Link>
            <Link href="/about" className="text-[#8a8a9a] hover:text-white">About</Link>
            <Link href="/articles" className="text-[#8a8a9a] hover:text-white">Articles</Link>
          </div>
        </div>
      </nav>

      <main id="main-content" className="pt-32 pb-28 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm text-[#6a6a7a] hover:text-[#8b5cf6] transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            All articles
          </Link>

          <div className="mb-8 fade-in-up">
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
              <time dateTime={article.publishedAt} className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formattedDate}
              </time>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {article.readingTime}
              </span>
            </div>
          </div>

          <div className="divider mb-10" />

          <article className="article-prose fade-in-up">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug]}
            >
              {article.content}
            </ReactMarkdown>
          </article>

          {relatedArticles.length > 0 && (
            <div className="mt-16">
              <div className="divider mb-8" />
              <h2 className="text-xl font-bold mb-6">Related Articles</h2>
              <div className="space-y-4">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/articles/${related.slug}`}
                    className="glass rounded-xl p-5 block group"
                  >
                    <div className="flex flex-wrap gap-2 mb-2">
                      {related.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-md bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-[#8b5cf6] transition-colors mb-1 flex items-start gap-2">
                      {related.title}
                      <ArrowUpRight
                        size={14}
                        className="flex-shrink-0 mt-1 text-[#6a6a7a] group-hover:text-[#8b5cf6] transition-colors opacity-0 group-hover:opacity-100"
                      />
                    </h3>
                    <p className="text-[#8a8a9a] text-sm line-clamp-2">{related.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-[#6a6a7a] mt-2">
                      <time dateTime={related.publishedAt} className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {new Date(related.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </time>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {related.readingTime}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <div className="divider mb-8" />
            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 text-sm text-[#6a6a7a] hover:text-[#8b5cf6] transition-colors"
              >
                <ArrowLeft size={14} />
                All articles
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm text-[#6a6a7a] hover:text-[#8b5cf6] transition-colors"
              >
                About Mina
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
