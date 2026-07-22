import { cn } from "@/lib/utils";

import { VisualShell } from "./VisualShell";

/* Product mocks for /solutions/discovery, following the product team's July
 * 2026 screenshots (Creator Discovery totals + leaderboard; Smart Search
 * chat-to-filters; Suspicious Channels toggle; Game Discovery table; launch
 * comparison; genre benchmarks). All data fictional. */

const leaderboardTotals = [
  { label: "Unique Creators", value: "50.2M", note: "of 52.4M", progress: 0.96 },
  { label: "Hours Watched", value: "6.7B", note: "last 90 days" },
  { label: "Peak CCV", value: "2.8M", note: "cross-platform" },
];

const leaderboardFilters = [
  { label: "Last 90 days" },
  { label: "Twitch", active: true },
  { label: "YouTube Gaming" },
  { label: "Kick" },
  { label: "+13 platforms" },
  { label: "FPS", active: true },
  { label: "Lang: EN" },
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
      <dl className="border-border grid grid-cols-3 border-b">
        {leaderboardTotals.map((total, index) => (
          <div
            className={cn(
              "px-[20px] py-[14px]",
              index > 0 && "border-border border-l",
            )}
            key={total.label}
          >
            <dt className="text-muted font-mono text-[10px] tracking-[0.08em] uppercase">
              {total.label}
            </dt>
            <dd className="mt-[4px] flex items-baseline gap-[8px]">
              <span className="text-foreground font-mono text-lg font-bold tabular-nums">
                {total.value}
              </span>
              <span className="small text-muted max-sm:hidden">
                {total.note}
              </span>
            </dd>
            {total.progress ? (
              <div className="bg-border mt-[8px] h-[3px] overflow-hidden rounded-full">
                <div
                  className="bg-signal h-full rounded-full"
                  style={{ width: `${total.progress * 100}%` }}
                />
              </div>
            ) : null}
          </div>
        ))}
      </dl>
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

// Chat-to-filters: the assistant turns one plain-language ask into structured
// filter groups, mirroring the Smart Search modal's right-hand panel.
const smartSearchGroups = [
  { label: "who streams on…", values: ["Twitch", "YouTube Gaming"] },
  { label: "by creator language", values: ["Spanish", "English"] },
  { label: "by engagement rate", values: ["Over 5%"] },
];

export function SmartSearch() {
  return (
    <VisualShell label="AI Smart Search" meta="Combined">
      <div className="flex items-start gap-[10px]">
        <span className="bg-signal flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-sm font-mono text-[10px] font-bold text-white">
          AI
        </span>
        <p className="small text-muted">
          Describe the creators you&rsquo;re looking for and I&rsquo;ll build
          the search for you.
        </p>
      </div>
      <p className="border-border text-foreground mt-[14px] ml-[32px] rounded-lg rounded-tr-sm border px-[14px] py-[10px] text-sm">
        Spanish-speaking FPS streamers with high chat engagement
      </p>
      <p className="text-muted mt-[16px] font-mono text-[10px] tracking-[0.08em] uppercase">
        3 filters active
      </p>
      <div className="mt-[8px] space-y-[8px]">
        {smartSearchGroups.map((group) => (
          <div
            className="border-border rounded-lg border px-[12px] py-[10px]"
            key={group.label}
          >
            <span className="bg-signal/10 text-signal rounded-full px-[8px] py-[2px] font-mono text-[10px] tracking-[0.04em] uppercase">
              {group.label}
            </span>
            <span className="mt-[8px] flex flex-wrap gap-[6px]">
              {group.values.map((value) => (
                <span
                  className="border-border text-foreground rounded-full border px-[10px] py-[2px] text-[12px]"
                  key={value}
                >
                  {value} <span className="text-muted">×</span>
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-[14px] flex items-center justify-end gap-[14px]">
        <span className="text-muted font-mono text-[11px] tracking-[0.04em] uppercase">
          Reset
        </span>
        <span className="bg-signal rounded-full px-[16px] py-[5px] font-mono text-[11px] font-bold tracking-[0.04em] text-white uppercase">
          Create
        </span>
      </div>
    </VisualShell>
  );
}

// Authenticity scores with the product's exclude/include toggle; the flagged
// channel is dimmed out the way the live filter drops it from results.
const audienceScores = [
  { channel: "Pixelhollow", score: 98 },
  { channel: "Novastrike", score: 96 },
  { channel: "Kaijukendra", score: 91 },
  { channel: "Vexholt", score: 34, flagged: true },
];

export function FakeAudienceScore() {
  return (
    <VisualShell label="Fake audience scoring" meta="Auto-flagged">
      <div className="flex flex-wrap gap-[8px]">
        <span className="border-signal text-signal rounded-full border px-[12px] py-[3px] font-mono text-[11px] tracking-[0.04em] uppercase">
          Exclude suspicious channels
        </span>
        <span className="border-border text-muted rounded-full border px-[12px] py-[3px] font-mono text-[11px] tracking-[0.04em] uppercase">
          Include all
        </span>
      </div>
      <ul className="mt-[16px] space-y-[12px]">
        {audienceScores.map((row) => (
          <li
            className={cn("flex items-center gap-[12px]", row.flagged && "opacity-60")}
            key={row.channel}
          >
            <span className="text-foreground w-[96px] shrink-0 text-sm font-semibold">
              {row.channel}
            </span>
            <span className="bg-border h-[4px] flex-1 overflow-hidden rounded-full">
              <span
                className={cn(
                  "block h-full rounded-full",
                  row.flagged ? "bg-muted" : "bg-signal",
                )}
                style={{ width: `${row.score}%` }}
              />
            </span>
            <span className="text-foreground w-[28px] text-right font-mono text-sm font-bold tabular-nums">
              {row.score}
            </span>
            {row.flagged ? (
              <span className="border-signal text-signal rounded-sm border px-[6px] py-[1px] font-mono text-[10px] tracking-[0.06em] uppercase">
                Flagged
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="small text-muted border-border mt-[14px] border-t pt-[12px]">
        Flagged channels never reach your shortlist.
      </p>
    </VisualShell>
  );
}

// Game table with the product's per-metric delta arrows and meter bars.
const gameRows = [
  {
    game: "Ironveil Arena",
    tag: "MOBA",
    hours: "14.2M",
    hoursDelta: "↑ 24%",
    ccv: "303K",
    ccvDelta: "↑ 12%",
    meter: 1,
    up: true,
  },
  {
    game: "Emberfall",
    tag: "Shooter",
    isNew: true,
    hours: "9.3M",
    hoursDelta: "↑ 241%",
    ccv: "188K",
    ccvDelta: "↑ 105%",
    meter: 0.65,
    up: true,
  },
  {
    game: "Willowmere",
    tag: "Sim",
    hours: "7.1M",
    hoursDelta: "↑ 9%",
    ccv: "92K",
    ccvDelta: "↑ 4%",
    meter: 0.5,
    up: true,
  },
  {
    game: "Neon Drift Rally",
    tag: "Racing",
    hours: "4.2M",
    hoursDelta: "↓ 7%",
    ccv: "61K",
    ccvDelta: "↓ 5%",
    meter: 0.3,
    up: false,
  },
];

export function GameLeaderboard() {
  return (
    <VisualShell contentClassName="p-0" label="Game leaderboard" meta="Weekly">
      <table className="w-full text-left">
        <thead>
          <tr className="border-border border-b">
            <th className="text-muted px-[20px] py-[10px] font-mono text-[11px] font-medium tracking-[0.08em] uppercase">
              Game
            </th>
            <th className="text-muted px-[16px] py-[10px] text-right font-mono text-[11px] font-medium tracking-[0.08em] uppercase">
              Hours Watched
            </th>
            <th className="text-muted px-[16px] py-[10px] text-right font-mono text-[11px] font-medium tracking-[0.08em] uppercase max-sm:hidden">
              Peak CCV
            </th>
          </tr>
        </thead>
        <tbody>
          {gameRows.map((row) => (
            <tr className="border-border border-b last:border-b-0" key={row.game}>
              <td className="px-[20px] py-[12px]">
                <span className="flex items-center gap-[10px]">
                  <span
                    aria-hidden="true"
                    className="bg-signal h-[14px] w-[3px]"
                  />
                  <span className="text-foreground text-sm font-semibold">
                    {row.game}
                  </span>
                  <span className="border-border text-muted rounded-sm border px-[6px] py-[1px] font-mono text-[10px] tracking-[0.06em] uppercase max-md:hidden">
                    {row.tag}
                  </span>
                  {row.isNew ? (
                    <span className="bg-signal rounded-sm px-[6px] py-[1px] font-mono text-[10px] font-bold tracking-[0.06em] text-white uppercase">
                      New
                    </span>
                  ) : null}
                </span>
              </td>
              <td className="px-[16px] py-[12px] text-right">
                <span className="flex items-baseline justify-end gap-[8px]">
                  <span className="text-foreground font-mono text-sm font-bold tabular-nums">
                    {row.hours}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[11px] tabular-nums",
                      row.up ? "text-signal" : "text-muted",
                    )}
                  >
                    {row.hoursDelta}
                  </span>
                </span>
                <span className="bg-border mt-[6px] block h-[3px] overflow-hidden rounded-full">
                  <span
                    className="bg-signal block h-full rounded-full"
                    style={{ width: `${row.meter * 100}%` }}
                  />
                </span>
              </td>
              <td className="px-[16px] py-[12px] text-right max-sm:hidden">
                <span className="flex items-baseline justify-end gap-[8px]">
                  <span className="text-foreground font-mono text-sm tabular-nums">
                    {row.ccv}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[11px] tabular-nums",
                      row.up ? "text-signal" : "text-muted",
                    )}
                  >
                    {row.ccvDelta}
                  </span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </VisualShell>
  );
}

// Day 1–7 hours watched vs. the genre's historical median, grouped per day
// like the Comparison view's paired bars.
const launchDays = [
  { launch: 0.34, median: 0.3 },
  { launch: 0.48, median: 0.33 },
  { launch: 0.4, median: 0.31 },
  { launch: 0.62, median: 0.36 },
  { launch: 1, median: 0.4 },
  { launch: 0.78, median: 0.38 },
  { launch: 0.56, median: 0.34 },
];

export function LaunchIntelligence() {
  return (
    <VisualShell label="Launch comparison" meta="Day 1–7">
      <div className="flex h-[160px] items-end gap-[10px]">
        {launchDays.map((day, index) => (
          <div
            className="flex h-full flex-1 flex-col items-center justify-end gap-[8px]"
            key={index}
          >
            <div className="flex h-full w-full items-end justify-center gap-[3px]">
              <div
                className={cn(
                  "w-full max-w-[14px] rounded-t-[3px]",
                  day.launch === 1 ? "bg-signal" : "bg-signal/70",
                )}
                style={{ height: `${day.launch * 100}%` }}
              />
              <div
                className="bg-border w-full max-w-[14px] rounded-t-[3px]"
                style={{ height: `${day.median * 100}%` }}
              />
            </div>
            <span className="text-muted font-mono text-[10px] tracking-[0.08em] uppercase">
              D{index + 1}
            </span>
          </div>
        ))}
      </div>
      <p className="text-muted mt-[12px] flex flex-wrap items-center gap-x-[16px] gap-y-[4px] font-mono text-[10px] tracking-[0.08em] uppercase">
        <span className="flex items-center gap-[6px]">
          <span aria-hidden="true" className="bg-signal h-[8px] w-[8px] rounded-[2px]" />
          Emberfall launch week
        </span>
        <span className="flex items-center gap-[6px]">
          <span aria-hidden="true" className="bg-border h-[8px] w-[8px] rounded-[2px]" />
          Genre median
        </span>
      </p>
      <dl className="border-border mt-[14px] grid grid-cols-2 gap-[16px] border-t pt-[14px]">
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

// Hours watched by genre with period-over-period shift, echoing the Genres
// ranking. "Friendslop" and "Survival" tie back to the section copy.
const genreRows = [
  { genre: "Action-Adventure", hours: "11.3M", share: 1, delta: "↑ 3%", up: true },
  { genre: "Shooter", hours: "11.2M", share: 0.99, delta: "↑ 6%", up: true },
  { genre: "FPS", hours: "8.8M", share: 0.78, delta: "↑ 12%", up: true },
  { genre: "MOBA", hours: "5.4M", share: 0.48, delta: "↑ 2%", up: true },
  { genre: "Survival", hours: "3.6M", share: 0.32, delta: "↑ 18%", up: true },
  { genre: "Friendslop", hours: "1.9M", share: 0.17, delta: "↑ 34%", up: true },
];

export function GenreBenchmarks() {
  return (
    <VisualShell label="Genre benchmarks" meta="52 genres">
      <ul className="space-y-[12px]">
        {genreRows.map((row) => (
          <li key={row.genre}>
            <span className="flex items-baseline justify-between gap-[12px]">
              <span className="text-foreground text-sm font-semibold">
                {row.genre}
              </span>
              <span className="flex items-baseline gap-[8px]">
                <span className="text-foreground font-mono text-sm font-bold tabular-nums">
                  {row.hours}
                </span>
                <span
                  className={cn(
                    "w-[44px] text-right font-mono text-[11px] tabular-nums",
                    row.up ? "text-signal" : "text-muted",
                  )}
                >
                  {row.delta}
                </span>
              </span>
            </span>
            <span className="bg-border mt-[6px] block h-[4px] overflow-hidden rounded-full">
              <span
                className="bg-signal block h-full rounded-full"
                style={{ width: `${row.share * 100}%` }}
              />
            </span>
          </li>
        ))}
      </ul>
      <p className="small text-muted border-border mt-[14px] border-t pt-[12px]">
        Fastest riser this quarter: Friendslop, up 34% in hours watched.
      </p>
    </VisualShell>
  );
}
