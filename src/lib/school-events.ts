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
