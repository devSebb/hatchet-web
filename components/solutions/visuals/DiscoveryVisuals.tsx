import { cn } from "@/lib/utils";

import { VisualShell } from "./VisualShell";

/* Product mocks for /solutions/discovery, following the content team's
 * mockups (channel leaderboard with filter chips; Launch Intelligence day 1–7
 * trajectory). All data fictional. */

const leaderboardFilters = [
  { label: "Twitch", active: true },
  { label: "YouTube" },
  { label: "Kick" },
  { label: "FPS", active: true },
  { label: "Lang: EN" },
  { label: "Country: Any" },
  { label: "VTuber" },
  { label: "Hours Watched ▾" },
];

const leaderboardRows = [
  {
    channel: "Novastrike",
    tag: "FPS",
    hours: "2.4M",
    peak: "41.2K",
    followers: "1.8M",
    chat: "312K",
  },
  {
    channel: "Pixelhollow",
    tag: "RPG",
    hours: "1.9M",
    peak: "28.7K",
    followers: "1.1M",
    chat: "198K",
  },
  {
    channel: "Kaijukendra",
    tag: "VTuber",
    hours: "1.6M",
    peak: "22.4K",
    followers: "940K",
    chat: "271K",
  },
  {
    channel: "Forgeplays",
    tag: "FPS",
    hours: "1.2M",
    peak: "19.9K",
    followers: "712K",
    chat: "148K",
  },
];

const leaderboardColumns = [
  "Hours Watched",
  "Peak CCV",
  "Followers",
  "Chat",
] as const;

export function ChannelLeaderboard() {
  return (
    <VisualShell
      contentClassName="p-0"
      label="Channel leaderboard"
      meta="32 platforms"
    >
      <div className="border-border flex flex-wrap gap-[8px] border-b px-[20px] py-[12px]">
        {leaderboardFilters.map((filter) => (
          <span
            className={cn(
              "rounded-full border px-[10px] py-[3px] font-mono text-[11px] tracking-[0.04em] uppercase",
              filter.active
                ? "border-transparent bg-signal text-white"
                : "border-border text-muted",
            )}
            key={filter.label}
          >
            {filter.label}
          </span>
        ))}
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-border border-b">
            <th className="text-muted px-[20px] py-[10px] font-mono text-[11px] font-medium tracking-[0.08em] uppercase">
              Channel
            </th>
            {leaderboardColumns.map((column) => (
              <th
                className="text-muted px-[16px] py-[10px] text-right font-mono text-[11px] font-medium tracking-[0.08em] uppercase max-md:hidden last:max-md:table-cell"
                key={column}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leaderboardRows.map((row) => (
            <tr
              className="border-border border-b last:border-b-0"
              key={row.channel}
            >
              <td className="px-[20px] py-[12px]">
                <span className="flex items-center gap-[10px]">
                  <span
                    aria-hidden="true"
                    className="bg-signal h-[14px] w-[3px]"
                  />
                  <span className="text-foreground text-sm font-semibold">
                    {row.channel}
                  </span>
                  <span className="border-border text-muted rounded-sm border px-[6px] py-[1px] font-mono text-[10px] tracking-[0.06em] uppercase">
                    {row.tag}
                  </span>
                </span>
              </td>
              <td className="text-signal px-[16px] py-[12px] text-right font-mono text-sm font-bold tabular-nums max-md:hidden">
                {row.hours}
              </td>
              {[row.peak, row.followers, row.chat].map((value, index) => (
                <td
                  className="text-foreground px-[16px] py-[12px] text-right font-mono text-sm tabular-nums max-md:hidden last:max-md:table-cell"
                  key={leaderboardColumns[index + 1]}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </VisualShell>
  );
}

// Day 1–7 hours watched, peaking mid-week like the mockup's trajectory.
const launchDays = [0.34, 0.48, 0.4, 0.62, 1, 0.78, 0.56];

export function LaunchIntelligence() {
  return (
    <VisualShell label="Launch Intelligence" meta="Day 1–7">
      <div className="flex h-[180px] items-end gap-[10px]">
        {launchDays.map((height, index) => (
          <div
            className="flex h-full flex-1 flex-col items-center justify-end gap-[8px]"
            key={index}
          >
            <div
              className={cn(
                "w-full rounded-t-[4px]",
                height === 1 ? "bg-signal" : "bg-signal/60",
              )}
              style={{ height: `${height * 100}%` }}
            />
            <span className="text-muted font-mono text-[10px] tracking-[0.08em] uppercase">
              D{index + 1}
            </span>
          </div>
        ))}
      </div>
      <dl className="border-border mt-[16px] grid grid-cols-2 gap-[16px] border-t pt-[16px]">
        <div>
          <dd className="text-signal font-mono text-lg font-bold tabular-nums">
            +38%
          </dd>
          <dt className="small text-muted mt-[2px]">
            Day 1 vs. historical genre average
          </dt>
        </div>
        <div>
          <dd className="text-foreground font-mono text-lg font-bold tabular-nums">
            412
          </dd>
          <dt className="small text-muted mt-[2px]">
            Channels driving the day-5 spike
          </dt>
        </div>
      </dl>
    </VisualShell>
  );
}
