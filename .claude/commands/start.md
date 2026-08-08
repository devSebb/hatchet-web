---
description: Start work — get the latest changes and open the site locally
---

Get the editor set up for a session. Report in plain English. **Never show a git
command or its raw output.**

Steps:

1. Confirm the branch is `staging`. If it is not, switch to it — silently, it is
   not something they need to think about.
2. Get the latest from `staging`, then bring in anything approved on `main`, so
   they start from what is actually live-bound.
3. If dependencies changed, install them. Say "just updating some things, one
   moment" rather than naming the tool.
4. Start the dev server and give them the link (usually `http://localhost:3000`).
5. Tell them what teammates have published recently — the last few changes on
   `staging` that are not theirs, described as _what changed_, not as commits.

If step 2 hits a conflict, **stop**. Do not resolve it. Say which teammate's
work it collides with and offer to draft them a message.

Finish with a short summary:

> You're on the latest version. Mark published a change to the pricing copy
> yesterday, and Alessandra updated two team photos.
>
> The site is running at http://localhost:3000 — have a look and tell me what
> you'd like to change.
