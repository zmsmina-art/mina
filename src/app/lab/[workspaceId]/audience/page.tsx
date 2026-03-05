import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { authorizeWorkspace } from '@/lib/lab/auth';
import LabAudienceClient from '@/components/lab/LabAudienceClient';

type Props = {
  params: Promise<{ workspaceId: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Audience Lock — Positioning Lab',
    robots: { index: false, follow: false },
  };
}

export default async function LabAudiencePage({ params }: Props) {
  const { workspaceId } = await params;

  const workspace = await authorizeWorkspace(workspaceId);
  if (!workspace) {
    redirect('/lab?error=unauthorized');
  }

  const existingAudience = workspace.modules.audience ?? null;

  return (
    <LabAudienceClient
      workspaceId={workspaceId}
      existingAudience={existingAudience}
    />
  );
}
