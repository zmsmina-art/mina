'use client';

import Link from 'next/link';
import { useState, type CSSProperties } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { ArrowLeft, ArrowUpRight, Calendar, Clock, Linkedin, Check, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import ReadingProgress from '@/components/ReadingProgress';
import useMotionProfile from '@/components/motion/useMotionProfile';
import ArticleTransitionLink from '@/components/navigation/ArticleTransitionLink';
import CardGlow from '@/components/ui/card-glow';
import { NewsletterCTA } from '@/components/NewsletterModal';
import type { Article } from '@/data/articles';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

function ShareButtons({ article }: { article: Article }) {
  const [copied, setCopied] = useState(false);
  const url = `https://minamankarious.com/articles/${article.slug}`;
  const text = `${article.title} by Mina Mankarious`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[var(--text-dim)]">Share</span>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--stroke-soft)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent-gold)]/50 hover:text-[var(--text-primary)]"
      >
        <Linkedin size={14} />
      </a>
      <a
        href={`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--stroke-soft)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent-gold)]/50 hover:text-[var(--text-primary)]"
      >
        <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? 'Link copied' : 'Copy link'}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--stroke-soft)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent-gold)]/50 hover:text-[var(--text-primary)]"
      >
        {copied ? <Check size={14} /> : <LinkIcon size={14} />}
      </button>
    </div>
  );
}

export default function ArticlePageClient({ article, relatedArticles = [] }: { article: Article; relatedArticles?: Article[] }) {
  const motionProfile = useMotionProfile();

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const proseEnterY = motionProfile.reduced ? 0 : motionProfile.distances.proseY;
  const sharedHeaderStyle = ({ viewTransitionName: `article-card-${article.slug}` } as CSSProperties);
  const sequenceTransition = (step: number, duration = motionProfile.durations.enter) =>
    motionProfile.reduced
      ? { duration: 0 }
      : {
          duration,
          delay: step * motionProfile.durations.stagger,
          ease: EASE_OUT_EXPO,
        };

  return (
    <main
      id="main-content"
      data-section-theme="article"
      className="page-enter article-motion-shell marketing-main site-theme page-gutter pb-20 pt-28 md:pb-24 md:pt-32"
    >
      <ReadingProgress />

      <article className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={sequenceTransition(1)}
        >
          <ArticleTransitionLink
            href="/articles"
            direction="back"
            className="mb-10 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
            Back to articles
          </ArticleTransitionLink>
        </motion.div>

        <motion.header
          className="mb-10"
          style={sharedHeaderStyle}
          initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={sequenceTransition(2)}
        >
          <div className="mb-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
          </div>

          <h1 className="mobile-tight-title mb-4 text-[clamp(2.1rem,9.8vw,2.9rem)] leading-[1.1] text-[var(--text-primary)] md:text-5xl">{article.title}</h1>

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
        </motion.header>

        <motion.div
          className="site-divider mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={sequenceTransition(3, motionProfile.reduced ? 0 : motionProfile.durations.enter * 0.6)}
        />

        <motion.div
          className="article-prose text-[0.98rem] sm:text-[1.03rem]"
          initial={{ opacity: 0, y: proseEnterY }}
          animate={{ opacity: 1, y: 0 }}
          transition={sequenceTransition(4, motionProfile.reduced ? 0 : motionProfile.durations.enter * 0.75)}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
            {article.content}
          </ReactMarkdown>
        </motion.div>

        <motion.div
          className="mt-10 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={sequenceTransition(5, motionProfile.reduced ? 0 : motionProfile.durations.enter * 0.6)}
        >
          <ShareButtons article={article} />
        </motion.div>

        {relatedArticles.length > 0 && (
          <motion.section
            className="mt-16"
            initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={sequenceTransition(5, motionProfile.reduced ? 0 : motionProfile.durations.enter * 0.72)}
          >
            <div className="site-divider mb-7" />
            <h2 className="mb-6 text-2xl text-[var(--text-primary)]">Related Articles</h2>
            <ul className="space-y-4">
              {relatedArticles.map((related, index) => (
                <motion.li
                  key={related.slug}
                  initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    motionProfile.reduced
                      ? { duration: 0 }
                      : {
                          duration: motionProfile.durations.enter * 0.66,
                          delay: Math.min(index, 2) * Math.min(motionProfile.durations.stagger, 0.04),
                          ease: EASE_OUT_EXPO,
                        }
                  }
                >
                  <Link href={`/articles/${related.slug}`} className="glass-panel compact-card article-motion-card group relative block overflow-hidden">
                    <CardGlow />
                    <div className="relative z-[1]">
                      <div className="mb-2 flex flex-wrap gap-2">
                        {related.tags.map((tag) => (
                          <span key={tag} className="tag-chip">{tag}</span>
                        ))}
                      </div>

                      <h3 className="mb-1 flex items-start gap-2 text-lg text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-gold-soft)]">
                        {related.title}
                        <ArrowUpRight size={14} className="mt-1 shrink-0 text-[var(--text-dim)] transition-colors group-hover:text-[var(--accent-gold-soft)]" />
                      </h3>

                      <p className="line-clamp-2 text-sm text-[var(--text-muted)]">{related.excerpt}</p>

                      <div className="mt-3 flex items-center gap-4 text-xs text-[var(--text-dim)]">
                        <time dateTime={related.publishedAt} className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {new Date(related.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </time>
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} />
                          {related.readingTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.section>
        )}

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: motionProfile.reduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={sequenceTransition(6, motionProfile.reduced ? 0 : motionProfile.durations.enter * 0.7)}
        >
          <div className="site-divider mb-8" />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            <Link href="/articles" className="inline-flex items-center gap-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">
              <ArrowLeft size={14} />
              All articles
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 text-[var(--accent-gold)] transition-colors hover:text-[var(--accent-gold-soft)]">
              About Mina
              <ArrowUpRight size={14} />
            </Link>
            <NewsletterCTA />
          </div>
        </motion.div>
      </article>
    </main>
  );
}
