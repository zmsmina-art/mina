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

  const baseUrl = endpoint.replace('https://', 'wss://').replace(/\/$/, '');
  const wssUrl = `${baseUrl}/openai/realtime?api-version=${apiVersion}&deployment=${deployment}`;

  // Pass the API key directly — safe because this route is auth-protected (single user)
  return NextResponse.json({ token: apiKey, wssUrl });
}
