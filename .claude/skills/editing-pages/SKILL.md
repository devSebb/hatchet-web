---
name: editing-pages
description: Where the words for every page physically live, how hard each page is to edit, and which files are shared between pages. Read this BEFORE editing any copy, so you change the right file and know whether the change lands on one page or several.
---

# Where the copy lives

The words for a page are often **not** in that page's file. Check here first.

## Page by page

| Page                                                     | Where the copy is                                                                                                                                                  | How hard                           |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `/`                                                      | `app/page.tsx` — ~85% is right there: hero, pillars, why-hatchet reasons, use cases, testimonials, plans, CTA                                                      | **Medium**                         |
| `/pricing`                                               | `app/pricing/page.tsx` — `PLANS` and `MODULE_ROWS` arrays at the top                                                                                               | **Easy**                           |
| `/about`                                                 | `app/about/page.tsx` — `storyStats`, `values`, inline prose                                                                                                        | **Easy**                           |
| `/about/careers`                                         | headings on the page; **the three jobs are `careersOpenings` in `lib/config/marketing.ts`**                                                                        | **Easy**                           |
| `/about/contact`                                         | `app/about/contact/page.tsx` — prose inline, `salesTeam` roster (11 people)                                                                                        | **Easy**                           |
| `/solutions/*` (4)                                       | **`lib/config/solutions.ts`** — the page file has zero copy                                                                                                        | **Easy, once you know**            |
| `/who-we-serve/*` (5)                                    | **`lib/config/marketing.ts`**, the `verticals` array                                                                                                               | **Easy, same shape**               |
| `/why-hatchet`                                           | **`lib/config/why-hatchet.ts`** (points + platforms) and `components/sections/ComparisonTable.tsx` (the matrix). The page file has only the header and closing CTA | **Was the hardest page; now fine** |
| `/blog`                                                  | page-level copy inline; the posts are WordPress                                                                                                                    | **Medium**                         |
| `/resources/guides`                                      | header + `SHELF_COPY` on the page; reports are WordPress                                                                                                           | **Medium**                         |
| `/resources/customer-stories`, `/resources/press`        | headers and empty states inline; cards are WordPress                                                                                                               | **Medium**                         |
| `/privacy-policy`, `/terms-of-service`, `/cookie-policy` | `lib/config/legal.ts` — **locked. Legal text needs Seb.**                                                                                                          | **Denied**                         |

## ⚠️ Files that feed more than one page

Say so out loud before editing these. This is the mistake that is hardest to
notice afterwards.

| File                                         | Feeds                          | What happens                                                      |
| -------------------------------------------- | ------------------------------ | ----------------------------------------------------------------- |
| `lib/config/solutions.ts`                    | **4 solution pages**           | You are editing one of four. Name which.                          |
| `lib/config/marketing.ts`                    | **5 vertical pages** + careers | Same — one of five.                                               |
| `components/sections/*`                      | many pages                     | See `components/sections/CLAUDE.md`                               |
| `components/layout/Header.tsx`, `Footer.tsx` | **every page**                 | **Editable — but nav structure is 🔴.** Escalate rather than edit |
| `lib/config/nav.ts`                          | header **+ footer + sitemap**  | Locked. Nav changes need Seb                                      |

## The one edit that breaks the build

`lib/config/solutions.ts` has a **cross-sell invariant**. Each solution's
`crossSell.link.phrase` must appear **word for word** inside its
`crossSell.body`, because the link is rendered by splitting the body on that
phrase. If you edit the body and the phrase falls out of it, the whole site
fails to build with:

```
[solutions:<slug>] crossSell.link.phrase "…" is not present in crossSell.body.
```

Current phrase: **"Check out our other Solutions pages"**.

**If you edit that paragraph, edit the phrase to match, or keep the phrase
intact.** This is the only error of its kind — and it is the good kind, because
it fails loudly before anything ships.

## Counts that are load-bearing

Adding one more of these breaks a layout rather than reflowing it:

- **Pricing tiers: exactly 3.** A fourth breaks the grid, desyncs the comparison
  table, and needs an icon that **cannot be made**. Permanently refused.
- **Solutions: exactly 4.** The slug type is closed and the orbital graphic has
  four fixed stations. Refuse.
- **Verticals: 5.** A sixth renders **numbers instead of icons** — no error.
  Refuse and escalate.
- **Points per vertical: 3.** A fourth renders a number instead of an icon.
- **Lifecycle stages: 4.** Fixed geometry. Refuse.
- **Homepage pillars: 3.** A fourth gives a lopsided 3+1 row.
- **Team members: any number, but every one needs a photo** (see
  `design-system`).

Safe to add to: testimonials, comparison-table rows, use cases, why-hatchet
reasons, job listings, logo wall, platform roster.

## Links that break silently

Nothing checks these. If you rename or remove a section, the link that pointed
at it just stops working — no error, no failed check:

- `#comparison` — `/why-hatchet` header button → `ComparisonTable`
- `#how-it-works` — solutions cross-sell → `CreatorLifecycle` on the homepage
- `#contact-form` — `/about/contact` and the footer → `ContactForm`

## Before you edit

1. Find the file in the table above — **not** the page file, unless it says so.
2. If the file feeds several pages, say which page the change will land on, and
   that the others share it.
3. Keep Title Case in headlines.
4. After editing, say what changed and which pages show it.
