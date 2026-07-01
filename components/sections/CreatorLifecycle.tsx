"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
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
  ctaLabel: string;
  href: string;
  Icon: LucideIcon;
  /** Unit direction from the core (cardinal); scaled by the station radii. */
  dir: { x: number; y: number };
};

const STAGES: Stage[] = [
  {
    num: "01",
    stage: "Find & Verify",
    tagline:
      "Describe the creator you need and get a match. AI-powered search surfaces the right fit fast, and fake audience scoring flags suspicious channels before you commit.",
    ctaLabel: "Explore Creator Discovery",
    href: "/solutions/discovery",
    Icon: SearchCheckIcon,
    dir: { x: 0, y: -1 },
  },
  {
    num: "02",
    stage: "Analyze",
    tagline:
      "Streaming and social in one view. Track performance across every platform your campaign touches, without switching tools or stitching spreadsheets together.",
    ctaLabel: "Explore Intelligence",
    href: "/solutions/intelligence",
    Icon: LineChartIcon,
    dir: { x: 1, y: 0 },
  },
  {
    num: "03",
    stage: "Execute",
    tagline:
      "Manage your entire creator roster from one place. Brief, track, and coordinate campaigns end-to-end via a single, customizable hub.",
    ctaLabel: "Explore Creator Community",
    href: "/solutions/creator-community",
    Icon: WorkflowIcon,
    dir: { x: 0, y: 1 },
  },
  {
    num: "04",
    stage: "Report",
    tagline:
      "Every campaign metric in one dashboard. Per-creator breakdowns, engagement, and export-ready reports your clients or stakeholders can easily understand.",
    ctaLabel: "Explore Reporting",
    href: "/solutions/reporting",
    Icon: FileTextIcon,
    dir: { x: -1, y: 0 },
  },
];

const AUTO_ADVANCE_MS = 4200;

// ── Geometry (SVG user units) — wide rectangular field, symmetric cross, ───
//    core centered. The four corners stay empty; the detail card floats in ──
//    the top-right one without disturbing the layout. ────────────────────────
const VBW = 160;
const VBH = 80; // 160/80 = 2/1 → matches the aspect-[2/1] canvas (no distortion)
const CX = 80;
const CY = 40;
const CORE_R = 14; // outer radius of the faceted core (circular gem)
const TABLE_R = 5.5; // inner "table" of the cut gem
const RX = 56; // horizontal station radius (wide field)
const RY = 28; // vertical station radius (short field)
const RING_RX = 61; // ring sits just outside the stations
const RING_RY = 31;
const DIAG = 0.707;
const TRACE_BACK = 8; // trace stops this far short of the station

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
  { x: CX, y: CY - RING_RY },
  { x: CX + RING_RX * DIAG, y: CY - RING_RY * DIAG },
  { x: CX + RING_RX, y: CY },
  { x: CX + RING_RX * DIAG, y: CY + RING_RY * DIAG },
  { x: CX, y: CY + RING_RY },
  { x: CX - RING_RX * DIAG, y: CY + RING_RY * DIAG },
  { x: CX - RING_RX, y: CY },
  { x: CX - RING_RX * DIAG, y: CY - RING_RY * DIAG },
];
const RING_PATH = `M ${RING.map(fmt).join(" L ")} Z`;

// Station centre in user units (direction scaled by the station radii).
const stationPos = (dir: { x: number; y: number }) => ({
  x: CX + dir.x * RX,
  y: CY + dir.y * RY,
});

// Trace from the core edge to just short of the station, along the true
// (non-cardinal) direction toward that station.
const traceFor = (dir: { x: number; y: number }) => {
  const p = stationPos(dir);
  const dx = p.x - CX;
  const dy = p.y - CY;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return {
    a: { x: CX + ux * CORE_R, y: CY + uy * CORE_R },
    b: { x: p.x - ux * TRACE_BACK, y: p.y - uy * TRACE_BACK },
  };
};

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

// Faceted octagon — used only by the mobile core badge (the core, unchanged).
const CORE_CLIP =
  "polygon(18% 0%, 82% 0%, 100% 18%, 100% 82%, 82% 100%, 18% 100%, 0% 82%, 0% 18%)";

const FACE_BG =
  "linear-gradient(160deg, var(--elevated) 0%, var(--surface) 60%, color-mix(in srgb, var(--surface) 70%, var(--bg)) 100%)";
const UNDERGLOW =
  "radial-gradient(120% 100% at 50% 120%, color-mix(in srgb, var(--brand) 60%, transparent) 0%, transparent 70%)";

function StationFacet({
  stage,
  isActive,
}: {
  stage: Stage;
  isActive: boolean;
}) {
  const { Icon } = stage;
  return (
    <span className="relative block">
      {/* Red under-glow behind the card (active only). */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-2 rounded-2xl blur-lg transition-opacity duration-[250ms]",
          isActive ? "opacity-100" : "opacity-0",
        )}
        style={{ background: UNDERGLOW }}
      />

      {/* Clean rounded card — mirrors the detail banner. Tighter vertical
          padding + a clear number→title hierarchy so it reads, not mushes. */}
      <span
        className={cn(
          "cta-panel-frame relative flex items-center gap-4 rounded-2xl border px-4 py-3.5 backdrop-blur-sm transition-[border-color,background-color] duration-[250ms]",
          isActive ? "border-brand bg-card/85" : "border-border bg-card/60",
        )}
      >
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors duration-[250ms]",
            isActive
              ? "border-brand/40 bg-brand/10"
              : "border-border bg-elevated/60",
          )}
        >
          <Icon
            aria-hidden="true"
            className={cn(
              "size-5 transition-colors duration-[250ms]",
              isActive ? "text-brand-highlight" : "text-muted",
            )}
          />
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span
            className={cn(
              "font-mono text-[0.65rem] font-semibold tracking-[0.18em] tabular-nums transition-colors duration-[250ms]",
              isActive ? "text-brand" : "text-muted/80",
            )}
          >
            {stage.num}
          </span>
          <span
            className={cn(
              "text-[0.95rem] leading-none font-semibold transition-colors duration-[250ms]",
              isActive ? "text-foreground" : "text-muted",
            )}
          >
            {stage.stage}
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

function DetailPanel({
  stage,
  motionKey,
  reduceMotion,
  panelId,
  className,
}: {
  stage: Stage;
  motionKey: number;
  reduceMotion: boolean | null;
  panelId: string;
  className?: string;
}) {
  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className={cn(
        "border-border bg-card/75 cta-panel-frame rounded-2xl border p-5 backdrop-blur-md lg:p-6",
        className,
      )}
      id={panelId}
    >
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col"
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          key={motionKey}
          transition={{ duration: MOTION_DURATION.base, ease: EASE_OUT }}
        >
          <p className="eyebrow text-muted">
            <span className="text-brand">{stage.num}</span> · {stage.stage}
          </p>
          <p className="body-lg text-foreground mt-3 text-pretty">
            {stage.tagline}
          </p>
          <div className="mt-5">
            <Button asChild>
              <Link href={stage.href}>{stage.ctaLabel}</Link>
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
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

        {/* ── Desktop: orbital (~70%) + fixed detail panel on the right ── */}
        <div className="mt-8 hidden lg:grid lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-center lg:gap-10">
          <div className="relative aspect-[2/1] w-full">
          {animateRouting ? (
            <motion.div
              animate={{ rotate: 360 }}
              aria-hidden="true"
              className="absolute aspect-square w-[26%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06]"
              style={{
                left: `${(CX / VBW) * 100}%`,
                top: `${(CY / VBH) * 100}%`,
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
            <polygon fill={`url(#${gradientId}-table)`} points={CORE_TABLE_PTS} />

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
          <div
            className="absolute flex aspect-square w-[15%] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{
              left: `${(CX / VBW) * 100}%`,
              top: `${(CY / VBH) * 100}%`,
            }}
          >
            <CoreLabel />
          </div>

          {/* Stations — real links; hover/focus activates, click navigates. */}
          {STAGES.map((s, i) => {
            const isActive = i === active;
            const p = stationPos(s.dir);
            return (
              <Link
                aria-label={`Step ${s.num}: ${s.stage}`}
                className="group focus-visible:ring-ring/60 absolute w-60 -translate-x-1/2 -translate-y-1/2 rounded-xl no-underline outline-none focus-visible:ring-3"
                href={s.href}
                key={s.num}
                onFocus={() => activate(i)}
                onMouseEnter={() => activate(i)}
                style={{
                  left: `${(p.x / VBW) * 100}%`,
                  top: `${(p.y / VBH) * 100}%`,
                }}
              >
                <StationFacet isActive={isActive} stage={s} />
              </Link>
            );
          })}
          </div>

          {/* Detail panel — fixed width (grid column) + a min-height sized to
              the tallest tagline, so it stays a consistent size across stages
              and always contains both the text and the button. */}
          <DetailPanel
            className="w-full lg:min-h-[25rem]"
            motionKey={active}
            panelId={panelId}
            reduceMotion={reduceMotion}
            stage={activeStage}
          />
        </div>

        {/* ── Mobile / tablet: vertical faceted stepper ──────────── */}
        <div className="mt-12 lg:hidden">
          <div className="relative mx-auto mb-7 w-fit">
            {!reduceMotion ? (
              <span
                aria-hidden="true"
                className="bg-brand/25 absolute inset-2 rounded-full blur-2xl"
              />
            ) : null}
            <div
              className="border-border/70 relative flex items-center justify-center border p-4"
              style={{ clipPath: CORE_CLIP, background: FACE_BG }}
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
                    <StationFacet isActive={i === active} stage={s} />
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          {/* Detail panel below the stepper on small screens. */}
          <DetailPanel
            className="mt-8"
            motionKey={active}
            panelId={`${panelId}-mobile`}
            reduceMotion={reduceMotion}
            stage={activeStage}
          />
        </div>
      </div>
    </section>
  );
}
