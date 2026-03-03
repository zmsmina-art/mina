# Visual & Mobile Rendering Audit Report

**Site:** https://minamankarious.com
**Framework:** Next.js 15 + React 18 + GSAP + Tailwind
**Audit Date:** 2026-03-03

---

## Executive Summary

The site demonstrates **excellent mobile-first design** with comprehensive `prefers-reduced-motion` support, a well-implemented mobile bottom dock navigation, and properly disabled custom cursor on touch devices. Key issues include a **PWA theme-color mismatch**, **missing Articles page from mobile navigation**, and several **touch target size violations**.

---

## 1. Mobile Navigation

### Bottom Dock (Mobile)
- 4 items: About, Work, Roast, Newsletter
- Fixed bottom, blur backdrop, safe-area padding
- Touch targets: 44px (PASS)
- Icon-only on mobile saves space

### Issues
- **Articles page missing from mobile dock** — A major content section with SEO value is not in primary mobile navigation. Add Articles to dock or add an overflow menu.
- **SiteNav items differ from SiteFooter** — Nav: About, Work, Roast, Newsletter. Footer: Home, About, Work, Articles, Positioning Grader, Newsletter, Book a Call, Contact.

---

## 2. Custom Cursor

**File:** `src/components/CustomCursor.tsx`

**EXCELLENT implementation:**
- Only enabled on `(hover: hover) and (pointer: fine)` — desktop with mouse only
- Disabled when `prefers-reduced-motion: reduce` is active
- Loaded via `dynamic(() => import(...), { ssr: false })`
- Elements marked `aria-hidden="true"`
- Uses `requestAnimationFrame` for smooth performance

**No issues found.**

---

## 3. Modals

### Booking Modal — EXCELLENT
- Full-screen on mobile (`100dvh`, no rounding)
- Centered card on desktop (max-w-lg)
- Body scroll locked, focus trap, escape to close
- Proper ARIA: `aria-modal="true"`, `role="dialog"`, `aria-label`

**Issue:** Close button is 32x32 (below 44px minimum). Increase to h-11 w-11.

### Newsletter Modal — NEEDS WORK
- Same centered card layout on all screen sizes (no mobile full-screen treatment)
- On 375px: only 343px usable width with 16px padding on each side

**Fix:** Add `max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:rounded-none max-sm:border-0` or use a bottom-sheet pattern.

---

## 4. Typography

### Body Text
- Base: `1.04rem` (~16.6px), line-height: 1.7 — GOOD
- Mobile paragraphs: `1.05rem` (~16.8px) — GOOD
- Article body mobile: `0.98rem` (~15.7px) — Slightly below 16px threshold, bump to `1rem`

### Headings
- Hero wordmark: `clamp(2.08rem, 12.2vw, 3.25rem)` — At 375px: ~45.75px, impactful
- Main headings: `clamp(2.05rem, 10vw, 2.65rem)` — Properly scaled
- `text-wrap: balance` on H1 prevents orphaned words

### Font Loading
- Cormorant Garamond (hero font): `preload: false` — **Should be true** for LCP
- EB Garamond: `display: 'optional'` — Performance-first choice, may never render on slow connections
- Switzer: Self-hosted, preloaded — GOOD

---

## 5. Animations

### prefers-reduced-motion — EXCELLENT (Multi-Layer)

| Layer | Implementation |
|-------|---------------|
| CSS | All animation-duration set to 0.01ms, transforms/opacity reset |
| GSAP | `SectionChoreography` skips all animations entirely |
| Framer Motion | Duration set to 0 when reduced |
| Etheral Ambient | Returns null (renders nothing) |
| Custom Cursor | Disabled |

### Mobile Animation Scaling — EXCELLENT
- GSAP durations: 30% shorter on mobile (factor 0.7)
- CSS motion variables: Reduced shift distances (8px vs 14px, 16px vs 28px)
- Route transition: 300ms vs 560ms desktop
- Stiffer springs, less travel distance

### CSS-Only Hero Reveal — EXCELLENT
Content animates via CSS keyframes at FCP, before JS hydrates. Hero heading (LCP element) appears immediately.

### Performance Concerns
- `will-change: transform, opacity` on ALL `[data-motion]` elements — Creates excessive GPU layers
- 3 continuous CSS keyframe animations (`satin-drift-1/2/3`) on etheral layers — 32-40s loops, always running

---

## 6. PWA

### CRITICAL: theme_color Mismatch
- `manifest.json`: `#8b5cf6` (purple)
- `layout.tsx meta`: `#050505` (near-black)

Users see jarring color change when PWA launches. **Align both to `#050505`.**

### PWA Icon Issues
- `/headshot.jpg` as 512px icon — headshot photo doesn't work at small sizes
- Maskable icon uses same headshot — face will be cropped by 80% safe zone
- **Create a dedicated icon** with "mm." brand mark or abstract logo

### Other PWA Issues
- Missing narrow-form (portrait) screenshot — Android needs both for rich install prompt
- No iOS splash screen assets
- `theme-color` should use Next.js 15 `viewport` export instead of `metadata.other`

---

## 7. Touch Target Issues

| Element | Current Size | Minimum | File |
|---------|-------------|---------|------|
| Modal close buttons | 32x32 | 44x44 | BookingModal.tsx, NewsletterModalDialog.tsx |
| Copy email button (booking success) | 28x28 | 44x44 | BookingModal.tsx |
| Article tag chips | ~30px height | 44px | components.css |
| Footer links | Text-only (~13px) | 44px tap area | components.css |

### Footer Dock Overlap
The mobile bottom dock (54px + 24px padding) may obscure the copyright bar and Privacy link at page bottom. Add extra `padding-bottom` to the footer on mobile.

---

## 8. Images

### Hero Headshot — GOOD
- WebP format, `priority` flag, responsive `sizes` attribute, `object-cover object-top`

### Logo Images — Could Improve
- Several PNG logos where SVG would be smaller and sharper
- `/boardy-logo.png` is 46 KB for a 56x56 display — should be under 5 KB

### PWA Manifest
- Uses `/headshot.jpg` for app icon — not suitable (see PWA section)

---

## Prioritized Fix List

### Critical
1. PWA `theme_color` mismatch — Align manifest.json and layout.tsx
2. Articles missing from mobile navigation dock
3. Google Font preload disabled for hero font (Cormorant Garamond)

### High
4. Modal close buttons below 44px minimum
5. Newsletter modal lacks full-screen mobile treatment
6. Footer links lack touch-target padding
7. Footer content obscured by mobile dock
8. Tag chips too small for touch

### Medium
9. Blanket `will-change` on all `[data-motion]` elements
10. PWA icons use headshot instead of purpose-designed icon
11. PWA manifest missing narrow-form screenshot
12. Article body text on mobile slightly below 16px
13. `theme-color` should use Next.js 15 `viewport` export
