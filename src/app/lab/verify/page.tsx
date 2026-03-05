import { redirect } from 'next/navigation';
import { verifyMagicLink, setLabCookie } from '@/lib/lab/auth';
import { touchWorkspace } from '@/lib/lab/storage';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LabVerifyPage({ searchParams }: Props) {
  const params = await searchParams;
  const token = typeof params.token === 'string' ? params.token : null;
  const workspaceId = typeof params.workspace === 'string' ? params.workspace : null;

  if (!token || !workspaceId) {
    redirect('/lab?error=invalid');
  }

  // Verify the token and prepare the redirect destination.
  // NOTE: redirect() throws a special Next.js error, so it must NOT be
  // inside a try/catch — otherwise the catch swallows the redirect.
  let destination = '/lab?error=failed';

  try {
    const workspace = await verifyMagicLink(token);
    if (!workspace || workspace.id !== workspaceId) {
      destination = '/lab?error=expired';
    } else {
      await setLabCookie(token, workspaceId);
      await touchWorkspace(workspaceId);
      destination = `/lab/${workspaceId}`;
    }
  } catch (err) {
    console.error('Magic link verification error:', err);
    destination = '/lab?error=failed';
  }

  redirect(destination);
}
