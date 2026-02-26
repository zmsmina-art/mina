import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import type { ArticleSummary } from '@/data/articles';
import { motionDelay } from '@/lib/utils';


interface WritingSectionProps {
  displayedArticles: ArticleSummary[];
  totalArticles: number;
}

export default function WritingSection({ displayedArticles, totalArticles }: WritingSectionProps) {
  return (
    <section id="articles" data-section-theme="writing" className="command-section page-gutter section-block section-band">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="command-label" data-motion="sweep-left">
              Writing
            </p>
            <h2
              className="home-heading-xl mt-4 max-w-2xl text-[clamp(2rem,7vw,2.8rem)] leading-[1.06] text-[var(--text-primary)]"
              data-motion="rise"
              style={motionDelay(110)}
            >
              Public notes on AI startup growth, positioning, and execution.
            </h2>
          </div>

          <Link
            href="/articles"
            className="hidden items-center gap-2 text-sm lowercase tracking-[0.14em] text-[var(--accent-brass)] transition-colors hover:text-[var(--accent-brass-soft)] md:inline-flex"
            data-motion="fade"
            style={motionDelay(180)}
          >
            View all articles
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="mt-8 space-y-6">
          {displayedArticles.map((article, index) => (
            <ArticleCard key={article.slug} article={article} index={index} enableRouteTransition />
          ))}
        </div>

        {totalArticles > displayedArticles.length && (
          <div className="mt-8 text-center" data-motion="rise" style={motionDelay(360)}>
            <Link href="/articles" className="accent-btn">
              Explore all writing
              <ArrowUpRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
