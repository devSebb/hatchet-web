"use client";

import { type CSSProperties, useEffect, useId, useRef } from "react";

import { useHydratedReducedMotion } from "@/components/motion/use-hydrated-reduced-motion";
import { cn } from "@/lib/utils";

type CircuitFieldProps = {
  /** "quiet" is the calmest default; "normal" is marginally more present. */
  density?: "quiet" | "normal";
  /** Max concurrent ambient pulses (performance + aesthetic ceiling). */
  pulseCount?: number;
  /** Pulse travel duration, ms (~1.5–2.5s). */
  pulseDurationMs?: number;
  /** Base gap between new pulses, ms (randomized ±50%, ~2.5–5s). */
  pulseIntervalMs?: number;
  className?: string;
  style?: CSSProperties;
};

// PCB routing conventions used throughout: segments run at 0°/90° with 45°
// jogs only (never arbitrary angles), every trace terminates in a via, a chip
// pin, or the board edge, and widths come in three tiers like real copper —
// thin signal lines, medium routes, and a few fat power rails.
type Tier = "signal" | "medium" | "power";

const TRACE_WIDTH: Record<Tier, number> = {
  signal: 1.4,
  medium: 2.1,
  power: 3.2,
};

// ViewBox 1440×900, slice-scaled. Traces are authored per region and mostly
// originate at a chip or board edge so pulses read as signals leaving parts.
const TRACES: { d: string; tier: Tier }[] = [
  // Power rails.
  { d: "M 0 544 H 90", tier: "power" }, // left edge → U1
  { d: "M 360 900 V 830 l 36 -36 H 500 l 24 -24 V 672", tier: "power" },
  { d: "M 1344 120 H 1400 l 40 40", tier: "power" }, // U2 → right edge
  { d: "M 1440 584 H 1360 l -36 36 V 744 l -28 28 H 1200", tier: "power" }, // right edge → U3
  // U1 (left chip): right-side bus fanning down, plus top/bottom breakouts.
  { d: "M 178 544 H 316 l 48 48 V 700 l 32 32 H 452", tier: "medium" },
  { d: "M 178 560 H 300 l 48 48 V 716 l 32 32 H 428", tier: "signal" },
  { d: "M 178 576 H 284 l 48 48 V 732 l 32 32 H 404", tier: "signal" },
  { d: "M 112 520 V 384 l -28 -28 H 0", tier: "signal" },
  { d: "M 134 520 V 440", tier: "signal" },
  { d: "M 156 520 V 248 l -36 -36 H 60", tier: "medium" },
  { d: "M 90 592 H 36 l -24 24 V 648", tier: "signal" },
  { d: "M 112 608 V 672", tier: "signal" },
  { d: "M 134 608 V 692 l 28 28 H 240 l 36 36 V 830", tier: "signal" },
  { d: "M 156 608 V 656 l 36 36 H 260", tier: "signal" },
  // Left edge and corners.
  { d: "M 150 0 V 200 l 36 36 H 300 l 24 24 V 360", tier: "signal" },
  { d: "M 250 60 H 420 l 28 28 V 220", tier: "signal" },
  { d: "M 0 664 H 24 l 16 16 V 900", tier: "signal" },
  { d: "M 70 900 V 772 l 40 -40 H 148", tier: "signal" },
  // Bottom center.
  { d: "M 560 900 V 812 l 36 -36 H 700", tier: "signal" },
  { d: "M 640 900 V 840 l 28 -28 H 780 l 36 -36 V 700", tier: "medium" },
  // U2 (top-right chip): left-side bus, top breakouts, corner accents.
  { d: "M 1244 100 H 1120 l -40 40 V 260", tier: "signal" },
  { d: "M 1244 116 H 1136 l -40 40 V 276 l -28 28 H 1040", tier: "signal" },
  { d: "M 1244 132 H 1152 l -40 40 V 320 l -32 32 H 1000", tier: "medium" },
  { d: "M 1292 84 V 36 l -24 -24 V 0", tier: "signal" },
  { d: "M 1316 84 V 0", tier: "signal" },
  { d: "M 1064 0 V 180 l -32 32 V 280", tier: "signal" },
  { d: "M 1440 40 H 1400 l -24 24 V 84", tier: "signal" },
  // Right edge, mid-board.
  { d: "M 1440 470 H 1300 l -40 -40 V 330", tier: "medium" },
  { d: "M 1440 520 H 1332 l -32 32 V 640", tier: "signal" },
  // U3 (bottom-right chip): top-side bus climbing left, side/bottom breakouts.
  { d: "M 1132 700 V 628 l -36 -36 H 984 l -28 -28 V 520", tier: "signal" },
  { d: "M 1156 700 V 612 l -36 -36 H 1000 l -28 -28 V 484", tier: "signal" },
  { d: "M 1180 700 V 596 l -36 -36 H 1016 l -28 -28 V 448", tier: "medium" },
  { d: "M 1116 724 H 1000 l -40 40 H 900", tier: "signal" },
  { d: "M 1116 748 H 1016 l -40 40 V 900", tier: "signal" },
  { d: "M 1140 784 V 840 l 24 24 H 1252", tier: "signal" },
  { d: "M 1164 784 V 820 l 28 28 H 1324 l 24 24 V 900", tier: "medium" },
  { d: "M 1440 812 H 1392 l -24 -24 V 720", tier: "signal" },
];

// Via donuts at trace endpoints (annular ring + open hole). Passing pulses
// bloom the matching glow ring — matched to the path at runtime by proximity.
const VIAS: [number, number][] = [
  [12, 648],
  [134, 440],
  [60, 212],
  [112, 672],
  [276, 830],
  [260, 692],
  [324, 360],
  [448, 220],
  [148, 732],
  [452, 732],
  [428, 748],
  [404, 764],
  [524, 672],
  [700, 776],
  [816, 700],
  [1080, 260],
  [1040, 304],
  [1000, 352],
  [1032, 280],
  [1376, 84],
  [1260, 330],
  [1300, 640],
  [956, 520],
  [972, 484],
  [988, 448],
  [900, 764],
  [1252, 864],
  [1368, 720],
];

// IC footprints: body outline, pin stubs on all four sides, pin-1 dot,
// silkscreen designator. Pin coordinates line up with the trace anchors.
const CHIPS = [
  {
    x: 90,
    y: 520,
    w: 88,
    h: 88,
    label: "U1",
    sub: "HTCH-01",
    pins: {
      top: [112, 134, 156],
      bottom: [112, 134, 156],
      left: [544, 560, 576, 592],
      right: [544, 560, 576, 592],
    },
  },
  {
    x: 1244,
    y: 84,
    w: 100,
    h: 72,
    label: "U2",
    sub: "AXE-256",
    pins: {
      top: [1268, 1292, 1316],
      bottom: [1268, 1292, 1316],
      left: [100, 116, 132],
      right: [104, 120, 136],
    },
  },
  {
    x: 1116,
    y: 700,
    w: 84,
    h: 84,
    label: "U3",
    sub: "TIMBER",
    pins: {
      top: [1132, 1156, 1180],
      bottom: [1140, 1164, 1188],
      left: [724, 748, 772],
      right: [724, 748, 772],
    },
  },
];

// Two-pad SMD footprints (resistors/caps) sitting on straight trace runs.
const SMD_PADS: { x: number; y: number; vertical?: boolean; label: string }[] =
  [
    { x: 240, y: 544, label: "R4" },
    { x: 444, y: 794, label: "C9" },
    { x: 240, y: 236, label: "R7" },
    { x: 1198, y: 132, label: "R12" },
    { x: 1324, y: 676, vertical: true, label: "C7" },
    { x: 724, y: 812, label: "C3" },
    { x: 1372, y: 470, label: "R21" },
  ];

const TEST_POINTS: { x: number; y: number; label: string }[] = [
  { x: 222, y: 800, label: "TP1" },
  { x: 1408, y: 240, label: "TP2" },
];

const SILK_FONT =
  'ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace';

const NEGATIVE_SPACE_MASK =
  "radial-gradient(120% 95% at 50% 32%, transparent 0%, transparent 24%, #000 66%)";

// Pulses cycle through the brand palette so the motion reads as on-theme
// rather than a single flat red.
const PULSE_COLORS = [
  "var(--brand)",
  "var(--brand-highlight)",
  "var(--brand-soft)",
];

export function CircuitField({
  density = "quiet",
  pulseCount = 4,
  pulseDurationMs = 2100,
  pulseIntervalMs = 4200,
  className,
  style,
}: CircuitFieldProps) {
  const reduceMotion = useHydratedReducedMotion();
  const patternId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const pulseRefs = useRef<(SVGCircleElement | null)[]>([]);
  // One glowing trail path per pulse slot: the trace segment behind the
  // travelling dot lights up in-brand, then fades — reads as a signal
  // energizing the path rather than a lone dot drifting across it.
  const trailRefs = useRef<(SVGPathElement | null)[]>([]);
  // One glow ring per via, bloomed as the pulse passes through it.
  const viaGlowRefs = useRef<(SVGCircleElement | null)[]>([]);
  // Per-trace cache of which vias sit on the path, and how far along.
  const viaHitCache = useRef(
    new Map<string, { via: number; frac: number }[]>(),
  );
  const svgRef = useRef<SVGSVGElement>(null);

  // Sections vary from short bands to 2000px-tall columns. Cover-cropping
  // ("slice") a tall section blows the board up ~2× and cuts off the chips at
  // the sides, so tall sections instead pin the full-width board to the top
  // at authored scale; short/wide sections keep the cover-crop.
  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const aspect = height > 0 ? width / height : 1.6;
      svg.setAttribute(
        "preserveAspectRatio",
        aspect < 1.45 ? "xMidYMin meet" : "xMidYMid slice",
      );
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    // Static-only on small screens / coarse pointers (battery + paint cost).
    const coarse = window.matchMedia(
      "(max-width: 767px), (pointer: coarse)",
    ).matches;
    if (coarse) {
      return;
    }

    const root = rootRef.current;
    if (!root) {
      return;
    }

    let inView = false;
    const busy = new Set<number>();
    let timer: number | undefined;
    let stopped = false;
    let colorTick = 0;

    const rand = (min: number, max: number) =>
      min + Math.random() * (max - min);

    // Sample the path and record the arc-length fraction of each via lying
    // on it, so via blooms can be keyed to the pulse's arrival.
    const viaHitsFor = (path: SVGPathElement, d: string) => {
      const cached = viaHitCache.current.get(d);
      if (cached) {
        return cached;
      }
      const total = path.getTotalLength();
      const step = 14;
      const best = new Map<number, { dist: number; frac: number }>();
      for (let s = 0; ; s += step) {
        const at = Math.min(s, total);
        const p = path.getPointAtLength(at);
        VIAS.forEach(([vx, vy], vi) => {
          const dist = (p.x - vx) ** 2 + (p.y - vy) ** 2;
          const cur = best.get(vi);
          if (!cur || dist < cur.dist) {
            best.set(vi, { dist, frac: total ? at / total : 0 });
          }
        });
        if (at === total) {
          break;
        }
      }
      const hits: { via: number; frac: number }[] = [];
      best.forEach((v, vi) => {
        if (v.dist <= 100) {
          hits.push({ via: vi, frac: v.frac });
        }
      });
      viaHitCache.current.set(d, hits);
      return hits;
    };

    const firePulse = () => {
      const free = pulseRefs.current
        .map((_, i) => i)
        .filter((i) => !busy.has(i) && pulseRefs.current[i]);
      if (!free.length) {
        return;
      }
      const slot = free[Math.floor(Math.random() * free.length)];
      const el = pulseRefs.current[slot];
      if (!el) {
        return;
      }
      const trace = TRACES[Math.floor(Math.random() * TRACES.length)];
      const d = trace.d;
      const color = PULSE_COLORS[colorTick++ % PULSE_COLORS.length];
      busy.add(slot);
      el.style.setProperty("--cf-pulse-color", color);
      el.style.offsetPath = `path('${d}')`;
      const easing = "cubic-bezier(0.4, 0, 0.2, 1)";
      const anim = el.animate(
        [
          { offsetDistance: "0%", opacity: 0 },
          { offsetDistance: "14%", opacity: 1, offset: 0.14 },
          { offsetDistance: "86%", opacity: 1, offset: 0.86 },
          { offsetDistance: "100%", opacity: 0 },
        ],
        { duration: pulseDurationMs, easing },
      );

      // Light up the trace behind the dot: a short dash whose leading edge
      // tracks the dot travels the same path, matched color + easing so the
      // two read as one signal.
      const trail = trailRefs.current[slot];
      let trailAnim: Animation | undefined;
      if (trail) {
        trail.setAttribute("d", d);
        trail.style.stroke = color;
        trail.style.color = color;
        const total = trail.getTotalLength();
        const seg = Math.min(150, total * 0.5);
        trail.style.strokeDasharray = `${seg} ${total + seg}`;
        // strokeDashoffset = seg - head, so the lit dash spans [head-seg, head]
        // as the head sweeps 0 → total in lockstep with the dot.
        trailAnim = trail.animate(
          [
            { strokeDashoffset: seg, opacity: 0 },
            {
              strokeDashoffset: seg - total * 0.14,
              opacity: 0.9,
              offset: 0.14,
            },
            {
              strokeDashoffset: seg - total * 0.86,
              opacity: 0.9,
              offset: 0.86,
            },
            { strokeDashoffset: seg - total, opacity: 0 },
          ],
          { duration: pulseDurationMs, easing },
        );

        // Bloom each via on the path as the dot reaches it. The dot's
        // offsetDistance keyframes are an identity mapping, so with the same
        // duration + easing a keyframe at offset=frac coincides with arrival.
        for (const { via, frac } of viaHitsFor(trail, d)) {
          const glow = viaGlowRefs.current[via];
          if (!glow) {
            continue;
          }
          glow.style.color = color;
          const peak = Math.min(frac, 0.88);
          const from = Math.max(0, peak - 0.1);
          const to = Math.min(1, peak + 0.16);
          glow.animate(
            [
              { opacity: 0, offset: 0 },
              { opacity: 0, offset: from },
              { opacity: 0.9, offset: peak },
              { opacity: 0, offset: to },
              { opacity: 0, offset: 1 },
            ],
            { duration: pulseDurationMs, easing },
          );
        }
      }

      const done = () => {
        busy.delete(slot);
        el.style.opacity = "0";
        if (trail) {
          trail.style.opacity = "0";
        }
      };
      anim.addEventListener("finish", done);
      anim.addEventListener("cancel", done);
      trailAnim?.addEventListener("cancel", done);
    };

    const schedule = () => {
      if (stopped) {
        return;
      }
      if (inView && busy.size < pulseCount) {
        firePulse();
      }
      timer = window.setTimeout(
        schedule,
        rand(pulseIntervalMs * 0.5, pulseIntervalMs),
      );
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { rootMargin: "0px", threshold: 0 },
    );
    observer.observe(root);

    timer = window.setTimeout(schedule, rand(1200, pulseIntervalMs));

    return () => {
      stopped = true;
      observer.disconnect();
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [reduceMotion, pulseCount, pulseDurationMs, pulseIntervalMs]);

  const rootStyle = {
    "--cf-trace-color": "color-mix(in srgb, var(--white) 26%, transparent)",
    "--cf-trace-strong": "color-mix(in srgb, var(--white) 32%, transparent)",
    "--cf-via-color": "color-mix(in srgb, var(--white) 42%, transparent)",
    "--cf-silk-color": "color-mix(in srgb, var(--white) 34%, transparent)",
    "--cf-chip-fill": "color-mix(in srgb, var(--white) 4%, transparent)",
    "--cf-pad-color": "color-mix(in srgb, var(--white) 30%, transparent)",
    "--cf-pulse-color": "var(--brand)",
    "--cf-field-opacity": density === "quiet" ? "1" : "1",
    maskImage: NEGATIVE_SPACE_MASK,
    WebkitMaskImage: NEGATIVE_SPACE_MASK,
    opacity: "var(--cf-field-opacity)",
    ...style,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
      ref={rootRef}
      style={rootStyle}
    >
      <svg
        className="h-full w-full"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        ref={svgRef}
        viewBox="0 0 1440 900"
      >
        <defs>
          <pattern
            height={7}
            id={patternId}
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
            width={7}
          >
            <line
              stroke="var(--cf-trace-color)"
              strokeWidth={1}
              x1={0}
              x2={0}
              y1={0}
              y2={7}
            />
          </pattern>
        </defs>

        {/* Hatched ground pour, top-left corner (45° chamfered like a real keep-out). */}
        <path
          d="M 0 0 H 104 V 40 L 64 80 H 0 Z"
          fill={`url(#${patternId})`}
          stroke="var(--cf-trace-color)"
          strokeWidth={1.2}
        />
        <text
          fill="var(--cf-silk-color)"
          fontFamily={SILK_FONT}
          fontSize={9}
          letterSpacing={1}
          x={14}
          y={96}
        >
          GND
        </text>

        {/* Copper traces, three width tiers. */}
        {TRACES.map(({ d, tier }) => (
          <path
            d={d}
            key={d}
            stroke={
              tier === "power"
                ? "var(--cf-trace-strong)"
                : "var(--cf-trace-color)"
            }
            strokeWidth={TRACE_WIDTH[tier]}
          />
        ))}

        {/* IC footprints. */}
        {CHIPS.map((chip) => (
          <g key={chip.label}>
            {chip.pins.top.map((px) => (
              <line
                key={`t-${px}`}
                stroke="var(--cf-trace-color)"
                strokeWidth={4}
                x1={px}
                x2={px}
                y1={chip.y - 9}
                y2={chip.y}
              />
            ))}
            {chip.pins.bottom.map((px) => (
              <line
                key={`b-${px}`}
                stroke="var(--cf-trace-color)"
                strokeWidth={4}
                x1={px}
                x2={px}
                y1={chip.y + chip.h}
                y2={chip.y + chip.h + 9}
              />
            ))}
            {chip.pins.left.map((py) => (
              <line
                key={`l-${py}`}
                stroke="var(--cf-trace-color)"
                strokeWidth={4}
                x1={chip.x - 9}
                x2={chip.x}
                y1={py}
                y2={py}
              />
            ))}
            {chip.pins.right.map((py) => (
              <line
                key={`r-${py}`}
                stroke="var(--cf-trace-color)"
                strokeWidth={4}
                x1={chip.x + chip.w}
                x2={chip.x + chip.w + 9}
                y1={py}
                y2={py}
              />
            ))}
            <rect
              fill="var(--cf-chip-fill)"
              height={chip.h}
              rx={5}
              stroke="var(--cf-via-color)"
              strokeWidth={1.6}
              width={chip.w}
              x={chip.x}
              y={chip.y}
            />
            {/* Pin-1 dot. */}
            <circle
              cx={chip.x + 11}
              cy={chip.y + 11}
              fill="var(--cf-silk-color)"
              r={2.4}
            />
            <text
              fill="var(--cf-silk-color)"
              fontFamily={SILK_FONT}
              fontSize={13}
              letterSpacing={1.5}
              textAnchor="middle"
              x={chip.x + chip.w / 2}
              y={chip.y + chip.h / 2 - 2}
            >
              {chip.label}
            </text>
            <text
              fill="var(--cf-silk-color)"
              fontFamily={SILK_FONT}
              fontSize={8.5}
              letterSpacing={1}
              opacity={0.8}
              textAnchor="middle"
              x={chip.x + chip.w / 2}
              y={chip.y + chip.h / 2 + 13}
            >
              {chip.sub}
            </text>
          </g>
        ))}

        {/* Two-pad SMD footprints on trace runs, with silkscreen designators. */}
        {SMD_PADS.map(({ x, y, vertical, label }) => (
          <g key={label}>
            {vertical ? (
              <>
                <rect
                  fill="var(--cf-pad-color)"
                  height={7}
                  rx={1}
                  width={10}
                  x={x - 5}
                  y={y - 10.5}
                />
                <rect
                  fill="var(--cf-pad-color)"
                  height={7}
                  rx={1}
                  width={10}
                  x={x - 5}
                  y={y + 3.5}
                />
                <rect
                  fill="var(--cf-chip-fill)"
                  height={8}
                  width={7}
                  x={x - 3.5}
                  y={y - 4}
                />
                <text
                  fill="var(--cf-silk-color)"
                  fontFamily={SILK_FONT}
                  fontSize={9}
                  letterSpacing={0.5}
                  x={x + 10}
                  y={y + 3}
                >
                  {label}
                </text>
              </>
            ) : (
              <>
                <rect
                  fill="var(--cf-pad-color)"
                  height={10}
                  rx={1}
                  width={7}
                  x={x - 10.5}
                  y={y - 5}
                />
                <rect
                  fill="var(--cf-pad-color)"
                  height={10}
                  rx={1}
                  width={7}
                  x={x + 3.5}
                  y={y - 5}
                />
                <rect
                  fill="var(--cf-chip-fill)"
                  height={7}
                  width={8}
                  x={x - 4}
                  y={y - 3.5}
                />
                <text
                  fill="var(--cf-silk-color)"
                  fontFamily={SILK_FONT}
                  fontSize={9}
                  letterSpacing={0.5}
                  textAnchor="middle"
                  x={x}
                  y={y - 11}
                >
                  {label}
                </text>
              </>
            )}
          </g>
        ))}

        {/* Labeled test points. */}
        {TEST_POINTS.map(({ x, y, label }) => (
          <g key={label}>
            <circle
              cx={x}
              cy={y}
              r={4.5}
              stroke="var(--cf-via-color)"
              strokeWidth={1.6}
            />
            <circle cx={x} cy={y} fill="var(--cf-pad-color)" r={1.4} />
            <text
              fill="var(--cf-silk-color)"
              fontFamily={SILK_FONT}
              fontSize={9}
              letterSpacing={0.5}
              textAnchor="middle"
              x={x}
              y={y + 18}
            >
              {label}
            </text>
          </g>
        ))}

        {/* Board-edge silkscreen. */}
        <text
          fill="var(--cf-silk-color)"
          fontFamily={SILK_FONT}
          fontSize={10}
          letterSpacing={1.5}
          x={420}
          y={878}
        >
          HTCH-01 · REV 2.6
        </text>

        {/* Via donuts (annular ring + open hole). */}
        {VIAS.map(([cx, cy]) => (
          <circle
            cx={cx}
            cy={cy}
            key={`${cx}-${cy}`}
            r={3.2}
            stroke="var(--cf-via-color)"
            strokeWidth={1.7}
          />
        ))}
        {/* Via glow rings, bloomed by passing pulses. */}
        {VIAS.map(([cx, cy], i) => (
          <circle
            cx={cx}
            cy={cy}
            key={`glow-${cx}-${cy}`}
            r={3.2}
            ref={(el) => {
              viaGlowRefs.current[i] = el;
            }}
            stroke="currentColor"
            strokeWidth={2}
            style={{
              opacity: 0,
              filter: "drop-shadow(0 0 5px currentColor)",
            }}
          />
        ))}

        {Array.from({ length: pulseCount }, (_, i) => (
          <path
            fill="none"
            key={`trail-${i}`}
            ref={(el) => {
              trailRefs.current[i] = el;
            }}
            strokeLinecap="round"
            strokeWidth={2.4}
            style={{
              opacity: 0,
              filter: "drop-shadow(0 0 6px currentColor)",
            }}
          />
        ))}
        {Array.from({ length: pulseCount }, (_, i) => (
          <circle
            cx={0}
            cy={0}
            fill="var(--cf-pulse-color)"
            key={`pulse-${i}`}
            r={3.8}
            ref={(el) => {
              pulseRefs.current[i] = el;
            }}
            style={{
              opacity: 0,
              filter: "drop-shadow(0 0 8px var(--cf-pulse-color))",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
