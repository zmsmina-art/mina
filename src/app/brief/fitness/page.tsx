import { auth } from '@/lib/auth-brief';
import { redirect } from 'next/navigation';
import { getSplits, getWeekProgress, getStreak } from '@/lib/school-events';
import FitnessClient from './FitnessClient';

export const dynamic = 'force-dynamic';

export default async function FitnessPage() {
  const session = await auth();
  if (!session) redirect('/brief/login');

  const [splits, weekLogs, streak] = await Promise.all([
    getSplits(), getWeekProgress(), getStreak(),
  ]);

  return <FitnessClient splits={splits} weekLogs={weekLogs} streak={streak} />;
}
