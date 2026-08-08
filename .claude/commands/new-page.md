---
description: Create a new landing page under /lp/
---

Build a new standalone page. **Read the `design-system` and `editing-pages`
skills first.**

## 1. Ask, before writing anything

- What is the page for?
- The headline?
- What sections — logos, feature blocks, testimonials, a closing call to action?
- Where should the main button go — the demo modal, or somewhere else?
- **Should search engines index it?** Default is **no**, which is right for a
  campaign page.

## 2. The address

**`/lp/<slug>` and nowhere else.** Never a bare `/lp/`, never at the site root.

The root is the most dangerous space on the site — 96 addresses on the old
streamhatchet.com site sit directly there, and every one needs to keep working
after the move. `/lp/` was checked against all 2,935 of the old site's addresses
and is clear.

**Never `/campaigns/`** — that is a real, live page on the old site.

Check the slug does not collide with an existing route or a planned redirect
before using it.

## 3. Build it — arrangement only

Compose **only** from the freely-composable sections listed in
`components/sections/CLAUDE.md`: `PageHeader`, `CTASection`, `FeatureBlock`,
`LogoWall`, `MonitorMockup`, `TestimonialCarousel`, `HeroStatVisual`.

**Not `CircuitDivider`, and no other Signal graphic.** They are allowed only
where they already appear, and a new page is by definition somewhere new. The
design check enforces this with a file allowlist that does not include `/lp/`,
so adding one **fails the publish**. If the page needs a break between
sections, use spacing.

**No new components. No hand-written markup beyond arranging these.** If the
page needs something the set cannot express, that is a design question for Seb.

Rules that will otherwise bite:

- **`generateMetadata` is required** — title and description, plus
  `noIndex: true` unless they explicitly asked to be indexed.
- **Do not use `Hero`** — it is not in the set above. `PageHeader` is the
  header for a landing page. Give it a `secondaryCta` only if you have a real
  destination for it; there is no default, so leaving it off is safe.
- **`<CTASection>` always gets an explicit `title` and `body`.**
- **`PageHeader` never gets `surface="gradient"`** — white text on white.
- **`FeatureBlock` without an image renders a fake-metric placeholder.** Supply
  a real image or say clearly that a placeholder is showing.
- **No forms. No video.**

## 4. The sitemap is opt-in

New pages are **not** added to the sitemap automatically, and that is correct —
a campaign page usually should not be in one. If they do want it found, add the
path to the explicit `lpPaths` list in `app/sitemap.ts`.

**Never add it to `lib/config/nav.ts`** to get it listed — that file drives the
header, the footer _and_ the sitemap at once. Putting a campaign page in the
main navigation is a decision for Seb.

## 5. Finish

Build it to check it compiles, then show them the local link and describe what
is on it. Remind them it is not indexed unless they asked for it.
