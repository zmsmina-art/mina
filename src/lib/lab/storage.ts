/* ------------------------------------------------------------------ */
/*  Positioning Lab — Redis storage layer                             */
/* ------------------------------------------------------------------ */

import { createClient } from 'redis';
import type {
  Workspace,
  PositioningSnapshot,
  LabModuleId,
  CoachMessage,
} from './types';

// ── Redis client (singleton) ────────────────────────────────────────

let client: ReturnType<typeof createClient> | null = null;

async function getClient() {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    client.on('error', () => {});
    await client.connect();
  }
  return client;
}

// ── Key helpers ─────────────────────────────────────────────────────

const keys = {
  workspace: (id: string) => `lab:workspace:${id}`,
  token: (token: string) => `lab:token:${token}`,
  email: (hash: string) => `lab:email:${hash}`,
};

// ── Hash email (SHA-256, no PII in storage) ─────────────────────────

export async function hashEmail(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(email.toLowerCase().trim());
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ── Token generation ────────────────────────────────────────────────

export function generateToken(): string {
  return crypto.randomUUID() + '-' + crypto.randomUUID();
}

export function generateId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 16);
}

// ── CRUD operations ─────────────────────────────────────────────────

export async function createWorkspace(email: string): Promise<Workspace> {
  const redis = await getClient();
  const emailHash = await hashEmail(email);

  // Check if workspace already exists for this email
  const existingId = await redis.get(keys.email(emailHash));
  if (existingId) {
    const existing = await getWorkspace(existingId);
    if (existing) {
      // Rotate token for security
      const oldToken = existing.token;
      const newToken = generateToken();
      existing.token = newToken;
      existing.lastVisitedAt = new Date().toISOString();
      await redis.del(keys.token(oldToken));
      await redis.set(keys.token(newToken), existing.id);
      await redis.set(keys.workspace(existing.id), JSON.stringify(existing));
      return existing;
    }
  }

  const id = generateId();
  const token = generateToken();
  const now = new Date().toISOString();

  const workspace: Workspace = {
    id,
    email: emailHash,
    token,
    createdAt: now,
    lastVisitedAt: now,
    currentSnapshot: null,
    snapshots: [],
    modules: {},
    competitors: [],
    coachHistory: [],
  };

  // Store workspace, token→id mapping, and email→id mapping
  await redis.set(keys.workspace(id), JSON.stringify(workspace));
  await redis.set(keys.token(token), id);
  await redis.set(keys.email(emailHash), id);

  return workspace;
}

export async function getWorkspace(id: string): Promise<Workspace | null> {
  const redis = await getClient();
  const data = await redis.get(keys.workspace(id));
  if (!data) return null;
  return JSON.parse(data) as Workspace;
}

export async function getWorkspaceByToken(token: string): Promise<Workspace | null> {
  const redis = await getClient();
  const id = await redis.get(keys.token(token));
  if (!id) return null;
  return getWorkspace(id);
}

export async function updateWorkspace(
  id: string,
  updater: (ws: Workspace) => Workspace
): Promise<Workspace | null> {
  const redis = await getClient();
  const data = await redis.get(keys.workspace(id));
  if (!data) return null;

  const workspace = JSON.parse(data) as Workspace;
  const updated = updater(workspace);
  updated.lastVisitedAt = new Date().toISOString();

  await redis.set(keys.workspace(id), JSON.stringify(updated));
  return updated;
}

export async function saveSnapshot(
  workspaceId: string,
  snapshot: PositioningSnapshot
): Promise<Workspace | null> {
  return updateWorkspace(workspaceId, (ws) => ({
    ...ws,
    currentSnapshot: snapshot,
    snapshots: [...ws.snapshots, snapshot],
  }));
}

export async function saveModuleArtifact(
  workspaceId: string,
  moduleId: LabModuleId,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  artifact: any
): Promise<Workspace | null> {
  return updateWorkspace(workspaceId, (ws) => ({
    ...ws,
    modules: {
      ...ws.modules,
      [moduleId]: artifact,
    },
  }));
}

export async function addCoachMessages(
  workspaceId: string,
  messages: CoachMessage[]
): Promise<Workspace | null> {
  return updateWorkspace(workspaceId, (ws) => ({
    ...ws,
    coachHistory: [...ws.coachHistory, ...messages],
  }));
}

export async function touchWorkspace(workspaceId: string): Promise<void> {
  await updateWorkspace(workspaceId, (ws) => ws);
}
