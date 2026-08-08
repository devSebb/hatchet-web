---
name: troubleshooting
description: What to do when a publish fails, when the staging site looks wrong, or when something needs undoing. Read this when a check fails, an error appears, the site will not build, or the editor wants to go back to how things were.
---

# When something goes wrong

**Nothing an editor does can break the live site.** Everything goes to a private
staging site first, and a failed check means _nothing was published at all_.
Lead with that — it is true, and it is the thing they are worried about.

## When a check fails during `/publish`

Say which check failed, in plain words, and what you are doing about it. Never
paste a raw error.

| Check            | What it means                                                                                | What to do                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Type check**   | Something refers to a name that no longer exists — usually a renamed or deleted bit of code. | Fix it. It is nearly always the last edit.                                                        |
| **Lint**         | A code-quality rule.                                                                         | Fix it.                                                                                           |
| **Design check** | A change would alter how the site looks.                                                     | Read what it says — it names the file and the fix. Usually a spacing ±1 or a hand-written colour. |
| **Formatting**   | Spacing or quotes in the code.                                                               | Run `pnpm format`. Never a real problem.                                                          |
| **Build**        | The site could not be assembled.                                                             | See below.                                                                                        |

### The build error worth recognising

```
[solutions:<slug>] crossSell.link.phrase "…" is not present in crossSell.body.
```

**In English:** on one of the four solution pages, the closing paragraph
contains a sentence that is meant to become a link. The linked words must appear
in that paragraph **exactly**. Someone edited the paragraph and the phrase no
longer appears in it, so the link has nothing to attach to.

**The fix:** either put the phrase back into the paragraph word for word, or
update the phrase to match the new wording. The current phrase is _"Check out
our other Solutions pages"_.

This is the only error of its kind, and it is a **good** one — it stops the
build rather than shipping a broken page.

### Other build failures

Usually a typo in code rather than copy — a missing bracket or quote from an
edit that went wrong. Look at what changed most recently. If it is not obvious
within a couple of attempts, **stop and message Seb** rather than making more
changes on top.

## When staging looks wrong

Work down this list:

1. **Is it actually the new version?** A staging deploy takes 3–5 minutes.
   Reload with a hard refresh.
2. **A section vanished.** Several sections render _nothing_ rather than
   erroring when they have no content — the blog carousel with no posts, a hero
   with no image or video. Check the content is there.
3. **Text is invisible, white on white.** A section is using the gradient
   surface without the gradient behind it, or a navy-only graphic is on a light
   band. Revert that change and tell Seb.
4. **Something is far too big or too small.** A spacing number was changed by
   one. See the `design-system` skill — `py-16` is 128px, `py-17` is 68px.
5. **A picture is stretched, or the page jumps as it loads.** The width and
   height on the image do not match the real file.
6. **Icons replaced by numbers.** A sixth vertical, or a fourth point on a
   vertical, was added. Only three icons exist per vertical. Needs Seb.
7. **The video never plays.** The playback ID is wrong. Needs Seb — see
   `content-and-cms`.
8. **Orange circles on the contact page.** Someone was added without a photo.
   Get the photo.

## `/undo` or `/reset`?

**`/undo`** — "the last thing I published was wrong." Reverses the most recent
publish and puts the previous version back on staging. Everything before it is
kept. **Use this by default.**

**`/reset`** — "throw away everything I've done since my last publish and start
again from what's on staging." It **destroys unpublished work permanently**.
Always confirm, and say plainly what will be lost.

Neither touches the live site.

## When to stop and message Seb

Stop. Do not keep trying:

- The same check fails twice after you have tried to fix it
- A fix would mean changing something in the 🔴 list
- Two editors' changes have collided (`/publish` will say so) — **never merge
  someone else's work for them**
- Anything about the live site, the domain, or infrastructure
- Anything you are not confident about

Offer to draft the message, and include what they were trying to do, what
happened, and what you already tried.
