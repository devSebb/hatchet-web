# Design Sync Notes

## process.env defines required in bundle

`lib/config/site.ts`, `lib/hubspot.ts`, and related files reference `process.env.NEXT_PUBLIC_*`.
These must be stubbed in `.ds-sync/lib/bundle.mjs` `sharedBuildOptions()` or the IIFE throws
`ReferenceError: process is not defined` at initialization and no components load.

Added to `sharedBuildOptions()` define block:
```
'process.env.NODE_ENV': '"development"',
'process.env.NEXT_PUBLIC_SITE_URL': 'undefined',
'process.env.NEXT_PUBLIC_APP_LOGIN_URL': 'undefined',
'process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID': 'undefined',
'process.env.NEXT_PUBLIC_HUBSPOT_BOOK_DEMO_FORM_ID': 'undefined',
'process.env.NEXT_PUBLIC_HUBSPOT_SIGN_UP_FORM_ID': 'undefined',
'process.env.NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID': 'undefined',
'process.env.NEXT_PUBLIC_HUBSPOT_GUIDE_FORM_ID': 'undefined',
```

When new `NEXT_PUBLIC_*` env vars are added to the codebase, add them here too.

## SVG tagName case (fixed in package-validate.mjs)

In HTML documents, SVG elements have lowercase `tagName` (`'svg'`), not uppercase `'SVG'`.
The `paints()` function was checking against uppercase only, causing all 18 icon SVG components
to be flagged `[RENDER_THIN]`. Fixed: both regex occurrences now use `/i` flag.

## Dark theme: text invisible on white capture background

The root theme is dark — `--foreground` is white. Components that rely on CSS variables for
text/icon color render invisibly on the capture page's white background.

Workaround for authored previews: wrap in a dark container:
- `<div className="bg-card ...">` — for components on dark cards
- `<div className="bg-bg">` — for full-width sections (LogoWall)
- `<div className="surface-paper ...">` — for components that use the light paper theme

## useHydratedReducedMotion race condition in package-capture.mjs

`HeroStatVisual` (and `Reveal`, `Stagger` etc.) use a custom hook `useHydratedReducedMotion()`
that returns `false` on the first render, then returns `useReducedMotion()` after a
`requestAnimationFrame` fires. This causes an unavoidable two-render cycle:

- First render: `reduce=false` → framer-motion applies `initial={{ opacity: 0, scaleY: 0 }}`
- After RAF: `reduce=true` → component re-renders, but framer-motion KEEPS its prior animated
  state unless a `whileInView` or `animate` target triggers a transition to the final state.

**Do NOT use `reducedMotion: 'reduce'` in `browser.newPage()`** — it causes the RAF to fire
`reduce=true` before IntersectionObserver fires `whileInView`, leaving animated elements stuck
at `{ opacity: 0, scaleY: 0 }`.

**Use a 1200ms settle wait instead** (covers the longest stagger chain: ~985ms for HeroStatVisual
bars at `staggerChildren: 0.045` × 13 bars + `MOTION_DURATION.base`).

## Counter preview: cardMode column override needed

Counter's authored stories each render one large number. In the default grid layout the cells
are wider than they are tall, which triggers `[GRID_OVERFLOW]`. Added to config:
```json
"overrides": { "Counter": { "cardMode": "column" } }
```

## LogoWall: image logos don't resolve outside Next.js

`LogoWall` accepts an `images` prop pointing to paths under `/public/`. These paths don't
resolve in the esbuild IIFE capture environment. Previews use text-only `logos` array
(`{ name: "Riot Games" }` etc.) instead.

## Re-sync risks

- Adding new `NEXT_PUBLIC_*` env vars → add to define block in `.ds-sync/lib/bundle.mjs`
- New animated components using `useHydratedReducedMotion` → may need the settle wait
  increased beyond 1200ms if stagger chains are longer
- `compiled-globals.css` must be regenerated from `global.css` after Tailwind token changes
