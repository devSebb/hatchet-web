"use client";

import { type CSSProperties, useEffect, useId, useRef, useState } from "react";

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
  /**
   * Fades the board out toward the bottom. For sections whose background
   * blends from navy into white (e.g. the gradient hero): the board lives on
   * the dark top only and is gone before the background turns light.
   */
  fadeBottom?: boolean;
  className?: string;
  style?: CSSProperties;
};

// PCB routing conventions used throughout: segments run at 0°/90° with 45°
// jogs only (never arbitrary angles), every trace terminates in a via or the
// board edge, and widths come in three tiers like real copper — thin signal
// lines, medium routes, and a few fat power rails.
type Tier = "signal" | "medium" | "power";

const TRACE_WIDTH: Record<Tier, number> = {
  signal: 1.4,
  medium: 2.1,
  power: 3.2,
};

// Authored board size. Tall sections repeat the board down the run in
// BOARD_H-tall tiles (see the resize effect below).
const BOARD_W = 1440;
const BOARD_H = 900;

// ViewBox 1440×900, slice-scaled. Traces are authored per region: long
// continuous runs sweep through dense via fields (the former chip zones) so
// pulses read as signals travelling across the whole board.
const TRACES: { d: string; tier: Tier }[] = [
  // Power rails.
  { d: "M 0 544 H 90", tier: "power" }, // left edge → via field
  { d: "M 360 900 V 830 l 36 -36 H 500 l 24 -24 V 672", tier: "power" },
  { d: "M 1344 120 H 1400 l 40 40", tier: "power" }, // via field → right edge
  { d: "M 1440 584 H 1360 l -36 36 V 744 l -28 28 H 1200", tier: "power" },
  // Left via field: bus fanning down-right, long through-runs top↔bottom.
  { d: "M 178 544 H 316 l 48 48 V 700 l 32 32 H 452", tier: "medium" },
  { d: "M 178 560 H 300 l 48 48 V 716 l 32 32 H 428", tier: "signal" },
  { d: "M 178 576 H 284 l 48 48 V 732 l 32 32 H 404", tier: "signal" },
  { d: "M 0 356 H 84 l 28 28 V 672", tier: "signal" },
  { d: "M 134 440 V 692 l 28 28 H 240 l 36 36 V 830", tier: "signal" },
  { d: "M 60 212 H 120 l 36 36 V 656 l 36 36 H 260", tier: "medium" },
  { d: "M 90 592 H 36 l -24 24 V 648", tier: "signal" },
  // Left edge and corners.
  { d: "M 150 0 V 200 l 36 36 H 300 l 24 24 V 360", tier: "signal" },
  { d: "M 250 60 H 420 l 28 28 V 220", tier: "signal" },
  { d: "M 0 664 H 24 l 16 16 V 900", tier: "signal" },
  { d: "M 70 900 V 772 l 40 -40 H 148", tier: "signal" },
  // Bottom center.
  { d: "M 560 900 V 812 l 36 -36 H 700", tier: "signal" },
  { d: "M 640 900 V 840 l 28 -28 H 780 l 36 -36 V 700", tier: "medium" },
  // Top-right via field: long snakes climbing from mid-board to the top edge.
  {
    d: "M 1080 260 V 140 l 40 -40 H 1276 l 16 -16 V 36 l -24 -24 V 0",
    tier: "signal",
  },
  { d: "M 1244 116 H 1136 l -40 40 V 276 l -28 28 H 1040", tier: "signal" },
  {
    d: "M 1000 352 H 1080 l 32 -32 V 172 l 40 -40 H 1268 l 48 -48 V 0",
    tier: "medium",
  },
  { d: "M 1064 0 V 180 l -32 32 V 280", tier: "signal" },
  { d: "M 1440 40 H 1400 l -24 24 V 84", tier: "signal" },
  // Right edge, mid-board.
  { d: "M 1440 470 H 1300 l -40 -40 V 330", tier: "medium" },
  { d: "M 1440 520 H 1332 l -32 32 V 640", tier: "signal" },
  // Bottom-right via field: sweeping runs from mid-board to the bottom edge.
  {
    d: "M 956 520 V 564 l 28 28 H 1096 l 36 36 V 776 l 8 8 V 840 l 24 24 H 1252",
    tier: "signal",
  },
  {
    d: "M 972 484 V 548 l 28 28 H 1120 l 36 36 V 776 l 8 8 V 820 l 28 28 H 1324 l 24 24 V 900",
    tier: "medium",
  },
  { d: "M 988 448 V 532 l 28 28 H 1144 l 36 36 V 752 l 20 20", tier: "medium" },
  { d: "M 1116 724 H 1000 l -40 40 H 900", tier: "signal" },
  { d: "M 1116 748 H 1016 l -40 40 V 900", tier: "signal" },
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
  // Fan-out via fields where the bus traces break out (former chip zones):
  // tight clusters that read as deliberate via stitching.
  [90, 544],
  [90, 592],
  [178, 544],
  [178, 560],
  [178, 576],
  [1244, 116],
  [1344, 120],
  [1116, 724],
  [1116, 748],
  [1200, 772], // power rail meets the bottom-right bus run
  [250, 60],
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
    { x: 134, y: 560, vertical: true, label: "C4" },
    { x: 1176, y: 100, label: "C11" },
    { x: 1060, y: 592, label: "R9" },
  ];

// Fiducial marks (annular ring + crosshair) in open board regions.
const FIDUCIALS: [number, number][] = [
  [84, 132],
  [1348, 560],
];

const TEST_POINTS: { x: number; y: number; label: string }[] = [
  { x: 222, y: 800, label: "TP1" },
  { x: 1408, y: 240, label: "TP2" },
];

const SILK_FONT =
  'ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace';

const NEGATIVE_SPACE_MASK =
  "radial-gradient(120% 95% at 50% 32%, transparent 0%, transparent 24%, #000 66%)";

// Tiled (tall) sections only. NEGATIVE_SPACE_MASK is a single ellipse pinned to
// the section's upper-middle: copy near the top sits in its clear centre, but
// copy further down sits out in the falloff, where the mask is mostly opaque
// and the board reads straight through the text. One board never reached that
// far, so it never showed. A repeated one does — hence a full-height keep-out
// corridor over the centre column (max-w-3xl ≈ 23%–77% at desktop), leaving the
// board to frame the copy from the margins the way it already does up top.
const COPY_CORRIDOR_MASK =
  "linear-gradient(to right, #000 0%, #000 7%, transparent 23%, transparent 77%, #000 93%, #000 100%)";

// Pulses stay strictly in the red family (never the orange highlight):
// core brand red, a brighter red for punch, and the soft red for variety.
const PULSE_COLORS = ["var(--brand)", "#e23c42", "var(--brand-soft)"];

// Board fade for navy→white gradient sections: fully present on the dark
// top, fully gone before the background turns light.
const FADE_BOTTOM_MASK =
  "linear-gradient(to bottom, #000 0%, #000 32%, transparent 58%)";

// Tiled (tall) sections only. NEGATIVE_SPACE_MASK keeps the board clear of the
// copy by punching a hole around the section's upper-middle, but it is a single
// radial — everything past it reads at full strength, so repeated tiles would
// sit bright behind the copy that runs down the section. Damp the run as it
// descends. A ramp rather than a step: a flat per-tile opacity would band at
// the seams.
const TILE_DAMP_MASK =
  "linear-gradient(to bottom, #000 0%, #000 42%, rgba(0,0,0,0.38) 68%, rgba(0,0,0,0.28) 100%)";

export function CircuitField({
  density = "quiet",
  pulseCount = 6,
  pulseDurationMs = 2200,
  pulseIntervalMs = 1500,
  fadeBottom = false,
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
  const boardId = useId();
  const [tiling, setTiling] = useState({
    viewBoxHeight: BOARD_H,
    tiles: 1,
    fit: "xMidYMid slice",
  });

  // Sections vary from short bands to 2000px-tall columns. Cover-cropping
  // ("slice") a tall section blows the board up ~2× and cuts off the chips at
  // the sides, so tall sections instead pin the full-width board to the top at
  // authored scale — but one board is only BOARD_H tall, which used to leave
  // everything below it bare. Tall sections therefore grow the viewBox to the
  // section's own aspect and repeat the board down the run, so the field fills
  // the full height at authored scale. Short/wide sections keep the cover-crop.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const aspect = height > 0 ? width / height : 1.6;
      const next =
        aspect < 1.45 && width > 0
          ? (() => {
              // Board units needed to span the section at authored scale.
              const viewBoxHeight = Math.ceil((height / width) * BOARD_W);
              return {
                viewBoxHeight,
                tiles: Math.ceil(viewBoxHeight / BOARD_H),
                fit: "xMidYMin meet",
              };
            })()
          : { viewBoxHeight: BOARD_H, tiles: 1, fit: "xMidYMid slice" };

      setTiling((cur) =>
        cur.viewBoxHeight === next.viewBoxHeight &&
        cur.tiles === next.tiles &&
        cur.fit === next.fit
          ? cur
          : next,
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
      // Power rails always surge (bigger dot, hotter trail); a fraction of
      // signal pulses do too, so the board occasionally flares alive.
      const surge = trace.tier === "power" || Math.random() < 0.18;
      busy.add(slot);

      const trail = trailRefs.current[slot];
      let total = 0;
      if (trail) {
        trail.setAttribute("d", d);
        total = trail.getTotalLength();
      }
      // Constant travel speed: long cross-board runs take longer than short
      // stubs instead of every pulse crawling or sprinting to fit a fixed
      // duration.
      const duration = total
        ? Math.min(
            pulseDurationMs * 1.3,
            Math.max(pulseDurationMs * 0.5, total * 2.6),
          )
        : pulseDurationMs;

      el.style.setProperty("--cf-pulse-color", color);
      el.style.offsetPath = `path('${d}')`;
      el.setAttribute("r", surge ? "5.2" : "4");
      el.style.filter = `drop-shadow(0 0 ${surge ? 12 : 8}px var(--cf-pulse-color))`;
      const easing = "cubic-bezier(0.4, 0, 0.2, 1)";
      const anim = el.animate(
        [
          { offsetDistance: "0%", opacity: 0 },
          { offsetDistance: "14%", opacity: 1, offset: 0.14 },
          { offsetDistance: "86%", opacity: 1, offset: 0.86 },
          { offsetDistance: "100%", opacity: 0 },
        ],
        { duration, easing },
      );

      // Light up the trace behind the dot: a short dash whose leading edge
      // tracks the dot travels the same path, matched color + easing so the
      // two read as one signal.
      let trailAnim: Animation | undefined;
      if (trail) {
        trail.style.stroke = color;
        trail.style.color = color;
        trail.style.strokeWidth = surge ? "3.4" : "2.4";
        const peakOpacity = surge ? 1 : 0.9;
        const seg = Math.min(surge ? 210 : 160, total * 0.5);
        trail.style.strokeDasharray = `${seg} ${total + seg}`;
        // strokeDashoffset = seg - head, so the lit dash spans [head-seg, head]
        // as the head sweeps 0 → total in lockstep with the dot.
        trailAnim = trail.animate(
          [
            { strokeDashoffset: seg, opacity: 0 },
            {
              strokeDashoffset: seg - total * 0.14,
              opacity: peakOpacity,
              offset: 0.14,
            },
            {
              strokeDashoffset: seg - total * 0.86,
              opacity: peakOpacity,
              offset: 0.86,
            },
            { strokeDashoffset: seg - total, opacity: 0 },
          ],
          { duration, easing },
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
              { opacity: 1, offset: peak },
              { opacity: 0, offset: to },
              { opacity: 0, offset: 1 },
            ],
            { duration, easing },
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

  // fadeBottom owns the svg mask where it applies (gradient hero); otherwise a
  // tiled run damps as it descends so it stays behind the copy, not on top of
  // it. Untiled sections keep the bare board.
  const svgMask = fadeBottom
    ? FADE_BOTTOM_MASK
    : tiling.tiles > 1
      ? TILE_DAMP_MASK
      : undefined;

  // Nested rather than composited onto rootStyle: stacked masks multiply, which
  // gets the radial ∩ corridor keep-out without mask-composite's compat spread.
  const corridorStyle: CSSProperties | undefined =
    tiling.tiles > 1
      ? {
          maskImage: COPY_CORRIDOR_MASK,
          WebkitMaskImage: COPY_CORRIDOR_MASK,
        }
      : undefined;

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
      <div className="h-full w-full" style={corridorStyle}>
        <svg
          className="h-full w-full"
          fill="none"
          preserveAspectRatio={tiling.fit}
          style={
            svgMask
              ? {
                  maskImage: svgMask,
                  WebkitMaskImage: svgMask,
                }
              : undefined
          }
          viewBox={`0 0 ${BOARD_W} ${tiling.viewBoxHeight}`}
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

          <g id={boardId}>
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

            {/* Fiducial marks: annular ring + crosshair. */}
            {FIDUCIALS.map(([cx, cy]) => (
              <g key={`fid-${cx}-${cy}`} stroke="var(--cf-via-color)">
                <circle cx={cx} cy={cy} r={5} strokeWidth={1.2} />
                <line strokeWidth={1} x1={cx - 8} x2={cx - 5} y1={cy} y2={cy} />
                <line strokeWidth={1} x1={cx + 5} x2={cx + 8} y1={cy} y2={cy} />
                <line strokeWidth={1} x1={cx} x2={cx} y1={cy - 8} y2={cy - 5} />
                <line strokeWidth={1} x1={cx} x2={cx} y1={cy + 5} y2={cy + 8} />
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
                r={4}
                ref={(el) => {
                  pulseRefs.current[i] = el;
                }}
                style={{
                  opacity: 0,
                  filter: "drop-shadow(0 0 8px var(--cf-pulse-color))",
                }}
              />
            ))}
          </g>

          {/* Tall sections: repeat the board down the run. Odd tiles are mirrored
            vertically so each seam meets its own edge — traces line up across
            the join instead of butting into an unrelated row. <use> mirrors the
            live board, so pulses travel every tile. */}
          {Array.from({ length: tiling.tiles - 1 }, (_, i) => {
            const tile = i + 1;

            return (
              <use
                href={`#${boardId}`}
                key={tile}
                transform={
                  tile % 2 === 1
                    ? `translate(0 ${(tile + 1) * BOARD_H}) scale(1 -1)`
                    : `translate(0 ${tile * BOARD_H})`
                }
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
