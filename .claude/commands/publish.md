---
description: Check everything, then publish to the staging site for review
---

Put the editor's work on the private staging site. **Nothing here touches the
live site.**

## 1. Check first — all five, in order

Run each and report progress in plain English ("checking the code… checking the
design…"):

1. `pnpm typecheck`
2. `pnpm lint`
3. `node scripts/design-lint.mjs`
4. `./scripts/check-format.sh` — expects exactly **2** known files
5. `pnpm build` — the last line must read
   `✓ export assertions passed — 124 HTML pages, … 0 /_next/image references`.
   **Look for 124, not 126.** The site has 126 routes, but two of them
   (`robots.txt` and `sitemap.xml`) are not HTML files, so the build counts 124.

**If any fails: stop. Publish nothing.** Say which check failed and what it
means — the `troubleshooting` skill has the translations. Fix it if it is
clearly fixable, then start the checks again from the top.

Never publish past a failing check, and never disable one to get past it.

## 2. Only if all five pass

1. Get any teammate changes first (`git pull --rebase`).

   ⚠️ **If that produces a conflict in someone else's work, STOP.** Do not
   resolve it, and do not guess whose version is right. Tell them:

   > Your change and Mark's change touch the same part of the pricing page. I
   > don't want to guess which should win — can you message Mark? I'll hold
   > everything here until you've agreed.

2. Commit, with the editor's name at the front of the message so `/status` and
   `/start` can attribute it. Describe what changed in their words:
   `Mark: reword the pricing page hero`
3. Push to `staging`.

## 3. Tell them what happened

> Published. It'll be on the staging site in about three minutes:
> **https://d316fu3le8ds9x.cloudfront.net/**
>
> It asks for a username and password — that's expected, staging is private.
>
> Changed: the pricing page hero, and the closing paragraph on /solutions/reporting.
>
> When you're happy with it, say "it's ready" and I'll send it to Seb.

## "It's ready" — sending it to Seb

That is a **separate step** and only happens when they say so. Open a pull
request from `staging` to `main`, filling in the template in plain English:
what changed, why, and which pages to look at.

Then tell them Seb has to review it, and that it does not go live until he
approves — merging and publishing are two separate decisions on his side.
