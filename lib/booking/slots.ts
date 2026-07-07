/**
 * Pure slot generation. No DB, no network — given a config, the set of already-taken
 * slots, and "now", it returns the bookable start times as UTC Dates.
 *
 * The hard part JS lacks natively is converting a wall-clock time in a named timezone
 * to a UTC instant (DST-aware); the helpers below derive the offset via Intl, which is
 * correct across DST boundaries.
 */
import type { AvailabilityConfig } from "./config";

/** Offset (ms) between `timeZone` wall-clock and UTC at the given instant. */
function tzOffsetMs(instant: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(instant)) parts[p.type] = p.value;
  // `hour` can come back as "24" at midnight in some environments; normalize.
  const hour = parts.hour === "24" ? "00" : parts.hour;
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return asUtc - instant.getTime();
}

/**
 * Convert a wall-clock time expressed in `timeZone` to the corresponding UTC instant.
 * Two-pass refinement handles the DST gap/overlap correctly in the common cases.
 */
function zonedWallTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const offset1 = tzOffsetMs(guess, timeZone);
  let utc = new Date(guess.getTime() - offset1);
  const offset2 = tzOffsetMs(utc, timeZone);
  if (offset2 !== offset1) utc = new Date(guess.getTime() - offset2);
  return utc;
}

/** The Y/M/D of an instant, read in `timeZone`. */
function zonedYmd(
  instant: Date,
  timeZone: string,
): { year: number; month: number; day: number } {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(instant)) parts[p.type] = p.value;
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
  };
}

function parseHm(hm: string): { h: number; m: number } {
  return { h: Number(hm.slice(0, 2)), m: Number(hm.slice(3, 5)) };
}

/**
 * Generate bookable slot start times (UTC), excluding any in `taken`.
 *
 * @param cfg       availability config
 * @param taken     UTC start instants already requested/confirmed — the soft-hold.
 *                  With no DB this is empty; it is the seam for a future free/busy check.
 * @param nowUtc    current instant
 */
export function generateSlots(
  cfg: AvailabilityConfig,
  taken: Set<number>,
  nowUtc: Date,
): Date[] {
  const earliest = nowUtc.getTime() + cfg.minNoticeMin * 60_000;
  const out: Date[] = [];

  // Anchor on the host-local calendar date of "now", then walk forward day-by-day
  // at the calendar level (UTC-noon anchor keeps the date stable across DST).
  const todayHost = zonedYmd(nowUtc, cfg.hostTimezone);

  for (let d = 0; d < cfg.daysAhead; d++) {
    const anchor = new Date(
      Date.UTC(todayHost.year, todayHost.month - 1, todayHost.day, 12, 0, 0),
    );
    anchor.setUTCDate(anchor.getUTCDate() + d);
    const year = anchor.getUTCFullYear();
    const month = anchor.getUTCMonth() + 1;
    const day = anchor.getUTCDate();
    const weekdayMon0 = (anchor.getUTCDay() + 6) % 7; // JS Sun=0 → Mon=0

    for (const [startS, endS] of cfg.weeklyHours[weekdayMon0] ?? []) {
      const start = parseHm(startS);
      const end = parseHm(endS);
      const windowEndMin = end.h * 60 + end.m;

      let slotMin = start.h * 60 + start.m;
      while (slotMin + cfg.durationMin <= windowEndMin) {
        const startUtc = zonedWallTimeToUtc(
          year,
          month,
          day,
          Math.floor(slotMin / 60),
          slotMin % 60,
          cfg.hostTimezone,
        );
        const t = startUtc.getTime();
        if (t > earliest && !taken.has(t)) {
          out.push(startUtc);
        }
        slotMin += cfg.intervalMin;
      }
    }
  }

  return out;
}

/** Slot end instant, derived from duration. */
export function slotEnd(start: Date, durationMin: number): Date {
  return new Date(start.getTime() + durationMin * 60_000);
}
