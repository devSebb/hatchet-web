/**
 * Minimal, pure iCalendar (.ics) builder for a meeting *request*.
 *
 * METHOD:REQUEST with a stable UID; DTSTART/DTEND in UTC. Kept dependency-free and
 * pure (timestamps are passed in) so it is trivially unit-testable.
 */

export interface IcsInput {
  /** Stable unique id for the event (e.g. derived from the request id). */
  uid: string;
  start: Date;
  end: Date;
  /** Generation time — passed in to keep this pure. */
  dtstamp: Date;
  summary: string;
  description?: string;
  /** Host/organizer email. */
  organizerEmail: string;
  organizerName?: string;
  attendeeEmail: string;
  attendeeName?: string;
}

/** YYYYMMDDTHHMMSSZ in UTC. */
function toIcsUtc(d: Date): string {
  return d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

/** Escape per RFC 5545 (commas, semicolons, backslashes, newlines). */
function esc(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export function buildIcs(input: IcsInput): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hatchet//Book a Demo//EN",
    "METHOD:REQUEST",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${input.uid}`,
    `DTSTAMP:${toIcsUtc(input.dtstamp)}`,
    `DTSTART:${toIcsUtc(input.start)}`,
    `DTEND:${toIcsUtc(input.end)}`,
    `SUMMARY:${esc(input.summary)}`,
    input.description ? `DESCRIPTION:${esc(input.description)}` : null,
    `ORGANIZER${input.organizerName ? `;CN=${esc(input.organizerName)}` : ""}:mailto:${input.organizerEmail}`,
    `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE${
      input.attendeeName ? `;CN=${esc(input.attendeeName)}` : ""
    }:mailto:${input.attendeeEmail}`,
    "STATUS:TENTATIVE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((l): l is string => l !== null);

  // RFC 5545 line endings.
  return lines.join("\r\n") + "\r\n";
}
