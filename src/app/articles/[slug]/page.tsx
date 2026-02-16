import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticlesSorted, getRelatedArticles } from '@/data/articles';
import ArticlePageClient from '@/components/ArticlePageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticlesSorted();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  const ogImageUrl = `https://minamankarious.com/api/og?title=${encodeURIComponent(article.title)}&excerpt=${encodeURIComponent(article.excerpt)}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `https://minamankarious.com/articles/${article.slug}`,
    },
    openGraph: {
      title: `${article.title} | Mina Mankarious`,
      description: article.excerpt,
      url: `https://minamankarious.com/articles/${article.slug}`,
      siteName: 'Mina Mankarious',
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      section: article.tags[0],
      authors: ['Mina Mankarious'],
      tags: article.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      site: '@minamnkarious',
      creator: '@minamnkarious',
      images: [
        {
          url: ogImageUrl,
          alt: article.title,
        },
      ],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const ogImageUrl = `https://minamankarious.com/api/og?title=${encodeURIComponent(article.title)}&excerpt=${encodeURIComponent(article.excerpt)}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: {
      '@type': 'ImageObject',
      url: ogImageUrl,
      width: 1200,
      height: 630,
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      '@id': 'https://minamankarious.com/#person',
      name: 'Mina Mankarious',
      url: 'https://minamankarious.com',
    },
    publisher: {
      '@type': 'Person',
      '@id': 'https://minamankarious.com/#person',
      name: 'Mina Mankarious',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://minamankarious.com/articles/${article.slug}`,
    },
    url: `https://minamankarious.com/articles/${article.slug}`,
    keywords: article.tags.join(', '),
    inLanguage: 'en-US',
    wordCount: article.content.split(/\s+/).length,
    timeRequired: `PT${parseInt(article.readingTime)}M`,
    isPartOf: {
      '@id': 'https://minamankarious.com/#website',
    },
  };

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
        name: article.title,
        item: `https://minamankarious.com/articles/${article.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ArticlePageClient article={article} relatedArticles={getRelatedArticles(article.slug, 3)} />
    </>
  );
}
