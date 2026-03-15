import { sql } from './neon';

export interface SchoolEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
  isAllDay?: boolean;
}

export interface WeatherData {
  city: string;
  tempC: string | null;
  feelsLikeC: string | null;
  description: string | null;
  highC: string | null;
  lowC: string | null;
}

export interface AgentReport {
  content: string;
  createdAt: string;
}

export async function getSchoolEvents(): Promise<SchoolEvent[]> {
  const db = sql();
  const now = new Date().toISOString();
  const twoWeeksLater = new Date(Date.now() + 14 * 86400000).toISOString();

  const rows = await db`
    SELECT id, title, start_time, end_time, is_all_day
    FROM calendar_events
    WHERE start_time >= ${now}
      AND start_time <= ${twoWeeksLater}
      AND category = 'school'
    ORDER BY start_time ASC
  ` as Record<string, unknown>[];

  return rows.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    startTime: new Date(row.start_time as string).toISOString(),
    endTime: new Date(row.end_time as string).toISOString(),
    isAllDay: row.is_all_day as boolean,
  }));
}

export async function getUpcomingEvents(limit = 3): Promise<CalendarEvent[]> {
  const db = sql();
  const now = new Date().toISOString();

  const rows = await db`
    SELECT id, title, start_time, end_time, category
    FROM calendar_events
    WHERE start_time >= ${now}
    ORDER BY start_time ASC
    LIMIT ${limit}
  ` as Record<string, unknown>[];

  return rows.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    startTime: new Date(row.start_time as string).toISOString(),
    endTime: new Date(row.end_time as string).toISOString(),
    category: (row.category as string) ?? 'personal',
  }));
}

export async function getLatestBriefing(): Promise<AgentReport | null> {
  const db = sql();
  const rows = await db`
    SELECT content, created_at
    FROM agent_reports
    WHERE report_type = 'briefing'
    ORDER BY created_at DESC
    LIMIT 1
  ` as Record<string, unknown>[];

  if (rows.length === 0) return null;
  return {
    content: rows[0].content as string,
    createdAt: new Date(rows[0].created_at as string).toISOString(),
  };
}

export async function getLatestPriorities(): Promise<AgentReport | null> {
  const db = sql();
  const rows = await db`
    SELECT content, created_at
    FROM agent_reports
    WHERE report_type = 'priorities'
    ORDER BY created_at DESC
    LIMIT 1
  ` as Record<string, unknown>[];

  if (rows.length === 0) return null;
  return {
    content: rows[0].content as string,
    createdAt: new Date(rows[0].created_at as string).toISOString(),
  };
}

// ── Schedule Queries ──────────────────────────────────────────────

export async function getWeekEvents(): Promise<CalendarEvent[]> {
  const db = sql();
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const rows = await db`
    SELECT id, title, start_time, end_time, is_all_day, category
    FROM calendar_events
    WHERE start_time >= ${monday.toISOString()} AND start_time <= ${sunday.toISOString()}
    ORDER BY start_time ASC
  ` as Record<string, unknown>[];

  return rows.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    startTime: new Date(row.start_time as string).toISOString(),
    endTime: new Date(row.end_time as string).toISOString(),
    category: (row.category as string) ?? 'personal',
    isAllDay: row.is_all_day as boolean,
  }));
}

export async function getScheduleNarrative(): Promise<AgentReport | null> {
  const db = sql();
  const rows = await db`
    SELECT content, created_at FROM agent_reports
    WHERE report_type = 'schedule' ORDER BY created_at DESC LIMIT 1
  ` as Record<string, unknown>[];
  if (rows.length === 0) return null;
  return { content: rows[0].content as string, createdAt: new Date(rows[0].created_at as string).toISOString() };
}

// ── Health Queries ───────────────────────────────────────────────

export interface StripeSnapshot {
  activeSubscribers: number; newSubs24h: number; churned24h: number; failedCharges24h: number;
}
export interface PosthogSnapshot {
  pageviews: number; uniqueVisitors: number; errors: { message: string; count: number }[];
}
export interface GithubSnapshot {
  notifications: number; repos: Record<string, { commits_24h: number; open_prs: number; }>;
}
export interface VercelSnapshot {
  projects: Record<string, { state: string; age_hours: number; url: string; error: string | null; }>;
}
export interface GscSnapshot {
  clicks: number; impressions: number; ctr: number; position: number;
}

export async function getLatestStripe() {
  const db = sql();
  const rows = await db`SELECT active_subscribers, new_subs_24h, churned_24h, failed_charges_24h FROM stripe_snapshots ORDER BY created_at DESC LIMIT 1` as Record<string, unknown>[];
  if (rows.length === 0) return null;
  const r = rows[0];
  return { activeSubscribers: r.active_subscribers as number, newSubs24h: r.new_subs_24h as number, churned24h: r.churned_24h as number, failedCharges24h: r.failed_charges_24h as number } as StripeSnapshot;
}

export async function getLatestPosthog() {
  const db = sql();
  const rows = await db`SELECT pageviews, unique_visitors, errors FROM posthog_snapshots ORDER BY created_at DESC LIMIT 1` as Record<string, unknown>[];
  if (rows.length === 0) return null;
  const r = rows[0];
  return { pageviews: r.pageviews as number, uniqueVisitors: r.unique_visitors as number, errors: (r.errors as { message: string; count: number }[]) ?? [] } as PosthogSnapshot;
}

export async function getLatestGithub() {
  const db = sql();
  const rows = await db`SELECT notifications, repos FROM github_snapshots ORDER BY created_at DESC LIMIT 1` as Record<string, unknown>[];
  if (rows.length === 0) return null;
  const r = rows[0];
  return { notifications: r.notifications as number, repos: r.repos as Record<string, { commits_24h: number; open_prs: number }> } as GithubSnapshot;
}

export async function getLatestVercel() {
  const db = sql();
  const rows = await db`SELECT projects FROM vercel_snapshots ORDER BY created_at DESC LIMIT 1` as Record<string, unknown>[];
  if (rows.length === 0) return null;
  return { projects: rows[0].projects as VercelSnapshot['projects'] } as VercelSnapshot;
}

export async function getLatestGsc() {
  const db = sql();
  const rows = await db`SELECT clicks, impressions, ctr, position FROM gsc_snapshots ORDER BY created_at DESC LIMIT 1` as Record<string, unknown>[];
  if (rows.length === 0) return null;
  const r = rows[0];
  return { clicks: r.clicks as number, impressions: r.impressions as number, ctr: r.ctr as number, position: r.position as number } as GscSnapshot;
}

export async function getHealthSummary(): Promise<AgentReport | null> {
  const db = sql();
  const rows = await db`SELECT content, created_at FROM agent_reports WHERE report_type = 'health' ORDER BY created_at DESC LIMIT 1` as Record<string, unknown>[];
  if (rows.length === 0) return null;
  return { content: rows[0].content as string, createdAt: new Date(rows[0].created_at as string).toISOString() };
}

// ── Fitness Queries ──────────────────────────────────────────────

export interface FitnessSplit { id: string; name: string; sortOrder: number; }
export interface FitnessLog { id: string; splitId: string; completedDate: string; }

export async function getSplits(): Promise<FitnessSplit[]> {
  const db = sql();
  const rows = await db`SELECT id, name, sort_order FROM fitness_splits WHERE active = true ORDER BY sort_order` as Record<string, unknown>[];
  return rows.map((r) => ({ id: r.id as string, name: r.name as string, sortOrder: r.sort_order as number }));
}

export async function getWeekProgress(): Promise<FitnessLog[]> {
  const db = sql();
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  const weekStart = monday.toISOString().split('T')[0];
  const rows = await db`SELECT id, split_id, completed_date FROM fitness_logs WHERE completed_date >= ${weekStart} ORDER BY completed_date DESC` as Record<string, unknown>[];
  return rows.map((r) => ({ id: r.id as string, splitId: r.split_id as string, completedDate: r.completed_date as string }));
}

export async function getStreak(): Promise<number> {
  const db = sql();
  const rows = await db`SELECT completed_date FROM fitness_logs ORDER BY completed_date DESC LIMIT 90` as Record<string, unknown>[];
  if (rows.length === 0) return 0;
  const weeks = new Set(rows.map((r) => {
    const d = new Date((r.completed_date as string) + 'T00:00:00');
    const day = d.getDay();
    const mon = new Date(d);
    mon.setDate(d.getDate() - ((day + 6) % 7));
    return mon.toISOString().split('T')[0];
  }));
  const sorted = [...weeks].sort().reverse();
  let streak = 0;
  const now = new Date();
  const curMon = new Date(now);
  curMon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const check = new Date(curMon);
  for (const week of sorted) {
    if (week === check.toISOString().split('T')[0]) { streak++; check.setDate(check.getDate() - 7); } else break;
  }
  return streak;
}

// ── Ideas Queries ────────────────────────────────────────────────

export interface Idea { id: string; title: string; body: string | null; tags: string[]; status: string; createdAt: string; }

export async function getIdeas(): Promise<Idea[]> {
  const db = sql();
  const rows = await db`SELECT id, title, body, tags, status, created_at FROM ideas ORDER BY created_at DESC` as Record<string, unknown>[];
  return rows.map((r) => ({
    id: r.id as string, title: r.title as string, body: (r.body as string) ?? null,
    tags: (r.tags as string[]) ?? [], status: r.status as string, createdAt: new Date(r.created_at as string).toISOString(),
  }));
}

// ── Weather ──────────────────────────────────────────────────────

export async function getWeather(): Promise<WeatherData | null> {
  const db = sql();
  const rows = await db`
    SELECT city, temp_c, feels_like_c, description, high_c, low_c
    FROM weather_cache
    ORDER BY created_at DESC
    LIMIT 1
  ` as Record<string, unknown>[];

  if (rows.length === 0) return null;
  return {
    city: rows[0].city as string,
    tempC: rows[0].temp_c as string | null,
    feelsLikeC: rows[0].feels_like_c as string | null,
    description: rows[0].description as string | null,
    highC: rows[0].high_c as string | null,
    lowC: rows[0].low_c as string | null,
  };
}
