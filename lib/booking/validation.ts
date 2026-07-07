/**
 * Pure validation + normalization for an incoming demo request. No side effects;
 * returns either a normalized payload or a list of field errors so the route can
 * map them to a 422.
 */

export interface RawRequestBody {
  slot_start_utc?: unknown;
  booker_timezone?: unknown;
  name?: unknown;
  email?: unknown;
  job_title?: unknown;
  company_website?: unknown;
  notes?: unknown;
  /** Honeypot — must be empty. */
  website?: unknown;
}

export interface NormalizedRequest {
  slotStartUtc: Date;
  bookerTimezone: string;
  name: string;
  email: string;
  jobTitle: string;
  companyWebsite: string;
  companyHost: string;
  notes: string | null;
}

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
  value?: NormalizedRequest;
}

// Pragmatic email shape check — not RFC-perfect, just enough to reject typos.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Normalize a user-entered company URL to a canonical http(s) URL + hostname. */
export function normalizeCompanyUrl(
  input: string,
): { url: string; host: string } | null {
  let raw = input.trim();
  if (!raw) return null;
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  // Must have a dotted hostname (reject "localhost", bare words).
  if (!parsed.hostname.includes(".")) return null;
  return {
    url: parsed.toString(),
    host: parsed.hostname.replace(/^www\./, ""),
  };
}

/** True when the honeypot field was filled (i.e. almost certainly a bot). */
export function honeypotTripped(body: RawRequestBody): boolean {
  return asString(body.website).length > 0;
}

export function validateRequest(body: RawRequestBody): ValidationResult {
  const errors: Record<string, string> = {};

  const name = asString(body.name);
  if (!name) errors.name = "required";

  const email = asString(body.email);
  if (!email) errors.email = "required";
  else if (!EMAIL_RE.test(email)) errors.email = "invalid";

  const jobTitle = asString(body.job_title);
  if (!jobTitle) errors.job_title = "required";

  const companyRaw = asString(body.company_website);
  const company = companyRaw ? normalizeCompanyUrl(companyRaw) : null;
  if (!companyRaw) errors.company_website = "required";
  else if (!company) errors.company_website = "invalid";

  const bookerTimezone = asString(body.booker_timezone) || "UTC";

  const slotRaw = asString(body.slot_start_utc);
  let slotStartUtc: Date | null = null;
  if (!slotRaw) {
    errors.slot_start_utc = "required";
  } else {
    const d = new Date(slotRaw);
    if (Number.isNaN(d.getTime())) errors.slot_start_utc = "invalid";
    else slotStartUtc = d;
  }

  const notesRaw = asString(body.notes);
  const notes = notesRaw.length ? notesRaw.slice(0, 2000) : null;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    errors,
    value: {
      slotStartUtc: slotStartUtc as Date,
      bookerTimezone,
      name,
      email,
      jobTitle,
      companyWebsite: (company as { url: string; host: string }).url,
      companyHost: (company as { url: string; host: string }).host,
      notes,
    },
  };
}
