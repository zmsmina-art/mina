import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth-brief';
import { sql } from '@/lib/neon';
import {
  getLatestBriefing, getLatestPriorities, getUpcomingEvents, getWeather,
  getSplits, getWeekProgress, getStreak, getIdeas, getHealthSummary,
} from '@/lib/school-events';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = sql();

  // Get today's events
  const now = new Date();
  const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now); endOfDay.setHours(23, 59, 59, 999);

  const [briefing, priorities, calendar, weather, splits, weekProgress, streak, allIdeas, health, memRows] = await Promise.all([
    getLatestBriefing(),
    getLatestPriorities(),
    db`SELECT title, start_time, end_time, category FROM calendar_events WHERE start_time >= ${startOfDay.toISOString()} AND start_time <= ${endOfDay.toISOString()} ORDER BY start_time` as Promise<Record<string, unknown>[]>,
    getWeather(),
    getSplits(),
    getWeekProgress(),
    getStreak(),
    getIdeas(),
    getHealthSummary(),
    db`SELECT content, category, scope FROM ovix_memory WHERE active = true ORDER BY importance DESC LIMIT 50` as Promise<Record<string, unknown>[]>,
  ]);

  return NextResponse.json({
    briefing,
    priorities,
    calendar: (calendar as Record<string, unknown>[]).map(e => ({
      title: e.title, startTime: e.start_time, endTime: e.end_time, category: e.category,
    })),
    weather,
    fitness: {
      splits: splits.map(s => s.name),
      weekProgress: weekProgress.length,
      streak,
    },
    ideas: allIdeas.map(i => ({ title: i.title, status: i.status })),
    health,
    memories: memRows.map(m => ({ content: m.content as string, category: m.category as string, scope: m.scope as string })),
  });
}
