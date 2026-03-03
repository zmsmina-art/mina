# Sitemap Architecture Audit Report

**Site:** https://minamankarious.com
**Framework:** Next.js 15 (App Router)
**Audit Date:** 2026-03-03

---

## Executive Summary

The sitemap implementation is fundamentally solid. The dynamic `sitemap.ts` generates valid XML covering all core pages, articles, tag pages, personas, and utility pages (~55 URLs). The image sitemap and RSS feed are present. However, **3 high-severity issues** and **2 medium-severity issues** were identified.

**Overall: B+** — Primary sitemap is well-implemented. Image sitemap needs expansion.

---

## URL Coverage (55 URLs)

| Category | Count | Status |
|----------|-------|--------|
| Static pages | 9 | All included |
| Articles | 20 | All included |
| Tag pages | 13 | All included |
| Persona pages | 10 | All included |
| Diagnostic | 1 | Correctly excluded (noindex) |
| Admin | 1 | Correctly excluded (robots.txt blocked) |

**All indexable pages are in the sitemap. All noindex/admin pages are correctly excluded.**

---

## High Severity Issues

### H1: Image Sitemap Missing Key Pages

**File:** `src/app/sitemap-images.xml/route.ts`

The image sitemap only covers `/`, `/about`, and `/articles/*`. Missing:
- `/work` — case study images
- `/positioning-grader` — tool OG images
- `/roast` — tool OG images
- `/positioning-grader/[persona]` — persona-specific images

### H2: Image Sitemap Article Mapping is Manual

**File:** `src/app/sitemap-images.xml/route.ts`, line 35

The `articleImages` record only maps inline images for `hi-im-mina`. Other articles with inline images are missed.

**Fix:** Auto-extract images from article markdown content:
```typescript
function extractMarkdownImages(content: string) {
  const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    images.push({ path: match[2], alt: match[1] });
  }
  return images;
}
```

### H3: Admin Pages Lack noindex Metadata (Defense-in-Depth)

**File:** `src/app/admin/views/page.tsx`

Currently only blocked via `robots.ts`. Add `src/app/admin/layout.tsx` with:
```typescript
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

---

## Medium Severity Issues

### M1: Persona Page lastModified Dates Hardcoded

**File:** `src/app/sitemap.ts`, line 70

All 10 persona pages use `new Date("2026-03-01")`. Should reflect actual content changes.

### M2: RSS Feed Channel Image Points to Dynamic Endpoint

**File:** `src/app/feed.xml/route.ts`, line 74

`/api/og` without parameters returns a generic image. Use a static asset like `/headshot.webp`.

---

## Low/Informational

- `priority` and `changeFrequency` are present but ignored by Google — harmless, optional cleanup
- Static page `lastModified` dates are hardcoded — requires manual updates when pages change
- Tag page `lastModified` uses global latest article date for all tags — acceptable
- No sitemap index needed at current ~55 URL scale

---

## Sitemap vs. RSS Feed Consistency

| Check | Status |
|-------|--------|
| Same article source (`getAllArticlesSorted`) | PASS |
| URL format match | PASS |
| All sitemap articles in RSS | PASS |
| RSS only includes articles | PASS |

---

## robots.ts Audit

| Rule | Status |
|------|--------|
| Default: allow `/`, disallow `/admin/` | PASS |
| AI bot rules (GPTBot, ClaudeBot, etc.) | PASS — all explicitly allowed |
| Sitemap references (sitemap.xml + sitemap-images.xml) | PASS |

---

## Persona Pages Quality Gate

10 persona pages exist (below 30-page warning threshold). Each has:
- Unique `heroHeading`, `heroSubheading`, `placeholders`
- Unique SEO `title`, `description`, `keywords`

**Not thin doorway pages.** Safe at current scale.
