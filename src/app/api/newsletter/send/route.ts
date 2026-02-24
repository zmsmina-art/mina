import { NextResponse } from 'next/server';
import { getAllArticlesSorted } from '@/data/articles';

const BUTTONDOWN_API_KEY = process.env.BUTTONDOWN_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET;
const BUTTONDOWN_API_URL = 'https://api.buttondown.com/v1/emails';
const SITE_URL = 'https://minamankarious.com';
// Only consider articles published after this date (prevents blasting backlog)
const CUTOFF_DATE = '2026-02-23';

async function getSentEmailSubjects(): Promise<Set<string>> {
  const subjects = new Set<string>();
  let url: string | null = BUTTONDOWN_API_URL;

  while (url) {
    const res: Response = await fetch(url, {
      headers: { Authorization: `Token ${BUTTONDOWN_API_KEY}` },
    });

    if (!res.ok) {
      console.error('[newsletter/send] Failed to fetch sent emails:', res.status);
      break;
    }

    const data: { results?: { subject?: string }[]; next?: string } = await res.json();
    for (const email of data.results ?? []) {
      if (email.subject) {
        subjects.add(email.subject);
      }
    }
    url = data.next ?? null;
  }

  return subjects;
}

export async function GET(request: Request) {
  // Authenticate: Vercel cron sends Authorization: Bearer <CRON_SECRET>
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!BUTTONDOWN_API_KEY) {
    return NextResponse.json({ error: 'BUTTONDOWN_API_KEY not configured' }, { status: 500 });
  }

  const articles = getAllArticlesSorted();
  const sentSubjects = await getSentEmailSubjects();

  // Find the most recent unsent article published after the cutoff date
  const cutoff = new Date(CUTOFF_DATE).getTime();
  const unsent = articles.find(
    (a) => new Date(a.publishedAt).getTime() > cutoff && !sentSubjects.has(a.title)
  );

  if (!unsent) {
    return NextResponse.json({ message: 'No new articles to send' });
  }

  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(unsent.title)}&excerpt=${encodeURIComponent(unsent.excerpt)}`;
  const articleUrl = `${SITE_URL}/articles/${unsent.slug}`;

  const body = [
    `![${unsent.title}](${ogImageUrl})`,
    '',
    `# ${unsent.title}`,
    '',
    unsent.excerpt,
    '',
    `[Read the full article →](${articleUrl})`,
    '',
    '---',
    '',
    '*— Mina*',
  ].join('\n');

  const res = await fetch(BUTTONDOWN_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Token ${BUTTONDOWN_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: unsent.title,
      body,
      status: 'about_to_send',
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    console.error('[newsletter/send] Failed to send email:', res.status, error);
    return NextResponse.json(
      { error: 'Failed to send newsletter', detail: error },
      { status: res.status }
    );
  }

  const result = await res.json();
  return NextResponse.json({
    message: `Sent newsletter for: ${unsent.title}`,
    emailId: result.id,
  });
}
