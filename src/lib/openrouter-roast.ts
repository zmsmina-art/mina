import type { RoastResult } from '@/lib/roast';
import type { ScrapedData } from '@/lib/scrape-url';
import { buildUserMessage, mapLlmResponseToResult, SYSTEM_PROMPT } from '@/lib/groq-roast';

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'openai/gpt-4o-mini';

export async function openRouterRoast(scraped: ScrapedData): Promise<RoastResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://minamankarious.com',
        'X-Title': 'Mina Roast',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        temperature: 0.7,
        max_tokens: 650,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserMessage(scraped) },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`OpenRouter API ${response.status}: ${body.slice(0, 240)}`);
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content?.trim() ?? '';
    return mapLlmResponseToResult(raw, scraped, 'openrouter');
  } finally {
    clearTimeout(timeout);
  }
}
