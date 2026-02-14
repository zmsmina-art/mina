import Link from 'next/link';
import { Clock, Calendar, ArrowUpRight } from 'lucide-react';
import type { Article } from '@/data/articles';

interface ArticleCardProps {
  article: Article;
  index?: number;
}

export default function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div style={{ animationDelay: `${index * 80}ms` }} className="fade-in-up">
      <Link
        href={`/articles/${article.slug}`}
        className="glass-holographic scanlines rounded-xl p-6 block group relative"
      >
        <div className="data-stream-line" />

        <div className="relative z-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-md bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/10 glow-pulse"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="font-semibold text-lg text-white group-hover:text-[#8b5cf6] transition-colors mb-2 flex items-start gap-2">
            {article.title}
            <ArrowUpRight
              size={16}
              className="flex-shrink-0 mt-1 text-[#6a6a7a] group-hover:text-[#8b5cf6] transition-colors opacity-0 group-hover:opacity-100"
            />
          </h3>

          <p className="text-[#8a8a9a] text-sm leading-relaxed mb-4 line-clamp-2">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-4 text-xs text-[#6a6a7a]">
            <time dateTime={article.publishedAt} className="flex items-center gap-1.5">
              <Calendar size={12} />
              {formattedDate}
            </time>
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {article.readingTime}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
