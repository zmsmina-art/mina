import { sql } from './neon';

export interface SchoolEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
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
    startTime: new Date(row.start_time as string),
    endTime: new Date(row.end_time as string),
    isAllDay: row.is_all_day as boolean,
  }));
}
