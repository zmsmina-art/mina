import { Metadata } from 'next';
import ArticlesPageClient from '@/components/ArticlesPageClient';
import { getAllArticlesSorted } from '@/data/articles';

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'Thoughts on entrepreneurship, marketing, consulting, and building businesses. Written by Mina Mankarious, Founder & CEO of Olunix.',
  alternates: {
    canonical: 'https://minamankarious.com/articles',
  },
  openGraph: {
    title: 'Articles | Mina Mankarious',
    description:
      'Thoughts on entrepreneurship, marketing, consulting, and building businesses.',
    url: 'https://minamankarious.com/articles',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articles | Mina Mankarious',
    description:
      'Thoughts on entrepreneurship, marketing, and building businesses.',
  },
};

export default function ArticlesPage() {
  const articles = getAllArticlesSorted();
  return <ArticlesPageClient articles={articles} />;
}
