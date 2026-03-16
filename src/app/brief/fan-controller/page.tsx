import { auth } from '@/lib/auth-brief';
import { redirect } from 'next/navigation';
import FanControllerClient from './FanControllerClient';

export const dynamic = 'force-dynamic';

export default async function FanControllerPage() {
  const session = await auth();
  if (!session) redirect('/brief/login');

  return <FanControllerClient />;
}
