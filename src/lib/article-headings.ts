import GithubSlugger from 'github-slugger';

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Extract h2/h3 headings from markdown and generate IDs matching rehype-slug.
 */
export function extractHeadings(markdown: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;

  let match;
  while ((match = regex.exec(markdown)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    headings.push({ id: slugger.slug(text), text, level });
  }

  return headings;
}

/**
 * Split markdown content after the (afterIndex+1)th h2 heading.
 * Returns [before, after] or null if there aren't enough h2s.
 */
export function splitContentAfterH2(
  markdown: string,
  afterIndex: number
): [string, string] | null {
  const h2Regex = /^## /gm;
  let count = 0;
  let match;

  while ((match = h2Regex.exec(markdown)) !== null) {
    if (count === afterIndex + 1) {
      return [markdown.slice(0, match.index), markdown.slice(match.index)];
    }
    count++;
  }

  return null;
}
