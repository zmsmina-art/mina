# Mina Mankarious Portfolio

Next.js 15 + TypeScript + Tailwind portfolio with a royal editorial interface and a unified black/white/purple theme.

## Current Theme Direction

- Primary surface: black/charcoal
- Primary text: white
- Accent system: purple glow and white highlights
- Shared style tokens: `src/app/globals.css`

This palette is applied across:

- Homepage (`/`)
- About (`/about`)
- Articles list (`/articles`)
- Article detail (`/articles/[slug]`)
- 404 state
- Fan controller simulator (`/fan-controller/`)

## Local Development

```bash
npm install
npm run dev
```

Default local URL:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Key Features

- Unified royal black/white/purple visual system
- Route and section motion with `data-motion` + `MotionRuntime`
- Reading progress bar on article list and detail
- Homepage mini fan simulator preview with engine temp slider, fan speed (RPM) readout, and safety glow behavior
- Full static fan-controller simulator app under `public/fan-controller/`

## Project Structure

```text
src/
  app/
    page.tsx
    about/page.tsx
    articles/page.tsx
    articles/[slug]/page.tsx
    fan-controller/page.tsx   -> redirects to /fan-controller/index.html
    globals.css
  components/
    home/
    ui/
    FanControllerMiniPreview.tsx
    ReadingProgress.tsx

public/
  fan-controller/
    index.html
    css/
    js/
```

## Fan Controller App

The full simulator is a static app served from:

```text
public/fan-controller/index.html
```

It includes:

- ECU/CAN simulation
- PWM and ADC visualization
- Mode controls (AUTO / MANUAL / SAFETY)
- Keypad and LCD simulation

Theme-only updates were applied to simulator CSS and visual color constants in chart/diagram components. Functional simulation logic was not changed.

## Validation Checklist

Before pushing:

```bash
npm run lint
npm run build
```

Both commands should complete successfully (existing warnings may still appear).
