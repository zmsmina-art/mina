import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { authorizeWorkspace } from '@/lib/lab/auth';
import LabHeadlinesClient from '@/components/lab/LabHeadlinesClient';

type Props = {
  params: Promise<{ workspaceId: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Headline Forge — Positioning Lab',
    robots: { index: false, follow: false },
  };
}

export default async function LabHeadlinesPage({ params }: Props) {
  const { workspaceId } = await params;

  const workspace = await authorizeWorkspace(workspaceId);
  if (!workspace) {
    redirect('/lab?error=unauthorized');
  }

  const existingHeadlines = workspace.modules.headlines ?? null;
  const currentSnapshot = workspace.currentSnapshot ?? null;

  return (
    <LabHeadlinesClient
      workspaceId={workspaceId}
      existingHeadlines={existingHeadlines}
      currentSnapshot={currentSnapshot}
    />
  );
}
