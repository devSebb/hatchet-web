/**
 * Email side-effect for a demo request, sent from a Gmail account over SMTP
 * (Nodemailer + an App Password — no third-party service, no domain setup).
 *
 * We deliberately send ONLY the internal owner notification, to our own inbox.
 * We do NOT email the customer: Gmail can only send *as itself*, so a customer
 * confirmation would expose the raw sending address. The customer already gets
 * the on-screen "request received" confirmation. When a verified domain sender
 * exists (e.g. bookings@hatchet.com), re-enable a customer email here — the
 * `customer` result field is kept for that seam.
 *
 * Resilience: this never throws. If `GMAIL_APP_PASSWORD` is unset (e.g. before
 * the App Password is wired) it logs and reports `skipped`, so the request flow
 * still succeeds. Failures are logged, not surfaced to the user. No secrets are
 * ever logged.
 */
import nodemailer from "nodemailer";
import { buildIcs } from "./ics";
import type { NormalizedRequest } from "./validation";

interface SendContext {
  request: NormalizedRequest;
  requestId: string;
  slotStart: Date;
  slotEnd: Date;
  hostTimezone: string;
  now: Date;
}

export interface SendResult {
  sales: "sent" | "skipped" | "failed";
  customer: "sent" | "skipped" | "failed";
}

/** Human-readable slot, rendered in a specific timezone. */
function formatSlot(d: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

/** Trivial HTML escape for interpolated user input. */
function h(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function salesHtml(
  ctx: SendContext,
  bookerTime: string,
  hostTime: string,
): string {
  const r = ctx.request;
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-size:13px;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;color:#111827;font-size:14px">${value}</td></tr>`;
  return `<!doctype html><html><body style="margin:0;background:#f6f5f1;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6b7280;margin:0 0 8px">New demo request</p>
    <h1 style="font-size:22px;color:#0a0a0a;margin:0 0 4px">${h(r.name)} — ${h(r.companyHost)}</h1>
    <p style="font-size:13px;color:#6b7280;margin:0 0 24px">This is a request, not a confirmed booking. Reply to confirm a time with the prospect.</p>
    <table style="border-collapse:collapse;width:100%">
      ${row("Requested", `<strong>${h(bookerTime)}</strong><br><span style="color:#6b7280;font-size:13px">${h(hostTime)} (host)</span>`)}
      ${row("Name", h(r.name))}
      ${row("Email", `<a href="mailto:${h(r.email)}" style="color:#0a0a0a">${h(r.email)}</a>`)}
      ${row("Job title", h(r.jobTitle))}
      ${row("Company", `${h(r.company)} — <a href="${h(r.companyWebsite)}" style="color:#0a0a0a">${h(r.companyWebsite)}</a>`)}
      ${row("LinkedIn", r.linkedinUrl ? `<a href="${h(r.linkedinUrl)}" style="color:#0a0a0a">${h(r.linkedinUrl)}</a>` : "—")}
      ${row("Wants to cover", r.topic ? h(r.topic) : "—")}
      ${row("Heard about us via", r.referralSource ? h(r.referralSource) : "—")}
      ${row("Request ID", `<code style="font-size:12px;color:#6b7280">${h(ctx.requestId)}</code>`)}
    </table>
    <p style="font-size:12px;color:#9ca3af;margin:24px 0 0">A proposed-time .ics is attached. Reply to this email to reach ${h(r.name)} directly.</p>
  </div></body></html>`;
}

export async function sendDemoRequestEmails(
  ctx: SendContext,
): Promise<SendResult> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  // Where the notification lands — defaults to the sending account itself.
  const notifyTo = process.env.SALES_EMAIL || user;

  if (!pass || !user || !notifyTo) {
    // No App Password / sender yet — wired but inert. Don't fail the request.
    console.warn(
      `[book-demo] GMAIL_USER/GMAIL_APP_PASSWORD unset; skipping email send for request ${ctx.requestId}`,
    );
    return { sales: "skipped", customer: "skipped" };
  }

  const bookerTime = formatSlot(ctx.slotStart, ctx.request.bookerTimezone);
  const hostTime = formatSlot(ctx.slotStart, ctx.hostTimezone);

  const ics = buildIcs({
    uid: `${ctx.requestId}@hatchet.com`,
    start: ctx.slotStart,
    end: ctx.slotEnd,
    dtstamp: ctx.now,
    summary: `Demo with ${ctx.request.name} — ${ctx.request.companyHost}`,
    description: `Wants to cover: ${ctx.request.topic || "—"}`,
    organizerEmail: notifyTo,
    organizerName: "Hatchet",
    attendeeEmail: ctx.request.email,
    attendeeName: ctx.request.name,
  });

  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transport.sendMail({
      from: `"Hatchet — Book a demo" <${user}>`,
      to: notifyTo,
      // Reply goes straight to the prospect, not back to our own inbox.
      replyTo: `"${ctx.request.name}" <${ctx.request.email}>`,
      subject: `Demo request — ${ctx.request.name} (${ctx.request.companyHost})`,
      html: salesHtml(ctx, bookerTime, hostTime),
      attachments: [
        {
          filename: "proposed-time.ics",
          content: ics,
          contentType: "text/calendar; method=REQUEST",
        },
      ],
    });

    return { sales: "sent", customer: "skipped" };
  } catch (err) {
    console.error("[book-demo] Gmail SMTP send failed:", err);
    return { sales: "failed", customer: "skipped" };
  }
}
