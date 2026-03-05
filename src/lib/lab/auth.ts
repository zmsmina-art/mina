/* ------------------------------------------------------------------ */
/*  Positioning Lab — Auth utilities (magic link, cookie, middleware)  */
/* ------------------------------------------------------------------ */

import { cookies } from 'next/headers';
import { getWorkspaceByToken, getWorkspace } from './storage';
import type { Workspace } from './types';

const COOKIE_NAME = 'lab_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

/** Set the auth cookie after verifying a magic link */
export async function setLabCookie(token: string, workspaceId: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, `${workspaceId}:${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/lab',
    maxAge: COOKIE_MAX_AGE,
  });
}

/** Read the lab cookie and return the workspace if valid */
export async function getLabSession(): Promise<Workspace | null> {
  const jar = await cookies();
  const value = jar.get(COOKIE_NAME)?.value;
  if (!value) return null;

  const [workspaceId, token] = value.split(':');
  if (!workspaceId || !token) return null;

  const workspace = await getWorkspace(workspaceId);
  if (!workspace || workspace.token !== token) return null;

  return workspace;
}

/** Validate a magic link token and return the workspace */
export async function verifyMagicLink(token: string): Promise<Workspace | null> {
  return getWorkspaceByToken(token);
}

/** Check if a request is authorized for a given workspace */
export async function authorizeWorkspace(
  workspaceId: string
): Promise<Workspace | null> {
  const session = await getLabSession();
  if (!session || session.id !== workspaceId) return null;
  return session;
}
