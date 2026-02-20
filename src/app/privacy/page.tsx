import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for minamankarious.com',
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="marketing-main home-royal page-gutter pb-20 pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft size={14} />
          Back home
        </Link>

        <h1 className="mb-4 text-4xl text-[var(--text-primary)] md:text-5xl">Privacy Policy</h1>
        <p className="mb-10 text-sm text-[var(--text-dim)]">Last updated: February 19, 2026</p>

        <div className="site-divider mb-10" />

        <div className="article-prose space-y-8 text-[0.98rem] text-[var(--text-muted)] sm:text-[1.03rem]">
          <section>
            <h2>Overview</h2>
            <p>
              This website, minamankarious.com, is the personal portfolio of Mina Mankarious. Your privacy matters.
              This policy explains what data is collected and how it is used.
            </p>
          </section>

          <section>
            <h2>Information Collected</h2>
            <p>This site collects minimal, anonymous analytics data through Vercel Analytics, including:</p>
            <ul>
              <li>Page views and navigation patterns</li>
              <li>Referral sources (how you found this site)</li>
              <li>Device type, browser, and operating system</li>
              <li>Country-level location (no precise geolocation)</li>
            </ul>
            <p>
              No personally identifiable information (PII) is collected through analytics. No cookies are used for tracking.
              Vercel Analytics is privacy-focused and GDPR-compliant.
            </p>
          </section>

          <section>
            <h2>Newsletter</h2>
            <p>
              If you subscribe to the newsletter, your email address is collected and sent to Buttondown,
              a third-party email service, to manage subscriptions and deliver emails. Your email is used
              solely for newsletter delivery and is never sold or shared beyond this purpose.
              You can unsubscribe at any time via the link in any newsletter email.
            </p>
          </section>

          <section>
            <h2>Contact Information</h2>
            <p>
              If you reach out via the email link on this site, your email address and message content
              are used solely to respond to your inquiry. Your contact information is never sold or shared
              with third parties.
            </p>
          </section>

          <section>
            <h2>Third-Party Services</h2>
            <p>This site uses the following third-party services:</p>
            <ul>
              <li><strong>Vercel</strong> — Hosting and analytics</li>
              <li><strong>Google Fonts</strong> — Typography (loaded from Google servers)</li>
              <li><strong>Buttondown</strong> — Newsletter subscriptions. If you subscribe to the newsletter, your email address is sent to Buttondown for delivery. Buttondown&apos;s privacy policy governs how they handle your data.</li>
            </ul>
            <p>Each service has its own privacy policy governing data it collects.</p>
          </section>

          <section>
            <h2>External Links</h2>
            <p>
              This site contains links to external websites (LinkedIn, GitHub, Crunchbase, etc.).
              These sites have their own privacy policies, and this site is not responsible for their
              content or practices.
            </p>
          </section>

          <section>
            <h2>Changes</h2>
            <p>
              This policy may be updated from time to time. Changes will be reflected on this page
              with an updated date.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              For questions about this policy, reach out at{' '}
              <a href="mailto:mina@olunix.com" className="text-[var(--accent-gold)] hover:text-[var(--accent-gold-soft)]">
                mina@olunix.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
