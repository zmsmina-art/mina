# Mina Mankarious Portfolio

Next.js 15 + TypeScript + Tailwind portfolio site.

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

## UI Structure

- Source alias: `@/* -> src/*` (see `tsconfig.json`)
- Shared UI components: `src/components/ui`
- Utility helpers: `src/lib`

## Glowing Border Hover Effect

A subtle pointer-tracking border glow is integrated across key cards.

### Core files

- `src/components/ui/glowing-effect.tsx`
- `src/components/ui/card-glow.tsx`
- `src/lib/utils.ts`

### Dependency

- `motion` (installed in `package.json`)

### Integrated sections

- `src/components/ArticleCard.tsx`
- `src/components/ArticlePageClient.tsx`
- `src/components/home/AuthoritySection.tsx`
- `src/components/home/ServiceSection.tsx`
- `src/components/home/WorkSection.tsx`
- `src/components/home/EducationSection.tsx`
- `src/components/home/WritingSection.tsx`
- `src/components/home/HomeHero.tsx`
- `src/components/home/ContactSection.tsx`

### Tuning glow behavior

Adjust defaults in `src/components/ui/card-glow.tsx`:

- `spread`
- `proximity`
- `inactiveZone`
- `borderWidth`

Adjust rendering details in `src/components/ui/glowing-effect.tsx`:

- gradient colors
- shadow intensity
- movement duration
- mask behavior
