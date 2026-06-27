"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowRightIcon,
  FileTextIcon,
  type LucideIcon,
  LineChartIcon,
  SearchCheckIcon,
  WorkflowIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useHydratedReducedMotion } from "@/components/motion/use-hydrated-reduced-motion";
import { Button } from "@/components/ui/button";
import { MOTION_DURATION, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Stage = {
  num: string;
  stage: string;
  tagline: string;
  href: string;
  Icon: LucideIcon;
  /** Node center on the ring (lg+). Indices: 0 top, 1 right, 2 bottom, 3 left. */
  pos: string;
  /** SVG node point for the decorative ring/connectors. */
  point: { x: number; y: number };
};

const STAGES: Stage[] = [
  {
    num: "01",
    stage: "Find & Verify",
    tagline:
      "Describe the creator you need, get a match — and know they're real before you commit.",
    href: "/solutions/discovery",
    Icon: SearchCheckIcon,
    pos: "lg:left-1/2 lg:top-[12%]",
    point: { x: 50, y: 12 },
  },
  {
    num: "02",
    stage: "Analyze",
    tagline:
      "Streaming and social performance, side by side in one cross-platform view.",
    href: "/solutions/intelligence",
    Icon: LineChartIcon,
    pos: "lg:left-[88%] lg:top-1/2",
    point: { x: 88, y: 50 },
  },
  {
    num: "03",
    stage: "Execute",
    tagline:
      "Run campaigns end to end — roster, contracts, payments, and deliverables in one place.",
    href: "/solutions/creator-community",
    Icon: WorkflowIcon,
    pos: "lg:left-1/2 lg:top-[88%]",
    point: { x: 50, y: 88 },
  },
  {
    num: "04",
    stage: "Report",
    tagline:
      "EMV, engagement, and per-creator results — ready-to-use exports for stakeholders.",
    href: "/solutions/reporting",
    Icon: FileTextIcon,
    pos: "lg:left-[12%] lg:top-1/2",
    point: { x: 12, y: 50 },
  },
];

const RING_RADIUS = 38;
const AUTO_ADVANCE_MS = 4800;

export function CreatorLifecycle({ className }: { className?: string }) {
  const reduceMotion = useHydratedReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  // Auto-advance through the stages until the user hovers/focuses the widget.
  useEffect(() => {
    if (reduceMotion || paused) {
      return;
    }
    const interval = window.setInterval(() => {
      setActive((index) => (index + 1) % STAGES.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(interval);
  }, [reduceMotion, paused]);

  const select = (index: number, focus = false) => {
    const next = (index + STAGES.length) % STAGES.length;
    setActive(next);
    if (focus) {
      tabRefs.current[next]?.focus();
    }
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        select(index + 1, true);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        select(index - 1, true);
        break;
      case "Home":
        event.preventDefault();
        select(0, true);
        break;
      case "End":
        event.preventDefault();
        select(STAGES.length - 1, true);
        break;
      default:
        break;
    }
  };

  const activeStage = STAGES[active];

  return (
    <section
      className={cn(
        "bg-background text-foreground relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24",
        className,
      )}
    >
      {/* Decorative data substrate (matches the featured CTA texture system). */}
      <div
        aria-hidden="true"
        className="cta-grid pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="cta-grain pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <p className="eyebrow text-muted">How it works</p>
          <h2 className="h1 mt-4">The full creator lifecycle. One platform.</h2>
          <p className="body-lg text-muted mt-5">
            From first search to final report — without switching tools.
          </p>
        </div>

        <div
          className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-[1.45fr_1fr] lg:gap-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setPaused(false);
            }
          }}
        >
          {/* ── Orbital selector (hero, ~60%) ───────────────────────── */}
          <div
            aria-label="Creator lifecycle stages"
            className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:max-w-lg lg:block lg:aspect-square lg:max-w-[34rem] lg:gap-0"
            role="tablist"
          >
            {/* Decorative ring, connectors, hub, traveling pulse (lg only). */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden lg:block"
            >
              <svg
                className="absolute inset-0 h-full w-full"
                fill="none"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r={RING_RADIUS}
                  style={{ stroke: "var(--signal-grid)" }}
                  strokeDasharray="1 3"
                  strokeWidth="0.4"
                />
                {STAGES.map((s, i) => (
                  <line
                    key={s.num}
                    style={{
                      stroke:
                        i === active ? "var(--brand)" : "var(--signal-grid)",
                      transition: "stroke var(--dur-base) var(--ease-out)",
                    }}
                    strokeWidth={i === active ? 0.6 : 0.3}
                    x1="50"
                    x2={s.point.x}
                    y1="50"
                    y2={s.point.y}
                  />
                ))}
              </svg>

              {/* Traveling signal pulse around the ring. */}
              {!reduceMotion ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  className="absolute inset-0"
                  style={{ transformOrigin: "50% 50%" }}
                  transition={{ duration: 18, ease: "linear", repeat: Infinity }}
                >
                  <span className="bg-brand-highlight shadow-glow-brand absolute left-1/2 top-[12%] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                </motion.div>
              ) : null}
            </div>

            {/* Central Hatchet hub (lg only). */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 hidden size-[34%] -translate-x-1/2 -translate-y-1/2 lg:flex lg:flex-col lg:items-center lg:justify-center"
            >
              {!reduceMotion ? (
                <motion.div
                  animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.08, 1] }}
                  className="bg-brand/30 absolute inset-2 rounded-full blur-2xl"
                  transition={{
                    duration: 6,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
              ) : (
                <div className="bg-brand/25 absolute inset-2 rounded-full blur-2xl" />
              )}
              <div className="border-border/70 bg-elevated/80 shadow-glow-brand relative flex aspect-square w-full items-center justify-center rounded-full border backdrop-blur-sm">
                <div className="flex flex-col items-center gap-1.5 px-4">
                  <Image
                    alt="Hatchet"
                    className="h-auto w-3/4 max-w-none object-contain"
                    height={832}
                    src="/brand/hatchet_hatchet_white.png"
                    width={2102}
                  />
                  <span className="eyebrow text-muted text-[0.55rem]">
                    Creator Intelligence
                  </span>
                </div>
              </div>
            </div>

            {/* Stage nodes — the actual tabs. */}
            {STAGES.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  aria-controls={`${baseId}-panel`}
                  aria-selected={isActive}
                  className={cn(
                    "group focus-visible:ring-ring/60 flex flex-col items-center gap-2 rounded-2xl outline-none focus-visible:ring-3 lg:absolute lg:w-32 lg:-translate-x-1/2 lg:-translate-y-1/2",
                    s.pos,
                  )}
                  id={`${baseId}-tab-${i}`}
                  key={s.num}
                  onClick={() => select(i)}
                  onKeyDown={(event) => onKeyDown(event, i)}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                >
                  <span
                    className={cn(
                      "relative flex size-16 items-center justify-center rounded-full border transition-all duration-(--dur-base) sm:size-20",
                      isActive
                        ? "border-brand bg-elevated shadow-glow-brand scale-105"
                        : "border-border bg-card group-hover:border-brand/50 group-hover:bg-elevated",
                    )}
                  >
                    <s.Icon
                      aria-hidden="true"
                      className={cn(
                        "size-6 transition-colors duration-(--dur-base) sm:size-7",
                        isActive
                          ? "text-brand-highlight"
                          : "text-muted group-hover:text-foreground",
                      )}
                    />
                  </span>
                  <span className="flex flex-col items-center">
                    <span
                      className={cn(
                        "font-display text-xs font-bold tabular-nums transition-colors duration-(--dur-base)",
                        isActive ? "text-brand" : "text-muted",
                      )}
                    >
                      {s.num}
                    </span>
                    <span
                      className={cn(
                        "text-center text-sm font-semibold transition-colors duration-(--dur-base)",
                        isActive
                          ? "text-foreground"
                          : "text-muted group-hover:text-foreground",
                      )}
                    >
                      {s.stage}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Detail panel (secondary, ~40%) ──────────────────────── */}
          <div
            aria-labelledby={`${baseId}-tab-${active}`}
            className="border-border bg-card/60 cta-panel-frame relative min-h-64 rounded-2xl border p-7 backdrop-blur-sm lg:min-h-72 lg:p-8"
            id={`${baseId}-panel`}
            role="tabpanel"
          >
            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex h-full flex-col"
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                key={active}
                transition={{ duration: MOTION_DURATION.base, ease: EASE_OUT }}
              >
                <p className="eyebrow text-muted">
                  <span className="text-brand">{activeStage.num}</span> ·{" "}
                  {activeStage.stage}
                </p>
                <p className="body-lg text-foreground mt-4 text-balance">
                  {activeStage.tagline}
                </p>
                <div className="mt-auto pt-8">
                  <Button asChild>
                    <Link href={activeStage.href}>
                      Explore {activeStage.stage}
                      <ArrowRightIcon aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
