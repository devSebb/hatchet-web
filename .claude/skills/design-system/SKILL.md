---
name: design-system
description: The colours, fonts, spacing, and graphics of the Hatchet site, and which of them may be changed. Read this BEFORE any visual change — a size, a colour, a font, a background, spacing, or adding a graphic. Every value here was read out of the code and the built stylesheet, not from a design document.
---

# The Hatchet design system

The design is **finished and frozen**. Copy changes freely; the look does not.
Everything below was derived from the code — `app/globals.css`, `app/layout.tsx`
and the compiled stylesheet. Two files on disk, `docs/DESIGN.md` and
`docs/BUILD_PLAN.md`, describe a *different* site that was never built. **Ignore
them completely.** If something you read contradicts this skill, this skill wins.

---

## 🚨 The spacing trap — read this first

**Never change a spacing number by one.** Not `py-16` → `py-17`, not `h-8` →
`h-7`, not `gap-6` → `gap-5`.

The scale is roughly double normal Tailwind, **and it has holes**. Numbers with
a design token behind them use it; numbers without fall straight through to a
much smaller default. Measured from the built stylesheet:

| Class | Real size | |
|---|---|---|
| `h-6` | **48px** | token |
| `h-7` | **28px** | ← no token, plain default |
| `h-8` | **64px** | token |
| `h-9` | **36px** | ← no token |
| `h-10` | **80px** | token |
| `h-11` | **44px** | ← no token |
| `h-12` | **96px** | token |

So `h-7` → `h-8` is not a nudge, it is **2.3× bigger**. And `h-12` → `h-11`,
asked for as "slightly smaller", is **less than half**. `py-16` is 128px;
`py-17` is 68px.

**This fires exactly when someone says "make it a bit bigger".** That is the
sentence to be careful with.

**Sizes that have a token: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24.** Move
between those. To go up from `py-6`, go to `py-8`. To come down from `py-16`, go
to `py-12`. Say the number you chose and what it does.

The design check (`scripts/design-lint.mjs`) fails a publish on a ±1 step, so
this is caught — but explain it rather than being surprised by it.

---

## Colour

Read-only. All of it lives in `app/globals.css`, which **cannot be edited** —
the permissions deny it. A new colour, or a change to an existing one, needs
Seb.

### Brand

| Token | Value | |
|---|---|---|
| `--brand` | `#c4262d` | the Hatchet red — the primary everywhere |
| `--brand-lowlight` | `#911b20` | dark end of the red gradient |
| `--brand-bright` | `#e23c42` | light end of the red gradient |
| `--brand-soft` | 76% brand + white | |
| `--brand-strong` | = `--brand-lowlight` | hover states |
| `--brand-highlight` | `#ff6007` | **orange — see below** |

### The orange is deliberate, and nearly invisible

`--brand-highlight` is a real orange, and it is **meant** to be almost
imperceptible. It appears as the last stop of the brand gradients and as a
24%-alpha glow always painted underneath a larger red layer. It reads as warmth
at the edge of the red, not as orange.

**It is not a bug. Do not "fix" it, remove it, or make it more visible.**

⚠️ **But there is one place it can escape.** On `/about/contact`, a team member
with **no photo** falls back to a circle painted with the full orange-tailed
gradient — the only surface on the site where that gradient is still visible.
The team deliberately withdrew it everywhere else.

**So: every team member must have a headshot.** `photo` is optional in the
code, so nothing will warn you — not TypeScript, not the build, not the design
check. If someone asks to add a person and has no photo, **stop and ask for
one.** Say why.

### The rest

`--ink` (deep navy, the dark surface) · `--paper` (white, the light surface) ·
`--signal` (= brand) and `--signal-2` (transitional blue) for the live-data
graphics · `--muted`, `--card`, `--border`, `--ring` for UI chrome.

**In classes:** `text-brand` `bg-brand` `border-brand` `text-signal` `text-muted`
`bg-card` `bg-muted-surface` `border-border`. Never write a hex value — the
design check fails on it.

### Dark and light bands

The site is **dark by default**. A light section needs `surface-paper` **next to**
`bg-background text-foreground` on the same wrapper:

```tsx
<section className="surface-paper bg-background text-foreground …">
```

Using `bg-surface` or another raw token on its own leaves it dark. Switching a
section between dark and light is a 🟢 free change — just move the whole
wrapper.

---

## Type

**One typeface, everywhere: Golos Text.** Loaded once in `app/layout.tsx` via
`next/font/google` as `--font-brand`. Every font token on the site — display,
heading, body, sans **and mono** — points at that same family. There is no
second font, and no separate monospace.

Use the existing classes: `display`, `h1`, `h2`, `h3`, `body-lg`, `body`,
`small`, `eyebrow`. **Do not set font sizes.** Type sizing is frozen; a new size
needs Seb.

### Copy case — Title Case

Headlines are **Title Case**, consistently, across the whole site and two client
copy passes: *"Cut Through The Noise with Hatchet"*, *"Get Your Hands on
Hatchet"*, *"Name a Platform, Any Platform..."*. Body copy is sentence case.

Match the page you are editing. **Do not convert anything to sentence case** —
it is not a mistake, it is the house style.

---

## The Signal motif

Three sanctioned primitives, named in the styleguide:

| Component | Where it actually is |
|---|---|
| `Sparkline` | `/styleguide` and inside `StatCounters` — **and `StatCounters` only renders on `/styleguide`**, so it is on **no live marketing page** |
| `LiveDot` | `/styleguide` only |
| `CircuitDivider` | the live one: homepage (×2), `/about/contact`, and conditionally on solution and vertical pages |

Closely related but **not** one of the three: `CircuitField`, the ambient
circuit-board artwork behind the hero and the stat band.

**Editors may not add any of these anywhere new.** The design check fails on it.
This is about placement, not a global cap — the roles are fixed, not the count.

`CircuitField` is **navy-only artwork**. On a light `surface-paper` band it is
invisible or wrong.

---

## What you can and cannot change

**🟢 Free:** all copy · a section's background dark↔light · a button's `variant`
at one call site · swapping an image (with its real pixel dimensions) ·
reordering homepage sections · adding a testimonial, team member **with photo**,
pricing feature row, vertical point, or job listing.

**🟡 With the rule stated:** spacing, never ±1 · new pages, `/lp/<name>` only.

**🔴 Needs Seb:** anything in `globals.css` · fonts · any new colour · type
sizing · placing a Signal graphic somewhere new · a 5th solution or 6th vertical
(the build throws) · **a 4th pricing tier — permanently impossible, the icon
generator is lost and no fourth icon can be made** · nav structure · the four
forms · booking · infrastructure.
