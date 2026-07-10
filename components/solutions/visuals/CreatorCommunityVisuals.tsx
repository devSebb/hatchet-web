import { cn } from "@/lib/utils";

import { VisualShell } from "./VisualShell";

/* Product mocks for /solutions/creator-community. All data fictional.
 * Spacing note: named steps are doubled in this theme — use arbitrary px. */

/** Tiny uppercase column header, echoing VisualShell's meta type. */
function ColHead({ children, right }: { children: string; right?: boolean }) {
  return (
    <span
      className={cn(
        "text-muted font-mono text-[10px] tracking-[0.08em] uppercase",
        right && "text-right",
      )}
    >
      {children}
    </span>
  );
}

/** Label chip — `active` renders in the brand red used for signal accents. */
function Chip({ children, active }: { children: string; active?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-[10px] py-[3px] font-mono text-[11px]",
        active
          ? "border-signal/30 bg-signal/10 text-signal"
          : "border-border text-muted bg-background/70",
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------- Roster -------------------------------- */

const ROSTER = [
  { name: "Novastrike", platform: "Twitch", followers: "412K", ccv: "8.4K", eng: "6.2%" },
  { name: "Pixelhollow", platform: "YouTube", followers: "1.2M", ccv: "31K", eng: "4.8%" },
  { name: "Duskrunner", platform: "TikTok", followers: "864K", ccv: "12K", eng: "9.1%" },
  { name: "Miravex", platform: "Kick", followers: "196K", ccv: "3.1K", eng: "7.4%" },
  { name: "Glasscannon", platform: "Twitch", followers: "287K", ccv: "5.6K", eng: "5.5%" },
];

export function RosterTable() {
  return (
    <VisualShell label="My Creators" meta="128 creators">
      <div className="flex flex-wrap items-center gap-[8px]">
        <Chip active>Tier 1</Chip>
        <Chip active>EMEA</Chip>
        <Chip>FPS</Chip>
        <Chip>Spring Launch</Chip>
        <Chip>+ Add label</Chip>
      </div>
      <div className="mt-[16px] grid grid-cols-[1fr_repeat(3,minmax(0,64px))] items-center gap-x-[12px] gap-y-[10px] sm:grid-cols-[1.4fr_0.8fr_repeat(3,minmax(0,72px))]">
        <ColHead>Creator</ColHead>
        <span className="hidden sm:block">
          <ColHead>Platform</ColHead>
        </span>
        <ColHead right>Followers</ColHead>
        <ColHead right>Avg CCV</ColHead>
        <ColHead right>Eng.</ColHead>
        {ROSTER.map((row) => (
          <div className="contents" key={row.name}>
            <span className="text-foreground flex items-center gap-[10px] text-[13px] font-medium">
              <span
                aria-hidden="true"
                className="bg-signal/10 text-signal grid size-[22px] shrink-0 place-items-center rounded-full font-mono text-[10px]"
              >
                {row.name[0]}
              </span>
              {row.name}
            </span>
            <span className="text-muted hidden text-[12px] sm:block">
              {row.platform}
            </span>
            <span className="text-foreground text-right font-mono text-[13px] tabular-nums">
              {row.followers}
            </span>
            <span className="text-foreground text-right font-mono text-[13px] tabular-nums">
              {row.ccv}
            </span>
            <span className="text-foreground text-right font-mono text-[13px] tabular-nums">
              {row.eng}
            </span>
          </div>
        ))}
      </div>
    </VisualShell>
  );
}

/* ------------------------------ Messaging ------------------------------ */

const STATUS = {
  sent: { label: "Sent", dot: "bg-amber-500" },
  replied: { label: "Replied", dot: "bg-emerald-500" },
  failed: { label: "Failed", dot: "bg-signal" },
} as const;

const THREADS: Array<{
  to: string;
  subject: string;
  status: keyof typeof STATUS;
  time: string;
}> = [
  { to: "Novastrike", subject: "Re: Spring Launch brief + key", status: "replied", time: "2m" },
  { to: "Tier 1 · EMEA (24)", subject: "Broadcast: patch 2.4 embargo lift", status: "sent", time: "18m" },
  { to: "Pixelhollow", subject: "Re: sponsored VOD deliverables", status: "replied", time: "1h" },
  { to: "duskrunner@…", subject: "Creator kit — asset drop", status: "failed", time: "3h" },
  { to: "Miravex", subject: "Contract follow-up, June window", status: "sent", time: "5h" },
];

export function MessagingInbox() {
  return (
    <VisualShell contentClassName="p-[12px]" label="Messaging" meta="Gmail synced">
      <div className="grid gap-[6px]">
        {THREADS.map((thread) => {
          const status = STATUS[thread.status];
          return (
            <div
              className="border-border bg-background/70 flex items-center gap-[12px] rounded-lg border px-[12px] py-[9px]"
              key={thread.subject}
            >
              <span
                aria-hidden="true"
                className={cn("size-[8px] shrink-0 rounded-full", status.dot)}
              />
              <span className="min-w-0 flex-1">
                <span className="text-foreground block truncate text-[13px] font-medium">
                  {thread.to}
                </span>
                <span className="text-muted block truncate text-[12px]">
                  {thread.subject}
                </span>
              </span>
              <span
                className={cn(
                  "font-mono text-[10px] tracking-[0.08em] uppercase",
                  thread.status === "failed" ? "text-signal" : "text-muted",
                )}
              >
                {status.label}
              </span>
              <span className="text-muted w-[26px] text-right font-mono text-[11px] tabular-nums">
                {thread.time}
              </span>
            </div>
          );
        })}
      </div>
    </VisualShell>
  );
}

/* ------------------------------ Promo codes ---------------------------- */

const CODES = [
  { code: "NOVA15", creator: "Novastrike", redemptions: "1,284", share: 1, roi: "5.1x" },
  { code: "PIXEL10", creator: "Pixelhollow", redemptions: "946", share: 0.74, roi: "4.2x" },
  { code: "DUSK20", creator: "Duskrunner", redemptions: "612", share: 0.48, roi: "3.4x" },
  { code: "MIRA15", creator: "Miravex", redemptions: "387", share: 0.3, roi: "2.6x" },
];

export function PromoCodeDashboard() {
  return (
    <VisualShell label="Code Management" meta="Live redemptions">
      <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-[14px] gap-y-[12px]">
        <ColHead>Code</ColHead>
        <ColHead>Redemptions</ColHead>
        <ColHead right>Total</ColHead>
        <ColHead right>ROI</ColHead>
        {CODES.map((row) => (
          <div className="contents" key={row.code}>
            <span>
              <span className="border-border bg-background/70 text-foreground inline-block rounded-md border px-[8px] py-[3px] font-mono text-[12px] font-bold">
                {row.code}
              </span>
              <span className="text-muted mt-[3px] block text-[11px]">
                {row.creator}
              </span>
            </span>
            <span className="bg-border/60 block h-[6px] overflow-hidden rounded-full">
              <span
                className="bg-signal block h-full rounded-full"
                style={{ width: `${row.share * 100}%` }}
              />
            </span>
            <span className="text-foreground text-right font-mono text-[13px] font-bold tabular-nums">
              {row.redemptions}
            </span>
            <span className="text-signal text-right font-mono text-[13px] font-bold tabular-nums">
              {row.roi}
            </span>
          </div>
        ))}
      </div>
      <p className="border-border text-muted mt-[16px] flex items-center justify-between border-t pt-[12px] font-mono text-[11px] tracking-[0.08em] uppercase">
        <span>3,229 redemptions this campaign</span>
        <span className="text-foreground">Avg ROI 3.8x</span>
      </p>
    </VisualShell>
  );
}
