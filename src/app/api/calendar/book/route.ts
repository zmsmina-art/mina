import { NextRequest, NextResponse } from 'next/server';
import { getCalendarClient, etToUtcIso, ALL_SLOTS, TIME_ZONE } from '@/lib/google-calendar';
import { sendBookingEmails } from '@/lib/send-booking-email';
import { bookingLimiter } from '@/lib/rate-limit';

/**
 * POST /api/calendar/book
 *
 * Creates a Google Calendar event with a Google Meet link and
 * sends invite emails to both the booker and Mina.
 *
 * Body: { date, time, name, email, company?, companyStage?, context? }
 */

/** Map a 12h label like "2:30 PM" to 24h "14:30" */
function labelTo24h(label: string): string | null {
  const slot = ALL_SLOTS.find((s) => s.label === label);
  return slot?.start ?? null;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!bookingLimiter.check(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429 },
    );
  }

  // CSRF protection: verify the request originates from our own site
  const origin = request.headers.get('origin');
  const allowedOrigins = ['https://minamankarious.com', 'https://www.minamankarious.com'];
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000');
  }
  if (!origin || !allowedOrigins.includes(origin)) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 },
    );
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { date, time, name, email, company, companyStage, context } = body;

  if (!date || !time || !name || !email) {
    return NextResponse.json(
      { error: 'Missing required fields: date, time, name, email' },
      { status: 400 },
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: 'Invalid date format (expected YYYY-MM-DD)' },
      { status: 400 },
    );
  }

  const start24 = labelTo24h(time);
  if (!start24) {
    return NextResponse.json(
      { error: 'Invalid time slot' },
      { status: 400 },
    );
  }

  const client = getCalendarClient();
  if (!client) {
    return NextResponse.json(
      { error: 'Calendar is not configured. Please email mina@olunix.com directly.' },
      { status: 503 },
    );
  }

  // Find the matching slot to get end time
  const slot = ALL_SLOTS.find((s) => s.start === start24)!;
  const startUtc = etToUtcIso(date, slot.start);
  const endUtc = etToUtcIso(date, slot.end);

  // Build event description
  const descriptionParts = [
    `Booked via portfolio by ${name.trim()}`,
    email.trim(),
    company ? `Company: ${company.trim()}` : null,
    companyStage ? `Stage: ${companyStage}` : null,
    context ? `\nContext:\n${context.trim()}` : null,
  ].filter(Boolean);

  const summary = company
    ? `Call with ${name.trim()} (${company.trim()})`
    : `Call with ${name.trim()}`;

  try {
    // Try with Meet link + attendees, fall back without
    let response;
    try {
      response = await client.calendar.events.insert({
        calendarId: client.calendarId,
        conferenceDataVersion: 1,
        sendUpdates: 'all',
        requestBody: {
          summary,
          description: descriptionParts.join('\n'),
          start: {
            dateTime: startUtc,
            timeZone: TIME_ZONE,
          },
          end: {
            dateTime: endUtc,
            timeZone: TIME_ZONE,
          },
          attendees: [
            { email: email.trim() },
            { email: client.calendarId },
          ],
          conferenceData: {
            createRequest: {
              requestId: `portfolio-${Date.now()}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
        },
      });
    } catch (meetErr) {
      console.error('Full booking failed, falling back:', meetErr instanceof Error ? meetErr.message : meetErr);
      // Fallback: create event without Meet link or attendees
      response = await client.calendar.events.insert({
        calendarId: client.calendarId,
        requestBody: {
          summary,
          description: descriptionParts.join('\n'),
          start: {
            dateTime: startUtc,
            timeZone: TIME_ZONE,
          },
          end: {
            dateTime: endUtc,
            timeZone: TIME_ZONE,
          },
        },
      });
    }

    const meetLink =
      response.data.conferenceData?.entryPoints?.find(
        (ep) => ep.entryPointType === 'video',
      )?.uri ?? null;

    // Fire-and-forget: send confirmation emails without blocking the response
    void sendBookingEmails({
      name: name.trim(),
      email: email.trim(),
      company: company?.trim(),
      companyStage,
      context: context?.trim(),
      date,
      time,
      meetLink,
    });

    return NextResponse.json({
      success: true,
      eventId: response.data.id,
      meetLink,
    });
  } catch (error: unknown) {
    console.error('Google Calendar event creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create calendar event. Please email mina@olunix.com directly.' },
      { status: 500 },
    );
  }
}
