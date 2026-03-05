import { NextResponse, type NextRequest } from 'next/server';
import { verifyMagicLink, setLabCookie } from '@/lib/lab/auth';
import { touchWorkspace } from '@/lib/lab/storage';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const workspaceId = searchParams.get('workspace');

  if (!token || !workspaceId) {
    return NextResponse.redirect(new URL('/lab?error=invalid', request.url));
  }

  try {
    const workspace = await verifyMagicLink(token);
    if (!workspace || workspace.id !== workspaceId) {
      return NextResponse.redirect(new URL('/lab?error=expired', request.url));
    }

    await setLabCookie(token, workspaceId);
    await touchWorkspace(workspaceId);

    return NextResponse.redirect(new URL(`/lab/${workspaceId}`, request.url));
  } catch (err) {
    console.error('Magic link verification error:', err);
    return NextResponse.redirect(new URL('/lab?error=failed', request.url));
  }
}
