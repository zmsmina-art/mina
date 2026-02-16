# Mina Mankarious Portfolio

Next.js 15 + TypeScript + Tailwind portfolio site with a royal editorial aesthetic — Cormorant Garamond display typography, warm gold accents, and cinematic scroll animations.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Architecture

- Source alias: `@/* -> src/*` (see `tsconfig.json`)
- Shared UI components: `src/components/ui`
- Utility helpers: `src/lib`

### Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `src/app/page.tsx` | Homepage with hero, services, authority, writing, contact sections |
| `/about` | `src/components/AboutPageClient.tsx` | Editorial bio page with stat cards and centered prose |
| `/articles` | `src/app/articles/page.tsx` | Article listing with card grid |
| `/articles/[slug]` | `src/components/ArticlePageClient.tsx` | Article detail with reading progress bar |

### Key Components

- `src/components/SiteNav.tsx` — Fixed nav with scroll indicator and active-section tracking
- `src/components/MotionRuntime.tsx` — IntersectionObserver-based scroll reveal system
- `src/components/ReadingProgress.tsx` — Article reading progress bar (portaled to body)
- `src/components/home/HomeHero.tsx` — Hero with wordmark reveal and command snapshot

## Design System

### Motion

Scroll-triggered animations use `data-motion` attributes with CSS transitions. The `MotionRuntime` component observes elements and adds `is-visible` to trigger entrance animations.

Motion variants: `rise`, `fade`, `sweep-left`, `sweep-right`, `h-sweep`, `spotlight`, `crest`, `flip`, `crescendo`, `footer-rise`, `wordmark`

Timing variables defined in `globals.css`:
- `--motion-xs` through `--motion-lg` (160ms–500ms)
- `--motion-shift-sm` through `--motion-shift-xl` (6px–44px)
- `--ease-royal` and `--ease-cinematic` cubic-bezier curves

### Glowing Border Hover Effect

A pointer-tracking border glow integrated across key cards.

**Core files:**
- `src/components/ui/glowing-effect.tsx`
- `src/components/ui/card-glow.tsx`
- `src/lib/utils.ts`

**Dependency:** `motion` (installed in `package.json`)

**Tuning:** Adjust `spread`, `proximity`, `inactiveZone`, `borderWidth` in `card-glow.tsx`. Adjust gradient colors, shadow intensity, and mask behavior in `glowing-effect.tsx`.

### Typography

- Display: Cormorant Garamond (nav, headings, stats)
- Brand mark: Playfair Display italic
- Body: System sans-serif stack
- Gold accent palette with warm brass and soft purple secondary
