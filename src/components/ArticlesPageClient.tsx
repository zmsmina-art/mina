'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpDown } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import type { Article } from '@/data/articles';

export default function ArticlesPageClient({ articles }: { articles: Article[] }) {
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach((a) => a.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [articles]);

  const filteredAndSortedArticles = useMemo(() => {
    const filtered = selectedTags.length === 0
      ? articles
      : articles.filter((a) => a.tags.some((t) => selectedTags.includes(t)));

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [articles, sortOrder, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const isFiltering = selectedTags.length > 0;

  return (
    <div className="min-h-screen bg-[#050507] text-[#f0f0f5]">
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
            <Link href="/articles" className="text-white">Articles</Link>
          </div>
        </div>
      </nav>

      <main id="main-content" className="pt-32 pb-28 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#6a6a7a] hover:text-[#8b5cf6] transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>

          <div className="flex items-end justify-between mb-12 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Articles</h1>
              <p className="text-[#8a8a9a] text-lg">
                Thoughts on entrepreneurship, marketing, and building businesses.
              </p>
              <p className="text-sm text-[#6a6a7a] mt-3">
                Learn more about the author on the{' '}
                <Link href="/about" className="text-[#8b5cf6] hover:text-white transition-colors">
                  About page
                </Link>.
              </p>
            </div>

            <button
              onClick={() => setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))}
              aria-label={sortOrder === 'newest' ? 'Sort articles oldest first' : 'Sort articles newest first'}
              aria-pressed={sortOrder === 'oldest'}
              className="flex items-center gap-2 text-sm text-[#8a8a9a] hover:text-white border border-white/10 hover:border-[#8b5cf6]/30 rounded-lg px-3 py-2 transition-all flex-shrink-0"
            >
              <ArrowUpDown size={14} />
              <span className="hidden sm:inline">{sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}</span>
            </button>
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Filter articles by topic">
              <button
                onClick={() => setSelectedTags([])}
                className={`text-xs px-3 py-1.5 rounded-md border transition-all duration-200 cursor-pointer ${
                  !isFiltering
                    ? 'bg-[#8b5cf6] text-white border-[#8b5cf6]'
                    : 'bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/10 hover:bg-[#8b5cf6]/20'
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
                    className={`text-xs px-3 py-1.5 rounded-md border transition-all duration-200 cursor-pointer ${
                      active
                        ? 'bg-[#8b5cf6] text-white border-[#8b5cf6]'
                        : 'bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/10 hover:bg-[#8b5cf6]/20'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          )}

          {isFiltering && (
            <p className="text-xs text-[#6a6a7a] mb-8">
              Showing {filteredAndSortedArticles.length} of {articles.length} article{articles.length !== 1 ? 's' : ''}
            </p>
          )}

          {!isFiltering && <div className="mb-4" />}

          <div className="space-y-6">
            {filteredAndSortedArticles.map((article, i) => (
              <ArticleCard key={article.slug} article={article} index={i} />
            ))}
          </div>

          {filteredAndSortedArticles.length === 0 && (
            <p className="text-[#6a6a7a] text-center py-12">
              {isFiltering
                ? 'No articles match the selected tags.'
                : 'No articles yet. Check back soon.'}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
