import { google } from 'googleapis';

export const TIME_ZONE = 'America/New_York';

/** All candidate 30-min slots — times in 24h ET */
export const ALL_SLOTS = [
  { start: '10:00', end: '10:30', label: '10:00 AM' },
  { start: '10:30', end: '11:00', label: '10:30 AM' },
  { start: '11:00', end: '11:30', label: '11:00 AM' },
  { start: '11:30', end: '12:00', label: '11:30 AM' },
  { start: '12:00', end: '12:30', label: '12:00 PM' },
  { start: '12:30', end: '13:00', label: '12:30 PM' },
  { start: '13:00', end: '13:30', label: '1:00 PM' },
  { start: '13:30', end: '14:00', label: '1:30 PM' },
  { start: '14:00', end: '14:30', label: '2:00 PM' },
  { start: '14:30', end: '15:00', label: '2:30 PM' },
  { start: '15:00', end: '15:30', label: '3:00 PM' },
  { start: '15:30', end: '16:00', label: '3:30 PM' },
  { start: '16:00', end: '16:30', label: '4:00 PM' },
  { start: '16:30', end: '17:00', label: '4:30 PM' },
];

/**
 * Get the UTC offset in minutes for a given date in America/New_York.
 * Handles EST (-300) vs EDT (-240) automatically.
 */
export function getETOffsetMinutes(dateStr: string): number {
  const jan = new Date(`${dateStr}T12:00:00Z`);
  const utcStr = jan.toLocaleString('en-US', { timeZone: 'UTC' });
  const etStr = jan.toLocaleString('en-US', { timeZone: TIME_ZONE });
  const utcDate = new Date(utcStr);
  const etDate = new Date(etStr);
  return (utcDate.getTime() - etDate.getTime()) / 60_000;
}

/** Convert an ET time on a given date to a UTC ISO string */
export function etToUtcIso(dateStr: string, time24: string): string {
  const offsetMin = getETOffsetMinutes(dateStr);
  const [h, m] = time24.split(':').map(Number);
  const totalMin = h * 60 + m + offsetMin;
  const utcH = Math.floor(totalMin / 60);
  const utcM = totalMin % 60;

  // Handle day rollover
  const base = new Date(`${dateStr}T00:00:00Z`);
  base.setUTCHours(utcH, utcM, 0, 0);
  return base.toISOString();
}

/**
 * Returns an authenticated Google Calendar client using service account credentials.
 * Returns null if env vars are not configured.
 */
export function getCalendarClient() {
  const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!serviceEmail || !privateKey || !calendarId) {
    return null;
  }

  const auth = new google.auth.JWT({
    email: serviceEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
    subject: calendarId, // Impersonate the calendar owner via domain-wide delegation
  });

  return {
    calendar: google.calendar({ version: 'v3', auth }),
    calendarId,
  };
}
