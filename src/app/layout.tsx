import type { Metadata } from 'next';
import { Cormorant_Garamond, EB_Garamond, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import LayoutRuntime from '@/components/LayoutRuntime';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
  variable: '--font-cormorant',
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  display: 'optional',
  preload: false,
  variable: '--font-eb-garamond',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://minamankarious.com'),
  alternates: {
    canonical: 'https://minamankarious.com',
    languages: {
      'en-US': 'https://minamankarious.com',
    },
    types: {
      'application/rss+xml': 'https://minamankarious.com/feed.xml',
    },
  },
  manifest: '/manifest.json',
  title: {
    default: 'Mina Mankarious — Founder & CEO of Olunix | AI Startup Growth, Toronto',
    template: '%s | Mina Mankarious',
  },
  applicationName: 'Mina Mankarious',
  description:
    'Mina Mankarious is the Founder and CEO of Olunix, helping AI startups with positioning, growth systems, and founder-led marketing. Based in Toronto, Canada.',
  keywords: [
    'Mina Mankarious',
    'Olunix',
    'AI startup marketing',
    'startup growth strategy',
    'Toronto entrepreneur',
    'marketing consultant',
    'McMaster University',
  ],
  authors: [{ name: 'Mina Mankarious', url: 'https://minamankarious.com' }],
  creator: 'Mina Mankarious',
  publisher: 'Mina Mankarious',
  category: 'Business',
  classification: 'Portfolio',
  referrer: 'strict-origin-when-cross-origin',
  openGraph: {
    title: 'Mina Mankarious — Founder & CEO of Olunix | AI Startup Growth, Toronto',
    description:
      'Mina Mankarious is the Founder and CEO of Olunix, helping AI startups with positioning, growth systems, and founder-led marketing. Based in Toronto, Canada.',
    url: 'https://minamankarious.com',
    siteName: 'Mina Mankarious',
    locale: 'en_US',
    type: 'profile',
    images: [
      {
        url: 'https://minamankarious.com/api/og',
        width: 1200,
        height: 630,
        alt: 'Mina Mankarious - Founder and CEO of Olunix',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mina Mankarious — Founder & CEO of Olunix | AI Startup Growth',
    description:
      'Mina Mankarious is the Founder and CEO of Olunix, helping AI startups with positioning, growth systems, and founder-led marketing. Based in Toronto, Canada.',
    site: '@olmnix',
    images: [
      {
        url: 'https://minamankarious.com/api/og',
        alt: 'Mina Mankarious - Founder and CEO of Olunix',
      },
    ],
    creator: '@olmnix',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-icon.png',
  },
  verification: {
    google: 'rZIuYERXXV18304PIGZJZUQ1C9Re4szYlDOskfurCxY',
  },
  other: {
    'theme-color': '#050505',
    'msapplication-TileColor': '#050505',
    'profile:first_name': 'Mina',
    'profile:last_name': 'Mankarious',
    'profile:username': 'minamankarious',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    '@type': 'Organization',
    '@id': 'https://olunix.com/#organization',
    name: 'Olunix',
    url: 'https://olunix.com',
    description: 'Marketing and consulting firm helping AI startups with strategic growth',
    foundingDate: '2024-09',
    founder: {
      '@id': 'https://minamankarious.com/#person',
    },
    logo: {
      '@type': 'ImageObject',
      url: 'https://minamankarious.com/olunix.svg',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Toronto',
      addressRegion: 'Ontario',
      addressCountry: 'CA',
    },
    sameAs: ['https://olunix.com', 'https://www.crunchbase.com/organization/olunix'],
  };

  const personSchema = {
    '@type': 'Person',
    '@id': 'https://minamankarious.com/#person',
    name: 'Mina Mankarious',
    givenName: 'Mina',
    familyName: 'Mankarious',
    alternateName: 'Mina M. Mankarious',
    url: 'https://minamankarious.com',
    mainEntityOfPage: 'https://minamankarious.com',
    image: [
      {
        '@type': 'ImageObject',
        '@id': 'https://minamankarious.com/#primaryimage',
        url: 'https://minamankarious.com/headshot.webp',
        contentUrl: 'https://minamankarious.com/headshot.webp',
        width: 800,
        height: 800,
        caption: 'Mina Mankarious - Founder and CEO of Olunix',
      },
      {
        '@type': 'ImageObject',
        url: 'https://minamankarious.com/api/og',
        contentUrl: 'https://minamankarious.com/api/og',
        width: 1200,
        height: 630,
        caption: 'Mina Mankarious - Founder and CEO of Olunix',
      },
    ],
    jobTitle: 'Founder & CEO',
    description:
      'Mina Mankarious is the Founder and CEO of Olunix, a Toronto-based marketing and consulting firm helping AI startups with positioning, growth systems, and founder-led marketing.',
    nationality: {
      '@type': 'Country',
      name: 'Canada',
    },
    birthPlace: {
      '@type': 'Place',
      name: 'Egypt',
    },
    worksFor: [
      { '@id': 'https://olunix.com/#organization' },
      {
        '@type': 'Organization',
        name: 'Boardy',
        url: 'https://boardy.com',
        description: 'AI-powered networking platform for founders',
      },
    ],
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'McMaster University',
        url: 'https://www.mcmaster.ca',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Hamilton',
          addressRegion: 'Ontario',
          addressCountry: 'CA',
        },
      },
    ],
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      educationalLevel: 'Bachelor',
      about: {
        '@type': 'DefinedTerm',
        name: 'Automotive Engineering Technology',
      },
      recognizedBy: {
        '@type': 'CollegeOrUniversity',
        name: 'McMaster University',
        url: 'https://www.mcmaster.ca',
      },
    },
    hasOccupation: [
      {
        '@type': 'Occupation',
        name: 'Chief Executive Officer',
        occupationalCategory: 'Management',
        description: 'Founder and CEO leading AI startup growth strategy and marketing consulting',
      },
      {
        '@type': 'Occupation',
        name: 'Deal Partner',
        occupationalCategory: 'Business Development',
        description: 'Building founder connections and business development pathways at Boardy',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Toronto',
      addressRegion: 'Ontario',
      addressCountry: 'CA',
    },
    email: 'mina@olunix.com',
    knowsAbout: [
      'Marketing Strategy',
      'Business Consulting',
      'Startup Growth',
      'Founder-Led Marketing',
      'AI Startup Marketing',
      'Positioning Strategy',
      'Automotive Engineering',
      'Growth Systems',
    ],
    knowsLanguage: [
      {
        '@type': 'Language',
        name: 'English',
        alternateName: 'en',
      },
      {
        '@type': 'Language',
        name: 'Arabic',
        alternateName: 'ar',
      },
    ],
    sameAs: [
      'https://www.linkedin.com/in/mina-mankarious',
      'https://x.com/olmnix',
      'https://olunix.com',
      'https://github.com/zmsmina-art',
      'https://www.youtube.com/@Mankariouss',
      'https://www.crunchbase.com/person/mina-mankarious',
      'https://mankarious.medium.com',
      'https://www.wikidata.org/wiki/Q138001904',
    ],
  };

  const websiteSchema = {
    '@type': 'WebSite',
    '@id': 'https://minamankarious.com/#website',
    url: 'https://minamankarious.com',
    name: 'Mina Mankarious',
    alternateName: ['Mina Mankarious Portfolio', 'minamankarious.com'],
    description: 'Official website of Mina Mankarious, Founder and CEO of Olunix.',
    publisher: {
      '@id': 'https://minamankarious.com/#person',
    },
    inLanguage: 'en-US',
    copyrightHolder: {
      '@id': 'https://minamankarious.com/#person',
    },
    copyrightYear: 2024,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://minamankarious.com/articles?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema, personSchema, websiteSchema],
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${ebGaramond.variable} ${playfair.variable}`}>
      <head>
        <link rel="preload" href="/fonts/switzer-regular.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="me" href="https://www.linkedin.com/in/mina-mankarious" />
        <link rel="me" href="https://x.com/olmnix" />
        <link rel="me" href="https://github.com/zmsmina-art" />
        <link rel="me" href="https://www.youtube.com/@Mankariouss" />
        <link rel="me" href="https://mankarious.medium.com" />
        <link rel="me" href="https://www.crunchbase.com/person/mina-mankarious" />
        <link rel="me" href="https://www.wikidata.org/wiki/Q138001904" />
      </head>
      <body className="antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `document.body.classList.toggle('has-site-theme',!!document.querySelector('main.site-theme'))`,
          }}
        />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <LayoutRuntime />
        <div className="grain-overlay" aria-hidden="true" />
        <SiteNav />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="page-shell">
          {children}
          <SiteFooter />
        </div>
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
