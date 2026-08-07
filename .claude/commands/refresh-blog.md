---
description: Pull the latest blog posts and reports from WordPress onto staging
---

Bring WordPress content into the site. **Read `content-and-cms` first.**

New posts do not appear on their own — content is baked in when the site is
built, so it needs a sync and a publish.

## 1. Set expectations

> This takes about five minutes. Most of it is checking that every picture in
> every post still exists.

## 2. Sync

Run `pnpm sync:wp`.

**Note:** the script is in a locked folder, so you may not be able to run it. If
so, say plainly that Seb needs to run the sync, and offer to write the note.

## 3. Report what actually changed

Compare before and after, and describe it as content:

> Pulled in 2 new posts:
>   • "Twitch viewership in Q3 2026"
>   • "What the Kick deal means for creators"
> One existing post was updated — the Q2 trends piece.

If nothing changed, say so. Do not publish for the sake of it.

## 4. Verify, then publish

Run the full `/publish` check sequence. Two things matter especially:

- **The build must still report 126 pages.** A different number means posts were
  added or removed — say which, and confirm that is expected.
- **A missing image will fail the build.** If a picture was deleted in
  WordPress, the sync notices. Say which post, so Mark can fix it there.

Then publish to staging as normal and give them the link.

## Remember

Article text is **never** edited here. If a post reads wrong, it is wrong in
WordPress. And "Stream Hatchet" is silently rewritten to "Hatchet" on the way
in — if a post deliberately uses the old name, that needs Seb.
