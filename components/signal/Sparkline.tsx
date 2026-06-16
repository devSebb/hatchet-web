"use client";

import { useId, useMemo } from "react";
import { motion } from "framer-motion";

import { useHydratedReducedMotion } from "@/components/motion/use-hydrated-reduced-motion";
import { EASE_OUT, MOTION_DURATION } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SparklineProps = {
  data: number[];
  color?: string;
  height?: number;
  animated?: boolean;
  className?: string;
  strokeWidth?: number;
};

const VIEWBOX_WIDTH = 240;

function buildPoints(data: number[], height: number) {
  if (data.length === 0) {
    return "";
  }

  if (data.length === 1) {
    return `0,${height / 2} ${VIEWBOX_WIDTH},${height / 2}`;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = VIEWBOX_WIDTH / (data.length - 1);
  const padding = 4;
  const usableHeight = height - padding * 2;

  return data
    .map((point, index) => {
      const x = index * step;
      const normalized = (point - min) / range;
      const y = height - padding - normalized * usableHeight;

      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function Sparkline({
  data,
  color = "var(--signal)",
  height = 48,
  animated = true,
  className,
  strokeWidth = 1.5,
}: SparklineProps) {
  const titleId = useId();
  const shouldReduceMotion = useHydratedReducedMotion();
  const points = useMemo(() => buildPoints(data, height), [data, height]);
  const shouldAnimate = animated && !shouldReduceMotion;

  return (
    <svg
      aria-labelledby={titleId}
      className={cn("block w-full overflow-visible", className)}
      height={height}
      role="img"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${height}`}
    >
      <title id={titleId}>Signal sparkline</title>
      <line
        stroke="var(--signal-grid)"
        strokeLinecap="round"
        strokeWidth="1"
        x1="0"
        x2={VIEWBOX_WIDTH}
        y1={height - 4}
        y2={height - 4}
      />
      <motion.polyline
        animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : undefined}
        fill="none"
        initial={shouldAnimate ? { pathLength: 0, opacity: 0.72 } : false}
        points={points}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        transition={{
          duration: MOTION_DURATION.slow,
          ease: EASE_OUT,
        }}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
