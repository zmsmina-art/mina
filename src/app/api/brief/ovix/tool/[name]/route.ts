import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/auth-brief';
import { sql } from '@/lib/neon';
import {
  getLatestBriefing, getLatestPriorities, getUpcomingEvents, getWeather,
  getWeekEvents, getSplits, getWeekProgress, getStreak, getIdeas,
  getLatestPosthog, getLatestGithub, getLatestVercel, getLatestGsc, getHealthSummary,
} from '@/lib/school-events';

type ToolHandler = (args: Record<string, unknown>) => Promise<unknown>;

const handlers: Record<string, ToolHandler> = {
  get_today_events: async () => {
    const db = sql();
    const now = new Date();
    const start = new Date(now); start.setHours(0, 0, 0, 0);
    const end = new Date(now); end.setHours(23, 59, 59, 999);
    const rows = await db`SELECT title, start_time, end_time, category, is_all_day FROM calendar_events WHERE start_time >= ${start.toISOString()} AND start_time <= ${end.toISOString()} ORDER BY start_time` as Record<string, unknown>[];
    return rows.map(e => ({ title: e.title, start: e.start_time, end: e.end_time, category: e.category, allDay: e.is_all_day }));
  },

  get_upcoming_events: async (args) => {
    const limit = (args.limit as number) || 5;
    const events = await getUpcomingEvents(limit);
    return events.map(e => ({ title: e.title, start: e.startTime, end: e.endTime, category: e.category }));
  },

  get_week_schedule: async () => {
    const events = await getWeekEvents();
    return events.map(e => ({ title: e.title, start: e.startTime, end: e.endTime, category: e.category, allDay: e.isAllDay }));
  },

  get_weather: async () => {
    const w = await getWeather();
    if (!w) return { error: 'No weather data' };
    return { temp: w.tempC, feelsLike: w.feelsLikeC, description: w.description, high: w.highC, low: w.lowC };
  },

  get_priorities: async () => {
    const p = await getLatestPriorities();
    return p?.content ?? 'No priorities generated yet.';
  },

  get_briefing: async () => {
    const b = await getLatestBriefing();
    return b?.content ?? 'No briefing generated yet.';
  },

  get_fitness_status: async () => {
    const [splits, progress, streak] = await Promise.all([getSplits(), getWeekProgress(), getStreak()]);
    return { splits: splits.map(s => s.name), workoutsThisWeek: progress.length, streak };
  },

  get_ideas: async (args) => {
    const allIdeas = await getIdeas();
    const status = args.status as string | undefined;
    const filtered = status ? allIdeas.filter(i => i.status === status) : allIdeas;
    return filtered.map(i => ({ title: i.title, body: i.body, status: i.status, tags: i.tags }));
  },

  get_system_health: async () => {
    const [posthog, github, vercel, gsc, summary] = await Promise.all([
      getLatestPosthog(), getLatestGithub(), getLatestVercel(), getLatestGsc(), getHealthSummary(),
    ]);
    return {
      posthog: posthog ? { pageviews: posthog.pageviews, visitors: posthog.uniqueVisitors, errors: posthog.errors } : null,
      github: github ? { notifications: github.notifications, repos: github.repos } : null,
      vercel: vercel ? { projects: vercel.projects } : null,
      gsc: gsc ? { clicks: gsc.clicks, impressions: gsc.impressions, ctr: gsc.ctr, position: gsc.position } : null,
      summary: summary?.content ?? 'No health summary available.',
    };
  },

  save_memory: async (args) => {
    const db = sql();
    const id = crypto.randomUUID();
    await db`INSERT INTO ovix_memory (id, content, category, scope, importance) VALUES (${id}, ${args.content as string}, ${(args.category as string) ?? 'fact'}, ${(args.scope as string) ?? 'shared'}, ${(args.importance as number) ?? 5})`;
    return { saved: true, id };
  },

  save_idea: async (args) => {
    const db = sql();
    const id = crypto.randomUUID();
    await db`INSERT INTO ideas (id, title, body, tags) VALUES (${id}, ${args.title as string}, ${(args.body as string) ?? null}, ${JSON.stringify((args.tags as string[]) ?? [])})`;
    return { saved: true, id, title: args.title };
  },

  log_workout: async (args) => {
    const db = sql();
    const splitName = args.split_name as string;
    const splits = await db`SELECT id, name FROM fitness_splits WHERE LOWER(name) LIKE ${'%' + splitName.toLowerCase() + '%'} LIMIT 1` as Record<string, unknown>[];
    if (splits.length === 0) return { error: `No split found matching "${splitName}"` };
    const today = new Date().toISOString().split('T')[0];
    const id = crypto.randomUUID();
    await db`INSERT INTO fitness_logs (id, split_id, completed_date, notes) VALUES (${id}, ${splits[0].id as string}, ${today}, ${(args.notes as string) ?? null})`;
    return { logged: true, split: splits[0].name, date: today };
  },
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await params;
  const handler = handlers[name];
  if (!handler) return NextResponse.json({ error: `Unknown tool: ${name}` }, { status: 404 });

  try {
    const body = await request.json().catch(() => ({}));
    const result = await handler(body);
    return NextResponse.json({ result });
  } catch (e) {
    console.error(`Tool ${name} error:`, e);
    return NextResponse.json({ error: `Tool execution failed: ${name}` }, { status: 500 });
  }
}
