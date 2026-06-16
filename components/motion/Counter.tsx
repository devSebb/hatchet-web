"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";

import { MOTION_DURATION_MS } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useHydratedReducedMotion } from "./use-hydrated-reduced-motion";

type CounterProps = {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

export function Counter({
  to,
  from = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.45 });
  const shouldReduceMotion = useHydratedReducedMotion();
  const [value, setValue] = useState(from);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      }),
    [decimals],
  );

  useEffect(() => {
    if (!isInView || shouldReduceMotion) {
      return;
    }

    let frame = 0;
    const startedAt = performance.now();
    const delta = to - from;

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(elapsed / MOTION_DURATION_MS.slow, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(from + delta * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [from, isInView, shouldReduceMotion, to]);

  const displayValue = shouldReduceMotion ? to : value;

  return (
    <span
      className={cn("stat-figure tabular-nums", className)}
      ref={ref}
      suppressHydrationWarning
    >
      {prefix}
      {formatter.format(displayValue)}
      {suffix}
    </span>
  );
}
