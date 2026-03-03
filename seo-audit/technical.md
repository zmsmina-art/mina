# Technical SEO Audit Report

**Site:** https://minamankarious.com
**Framework:** Next.js 15 (App Router) + TypeScript + React 18 + Tailwind
**Deployment:** Vercel (auto-deploys from main)
**Audit Date:** 2026-03-03

---

## Executive Summary

The technical SEO foundation is **excellent**. The site has comprehensive metadata, proper canonical URLs, hreflang tags, a well-configured robots.ts, dynamic sitemaps, and strong security headers. The main concerns are around **JavaScript rendering weight** (GSAP + Framer Motion), **font loading strategy**, and a few minor configuration issues.

**Overall Grade: A-**

---

## 1. Crawlability

### robots.ts — EXCELLENT
- Default: `allow: "/"`, `disallow: "/admin/"`
- AI crawlers explicitly allowed: GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended
- Sitemaps referenced: `sitemap.xml` + `sitemap-images.xml`

### Meta Robots — GOOD
- All public pages: `index: true, follow: true`
- Diagnostic page: `index: false, follow: false` (correctly excluded)
- Admin routes: Blocked by robots.ts + middleware

**Issue:** Admin pages (`/admin/views`) lack `noindex` metadata as defense-in-depth. Only blocked by robots.ts and middleware Basic Auth. Add `src/app/admin/layout.tsx` with `robots: { index: false }`.

### Canonical URLs — EXCELLENT
- `metadataBase: new URL("https://minamankarious.com")`
- Every page has explicit `alternates.canonical`
- All canonical URLs are absolute and consistent

### hreflang — GOOD
- Every page has `alternates.languages: { "en-US": "..." }`
- Mono-language site, so single hreflang is correct

---

## 2. Indexability

### Page Discovery
All indexable pages are in the sitemap. No orphan pages detected.

### noindex Coverage
| Page | noindex | Correct? |
|------|---------|----------|
| `/diagnostic` | Yes | Yes — internal tool |
| `/admin/views` | Only via robots.txt | **Needs meta noindex** |
| All other pages | No (indexable) | Yes |

### Redirect Chains
- `/fan-controller` → `/fan-controller/index.html` (single redirect via next.config.mjs)
- No multi-hop redirect chains detected

---

## 3. URL Structure

### Clean URLs — EXCELLENT
- No trailing slashes (Next.js default)
- No `.html` extensions on app router pages
- Article slugs are descriptive: `/articles/how-to-position-your-ai-startup-when-everything-sounds-the-same`
- Tag slugs are lowercase: `/articles/tag/marketing`
- Persona slugs are descriptive: `/positioning-grader/for-saas-founders`

### Parameter Handling
- `/articles?q={query}` for article search (referenced in Schema.org SearchAction)
- `/api/og?title=...&excerpt=...` for OG image generation (not indexed)
- No pagination parameters detected

---

## 4. Security Headers — EXCELLENT

| Header | Value | Status |
|--------|-------|--------|
| X-Content-Type-Options | nosniff | PASS |
| X-Frame-Options | SAMEORIGIN | PASS |
| Referrer-Policy | strict-origin-when-cross-origin | PASS |
| HSTS | max-age=63072000; includeSubDomains; preload | PASS |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | PASS |
| CORP | same-origin (cross-origin for /api/og) | PASS |
| CSP | Comprehensive policy | PASS |

### CSP Notes
- `unsafe-inline` needed for theme detection script — consider nonce-based approach
- `fonts.gstatic.com` allowed in `font-src` but fonts are self-hosted via `next/font` — may be unnecessary

---

## 5. Mobile Optimization

### Viewport — GOOD
Next.js 15 auto-injects `<meta name="viewport" content="width=device-width, initial-scale=1">`.

**Recommendation:** Migrate to explicit `export const viewport: Viewport = {...}` in layout.tsx for proper Next.js 15 handling and to set `themeColor` correctly.

### Responsive Design — GOOD
- Tailwind responsive classes used throughout
- Mobile-specific CSS in `responsive.css` (~429 lines)
- Bottom dock navigation on mobile
- Full-screen modals on mobile

### manifest.json — NEEDS FIXES
- `theme_color` mismatch with HTML meta
- App icons use headshot photo (not suitable)
- Missing narrow-form screenshot

---

## 6. JavaScript Rendering (SSR vs CSR)

### Server-Side Rendering — EXCELLENT
- All homepage sections are server components
- Article pages are server-rendered with client hydration for interactive elements
- Dynamic imports with `ssr: false` for heavy libraries (GSAP, Framer Motion)

### Client-Side Concerns
- **15+ CardGlow instances** with per-frame pointer tracking (layout thrashing risk)
- **SiteNav** is a full client component on every page (could extract scroll behavior)
- **NewsletterCTA** in footer pulls client JS on every page

### Hydration Budget
Estimated client JS on homepage: ~72-90 KB gzip (plus ~74 KB for React + Next.js runtime)

---

## 7. Internal Linking

### Navigation — GOOD
- Desktop: 6-item tubelight navigation (Home, About, Work, Roast, Newsletter, + CTA)
- Mobile: 4-item bottom dock (About, Work, Roast, Newsletter)
- Footer: Comprehensive links to all pages + social profiles

**Issue:** Articles page is in the footer but NOT in the primary navigation (desktop or mobile). This is a major content section that should be more discoverable.

### Content Interlinking — GOOD
- Article pages: Related articles section, back to articles link, tag links
- Homepage: Latest 3 articles, case study links, CTA buttons throughout
- Schema: BreadcrumbList on every page

---

## 8. Content Distribution

### RSS Feed — EXCELLENT
- Full RSS 2.0 at `/feed.xml`
- All articles with full content, categories, author, pub dates
- Atom, DC, and Content namespaces

### llms.txt — EXCELLENT
- AI crawler optimization file at `/public/llms.txt`
- Site structure, key articles, author info, contact details
- Designed for AI model citation and context

### AI Crawler Rules — EXCELLENT
- All major AI crawlers explicitly allowed in robots.ts
- `llms.txt` provides structured context for AI systems

---

## 9. Image Optimization

### next.config.mjs — CORRECT
- `formats: ['image/avif', 'image/webp']` — AVIF priority (better compression)
- Next/Image component used for all content images

### Issues
- Several PNG logos should be WebP (46 KB logo for 56x56 display)
- `/headshot.jpg` (118 KB) likely unused (WebP version exists)
- Texture PNGs (130 KB combined) may be unused

---

## 10. Findings Summary

### Critical (3)
1. Admin pages need meta noindex as defense-in-depth
2. Articles page missing from primary navigation
3. PWA theme_color mismatch

### High (4)
4. `will-change` blanket on all animated elements (performance)
5. 15+ CardGlow pointer tracking instances (layout thrashing)
6. 9 font files — consolidate to 5-6 maximum
7. Cormorant Garamond (hero font) not preloaded

### Medium (3)
8. CSP uses `unsafe-inline` — consider nonce-based approach
9. `fonts.gstatic.com` in CSP font-src may be unnecessary
10. Footer NewsletterCTA should be dynamically imported

### Low (3)
11. Explicit viewport export recommended for Next.js 15
12. Unused image files in /public/ add deployment bloat
13. `/fan-controller` redirect could be a rewrite instead
