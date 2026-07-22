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

const mentionFilters = [
  { label: 'At least one: "Voltcore"', active: true },
  { label: "Twitch" },
  { label: "YouTube Gaming" },
  { label: "+7 platforms" },
];

const mentionTotals = [
  { label: "Titles matched", value: "499", accent: true },
  { label: "Unique channels", value: "256" },
  { label: "Hours watched", value: "878K" },
];

export function MentionTracker() {
  return (
    <VisualShell label="Brand mentions" meta="Live · 32 platforms">
      <div className="grid gap-[16px]">
        <div className="flex flex-wrap gap-[6px]">
          {mentionFilters.map((filter) => (
            <span
              className={cn(
                "rounded-full border px-[10px] py-[2px] font-mono text-[10px] tracking-[0.04em] uppercase",
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
        <div className="grid grid-cols-3 gap-[12px]">
          {mentionTotals.map((total) => (
            <Metric
              accent={total.accent}
              key={total.label}
              label={total.label}
              value={total.value}
            />
          ))}
        </div>
        <TrendChart
          data={[12, 18, 15, 24, 21, 30, 27, 38, 34, 46, 52, 61]}
          height={44}
        />
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

const groupTabs = [
  { label: "Core roster", active: true },
  { label: "Prospects Q3" },
  { label: "Competitor set" },
];

const groupTotals = [
  { label: "Hours watched", value: "1.2M", accent: true },
  { label: "Peak CCV", value: "24.8K" },
  { label: "Unified airtime", value: "44h 58m" },
];

const groupChannels = [
  { channel: "Novastrike", platform: "Twitch", hours: "412K", meter: 1 },
  { channel: "Pixelhollow", platform: "YouTube", hours: "298K", meter: 0.72 },
  { channel: "Kaijukendra", platform: "Twitch", hours: "213K", meter: 0.52 },
  { channel: "Duskraider", platform: "Kick", hours: "148K", meter: 0.36 },
];

export function GroupsTable() {
  return (
    <VisualShell label="Groups" meta="14 channels">
      <div className="flex flex-wrap gap-[6px]">
        {groupTabs.map((tab) => (
          <span
            className={cn(
              "rounded-full border px-[10px] py-[2px] font-mono text-[10px] tracking-[0.04em] uppercase",
              tab.active
                ? "border-transparent bg-signal text-white"
                : "border-border text-muted",
            )}
            key={tab.label}
          >
            {tab.label}
          </span>
        ))}
      </div>
      <div className="mt-[14px] grid grid-cols-3 gap-[12px]">
        {groupTotals.map((total) => (
          <Metric
            accent={total.accent}
            key={total.label}
            label={total.label}
            value={total.value}
          />
        ))}
      </div>
      <ul className="border-border mt-[14px] grid gap-[10px] border-t pt-[14px]">
        {groupChannels.map((row, index) => (
          <li
            className="grid grid-cols-[14px_minmax(0,1.2fr)_auto_minmax(0,1fr)_44px] items-center gap-[10px]"
            key={row.channel}
          >
            <span className="text-signal font-mono text-[11px] tabular-nums">
              {index + 1}
            </span>
            <span className="small text-foreground truncate font-semibold">
              {row.channel}
            </span>
            <Pill>{row.platform}</Pill>
            <span className="bg-border h-[4px] overflow-hidden rounded-full">
              <span
                className="bg-signal block h-full rounded-full"
                style={{ width: `${row.meter * 100}%` }}
              />
            </span>
            <span className="text-foreground text-right font-mono text-[12px] tabular-nums">
              {row.hours}
            </span>
          </li>
        ))}
      </ul>
      <p className="small text-muted border-border mt-[12px] border-t pt-[12px]">
        Every stat rolls up to the group — one view for the whole roster.
      </p>
    </VisualShell>
  );
}

/* ------------------------------ 3. VOD trend ------------------------------ */

export function VodTrend() {
  return (
    <VisualShell label="VOD analytics" meta="VODs + Shorts">
      <div className="grid gap-[16px]">
        <div className="flex items-center gap-[8px]">
          <span className="small text-foreground truncate font-semibold">
            Ashfall Royale — Season 6 finale recap
          </span>
          <Pill>YouTube</Pill>
          <span className={cn(tinyLabel, "ml-auto shrink-0")}>18:24</span>
        </div>
        <TrendChart
          data={[8, 22, 41, 38, 52, 49, 64, 60, 74, 71, 82, 80, 90, 96]}
          height={72}
        />
        <div className="grid grid-cols-4 gap-[12px]">
          <Metric label="First 24h" value="1.4M" />
          <Metric label="First 3d" value="2.6M" />
          <Metric label="First 7d" value="3.5M" />
          <Metric accent label="Views" value="4.2M" />
        </div>
        <div className="border-border flex items-center gap-[8px] border-t pt-[14px]">
          <span className="small text-foreground truncate font-semibold">
            Clutch ace at the buzzer #shorts
          </span>
          <Pill>Short</Pill>
          <span className={cn(tinyLabel, "shrink-0")}>0:38</span>
          <span className="text-foreground ml-auto font-mono text-sm font-bold tabular-nums">
            2.3M
          </span>
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
            Tier 1 · Berlin · $1.2M prize pool · 16 teams
          </p>
        </div>
        <div className="grid grid-cols-3 gap-[12px]">
          <Metric accent label="Peak CCV" value="1.84M" />
          <Metric label="Hours watched" value="41.2M" />
          <Metric label="Co-stream share" value="38%" />
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
