import { lookup } from 'node:dns/promises';
import type { LookupAddress } from 'node:dns';
import { isIP } from 'node:net';

export type ScrapedData = {
  url: string;
  domain: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  h1: string;
  firstParagraph: string;
};

type ScrapeErrorCode =
  | 'INVALID_URL'
  | 'BLOCKED_URL'
  | 'TIMEOUT'
  | 'FETCH_FAILED'
  | 'NOT_HTML'
  | 'BODY_TOO_LARGE'
  | 'SCRAPE_FAILED';

export class ScrapeError extends Error {
  code: ScrapeErrorCode;

  constructor(code: ScrapeErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

const REQUEST_TIMEOUT_MS = 10_000;
const MAX_BODY_BYTES = 500 * 1024;
const MAX_REDIRECTS = 4;

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '::',
]);

function normalizeInputUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function decodeHtml(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function compactText(value: string): string {
  return decodeHtml(value.replace(/\s+/g, ' ').trim());
}

function stripTags(value: string): string {
  return compactText(value.replace(/<[^>]*>/g, ' '));
}

function extractTagContent(html: string, regex: RegExp): string {
  const match = regex.exec(html);
  if (!match?.[1]) return '';
  return stripTags(match[1]).slice(0, 320);
}

function extractMetaContent(html: string, name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(
      `<meta\\s+[^>]*name=["']${escaped}["'][^>]*content=["']([^"']*)["'][^>]*>`,
      'i',
    ),
    new RegExp(
      `<meta\\s+[^>]*content=["']([^"']*)["'][^>]*name=["']${escaped}["'][^>]*>`,
      'i',
    ),
    new RegExp(
      `<meta\\s+[^>]*property=["']${escaped}["'][^>]*content=["']([^"']*)["'][^>]*>`,
      'i',
    ),
    new RegExp(
      `<meta\\s+[^>]*content=["']([^"']*)["'][^>]*property=["']${escaped}["'][^>]*>`,
      'i',
    ),
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(html);
    if (match?.[1]) return compactText(match[1]).slice(0, 320);
  }

  return '';
}

function isPrivateIPv4(address: string): boolean {
  const parts = address.split('.').map((part) => Number.parseInt(part, 10));
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) return true;

  const [a, b] = parts;

  if (a === 0) return true;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a === 198 && (b === 18 || b === 19)) return true;
  if (a >= 224) return true;

  return false;
}

function isPrivateIPv6(address: string): boolean {
  const lower = address.toLowerCase();

  if (lower === '::1' || lower === '::') return true;
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true;
  if (lower.startsWith('fe8') || lower.startsWith('fe9') || lower.startsWith('fea') || lower.startsWith('feb')) return true;

  // IPv4-mapped IPv6 (e.g. ::ffff:127.0.0.1)
  const mapped = lower.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped?.[1]) return isPrivateIPv4(mapped[1]);

  return false;
}

function assertPublicIp(address: string): void {
  const version = isIP(address);
  if (version === 4 && isPrivateIPv4(address)) {
    throw new ScrapeError('BLOCKED_URL', 'Private IPv4 address is not allowed.');
  }
  if (version === 6 && isPrivateIPv6(address)) {
    throw new ScrapeError('BLOCKED_URL', 'Private IPv6 address is not allowed.');
  }
}

async function assertSafeHost(hostname: string): Promise<void> {
  const normalized = hostname.trim().toLowerCase().replace(/\.$/, '');
  if (!normalized) {
    throw new ScrapeError('INVALID_URL', 'Hostname is missing.');
  }

  if (
    BLOCKED_HOSTNAMES.has(normalized) ||
    normalized.endsWith('.localhost') ||
    normalized.endsWith('.local') ||
    normalized.endsWith('.internal')
  ) {
    throw new ScrapeError('BLOCKED_URL', 'Local/private hostnames are not allowed.');
  }

  const directIp = isIP(normalized);
  if (directIp) {
    assertPublicIp(normalized);
    return;
  }

  let records: LookupAddress[];
  try {
    records = await lookup(normalized, { all: true, verbatim: true });
  } catch {
    throw new ScrapeError('FETCH_FAILED', 'Could not resolve the provided hostname.');
  }

  if (!Array.isArray(records) || records.length === 0) {
    throw new ScrapeError('FETCH_FAILED', 'Could not resolve the provided hostname.');
  }

  for (const record of records) {
    assertPublicIp(record.address);
  }
}

async function assertSafeUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(normalizeInputUrl(raw));
  } catch {
    throw new ScrapeError('INVALID_URL', 'Invalid URL.');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new ScrapeError('INVALID_URL', 'Only HTTP(S) URLs are allowed.');
  }

  if (url.username || url.password) {
    throw new ScrapeError('BLOCKED_URL', 'Credentialed URLs are not allowed.');
  }

  await assertSafeHost(url.hostname);
  return url;
}

async function fetchSafe(url: URL): Promise<{ response: Response; finalUrl: URL }> {
  let currentUrl = url;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(currentUrl, {
        method: 'GET',
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'MinaRoastBot/1.0 (+https://minamankarious.com/roast)',
        },
      });
    } catch (error) {
      clearTimeout(timeout);
      if ((error as Error).name === 'AbortError') {
        throw new ScrapeError('TIMEOUT', 'Request timed out.');
      }
      throw new ScrapeError('FETCH_FAILED', 'Could not fetch this URL.');
    }
    clearTimeout(timeout);

    const isRedirect = response.status >= 300 && response.status < 400;
    if (!isRedirect) {
      return { response, finalUrl: currentUrl };
    }

    const location = response.headers.get('location');
    if (!location) {
      throw new ScrapeError('FETCH_FAILED', 'Redirect response was missing a location.');
    }

    const nextUrl = new URL(location, currentUrl);
    currentUrl = await assertSafeUrl(nextUrl.toString());
  }

  throw new ScrapeError('FETCH_FAILED', 'Too many redirects.');
}

async function readBodyWithLimit(response: Response): Promise<string> {
  const contentLength = response.headers.get('content-length');
  if (contentLength) {
    const size = Number.parseInt(contentLength, 10);
    if (!Number.isNaN(size) && size > MAX_BODY_BYTES) {
      throw new ScrapeError('BODY_TOO_LARGE', 'Page is too large to analyze.');
    }
  }

  if (!response.body) {
    throw new ScrapeError('SCRAPE_FAILED', 'Page body was empty.');
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      throw new ScrapeError('BODY_TOO_LARGE', 'Page is too large to analyze.');
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder('utf-8').decode(bytes);
}

export async function scrapeUrl(rawUrl: string): Promise<ScrapedData> {
  const initialUrl = await assertSafeUrl(rawUrl);
  const { response, finalUrl } = await fetchSafe(initialUrl);

  if (!response.ok) {
    throw new ScrapeError('FETCH_FAILED', `URL returned status ${response.status}.`);
  }

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
  if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
    throw new ScrapeError('NOT_HTML', 'URL does not appear to be an HTML page.');
  }

  const html = await readBodyWithLimit(response);

  const title = extractTagContent(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = extractMetaContent(html, 'description');
  const ogTitle = extractMetaContent(html, 'og:title');
  const ogDescription = extractMetaContent(html, 'og:description');
  const h1 = extractTagContent(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const firstParagraph = extractTagContent(html, /<p[^>]*>([\s\S]*?)<\/p>/i);

  if (!title && !description && !ogTitle && !ogDescription && !h1 && !firstParagraph) {
    throw new ScrapeError('SCRAPE_FAILED', 'Could not extract usable copy from this page.');
  }

  return {
    url: finalUrl.toString(),
    domain: finalUrl.hostname.replace(/^www\./, ''),
    title,
    description,
    ogTitle,
    ogDescription,
    h1,
    firstParagraph,
  };
}
