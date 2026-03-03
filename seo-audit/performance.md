# Performance & Core Web Vitals Audit Report

**Site:** https://minamankarious.com
**Framework:** Next.js 15 + React 18 + GSAP + Framer Motion + Tailwind
**Audit Date:** 2026-03-03

---

## Executive Summary

The site has a **well-designed server/client split** — all homepage sections are server components, heavy JS (GSAP, Framer Motion) loads asynchronously via dynamic imports. However, **3 critical performance issues** were identified that likely cost 15-25 Lighthouse points: excessive pointer tracking, blanket `will-change` GPU layer promotion, and too many font files.

---

## 1. Core Web Vitals Assessment

### LCP (Largest Contentful Paint)
**Likely LCP element:** Hero H1 heading (`<h1>` in HomeHero.tsx)
**Risk factors:**
- 9 font files (4 families) loaded — Cormorant Garamond (hero font) has `preload: false`
- CSS-only hero reveal animates at FCP — GOOD pattern, but font swap could delay text rendering
- Hero headshot image has `priority` flag — correctly preloaded

### CLS (Cumulative Layout Shift)
**Risk factors:**
- No `size-adjust`/`ascent-override` on Switzer @font-face declarations
- Mixed `font-display` strategies (`swap` vs `optional`) create inconsistent behavior
- Hero image has explicit dimensions — GOOD

### INP (Interaction to Next Paint)
**Risk factors:**
- 15+ CardGlow instances each track pointer events and call `getBoundingClientRect()` per frame
- Blanket `will-change: transform, opacity` on all `[data-motion]` elements
- SiteNav is a client component on every page

---

## 2. Critical Issues (Priority 1 — Est. 15-25 Lighthouse points)

### R1: Throttle Pointer Tracking System

**Files:** `src/lib/pointer.ts`, `src/components/ui/glowing-effect.tsx`

Every CardGlow instance (15+ on homepage) subscribes to global pointer events and calls `getBoundingClientRect()` per frame per card. This causes **forced synchronous layout 15+ times per animation frame**.

**Fix:** Throttle pointer broadcasts to ~30fps via `requestAnimationFrame` debounce. Only run `getBoundingClientRect()` on visible cards using `IntersectionObserver`.

**Impact:** -100 to -200ms INP improvement

### R2: Remove Blanket `will-change` from `[data-motion]`

**File:** `src/app/motion.css`, line 67

Every `data-motion` element is promoted to its own GPU layer from page load until unload, even though animations are one-shot scroll-triggered.

```css
/* REMOVE: */
[data-motion] {
  will-change: transform, opacity;
}
```

Let GSAP handle layer promotion during animation via `onStart`/`onComplete`.

**Impact:** -200 to -500ms LCP, -50ms INP

### R3: Consolidate Fonts to 2 Families

**File:** `src/app/layout.tsx`, lines 9-33

Current: 9 font files across 4 families (Cormorant Garamond, EB Garamond, Playfair Display, Switzer).

**Fix:**
1. Remove EB Garamond (redundant with Cormorant Garamond)
2. Consider using Cormorant Garamond italic instead of Playfair Display for the hero wordmark
3. Set `preload: true` on remaining Google fonts

**Impact:** -300 to -800ms LCP, -0.03 CLS

---

## 3. High Priority Issues (Priority 2 — Est. 5-15 points)

### R4: Add size-adjust to Switzer @font-face

**File:** `src/app/globals.css`, lines 97-119

Minimize CLS from body font swap with fallback font metrics:
```css
@font-face {
  font-family: 'Switzer';
  src: url('/fonts/switzer-regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
  size-adjust: 102%;
  ascent-override: 95%;
  descent-override: 25%;
}
```

**Impact:** -0.02 to -0.05 CLS

### R5: Disable Etheral Ambient CSS Animations on Mobile

**File:** `src/app/motion.css`, lines 26-55

The JS component (`EtheralAmbient`) correctly disables on touch devices, but CSS keyframe animations (`satin-drift-1/2/3`) still run. Wrap in:
```css
@media (prefers-reduced-motion: no-preference) and (hover: hover) {
  /* satin-drift animations */
}
```

**Impact:** -30 to -80ms INP on mobile, battery savings

### R6: Optimize Logo Images

Convert `/boardy-logo.png` (46 KB for 56x56), `/mcmaster-university-crest.png` (19 KB), `/toyota-logo.png` (16 KB) to WebP at 112x112. Target under 5 KB each.

### R7: Extract SiteNav Scroll Behavior

**File:** `src/components/SiteNav.tsx`

Make outer nav a server component; extract only scroll-detection into a tiny client component.

---

## 4. Medium Priority Issues (Priority 3 — Est. 2-5 points)

### R8: Lazy-load NewsletterCTA in Footer
`src/components/SiteFooter.tsx` — Use `next/dynamic` with `ssr: false` for the newsletter form.

### R9: Remove Unused `/headshot.jpg` (118 KB)
Superseded by the 29 KB WebP version.

### R10: Verify `/noise.png` and `/etheral-noise.png` Usage
Combined 130 KB. The grain overlay uses CSS gradients — these PNGs may be unused remnants.

### R11: Use `content-visibility: auto` on Below-Fold Sections
Add to Education, Services, Contact sections for deferred rendering.

---

## 5. JS Bundle Analysis

| Package | Size (est. gzip) | Tree-shakeable |
|---------|------------------|----------------|
| React + ReactDOM | ~44 KB | No |
| Next.js runtime | ~30 KB | Partially |
| GSAP core | ~24 KB | Yes |
| GSAP ScrollTrigger | ~12 KB | Yes |
| Framer Motion | ~30 KB | Partially |
| lucide-react (7 icons) | ~10 KB | Yes |

**Total estimated client JS on homepage: ~72-90 KB gzip** (excluding framework)

---

## 6. Server/Client Split (Hydration Architecture)

```
RootLayout (Server)
  |-- SiteNav (Client) -- scroll handler, state
  |-- LayoutRuntime (Client)
  |     |-- GSAPProvider (Client, dynamic, ssr: false)
  |     |-- MotionRuntime (Client, dynamic, ssr: false)
  |     |-- EtheralAmbient (Client, dynamic, ssr: false)
  |-- page.tsx (Server)
  |     |-- SectionChoreography (Client) -- GSAP ScrollTrigger
  |     |-- HomeHero (Server)
  |     |     |-- HeroTimeline (Client)
  |     |     |-- CardGlow x3 (Client)
  |     |-- AuthoritySection (Server)
  |     |     |-- CardGlow x5 (Client)
  |     |-- WritingSection (Server)
  |     |-- WorkSection (Server)
  |     |-- EducationSection (Server)
  |     |-- ServiceSection (Server)
  |     |-- ContactSection (Server)
```

**Verdict:** Well-designed. Homepage sections are all server components. Client boundary is at leaf-level interactive components. Main concern is 15+ CardGlow instances with per-frame pointer tracking.

---

## 7. What's Done Well (Preserve These)

1. **CSS-only hero animation fallback** — Content paints at FCP before GSAP hydrates
2. **Dynamic imports with ssr: false** for GSAP, MotionRuntime, EtheralAmbient
3. **Server components for all homepage sections**
4. **GSAP loaded asynchronously via import() inside useEffect**
5. **Lazy booking modal** — only loads on user interaction
6. **prefers-reduced-motion respected** throughout all animation systems
7. **Passive event listeners** on all scroll/pointer handlers
8. **AVIF + WebP image format config** in next.config.mjs
9. **Self-hosted fonts** via next/font/google (no external CSS requests)
10. **Minimal third-party scripts** — only conditional Vercel Analytics (~1 KB)
