import type { Metadata } from 'next';
import BookingPageClient from '@/components/BookingPageClient';

export const metadata: Metadata = {
  title: 'Book a Call',
  description:
    'Schedule a 30-minute call with Mina Mankarious to discuss positioning, marketing strategy, or growth for your AI startup.',
  alternates: {
    canonical: 'https://minamankarious.com/book',
  },
  openGraph: {
    title: 'Book a Call | Mina Mankarious',
    description:
      'Schedule a 30-minute call with Mina Mankarious to discuss positioning, marketing strategy, or growth for your AI startup.',
    url: 'https://minamankarious.com/book',
    siteName: 'Mina Mankarious',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://minamankarious.com/api/og',
        width: 1200,
        height: 630,
        alt: 'Book a Call with Mina Mankarious',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a Call | Mina Mankarious',
    description:
      'Schedule a 30-minute call with Mina Mankarious to discuss positioning, marketing strategy, or growth for your AI startup.',
    images: [
      {
        url: 'https://minamankarious.com/api/og',
        alt: 'Book a Call with Mina Mankarious',
      },
    ],
  },
};

export default function BookPage() {
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
        name: 'Book a Call',
        item: 'https://minamankarious.com/book',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BookingPageClient />
    </>
  );
}
