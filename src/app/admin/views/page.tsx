'use client';

import { useEffect, useState } from 'react';
import { Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ArticleViews {
  slug: string;
  title: string;
  views: number;
}

export default function AdminViewsPage() {
  const [articles, setArticles] = useState<ArticleViews[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    fetch('/api/views/all')
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles);
        setTotalViews(data.articles.reduce((sum: number, a: ArticleViews) => sum + a.views, 0));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to site
        </Link>

        <h1 className="mb-2 text-3xl font-semibold">Article Views</h1>
        <p className="mb-8 text-neutral-500">Private dashboard — sorted by views</p>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-5 py-4">
              <Eye size={20} className="text-neutral-400" />
              <div>
                <p className="text-2xl font-semibold">{totalViews.toLocaleString()}</p>
                <p className="text-sm text-neutral-500">Total views across all articles</p>
              </div>
            </div>

            <div className="space-y-2">
              {articles.map((article, i) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-5 py-4 transition-colors hover:border-white/10 hover:bg-white/[0.04]"
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <span className="mr-3 text-sm text-neutral-600">#{i + 1}</span>
                    <span className="text-sm text-neutral-200">{article.title}</span>
                  </div>
                  <span className="flex shrink-0 items-center gap-1.5 text-sm tabular-nums text-neutral-400">
                    <Eye size={14} />
                    {article.views.toLocaleString()}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
