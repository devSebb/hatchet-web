---
name: content-and-cms
description: Blog posts, reports, press items, customer stories, images and video. Read this BEFORE anything involving article content, the blog, guides, the media library, or the homepage video — especially before writing any article text into the code, which is always wrong.
---

# Content, images and video

## Articles come from WordPress. Never write them here.

Blog posts, reports/guides, press items and customer stories are authored by
**Mark in WordPress** and pulled into the site by a sync script. They live in
`lib/content/generated/*.json`, which is **generated output** — locked, and
overwritten by the next sync.

> **🚫 Never write, edit or fix an article, blog post, report or press item in
> the code.** If the text is wrong, it is wrong in WordPress. Any edit made here
> is silently destroyed the next time anyone syncs.

**If someone asks you to change a blog post:** tell them it is edited in
WordPress, and offer to pull the latest version once they have saved it there.

### Getting new content onto staging

Use **`/refresh-blog`**. It runs the sync, checks the site still builds, and
publishes to staging. It takes about five minutes, mostly spent verifying that
every image still exists on the WordPress server.

New posts do **not** appear on their own. Nothing is fetched when a visitor
loads the page — the content is baked in when the site is built. A post
published in WordPress is invisible until someone runs `/refresh-blog`.

### ⚠️ "Stream Hatchet" is silently rewritten

A function called `normalizeBrand` rewrites **"Stream Hatchet" → "Hatchet"**
everywhere content is rendered. There is no warning.

That is right during the rebrand, and wrong in one case: **a deliberate
historical or legal reference to the old company name cannot be published.** It
will be changed on the way out and nobody will be told.

If someone needs the legacy name to survive — a legal line, a press quote, a
company-history sentence — **that needs Seb.** Say so rather than trying again.

## Images

**Article images** live in the WordPress media library. Mark adds them there;
they arrive with the sync.

**Site images** (product shots, team photos, logos) live in `public/`. To swap
one:

1. The new file goes in the same folder.
2. **Give the real pixel width and height.** This is not optional — the numbers
   in the code set the space the browser reserves. Wrong numbers mean a
   stretched picture, or the page jumping as it loads. Nothing warns you.
3. Never use a plain `<img>` tag. Always `next/image` — it produces the smaller
   versions phones need. The design check fails on `<img>`.

If you do not know an image's real dimensions, **ask** rather than guessing.

## Video — escalate

There is exactly one video: the homepage hero clip, hosted on **Mux**.

**Editors cannot swap it.** It needs a Mux dashboard login with billing, and the
upload produces two different identifiers — a *playback ID* and an *asset ID*.
Using the asset ID by mistake gives a video that **silently never plays**: the
poster image shows, nothing happens, and no check anywhere can detect it. Not
the build, not the type check, not the design check. Someone has to watch the
page.

**Any request to change the video goes to Seb.** Offer to write the note.

**What they *can* change is the poster** — the still image shown before it
plays. That is a normal image swap, and it fails visibly if it is wrong.

## The four forms are frozen

Book a Demo, the footer newsletter, the contact form, and the gated-report
forms are all **locked pending a HubSpot integration**. Do not edit them, do not
"fix" them, do not remove the `TODO(hubspot)` comments — those are deliberate
markers.

Two things to know if asked:

- **The contact form says "Message received" but sends nothing.** It is not
  wired to anything yet. If someone is worried about missed enquiries, that is a
  real concern worth raising with Seb — not something to fix here.
- **A demo request currently reaches nobody.** Same situation, same answer.
