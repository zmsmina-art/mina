import { auth } from '@/lib/auth-brief';
import { redirect } from 'next/navigation';
import { getLatestStripe, getLatestPosthog, getLatestGithub, getLatestVercel, getLatestGsc, getHealthSummary } from '@/lib/school-events';
import HealthClient from './HealthClient';

export const dynamic = 'force-dynamic';

export default async function HealthPage() {
  const session = await auth();
  if (!session) redirect('/brief/login');

  const [stripe, posthog, github, vercel, gsc, summary] = await Promise.all([
    getLatestStripe(), getLatestPosthog(), getLatestGithub(), getLatestVercel(), getLatestGsc(), getHealthSummary(),
  ]);

  return <HealthClient stripe={stripe} posthog={posthog} github={github} vercel={vercel} gsc={gsc} summary={summary} />;
}
