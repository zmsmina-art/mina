import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Clock, Calendar, ArrowUpRight } from 'lucide-react';
import type { Article } from '@/data/articles';
import ArticleTransitionLink from '@/components/navigation/ArticleTransitionLink';

interface ArticleCardProps {
  article: Article;
  index?: number;
  animationMode?: 'reveal' | 'static';
  enableRouteTransition?: boolean;
}

export default function ArticleCard({
  article,
  index = 0,
  animationMode = 'reveal',
  enableRouteTransition = false,
}: ArticleCardProps) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const wrapperClassName = animationMode === 'reveal' ? 'reveal reveal--up' : undefined;
  const wrapperStyle =
    animationMode === 'reveal'
      ? { transitionDelay: `${index * 90}ms` }
      : undefined;
  const articleHref = `/articles/${article.slug}`;
  const cardClassName = 'glass-panel compact-card card-lift group block border border-[#292524]';
  const sharedElementStyle = enableRouteTransition
    ? ({ viewTransitionName: `article-card-${article.slug}` } as CSSProperties)
    : undefined;

  const cardContent = (
    <>
      <div className="mb-3 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
          </span>
        ))}
      </div>

      <h3 className="mb-2 flex items-start gap-2 text-lg leading-snug text-[#f5f0e8] transition-colors group-hover:text-[#e8c97a] sm:text-xl">
        {article.title}
        <ArrowUpRight size={14} className="mt-1 shrink-0 text-[#8b857b] transition-colors group-hover:text-[#e8c97a]" />
      </h3>

      <p className="mb-4 text-sm leading-relaxed text-[#c8c2b6]">{article.excerpt}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#968f81]">
        <time dateTime={article.publishedAt} className="flex items-center gap-1.5">
          <Calendar size={12} />
          {formattedDate}
        </time>
        <span className="flex items-center gap-1.5">
          <Clock size={12} />
          {article.readingTime}
        </span>
      </div>
    </>
  );

  return (
    <div className={wrapperClassName} style={wrapperStyle}>
      {enableRouteTransition ? (
        <ArticleTransitionLink
          href={articleHref}
          direction="forward"
          className={cardClassName}
          style={sharedElementStyle}
        >
          {cardContent}
        </ArticleTransitionLink>
      ) : (
        <Link href={articleHref} className={cardClassName} style={sharedElementStyle}>
          {cardContent}
        </Link>
      )}
    </div>
  );
}
