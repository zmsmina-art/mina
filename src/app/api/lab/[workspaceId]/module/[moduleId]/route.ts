import { NextResponse, type NextRequest } from 'next/server';
import { authorizeWorkspace } from '@/lib/lab/auth';
import { saveModuleArtifact } from '@/lib/lab/storage';
import type { LabModuleId } from '@/lib/lab/types';

const VALID_MODULES: LabModuleId[] = [
  'audit', 'audience', 'pain', 'differentiator',
  'headlines', 'proof', 'stress', 'onepager',
];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; moduleId: string }> }
) {
  const { workspaceId, moduleId } = await params;

  if (!VALID_MODULES.includes(moduleId as LabModuleId)) {
    return NextResponse.json({ error: 'Invalid module' }, { status: 400 });
  }

  const workspace = await authorizeWorkspace(workspaceId);
  if (!workspace) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid artifact data' }, { status: 400 });
  }

  try {
    const updated = await saveModuleArtifact(
      workspaceId,
      moduleId as LabModuleId,
      body
    );
    if (!updated) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Module save error:', err);
    return NextResponse.json({ error: 'Failed to save module' }, { status: 500 });
  }
}
