import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { authorizeWorkspace } from '@/lib/lab/auth';
import LabAgentClient from '@/components/lab/LabAgentClient';
import type { AgentMessage } from '@/lib/lab/agent-types';

type Props = {
  params: Promise<{ workspaceId: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Your Workspace — Positioning Lab',
    robots: { index: false, follow: false },
  };
}

export default async function LabWorkspacePage({ params }: Props) {
  const { workspaceId } = await params;

  const workspace = await authorizeWorkspace(workspaceId);
  if (!workspace) {
    redirect('/lab?error=unauthorized');
  }

  // Strip sensitive fields
  const { token: _t, email: _e, ...safeWorkspace } = workspace;

  // Map coach history to agent messages (cards are stored inline)
  const initialHistory: AgentMessage[] = safeWorkspace.coachHistory.map((msg) => ({
    ...msg,
    cards: (msg as AgentMessage).cards,
  }));

  return (
    <LabAgentClient
      workspace={safeWorkspace}
      workspaceId={workspaceId}
      initialHistory={initialHistory}
    />
  );
}
