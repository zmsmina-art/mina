'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpDown } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import type { Article } from '@/data/articles';

export default function ArticlesPageClient({ articles }: { articles: Article[] }) {
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach((article) => article.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [articles]);

  const filteredAndSortedArticles = useMemo(() => {
    const filtered =
      selectedTags.length === 0
        ? articles
        : articles.filter((article) => article.tags.some((tag) => selectedTags.includes(tag)));

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [articles, sortOrder, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const isFiltering = selectedTags.length > 0;

  return (
    <main id="main-content" className="page-enter page-gutter pb-20 pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="reveal reveal--up mb-8 inline-flex items-center gap-2 text-sm text-[#b2ab9f] transition-colors hover:text-[#f5f0e8]" style={{ transitionDelay: '80ms' }}>
          <ArrowLeft size={14} />
          Back home
        </Link>

        <header className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mobile-tight-title reveal reveal--up mb-2 text-[clamp(2.1rem,9.6vw,2.7rem)] text-[#f5f0e8] md:mb-3 md:text-5xl" style={{ transitionDelay: '120ms' }}>Articles</h1>
            <p className="reveal reveal--up text-[#c8c2b6]" style={{ transitionDelay: '180ms' }}>
              Thoughts on entrepreneurship, marketing, and building businesses.
            </p>
          </div>

          <button
            onClick={() => setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))}
            aria-label={sortOrder === 'newest' ? 'Sort articles oldest first' : 'Sort articles newest first'}
            aria-pressed={sortOrder === 'oldest'}
            className="reveal reveal--fade ghost-btn w-full justify-center sm:w-auto"
            style={{ transitionDelay: '220ms' }}
          >
            <ArrowUpDown size={14} />
            {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
          </button>
        </header>

        {allTags.length > 0 && (
          <div className="reveal reveal--up mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter articles by topic" style={{ transitionDelay: '260ms' }}>
            <button
              onClick={() => setSelectedTags([])}
              className={`filter-chip rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.08em] transition-all ${
                !isFiltering
                  ? 'border-[#d4a853] bg-[#d4a853]/15 text-[#e8c97a]'
                  : 'border-[#292524] bg-[#1c1b18]/70 text-[#c8c2b6] hover:border-[#d4a853]/50 hover:text-[#f5f0e8]'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  aria-pressed={active}
                  className={`filter-chip rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.08em] transition-all ${
                    active
                      ? 'border-[#d4a853] bg-[#d4a853]/15 text-[#e8c97a]'
                      : 'border-[#292524] bg-[#1c1b18]/70 text-[#c8c2b6] hover:border-[#d4a853]/50 hover:text-[#f5f0e8]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}

        {isFiltering && (
          <p className="mb-8 text-xs text-[#8f887b]">
            Showing {filteredAndSortedArticles.length} of {articles.length} article{articles.length !== 1 ? 's' : ''}
          </p>
        )}

        <div className="space-y-6">
          {filteredAndSortedArticles.map((article, index) => (
            <ArticleCard key={article.slug} article={article} index={index} />
          ))}
        </div>

        {filteredAndSortedArticles.length === 0 && (
          <p className="py-12 text-center text-[#8f887b]">
            {isFiltering ? 'No articles match the selected tags.' : 'No articles yet. Check back soon.'}
          </p>
        )}
      </div>
    </main>
  );
}
