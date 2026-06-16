"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { useHydratedReducedMotion } from "@/components/motion/use-hydrated-reduced-motion";
import { EASE_OUT, MOTION_DURATION } from "@/lib/motion";
import { cn } from "@/lib/utils";

type PulseDividerProps = {
  className?: string;
};

export function PulseDivider({ className }: PulseDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.7 });
  const shouldReduceMotion = useHydratedReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={cn("relative h-5 w-full", className)}
      ref={ref}
    >
      <div className="bg-signal-grid absolute top-2 left-0 h-px w-full" />
      <motion.span
        animate={
          isInView && !shouldReduceMotion
            ? { left: "calc(100% - 0.5rem)", opacity: [0, 1, 1, 0.72] }
            : undefined
        }
        className="bg-signal shadow-signal absolute top-[0.375rem] left-[calc(100%_-_0.5rem)] size-2 rounded-full"
        initial={
          shouldReduceMotion
            ? false
            : { left: "0%", opacity: isInView ? 1 : 0.72 }
        }
        style={shouldReduceMotion ? { left: "calc(100% - 0.5rem)" } : undefined}
        transition={{
          duration: MOTION_DURATION.slow,
          ease: EASE_OUT,
        }}
      />
    </div>
  );
}
