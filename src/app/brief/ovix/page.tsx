import { auth } from '@/lib/auth-brief';
import { redirect } from 'next/navigation';
import { OvixVoice } from '@/components/ovix/OvixVoice';

export const dynamic = 'force-dynamic';

export default async function OvixPage() {
  const session = await auth();
  if (!session) redirect('/brief/login');

  return <OvixVoice />;
}
