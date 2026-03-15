import { Metadata } from 'next';
import { getSchoolEvents } from '@/lib/school-events';
import BriefPageClient from '@/components/BriefPageClient';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Brief',
  robots: { index: false, follow: false },
};

export default async function BriefPage() {
  const events = await getSchoolEvents();

  const serialized = events.map((e) => ({
    ...e,
    startTime: e.startTime.toISOString(),
    endTime: e.endTime.toISOString(),
  }));

  return <BriefPageClient events={serialized} />;
}
