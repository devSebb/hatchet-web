"use client";

import { Children, type ReactNode } from "react";
import { motion } from "framer-motion";

import {
  EASE_OUT,
  MOTION_DURATION,
  REVEAL_DISTANCE,
  STAGGER_STEP,
} from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useHydratedReducedMotion } from "./use-hydrated-reduced-motion";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  childClassName?: string;
  step?: number;
};

/**
 * Longest the whole cascade may run. Without a cap, a long list multiplies
 * `step` by its length — 60 cards at 0.07s leaves the last one hidden for over
 * four seconds, which reads as broken while the reader scrolls past it.
 */
const MAX_CASCADE_SECONDS = 1.2;

export function Stagger({
  children,
  className,
  childClassName,
  step = STAGGER_STEP,
}: StaggerProps) {
  const shouldReduceMotion = useHydratedReducedMotion();
  const items = Children.toArray(children);
  const cascadeStep = items.length
    ? Math.min(step, MAX_CASCADE_SECONDS / items.length)
    : step;

  if (shouldReduceMotion) {
    return (
      <div className={className}>
        {items.map((child, index) => (
          <div className={childClassName} key={index}>
            {child}
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: cascadeStep,
          },
        },
      }}
      /**
       * Trigger on a fixed pixel offset, never a fraction of the container. A
       * percentage threshold is unreachable once the container grows past the
       * viewport — a 60-card grid would need ~1,900px visible at `amount: 0.18`
       * — which left every child stuck at opacity 0. The negative bottom margin
       * keeps the "wait until it is properly in view" feel at any list length.
       */
      viewport={{ once: true, amount: "some", margin: "0px 0px -80px 0px" }}
      whileInView="visible"
    >
      {items.map((child, index) => (
        <motion.div
          className={cn("will-change-transform", childClassName)}
          key={index}
          variants={{
            hidden: { opacity: 0, y: REVEAL_DISTANCE.base },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: MOTION_DURATION.base,
                ease: EASE_OUT,
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
