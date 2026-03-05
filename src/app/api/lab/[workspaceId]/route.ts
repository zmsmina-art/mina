import { NextResponse } from 'next/server';
import { authorizeWorkspace } from '@/lib/lab/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;

  try {
    const workspace = await authorizeWorkspace(workspaceId);
    if (!workspace) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Strip sensitive fields before returning
    const { token: _token, email: _email, ...safe } = workspace;
    return NextResponse.json(safe);
  } catch (err) {
    console.error('Workspace fetch error:', err);
    return NextResponse.json({ error: 'Failed to load workspace' }, { status: 500 });
  }
}
