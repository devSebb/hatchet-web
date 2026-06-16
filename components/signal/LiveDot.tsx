"use client";

import { motion, useReducedMotion } from "framer-motion";

import { EASE_OUT, MOTION_DURATION } from "@/lib/motion";
import { cn } from "@/lib/utils";

type LiveDotProps = {
  className?: string;
  label?: string;
};

export function LiveDot({ className, label = "Live" }: LiveDotProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span
      className={cn("inline-flex items-center gap-2 text-current", className)}
    >
      <span className="relative inline-flex size-2.5" aria-hidden="true">
        {!shouldReduceMotion && (
          <motion.span
            animate={{ opacity: [0.35, 0], scale: [1, 2.35] }}
            className="bg-signal absolute inset-0 rounded-full"
            transition={{
              duration: MOTION_DURATION.slow,
              ease: EASE_OUT,
              repeat: Infinity,
              repeatDelay: MOTION_DURATION.fast,
            }}
          />
        )}
        <span className="bg-signal shadow-signal relative size-2.5 rounded-full" />
      </span>
      <span>{label}</span>
    </span>
  );
}
