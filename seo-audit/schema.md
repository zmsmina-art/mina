# Schema.org Structured Data Audit Report

**Site:** https://minamankarious.com
**Framework:** Next.js 15 (App Router)
**Audit Date:** 2026-03-03

---

## Executive Summary

The site has **extensive, well-structured Schema.org markup** across all pages. The entity graph is properly cross-referenced with `@id` linking. However, 3 critical issues were found: **deprecated FAQPage usage** (4 instances), a **foundingDate format error**, and a **single-item BreadcrumbList** on the homepage.

**Overall Grade: B+** — Fix the 3 critical issues and add a Service schema to reach an A.

---

## Schema Inventory

| Page | Schema Types | Status |
|------|-------------|--------|
| Root Layout | Organization, Person, WebSite, SiteNavigationElement | PASS (2 fixes) |
| Home | BreadcrumbList | **FAIL** |
| About | ProfilePage, AboutPage, BreadcrumbList, ~~FAQPage~~ | WARN |
| Articles Index | Blog, BreadcrumbList | PASS (1 fix) |
| Article Detail | BlogPosting, BreadcrumbList | PASS |
| Tag Pages | CollectionPage, BreadcrumbList | PASS |
| Work | CollectionPage, BreadcrumbList | PASS (1 fix) |
| Newsletter | WebPage, BreadcrumbList | PASS |
| Positioning Grader | WebApplication, BreadcrumbList, ~~FAQPage~~ | WARN |
| Persona Pages | WebApplication, BreadcrumbList, ~~FAQPage~~ | WARN |
| Roast | WebApplication, BreadcrumbList | PASS |
| Book | BreadcrumbList, ~~FAQPage~~ | WARN |
| Privacy | BreadcrumbList | PASS |

---

## Critical Issues

### CRITICAL-1: Remove All FAQPage Schema (4 instances)

FAQPage rich results were **restricted to government and healthcare authority sites in August 2023**. This site does not qualify. Google silently ignores these — they are dead weight.

**Files to update:**
1. `src/app/about/page.tsx` — Remove FAQPage from `@graph` array
2. `src/app/book/page.tsx` — Remove `faqJsonLd` object and its `<script>` tag
3. `src/app/positioning-grader/page.tsx` — Remove `faqJsonLd` object and its `<script>` tag
4. `src/app/positioning-grader/[persona]/page.tsx` — Remove `faqJsonLd` object and its `<script>` tag

### CRITICAL-2: Fix Organization foundingDate Format

**File:** `src/app/layout.tsx`, line 139

```diff
- "foundingDate": "2024-09"
+ "foundingDate": "2024-09-01"
```

ISO 8601 requires minimum YYYY-MM-DD. `"2024-09"` is ambiguous and may fail validation.

### CRITICAL-3: Home Page BreadcrumbList Has Only 1 Item

**File:** `src/app/page.tsx`, lines 26-37

Google requires at least 2 items in a BreadcrumbList for rich result eligibility. A single "Home" item provides no hierarchy. **Remove this BreadcrumbList from the home page.**

---

## Warnings

### WARN-1: Organization Logo is SVG
`src/app/layout.tsx`, line 145 — Google prefers raster formats. Consider adding a PNG fallback.

### WARN-2: Blog Listing BlogPosting Items Missing Image
`src/app/articles/page.tsx` — Each embedded BlogPosting in the `blogPost` array lacks `image`. Add the OG image URL.

### WARN-3: Work Page ListItem Entries Missing URL
`src/app/work/page.tsx` — ListItem entries only have `name` and `description`, no `url`. Acceptable since no `/work/[slug]` routes exist, but update if individual case study pages are created.

### WARN-4: dateModified Format Inconsistency (About Page)
ProfilePage uses `"2026-02-27T00:00:00Z"` but AboutPage uses `"2026-02-27"`. Both valid, but pick one format.

### WARN-5: Duplicate @context in Nested Blocks
Several pages emit multiple `<script type="application/ld+json">` blocks. Consider consolidating into single `@graph` blocks.

### WARN-6: WebApplication Missing isPartOf
`src/app/positioning-grader/page.tsx`, `src/app/roast/page.tsx`, `src/app/positioning-grader/[persona]/page.tsx` — Add `isPartOf: { "@id": "https://minamankarious.com/#website" }`.

---

## Missing Schema Opportunities

### HIGH PRIORITY: Service Schema
Add a `Service` schema to `src/app/layout.tsx` for Olunix consulting services (Positioning Strategy, Founder-Led Marketing, Growth Consulting).

### MEDIUM PRIORITY: ContactPage + Offer for Book Page
Replace the removed FAQPage in `src/app/book/page.tsx` with a `ContactPage` schema including a free `Offer`.

### MEDIUM PRIORITY: Add articleSection to BlogPosting
In `src/app/articles/[slug]/page.tsx`, add `articleSection: article.tags[0]`.

### LOW PRIORITY: Organization contactPoint
Add `contactPoint` with email and available languages to the Organization schema.

### LOW PRIORITY: WebApplication screenshot
Add `screenshot` ImageObject to positioning grader and roast WebApplication schemas.

---

## Entity Graph Integrity

```
@graph (layout.tsx)
  +-- Organization (@id: https://olunix.com/#organization)
  |     |-- founder --> Person
  +-- Person (@id: https://minamankarious.com/#person)
  |     |-- worksFor --> Organization
  +-- WebSite (@id: https://minamankarious.com/#website)
  |     |-- publisher --> Person
  +-- SiteNavigationElement (x6)

BlogPosting --> author/publisher --> Person
BlogPosting --> isPartOf --> WebSite
Blog --> publisher --> Person, isPartOf --> WebSite
CollectionPage (tags) --> isPartOf --> Blog
WebApplication --> creator --> Person
```

**All major entities properly cross-referenced. Graph integrity: EXCELLENT.**

---

## E-E-A-T Assessment

The Person schema is **one of the most thorough** possible:
- Multiple images, job title, description, nationality, birthplace
- Educational credentials (McMaster University, automotive engineering)
- Multiple occupations (CEO, Deal Partner)
- 8 verified `sameAs` links including Wikidata
- `knowsAbout` with 8 topics, `knowsLanguage` with proper Language objects

**E-E-A-T Score: 10/10**
