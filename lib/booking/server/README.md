# `lib/booking/server/` — unmounted server code for Book a Demo

**Nothing in this directory runs.** It is not imported by the app, not bundled,
and not deployed. It is kept verbatim so it can be remounted without being
rewritten.

## Why it was unmounted

The site builds with `output: "export"` (static HTML for S3 + CloudFront).
Next.js refuses to build an export that contains route handlers:

```
Error: export const dynamic = "force-dynamic" on page "/api/demo/availability"
cannot be used with "output: export".
```

So `app/api/demo/**` could not stay. The code itself is fine — working
Nodemailer delivery, working `.ics` generation, working validation and
availability re-check — it simply has no server to run on today.

## What is here

| File | Was | Does |
|---|---|---|
| `availability-route.ts` | `app/api/demo/availability/route.ts` | `GET` → bookable slots from `lib/booking/config` + `lib/booking/slots` |
| `requests-route.ts` | `app/api/demo/requests/route.ts` | `POST` → honeypot, validate, re-check slot (409), send email |
| `email.ts` | `lib/booking/email.ts` | Nodemailer over Gmail SMTP; attaches the `.ics`. Never throws; skips silently when `GMAIL_USER` / `GMAIL_APP_PASSWORD` are unset |
| `ics.ts` | `lib/booking/ics.ts` | Pure iCalendar builder, `METHOD:REQUEST` |

Their dependencies — `lib/booking/config.ts`, `slots.ts`, `validation.ts` — are
**still live** in the parent directory. The browser uses them now
(`lib/booking/transport.ts`), and they are unchanged apart from the config
plumbing noted below.

## What the client does instead

`lib/booking/transport.ts` is the seam the UI talks to. It computes availability
in the browser (`slots.ts` is pure, and `taken` is empty without a database, so
the output is identical) and validates submissions with the same
`validation.ts`. **It does not send email.** A demo request submitted today
reaches nobody — see the TODO in that file.

## How to remount

The pieces are unchanged, so this is mechanical.

### As Next.js route handlers (requires leaving static export)

1. `mkdir -p app/api/demo/availability app/api/demo/requests`
2. `git mv lib/booking/server/availability-route.ts app/api/demo/availability/route.ts`
3. `git mv lib/booking/server/requests-route.ts app/api/demo/requests/route.ts`
4. In `requests-route.ts`, change `from "./email"` back to
   `from "@/lib/booking/email"` (and move `email.ts` / `ics.ts` back to
   `lib/booking/`, restoring `from "./validation"`).
5. Remove `output: "export"` from `next.config.ts`. **This forfeits the S3 +
   CloudFront deployment** — it needs a Node server.
6. Point `lib/booking/transport.ts` back at `fetch("/api/demo/...")`.

### As a Lambda behind API Gateway (keeps static export — the likely path)

Both handlers are pure functions of config + clock + body, plus one SMTP call.
There is no database, no session, and no shared state.

1. Copy `lib/booking/{config,slots,validation}.ts` and this directory into a
   Lambda package.
2. Replace the `NextResponse.json(...)` calls with the Lambda response shape.
   Nothing else in the bodies needs to change.
3. Put `GMAIL_USER` / `GMAIL_APP_PASSWORD` / `SALES_EMAIL` in Secrets Manager —
   or switch `email.ts` to SES, which its own header already anticipates once a
   verified `hatchet.gg` sender exists.
4. Point `lib/booking/transport.ts`'s `submitRequest()` at the endpoint.
   `getAvailability()` can stay client-side; it needs no server.

Either way, the only file the UI touches is `transport.ts`.

## Environment variables

`email.ts` reads `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `SALES_EMAIL`. These are
server-only and are **not** `NEXT_PUBLIC_*` — do not rename them to make them
reachable from the browser. Sending mail from the client would expose the
credential.

The availability variables (`DEMO_HOST_TZ` and friends) *were* renamed, to
`NEXT_PUBLIC_DEMO_*`, because the browser now computes slots. Same values, same
defaults — see `lib/booking/config.ts`.
