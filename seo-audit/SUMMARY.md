# Full SEO Audit — minamankarious.com

**Audit Date:** 2026-03-03
**Site:** https://minamankarious.com
**Framework:** Next.js 15 + React 18 + GSAP + Tailwind
**Deployment:** Vercel (auto-deploys from main)

---

## Overall Scorecard

| Audit Area | Grade | Report |
|-----------|-------|--------|
| Technical SEO | **A-** | [technical.md](./technical.md) |
| Content & E-E-A-T | **A-** | [content.md](./content.md) |
| Schema Markup | **B+** | [schema.md](./schema.md) |
| Sitemap Architecture | **B+** | [sitemap.md](./sitemap.md) |
| Performance & CWV | **B** | [performance.md](./performance.md) |
| Visual & Mobile | **B+** | [visual.md](./visual.md) |

**Overall: B+ / A-** — Strong foundation with excellent E-E-A-T signals and thoughtful AI optimization. The main gaps are performance-related (pointer tracking, GPU layers, fonts) and a few structural schema issues.

---

## Top 10 Fixes (Prioritized by Impact)

### Critical (Fix ASAP)

| # | Issue | Impact | File(s) |
|---|-------|--------|---------|
| 1 | **Remove all FAQPage schema** (4 instances) — Deprecated since Aug 2023, generates no rich results | Schema validity | `about/page.tsx`, `book/page.tsx`, `positioning-grader/page.tsx`, `positioning-grader/[persona]/page.tsx` |
| 2 | **Throttle CardGlow pointer tracking** — 15+ instances doing `getBoundingClientRect()` per frame = layout thrashing | INP: -100 to -200ms | `src/lib/pointer.ts`, `src/components/ui/glowing-effect.tsx` |
| 3 | **Remove blanket `will-change`** from `[data-motion]` — Promotes 20+ elements to GPU layers unnecessarily | LCP: -200 to -500ms | `src/app/motion.css`, line 67 |
| 4 | **Fix Organization foundingDate** — `"2024-09"` → `"2024-09-01"` | Schema validation | `src/app/layout.tsx`, line 139 |
| 5 | **Fix PWA theme_color mismatch** — manifest.json says `#8b5cf6`, meta says `#050505` | PWA UX | `public/manifest.json`, `src/app/layout.tsx` |

### High Priority

| # | Issue | Impact | File(s) |
|---|-------|--------|---------|
| 6 | **Consolidate fonts** — 9 files across 4 families; remove EB Garamond, preload Cormorant Garamond | LCP: -300 to -800ms, CLS: -0.03 | `src/app/layout.tsx` |
| 7 | **Add Articles to primary navigation** — Major content section missing from desktop + mobile nav | Crawlability, UX | `src/components/SiteNav.tsx` |
| 8 | **Expand image sitemap** — Only covers 3 page types; missing /work, /positioning-grader, /roast | Image indexing | `src/app/sitemap-images.xml/route.ts` |
| 9 | **Remove home page BreadcrumbList** — Single-item breadcrumb is ineligible for rich results | Schema validity | `src/app/page.tsx` |
| 10 | **Add Admin layout with noindex** — Currently only blocked by robots.txt, needs defense-in-depth | Indexability | Create `src/app/admin/layout.tsx` |

---

## Quick Wins (Under 30 Minutes Each)

- Fix `foundingDate` format: `"2024-09"` → `"2024-09-01"` (1 line change)
- Remove home page BreadcrumbList (delete ~12 lines)
- Align PWA `theme_color` to `#050505` (1 line change in manifest.json)
- Add `isPartOf` to WebApplication schemas (1 line in 3 files)
- Add `articleSection` to BlogPosting schema (1 line)
- Remove `will-change` from `[data-motion]` CSS rule (1 line)

---

## What's Already Excellent

These patterns are **best-in-class** and should be preserved:

1. **E-E-A-T signals** — Person schema is one of the most thorough possible (8 verified sameAs links, Wikidata, educational credentials, multiple occupations)
2. **AI crawler optimization** — `llms.txt`, explicit AI bot rules in robots.ts, citation-ready content structure
3. **Server/client component split** — All homepage sections are server components; heavy JS loads async
4. **CSS-only hero animation fallback** — Content paints at FCP before GSAP hydrates
5. **prefers-reduced-motion** — Multi-layer support across CSS, GSAP, Framer Motion, and custom components
6. **Security headers** — Comprehensive CSP, HSTS with preload, CORP, Permissions-Policy
7. **RSS feed** — Full content RSS 2.0 with proper namespaces
8. **Dynamic sitemaps** — Auto-generated from article/tag/persona data sources
9. **OG image generation** — Dynamic at `/api/og` with font preloading
10. **Newsletter automation** — Vercel cron at 3 PM UTC, auto-sends new articles

---

## Estimated Performance Gains

If all Priority 1-2 fixes are implemented:

| Metric | Current (est.) | After Fixes (est.) | Change |
|--------|---------------|--------------------|---------|
| LCP | ~2.5-3.5s | ~1.5-2.5s | -500 to -1300ms |
| CLS | ~0.08-0.12 | ~0.03-0.05 | -0.05 to -0.07 |
| INP | ~200-400ms | ~100-200ms | -100 to -200ms |
| Lighthouse Score | ~65-75 | ~85-95 | +15-25 points |

---

## Full Report Index

```
seo-audit/
├── SUMMARY.md          ← You are here
├── technical.md        ← Crawlability, indexability, security, URL structure
├── content.md          ← E-E-A-T, readability, content depth, AI citation
├── schema.md           ← Schema.org validation, entity graph, rich results
├── sitemap.md          ← XML sitemap, image sitemap, RSS feed, robots.ts
├── performance.md      ← Core Web Vitals, JS bundles, fonts, images, CSS
└── visual.md           ← Mobile rendering, touch targets, modals, PWA, animations
```
