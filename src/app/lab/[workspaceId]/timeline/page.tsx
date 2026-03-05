import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { authorizeWorkspace } from '@/lib/lab/auth';
import LabTimelineClient from '@/components/lab/LabTimelineClient';

type Props = {
  params: Promise<{ workspaceId: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Evolution Timeline — Positioning Lab',
    robots: { index: false, follow: false },
  };
}

export default async function LabTimelinePage({ params }: Props) {
  const { workspaceId } = await params;

  const workspace = await authorizeWorkspace(workspaceId);
  if (!workspace) {
    redirect('/lab?error=unauthorized');
  }

  const { token: _t, email: _e, ...safeWorkspace } = workspace;

  return (
    <LabTimelineClient
      snapshots={safeWorkspace.snapshots}
      workspaceId={workspaceId}
    />
  );
}
