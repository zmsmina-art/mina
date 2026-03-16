import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

const CRON_SECRET = process.env.CRON_SECRET;

// ── Data Fetchers ─────────────────────────────────────────────────

async function fetchWeather() {
  try {
    const res = await fetch('https://wttr.in/Toronto?format=j1', {
      headers: { 'User-Agent': 'curl/7.68.0' },
    });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const data = await res.json();
    const current = data.current_condition?.[0];
    const today = data.weather?.[0];
    return {
      city: 'Toronto',
      temp_c: current?.temp_C,
      feels_like_c: current?.FeelsLikeC,
      summary: current?.weatherDesc?.[0]?.value,
      high_c: today?.maxtempC,
      low_c: today?.mintempC,
      humidity: current?.humidity,
    };
  } catch (e) {
    return { error: String(e) };
  }
}

async function fetchVercel() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) return { error: 'VERCEL_TOKEN not set' };
  try {
    const projects: Record<string, unknown> = {};
    const alerts: string[] = [];
    const projectMap: Record<string, string> = {
      'Olunix': 'olunix-website',
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
        if (dep.state === 'ERROR' || dep.readyState === 'ERROR') {
          alerts.push(`${display} deployment is in ERROR state`);
        }
      }
    }
    return { projects, alerts };
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
    const topRes = await query(
      "SELECT properties.$current_url as page, count() as views FROM events WHERE event = '$pageview' AND timestamp >= now() - interval 1 day GROUP BY page ORDER BY views DESC LIMIT 5"
    );

    const pvRow = pvRes?.results?.[0];
    return {
      pageviews: pvRow?.[0] ?? 0,
      unique_visitors: pvRow?.[1] ?? 0,
      top_pages: (topRes?.results ?? []).map((r: unknown[]) => ({
        page: String(r[0]).replace(/https?:\/\/[^/]+/, ''),
        views: r[1],
      })),
    };
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

    // Import the private key and sign
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

    // Exchange JWT for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) return { error: 'Failed to get access token' };

    // Fetch today's events
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const calRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
      `timeMin=${todayStart.toISOString()}&timeMax=${todayEnd.toISOString()}&singleEvents=true&orderBy=startTime`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const calData = await calRes.json();
    const events = (calData.items ?? []).map((e: Record<string, unknown>) => {
      const start = (e.start as Record<string, string>)?.dateTime || (e.start as Record<string, string>)?.date;
      const time = start ? new Date(start as string).toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', timeZone: 'America/Toronto',
      }) : 'All day';
      return { time, title: e.summary };
    });
    return { events };
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

    const [balance, subs] = await Promise.all([
      stripeGet('/balance'),
      stripeGet('/subscriptions?status=active&limit=100'),
    ]);

    const activeSubs = subs.data?.length ?? 0;
    const mrr = (subs.data ?? []).reduce(
      (sum: number, s: Record<string, unknown>) => {
        const item = (s.items as Record<string, unknown>)?.data as Record<string, unknown>[] | undefined;
        const price = item?.[0]?.price as Record<string, unknown> | undefined;
        const amount = (price?.unit_amount as number) ?? 0;
        return sum + amount / 100;
      },
      0
    );

    return {
      active_subscribers: activeSubs,
      mrr: mrr.toFixed(2),
      available_balance: ((balance.available?.[0]?.amount ?? 0) / 100).toFixed(2),
    };
  } catch (e) {
    return { error: String(e) };
  }
}

// ── AI Synthesis ──────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are JARVIS, a personal AI assistant for Mina Mankarious, a solo founder and student running:

- Olunix (olunix.com) — SaaS brand audit platform, $29.99/month subscription
- Solnix (solnix.space) — Community/collaboration platform, in development
- Personal Portfolio (minamankarious.com) — Founder's personal site

Generate a concise morning briefing from the provided data.

CRITICAL: If a section has nothing noteworthy, DO NOT INCLUDE IT AT ALL. No "nothing to report", no "no issues". Just skip it. Silence means everything is fine.

Rules:
1. Open with a one-line greeting mentioning the weather and schedule count
2. ALERTS — only if something is broken or needs immediate action
3. STRIPE — ONLY mention if something CHANGED (new subscriber, churn, failed payment). Never dump raw numbers.
4. PRODUCT HEALTH — deploy status. Only mention if there's an issue.
5. TRAFFIC — pageviews, visitors, top pages. Flag unusual changes.
6. TODAY'S SCHEDULE — list events with times.
7. End with 3-5 PRIORITIES for the day based on ALL the data.
8. Be direct, warm, and concise. No fluff. Use specific numbers.
9. Keep total output under 35 lines.
10. Do NOT use markdown formatting, emojis, or bullet points with dashes. Use plain text.
11. If a data source has an error or nothing notable, skip that section COMPLETELY.
12. Sound like a sharp, trusted chief of staff — not a robot reading a dashboard.`;

async function synthesize(rawData: Record<string, unknown>): Promise<string | null> {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) return null;
  try {
    // Filter out errored sources
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
          { role: 'user', content: `Generate my morning briefing from this data:\n\n${JSON.stringify(clean, null, 2)}` },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (e) {
    console.error('[briefing] Synthesis error:', e);
    return null;
  }
}

// ── Template fallback ─────────────────────────────────────────────

function templateBriefing(data: Record<string, unknown>): string {
  const w = data.weather as Record<string, string> | undefined;
  const cal = data.calendar as { events?: { time: string; title: string }[] } | undefined;
  const ph = data.posthog as Record<string, unknown> | undefined;

  const lines: string[] = [];
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const day = now.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'America/Toronto' });

  if (w && !('error' in w)) {
    lines.push(`${greeting}, Mr. Mankarious. It's ${day} with ${w.summary?.toLowerCase() || 'unknown conditions'} and ${w.temp_c}C (feels ${w.feels_like_c}C).`);
  } else {
    lines.push(`${greeting}, Mr. Mankarious. It's ${day}.`);
  }

  if (ph && !('error' in ph)) {
    lines.push(`Field activity shows ${ph.pageviews} pageviews and ${ph.unique_visitors} unique visitors.`);
  }

  if (cal?.events?.length) {
    const evtStr = cal.events.map((e) => `${e.title} at ${e.time}`).join(', ');
    lines.push(`Today's schedule: ${evtStr}.`);
  }

  lines.push('Your priorities for the day are to review the dashboard and address any outstanding items.');
  return lines.join('\n');
}

// ── Main Handler ──────────────────────────────────────────────────

export async function GET(request: Request) {
  if (!CRON_SECRET) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 });
  }

  const authHeader = request.headers.get('authorization') ?? '';
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[briefing] Starting daily briefing generation...');

    // Fetch all data sources in parallel
    const [weather, vercel, posthog, calendar, stripe] = await Promise.all([
      fetchWeather(),
      fetchVercel(),
      fetchPostHog(),
      fetchCalendar(),
      fetchStripe(),
    ]);

    console.log('[briefing] Data fetched:', JSON.stringify({
      weather: 'error' in (weather as Record<string, unknown>) ? 'error' : 'ok',
      vercel: 'error' in (vercel as Record<string, unknown>) ? 'error' : 'ok',
      posthog: 'error' in (posthog as Record<string, unknown>) ? 'error' : 'ok',
      calendar: 'error' in (calendar as Record<string, unknown>) ? 'error' : 'ok',
      stripe: 'error' in (stripe as Record<string, unknown>) ? 'error' : 'ok',
    }));

    const rawData = { weather, vercel, posthog, calendar, stripe };

    // Synthesize with AI, fall back to template
    let briefingText = await synthesize(rawData);
    if (!briefingText) {
      console.log('[briefing] AI synthesis unavailable, using template');
      briefingText = templateBriefing(rawData);
    }

    console.log('[briefing] Briefing text length:', briefingText.length);

    // Write to database
    const db = sql();
    const id = crypto.randomUUID();
    await db`
      INSERT INTO agent_reports (id, report_type, content, created_at)
      VALUES (${id}, 'briefing', ${briefingText}, NOW())
    `;

    console.log('[briefing] Briefing saved to database');

    return NextResponse.json({
      message: 'Briefing generated and saved',
      preview: briefingText.slice(0, 200) + '...',
    });
  } catch (e) {
    console.error('[briefing] Fatal error:', e);
    return NextResponse.json(
      { error: 'Briefing generation failed', detail: String(e) },
      { status: 500 }
    );
  }
}
