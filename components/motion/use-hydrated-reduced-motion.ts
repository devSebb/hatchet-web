"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function useHydratedReducedMotion() {
  const shouldReduceMotion = useReducedMotion();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setHasHydrated(true));

    return () => cancelAnimationFrame(frame);
  }, []);

  return hasHydrated ? shouldReduceMotion : false;
}
