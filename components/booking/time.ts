/**
 * Client-side timezone formatting helpers. The backend speaks UTC; everything the
 * visitor sees is rendered in their own timezone here.
 */

export interface Slot {
  start_utc: string;
  end_utc: string;
}

export interface DayGroup {
  /** Stable YYYY-MM-DD key in the visitor's tz. */
  key: string;
  /** A representative instant within the day (first slot). */
  date: Date;
  slots: Slot[];
}

/** The visitor's IANA timezone, with a safe fallback. */
export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/** Friendly tz label, e.g. "America/New York". */
export function tzLabel(tz: string): string {
  return tz.replace(/_/g, " ");
}

function partMap(
  d: Date,
  opts: Intl.DateTimeFormatOptions,
  locale = "en-CA",
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of new Intl.DateTimeFormat(locale, opts).formatToParts(d)) {
    out[p.type] = p.value;
  }
  return out;
}

/** Stable YYYY-MM-DD key for an instant, read in `tz`. */
export function dayKey(d: Date, tz: string): string {
  const p = partMap(d, {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return `${p.year}-${p.month}-${p.day}`;
}

export function dayLabel(d: Date, tz: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function timeLabel(
  d: Date,
  tz: string,
  locale: string,
  hour12 = true,
): string {
  const label = new Intl.DateTimeFormat(locale, {
    timeZone: tz,
    hour: hour12 ? "numeric" : "2-digit",
    minute: "2-digit",
    hour12,
  }).format(d);
  // "9:00 AM" → "9:00am" to match the compact widget style.
  return hour12 ? label.replace(/\s/g, "").toLowerCase() : label;
}

/**
 * Compact time range, e.g. "9:00 – 9:30am" (shared am/pm collapses onto the
 * end time) or "09:00 – 09:30" in 24h mode.
 */
export function rangeLabel(
  start: Date,
  end: Date,
  tz: string,
  locale: string,
  hour12 = true,
): string {
  let a = timeLabel(start, tz, locale, hour12);
  const b = timeLabel(end, tz, locale, hour12);
  if (hour12) {
    const suffix = a.slice(-2);
    if (suffix === b.slice(-2)) a = a.slice(0, -2);
  }
  return `${a} – ${b}`;
}

/** Full date for the sidebar summary, e.g. "Wednesday, July 8, 2026". */
export function dateLabel(d: Date, tz: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: tz,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

/** Full, human date+time for the confirmation screen. */
export function fullLabel(d: Date, tz: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: tz,
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

/** Group UTC slots into ordered days in the visitor's tz. */
export function groupByDay(slots: Slot[], tz: string): DayGroup[] {
  const map = new Map<string, DayGroup>();
  for (const slot of slots) {
    const d = new Date(slot.start_utc);
    const key = dayKey(d, tz);
    const existing = map.get(key);
    if (existing) {
      existing.slots.push(slot);
    } else {
      map.set(key, { key, date: d, slots: [slot] });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
}
