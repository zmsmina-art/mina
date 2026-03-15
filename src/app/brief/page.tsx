import { Metadata } from 'next';
import { auth } from '@/lib/auth-brief';
import { redirect } from 'next/navigation';
import {
  getLatestBriefing,
  getLatestPriorities,
  getUpcomingEvents,
  getWeather,
  getSchoolEvents,
} from '@/lib/school-events';
import BriefPageClient from '@/components/BriefPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Brief',
  robots: { index: false, follow: false },
};

export default async function BriefPage() {
  const session = await auth();
  if (!session) redirect('/brief/login');

  const [briefing, priorities, upcoming, weather, schoolEvents] = await Promise.all([
    getLatestBriefing(),
    getLatestPriorities(),
    getUpcomingEvents(3),
    getWeather(),
    getSchoolEvents(),
  ]);

  return (
    <BriefPageClient
      briefing={briefing}
      priorities={priorities}
      upcoming={upcoming}
      weather={weather}
      schoolEvents={schoolEvents}
    />
  );
}
