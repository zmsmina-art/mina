import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { authorizeWorkspace } from '@/lib/lab/auth';
import LabPainClient from '@/components/lab/LabPainClient';

type Props = {
  params: Promise<{ workspaceId: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Pain Excavation — Positioning Lab',
    robots: { index: false, follow: false },
  };
}

export default async function LabPainPage({ params }: Props) {
  const { workspaceId } = await params;

  const workspace = await authorizeWorkspace(workspaceId);
  if (!workspace) {
    redirect('/lab?error=unauthorized');
  }

  const existingPain = workspace.modules.pain ?? null;
  const audienceCard = workspace.modules.audience ?? null;

  return (
    <LabPainClient
      workspaceId={workspaceId}
      existingPain={existingPain}
      audienceCard={audienceCard}
    />
  );
}
