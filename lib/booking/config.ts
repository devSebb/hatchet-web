/**
 * Availability configuration for the "Book a demo" flow.
 *
 * This is the single source of truth for *when* demos can be requested. It is a
 * static config with sane defaults baked in (so the feature works out of the box)
 * and every field is overridable by env. Kept deliberately behind a clean boundary
 * so it can later move to a DB table without touching the slot generator or routes.
 *
 * Note: this is a *request* flow, not a live calendar. There is no free/busy check
 * — that is a deliberate v2 seam (see `taken` in `generateSlots`).
 */

/** 0 = Monday … 6 = Sunday → list of ["HH:MM", "HH:MM"] open windows in host-local time. */
export type WeeklyHours = Record<number, [string, string][]>;

export interface AvailabilityConfig {
  /** Open windows per weekday, in `hostTimezone` wall-clock time. */
  weeklyHours: WeeklyHours;
  /** IANA tz the windows are expressed in, e.g. "America/New_York". */
  hostTimezone: string;
  /** Length of a single demo, minutes. */
  durationMin: number;
  /** Slot granularity, minutes (how far apart start times are). */
  intervalMin: number;
  /** Earliest a slot may be from "now", minutes (lead time). */
  minNoticeMin: number;
  /** How many days into the future to offer. */
  daysAhead: number;
}

/** Mon–Fri, 09:00–17:00 host-local. */
const DEFAULT_WEEKLY_HOURS: WeeklyHours = {
  0: [["09:00", "17:00"]],
  1: [["09:00", "17:00"]],
  2: [["09:00", "17:00"]],
  3: [["09:00", "17:00"]],
  4: [["09:00", "17:00"]],
};

function intFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Resolve the active config, applying env overrides over the in-code defaults.
 * Called per-request so env changes take effect without a rebuild.
 */
export function getAvailabilityConfig(): AvailabilityConfig {
  return {
    weeklyHours: DEFAULT_WEEKLY_HOURS,
    hostTimezone: process.env.DEMO_HOST_TZ || "America/New_York",
    durationMin: intFromEnv("DEMO_DURATION_MIN", 30),
    intervalMin: intFromEnv("DEMO_INTERVAL_MIN", 30),
    minNoticeMin: intFromEnv("DEMO_MIN_NOTICE_MIN", 240),
    daysAhead: intFromEnv("DEMO_DAYS_AHEAD", 14),
  };
}
