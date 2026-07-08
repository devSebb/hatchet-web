/**
 * Pure validation + normalization for an incoming demo request. No side effects;
 * returns either a normalized payload or a list of field errors so the route can
 * map them to a 422.
 */
import { REFERRAL_OPTIONS, REFERRAL_OTHER, TOPIC_OPTIONS } from "./options";

export interface RawRequestBody {
  slot_start_utc?: unknown;
  booker_timezone?: unknown;
  name?: unknown;
  email?: unknown;
  job_title?: unknown;
  company?: unknown;
  company_website?: unknown;
  topic?: unknown;
  referral_source?: unknown;
  referral_other?: unknown;
  /** Honeypot — must be empty. */
  website?: unknown;
}

export interface NormalizedRequest {
  slotStartUtc: Date;
  bookerTimezone: string;
  name: string;
  email: string;
  jobTitle: string;
  company: string;
  companyWebsite: string;
  companyHost: string;
  /** "What would you like to cover?" — one of TOPIC_OPTIONS. */
  topic: string;
  /** "How did you hear about us?" — one of REFERRAL_OPTIONS. */
  referralSource: string;
  /** Free text accompanying the "Other" referral choice. */
  referralOther: string | null;
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

  const company = asString(body.company);
  if (!company) errors.company = "required";

  const companyRaw = asString(body.company_website);
  const companyUrl = companyRaw ? normalizeCompanyUrl(companyRaw) : null;
  if (!companyRaw) errors.company_website = "required";
  else if (!companyUrl) errors.company_website = "invalid";

  const topic = asString(body.topic);
  if (!topic) errors.topic = "required";
  else if (!(TOPIC_OPTIONS as readonly string[]).includes(topic))
    errors.topic = "invalid";

  const referralSource = asString(body.referral_source);
  if (!referralSource) errors.referral_source = "required";
  else if (!(REFERRAL_OPTIONS as readonly string[]).includes(referralSource))
    errors.referral_source = "invalid";

  const referralOtherRaw = asString(body.referral_other);
  const referralOther = referralOtherRaw
    ? referralOtherRaw.slice(0, 500)
    : null;
  if (referralSource === REFERRAL_OTHER && !referralOther)
    errors.referral_other = "required";

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
      company,
      companyWebsite: (companyUrl as { url: string; host: string }).url,
      companyHost: (companyUrl as { url: string; host: string }).host,
      topic,
      referralSource,
      referralOther,
    },
  };
}
