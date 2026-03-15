import { Metadata } from 'next';
import {
  getLatestBriefing,
  getLatestPriorities,
  getUpcomingEvents,
  getWeather,
  getSchoolEvents,
} from '@/lib/school-events';
import BriefPageClient from '@/components/BriefPageClient';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Brief',
  robots: { index: false, follow: false },
};

export default async function BriefPage() {
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
