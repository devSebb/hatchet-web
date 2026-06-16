"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { EASE_OUT, MOTION_DURATION, REVEAL_DISTANCE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: keyof typeof REVEAL_DISTANCE;
};

export function Reveal({
  children,
  className,
  delay = 0,
  distance = "base",
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: REVEAL_DISTANCE[distance] }}
      transition={{
        delay,
        duration: MOTION_DURATION.base,
        ease: EASE_OUT,
      }}
      viewport={{ once: true, amount: 0.24 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}

type RevealBlockProps = RevealProps & {
  asChild?: never;
};

export function RevealBlock({ className, ...props }: RevealBlockProps) {
  return (
    <Reveal className={cn("will-change-transform", className)} {...props} />
  );
}
