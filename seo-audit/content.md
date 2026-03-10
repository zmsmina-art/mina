# Content Quality & E-E-A-T Audit Report

**Site:** https://minamankarious.com
**Framework:** Next.js 15 (App Router)
**Audit Date:** 2026-03-03

---

## Executive Summary

The content strategy is **strong and well-executed**. The site features 20+ in-depth articles on AI startup marketing, 3 detailed case studies, multiple interactive tools, and comprehensive E-E-A-T signals. Articles demonstrate genuine expertise and experience. The main opportunities are around **meta description optimization**, **internal linking density**, and **content freshness signals**.

**Overall Grade: A-**

---

## 1. E-E-A-T Signals Assessment

### Experience — EXCELLENT
- First-person narratives throughout ("What I Learned From My First 10 Clients", "I've Been in Marketing Since I Was 10")
- Case studies with real metrics and client outcomes
- Building-in-public transparency ("Why I Built a Tool That Roasts Your Startup's Positioning")
- Personal story articles showing authentic journey

### Expertise — EXCELLENT
- Deep domain knowledge in AI startup positioning, marketing systems, and growth strategy
- Technical articles with frameworks and methodologies ("What Is Marketing Systems Engineering?")
- Practical, actionable advice with specific steps
- Interactive tools (Positioning Grader, Roaster) demonstrate applied expertise

### Authoritativeness — EXCELLENT
- Schema.org Person entity with 8 verified `sameAs` profiles (LinkedIn, GitHub, Wikidata, etc.)
- Named company (Olunix) with Organization schema
- McMaster University engineering credentials
- Multiple roles: Founder & CEO of Olunix, Deal Partner at Boardy
- Crunchbase presence

### Trustworthiness — GOOD
- Privacy policy page at `/privacy`
- HTTPS with HSTS preload
- Clear author attribution on all articles
- Real headshot photo throughout
- Contact available via booking system

**E-E-A-T Overall: 9/10**

---

## 2. Content Depth Analysis

### Articles (20+ published)
| Article Type | Count | Assessment |
|-------------|-------|------------|
| Strategic/thought leadership | 8 | Long-form, high-value, unique perspectives |
| Tactical/how-to | 5 | Actionable with specific frameworks |
| Personal/founder story | 4 | Authentic, builds trust |
| Industry analysis | 3 | Demonstrates expertise |

### Content Quality Indicators
- **Average article length:** Most articles are 1,500-3,000+ words (well above thin content threshold)
- **Readability:** Professional but accessible tone, short paragraphs, clear subheadings
- **Unique perspectives:** Articles like "Most AI Startups Will Die With Great Products" and "Good Content Doesn't Win" offer contrarian, experience-backed viewpoints
- **Actionability:** Articles typically end with concrete next steps or frameworks

### Thin Content Risk — LOW
No thin content pages detected. Every page serves a clear purpose:
- Tool pages (Positioning Grader, Roast) have interactive functionality
- Articles have substantial content
- About page has comprehensive biography
- Privacy page has full legal content

---

## 3. Meta Descriptions & Titles

### Root Metadata — GOOD
- Title: "Mina Mankarious — Founder & CEO of Olunix"
- Description: ~160 chars, includes key terms
- Keywords: 7 relevant keywords

### Page-Level Metadata — GOOD
All pages have unique:
- `title` tags with clear purpose
- `description` meta tags
- OpenGraph title, description, image
- Twitter card with `summary_large_image`

### Opportunities
- **Article meta descriptions** are auto-generated from `article.excerpt` — verify each excerpt is optimized for search intent (not just a content teaser)
- **Title format consistency** — Some pages use "Page — Mina Mankarious" while others use different patterns. Standardize.
- **Keyword mapping** — Ensure each major page targets a primary keyword in its title and H1

---

## 4. AI Citation Readiness

### llms.txt — EXCELLENT
Dedicated file at `/public/llms.txt` with:
- Site structure overview
- Key article summaries
- Author bio and credentials
- Contact information

### AI Crawler Rules — EXCELLENT
All major AI crawlers explicitly allowed:
- GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended

### Content Structure for Citation — GOOD
- Clear H1-H2-H3 heading hierarchy in articles
- Articles use semantic markdown (headings, lists, emphasis)
- Unique, quotable insights in most articles
- Author attribution clear on every article

### Opportunities
- Add `speakable` property to BlogPosting schema for Google Assistant
- Ensure article introductions contain key claims/definitions that AI models can easily extract and cite
- Consider adding a "Key Takeaways" or "TL;DR" section at the top of longer articles for better AI summarization

---

## 5. Internal Linking

### Current Structure
- Homepage: Links to latest 3 articles, case studies, booking
- Articles: Related articles section, tag links, back to articles
- Navigation: 6 primary links + footer comprehensive links
- Schema: BreadcrumbList on every page

### Opportunities
- **Cross-link between articles** more aggressively — articles on related topics should reference each other within the body content
- **Link from articles to tools** — Articles about positioning could link directly to the Positioning Grader
- **Link from tools to articles** — The Positioning Grader/Roast could suggest relevant articles based on the topic
- **Add Articles to primary navigation** — Currently only in footer (major discoverability gap)

---

## 6. Content Freshness

### Publication Dates
- Latest article: 2026-03-03 ("Why I Built a Tool That Roasts Your Startup's Positioning")
- Regular publishing cadence with articles spanning several months
- Articles have both `publishedAt` and `updatedAt` fields

### RSS Feed
- All articles syndicated via `/feed.xml`
- Full content included (good for aggregators)

### Newsletter
- Auto-sends via Vercel cron (daily at 3 PM UTC)
- New articles after cutoff date (2026-02-23) eligible
- Active distribution channel

---

## 7. Conversion Optimization in Content

### CTA Placement — GOOD
- Hero section: Booking CTA prominently placed
- Articles: Inline newsletter CTA after first H2 (strategic placement)
- Footer: Newsletter subscription on every page
- Article end: Related articles + booking prompt
- Booking modal: Lazy-loaded, full-screen on mobile

### Opportunities
- **Article CTAs could be more varied** — Not every reader is ready to subscribe; some might want to try a tool
- **Case studies lack individual pages** — Can't deep-link to specific case studies for conversion
- **No testimonial/social proof on article pages** — Adding a brief authority indicator near the author byline could boost conversion

---

## 8. Case Studies

### Quality — GOOD
3 case studies with structured data:
- Problem, approach, result, metrics, phases
- Hero tier (1) + supporting tier (2) differentiation
- Quantified results (metrics)

### Opportunities
- **Create individual case study pages** (`/work/[slug]`) for deeper content and better SEO
- **Add client testimonials/quotes** within case studies
- **Include before/after comparisons** or visual metrics

---

## 9. Interactive Tools

### Positioning Grader — HIGH VALUE
- Uses Gemini 2.0 Flash for AI-powered analysis
- 10 persona-specific landing pages for targeted SEO
- Free tool (great for lead generation)

### Positioning Roaster — HIGH VALUE
- AI-powered critique of startup messaging
- Engaging, shareable format
- Related article published about the tool's creation

### Startup Diagnostic — MEDIUM VALUE
- Internal tool (noindex) — consider making it public for SEO benefit if content is valuable

---

## Findings Summary

### High Priority
1. Add Articles to primary navigation (desktop + mobile)
2. Cross-link articles to tools and vice versa
3. Verify article excerpts are optimized as meta descriptions
4. Add "Key Takeaways" sections to longer articles for AI citation

### Medium Priority
5. Create individual case study pages (`/work/[slug]`)
6. Standardize title tag format across all pages
7. Increase internal linking density between related articles
8. Consider making Diagnostic tool public (noindex → index)

### Low Priority
9. Add `speakable` property to BlogPosting schema
10. Add testimonial snippets to article author bylines
11. Vary article CTAs (tool links, not just newsletter)
