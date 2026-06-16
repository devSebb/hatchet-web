# Hatchet Marketing Website

Hatchet is the public marketing site foundation for a rebrand and redesign of the existing Stream Hatchet web presence. The site explains Hatchet as a gaming, esports, creator, and live-streaming analytics company for brands, game publishers, market research agencies, and esports teams.

## Scope

This repository is the marketing website only. The product app, rankings pages, reports product, live data widgets, auth, dashboards, and anything behind login live in other systems and should be linked out to rather than rebuilt here.

The scaffold currently includes:

- Next 16 App Router, React 19, TypeScript strict, Tailwind v4, shadcn/ui, Framer Motion, Embla, and lucide-react.
- Hatchet design tokens, global layout, motion primitives, Signal motif components, section shells, homepage, marketing routes, resources/blog routes, SEO scaffolding, and HubSpot form shells.
- A typed content adapter with the mock provider live and the WordPress provider stubbed for a later WPGraphQL phase.

## Run Locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

Useful checks:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm format:check
pnpm build
```

`pnpm build` uses `next/font/google`, so local or CI builds need network access to fetch the configured Google Fonts unless Next has already cached them.

## Environment

Copy `.env.example` to `.env.local` and fill values as needed:

```bash
CONTENT_SOURCE=mock
WORDPRESS_GRAPHQL_URL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=
NEXT_PUBLIC_HUBSPOT_BOOK_DEMO_FORM_ID=
NEXT_PUBLIC_HUBSPOT_SIGN_UP_FORM_ID=
NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID=
NEXT_PUBLIC_HUBSPOT_GUIDE_FORM_ID=
NEXT_PUBLIC_APP_LOGIN_URL=https://app.streamhatchet.com
```

No secrets should be committed. The HubSpot variables are public IDs only; real form submissions are intentionally not implemented in this phase.

## Content Adapter

All content-driven routes read through `lib/content/index.ts`:

```ts
export const content =
  process.env.CONTENT_SOURCE === "wordpress" ? wordpressProvider : mockProvider;
```

The mock provider returns local fixtures for posts, customer stories, guides, and press. Routes should never import fixtures directly.

The WordPress provider is intentionally stubbed. In a later phase it will call WPGraphQL, normalize the legacy brand language on the way out, and return the same `ContentProvider` interfaces. The current `normalizeBrand()` helper replaces `Stream Hatchet` with `Hatchet` for rendered HTML while skipping lowercase URL strings such as `streamhatchet.com`.

## SEO And Forms

Metadata is centralized through `lib/seo.ts` and `lib/config/site.ts`. Every route exports `generateMetadata`, and `app/sitemap.ts` combines static routes with content adapter slugs. `app/robots.ts` allows indexing, points to the sitemap, and disallows `/styleguide`; the styleguide route is also marked `noindex`.

`components/forms/HubSpotForm.tsx` is the single HubSpot shell. It reads the public portal and form ID variables, renders a tokenized form surface, and uses `type="button"` so no real submission happens. The footer newsletter, CTA sections, and gated guide shell all use this component.

## Deployment

The app is Vercel-ready. `next.config.ts` includes an empty `redirects()` array for the future migration table.
