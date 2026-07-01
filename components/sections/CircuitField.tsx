"use client";

import { type CSSProperties, useEffect, useRef } from "react";

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

// Sparse, large-scale Manhattan traces (viewBox 1440×900, slice-scaled).
const TRACES = [
  "M 0 140 H 230 V 320 H 430",
  "M 1440 180 H 1180 V 380 H 980",
  "M 150 0 V 200 H 360 V 360",
  "M 1290 0 V 240 H 1080",
  "M 0 680 H 250 V 520 H 430",
  "M 1440 740 H 1170 V 560 H 1010",
  "M 70 900 V 700 H 300",
  "M 1360 900 V 690 H 1160 V 540",
  "M 0 430 H 170 V 580",
  "M 1440 470 H 1250 V 300",
  "M 250 60 H 470 V 220",
  "M 1190 840 H 1390",
  // Right-side fill: reach further inward so the space beside the headline
  // carries the same trace density as the left.
  "M 1440 100 H 1230 V 300",
  "M 940 640 H 1150 V 470",
  "M 1080 900 V 730 H 1310 V 600",
  "M 1440 560 H 1320 V 420 H 1200",
  // Top-right corner accents.
  "M 1440 40 H 1360 V 160 H 1250",
  "M 1150 0 V 120 H 1340",
];

// Vias at a curated subset of junctions (used sparingly).
const VIAS: [number, number][] = [
  [230, 320],
  [430, 320],
  [1180, 380],
  [360, 200],
  [360, 360],
  [1080, 240],
  [250, 520],
  [1170, 560],
  [300, 700],
  [1160, 690],
  [170, 430],
  [1250, 300],
  [470, 220],
  // Junctions for the new right-side traces.
  [1230, 300],
  [1150, 640],
  [1150, 470],
  [1310, 730],
  [1320, 420],
  [1200, 420],
  // Top-right corner junctions.
  [1360, 160],
  [1250, 160],
  [1340, 120],
];

const NEGATIVE_SPACE_MASK =
  "radial-gradient(120% 95% at 50% 32%, transparent 0%, transparent 26%, #000 78%)";

// Pulses cycle through the brand palette so the motion reads as on-theme
// rather than a single flat red.
const PULSE_COLORS = [
  "var(--brand)",
  "var(--brand-highlight)",
  "var(--brand-soft)",
];

export function CircuitField({
  density = "quiet",
  pulseCount = 3,
  pulseDurationMs = 2100,
  pulseIntervalMs = 5000,
  className,
  style,
}: CircuitFieldProps) {
  const reduceMotion = useHydratedReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const pulseRefs = useRef<(SVGCircleElement | null)[]>([]);
  // One glowing trail path per pulse slot: the trace segment behind the
  // travelling dot lights up in-brand, then fades — reads as a signal
  // energizing the path rather than a lone dot drifting across it.
  const trailRefs = useRef<(SVGPathElement | null)[]>([]);

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

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

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
      const d = TRACES[Math.floor(Math.random() * TRACES.length)];
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
            { strokeDashoffset: seg - total * 0.14, opacity: 0.9, offset: 0.14 },
            { strokeDashoffset: seg - total * 0.86, opacity: 0.9, offset: 0.86 },
            { strokeDashoffset: seg - total, opacity: 0 },
          ],
          { duration: pulseDurationMs, easing },
        );
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
    "--cf-trace-color": "color-mix(in srgb, var(--white) 20%, transparent)",
    "--cf-via-color": "color-mix(in srgb, var(--white) 32%, transparent)",
    "--cf-pulse-color": "var(--brand)",
    "--cf-field-opacity": density === "quiet" ? "1" : "1",
    "--cf-pitch": "120px",
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
        viewBox="0 0 1440 900"
      >
        {TRACES.map((d) => (
          <path
            d={d}
            key={d}
            stroke="var(--cf-trace-color)"
            strokeWidth={1.6}
          />
        ))}
        {VIAS.map(([cx, cy]) => (
          <circle
            cx={cx}
            cy={cy}
            fill="var(--cf-via-color)"
            key={`${cx}-${cy}`}
            r={3.5}
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
            strokeWidth={2.2}
            style={{
              opacity: 0,
              filter: "drop-shadow(0 0 4px currentColor)",
            }}
          />
        ))}
        {Array.from({ length: pulseCount }, (_, i) => (
          <circle
            cx={0}
            cy={0}
            fill="var(--cf-pulse-color)"
            key={`pulse-${i}`}
            r={3.5}
            ref={(el) => {
              pulseRefs.current[i] = el;
            }}
            style={{
              opacity: 0,
              filter: "drop-shadow(0 0 6px var(--cf-pulse-color))",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
