import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth-brief';

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_REALTIME_DEPLOYMENT;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

  if (!endpoint || !apiKey || !deployment) {
    return NextResponse.json({ error: 'Azure OpenAI not configured' }, { status: 500 });
  }

  const tokenUrl = `${endpoint}openai/realtime/sessions?api-version=${apiVersion}&deployment=${deployment}`;

  try {
    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: deployment, voice: 'alloy' }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Azure token error:', res.status, text);
      return NextResponse.json({ error: 'Failed to create session', detail: text }, { status: res.status });
    }

    const data = await res.json();
    const baseUrl = endpoint.replace('https://', 'wss://').replace(/\/$/, '');
    const wssUrl = `${baseUrl}/openai/realtime?api-version=${apiVersion}&deployment=${deployment}`;

    return NextResponse.json({
      token: data.client_secret?.value ?? data.client_secret,
      wssUrl,
      expiresAt: data.client_secret?.expires_at,
    });
  } catch (e) {
    console.error('Azure token fetch error:', e);
    return NextResponse.json({ error: 'Failed to connect to Azure' }, { status: 500 });
  }
}
