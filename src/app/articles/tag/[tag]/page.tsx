import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import ArticleCard from '@/components/ArticleCard';
import { getAllTags, slugifyTag, getTagFromSlug, getArticlesByTag } from '@/data/articles';

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: slugifyTag(tag) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag: tagSlug } = await params;
  const tag = getTagFromSlug(tagSlug);
  if (!tag) return {};

  const articles = getArticlesByTag(tag);
  const title = `${tag} Articles — Mina Mankarious`;
  const description = `${articles.length} article${articles.length !== 1 ? 's' : ''} on ${tag.toLowerCase()} by Mina Mankarious, Founder & CEO of Olunix.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://minamankarious.com/articles/tag/${tagSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://minamankarious.com/articles/tag/${tagSlug}`,
      siteName: 'Mina Mankarious',
      type: 'website',
      images: [
        {
          url: `https://minamankarious.com/api/og?title=${encodeURIComponent(tag + ' Articles')}&excerpt=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@olmnix',
      creator: '@olmnix',
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: tagSlug } = await params;
  const tag = getTagFromSlug(tagSlug);
  if (!tag) notFound();

  const articles = getArticlesByTag(tag);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://minamankarious.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Articles',
        item: 'https://minamankarious.com/articles',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tag,
        item: `https://minamankarious.com/articles/tag/${tagSlug}`,
      },
    ],
  };

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `https://minamankarious.com/articles/tag/${tagSlug}#collection`,
    name: `${tag} Articles by Mina Mankarious`,
    description: `Articles on ${tag.toLowerCase()} by Mina Mankarious.`,
    url: `https://minamankarious.com/articles/tag/${tagSlug}`,
    isPartOf: {
      '@id': 'https://minamankarious.com/articles/#blog',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: articles.length,
      itemListElement: articles.map((article, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://minamankarious.com/articles/${article.slug}`,
        name: article.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <main
        id="main-content"
        data-section-theme="articles"
        className="page-enter marketing-main site-theme page-gutter pb-20 pt-28 md:pb-24 md:pt-32"
      >
        <div className="mx-auto max-w-4xl">
          <Link
            href="/articles"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
            All articles
          </Link>

          <header className="mb-10">
            <h1 className="mobile-tight-title mb-2 text-[clamp(2.1rem,9.6vw,2.7rem)] text-[var(--text-primary)] md:mb-3 md:text-5xl">
              {tag}
            </h1>
            <p className="text-[var(--text-muted)]">
              {articles.length} article{articles.length !== 1 ? 's' : ''} on {tag.toLowerCase()} by Mina Mankarious.
            </p>
          </header>

          <ul className="space-y-6">
            {articles.map((article, index) => (
              <li key={article.slug}>
                <ArticleCard article={article} index={index} headingLevel="h2" />
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <div className="site-divider mb-6" />
            <p className="text-sm text-[var(--text-dim)]">
              Browse more topics:{' '}
              {getAllTags()
                .filter((t) => t !== tag)
                .map((t, i, arr) => (
                  <span key={t}>
                    <Link
                      href={`/articles/tag/${slugifyTag(t)}`}
                      className="text-[var(--text-muted)] transition-colors hover:text-[var(--accent-gold-soft)]"
                    >
                      {t}
                    </Link>
                    {i < arr.length - 1 ? ', ' : ''}
                  </span>
                ))}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
