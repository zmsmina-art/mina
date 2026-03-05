import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { authorizeWorkspace } from '@/lib/lab/auth';
import LabDifferentiatorClient from '@/components/lab/LabDifferentiatorClient';

type Props = {
  params: Promise<{ workspaceId: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'The Differentiator — Positioning Lab',
    robots: { index: false, follow: false },
  };
}

export default async function LabDifferentiatorPage({ params }: Props) {
  const { workspaceId } = await params;

  const workspace = await authorizeWorkspace(workspaceId);
  if (!workspace) {
    redirect('/lab?error=unauthorized');
  }

  const existingDifferentiator = workspace.modules.differentiator ?? null;

  return (
    <LabDifferentiatorClient
      workspaceId={workspaceId}
      existingDifferentiator={existingDifferentiator}
    />
  );
}
