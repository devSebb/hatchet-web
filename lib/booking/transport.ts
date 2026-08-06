/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  THIS FILE IS THE HUBSPOT INTEGRATION POINT.                             │
 * │                                                                          │
 * │  Wiring Book a Demo to HubSpot (or to a Lambda, or to anything else)     │
 * │  means editing THIS FILE AND NOTHING ELSE. `BookDemo.tsx` calls the two  │
 * │  functions below and knows nothing about what is behind them.            │
 * │                                                                          │
 * │  Replace the body of `submitRequest()` with the real call. Keep the      │
 * │  return type — a `Response` whose status the component already branches  │
 * │  on (201 success, 409 slot taken, 422 field errors, anything else →      │
 * │  generic error). Do not change the shapes; the UI is frozen.             │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * The transport seam for the Book a Demo flow.
 *
 * The site ships as a static export to S3 + CloudFront, so there is no server
 * to call. Both operations therefore run in the browser:
 *
 *  - `getAvailability()` computes slots locally. `lib/booking/slots.ts` is pure
 *    — given a config, a `taken` set and "now", it returns start times — and
 *    `taken` is empty without a database, exactly as it was in the route
 *    handler. Same inputs, same output.
 *
 *  - `submitRequest()` validates with the same `lib/booking/validation.ts` the
 *    server used, then resolves success.
 *
 * ⚠️  **A submitted request currently reaches nobody.** The email and calendar
 *     invite are unmounted — see `lib/booking/server/README.md`, which holds
 *     the working Nodemailer and `.ics` code verbatim. Until this file posts
 *     somewhere real, "Request received" means the browser accepted the form,
 *     not that anyone was told. That is the gap HubSpot closes.
 *
 * Both functions return a `Response` rather than a plain object so the swap
 * from `fetch()` was a one-line change at each call site, and so wiring a real
 * endpoint later is `return fetch(...)`.
 */
import { getAvailabilityConfig } from "./config";
import { generateSlots, slotEnd } from "./slots";
import {
  honeypotTripped,
  validateRequest,
  type RawRequestBody,
} from "./validation";

/**
 * Stand-in for network time on submit.
 *
 * Resolving instantly reads as a bug — the "Confirming…" state flashes and the
 * success panel appears before the click has finished feeling like a click.
 * This is presentation, not throttling; delete it when a real endpoint
 * supplies its own latency.
 */
const SUBMIT_LATENCY_MS = 650;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Bookable demo slots (UTC).
 *
 * Was `GET /api/demo/availability` (kept at
 * `lib/booking/server/availability-route.ts`). The body below is that handler's
 * body — the only difference is where it runs.
 */
export async function getAvailability(): Promise<Response> {
  const cfg = getAvailabilityConfig();

  // Soft-hold seam: load taken UTC starts here once persistence exists.
  const taken = new Set<number>();

  const now = new Date();
  const starts = generateSlots(cfg, taken, now);

  const slots = starts.map((start) => ({
    start_utc: start.toISOString(),
    end_utc: slotEnd(start, cfg.durationMin).toISOString(),
  }));

  return json(
    {
      host_timezone: cfg.hostTimezone,
      duration_min: cfg.durationMin,
      slots,
    },
    200,
  );
}

/**
 * Submit a demo request.
 *
 * Was `POST /api/demo/requests` (kept at
 * `lib/booking/server/requests-route.ts`). Same steps, same status codes:
 *
 *   200 — honeypot tripped (succeed silently so bots get no signal)
 *   422 — validation errors, same `errors` map the UI maps to field copy
 *   409 — the slot is no longer in freshly-generated availability
 *   201 — accepted
 *
 * The 409 branch cannot fire in practice now: the same browser generated the
 * slot list moments earlier from the same clock, so a slot it offered will
 * still be valid. The check is kept because it is the correct check the moment
 * a real backend exists, and `BookDemo.tsx` still handles the response.
 */
export async function submitRequest(body: RawRequestBody): Promise<Response> {
  await delay(SUBMIT_LATENCY_MS);

  // 1. Honeypot — silently succeed so bots get no signal.
  if (honeypotTripped(body)) {
    return json({ ok: true }, 200);
  }

  // 2. Validate + normalize.
  const result = validateRequest(body);
  if (!result.ok || !result.value) {
    return json(
      { ok: false, code: "validation_error", errors: result.errors },
      422,
    );
  }
  const req = result.value;

  // 3. Race guard — the slot must still be in the freshly-computed availability set.
  const cfg = getAvailabilityConfig();
  const now = new Date();
  const taken = new Set<number>(); // soft-hold seam (empty without a DB)
  const valid = generateSlots(cfg, taken, now).some(
    (s) => s.getTime() === req.slotStartUtc.getTime(),
  );
  if (!valid) {
    return json({ ok: false, code: "slot_unavailable" }, 409);
  }

  const requestId = crypto.randomUUID();

  // 4. Side effects — none yet. TODO(hubspot): POST the normalized `req` here.
  //    `lib/booking/server/email.ts` is the delivery code that used to run at
  //    this point, and `lib/booking/server/README.md` explains how to remount
  //    it. Never fail the request on a delivery error: the server did not, and
  //    the UI has no copy for it.

  return json(
    {
      ok: true,
      id: requestId,
      status: "requested",
      slot_start_utc: req.slotStartUtc.toISOString(),
      emails: { owner: "skipped", customer: "skipped" },
    },
    201,
  );
}
