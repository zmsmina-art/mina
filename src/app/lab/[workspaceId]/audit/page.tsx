import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { authorizeWorkspace } from '@/lib/lab/auth';
import LabAuditClient from '@/components/lab/LabAuditClient';

type Props = {
  params: Promise<{ workspaceId: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'The Audit — Positioning Lab',
    robots: { index: false, follow: false },
  };
}

export default async function LabAuditPage({ params }: Props) {
  const { workspaceId } = await params;

  const workspace = await authorizeWorkspace(workspaceId);
  if (!workspace) {
    redirect('/lab?error=unauthorized');
  }

  const existingAudit = workspace.modules.audit ?? null;

  return (
    <LabAuditClient
      workspaceId={workspaceId}
      existingAudit={existingAudit}
    />
  );
}
