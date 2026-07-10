import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { VisualShell } from "./VisualShell";

/* Product mocks for /solutions/reporting, following the copy doc's [Visual: …]
 * notes (campaign dashboard with per-creator breakdown; custom report covers,
 * one per category). All data fictional. */

const campaignStats = [
  { label: "Total Reach", value: "12.8M", accent: true },
  { label: "Brand Mentions", value: "1,842" },
  { label: "Active Creators", value: "47" },
  { label: "Video Views", value: "6.4M" },
];

const campaignColumns = ["Posts", "Hours", "Avg Viewers", "Reach"] as const;

const campaignRows = [
  {
    creator: "Novastrike",
    platform: "Twitch",
    posts: "24",
    hours: "118",
    viewers: "12.4K",
    reach: "3.1M",
  },
  {
    creator: "Duskrunner",
    platform: "TikTok",
    posts: "31",
    hours: "—",
    viewers: "—",
    reach: "4.2M",
  },
  {
    creator: "Pixelhollow",
    platform: "YouTube",
    posts: "12",
    hours: "36",
    viewers: "8.2K",
    reach: "2.4M",
  },
  {
    creator: "Kaijukendra",
    platform: "Twitch",
    posts: "18",
    hours: "92",
    viewers: "6.8K",
    reach: "1.9M",
  },
  {
    creator: "Emberlynx",
    platform: "YouTube",
    posts: "9",
    hours: "22",
    viewers: "5.1K",
    reach: "1.2M",
  },
];

export function CampaignBreakdown() {
  return (
    <VisualShell
      contentClassName="p-0"
      label="Campaign report"
      meta="Voidforge launch · Q3"
    >
      <dl className="border-border grid grid-cols-2 gap-[16px] border-b px-[20px] py-[16px] md:grid-cols-4">
        {campaignStats.map((stat) => (
          <div key={stat.label}>
            <dd
              className={cn(
                "font-mono text-lg font-bold tabular-nums",
                stat.accent ? "text-signal" : "text-foreground",
              )}
            >
              {stat.value}
            </dd>
            <dt className="text-muted mt-[2px] font-mono text-[10px] tracking-[0.08em] uppercase">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
      <table className="w-full text-left">
        <thead>
          <tr className="border-border border-b">
            <th className="text-muted px-[20px] py-[10px] font-mono text-[11px] font-medium tracking-[0.08em] uppercase">
              Creator
            </th>
            {campaignColumns.map((column) => (
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
          {campaignRows.map((row) => (
            <tr
              className="border-border border-b last:border-b-0"
              key={row.creator}
            >
              <td className="px-[20px] py-[12px]">
                <span className="flex items-center gap-[10px]">
                  <span aria-hidden="true" className="text-muted text-[10px]">
                    ▸
                  </span>
                  <span className="text-foreground text-sm font-semibold">
                    {row.creator}
                  </span>
                  <span className="border-border text-muted rounded-sm border px-[6px] py-[1px] font-mono text-[10px] tracking-[0.06em] uppercase">
                    {row.platform}
                  </span>
                </span>
              </td>
              {[row.posts, row.hours, row.viewers].map((value, index) => (
                <td
                  className="text-foreground px-[16px] py-[12px] text-right font-mono text-sm tabular-nums max-md:hidden"
                  key={campaignColumns[index]}
                >
                  {value}
                </td>
              ))}
              <td className="text-signal px-[16px] py-[12px] text-right font-mono text-sm font-bold tabular-nums">
                {row.reach}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-border flex items-center justify-between gap-[16px] border-t px-[20px] py-[10px]">
        <span className="text-muted font-mono text-[10px] tracking-[0.08em] uppercase">
          Showing 5 of 47 creators
        </span>
        <span className="border-border text-foreground flex items-center gap-[6px] rounded-md border px-[10px] py-[4px] font-mono text-[10px] font-medium tracking-[0.06em] uppercase">
          Export to Excel
          <span aria-hidden="true" className="text-signal">
            ↓
          </span>
        </span>
      </div>
    </VisualShell>
  );
}

/* --- Custom report gallery ---------------------------------------------- */

// Tiny abstract chart marks for the report covers. Static SVGs, brand red only.
function MiniBars() {
  const heights = [12, 22, 16, 30, 20, 26];
  return (
    <svg aria-hidden="true" className="block h-[36px] w-full" viewBox="0 0 76 36">
      {heights.map((height, index) => (
        <rect
          fill="var(--brand)"
          fillOpacity={index === 3 ? 1 : 0.45}
          height={height}
          key={index}
          rx={1.5}
          width={7}
          x={index * 13 + 1}
          y={36 - height}
        />
      ))}
    </svg>
  );
}

function MiniLine({ dual = false }: { dual?: boolean }) {
  return (
    <svg aria-hidden="true" className="block h-[36px] w-full" viewBox="0 0 76 36">
      <polyline
        fill="none"
        points="2,30 15,24 28,26 41,15 54,18 74,4"
        stroke="var(--brand)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      {dual ? (
        <polyline
          fill="none"
          points="2,33 15,30 28,31 41,26 54,28 74,20"
          stroke="var(--brand)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={0.35}
          strokeWidth={2}
        />
      ) : null}
      <circle cx={74} cy={4} fill="var(--brand)" r={2.5} />
    </svg>
  );
}

function MiniRows() {
  const widths = [64, 46, 34, 22];
  return (
    <svg aria-hidden="true" className="block h-[36px] w-full" viewBox="0 0 76 36">
      {widths.map((width, index) => (
        <rect
          fill="var(--brand)"
          fillOpacity={index === 0 ? 1 : 0.45}
          height={5}
          key={index}
          rx={2.5}
          width={width}
          x={1}
          y={index * 9 + 1}
        />
      ))}
    </svg>
  );
}

function MiniPairs() {
  const pairs = [
    [10, 18],
    [14, 26],
    [12, 32],
  ];
  return (
    <svg aria-hidden="true" className="block h-[36px] w-full" viewBox="0 0 76 36">
      {pairs.map(([before, after], index) => (
        <g key={index}>
          <rect
            fill="var(--brand)"
            fillOpacity={0.35}
            height={before}
            rx={1.5}
            width={8}
            x={index * 26 + 4}
            y={36 - before}
          />
          <rect
            fill="var(--brand)"
            height={after}
            rx={1.5}
            width={8}
            x={index * 26 + 14}
            y={36 - after}
          />
        </g>
      ))}
    </svg>
  );
}

const reportCovers = [
  { title: "Influencer Marketing", format: "PDF", chart: <MiniBars /> },
  { title: "League & Event", format: "PDF", chart: <MiniLine /> },
  { title: "Team Performance", format: "Dashboard", chart: <MiniRows /> },
  { title: "Brand Lift & Sponsorship", format: "PDF", chart: <MiniPairs /> },
  {
    title: "Competitive Analysis",
    format: "Dashboard",
    chart: <MiniLine dual />,
    wide: true,
  },
];

function ReportCover({
  title,
  format,
  chart,
  wide,
}: {
  title: string;
  format: string;
  chart: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-border bg-background/70 flex flex-col justify-between rounded-lg border p-[14px] shadow-sm",
        wide && "col-span-2",
      )}
    >
      <div className="flex items-start justify-between gap-[8px]">
        <span className="flex min-w-0 items-center gap-[8px]">
          <span aria-hidden="true" className="bg-signal h-[10px] w-[3px] shrink-0" />
          <span className="text-foreground truncate font-mono text-[10px] font-semibold tracking-[0.06em] uppercase">
            {title}
          </span>
        </span>
        <span className="border-border text-muted shrink-0 rounded-sm border px-[5px] py-[1px] font-mono text-[9px] tracking-[0.08em] uppercase">
          {format}
        </span>
      </div>
      <div className="mt-[14px]">{chart}</div>
    </div>
  );
}

export function CustomReportGallery() {
  return (
    <VisualShell label="Custom reports" meta="Analyst-built">
      <div className="grid grid-cols-2 gap-[12px]">
        {reportCovers.map((cover) => (
          <ReportCover
            chart={cover.chart}
            format={cover.format}
            key={cover.title}
            title={cover.title}
            wide={cover.wide}
          />
        ))}
      </div>
    </VisualShell>
  );
}
