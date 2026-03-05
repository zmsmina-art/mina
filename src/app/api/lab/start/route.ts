import { NextResponse, type NextRequest } from 'next/server';
import { createWorkspace } from '@/lib/lab/storage';
import { sendMagicLinkEmail } from '@/lib/lab/send-magic-link';

function csrfRejected(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://minamankarious.com',
    'https://www.minamankarious.com',
  ];
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000');
  }
  return !origin || !allowedOrigins.includes(origin);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  if (csrfRejected(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || !EMAIL_RE.test(email) || email.length > 320) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  try {
    const workspace = await createWorkspace(email);
    const sent = await sendMagicLinkEmail(email, workspace.token, workspace.id);

    return NextResponse.json({
      ok: true,
      emailSent: sent,
      // In dev, include direct link for testing
      ...(process.env.NODE_ENV === 'development'
        ? { devLink: `/lab/verify?token=${workspace.token}&workspace=${workspace.id}` }
        : {}),
    });
  } catch (err) {
    console.error('Lab start error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
