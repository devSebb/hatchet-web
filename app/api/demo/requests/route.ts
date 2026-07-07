/**
 * POST /api/demo/requests
 *
 * Accepts a demo request. Flow:
 *   1. Honeypot check — if filled, return 200 {ok:true} with no side effects (don't
 *      tip off bots).
 *   2. Validate + normalize the payload (422 on bad input).
 *   3. Re-validate the slot against freshly-generated availability (409 if stale/taken)
 *      — the race guard. With no DB this still rejects expired/invalid slots.
 *   4. Send the sales email (Nodemailer/Gmail). Email failures are logged and never
 *      fail the request.
 *
 * This is a *request*, not a booking. No persistence yet — the email is the artifact.
 */
import { NextResponse } from "next/server";

import { getAvailabilityConfig } from "@/lib/booking/config";
import { sendDemoRequestEmails } from "@/lib/booking/email";
import { generateSlots, slotEnd } from "@/lib/booking/slots";
import {
  honeypotTripped,
  validateRequest,
  type RawRequestBody,
} from "@/lib/booking/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: RawRequestBody;
  try {
    body = (await request.json()) as RawRequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_json" },
      { status: 400 },
    );
  }

  // 1. Honeypot — silently succeed so bots get no signal.
  if (honeypotTripped(body)) {
    return NextResponse.json({ ok: true });
  }

  // 2. Validate + normalize.
  const result = validateRequest(body);
  if (!result.ok || !result.value) {
    return NextResponse.json(
      { ok: false, code: "validation_error", errors: result.errors },
      { status: 422 },
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
    return NextResponse.json(
      { ok: false, code: "slot_unavailable" },
      { status: 409 },
    );
  }

  const requestId = crypto.randomUUID();
  const end = slotEnd(req.slotStartUtc, cfg.durationMin);

  // 4. Side effects — resilient: never fail the request on email error.
  const emails = await sendDemoRequestEmails({
    request: req,
    requestId,
    slotStart: req.slotStartUtc,
    slotEnd: end,
    hostTimezone: cfg.hostTimezone,
    now,
  });

  return NextResponse.json(
    {
      ok: true,
      id: requestId,
      status: "requested",
      slot_start_utc: req.slotStartUtc.toISOString(),
      emails,
    },
    { status: 201 },
  );
}
