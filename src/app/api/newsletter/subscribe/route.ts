import { NextResponse } from 'next/server';

const BUTTONDOWN_API_KEY = process.env.BUTTONDOWN_API_KEY;
const BUTTONDOWN_API_URL = 'https://api.buttondown.com/v1/subscribers';

export async function POST(request: Request) {
  if (!BUTTONDOWN_API_KEY) {
    console.error('[newsletter] BUTTONDOWN_API_KEY is not set');
    return NextResponse.json(
      { error: 'Newsletter service is not configured.' },
      { status: 500 }
    );
  }

  let email: string;
  let tag: string | undefined;

  try {
    const body = await request.json();
    email = body.email?.trim();
    tag = body.tag;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }

  try {
    const res = await fetch(BUTTONDOWN_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Token ${BUTTONDOWN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        tags: tag ? [tag] : [],
      }),
    });

    if (res.ok || res.status === 201) {
      return NextResponse.json({ success: true });
    }

    // Buttondown returns structured errors
    const data = await res.json().catch(() => null);

    // 409 = already subscribed — treat as success
    if (res.status === 409) {
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }

    console.error('[newsletter] Buttondown API error:', res.status, data);
    return NextResponse.json(
      { error: data?.detail || 'Subscription failed. Please try again.' },
      { status: res.status }
    );
  } catch (err) {
    console.error('[newsletter] Network error:', err);
    return NextResponse.json(
      { error: 'Unable to reach newsletter service. Please try again.' },
      { status: 502 }
    );
  }
}
