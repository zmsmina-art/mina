import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth-brief';
import { sql } from '@/lib/neon';

// ── Category Keywords ─────────────────────────────────────────────

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  school: ['lecture', 'lab', 'tutorial', 'exam', 'class', 'study', 'assignment', 'professor', 'university', 'course', 'kinematics', 'entrepreneur', 'capstone', 'marc', 'hope reading'],
  business: ['olunix', 'solnix', 'meeting', 'client', 'demo', 'standup', 'sprint', 'review', 'investor'],
  fitness: ['gym', 'workout', 'run', 'push', 'pull', 'legs', 'cardio', 'yoga', 'stretch', 'training'],
  admin: ['dentist', 'doctor', 'appointment', 'errand', 'bank', 'insurance', 'tax'],
};

function categorizeEvent(title: string): 'school' | 'business' | 'fitness' | 'personal' | 'admin' {
  const lower = title.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category as 'school' | 'business' | 'fitness' | 'personal' | 'admin';
    }
  }
  return 'personal';
}

// ── Staleness Check ───────────────────────────────────────────────

const STALE_MS = 60 * 60 * 1000; // 1 hour

async function isDataStale(): Promise<{ stale: boolean; lastSync: Date | null }> {
  const db = sql();
  const tables = ['weather_cache', 'posthog_snapshots', 'github_snapshots', 'vercel_snapshots', 'agent_reports'];
  const results = await Promise.all(
    tables.map((table) =>
      db(`SELECT created_at FROM ${table} ORDER BY created_at DESC LIMIT 1`).catch(() => [])
    )
  );

  const timestamps = results
    .map((rows) => (rows as Record<string, unknown>[])[0]?.created_at)
    .filter(Boolean)
    .map((ts) => new Date(ts as string).getTime());

  if (timestamps.length === 0) {
    return { stale: true, lastSync: null };
  }

  const mostRecent = Math.max(...timestamps);
  return { stale: Date.now() - mostRecent > STALE_MS, lastSync: new Date(mostRecent) };
}

// ── Data Fetchers ─────────────────────────────────────────────────

async function fetchWeather() {
  try {
    const res = await fetch('https://wttr.in/Toronto?format=j1', {
      headers: { 'User-Agent': 'curl/7.68.0' },
    });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const data = await res.json();
    if (!data.current_condition?.length) return { error: 'Empty weather response' };
    const current = data.current_condition[0];
    const today = data.weather?.[0];

    const db = sql();
    await db`
      INSERT INTO weather_cache (id, city, temp_c, feels_like_c, description, high_c, low_c, humidity, created_at)
      VALUES (${crypto.randomUUID()}, 'Toronto', ${current?.temp_C}, ${current?.FeelsLikeC},
              ${current?.weatherDesc?.[0]?.value}, ${today?.maxtempC}, ${today?.mintempC}, ${current?.humidity}, NOW())
    `;
    return { status: 'ok' };
  } catch (e) {
    return { error: String(e) };
  }
}

async function fetchVercel() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) return { error: 'VERCEL_TOKEN not set' };
  try {
    const projects: Record<string, unknown> = {};
    const projectMap: Record<string, string> = {
      'Portfolio': 'mina',
      'Solnix': 'solnix',
    };
    for (const [display, name] of Object.entries(projectMap)) {
      const res = await fetch(
        `https://api.vercel.com/v6/deployments?projectId=${name}&limit=1&target=production`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        projects[display] = { state: 'UNKNOWN', error: `HTTP ${res.status}` };
        continue;
      }
      const data = await res.json();
      const dep = data.deployments?.[0];
      if (dep) {
        const ageHours = Math.round((Date.now() - dep.created) / 3600000);
        projects[display] = { state: dep.state || dep.readyState, age_hours: ageHours };
      }
    }

    const db = sql();
    await db`
      INSERT INTO vercel_snapshots (id, projects, created_at)
      VALUES (${crypto.randomUUID()}, ${JSON.stringify(projects)}, NOW())
    `;
    return { status: 'ok' };
  } catch (e) {
    return { error: String(e) };
  }
}

async function fetchPostHog() {
  const apiKey = process.env.POSTHOG_API_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const host = process.env.POSTHOG_HOST || 'https://us.posthog.com';
  if (!apiKey || !projectId) return { error: 'PostHog not configured' };
  try {
    const query = (q: string) =>
      fetch(`${host}/api/projects/${projectId}/query`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: { kind: 'HogQLQuery', query: q } }),
      }).then((r) => r.json());

    const pvRes = await query(
      "SELECT count() as pageviews, count(distinct distinct_id) as visitors FROM events WHERE event = '$pageview' AND timestamp >= now() - interval 1 day"
    );
    const errRes = await query(
      "SELECT properties.$exception_message as msg, count() as cnt FROM events WHERE event = '$exception' AND timestamp >= now() - interval 1 day GROUP BY msg ORDER BY cnt DESC LIMIT 5"
    );

    const pvRow = pvRes?.results?.[0];
    const pageviews = pvRow?.[0] ?? 0;
    const uniqueVisitors = pvRow?.[1] ?? 0;
    const errors = (errRes?.results ?? []).map((r: unknown[]) => ({
      message: String(r[0]),
      count: r[1] as number,
    }));

    const db = sql();
    await db`
      INSERT INTO posthog_snapshots (id, pageviews, unique_visitors, errors, created_at)
      VALUES (${crypto.randomUUID()}, ${pageviews}, ${uniqueVisitors}, ${JSON.stringify(errors)}, NOW())
    `;
    return { status: 'ok' };
  } catch (e) {
    return { error: String(e) };
  }
}

async function fetchCalendar() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!email || !key || !calendarId) return { error: 'Google Calendar not configured' };
  try {
    // Build JWT for Google OAuth2
    const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const now = Math.floor(Date.now() / 1000);
    const claims = btoa(
      JSON.stringify({
        iss: email,
        scope: 'https://www.googleapis.com/auth/calendar.readonly',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600,
      })
    );

    const pemBody = key.replace(/-----BEGIN PRIVATE KEY-----/g, '')
      .replace(/-----END PRIVATE KEY-----/g, '')
      .replace(/\\n/g, '')
      .replace(/\s/g, '');
    const binaryKey = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8', binaryKey, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']
    );
    const signatureBytes = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      new TextEncoder().encode(`${header}.${claims}`)
    );
    const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBytes)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const jwt = `${header}.${claims}.${signature}`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) return { error: 'Failed to get access token' };

    // Fetch this week's events (Mon-Sun)
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 7);
    sunday.setHours(0, 0, 0, 0);

    const calRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
      `timeMin=${monday.toISOString()}&timeMax=${sunday.toISOString()}&singleEvents=true&orderBy=startTime&maxResults=100`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const calData = await calRes.json();
    const items = calData.items ?? [];

    const db = sql();
    for (const event of items) {
      const googleEventId = event.id as string;
      const title = (event.summary as string) ?? 'No title';
      const isAllDay = !!event.start?.date;
      const startTime = new Date(event.start?.dateTime ?? event.start?.date ?? '');
      const endTime = new Date(event.end?.dateTime ?? event.end?.date ?? '');
      const category = categorizeEvent(title);

      // Upsert by google event ID
      const existing = await db`
        SELECT id FROM calendar_events WHERE google_event_id = ${googleEventId}
      ` as Record<string, unknown>[];

      if (existing.length > 0) {
        await db`
          UPDATE calendar_events
          SET title = ${title}, start_time = ${startTime.toISOString()}, end_time = ${endTime.toISOString()},
              is_all_day = ${isAllDay}, category = ${category}
          WHERE google_event_id = ${googleEventId}
        `;
      } else {
        await db`
          INSERT INTO calendar_events (id, google_event_id, title, start_time, end_time, is_all_day, category)
          VALUES (${crypto.randomUUID()}, ${googleEventId}, ${title}, ${startTime.toISOString()}, ${endTime.toISOString()}, ${isAllDay}, ${category})
        `;
      }
    }
    return { status: 'ok', synced: items.length };
  } catch (e) {
    return { error: String(e) };
  }
}

async function fetchStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { error: 'STRIPE_SECRET_KEY not set' };
  try {
    const stripeGet = (path: string) =>
      fetch(`https://api.stripe.com/v1${path}`, {
        headers: { Authorization: `Basic ${btoa(key + ':')}` },
      }).then((r) => r.json());

    const [subs] = await Promise.all([
      stripeGet('/subscriptions?status=active&limit=100'),
    ]);

    const activeSubs = subs.data?.length ?? 0;

    const db = sql();
    await db`
      INSERT INTO stripe_snapshots (id, active_subscribers, new_subs_24h, churned_24h, failed_charges_24h, created_at)
      VALUES (${crypto.randomUUID()}, ${activeSubs}, 0, 0, 0, NOW())
    `;
    return { status: 'ok' };
  } catch (e) {
    return { error: String(e) };
  }
}

// ── AI Synthesis ──────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a concise personal assistant for Mina, a solo founder and student who runs:

- Olunix (olunix.com) — SaaS brand audit platform, $29.99/month subscription
- Solnix (solnix.space) — Community/collaboration platform, in development
- Personal Portfolio (minamankarious.com) — Founder's personal site

Generate a concise daily briefing from the provided data. Do NOT mention the current time or use time-based greetings — the briefing may be read hours later.

CRITICAL: If a section has nothing noteworthy, DO NOT INCLUDE IT AT ALL. No filler, no "nothing to report". Silence means everything is fine.

Rules:
1. Open with a composed one-line note on the weather and the shape of the day ahead. Never include the time.
2. Mention ALERTS only if something is broken — a failed deployment, errors in the logs.
3. PRODUCT HEALTH — only mention if there's an issue. If all systems are operational, say nothing.
4. TRAFFIC — pageviews, visitors, notable patterns. Keep it brief.
5. GITHUB — only if there are notifications or open PRs.
6. TODAY'S SCHEDULE — list events with times. Identify the rhythm of the day.
7. End with exactly 3 PRIORITIES — clear, actionable items for the day.
8. Be direct and useful. No fluff, no theatrics.
9. Keep total output under 30 lines.
10. Use plain text. No markdown, no emojis, no bullet dashes.
11. Tone: sharp, clean, efficient. Like a well-organized daily standup.`;

async function synthesize(rawData: Record<string, unknown>): Promise<string | null> {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) return null;
  try {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rawData)) {
      if (typeof v === 'object' && v && 'error' in v) continue;
      clean[k] = v;
    }
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Generate my daily briefing from this data:\n\n${JSON.stringify(clean, null, 2)}` },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (e) {
    console.error('[sync] Synthesis error:', e);
    return null;
  }
}

// ── Main Handler ──────────────────────────────────────────────────

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === '1';

  if (!force) {
    const { stale } = await isDataStale();
    if (!stale) {
      return NextResponse.json({ skipped: true, reason: 'Data is fresh' });
    }
  }

  // Run all fetchers in parallel
  const fetchers = [
    { name: 'weather', fn: fetchWeather },
    { name: 'vercel', fn: fetchVercel },
    { name: 'posthog', fn: fetchPostHog },
    { name: 'calendar', fn: fetchCalendar },
    { name: 'stripe', fn: fetchStripe },
  ];

  const results = await Promise.allSettled(fetchers.map((f) => f.fn()));

  const summary: Record<string, { status: 'ok' | 'failed'; error?: string }> = {};
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      const val = result.value as Record<string, unknown>;
      if (val.error) {
        summary[fetchers[i].name] = { status: 'failed', error: val.error as string };
      } else {
        summary[fetchers[i].name] = { status: 'ok' };
      }
    } else {
      summary[fetchers[i].name] = { status: 'failed', error: String(result.reason) };
    }
  });

  // Run AI synthesis
  let synthesisStatus: 'ok' | 'failed' = 'ok';
  let synthesisError: string | undefined;

  try {
    const db = sql();

    // Gather latest snapshots for synthesis
    const [weatherRows, vercelRows, posthogRows, calendarRows] = await Promise.all([
      db`SELECT city, temp_c, feels_like_c, description, high_c, low_c FROM weather_cache ORDER BY created_at DESC LIMIT 1` as Promise<Record<string, unknown>[]>,
      db`SELECT projects FROM vercel_snapshots ORDER BY created_at DESC LIMIT 1` as Promise<Record<string, unknown>[]>,
      db`SELECT pageviews, unique_visitors, errors FROM posthog_snapshots ORDER BY created_at DESC LIMIT 1` as Promise<Record<string, unknown>[]>,
      db`SELECT title, start_time, end_time, category FROM calendar_events WHERE start_time >= ${new Date().toISOString()} ORDER BY start_time ASC LIMIT 20` as Promise<Record<string, unknown>[]>,
    ]);

    const rawData = {
      weather: weatherRows[0] ?? null,
      vercel: vercelRows[0] ?? null,
      posthog: posthogRows[0] ?? null,
      calendar: {
        events: calendarRows.map((r) => ({
          title: r.title,
          time: new Date(r.start_time as string).toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit', timeZone: 'America/Toronto',
          }),
          category: r.category,
        })),
      },
    };

    const briefingText = await synthesize(rawData);
    if (briefingText) {
      await db`
        INSERT INTO agent_reports (id, report_type, content, created_at)
        VALUES (${crypto.randomUUID()}, 'briefing', ${briefingText}, NOW())
      `;
    }
  } catch (e) {
    synthesisStatus = 'failed';
    synthesisError = String(e);
  }

  return NextResponse.json({
    fetchers: summary,
    synthesis: { status: synthesisStatus, ...(synthesisError && { error: synthesisError }) },
  });
}
