import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://minamankarious.com"),
  alternates: {
    canonical: "https://minamankarious.com",
  },
  title: "Mina Mankarious | Founder & CEO of Olunix",
  description: "Founder & CEO of Olunix - Marketing & Consulting. Final year Automotive Engineering Technology student at McMaster University. Toronto, Canada.",
  keywords: ["Mina Mankarious", "Olunix", "Marketing", "Consulting", "McMaster University", "Toronto", "Boardy", "Hope Bible Church"],
  authors: [{ name: "Mina Mankarious" }],
  creator: "Mina Mankarious",
  openGraph: {
    title: "Mina Mankarious | Founder & CEO of Olunix",
    description: "Founder & CEO of Olunix - Marketing & Consulting. Final year Automotive Engineering Technology student at McMaster University.",
    url: "https://minamankarious.com",
    siteName: "Mina Mankarious",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/headshot.png",
        width: 400,
        height: 400,
        alt: "Mina Mankarious",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Mina Mankarious | Founder & CEO of Olunix",
    description: "Founder & CEO of Olunix - Marketing & Consulting. McMaster University.",
    images: ["/headshot.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mina Mankarious",
    url: "https://minamankarious.com",
    image: "https://minamankarious.com/headshot.png",
    jobTitle: "Founder & CEO",
    worksFor: {
      "@type": "Organization",
      name: "Olunix",
      url: "https://olunix.com",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "McMaster University",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressCountry: "CA",
    },
    sameAs: [
      "https://linkedin.com/in/mina-mankarious",
      "https://olunix.com",
    ],
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
