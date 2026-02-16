'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ArticleCard from '@/components/ArticleCard';
import ReadingProgress from '@/components/ReadingProgress';
import useMotionProfile from '@/components/motion/useMotionProfile';
import type { Article } from '@/data/articles';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ArticlesPageClient({ articles }: { articles: Article[] }) {
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const motionProfile = useMotionProfile();

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
  const introOffset = motionProfile.reduced ? 0 : Math.min(motionProfile.distances.enterY, 12);
  const listExitY = motionProfile.reduced ? 0 : -Math.max(6, Math.round(motionProfile.distances.enterY * 0.65));
  const layoutTransition = motionProfile.reduced
    ? { duration: 0 }
    : { type: 'spring' as const, ...motionProfile.spring };

  const introTransitionForStep = (step: number) =>
    motionProfile.reduced
      ? { duration: 0 }
      : {
          duration: motionProfile.durations.enter,
          delay: step * motionProfile.durations.stagger,
          ease: EASE_OUT_EXPO,
        };

  return (
    <main
      id="main-content"
      data-section-theme="articles"
      className="page-enter article-motion-shell marketing-main home-royal page-gutter pb-20 pt-28 md:pb-24 md:pt-32"
    >
      <ReadingProgress />

      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: introOffset }}
          animate={{ opacity: 1, y: 0 }}
          transition={introTransitionForStep(1)}
        >
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">
            <ArrowLeft size={14} />
            Back home
          </Link>
        </motion.div>

        <motion.header
          className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: introOffset }}
          animate={{ opacity: 1, y: 0 }}
          transition={introTransitionForStep(2)}
        >
          <div>
            <h1 className="mobile-tight-title mb-2 text-[clamp(2.1rem,9.6vw,2.7rem)] text-[var(--text-primary)] md:mb-3 md:text-5xl">Articles</h1>
            <p className="text-[var(--text-muted)]">
              Thoughts on entrepreneurship, marketing, and building businesses.
            </p>
          </div>

          <motion.button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))}
            aria-label={sortOrder === 'newest' ? 'Sort articles oldest first' : 'Sort articles newest first'}
            aria-pressed={sortOrder === 'oldest'}
            className="ghost-btn article-sort-toggle w-full justify-center sm:w-auto"
            whileTap={motionProfile.reduced ? undefined : { scale: 0.99 }}
          >
            <motion.span
              aria-hidden="true"
              animate={{ rotate: sortOrder === 'newest' ? 0 : 180 }}
              transition={motionProfile.reduced ? { duration: 0 } : { duration: 0.2, ease: EASE_OUT_EXPO }}
              className="inline-flex"
            >
              <ArrowUpDown size={14} />
            </motion.span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={sortOrder}
                initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: motionProfile.reduced ? 0 : -4 }}
                transition={motionProfile.reduced ? { duration: 0 } : { duration: 0.16, ease: EASE_OUT_EXPO }}
              >
                {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </motion.header>

        {allTags.length > 0 && (
          <motion.div
            className="mb-4 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter articles by topic"
            initial={{ opacity: 0, y: introOffset }}
            animate={{ opacity: 1, y: 0 }}
            transition={introTransitionForStep(3)}
            layout
          >
            <button
              type="button"
              onClick={() => setSelectedTags([])}
              className={`filter-chip rounded-full border px-3 py-1.5 text-xs lowercase tracking-[0.08em] transition-all ${
                !isFiltering
                  ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/15 text-[var(--accent-gold-soft)]'
                  : 'border-[var(--stroke-soft)] bg-[var(--bg-elev-1)]/70 text-[var(--text-muted)] hover:border-[var(--accent-gold)]/50 hover:text-[var(--text-primary)]'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={active}
                  className={`filter-chip rounded-full border px-3 py-1.5 text-xs lowercase tracking-[0.08em] transition-all ${
                    active
                      ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/15 text-[var(--accent-gold-soft)]'
                      : 'border-[var(--stroke-soft)] bg-[var(--bg-elev-1)]/70 text-[var(--text-muted)] hover:border-[var(--accent-gold)]/50 hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {isFiltering && (
            <motion.p
              key="filter-indicator"
              className="article-state-indicator mb-8 text-xs text-[var(--text-dim)]"
              initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: motionProfile.reduced ? 0 : -4 }}
              transition={motionProfile.reduced ? { duration: 0 } : { duration: 0.18, ease: EASE_OUT_EXPO }}
            >
              Showing {filteredAndSortedArticles.length} of {articles.length} article{articles.length !== 1 ? 's' : ''}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          {filteredAndSortedArticles.length > 0 ? (
            <motion.ul
              key="article-list"
              className="article-list-motion space-y-6"
              layout
              transition={{ layout: layoutTransition }}
              initial={{ opacity: 0, y: introOffset }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredAndSortedArticles.map((article, index) => {
                  const staggerIndex = Math.min(index, 5);

                  return (
                    <motion.li
                      key={article.slug}
                      layout
                      className="article-motion-item article-motion-card"
                      initial={{ opacity: 0, y: motionProfile.reduced ? 0 : motionProfile.distances.enterY }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: listExitY }}
                      transition={{
                        layout: layoutTransition,
                        opacity: motionProfile.reduced
                          ? { duration: 0 }
                          : {
                              duration: motionProfile.durations.enter * 0.72,
                              ease: EASE_OUT_EXPO,
                              delay: staggerIndex * motionProfile.durations.stagger,
                            },
                        y: motionProfile.reduced ? { duration: 0 } : { type: 'spring', ...motionProfile.spring },
                      }}
                    >
                      <ArticleCard
                        article={article}
                        index={index}
                        animationMode="static"
                        enableRouteTransition
                      />
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <motion.p
              key="article-empty"
              className="py-12 text-center text-[var(--text-dim)]"
              initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: motionProfile.reduced ? 0 : -8 }}
              transition={motionProfile.reduced ? { duration: 0 } : { duration: 0.2, ease: EASE_OUT_EXPO }}
            >
              {isFiltering ? 'No articles match the selected tags.' : 'No articles yet. Check back soon.'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
