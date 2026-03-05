import { NextResponse, type NextRequest } from 'next/server';
import { authorizeWorkspace } from '@/lib/lab/auth';
import { saveSnapshot, generateId } from '@/lib/lab/storage';
import type { PositioningSnapshot } from '@/lib/lab/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;

  const workspace = await authorizeWorkspace(workspaceId);
  if (!workspace) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const headline = typeof body.headline === 'string' ? body.headline.trim() : '';
  if (!headline) {
    return NextResponse.json({ error: 'Headline is required' }, { status: 400 });
  }

  const snapshot: PositioningSnapshot = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    headline,
    oneLiner: typeof body.oneLiner === 'string' ? body.oneLiner.trim() : '',
    targetAudience: typeof body.targetAudience === 'string' ? body.targetAudience.trim() : '',
    valueProposition: typeof body.valueProposition === 'string' ? body.valueProposition.trim() : '',
    differentiators: Array.isArray(body.differentiators) ? body.differentiators.filter((d): d is string => typeof d === 'string') : [],
    proofPoints: Array.isArray(body.proofPoints) ? body.proofPoints.filter((p): p is string => typeof p === 'string') : [],
    scores: {
      overall: typeof body.scores === 'object' && body.scores !== null ? Number((body.scores as Record<string, unknown>).overall) || 0 : 0,
      clarity: typeof body.scores === 'object' && body.scores !== null ? Number((body.scores as Record<string, unknown>).clarity) || 0 : 0,
      specificity: typeof body.scores === 'object' && body.scores !== null ? Number((body.scores as Record<string, unknown>).specificity) || 0 : 0,
      differentiation: typeof body.scores === 'object' && body.scores !== null ? Number((body.scores as Record<string, unknown>).differentiation) || 0 : 0,
      brevity: typeof body.scores === 'object' && body.scores !== null ? Number((body.scores as Record<string, unknown>).brevity) || 0 : 0,
      value_clarity: typeof body.scores === 'object' && body.scores !== null ? Number((body.scores as Record<string, unknown>).value_clarity) || 0 : 0,
    },
    percentile: typeof body.percentile === 'number' ? body.percentile : 0,
    grade: typeof body.grade === 'string' ? body.grade : 'F',
  };

  try {
    const updated = await saveSnapshot(workspaceId, snapshot);
    if (!updated) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, snapshot });
  } catch (err) {
    console.error('Snapshot save error:', err);
    return NextResponse.json({ error: 'Failed to save snapshot' }, { status: 500 });
  }
}
