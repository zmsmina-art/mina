import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mina Mankarious | Founder & CEO of Olunix",
  description: "Founder & CEO of Olunix - Engineering & Consulting. Final year Automotive Engineering Technology student at McMaster University. Toronto, Canada.",
  keywords: ["Mina Mankarious", "Olunix", "Engineering", "Consulting", "McMaster University", "Toronto"],
  authors: [{ name: "Mina Mankarious" }],
  openGraph: {
    title: "Mina Mankarious | Founder & CEO of Olunix",
    description: "Founder & CEO of Olunix - Engineering & Consulting. Final year Automotive Engineering Technology student at McMaster University.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
