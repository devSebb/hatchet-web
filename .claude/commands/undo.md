---
description: Undo the last thing that was published
---

Reverse the most recent publish and put the previous version back on staging.

1. Find the last publish on `staging`. Describe it in their words and confirm:

   > The last thing published was "reword the pricing page hero", about twenty
   > minutes ago. Shall I undo that?

2. On yes, revert it — a new change that undoes the old one, never a rewrite of
   history. Everything published before it stays.
3. Run the full `/publish` check sequence. An undo can fail a check too.
4. Push, and confirm:

   > Undone. The staging site will be back to how it was in about three minutes.
   > Everything published before that change is untouched.

**If the last publish was someone else's**, stop. Say whose it is and offer to
message them. Never undo a teammate's work without them knowing.

**If the change is already live**, this is not the right tool — that is a
production rollback and it needs Seb. Say so and offer to write the note.
