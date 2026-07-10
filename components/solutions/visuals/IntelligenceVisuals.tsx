import { cn } from "@/lib/utils";

import { VisualShell } from "./VisualShell";

/* Product mocks for /solutions/intelligence. All data is fictional. Static
 * server-rendered SVG/div mocks; compact spacing uses arbitrary px values
 * because the theme's named spacing steps are doubled. */

/* ----------------------------- shared helpers ---------------------------- */

const CHART_W = 240;

function chartPaths(data: number[], height: number) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = CHART_W / (data.length - 1);
  const pad = 5;
  const points = data.map((value, index) => ({
    x: index * step,
    y: height - pad - ((value - min) / range) * (height - pad * 2),
  }));
  const line = points
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const area =
    `M0,${height} L` +
    points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L") +
    ` L${CHART_W},${height} Z`;
  return { line, area };
}

function TrendChart({
  data,
  height = 60,
  className,
}: {
  data: number[];
  height?: number;
  className?: string;
}) {
  const { line, area } = chartPaths(data, height);
  return (
    <svg
      aria-hidden="true"
      className={cn("block w-full", className)}
      viewBox={`0 0 ${CHART_W} ${height}`}
    >
      <line
        stroke="var(--signal-grid)"
        strokeWidth="1"
        x1="0"
        x2={CHART_W}
        y1={height - 1}
        y2={height - 1}
      />
      <path d={area} fill="var(--signal)" opacity="0.1" />
      <polyline
        fill="none"
        points={line}
        stroke="var(--signal)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function Metric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="grid gap-[2px]">
      <span
        className={cn(
          "font-mono text-sm font-bold tabular-nums",
          accent ? "text-signal" : "text-foreground",
        )}
      >
        {value}
      </span>
      <span className="text-muted text-[11px] leading-snug">{label}</span>
    </div>
  );
}

function Pill({ children }: { children: string }) {
  return (
    <span className="border-border text-muted rounded-full border px-[8px] py-[1px] font-mono text-[10px] tracking-[0.06em] uppercase">
      {children}
    </span>
  );
}

const tinyLabel =
  "text-muted font-mono text-[10px] tracking-[0.08em] uppercase";

/* ------------------------ 1. Chat & stream titles ------------------------ */

const MENTIONS = [
  {
    channel: "Novastrike",
    platform: "Twitch",
    source: "Title",
    before: "Ashfall Royale ranked grind — ",
    term: "Voltcore",
    after: " code in bio",
  },
  {
    channel: "Pixelhollow",
    platform: "YouTube",
    source: "Chat",
    before: "that ",
    term: "voltcore",
    after: " giveaway last stream was insane",
  },
  {
    channel: "Duskraider",
    platform: "Kick",
    source: "Title",
    before: "",
    term: "VOLTCORE",
    after: " Cup qualifiers — day 2",
  },
];

export function MentionTracker() {
  return (
    <VisualShell label="Brand mentions" meta="Live · 32 platforms">
      <div className="grid gap-[16px]">
        <div className="grid grid-cols-[auto_1fr] items-end gap-[20px]">
          <Metric accent label={'"Voltcore" · 30 days'} value="2,418" />
          <TrendChart
            data={[12, 18, 15, 24, 21, 30, 27, 38, 34, 46, 52, 61]}
            height={44}
          />
        </div>
        <div className="grid gap-[6px]">
          <div className="bg-border flex h-[6px] overflow-hidden rounded-full">
            <span className="bg-signal w-[64%]" />
          </div>
          <div className="flex justify-between">
            <span className={tinyLabel}>
              <span className="text-signal">●</span> Organic 64%
            </span>
            <span className={tinyLabel}>Campaign 36%</span>
          </div>
        </div>
        <ul className="border-border grid gap-[10px] border-t pt-[14px]">
          {MENTIONS.map((m) => (
            <li className="grid gap-[3px]" key={m.channel}>
              <div className="flex items-center gap-[8px]">
                <span className="small text-foreground font-semibold">
                  {m.channel}
                </span>
                <Pill>{m.platform}</Pill>
                <span className={cn(tinyLabel, "ml-auto")}>{m.source}</span>
              </div>
              <p className="text-muted truncate text-[13px]">
                {m.before}
                <span className="text-signal font-semibold">{m.term}</span>
                {m.after}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </VisualShell>
  );
}

/* ------------------------------- 2. Groups ------------------------------- */

const GROUPS = [
  ["Core roster", "14", "1.2M", "8.4K", "26.1M"],
  ["Prospects Q3", "22", "643K", "2.9K", "9.8M"],
  ["Competitor set", "9", "981K", "6.1K", "18.4M"],
  ["Ashfall specialists", "11", "774K", "4.7K", "12.2M"],
];

export function GroupsTable() {
  const cols = "grid grid-cols-[1.5fr_repeat(4,minmax(0,1fr))] gap-[10px]";
  return (
    <VisualShell label="Groups" meta="4 groups">
      <div className={cn(cols, "border-border border-b pb-[8px]")}>
        <span className={tinyLabel}>Group</span>
        {["Creators", "Hrs watched", "Avg CCV", "Followers"].map((h) => (
          <span className={cn(tinyLabel, "text-right")} key={h}>
            {h}
          </span>
        ))}
      </div>
      <ul className="divide-border grid divide-y">
        {GROUPS.map(([name, ...stats], index) => (
          <li className={cn(cols, "items-center py-[10px]")} key={name}>
            <span className="flex items-center gap-[8px]">
              <span
                className={cn(
                  "size-[8px] shrink-0 rounded-[2px]",
                  index === 0 ? "bg-signal" : "bg-border",
                )}
              />
              <span className="small text-foreground truncate font-semibold">
                {name}
              </span>
            </span>
            {stats.map((stat, statIndex) => (
              <span
                className="text-foreground text-right font-mono text-sm tabular-nums"
                key={statIndex}
              >
                {stat}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </VisualShell>
  );
}

/* ------------------------------ 3. VOD trend ------------------------------ */

export function VodTrend() {
  return (
    <VisualShell label="VOD analytics" meta="Uploaded · 14 days">
      <div className="grid gap-[16px]">
        <div className="flex items-center gap-[8px]">
          <span className="small text-foreground truncate font-semibold">
            Ashfall Royale — Season 6 finale recap
          </span>
          <Pill>YouTube</Pill>
        </div>
        <TrendChart
          data={[8, 22, 41, 38, 52, 49, 64, 60, 74, 71, 82, 80, 90, 96]}
          height={72}
        />
        <div className="border-border grid grid-cols-4 gap-[12px] border-t pt-[14px]">
          <Metric accent label="Views" value="4.2M" />
          <Metric label="Likes" value="186K" />
          <Metric label="Comments" value="12.4K" />
          <Metric label="Avg view" value="6:42" />
        </div>
      </div>
    </VisualShell>
  );
}

/* ------------------------------- 4. Esports ------------------------------ */

const EDITIONS = [
  { year: "2024", hours: "24.6M", width: "60%" },
  { year: "2025", hours: "33.1M", width: "80%" },
  { year: "2026", hours: "41.2M", width: "100%" },
];

export function EsportsDashboard() {
  return (
    <VisualShell label="Esports" meta="Verified">
      <div className="grid gap-[16px]">
        <div>
          <p className="font-display text-foreground font-semibold">
            Ashfall Royale Masters — Berlin
          </p>
          <p className={cn(tinyLabel, "mt-[3px]")}>
            Tier 1 · 16 teams · 96h airtime
          </p>
        </div>
        <div className="grid grid-cols-3 gap-[12px]">
          <Metric accent label="Peak CCV" value="1.84M" />
          <Metric label="Avg CCV" value="812K" />
          <Metric label="Hours watched" value="41.2M" />
        </div>
        <div className="border-border grid gap-[8px] border-t pt-[14px]">
          <span className={tinyLabel}>Hours watched by edition</span>
          {EDITIONS.map((edition, index) => (
            <div
              className="grid grid-cols-[36px_1fr_auto] items-center gap-[10px]"
              key={edition.year}
            >
              <span className={tinyLabel}>{edition.year}</span>
              <div className="bg-border/50 h-[8px] overflow-hidden rounded-full">
                <div
                  className={cn(
                    "h-full rounded-full",
                    index === EDITIONS.length - 1
                      ? "bg-signal"
                      : "bg-signal/35",
                  )}
                  style={{ width: edition.width }}
                />
              </div>
              <span className="text-foreground font-mono text-[12px] tabular-nums">
                {edition.hours}
              </span>
            </div>
          ))}
        </div>
      </div>
    </VisualShell>
  );
}

/* -------------------------- 5. Dashboard builder ------------------------- */

const RANKING = [
  ["Novastrike", "8.4K"],
  ["Pixelhollow", "6.9K"],
  ["Duskraider", "5.2K"],
];

const PLATFORMS = [
  { name: "Twitch", share: "58%" },
  { name: "YouTube", share: "31%" },
  { name: "Kick", share: "11%" },
];

function WidgetTile({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border bg-background/70 rounded-lg border p-[12px] shadow-sm">
      <div className="mb-[10px] flex items-center justify-between gap-[8px]">
        <span className={tinyLabel}>{title}</span>
        <span aria-hidden="true" className="text-muted/60 text-[11px]">
          ⠿
        </span>
      </div>
      {children}
    </div>
  );
}

export function DashboardBuilder() {
  return (
    <VisualShell label="Dashboard builder" meta="Export-ready">
      <div className="grid gap-[12px] sm:grid-cols-2">
        <WidgetTile title="Channel ranking">
          <ul className="grid gap-[8px]">
            {RANKING.map(([channel, ccv], index) => (
              <li
                className="flex items-baseline gap-[8px] text-[13px]"
                key={channel}
              >
                <span className="text-signal w-[14px] font-mono text-[11px] tabular-nums">
                  {index + 1}
                </span>
                <span className="text-foreground truncate font-semibold">
                  {channel}
                </span>
                <span className="text-muted ml-auto font-mono text-[12px] tabular-nums">
                  {ccv}
                </span>
              </li>
            ))}
          </ul>
        </WidgetTile>
        <WidgetTile title="Platform comparison">
          <ul className="grid gap-[8px]">
            {PLATFORMS.map((platform, index) => (
              <li className="grid gap-[3px]" key={platform.name}>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted">{platform.name}</span>
                  <span className="text-foreground font-mono tabular-nums">
                    {platform.share}
                  </span>
                </div>
                <div className="bg-border/50 h-[5px] overflow-hidden rounded-full">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      index === 0 ? "bg-signal" : "bg-signal/35",
                    )}
                    style={{ width: platform.share }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </WidgetTile>
        <div className="border-border text-muted rounded-lg border border-dashed py-[14px] text-center font-mono text-[11px] tracking-[0.06em] uppercase sm:col-span-2">
          + Add widget
        </div>
      </div>
    </VisualShell>
  );
}
