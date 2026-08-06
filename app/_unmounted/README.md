# `app/_unmounted/` — routes that are kept but not served

Folders whose name starts with `_` are **private folders** in the App Router:
Next.js excludes them from routing entirely. Nothing under here is built, and
no URL reaches it. The files are kept verbatim so a decision can be reversed
without rewriting them.

## `resources/press/[slug]/`

Was `app/resources/press/[slug]/page.tsx`.

**It has generated zero pages for as long as it has existed** — on the server
build too, not just under static export. Its `generateStaticParams()` filters
to press items that have no external `url`:

```ts
return pressItems
  .filter((item) => !item.url)
  .map((item) => ({ slug: item.slug }));
```

and the content snapshot holds **24 press items, all 24 with a `url`**. Every
one is coverage published on someone else's site, so `PressCard` links straight
out and this route is never linked to.

### Why it had to come out of `app/`

`output: "export"` treats a dynamic route that yields no paths as a missing
`generateStaticParams`, and fails the build:

```
Error: Page "/resources/press/[slug]" is missing "generateStaticParams()"
so it cannot be used with "output: export" config.
```

There is no way to keep a zero-path dynamic route in a static export. The
choices were to delete it or to unmount it.

### Why it was not deleted

The question it answers is a content decision, not a migration one: _what
happens the first time Hatchet publishes its own press release rather than
linking to someone else's article?_ Today, structurally, it cannot — there is
nowhere for it to live. That belongs to whoever owns the newsroom.

Deleting the route would quietly close that door. Keeping it here loses
nothing: no URL resolved to it before, and none does now.

### How to remount

1. `git mv "app/_unmounted/resources/press/[slug]" "app/resources/press/[slug]"`
2. Give at least one item in `lib/content/generated/press.json` no `url`, so
   `generateStaticParams()` returns a path. **A zero-path dynamic route breaks
   the export build** — that is the whole reason this is here.
3. `app/sitemap.ts` already emits these URLs behind the same `!item.url`
   filter, so it needs no change.
