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
  {
    name: "Novastrike",
    platform: "Twitch",
    labels: ["Tier 1", "EMEA"],
    followers: "412K",
    eng: "6.2%",
  },
  {
    name: "Pixelhollow",
    platform: "YouTube",
    labels: ["Tier 1", "Spring Launch"],
    followers: "1.2M",
    eng: "4.8%",
  },
  {
    name: "Duskrunner",
    platform: "TikTok",
    labels: ["FPS"],
    followers: "864K",
    eng: "9.1%",
  },
  {
    name: "Miravex",
    platform: "Kick",
    labels: ["EMEA", "FPS"],
    followers: "196K",
    eng: "7.4%",
  },
];

export function RosterTable() {
  return (
    <VisualShell label="My Creators" meta="Showing 4 of 128">
      <div className="flex flex-wrap items-center gap-[8px]">
        <Chip active>Tier 1</Chip>
        <Chip active>EMEA</Chip>
        <Chip>FPS</Chip>
        <Chip>Spring Launch</Chip>
        <Chip>+ New label</Chip>
      </div>
      <div className="mt-[16px] grid grid-cols-[1fr_repeat(2,minmax(0,58px))_auto] items-center gap-x-[12px] gap-y-[12px]">
        <ColHead>Creator</ColHead>
        <ColHead right>Followers</ColHead>
        <ColHead right>Eng.</ColHead>
        <span aria-hidden="true" />
        {ROSTER.map((row) => (
          <div className="contents" key={row.name}>
            <span className="flex min-w-0 items-center gap-[10px]">
              <span
                aria-hidden="true"
                className="bg-signal/10 text-signal grid size-[22px] shrink-0 place-items-center rounded-full font-mono text-[10px]"
              >
                {row.name[0]}
              </span>
              <span className="min-w-0">
                <span className="text-foreground block truncate text-[13px] font-medium">
                  {row.name}
                  <span className="text-muted ml-[6px] text-[11px] font-normal">
                    {row.platform}
                  </span>
                </span>
                <span className="mt-[3px] flex flex-wrap gap-[4px]">
                  {row.labels.map((label) => (
                    <span
                      className="bg-signal/10 text-signal rounded-sm px-[5px] py-[1px] font-mono text-[9px] tracking-[0.04em] uppercase"
                      key={label}
                    >
                      {label}
                    </span>
                  ))}
                </span>
              </span>
            </span>
            <span className="text-foreground text-right font-mono text-[13px] tabular-nums">
              {row.followers}
            </span>
            <span className="text-foreground text-right font-mono text-[13px] tabular-nums">
              {row.eng}
            </span>
            <span className="border-border text-muted rounded-full border px-[9px] py-[2px] font-mono text-[10px] tracking-[0.04em] uppercase max-sm:hidden">
              Message
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
  { to: "Tier 1 · EMEA (24)", subject: "Broadcast: patch 2.4 embargo lift", status: "sent", time: "18m" },
  { to: "Pixelhollow", subject: "Re: sponsored VOD deliverables", status: "replied", time: "1h" },
  { to: "duskrunner@…", subject: "Creator kit — asset drop", status: "failed", time: "3h" },
];

export function MessagingInbox() {
  return (
    <VisualShell contentClassName="p-[12px]" label="Messaging" meta="Gmail synced">
      <div className="border-border bg-background/70 rounded-lg border p-[12px]">
        <div className="flex items-center gap-[8px]">
          <span
            aria-hidden="true"
            className="bg-signal/10 text-signal grid size-[22px] shrink-0 place-items-center rounded-full font-mono text-[10px]"
          >
            N
          </span>
          <span className="text-foreground text-[13px] font-medium">
            Novastrike
          </span>
          <span className="text-muted ml-auto font-mono text-[10px] tracking-[0.08em] uppercase">
            <span aria-hidden="true" className="text-emerald-500">
              ●
            </span>{" "}
            Replied 2m
          </span>
        </div>
        <p className="border-border bg-card text-muted mt-[10px] rounded-lg rounded-tl-sm border px-[12px] py-[8px] text-[12px]">
          New codes to share! You&rsquo;ve been assigned{" "}
          <span className="text-foreground font-mono font-bold">NOVA15</span>{" "}
          and <span className="text-foreground font-mono font-bold">NOVA20</span>{" "}
          — share them with your followers.
        </p>
        <p className="bg-signal/10 text-foreground mt-[8px] ml-[24px] rounded-lg rounded-br-sm px-[12px] py-[8px] text-[12px]">
          Codes are live in tonight&rsquo;s stream 🔥
        </p>
      </div>
      <div className="mt-[8px] grid gap-[6px]">
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

const codeBankTotals = [
  { label: "Total", value: "538" },
  { label: "Shared", value: "270", accent: true },
  { label: "Available", value: "268" },
];

export function PromoCodeDashboard() {
  return (
    <VisualShell label="Code Management" meta="Bank: Spring Launch">
      <dl className="border-border mb-[16px] flex gap-[24px] border-b pb-[14px]">
        {codeBankTotals.map((total) => (
          <div className="flex items-baseline gap-[6px]" key={total.label}>
            <dd
              className={cn(
                "font-mono text-sm font-bold tabular-nums",
                total.accent ? "text-signal" : "text-foreground",
              )}
            >
              {total.value}
            </dd>
            <dt className="text-muted font-mono text-[10px] tracking-[0.08em] uppercase">
              {total.label}
            </dt>
          </div>
        ))}
      </dl>
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
