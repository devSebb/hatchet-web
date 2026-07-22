import type { ComponentType } from "react";

import { VisualShell } from "@/components/solutions/visuals/VisualShell";
import type { VerticalSlug } from "@/lib/config/marketing";
import { cn } from "@/lib/utils";

/* Full-width product mocks for the who-we-serve pages, one per vertical,
 * recreated at high fidelity from the product team's July 2026 screenshots
 * (campaign engagement dashboard; game page with #ad stream titles; social
 * creator discovery; esports event overview; campaign posts grid). All data
 * fictional and consistent with the solutions-page mocks (Voidforge campaign,
 * Emberfall launch, Ashfall Royale Masters). Meter bars mirror the product's
 * per-metric colors as signal-opacity steps. */

const tinyLabel =
  "text-muted font-mono text-[10px] tracking-[0.08em] uppercase";

function FilterChip({
  children,
  active = false,
}: {
  children: string;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-[10px] py-[3px] font-mono text-[11px] tracking-[0.04em] whitespace-nowrap uppercase",
        active
          ? "border-transparent bg-signal text-white"
          : "border-border text-muted",
      )}
    >
      {children}
    </span>
  );
}

/** Product-style tab strip; active tab carries the signal underline. */
function TabStrip({
  tabs,
  className,
}: {
  tabs: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border flex gap-[18px] overflow-x-auto border-b px-[20px]",
        className,
      )}
    >
      {tabs.map((tab, index) => (
        <span
          className={cn(
            "border-b-2 pt-[10px] pb-[8px] font-mono text-[11px] tracking-[0.06em] whitespace-nowrap uppercase",
            index === 0
              ? "border-signal text-signal font-bold"
              : "text-muted border-transparent",
          )}
          key={tab}
        >
          {tab}
        </span>
      ))}
    </div>
  );
}

/** Bordered stat card matching the product's totals cards. */
function StatCard({
  label,
  value,
  note,
  accent = false,
  progress,
}: {
  label: string;
  value: string;
  note?: string;
  accent?: boolean;
  progress?: number;
}) {
  return (
    <div className="border-border bg-background/70 rounded-lg border px-[14px] py-[12px]">
      <p className={tinyLabel}>{label}</p>
      <p className="mt-[6px] flex items-baseline gap-[6px]">
        <span
          className={cn(
            "font-mono text-lg font-bold tabular-nums",
            accent ? "text-signal" : "text-foreground",
          )}
        >
          {value}
        </span>
        {note ? (
          <span className="small text-muted max-sm:hidden">{note}</span>
        ) : null}
      </p>
      {progress ? (
        <div className="bg-border mt-[8px] h-[3px] overflow-hidden rounded-full">
          <div
            className="bg-signal h-full rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

/** Metric cell with the product's value-over-meter reading. Meter opacity
 *  varies per column, echoing the product's per-metric colors. */
function MeterCell({
  value,
  meter,
  barClassName,
}: {
  value: string;
  meter: number;
  barClassName: string;
}) {
  return (
    <>
      <span className="text-foreground block font-mono text-[13px] font-bold tabular-nums">
        {value}
      </span>
      <span className="bg-border mt-[5px] block h-[3px] w-full max-w-[92px] overflow-hidden rounded-full">
        <span
          className={cn("block h-full rounded-full", barClassName)}
          style={{ width: `${meter * 100}%` }}
        />
      </span>
    </>
  );
}

/* ------------------------------- Brands --------------------------------- */

const AREA_W = 240;
const AREA_H = 72;

type AreaSeries = { data: number[]; opacity: number };

function AreaChart({ series }: { series: AreaSeries[] }) {
  const max = Math.max(...series.flatMap((s) => s.data));
  const step = AREA_W / (series[0].data.length - 1);
  const pad = 4;
  const toPoints = (data: number[]) =>
    data
      .map((value, index) => {
        const x = index * step;
        const y = AREA_H - pad - (value / max) * (AREA_H - pad * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  return (
    <svg
      aria-hidden="true"
      className="block w-full"
      viewBox={`0 0 ${AREA_W} ${AREA_H}`}
    >
      <line
        stroke="var(--signal-grid)"
        strokeWidth="1"
        x1="0"
        x2={AREA_W}
        y1={AREA_H - 1}
        y2={AREA_H - 1}
      />
      <line
        stroke="var(--signal-grid)"
        strokeDasharray="2 4"
        strokeWidth="0.75"
        x1="0"
        x2={AREA_W}
        y1={(AREA_H - pad) / 2 + pad / 2}
        y2={(AREA_H - pad) / 2 + pad / 2}
      />
      {series.map((s, index) => {
        const points = toPoints(s.data);
        return (
          <g key={index} opacity={s.opacity}>
            <path
              d={`M0,${AREA_H} L${points.replaceAll(" ", " L")} L${AREA_W},${AREA_H} Z`}
              fill="var(--signal)"
              opacity="0.14"
            />
            <polyline
              fill="none"
              points={points}
              stroke="var(--signal)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}
    </svg>
  );
}

const brandStatCards = [
  { label: "Likes", value: "1.4M" },
  { label: "Comments", value: "86K" },
  { label: "Shares", value: "24K" },
  { label: "Impressions", value: "26.9M", accent: true },
  { label: "Unique impressions", value: "18.2M" },
  { label: "Video views", value: "6.4M" },
];

const brandWideCards = [
  { label: "Engagement rate", value: "4.8%" },
  { label: "Followers", value: "66.9M" },
  { label: "Clicks", value: "112K" },
];

const brandCharts = [
  {
    title: "Impressions over time",
    description: "Total impressions on posts that are part of the campaign.",
    yTop: "30M",
    series: [
      { data: [3, 4, 4, 6, 8, 7, 11, 14, 13, 18, 23, 27], opacity: 1 },
      { data: [2, 2, 3, 3, 4, 5, 5, 7, 8, 9, 11, 12], opacity: 0.4 },
    ],
    legend: [
      { label: "Twitch", opacity: 1 },
      { label: "YouTube", opacity: 0.4 },
    ],
  },
  {
    title: "Likes over time",
    description: "Total likes on posts that are part of the campaign.",
    yTop: "120K",
    series: [
      { data: [5, 7, 6, 9, 11, 10, 13, 12, 16, 18, 17, 22], opacity: 1 },
      { data: [3, 3, 4, 5, 5, 6, 7, 7, 9, 10, 12, 13], opacity: 0.4 },
    ],
    legend: [
      { label: "Instagram", opacity: 1 },
      { label: "TikTok", opacity: 0.4 },
    ],
  },
  {
    title: "Comments over time",
    description: "Total comments on posts that are part of the campaign.",
    yTop: "15K",
    series: [
      { data: [2, 3, 5, 4, 6, 7, 6, 9, 8, 11, 13, 12], opacity: 1 },
      { data: [1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 9], opacity: 0.4 },
    ],
    legend: [
      { label: "YouTube", opacity: 1 },
      { label: "Instagram", opacity: 0.4 },
    ],
  },
];

const brandDates = ["Jun 02", "Jun 16", "Jun 30", "Jul 14"];

function BrandEngagement() {
  return (
    <VisualShell
      contentClassName="p-0"
      label="Campaigns · Voidforge launch"
      meta="Q3 2026"
    >
      <TabStrip tabs={["Dashboard", "Posts", "Creators"]} />
      <div className="border-border flex flex-wrap items-center gap-[8px] border-b px-[20px] py-[12px]">
        <FilterChip>Overview</FilterChip>
        <FilterChip active>Engagement</FilterChip>
        <FilterChip>Streaming</FilterChip>
        <span
          className={cn(
            tinyLabel,
            "border-border ml-auto rounded-md border px-[10px] py-[4px]",
          )}
        >
          Export <span className="text-signal">↓</span>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-[10px] px-[20px] pt-[16px] sm:grid-cols-3 lg:grid-cols-6">
        {brandStatCards.map((card) => (
          <StatCard
            accent={card.accent}
            key={card.label}
            label={card.label}
            value={card.value}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-[10px] px-[20px] pt-[10px]">
        {brandWideCards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} />
        ))}
      </div>
      <div className="grid gap-[14px] px-[20px] py-[16px] lg:grid-cols-3">
        {brandCharts.map((chart) => (
          <div
            className="border-border bg-background/70 rounded-lg border p-[14px]"
            key={chart.title}
          >
            <div className="flex items-start justify-between gap-[8px]">
              <p className="text-foreground text-[12px] font-semibold">
                {chart.title}
              </p>
              <span
                className={cn(
                  tinyLabel,
                  "border-border shrink-0 rounded-md border px-[7px] py-[2px]",
                )}
              >
                Export
              </span>
            </div>
            <p className="text-muted mt-[3px] text-[10px] leading-snug">
              {chart.description}
            </p>
            <div className="mt-[10px] flex gap-[6px]">
              <div className="flex shrink-0 flex-col justify-between pb-[2px]">
                <span className="text-muted font-mono text-[8px] tabular-nums">
                  {chart.yTop}
                </span>
                <span className="text-muted font-mono text-[8px] tabular-nums">
                  0
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <AreaChart series={chart.series} />
                <div className="mt-[3px] flex justify-between">
                  {brandDates.map((date) => (
                    <span
                      className="text-muted font-mono text-[8px] tabular-nums"
                      key={date}
                    >
                      {date}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-[8px] flex flex-wrap gap-x-[10px] gap-y-[2px]">
              {chart.legend.map((entry) => (
                <span
                  className="text-muted flex items-center gap-[5px] text-[10px]"
                  key={entry.label}
                >
                  <span
                    aria-hidden="true"
                    className="bg-signal size-[6px] rounded-[1px]"
                    style={{ opacity: entry.opacity }}
                  />
                  {entry.label}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
      <p className="border-border small text-muted border-t px-[20px] py-[10px]">
        Reach, brand lift, and engagement — translated past platform jargon.
      </p>
    </VisualShell>
  );
}

/* --------------------------- Game publishers ---------------------------- */

const gameTotals = [
  { label: "Titles", value: "214" },
  { label: "Hours watched", value: "118K", accent: true },
  { label: "Airtime", value: "890h" },
  { label: "Unique channels", value: "47" },
];

const adStreams = [
  {
    title: "Emberfall launch marathon — drops on #ad",
    date: "Jul 16, 06:49 PM – Jul 17, 07:01 PM",
    channel: "Novastrike",
    hours: "6.7K",
    hoursMeter: 1,
    peak: "1.4K",
    peakMeter: 1,
    avg: "888",
    avgMeter: 0.9,
    airtime: "7h 32m",
  },
  {
    title: "EMBERFALL day one w/ the squad #ad",
    date: "Jul 15, 11:54 AM – Jul 15, 04:01 PM",
    channel: "Forgeplays",
    hours: "4.1K",
    hoursMeter: 0.61,
    peak: "1.1K",
    peakMeter: 0.79,
    avg: "1,001",
    avgMeter: 1,
    airtime: "4h 08m",
  },
  {
    title: "new shooter just dropped !emberfall #ad",
    date: "Jul 14, 10:25 AM – Jul 14, 08:25 PM",
    channel: "Kaijukendra",
    hours: "3.9K",
    hoursMeter: 0.58,
    peak: "980",
    peakMeter: 0.7,
    avg: "392",
    avgMeter: 0.39,
    airtime: "10h 01m",
  },
  {
    title: "Emberfall ranked grind, sponsored stream #ad",
    date: "Jul 13, 09:43 AM – Jul 13, 03:45 PM",
    channel: "Miravex",
    hours: "2.2K",
    hoursMeter: 0.33,
    peak: "540",
    peakMeter: 0.39,
    avg: "338",
    avgMeter: 0.34,
    airtime: "6h 03m",
  },
];

const gameProfile = [
  { label: "Released", value: "Jul 2026" },
  { label: "Franchise", value: "Emberfall" },
  { label: "Publisher", value: "Voltcore Games" },
];

function PublisherGamePage() {
  return (
    <VisualShell
      contentClassName="p-0"
      label="Game · Emberfall"
      meta="Launch week"
    >
      <div className="grid lg:grid-cols-[212px_minmax(0,1fr)]">
        {/* Game profile sidebar, echoing the product's left card. */}
        <aside className="border-border border-b p-[16px] max-lg:hidden lg:border-r lg:border-b-0">
          <div
            className="flex h-[104px] items-end rounded-md p-[10px]"
            style={{
              backgroundImage:
                "linear-gradient(150deg, var(--brand-lowlight) 0%, var(--brand) 70%, #e23c42 100%)",
            }}
          >
            <span className="font-mono text-[12px] font-bold tracking-[0.14em] text-white uppercase">
              Emberfall
            </span>
          </div>
          <p className={cn(tinyLabel, "mt-[14px]")}>Ranking</p>
          <dl className="mt-[6px] grid grid-cols-3 gap-[6px]">
            {[
              { label: "Top", value: "#2", accent: true },
              { label: "Avg", value: "4" },
              { label: "Lowest", value: "18" },
            ].map((rank) => (
              <div key={rank.label}>
                <dd
                  className={cn(
                    "font-mono text-[13px] font-bold tabular-nums",
                    rank.accent ? "text-signal" : "text-foreground",
                  )}
                >
                  {rank.value}
                </dd>
                <dt className={tinyLabel}>{rank.label}</dt>
              </div>
            ))}
          </dl>
          <dl className="border-border mt-[12px] grid gap-[8px] border-t pt-[12px]">
            {gameProfile.map((row) => (
              <div key={row.label}>
                <dt className={tinyLabel}>{row.label}</dt>
                <dd className="text-foreground text-[12px] font-medium">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className={cn(tinyLabel, "mt-[12px]")}>Genres</p>
          <p className="mt-[6px] flex flex-wrap gap-[4px]">
            {["Shooter", "Battle Royale"].map((genre) => (
              <span
                className="border-border text-muted rounded-full border px-[8px] py-[1px] font-mono text-[10px] uppercase"
                key={genre}
              >
                {genre}
              </span>
            ))}
          </p>
          <p className={cn(tinyLabel, "mt-[10px]")}>Platforms</p>
          <p className="mt-[6px] flex flex-wrap gap-[4px]">
            {["PC", "PlayStation", "Xbox", "Mobile"].map((platform) => (
              <span
                className="border-border text-muted rounded-full border px-[8px] py-[1px] font-mono text-[10px] uppercase"
                key={platform}
              >
                {platform}
              </span>
            ))}
          </p>
        </aside>

        <div className="min-w-0">
          <TabStrip
            tabs={[
              "Stream Titles",
              "Viewership",
              "Top Channels",
              "Sessions",
              "Tournaments",
              "VODs",
            ]}
          />
          <div className="border-border flex flex-wrap gap-[8px] border-b px-[20px] py-[12px]">
            <FilterChip>Jul 13 – Jul 20 · CET</FilterChip>
            <FilterChip active>At least one: #ad</FilterChip>
            <FilterChip>Twitch</FilterChip>
            <FilterChip>YouTube Gaming</FilterChip>
            <FilterChip>+10 platforms</FilterChip>
          </div>
          <div className="border-border flex flex-wrap items-center gap-x-[24px] gap-y-[10px] border-b px-[20px] py-[12px]">
            {gameTotals.map((total) => (
              <div key={total.label}>
                <p
                  className={cn(
                    "font-mono text-base font-bold tabular-nums",
                    total.accent ? "text-signal" : "text-foreground",
                  )}
                >
                  {total.value}
                </p>
                <p className={tinyLabel}>{total.label}</p>
              </div>
            ))}
            <span
              className={cn(
                tinyLabel,
                "border-border ml-auto rounded-md border px-[10px] py-[4px]",
              )}
            >
              Export stream titles <span className="text-signal">↓</span>
            </span>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-border border-b">
                <th className="text-muted px-[20px] py-[9px] font-mono text-[10px] font-medium tracking-[0.08em] uppercase">
                  Stream title
                </th>
                <th className="text-muted px-[12px] py-[9px] font-mono text-[10px] font-medium tracking-[0.08em] uppercase max-md:hidden">
                  Channel
                </th>
                <th className="text-muted px-[12px] py-[9px] font-mono text-[10px] font-medium tracking-[0.08em] uppercase">
                  Hours watched
                </th>
                <th className="text-muted px-[12px] py-[9px] font-mono text-[10px] font-medium tracking-[0.08em] uppercase max-sm:hidden">
                  Peak CCV
                </th>
                <th className="text-muted px-[12px] py-[9px] font-mono text-[10px] font-medium tracking-[0.08em] uppercase max-lg:hidden">
                  Avg CCV
                </th>
                <th className="text-muted px-[12px] py-[9px] text-right font-mono text-[10px] font-medium tracking-[0.08em] uppercase max-lg:hidden">
                  Airtime
                </th>
              </tr>
            </thead>
            <tbody>
              {adStreams.map((stream) => (
                <tr
                  className="border-border border-b last:border-b-0"
                  key={stream.title}
                >
                  <td className="max-w-[260px] px-[20px] py-[11px]">
                    <span className="text-foreground block truncate text-[13px] font-medium">
                      {stream.title}
                    </span>
                    <span className={cn(tinyLabel, "mt-[3px] block")}>
                      {stream.date}
                    </span>
                  </td>
                  <td className="px-[12px] py-[11px] max-md:hidden">
                    <span className="flex items-center gap-[8px]">
                      <span
                        aria-hidden="true"
                        className="bg-signal/10 text-signal grid size-[22px] shrink-0 place-items-center rounded-full font-mono text-[10px]"
                      >
                        {stream.channel[0]}
                      </span>
                      <span className="min-w-0">
                        <span className="text-foreground block truncate text-[12px] font-semibold">
                          {stream.channel}
                        </span>
                        <span className={tinyLabel}>Twitch · EN</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-[12px] py-[11px]">
                    <MeterCell
                      barClassName="bg-signal"
                      meter={stream.hoursMeter}
                      value={stream.hours}
                    />
                  </td>
                  <td className="px-[12px] py-[11px] max-sm:hidden">
                    <MeterCell
                      barClassName="bg-signal/60"
                      meter={stream.peakMeter}
                      value={stream.peak}
                    />
                  </td>
                  <td className="px-[12px] py-[11px] max-lg:hidden">
                    <MeterCell
                      barClassName="bg-signal/35"
                      meter={stream.avgMeter}
                      value={stream.avg}
                    />
                  </td>
                  <td className="text-foreground px-[12px] py-[11px] text-right font-mono text-[13px] tabular-nums max-lg:hidden">
                    {stream.airtime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-border small text-muted border-t px-[20px] py-[10px]">
            Every sponsored stream auto-tracked from shortlist to attribution.
          </p>
        </div>
      </div>
    </VisualShell>
  );
}

/* ------------------------ Market research agencies ----------------------- */

const socialTotals = [
  {
    label: "Unique creators",
    value: "28.0M",
    note: "of 52.4M",
    progress: 0.53,
  },
  { label: "Total followers", value: "703B", note: "across all socials" },
  { label: "Total actions", value: "41.2B" },
  { label: "Avg engagement", value: "1.2%", note: "all platforms" },
  { label: "Avg posts / week", value: "3.4" },
];

const socialRows = [
  {
    creator: "Lumen & Lark",
    lang: "EN",
    platforms: ["TikTok", "IG", "YT"],
    followers: "4.2M",
    meter: 1,
    delta: "↑ 9.5%",
    up: true,
    engagement: "6.1%",
  },
  {
    creator: "Pixelhollow",
    lang: "EN",
    platforms: ["YT", "IG", "X"],
    followers: "2.8M",
    meter: 0.67,
    delta: "↑ 12.1%",
    up: true,
    engagement: "4.8%",
  },
  {
    creator: "Duskrunner",
    lang: "ES",
    platforms: ["IG", "TikTok"],
    followers: "1.9M",
    meter: 0.45,
    delta: "↑ 2.4%",
    up: true,
    engagement: "9.1%",
  },
  {
    creator: "Kaijukendra",
    lang: "JP",
    platforms: ["X", "YT"],
    followers: "1.1M",
    meter: 0.26,
    delta: "↓ 0.6%",
    up: false,
    engagement: "7.4%",
  },
  {
    creator: "Glasscannon",
    lang: "EN",
    platforms: ["TikTok", "X"],
    followers: "864K",
    meter: 0.21,
    delta: "↑ 4.2%",
    up: true,
    engagement: "5.5%",
  },
];

function ResearchSocialDiscovery() {
  return (
    <VisualShell
      contentClassName="p-0"
      label="Creator discovery — social"
      meta="API-verified · 10+ yrs history"
    >
      <div className="border-border flex flex-wrap items-center gap-[8px] border-b px-[20px] py-[12px]">
        <FilterChip>Live streaming</FilterChip>
        <FilterChip>Combined</FilterChip>
        <FilterChip active>Social</FilterChip>
        <span className="ml-auto flex gap-[8px] max-sm:hidden">
          <FilterChip>Saved</FilterChip>
          <FilterChip>+ New search</FilterChip>
        </span>
      </div>
      <div className="border-border flex flex-wrap gap-[8px] border-b px-[20px] py-[10px]">
        <FilterChip>TikTok Live</FilterChip>
        <FilterChip>Instagram</FilterChip>
        <FilterChip>X / Twitter</FilterChip>
        <FilterChip>+2 social platforms</FilterChip>
        <FilterChip>Max followers: 1M</FilterChip>
      </div>
      <div className="grid grid-cols-2 gap-[10px] px-[20px] pt-[14px] sm:grid-cols-3 lg:grid-cols-5">
        {socialTotals.map((total) => (
          <StatCard
            key={total.label}
            label={total.label}
            note={total.note}
            progress={total.progress}
            value={total.value}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-[8px] px-[20px] py-[12px]">
        <FilterChip>🔥 Trending</FilterChip>
        <FilterChip>📈 Fast growing</FilterChip>
        <FilterChip>✦ High engagement</FilterChip>
        <span className={cn(tinyLabel, "ml-auto max-md:hidden")}>
          Sort by: Total followers · Descending
        </span>
      </div>
      <p className={cn(tinyLabel, "px-[20px] pb-[8px]")}>
        Showing 100 of 28,044,624 creators
      </p>
      <table className="w-full text-left">
        <thead>
          <tr className="border-border border-y">
            <th className="text-muted py-[9px] pr-[8px] pl-[20px] font-mono text-[10px] font-medium tracking-[0.08em] uppercase">
              #
            </th>
            <th className="text-muted px-[12px] py-[9px] font-mono text-[10px] font-medium tracking-[0.08em] uppercase">
              Name
            </th>
            <th className="text-muted px-[12px] py-[9px] font-mono text-[10px] font-medium tracking-[0.08em] uppercase max-md:hidden">
              Platforms
            </th>
            <th className="text-muted px-[12px] py-[9px] font-mono text-[10px] font-medium tracking-[0.08em] uppercase">
              Total followers
            </th>
            <th className="text-muted px-[12px] py-[9px] font-mono text-[10px] font-medium tracking-[0.08em] uppercase max-sm:hidden">
              Growth
            </th>
            <th className="text-muted px-[12px] py-[9px] text-right font-mono text-[10px] font-medium tracking-[0.08em] uppercase max-lg:hidden">
              Eng. rate
            </th>
          </tr>
        </thead>
        <tbody>
          {socialRows.map((row, index) => (
            <tr
              className="border-border border-b last:border-b-0"
              key={row.creator}
            >
              <td className="text-signal py-[11px] pr-[8px] pl-[20px] font-mono text-[11px] tabular-nums">
                {index + 1}
              </td>
              <td className="px-[12px] py-[11px]">
                <span className="flex items-center gap-[8px]">
                  <span
                    aria-hidden="true"
                    className="bg-signal/10 text-signal grid size-[22px] shrink-0 place-items-center rounded-full font-mono text-[10px]"
                  >
                    {row.creator[0]}
                  </span>
                  <span className="text-foreground truncate text-[13px] font-semibold">
                    {row.creator}
                  </span>
                  <span className="border-border text-muted rounded-sm border px-[4px] font-mono text-[9px] uppercase">
                    {row.lang}
                  </span>
                </span>
              </td>
              <td className="px-[12px] py-[11px] max-md:hidden">
                <span className="flex flex-wrap gap-[4px]">
                  {row.platforms.map((platform) => (
                    <span
                      className="border-border text-muted rounded-sm border px-[5px] py-[1px] font-mono text-[9px] uppercase"
                      key={platform}
                    >
                      {platform}
                    </span>
                  ))}
                </span>
              </td>
              <td className="px-[12px] py-[11px]">
                <MeterCell
                  barClassName="bg-signal/60"
                  meter={row.meter}
                  value={row.followers}
                />
              </td>
              <td
                className={cn(
                  "px-[12px] py-[11px] font-mono text-[11px] tabular-nums max-sm:hidden",
                  row.up ? "text-signal" : "text-muted",
                )}
              >
                {row.delta}
              </td>
              <td className="text-foreground px-[12px] py-[11px] text-right font-mono text-[13px] tabular-nums max-lg:hidden">
                {row.engagement}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-border small text-muted border-t px-[20px] py-[10px]">
        Every figure traces back to its source — no estimates, no sampling.
      </p>
    </VisualShell>
  );
}

/* --------------------------- Esports organizers -------------------------- */

type GaugeSegment = { label: string; share: number; opacity: number };

const GAUGE_R = 40;
const GAUGE_C = Math.PI * GAUGE_R;

function GaugeDonut({
  title,
  center,
  segments,
}: {
  title: string;
  center: string;
  segments: GaugeSegment[];
}) {
  // Precompute each arc's start offset along the semicircle.
  const arcs = segments.map((segment, index) => ({
    ...segment,
    length: segment.share * GAUGE_C,
    offset: segments
      .slice(0, index)
      .reduce((sum, prev) => sum + prev.share * GAUGE_C, 0),
  }));
  return (
    <div>
      <p className={cn(tinyLabel, "text-center")}>{title}</p>
      <svg
        aria-hidden="true"
        className="mx-auto mt-[10px] block w-full max-w-[190px]"
        viewBox="0 0 100 54"
      >
        {arcs.map((arc) => (
          <path
            d={`M 10 50 A ${GAUGE_R} ${GAUGE_R} 0 0 1 90 50`}
            fill="none"
            key={arc.label}
            stroke="var(--signal)"
            strokeDasharray={`${arc.length} ${GAUGE_C}`}
            strokeDashoffset={-arc.offset}
            strokeOpacity={arc.opacity}
            strokeWidth="11"
          />
        ))}
        <text
          fontFamily="var(--font-mono, monospace)"
          fontSize="11"
          fontWeight="700"
          style={{ fill: "var(--foreground)" }}
          textAnchor="middle"
          x="50"
          y="48"
        >
          {center}
        </text>
      </svg>
      <ul className="mt-[10px] flex flex-wrap justify-center gap-x-[12px] gap-y-[4px]">
        {segments.map((segment) => (
          <li
            className="text-muted flex items-center gap-[5px] text-[10px]"
            key={segment.label}
          >
            <span
              aria-hidden="true"
              className="bg-signal size-[7px] rounded-[1px]"
              style={{ opacity: segment.opacity }}
            />
            {segment.label} {Math.round(segment.share * 100)}%
          </li>
        ))}
      </ul>
    </div>
  );
}

const eventTotals = [
  { label: "Hours watched", value: "41.2M", accent: true },
  { label: "Peak CCV", value: "1.84M" },
  { label: "Average CCV", value: "812K" },
  { label: "Airtime", value: "34h 58m" },
  { label: "Unique channels", value: "698" },
];

const eventGauges: Array<{
  title: string;
  center: string;
  segments: GaugeSegment[];
}> = [
  {
    title: "Platforms by hours watched",
    center: "41.2M",
    segments: [
      { label: "Twitch", share: 0.46, opacity: 1 },
      { label: "YouTube", share: 0.31, opacity: 0.65 },
      { label: "Kick", share: 0.12, opacity: 0.4 },
      { label: "Other", share: 0.11, opacity: 0.18 },
    ],
  },
  {
    title: "Official vs. co-stream",
    center: "38%",
    segments: [
      { label: "Official", share: 0.62, opacity: 1 },
      { label: "Co-streamers", share: 0.38, opacity: 0.4 },
    ],
  },
  {
    title: "Top languages",
    center: "24",
    segments: [
      { label: "EN", share: 0.41, opacity: 1 },
      { label: "KR", share: 0.22, opacity: 0.65 },
      { label: "ES", share: 0.15, opacity: 0.4 },
      { label: "Other", share: 0.22, opacity: 0.18 },
    ],
  },
];

function EsportsEventOverview() {
  return (
    <VisualShell
      contentClassName="p-0"
      label="Esports · Event"
      meta="Verified · CET"
    >
      <div className="border-border flex flex-wrap gap-[8px] border-b px-[20px] py-[10px]">
        <FilterChip>Jun 12 – Jun 28 · CET</FilterChip>
        <FilterChip active>Twitch</FilterChip>
        <FilterChip>YouTube Gaming</FilterChip>
        <FilterChip>SOOP Korea</FilterChip>
        <FilterChip>+4 platforms</FilterChip>
      </div>
      <div className="border-border flex flex-wrap items-start gap-[16px] border-b px-[20px] py-[14px]">
        <span
          aria-hidden="true"
          className="grid size-[56px] shrink-0 place-items-center rounded-md font-mono text-[13px] font-bold text-white"
          style={{
            backgroundImage:
              "linear-gradient(150deg, var(--brand-lowlight) 0%, var(--brand) 70%, #e23c42 100%)",
          }}
        >
          ARM
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-foreground text-sm font-semibold">
            Ashfall Royale Masters — Berlin
          </p>
          <p className={cn(tinyLabel, "mt-[3px]")}>
            Voltcore Esports · Ashfall Royale · Tier 1
          </p>
          <div className="mt-[8px] flex max-w-[300px] items-center gap-[8px]">
            <span className={tinyLabel}>Jun 12</span>
            <span className="bg-border h-[4px] flex-1 overflow-hidden rounded-full">
              <span className="bg-signal block h-full w-[72%] rounded-full" />
            </span>
            <span className={tinyLabel}>Jun 28</span>
          </div>
          <p className={cn(tinyLabel, "mt-[6px]")}>
            Global · Berlin · $1.2M prize pool · 16 teams
          </p>
        </div>
        <div className="flex flex-col items-end gap-[8px] max-sm:hidden">
          <span className="flex gap-[8px]">
            <FilterChip>☆ Add to favorites</FilterChip>
            <FilterChip>Share event</FilterChip>
          </span>
          <span className={tinyLabel}>Last updated: Jun 28, 10:56 AM</span>
        </div>
      </div>
      <TabStrip
        tabs={[
          "Overview",
          "Channels Breakdown",
          "Platforms Breakdown",
          "Languages",
          "Phases & Streams",
          "Past Events",
        ]}
      />
      <div className="px-[20px] pt-[14px]">
        <p className={tinyLabel}>Totals — entire event data</p>
        <div className="mt-[8px] grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:grid-cols-5">
          {eventTotals.map((total) => (
            <StatCard
              accent={total.accent}
              key={total.label}
              label={total.label}
              value={total.value}
            />
          ))}
        </div>
      </div>
      <div className="grid gap-[20px] px-[20px] py-[18px] sm:grid-cols-3">
        {eventGauges.map((gauge) => (
          <GaugeDonut
            center={gauge.center}
            key={gauge.title}
            segments={gauge.segments}
            title={gauge.title}
          />
        ))}
      </div>
      <div className="border-border flex flex-wrap items-center gap-[8px] border-t px-[20px] py-[12px]">
        <span className={cn(tinyLabel, "mr-[4px]")}>Viewers</span>
        <FilterChip active>Aggregated</FilterChip>
        <FilterChip>Channels</FilterChip>
        <FilterChip>Platforms</FilterChip>
        <FilterChip>Co-streaming</FilterChip>
        <span className={cn(tinyLabel, "ml-auto max-sm:hidden")}>
          + Save segment
        </span>
      </div>
    </VisualShell>
  );
}

/* ----------------------- Marketing & talent agencies --------------------- */

const taggedPosts = [
  {
    channel: "Novastrike",
    platform: "Twitch",
    time: "Jun 05, 4:40 AM",
    title: "❤️ SOLO QUEUE RANKED — Emberfall drops on! #ad",
    caption: "LIVE weekdays 7PM · discord.gg/novastrike · code NOVA15",
    views: "44K",
    likes: "1.2K",
    comments: "99",
  },
  {
    channel: "Duskrunner",
    platform: "TikTok",
    time: "Jun 05, 2:27 AM",
    title: "POV: your duo finally installs Emberfall 😤 #sponsored",
    caption: "the ranked grind starts NOW — full VOD on the channel",
    views: "312K",
    likes: "28K",
    comments: "640",
  },
  {
    channel: "Pixelhollow",
    platform: "YouTube",
    time: "Jun 04, 11:02 PM",
    title: "I played the Emberfall beta so you don't have to",
    caption: "Full review: gunplay, movement, and whether it's worth it…",
    views: "186K",
    likes: "9.4K",
    comments: "1.1K",
  },
  {
    channel: "Miravex",
    platform: "Kick",
    time: "Jun 04, 9:13 PM",
    title: "emberfall ranked grind w/ new code MIRA15",
    caption: "drops enabled all stream — !emberfall for loadouts",
    views: "12K",
    likes: "480",
    comments: "52",
  },
];

function AgencyPostsGrid() {
  return (
    <VisualShell
      contentClassName="p-0"
      label="Campaigns · Voidforge launch"
      meta="Q3 2026"
    >
      <TabStrip tabs={["Posts", "Dashboard", "Creators"]} />
      <div className="border-border flex flex-wrap items-center gap-[8px] border-b px-[20px] py-[12px]">
        <FilterChip active>Tagged</FilterChip>
        <FilterChip>Brand posts</FilterChip>
        <FilterChip>All posts</FilterChip>
        <span className={cn(tinyLabel, "ml-auto max-sm:hidden")}>
          Sort: date posted (new to old) · Filters
        </span>
      </div>
      <p className={cn(tinyLabel, "px-[20px] pt-[12px]")}>
        Showing 4 of 65 posts
      </p>
      <div className="grid gap-[12px] p-[16px] pt-[10px] sm:grid-cols-2 lg:grid-cols-4">
        {taggedPosts.map((post) => (
          <article
            className="border-border bg-background/70 flex flex-col rounded-lg border p-[12px]"
            key={post.channel}
          >
            <div className="flex items-center gap-[8px]">
              <span
                aria-hidden="true"
                className="bg-signal/10 text-signal grid size-[20px] shrink-0 place-items-center rounded-full font-mono text-[9px]"
              >
                {post.channel[0]}
              </span>
              <span className="text-foreground min-w-0 flex-1 truncate text-[12px] font-semibold">
                {post.channel}
              </span>
              <span
                aria-hidden="true"
                className="border-border size-[12px] shrink-0 rounded-[3px] border"
              />
            </div>
            <p className={cn(tinyLabel, "mt-[3px]")}>
              {post.platform} · {post.time}
            </p>
            <div
              aria-hidden="true"
              className="mt-[10px] grid aspect-video place-items-center rounded-md"
              style={{
                backgroundImage:
                  "linear-gradient(150deg, var(--brand-lowlight) 0%, var(--brand) 78%, #e23c42 100%)",
              }}
            >
              <span className="grid size-[28px] place-items-center rounded-full bg-white/20 text-[11px] text-white">
                ▶
              </span>
            </div>
            <p className="text-foreground mt-[10px] line-clamp-2 text-[12px] leading-snug font-semibold">
              {post.title}
            </p>
            <p className="text-muted mt-[4px] line-clamp-2 flex-1 text-[11px] leading-snug">
              {post.caption}{" "}
              <span className="text-signal underline">Read more…</span>
            </p>
            <div className="border-border mt-[10px] flex items-center gap-[8px] border-t pt-[9px]">
              <span aria-hidden="true" className="text-muted text-[12px]">
                ☆
              </span>
              <span className="bg-signal rounded-md px-[8px] py-[2px] font-mono text-[9px] font-bold tracking-[0.06em] text-white uppercase">
                Untag
              </span>
              <span className="text-muted ml-auto flex gap-[8px] font-mono text-[10px] tabular-nums">
                <span>▶ {post.views}</span>
                <span>♡ {post.likes}</span>
                <span className="max-lg:hidden">❝ {post.comments}</span>
              </span>
            </div>
          </article>
        ))}
      </div>
      <p className="border-border small text-muted border-t px-[20px] py-[10px]">
        Every client post auto-collected across platforms — no spreadsheets.
      </p>
    </VisualShell>
  );
}

/* -------------------------------- Registry ------------------------------- */

export const verticalProductVisuals: Record<VerticalSlug, ComponentType> = {
  brands: BrandEngagement,
  "games-publishers": PublisherGamePage,
  "market-research-agencies": ResearchSocialDiscovery,
  "esports-organizers": EsportsEventOverview,
  "marketing-and-talent-agencies": AgencyPostsGrid,
};
