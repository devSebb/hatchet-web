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
import { AnimatePresence, motion, useInView } from "framer-motion";

import { useHydratedReducedMotion } from "@/components/motion/use-hydrated-reduced-motion";
import { Button } from "@/components/ui/button";
import { EASE_OUT, MOTION_DURATION } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Stage = {
  num: string;
  stage: string;
  tagline: string;
  href: string;
  Icon: LucideIcon;
  /** Unit direction from the core. 0 top → clockwise. */
  dir: { x: number; y: number };
};

const STAGES: Stage[] = [
  {
    num: "01",
    stage: "Find & Verify",
    tagline:
      "Describe the creator you need, get a match — and know they're real before you commit.",
    href: "/solutions/discovery",
    Icon: SearchCheckIcon,
    dir: { x: 0, y: -1 },
  },
  {
    num: "02",
    stage: "Analyze",
    tagline:
      "Streaming and social performance, side by side in one cross-platform view.",
    href: "/solutions/intelligence",
    Icon: LineChartIcon,
    dir: { x: 1, y: 0 },
  },
  {
    num: "03",
    stage: "Execute",
    tagline:
      "Run campaigns end to end — roster, contracts, payments, and deliverables in one place.",
    href: "/solutions/creator-community",
    Icon: WorkflowIcon,
    dir: { x: 0, y: 1 },
  },
  {
    num: "04",
    stage: "Report",
    tagline:
      "EMV, engagement, and per-creator results — ready-to-use exports for stakeholders.",
    href: "/solutions/reporting",
    Icon: FileTextIcon,
    dir: { x: -1, y: 0 },
  },
];

const AUTO_ADVANCE_MS = 4200;

// ── Geometry (SVG user units) — wide rectangular field, circular core ──────
const VBW = 140;
const VBH = 100;
const CX = 70;
const CY = 50;
const CORE_R = 15; // outer radius of the faceted core (circular gem)
const TABLE_R = 6; // inner "table" of the cut gem
const RX = 52; // horizontal station/ring radius (wide)
const RY = 34; // vertical station/ring radius (short) → rectangular field
const DIAG = 0.707;
const TRACE_BACK = 9; // trace stops this far short of the station

const octagon = (r: number) =>
  Array.from({ length: 8 }, (_, k) => {
    const a = ((-90 + k * 45) * Math.PI) / 180;
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
  });

const fmt = (p: { x: number; y: number }) =>
  `${p.x.toFixed(2)},${p.y.toFixed(2)}`;

const CORE_OUTER = octagon(CORE_R);
const CORE_TABLE = octagon(TABLE_R);
const CORE_OUTER_PTS = CORE_OUTER.map(fmt).join(" ");
const CORE_TABLE_PTS = CORE_TABLE.map(fmt).join(" ");

// Faceted outer ring — a wide octagon (rectangular, not round).
const RING = [
  { x: CX, y: CY - RY },
  { x: CX + RX * DIAG, y: CY - RY * DIAG },
  { x: CX + RX, y: CY },
  { x: CX + RX * DIAG, y: CY + RY * DIAG },
  { x: CX, y: CY + RY },
  { x: CX - RX * DIAG, y: CY + RY * DIAG },
  { x: CX - RX, y: CY },
  { x: CX - RX * DIAG, y: CY - RY * DIAG },
];
const RING_PATH = `M ${RING.map(fmt).join(" L ")} Z`;

const traceFor = (dir: { x: number; y: number }) => ({
  a: { x: CX + dir.x * CORE_R, y: CY + dir.y * CORE_R },
  b: { x: CX + dir.x * (RX - TRACE_BACK), y: CY + dir.y * (RY - TRACE_BACK) },
});

// Light-from-above facet ramp (composed from charcoal tokens, no raw hex).
const FACET_FILLS = [
  "color-mix(in srgb, var(--elevated) 64%, var(--white) 16%)", // top — brightest
  "var(--elevated)", // top-right
  "color-mix(in srgb, var(--elevated) 58%, var(--surface) 42%)", // right
  "var(--surface)", // bottom-right
  "color-mix(in srgb, var(--surface) 52%, var(--bg) 48%)", // bottom — darkest
  "var(--surface)", // bottom-left
  "color-mix(in srgb, var(--elevated) 58%, var(--surface) 42%)", // left
  "var(--elevated)", // top-left
];

const CROWN_FACETS = CORE_OUTER.map((_, k) => {
  const n = (k + 1) % 8;
  return {
    points: [CORE_TABLE[k], CORE_TABLE[n], CORE_OUTER[n], CORE_OUTER[k]]
      .map(fmt)
      .join(" "),
    fill: FACET_FILLS[k],
  };
});

// Octagonal faceted tile (chamfered corners) — shared rest/active shape.
const CLIP =
  "polygon(14% 0%, 86% 0%, 100% 22%, 100% 78%, 86% 100%, 14% 100%, 0% 78%, 0% 22%)";

const FACE_BG =
  "linear-gradient(160deg, var(--elevated) 0%, var(--surface) 60%, color-mix(in srgb, var(--surface) 70%, var(--bg)) 100%)";
const EDGE_REST =
  "linear-gradient(150deg, color-mix(in srgb, var(--white) 22%, var(--border)) 0%, var(--border) 50%, color-mix(in srgb, var(--bg) 55%, var(--border)) 100%)";
const EDGE_ACTIVE =
  "linear-gradient(150deg, color-mix(in srgb, var(--white) 30%, var(--brand)) 0%, color-mix(in srgb, var(--brand) 55%, var(--bg)) 100%)";
const UNDERGLOW =
  "radial-gradient(120% 100% at 50% 120%, color-mix(in srgb, var(--brand) 60%, transparent) 0%, transparent 70%)";

function StationFacet({
  stage,
  isActive,
  layout,
}: {
  stage: Stage;
  isActive: boolean;
  layout: "tile" | "row";
}) {
  const { Icon } = stage;
  return (
    <span
      className="block p-px transition-[filter] duration-(--dur-base)"
      style={{ clipPath: CLIP, background: isActive ? EDGE_ACTIVE : EDGE_REST }}
    >
      <span
        className={cn(
          "relative block overflow-hidden",
          layout === "tile" ? "px-4 py-3.5" : "px-4 py-3",
        )}
        style={{ clipPath: CLIP, background: FACE_BG }}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 -bottom-2 h-3/4 blur-md transition-opacity duration-(--dur-base)",
            isActive ? "opacity-100" : "opacity-0",
          )}
          style={{ background: UNDERGLOW }}
        />
        <span
          className={cn(
            "relative flex items-center",
            layout === "tile" ? "justify-center gap-3" : "gap-3",
          )}
        >
          <Icon
            aria-hidden="true"
            className={cn(
              "size-5 shrink-0 transition-colors duration-(--dur-base)",
              isActive ? "text-brand-highlight" : "text-muted",
            )}
          />
          <span className="flex flex-col">
            <span
              className={cn(
                "font-mono text-xs font-semibold tabular-nums transition-colors duration-(--dur-base)",
                isActive ? "text-brand" : "text-muted",
              )}
            >
              {stage.num}
            </span>
            <span
              className={cn(
                "text-sm font-semibold transition-colors duration-(--dur-base)",
                isActive ? "text-foreground" : "text-muted",
              )}
            >
              {stage.stage}
            </span>
          </span>
        </span>
      </span>
    </span>
  );
}

function CoreLabel({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 text-center">
      <Image
        alt="Hatchet"
        className={cn("h-auto object-contain", compact ? "w-16" : "w-4/5")}
        height={832}
        src="/brand/hatchet_hatchet_white.png"
        width={2102}
      />
      <span className="eyebrow text-muted text-[0.5rem]">
        Creator Intelligence
      </span>
    </div>
  );
}

export function CreatorLifecycle({ className }: { className?: string }) {
  const reduceMotion = useHydratedReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3 });
  const [active, setActive] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const gradientId = useId().replace(/:/g, "");
  const panelId = `${gradientId}-panel`;

  // Demo itself on a gentle interval; hand control to the user on first
  // interaction and never auto-advance again. Paused while offscreen.
  useEffect(() => {
    if (reduceMotion || interacted || !inView) {
      return;
    }
    const id = window.setInterval(() => {
      setActive((index) => (index + 1) % STAGES.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, interacted, inView]);

  const activate = (index: number) => {
    setInteracted(true);
    setActive(index);
  };

  const activeStage = STAGES[active];
  const animateRouting = !reduceMotion && inView;

  return (
    <section
      className={cn(
        "bg-background text-foreground relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24",
        className,
      )}
      ref={sectionRef}
    >
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

        <div className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-[1.7fr_1fr] lg:gap-12">
          {/* ── The Intelligence Core (desktop, wide rectangular field) ─ */}
          <div className="relative mx-auto hidden aspect-[7/5] w-full max-w-[46rem] lg:block">
            {animateRouting ? (
              <motion.div
                animate={{ rotate: 360 }}
                aria-hidden="true"
                className="absolute inset-[14%] rounded-full opacity-[0.06]"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, var(--brand) 36deg, transparent 84deg)",
                }}
                transition={{ duration: 16, ease: "linear", repeat: Infinity }}
              />
            ) : null}

            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
              fill="none"
              viewBox={`0 0 ${VBW} ${VBH}`}
            >
              <defs>
                <linearGradient
                  id={`${gradientId}-table`}
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="color-mix(in srgb, var(--elevated) 58%, var(--white) 24%)"
                  />
                  <stop offset="100%" stopColor="var(--surface)" />
                </linearGradient>
                <radialGradient id={`${gradientId}-glow`}>
                  <stop
                    offset="0%"
                    stopColor="color-mix(in srgb, var(--brand) 85%, transparent)"
                  />
                  <stop
                    offset="65%"
                    stopColor="color-mix(in srgb, var(--brand) 22%, transparent)"
                  />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <clipPath id={`${gradientId}-core`}>
                  <polygon points={CORE_OUTER_PTS} />
                </clipPath>
              </defs>

              {/* Faceted outer ring (draws itself in on first reveal). */}
              <motion.path
                d={RING_PATH}
                initial={reduceMotion ? false : { pathLength: 0 }}
                stroke="var(--signal-grid)"
                strokeWidth={0.4}
                transition={{ duration: 1.1, ease: "easeInOut" }}
                viewport={{ once: true, amount: 0.3 }}
                whileInView={reduceMotion ? undefined : { pathLength: 1 }}
              />

              {/* Idle circuit traces (every inactive station). */}
              {STAGES.map((s, i) => {
                if (i === active) {
                  return null;
                }
                const { a, b } = traceFor(s.dir);
                return (
                  <line
                    className={animateRouting ? "cta-trace-flow" : undefined}
                    key={s.num}
                    stroke="var(--signal-grid)"
                    strokeDasharray="1 2"
                    strokeWidth={0.3}
                    x1={a.x}
                    x2={b.x}
                    y1={a.y}
                    y2={b.y}
                  />
                );
              })}

              {/* Faceted core: crown facets + lit table. */}
              {CROWN_FACETS.map((facet, i) => (
                <polygon
                  fill={facet.fill}
                  key={i}
                  points={facet.points}
                  stroke="color-mix(in srgb, var(--bg) 55%, transparent)"
                  strokeWidth={0.15}
                />
              ))}
              <polygon
                fill={`url(#${gradientId}-table)`}
                points={CORE_TABLE_PTS}
              />

              {/* Sub-surface red glow, contained inside the core (breathing). */}
              <motion.circle
                animate={
                  animateRouting ? { opacity: [0.32, 0.6, 0.32] } : undefined
                }
                clipPath={`url(#${gradientId}-core)`}
                cx={CX}
                cy={CY}
                fill={`url(#${gradientId}-glow)`}
                initial={false}
                opacity={reduceMotion ? 0.42 : 0.32}
                r={CORE_R}
                transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
              />

              {/* Live trace → active station + traveling data packet. */}
              {(() => {
                const { a, b } = traceFor(activeStage.dir);
                return (
                  <g key={`live-${active}`}>
                    <line
                      stroke="var(--brand)"
                      strokeLinecap="round"
                      strokeWidth={0.7}
                      x1={a.x}
                      x2={b.x}
                      y1={a.y}
                      y2={b.y}
                    />
                    {animateRouting ? (
                      <motion.circle
                        animate={{
                          cx: [a.x, b.x],
                          cy: [a.y, b.y],
                          opacity: [0, 1, 1, 0],
                        }}
                        fill="var(--brand-highlight)"
                        r={1.4}
                        style={{
                          filter: "drop-shadow(0 0 1.5px var(--brand))",
                        }}
                        transition={{
                          duration: 1.3,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 0.2,
                        }}
                      />
                    ) : null}
                  </g>
                );
              })()}
            </svg>

            {/* Core label overlay. */}
            <div className="absolute left-1/2 top-1/2 flex aspect-square w-[22%] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <CoreLabel />
            </div>

            {/* Stations — real links; hover/focus activates, click navigates. */}
            {STAGES.map((s, i) => {
              const isActive = i === active;
              return (
                <Link
                  aria-label={`Step ${s.num}: ${s.stage}`}
                  className="group focus-visible:ring-ring/60 absolute w-44 -translate-x-1/2 -translate-y-1/2 rounded-xl no-underline outline-none focus-visible:ring-3"
                  href={s.href}
                  key={s.num}
                  onFocus={() => activate(i)}
                  onMouseEnter={() => activate(i)}
                  style={{
                    left: `${((CX + s.dir.x * RX) / VBW) * 100}%`,
                    top: `${((CY + s.dir.y * RY) / VBH) * 100}%`,
                  }}
                >
                  <StationFacet isActive={isActive} layout="tile" stage={s} />
                </Link>
              );
            })}
          </div>

          {/* ── Mobile / tablet: vertical faceted stepper ──────────── */}
          <div className="lg:hidden">
            <div className="relative mx-auto mb-7 w-fit">
              {!reduceMotion ? (
                <span
                  aria-hidden="true"
                  className="bg-brand/25 absolute inset-2 rounded-full blur-2xl"
                />
              ) : null}
              <div
                className="border-border/70 relative flex items-center justify-center border p-4"
                style={{ clipPath: CLIP, background: FACE_BG }}
              >
                <CoreLabel compact />
              </div>
            </div>

            <div className="relative pl-7">
              <span
                aria-hidden="true"
                className="bg-border absolute top-4 bottom-4 left-2 w-px"
              />
              <motion.span
                animate={{
                  height: `${((active + 1) / STAGES.length) * 100}%`,
                }}
                aria-hidden="true"
                className="bg-brand shadow-glow-brand absolute top-4 left-2 w-px"
                initial={false}
                transition={{
                  duration: reduceMotion ? 0 : MOTION_DURATION.base,
                  ease: EASE_OUT,
                }}
              />
              <ol className="grid gap-3">
                {STAGES.map((s, i) => (
                  <li key={s.num}>
                    <Link
                      aria-label={`Step ${s.num}: ${s.stage}`}
                      className="group focus-visible:ring-ring/60 block rounded-xl no-underline outline-none focus-visible:ring-3"
                      href={s.href}
                      onFocus={() => activate(i)}
                      onMouseEnter={() => activate(i)}
                    >
                      <StationFacet
                        isActive={i === active}
                        layout="row"
                        stage={s}
                      />
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* ── Detail card ────────────────────────────────────────── */}
          <div
            aria-atomic="true"
            aria-live="polite"
            className="border-border bg-card/60 cta-panel-frame relative mt-10 min-h-64 rounded-2xl border p-7 backdrop-blur-sm lg:mt-0 lg:min-h-72 lg:p-8"
            id={panelId}
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
