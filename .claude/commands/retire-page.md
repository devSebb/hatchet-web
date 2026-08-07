---
description: Retire a landing page without breaking links to it
---

Take an `/lp/*` page out of use.

## 🚫 Never delete the file

The address is in emails, ads, and other people's links. Deleting the page turns
every one of those into a dead end, and nobody finds out except the person who
clicked.

**Retiring means redirecting.** The old address keeps working and sends people
somewhere sensible.

## Steps

1. **Ask where it should send people.** Usually the closest live page — the
   homepage, a solution page, or pricing. Never leave it pointing at nothing.
2. Confirm what they mean:
   > This will make /lp/summer-campaign send people to /pricing/ instead.
   > Anyone with the old link still gets somewhere useful. The page itself stays
   > in place so it can be brought back.
3. **The redirect itself lives in `infra/cloudfront-viewer-request.js`, which is
   locked.** You cannot edit it. Prepare the change and hand it to Seb:
   > I can't add the redirect myself — that's in the delivery configuration.
   > Here's exactly what Seb needs to add:
   >
   >     "/lp/summer-campaign/": "/pricing/"
   >
   > Shall I send him that?
4. Set `noIndex: true` on the page so it drops out of search results.
5. Leave the page file where it is.

If they insist on deleting it, say once more what breaks, and escalate.
