import { NextRequest, NextResponse } from 'next/server';
import { getCalendarClient, etToUtcIso, ALL_SLOTS, TIME_ZONE } from '@/lib/google-calendar';

/**
 * GET /api/calendar/availability?date=2025-03-15
 *
 * Returns available 30-min slots between 10:00 AM - 5:00 PM ET
 * by querying Google Calendar's freebusy API with a service account.
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date');

  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json(
      { error: 'Missing or invalid date parameter (expected YYYY-MM-DD)' },
      { status: 400 },
    );
  }

  const client = getCalendarClient();

  if (!client) {
    // Calendar not configured — return all slots so the modal still works
    return NextResponse.json({
      date: dateStr,
      slots: ALL_SLOTS.map((s) => s.label),
      configured: false,
    });
  }

  try {
    const timeMin = etToUtcIso(dateStr, '10:00');
    const timeMax = etToUtcIso(dateStr, '17:00');

    const response = await client.calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: TIME_ZONE,
        items: [{ id: client.calendarId }],
      },
    });

    const busyPeriods = response.data.calendars?.[client.calendarId]?.busy ?? [];

    // Filter out slots that overlap with any busy period
    const availableSlots = ALL_SLOTS.filter((slot) => {
      const slotStartMs = new Date(etToUtcIso(dateStr, slot.start)).getTime();
      const slotEndMs = new Date(etToUtcIso(dateStr, slot.end)).getTime();

      return !busyPeriods.some((busy) => {
        if (!busy.start || !busy.end) return false;
        const busyStartMs = new Date(busy.start).getTime();
        const busyEndMs = new Date(busy.end).getTime();
        // Two intervals overlap when each starts before the other ends
        return busyStartMs < slotEndMs && busyEndMs > slotStartMs;
      });
    }).map((s) => s.label);

    return NextResponse.json({
      date: dateStr,
      slots: availableSlots,
      configured: true,
    });
  } catch (error) {
    console.error('Google Calendar API error:', error);
    // Graceful fallback — show all slots so booking isn't blocked
    return NextResponse.json({
      date: dateStr,
      slots: ALL_SLOTS.map((s) => s.label),
      configured: false,
      error: 'Calendar unavailable',
    });
  }
}
