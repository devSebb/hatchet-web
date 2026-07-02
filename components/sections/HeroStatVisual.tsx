"use client";

import { motion } from "framer-motion";

import { useHydratedReducedMotion } from "@/components/motion/use-hydrated-reduced-motion";
import { EASE_OUT, MOTION_DURATION } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type HeroStatVisualVariant = "cluster" | "timeline" | "density";

export type HeroStatVisualTone = "dark" | "light";

// "dark" is tuned for the navy top of the gradient hero, where these render on
// a faint translucent card: lit is the brand accent, dim a barely-there white.
// "light" flips the pair for pale surfaces — full brand red over a faint navy.
const TONES: Record<HeroStatVisualTone, { lit: string; dim: string }> = {
  dark: {
    lit: "var(--brand-highlight)",
    dim: "color-mix(in srgb, var(--white) 16%, transparent)",
  },
  light: {
    lit: "var(--brand)",
    dim: "color-mix(in srgb, var(--bg) 22%, transparent)",
  },
};

type VisualProps = { reduce: boolean; lit: string; dim: string };

const VIEWPORT = { once: true, amount: 0.5 } as const;

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
      <text
        fill="currentColor"
        fontSize="8"
        opacity="0.5"
        x={pad}
        y={height - 1}
      >
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
  const { lit, dim } = TONES[tone];

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
