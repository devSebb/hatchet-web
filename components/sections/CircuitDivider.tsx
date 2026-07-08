import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

// Light-surface counterpart to CircuitField: a single trace run separating two
// paper sections. Same PCB conventions — 0°/90° runs with 45° jogs only, every
// stub terminated in a via donut, an SMD footprint on the straight run — drawn
// in ink on paper instead of white on navy. A brand-red pulse periodically
// travels the run (reduced-motion gated via .circuit-divider-pulse).

// The pulse follows the main run, so the two must stay in sync.
const MAIN_RUN = "M 0 32 H 132 l 12 12 H 416 l 12 -12 H 560";

const STUBS = [
  // Parallel signal stubs riding above/below the main run, via-terminated.
  { d: "M 180 20 H 300", width: 1.4 },
  { d: "M 320 56 H 404", width: 1.4 },
  // 45° breakouts off the main run.
  { d: "M 96 32 l -14 -14 H 60", width: 1.4 },
  { d: "M 468 32 l 14 -14 H 512", width: 1.4 },
];

const VIAS: [number, number][] = [
  [60, 18],
  [512, 18],
  [180, 20],
  [300, 20],
  [320, 56],
  [404, 56],
];

const SILK_FONT =
  'ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace';

type CircuitDividerProps = {
  /**
   * Staggers the pulse between multiple dividers on one page so they don't
   * fire in lockstep. Negative values start mid-cycle.
   */
  pulseDelaySeconds?: number;
  className?: string;
};

export function CircuitDivider({
  pulseDelaySeconds = 0,
  className,
}: CircuitDividerProps) {
  const rootStyle = {
    "--cd-trace": "color-mix(in srgb, var(--foreground) 18%, transparent)",
    "--cd-trace-strong":
      "color-mix(in srgb, var(--foreground) 26%, transparent)",
    "--cd-via": "color-mix(in srgb, var(--foreground) 34%, transparent)",
    "--cd-pad": "color-mix(in srgb, var(--foreground) 28%, transparent)",
    "--cd-silk": "color-mix(in srgb, var(--foreground) 38%, transparent)",
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={cn("surface-paper bg-background", className)}
      style={rootStyle}
    >
      <div className="flex w-full items-center">
        {/* Flanking runs continue the main trace to the board (viewport) edge. */}
        <span className="h-px flex-1 bg-[var(--cd-trace-strong)]" />
        <svg
          className="w-full max-w-[560px] shrink"
          fill="none"
          viewBox="0 0 560 64"
        >
          <path
            d={MAIN_RUN}
            stroke="var(--cd-trace-strong)"
            strokeWidth={2}
          />
          {STUBS.map(({ d, width }) => (
            <path d={d} key={d} stroke="var(--cd-trace)" strokeWidth={width} />
          ))}

          {/* Two-pad SMD footprint on the straight center run. */}
          <g>
            <rect
              fill="var(--cd-pad)"
              height={10}
              rx={1}
              width={7}
              x={239.5}
              y={39}
            />
            <rect
              fill="var(--cd-pad)"
              height={10}
              rx={1}
              width={7}
              x={253.5}
              y={39}
            />
            <rect
              fill="color-mix(in srgb, var(--foreground) 6%, transparent)"
              height={7}
              width={8}
              x={246}
              y={40.5}
            />
            <text
              fill="var(--cd-silk)"
              fontFamily={SILK_FONT}
              fontSize={9}
              letterSpacing={0.5}
              textAnchor="middle"
              x={250}
              y={33}
            >
              C2
            </text>
          </g>

          {/* Via donuts at every stub terminal. */}
          {VIAS.map(([cx, cy]) => (
            <circle
              cx={cx}
              cy={cy}
              key={`${cx}-${cy}`}
              r={3.2}
              stroke="var(--cd-via)"
              strokeWidth={1.7}
            />
          ))}

          {/* Brand-red signal pulse travelling the main run. */}
          <circle
            className="circuit-divider-pulse"
            fill="var(--brand)"
            r={3.5}
            style={{
              opacity: 0,
              offsetPath: `path('${MAIN_RUN}')`,
              filter: "drop-shadow(0 0 6px var(--brand))",
              animationDelay: `${pulseDelaySeconds}s`,
            }}
          />
        </svg>
        <span className="h-px flex-1 bg-[var(--cd-trace-strong)]" />
      </div>
    </div>
  );
}
