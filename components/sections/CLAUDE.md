# Section components

You are in the shared section library. **A file here can appear on many pages.**
Before changing one, check whether the change belongs on one page instead — it
usually does, as a prop at the call site.

## Composability — verified, not guessed

### ✅ Free to use on a new page

| Component             | The one thing to get right                                   |
| --------------------- | ------------------------------------------------------------ |
| `PageHeader`          | Omit `surface`, or pass `"default"`. **Never `"gradient"`**  |
| `CTASection`          | Always pass **both** `title` and `body`                      |
| `FeatureBlock`        | Pass `media`, or it renders a fake-metric placeholder        |
| `LogoWall`            | Wrap it for background; the default logos are real customers |
| `CircuitDivider`      | Stagger `pulseDelaySeconds` if you use more than one         |
| `MonitorMockup`       | Needs the image's real `width`/`height`                      |
| `TestimonialCarousel` | Needs a wrapper for padding and background                   |
| `HeroStatVisual`      | Decorative only                                              |

### ⚠️ Usable, with a constraint that will bite

| Component          | Constraint                                                                                                                                                                                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Hero`             | `surface="gradient"` **needs** a parent with `backgroundImage: var(--hero-gradient)`, or it is white text on white. Pass `image` or `video` or the media slot is empty. **Its default `secondaryCta` is `signUpUrl`, which is a 404** — set it or omit it. |
| `StatCounters`     | Renders `CircuitField`. **Navy backgrounds only.** Grid assumes 4 stats                                                                                                                                                                                    |
| `CircuitField`     | Needs a `relative isolate overflow-hidden` parent. Navy only — invisible on a light band                                                                                                                                                                   |
| `BlogCarousel`     | Needs `posts` from `await content.getPosts()`; the page must be `async`. **Renders nothing if the list is empty**                                                                                                                                          |
| `ContactForm`      | Looks fine, **submits nowhere**. Never put it on a page that promises a reply                                                                                                                                                                              |
| `CreatorLifecycle` | Headline is hardcoded. Owns `id="how-it-works"` — **duplicating it breaks the solutions cross-sell link**                                                                                                                                                  |
| `HeroVideo`        | Needs a valid _public_ Mux playback ID. A wrong one fails silently                                                                                                                                                                                         |

### ❌ Not reusable — these are their pages

`WhyHatchetPoints` (it _is_ `/why-hatchet`), `ComparisonTable` (owns
`id="comparison"`, fixed geometry), `CreatorLifecycleOrbital` /
`LifecycleStationsRow` (fixed 4-station geometry, hardwired to the four
solution pages), `LegalPage` (renders its own `<main>` — a page, not a section).

## Things that render nothing, silently

`BlogCarousel` with no posts · `Pagination` with one page · `Hero` with no image
and no video · `WhyHatchetPoints` has two internal null paths. If a section
"disappeared", this is usually why — not a bug you introduced.

## Copy that lives in here rather than on a page

- `CTASection.tsx` — a `DEFAULT_BODY` still used by one unmounted caller. Every
  live page now passes its own `body`. **Do not edit the default to change a
  page** — change that page's prop.
- `CreatorLifecycle` — the "How Hatchet Works" headline.
- `LogoWall.tsx` — the seven customer logos.
- `TestimonialCarousel.tsx` — four fallback testimonials.
- `ComparisonTable.tsx` — the whole competitor matrix (8 rows).

`WhyHatchetPoints`'s copy is **not** here any more — it is in
`lib/config/why-hatchet.ts`.

## Never

Add a `Sparkline`, `LiveDot`, `CircuitDivider` or `CircuitField` to a place it
does not already appear. Add a colour, a font, or a font size. Change spacing by
±1. All four fail the design check, and the first three need Seb anyway.
