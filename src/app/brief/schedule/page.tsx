import { auth } from '@/lib/auth-brief';
import { redirect } from 'next/navigation';
import { getWeekEvents, getScheduleNarrative } from '@/lib/school-events';
import ScheduleClient from './ScheduleClient';

export const dynamic = 'force-dynamic';

export default async function SchedulePage() {
  const session = await auth();
  if (!session) redirect('/brief/login');

  const [events, narrative] = await Promise.all([
    getWeekEvents(),
    getScheduleNarrative(),
  ]);

  return <ScheduleClient events={events} narrative={narrative} />;
}
