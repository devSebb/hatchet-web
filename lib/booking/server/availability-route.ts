/**
 * GET /api/demo/availability
 *
 * Returns the bookable demo slots (UTC) computed purely from the static availability
 * config — there is no live calendar. `taken` (the soft-hold) is the seam for a future
 * DB / free-busy check; with no database it is empty, so no slots are hidden.
 */
import { NextResponse } from "next/server";

import { getAvailabilityConfig } from "@/lib/booking/config";
import { generateSlots, slotEnd } from "@/lib/booking/slots";

// Request-time only; never cache (slots are relative to "now").
export const dynamic = "force-dynamic";

export async function GET() {
  const cfg = getAvailabilityConfig();

  // Soft-hold seam: load taken UTC starts here once persistence exists.
  const taken = new Set<number>();

  const now = new Date();
  const starts = generateSlots(cfg, taken, now);

  const slots = starts.map((start) => ({
    start_utc: start.toISOString(),
    end_utc: slotEnd(start, cfg.durationMin).toISOString(),
  }));

  return NextResponse.json({
    host_timezone: cfg.hostTimezone,
    duration_min: cfg.durationMin,
    slots,
  });
}
