"use client";

import { Children, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import {
  EASE_OUT,
  MOTION_DURATION,
  REVEAL_DISTANCE,
  STAGGER_STEP,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  childClassName?: string;
  step?: number;
};

export function Stagger({
  children,
  className,
  childClassName,
  step = STAGGER_STEP,
}: StaggerProps) {
  const shouldReduceMotion = useReducedMotion();
  const items = Children.toArray(children);

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
            staggerChildren: step,
          },
        },
      }}
      viewport={{ once: true, amount: 0.18 }}
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
