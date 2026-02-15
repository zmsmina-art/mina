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
    <main id="main-content" className="page-enter page-gutter pb-20 pt-28 md:pb-24 md:pt-32">
      <ReadingProgress />

      <article className="mx-auto max-w-3xl">
        <Link href="/articles" className="reveal reveal--up mb-10 inline-flex items-center gap-2 text-sm text-[#b2ab9f] transition-colors hover:text-[#f5f0e8]" style={{ transitionDelay: '80ms' }}>
          <ArrowLeft size={14} />
          Back to articles
        </Link>

        <header className="reveal reveal--up mb-10" style={{ transitionDelay: '140ms' }}>
          <div className="mb-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
          </div>

          <h1 className="mobile-tight-title mb-4 text-[clamp(2.1rem,9.8vw,2.9rem)] leading-[1.1] text-[#f5f0e8] md:text-5xl">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[#8f887b]">
            <time dateTime={article.publishedAt} className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formattedDate}
            </time>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {article.readingTime}
            </span>
          </div>
        </header>

        <div className="site-divider mb-10" />

        <article className="article-prose reveal reveal--up text-[0.98rem] sm:text-[1.03rem]" style={{ transitionDelay: '200ms' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
            {article.content}
          </ReactMarkdown>
        </article>

        {relatedArticles.length > 0 && (
          <section className="reveal reveal--up mt-16" style={{ transitionDelay: '260ms' }}>
            <div className="site-divider mb-7" />
            <h2 className="mb-6 text-2xl text-[#f5f0e8]">Related Articles</h2>
            <div className="space-y-4">
              {relatedArticles.map((related) => (
                <Link key={related.slug} href={`/articles/${related.slug}`} className="glass-panel compact-card group block">
                  <div className="mb-2 flex flex-wrap gap-2">
                    {related.tags.map((tag) => (
                      <span key={tag} className="tag-chip">{tag}</span>
                    ))}
                  </div>

                  <h3 className="mb-1 flex items-start gap-2 text-lg text-[#f5f0e8] transition-colors group-hover:text-[#e8c97a]">
                    {related.title}
                    <ArrowUpRight size={14} className="mt-1 shrink-0 text-[#8f887b] transition-colors group-hover:text-[#e8c97a]" />
                  </h3>

                  <p className="line-clamp-2 text-sm text-[#c8c2b6]">{related.excerpt}</p>

                  <div className="mt-3 flex items-center gap-4 text-xs text-[#8f887b]">
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
          </section>
        )}

        <div className="reveal reveal--up mt-12" style={{ transitionDelay: '300ms' }}>
          <div className="site-divider mb-8" />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            <Link href="/articles" className="inline-flex items-center gap-2 text-[#b2ab9f] transition-colors hover:text-[#f5f0e8]">
              <ArrowLeft size={14} />
              All articles
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 text-[#d4a853] transition-colors hover:text-[#e8c97a]">
              About Mina
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
