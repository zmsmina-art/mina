import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { ArrowLeft, ArrowUpRight, Calendar, Clock } from 'lucide-react';
import ArticleShareButtons from '@/components/ArticleShareButtons';
import ReadingProgress from '@/components/ReadingProgress';
import CardGlow from '@/components/ui/card-glow';
import { NewsletterCTA } from '@/components/NewsletterModal';
import TableOfContents from '@/components/TableOfContents';
import InlineNewsletterCTA from '@/components/InlineNewsletterCTA';
import type { Article, ArticleSummary } from '@/data/articles';
import { extractHeadings, splitContentAfterH2 } from '@/lib/article-headings';
import { motionDelay } from '@/lib/utils';

export default function ArticlePageClient({
  article,
  relatedArticles = [],
}: {
  article: Article;
  relatedArticles?: ArticleSummary[];
}) {
  const formattedDate = new Date(`${article.publishedAt}T00:00:00`).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }
  );

  const sharedHeaderStyle = {
    viewTransitionName: `article-card-${article.slug}`,
  } as CSSProperties;

  const headings = extractHeadings(article.content);
  const split = splitContentAfterH2(article.content, 1);

  return (
    <main
      id="main-content"
      data-section-theme="article"
      className="page-enter article-motion-shell marketing-main site-theme page-gutter pb-20 pt-28 md:pb-24 md:pt-32"
    >
      <ReadingProgress />

      <div className="mx-auto max-w-3xl xl:max-w-none xl:grid xl:grid-cols-[1fr_minmax(0,48rem)_1fr] xl:gap-8">
        {/* Left column: TOC sidebar (desktop only) */}
        {headings.length > 0 ? (
          <aside className="hidden xl:flex xl:justify-end">
            <div className="w-56">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        ) : (
          <div className="hidden xl:block" />
        )}

        {/* Center column: article */}
        <article>
          <div data-motion="rise" style={motionDelay(40)}>
            <Link
              href="/articles"
              prefetch={false}
              className="mb-10 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={14} />
              Back to articles
            </Link>
          </div>

          <header
            className="mb-10"
            style={{ ...sharedHeaderStyle, ...motionDelay(100) }}
            data-motion="rise"
          >
            <div className="mb-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="mobile-tight-title mb-4 text-[clamp(2.1rem,9.8vw,2.9rem)] leading-[1.1] text-[var(--text-primary)] md:text-5xl">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-dim)]">
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

          <div className="site-divider mb-10" data-motion="fade" style={motionDelay(130)} />

          {/* Mobile TOC */}
          {headings.length > 0 && (
            <div className="mb-8 xl:hidden" data-motion="rise" style={motionDelay(140)}>
              <TableOfContents headings={headings} />
            </div>
          )}

          {split ? (
            <>
              <div
                className="article-prose text-[0.98rem] sm:text-[1.03rem]"
                data-motion="rise"
                style={motionDelay(160)}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
                  {split[0]}
                </ReactMarkdown>
              </div>

              <InlineNewsletterCTA />

              <div className="article-prose text-[0.98rem] sm:text-[1.03rem]">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
                  {split[1]}
                </ReactMarkdown>
              </div>
            </>
          ) : (
            <div
              className="article-prose text-[0.98rem] sm:text-[1.03rem]"
              data-motion="rise"
              style={motionDelay(160)}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
                {article.content}
              </ReactMarkdown>
            </div>
          )}

          <div
            className="mt-10 flex items-center justify-between"
            data-motion="rise"
            style={motionDelay(190)}
          >
            <ArticleShareButtons slug={article.slug} title={article.title} />
          </div>

          <aside
            className="mt-12 rounded-xl border border-[var(--stroke-soft)] bg-[var(--bg-elev-1)]/60 p-6 backdrop-blur-md"
            data-motion="rise"
            style={motionDelay(220)}
            aria-label="About the author"
          >
            <div className="flex items-start gap-4">
              <Link href="/about" className="shrink-0">
                <Image
                  src="/headshot.webp"
                  alt="Mina Mankarious"
                  width={56}
                  height={56}
                  sizes="56px"
                  className="h-14 w-14 rounded-full object-cover object-top"
                />
              </Link>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-dim)]">
                  Written by
                </p>
                <Link
                  href="/about"
                  className="mt-1 block text-lg text-[var(--text-primary)] transition-colors hover:text-[var(--accent-gold-soft)]"
                >
                  Mina Mankarious
                </Link>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Founder &amp; CEO of Olunix. Helping AI startups with positioning, growth
                  systems, and founder-led marketing from Toronto.
                </p>
              </div>
            </div>
          </aside>

          {relatedArticles.length > 0 && (
            <section className="mt-16" data-motion="rise" style={motionDelay(260)}>
              <div className="site-divider mb-7" />
              <h2 className="mb-6 text-2xl text-[var(--text-primary)]">Related Articles</h2>
              <ul className="space-y-4">
                {relatedArticles.map((related, index) => (
                  <li key={related.slug} data-motion="rise" style={motionDelay(290 + index * 40)}>
                    <Link
                      href={`/articles/${related.slug}`}
                      prefetch={false}
                      className="glass-panel compact-card article-motion-card group relative block overflow-hidden"
                    >
                      <CardGlow />
                      <div className="relative z-[1]">
                        <div className="mb-2 flex flex-wrap gap-2">
                          {related.tags.map((tag) => (
                            <span key={tag} className="tag-chip">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h3 className="mb-1 flex items-start gap-2 text-lg text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-gold-soft)]">
                          {related.title}
                          <ArrowUpRight
                            size={14}
                            className="mt-1 shrink-0 text-[var(--text-dim)] transition-colors group-hover:text-[var(--accent-gold-soft)]"
                          />
                        </h3>

                        <p className="line-clamp-2 text-sm text-[var(--text-muted)]">
                          {related.excerpt}
                        </p>

                        <div className="mt-3 flex items-center gap-4 text-xs text-[var(--text-dim)]">
                          <time dateTime={related.publishedAt} className="flex items-center gap-1.5">
                            <Calendar size={12} />
                            {new Date(`${related.publishedAt}T00:00:00`).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                timeZone: 'UTC',
                              }
                            )}
                          </time>
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} />
                            {related.readingTime}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-12" data-motion="rise" style={motionDelay(340)}>
            <div className="site-divider mb-8" />
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
              <Link
                href="/articles"
                prefetch={false}
                className="inline-flex items-center gap-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              >
                <ArrowLeft size={14} />
                All articles
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[var(--accent-gold)] transition-colors hover:text-[var(--accent-gold-soft)]"
              >
                About Mina
                <ArrowUpRight size={14} />
              </Link>
              <NewsletterCTA />
            </div>
          </div>
        </article>

        {/* Right column: empty spacer for symmetry (desktop only) */}
        <div className="hidden xl:block" />
      </div>
    </main>
  );
}
