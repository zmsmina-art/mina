import { auth } from '@/lib/auth-brief';
import { redirect } from 'next/navigation';
import { getIdeas } from '@/lib/school-events';
import IdeasClient from './IdeasClient';

export const dynamic = 'force-dynamic';

export default async function IdeasPage() {
  const session = await auth();
  if (!session) redirect('/brief/login');

  const ideas = await getIdeas();
  return <IdeasClient ideas={ideas} />;
}
