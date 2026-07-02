"use client";

import { useId } from "react";
import { motion } from "framer-motion";

import { useHydratedReducedMotion } from "@/components/motion/use-hydrated-reduced-motion";
import { EASE_OUT, MOTION_DURATION } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type HeroStatVisualVariant = "cluster" | "timeline" | "density";

export type HeroStatVisualTone = "dark" | "light";

// "dark" is tuned for the navy top of the gradient hero, where these render on
// a faint translucent card: lit is the brand accent, dim a barely-there white.
// "light" uses full-width gradient marks on a pale surface (hero theme 3).
const TONES: Record<HeroStatVisualTone, { lit: string; dim: string }> = {
  dark: {
    lit: "var(--brand-highlight)",
    dim: "color-mix(in srgb, var(--white) 16%, transparent)",
  },
  light: {
    lit: "var(--brand)",
    dim: "color-mix(in srgb, var(--bg) 16%, transparent)",
  },
};

type VisualProps = { reduce: boolean; lit: string; dim: string };

const VIEWPORT = { once: true, amount: 0.5 } as const;

/* ------------------------------------------------------------------------- *
 * DARK visuals (hero themes 1 & 2) — unchanged, fixed-size on a glass card.
 * ------------------------------------------------------------------------- */

/**
 * Platforms → breadth. A tidy grid of dots that lights up column by column,
 * left to right, like a coverage map switching on.
 */
function Cluster({ reduce, lit, dim }: VisualProps) {
  const cols = 10;
  const rows = 3;
  const gap = 13;
  const r = 2.5;
  const pad = r + 1;
  const width = (cols - 1) * gap + pad * 2;
  const height = (rows - 1) * gap + pad * 2;

  // Column-outer order so the stagger reads as a left-to-right wipe.
  const dots: Array<{ cx: number; cy: number }> = [];
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      dots.push({ cx: pad + col * gap, cy: pad + row * gap });
    }
  }

  return (
    <svg
      className="block overflow-visible"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      <motion.g
        initial={reduce ? false : "hidden"}
        variants={{ visible: { transition: { staggerChildren: 0.028 } } }}
        viewport={VIEWPORT}
        whileInView={reduce ? undefined : "visible"}
      >
        {dots.map((dot, index) => (
          <motion.circle
            cx={dot.cx}
            cy={dot.cy}
            fill={reduce ? lit : undefined}
            key={index}
            r={r}
            transition={{ duration: MOTION_DURATION.base, ease: EASE_OUT }}
            variants={
              reduce
                ? undefined
                : {
                    hidden: { fill: dim, opacity: 0.55 },
                    visible: { fill: lit, opacity: 1 },
                  }
            }
          />
        ))}
      </motion.g>
    </svg>
  );
}

/**
 * Years → time. An upward line that draws itself left to right, anchored by a
 * "2016" tick and a live-pulsing point at "now".
 */
function Timeline({ reduce, lit, dim }: VisualProps) {
  const width = 150;
  const height = 46;
  const pad = 7;
  const data = [2, 3, 4, 5, 6, 7, 9, 10];

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = (width - pad * 2) / (data.length - 1);
  const usableHeight = height - pad * 2;

  const points = data.map((value, index) => {
    const x = pad + index * step;
    const y = height - pad - ((value - min) / range) * usableHeight;
    return { x, y };
  });
  const last = points[points.length - 1];
  const pointsAttr = points
    .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");

  return (
    <svg
      className="block overflow-visible"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      <line
        stroke={dim}
        strokeLinecap="round"
        strokeWidth="1"
        x1={pad}
        x2={width - pad}
        y1={height - pad}
        y2={height - pad}
      />
      <text fill="currentColor" fontSize="8" opacity="0.5" x={pad} y={height - 1}>
        2016
      </text>
      <motion.polyline
        animate={reduce ? undefined : { pathLength: 1 }}
        fill="none"
        initial={reduce ? undefined : { pathLength: 0 }}
        points={pointsAttr}
        stroke={lit}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        transition={{ duration: MOTION_DURATION.slow, ease: EASE_OUT }}
        vectorEffect="non-scaling-stroke"
      />
      {!reduce && (
        <motion.circle
          animate={{ r: [3, 9], opacity: [0.5, 0] }}
          cx={last.x}
          cy={last.y}
          fill={lit}
          transition={{
            duration: MOTION_DURATION.slow,
            ease: EASE_OUT,
            repeat: Infinity,
            repeatDelay: MOTION_DURATION.fast,
          }}
        />
      )}
      <circle cx={last.x} cy={last.y} fill={lit} r="3" />
    </svg>
  );
}

/**
 * Creators → scale. A dense dot field that fills in by scattered order, so the
 * message is sheer volume rather than a countable set.
 */
function Density({ reduce, lit }: Omit<VisualProps, "dim">) {
  const cols = 14;
  const rows = 5;
  const gap = 9;
  const r = 2;
  const pad = r + 1;
  const width = (cols - 1) * gap + pad * 2;
  const height = (rows - 1) * gap + pad * 2;
  const total = cols * rows;

  const dots: Array<{
    cx: number;
    cy: number;
    opacity: number;
    delay: number;
  }> = [];
  let index = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Deterministic scatter so the fill feels organic without Math.random.
      const scatter = (index * 7) % total;
      dots.push({
        cx: pad + col * gap,
        cy: pad + row * gap,
        opacity: index % 3 === 0 ? 0.45 : 0.9,
        delay: (scatter / total) * MOTION_DURATION.slow,
      });
      index += 1;
    }
  }

  return (
    <svg
      className="block overflow-visible"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      {dots.map((dot, i) => (
        <motion.circle
          cx={dot.cx}
          cy={dot.cy}
          fill={lit}
          initial={reduce ? undefined : { opacity: 0, scale: 0 }}
          key={i}
          opacity={reduce ? dot.opacity : undefined}
          r={r}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          transition={{
            delay: dot.delay,
            duration: MOTION_DURATION.base,
            ease: EASE_OUT,
          }}
          viewport={VIEWPORT}
          whileInView={reduce ? undefined : { opacity: dot.opacity, scale: 1 }}
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------------- *
 * LIGHT visuals (hero theme 3) — full-width, bottom-anchored data graphics
 * that bleed to the card edges. Warm red→orange gradient echoes the headline.
 * ------------------------------------------------------------------------- */

// Wide viewBox + w-full so the SVG stretches across the card while scaling
// uniformly (marks stay round, never squashed).
const FLUID_W = 240;
const FLUID_H = 52;

type LightVisualProps = { reduce: boolean; gradientId: string; dim: string };

/** Shared gradient defs: `${id}v` runs orange→red top-to-bottom (fills);
 *  `${id}h` runs red→orange left-to-right (strokes & dots). */
function GradientDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}v`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="var(--brand-highlight)" />
        <stop offset="55%" stopColor="var(--brand)" />
        <stop offset="100%" stopColor="var(--brand-lowlight)" />
      </linearGradient>
      <linearGradient id={`${id}h`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="var(--brand-lowlight)" />
        <stop offset="50%" stopColor="var(--brand)" />
        <stop offset="100%" stopColor="var(--brand-highlight)" />
      </linearGradient>
    </defs>
  );
}

/** Platforms → breadth. A spectrum of pill bars rising to full coverage. */
function BarsLight({ reduce, gradientId }: LightVisualProps) {
  const heights = [
    0.34, 0.58, 0.44, 0.72, 0.52, 0.88, 0.64, 1, 0.7, 0.82, 0.48, 0.66, 0.38,
  ];
  const slot = FLUID_W / heights.length;
  const barW = slot * 0.5;
  const topPad = 4;
  const usable = FLUID_H - topPad;

  return (
    <svg
      className="block w-full"
      preserveAspectRatio="xMidYMax meet"
      viewBox={`0 0 ${FLUID_W} ${FLUID_H}`}
    >
      <GradientDefs id={gradientId} />
      <motion.g
        initial={reduce ? false : "hidden"}
        variants={{ visible: { transition: { staggerChildren: 0.045 } } }}
        viewport={VIEWPORT}
        whileInView={reduce ? undefined : "visible"}
      >
        {heights.map((h, i) => {
          const barH = Math.max(barW, h * usable);
          const x = i * slot + (slot - barW) / 2;
          return (
            <motion.rect
              fill={`url(#${gradientId}v)`}
              height={barH}
              key={i}
              rx={barW / 2}
              style={{ transformBox: "fill-box", transformOrigin: "center bottom" }}
              transition={{ duration: MOTION_DURATION.base, ease: EASE_OUT }}
              variants={
                reduce
                  ? undefined
                  : { hidden: { scaleY: 0, opacity: 0 }, visible: { scaleY: 1, opacity: 1 } }
              }
              width={barW}
              x={x}
              y={FLUID_H - barH}
            />
          );
        })}
      </motion.g>
    </svg>
  );
}

/** Years → growth. A rising area curve with a soft wash and a pulsing "now". */
function TimelineLight({ reduce, gradientId, dim }: LightVisualProps) {
  const padX = 4;
  const padTop = 8;
  const padBottom = 6;
  const data = [2, 3, 3.4, 4.5, 5.2, 6.4, 7.1, 8.6, 9.2, 10];

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = (FLUID_W - padX * 2) / (data.length - 1);
  const usable = FLUID_H - padTop - padBottom;

  const points = data.map((value, index) => ({
    x: padX + index * step,
    y: FLUID_H - padBottom - ((value - min) / range) * usable,
  }));
  const last = points[points.length - 1];
  const lineAttr = points
    .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");
  const areaPath =
    `M ${points[0].x.toFixed(2)},${(FLUID_H - padBottom).toFixed(2)} ` +
    points.map((p) => `L ${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") +
    ` L ${last.x.toFixed(2)},${(FLUID_H - padBottom).toFixed(2)} Z`;

  return (
    <svg
      className="block w-full"
      preserveAspectRatio="xMidYMax meet"
      viewBox={`0 0 ${FLUID_W} ${FLUID_H}`}
    >
      <GradientDefs id={gradientId} />
      <line
        stroke={dim}
        strokeLinecap="round"
        strokeWidth="1"
        x1={padX}
        x2={FLUID_W - padX}
        y1={FLUID_H - padBottom}
        y2={FLUID_H - padBottom}
      />
      <motion.path
        d={areaPath}
        fill={`url(#${gradientId}v)`}
        fillOpacity={0.16}
        initial={reduce ? undefined : { opacity: 0 }}
        transition={{ duration: MOTION_DURATION.slow, ease: EASE_OUT }}
        viewport={VIEWPORT}
        whileInView={reduce ? undefined : { opacity: 1 }}
      />
      <motion.polyline
        animate={reduce ? undefined : { pathLength: 1 }}
        fill="none"
        initial={reduce ? undefined : { pathLength: 0 }}
        points={lineAttr}
        stroke={`url(#${gradientId}h)`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        transition={{ duration: MOTION_DURATION.slow, ease: EASE_OUT }}
        vectorEffect="non-scaling-stroke"
      />
      {!reduce && (
        <motion.circle
          animate={{ r: [3, 10], opacity: [0.55, 0] }}
          cx={last.x}
          cy={last.y}
          fill="var(--brand-highlight)"
          transition={{
            duration: MOTION_DURATION.slow,
            ease: EASE_OUT,
            repeat: Infinity,
            repeatDelay: MOTION_DURATION.fast,
          }}
        />
      )}
      <circle
        cx={last.x}
        cy={last.y}
        fill="var(--brand-highlight)"
        r="3.5"
        stroke="var(--white)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Creators → sheer scale. A dense particle field that fills in by scatter. */
function DensityLight({ reduce, gradientId }: LightVisualProps) {
  const cols = 26;
  const rows = 5;
  const r = 2.1;
  const padX = 3;
  const padY = 4;
  const gapX = (FLUID_W - padX * 2) / (cols - 1);
  const gapY = (FLUID_H - padY * 2) / (rows - 1);
  const total = cols * rows;

  const dots: Array<{
    cx: number;
    cy: number;
    opacity: number;
    delay: number;
  }> = [];
  let index = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const scatter = (index * 11) % total;
      dots.push({
        cx: padX + col * gapX,
        cy: padY + row * gapY,
        opacity: index % 3 === 0 ? 0.4 : 0.92,
        delay: (scatter / total) * MOTION_DURATION.slow,
      });
      index += 1;
    }
  }

  return (
    <svg
      className="block w-full"
      preserveAspectRatio="xMidYMax meet"
      viewBox={`0 0 ${FLUID_W} ${FLUID_H}`}
    >
      <GradientDefs id={gradientId} />
      {dots.map((dot, i) => (
        <motion.circle
          cx={dot.cx}
          cy={dot.cy}
          fill={`url(#${gradientId}h)`}
          initial={reduce ? undefined : { opacity: 0, scale: 0 }}
          key={i}
          opacity={reduce ? dot.opacity : undefined}
          r={r}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          transition={{
            delay: dot.delay,
            duration: MOTION_DURATION.base,
            ease: EASE_OUT,
          }}
          viewport={VIEWPORT}
          whileInView={reduce ? undefined : { opacity: dot.opacity, scale: 1 }}
        />
      ))}
    </svg>
  );
}

type HeroStatVisualProps = {
  variant: HeroStatVisualVariant;
  tone?: HeroStatVisualTone;
  className?: string;
};

export function HeroStatVisual({
  variant,
  tone = "dark",
  className,
}: HeroStatVisualProps) {
  const reduce = Boolean(useHydratedReducedMotion());
  const rawId = useId();
  const { lit, dim } = TONES[tone];

  if (tone === "light") {
    // Sanitize the useId output (contains ":") so it's a valid url(#…) target.
    const gradientId = `hsv-${rawId.replace(/:/g, "")}`;
    return (
      <div aria-hidden="true" className={cn("w-full", className)}>
        {variant === "cluster" ? (
          <BarsLight dim={dim} gradientId={gradientId} reduce={reduce} />
        ) : null}
        {variant === "timeline" ? (
          <TimelineLight dim={dim} gradientId={gradientId} reduce={reduce} />
        ) : null}
        {variant === "density" ? (
          <DensityLight dim={dim} gradientId={gradientId} reduce={reduce} />
        ) : null}
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={cn("flex h-11 items-end", className)}>
      {variant === "cluster" ? (
        <Cluster dim={dim} lit={lit} reduce={reduce} />
      ) : null}
      {variant === "timeline" ? (
        <Timeline dim={dim} lit={lit} reduce={reduce} />
      ) : null}
      {variant === "density" ? <Density lit={lit} reduce={reduce} /> : null}
    </div>
  );
}
