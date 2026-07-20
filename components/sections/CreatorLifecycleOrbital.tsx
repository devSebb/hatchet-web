"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

import {
  ChartLine,
  FileText,
  FlowArrow,
  type IsoIcon,
  MagnifyingGlass,
} from "@/components/icons/iso-icons";
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
  Icon: IsoIcon;
  /** Unit direction from the core (cardinal); scaled by the station radii. */
  dir: { x: number; y: number };
};

const STAGES: Stage[] = [
  {
    num: "01",
    stage: "Find & Verify",
    tagline:
      "Describe the creator you need and get a match. AI-powered search surfaces the right fit fast, and fake audience scoring flags suspicious channels before you commit.",
    ctaLabel: "Creator Discovery",
    href: "/solutions/discovery",
    Icon: MagnifyingGlass,
    dir: { x: 0, y: -1 },
  },
  {
    num: "02",
    stage: "Analyze",
    tagline:
      "Streaming and social in one view. Track performance across every platform your campaign touches, without switching tools or stitching spreadsheets together.",
    ctaLabel: "Intelligence",
    href: "/solutions/intelligence",
    Icon: ChartLine,
    dir: { x: 1, y: 0 },
  },
  {
    num: "03",
    stage: "Build",
    tagline:
      "Manage your entire creator roster from one place. Brief, track, and coordinate campaigns end-to-end via a single, customizable hub.",
    ctaLabel: "Creator Community",
    href: "/solutions/creator-community",
    Icon: FlowArrow,
    dir: { x: 0, y: 1 },
  },
  {
    num: "04",
    stage: "Report",
    tagline:
      "Every campaign metric in one dashboard. Per-creator breakdowns, engagement, and export-ready reports your clients or stakeholders can easily understand.",
    ctaLabel: "Reporting",
    href: "/solutions/reporting",
    Icon: FileText,
    dir: { x: -1, y: 0 },
  },
];

const AUTO_ADVANCE_MS = 4200;

// ── Geometry (SVG user units) — wide rectangular field, symmetric cross, ───
//    core centered. The four corners stay empty; the detail card floats in ──
//    the top-right one without disturbing the layout. ────────────────────────
const VBW = 160;
const VBH = 100; // 160/100 = 8/5 → matches the aspect-[8/5] canvas (no distortion)
const CX = 80;
const CY = 50;
const CORE_R = 14; // radius the traces stop at + the core glow footprint
const RX = 56; // horizontal station radius (wide field)
const RY = 38; // vertical station radius (taller field — more air above/below the core)
const RING_RX = 61; // ring sits just outside the stations
const RING_RY = 42;
const DIAG = 0.707;
const TRACE_BACK = 8; // trace stops this far short of the station

const fmt = (p: { x: number; y: number }) =>
  `${p.x.toFixed(2)},${p.y.toFixed(2)}`;

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

const UNDERGLOW =
  "radial-gradient(120% 100% at 50% 120%, color-mix(in srgb, var(--brand) 60%, transparent) 0%, transparent 70%)";

function StationFacet({
  stage,
  isActive,
  compact = false,
  snug = false,
  inverted = false,
}: {
  stage: Stage;
  isActive: boolean;
  /** Smaller card for tight canvases (e.g. the solution-page hero). */
  compact?: boolean;
  /** Full-size card but tighter horizontal padding + icon gap, so it can sit
   *  in a narrower column without wrapping the label (cross-sell row). */
  snug?: boolean;
  /** Flipped theme for the locked page stage: brand-red card, blue text. */
  inverted?: boolean;
}) {
  const { Icon } = stage;
  return (
    <span
      className={cn(
        "relative block",
        compact && "transition-transform duration-[250ms] ease-out",
        compact && isActive && "scale-[1.16]",
      )}
    >
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
          "cta-panel-frame relative flex items-center backdrop-blur-sm transition-[border-color,background-color] duration-[250ms]",
          compact
            ? "gap-2.5 rounded-xl border px-3 py-2"
            : snug
              ? "gap-2.5 rounded-2xl border px-3 py-2.5"
              : "gap-4 rounded-2xl border px-4 py-2.5",
          isActive
            ? inverted
              ? "border-brand-lowlight bg-brand"
              : "border-brand bg-card/85"
            : "border-border bg-card/60",
        )}
      >
        <span
          className={cn(
            "flex shrink-0 items-center justify-center border transition-colors duration-[250ms]",
            compact ? "size-6 rounded-md" : "size-8 rounded-lg",
            isActive
              ? inverted
                ? "border-blue-transitional/45 bg-white/85"
                : "border-brand/40 bg-brand/10"
              : "border-border bg-elevated/60",
          )}
        >
          <Icon
            aria-hidden="true"
            className={cn(
              "transition-colors duration-[250ms]",
              compact ? "size-6" : "size-8",
              isActive ? "text-brand" : "text-muted",
            )}
          />
        </span>
        <span
          className={cn("flex min-w-0 flex-col", compact ? "gap-0.5" : "gap-1")}
        >
          <span
            className={cn(
              "font-mono font-semibold tracking-[0.18em] tabular-nums transition-colors duration-[250ms]",
              compact ? "text-[0.58rem]" : "text-[0.72rem]",
              isActive
                ? inverted
                  ? "text-blue-transitional"
                  : "text-brand"
                : "text-muted/80",
            )}
          >
            {stage.num}
          </span>
          <span
            className={cn(
              "leading-none font-semibold transition-colors duration-[250ms]",
              compact
                ? "text-[0.8rem] whitespace-nowrap"
                : snug
                  ? "text-[1.08rem] whitespace-nowrap"
                  : "text-[1.08rem]",
              isActive
                ? inverted
                  ? "text-blue-transitional"
                  : "text-foreground"
                : "text-muted",
            )}
          >
            {stage.stage}
          </span>
        </span>
      </span>
    </span>
  );
}

/** The four lifecycle stations laid out as a plain horizontal row of links —
 *  the orbital's cards without the orbital itself. Used by the solution-page
 *  cross-sell to point at each stage's solution page. Hovering or focusing a
 *  card lights it up, mirroring the orbital's active state. */
export function LifecycleStationsRow({ className }: { className?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const reduceMotion = useHydratedReducedMotion();
  return (
    <div className={cn("relative", className)}>
      {/* Flowing connection behind the cards (sm+, where they form one row):
          a drifting dashed rail plus a glowing packet travelling left→right,
          mirroring the orbital's live trace. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 sm:block"
      >
        <div className="lifecycle-rail h-[2px] w-full" />
        {reduceMotion ? null : (
          <motion.span
            animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            className="absolute top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "var(--brand-soft)",
              filter: "drop-shadow(0 0 5px var(--brand))",
            }}
            transition={{
              duration: 7,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0.6,
            }}
          />
        )}
      </div>

      <div className="relative grid grid-cols-2 gap-3 sm:flex sm:justify-between">
        {STAGES.map((s, i) => (
          <Link
            aria-label={`${s.num}: ${s.stage}`}
            className="group focus-visible:ring-ring/60 w-[15rem] max-w-full rounded-xl no-underline outline-none focus-visible:ring-3"
            href={s.href}
            key={s.num}
            onBlur={() => setActive(null)}
            onFocus={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <StationFacet isActive={i === active} snug stage={s} />
          </Link>
        ))}
      </div>
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

function OrbitalCanvas({
  active,
  activate,
  onLeave,
  animateRouting,
  reduceMotion,
  gradientId,
  compact = false,
  locked = false,
}: {
  active: number;
  activate: (index: number) => void;
  onLeave?: () => void;
  animateRouting: boolean;
  reduceMotion: boolean | null;
  gradientId: string;
  compact?: boolean;
  /** Pins the active stage: hover/focus never moves the highlight, and the
   *  active card takes the inverted (brand-red) theme. Stations stay links. */
  locked?: boolean;
}) {
  const activeStage = STAGES[active];

  return (
    <div className="relative aspect-[8/5] w-full" onMouseLeave={onLeave}>
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

        {/* Sub-surface red glow (breathing) — sits behind the shield. */}
        <motion.circle
          animate={animateRouting ? { opacity: [0.32, 0.6, 0.32] } : undefined}
          cx={CX}
          cy={CY}
          fill={`url(#${gradientId}-glow)`}
          initial={false}
          opacity={reduceMotion ? 0.42 : 0.32}
          r={CORE_R * 1.3}
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
                  fill="var(--brand-soft)"
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

      {/* Core shield — the graphic at the heart of the orbital. */}
      <div
        className="absolute flex aspect-square w-[16%] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        style={{
          left: `${(CX / VBW) * 100}%`,
          top: `${(CY / VBH) * 100}%`,
        }}
      >
        <Image
          alt="Hatchet"
          className="h-auto w-full object-contain"
          height={721}
          priority
          src="/brand/hatchet_shield_redFin.png"
          width={763}
        />
      </div>

      {/* Stations — real links; hover/focus activates, click navigates. */}
      {STAGES.map((s, i) => {
        const isActive = i === active;
        const p = stationPos(s.dir);
        return (
          <Link
            aria-label={`Step ${s.num}: ${s.stage}`}
            className={cn(
              "group focus-visible:ring-ring/60 absolute -translate-x-1/2 -translate-y-1/2 rounded-xl no-underline outline-none focus-visible:ring-3",
              compact ? "w-44" : "w-60",
              compact && isActive && "z-10",
            )}
            href={s.href}
            key={s.num}
            onFocus={locked ? undefined : () => activate(i)}
            onMouseEnter={locked ? undefined : () => activate(i)}
            style={{
              left: `${(p.x / VBW) * 100}%`,
              top: `${(p.y / VBH) * 100}%`,
            }}
          >
            <StationFacet
              compact={compact}
              inverted={locked && isActive}
              isActive={isActive}
              stage={s}
            />
          </Link>
        );
      })}
    </div>
  );
}

type CreatorLifecycleOrbitalProps = {
  className?: string;
  /**
   * "full" (default) pairs the orbital with the live detail panel (and the
   * vertical stepper below lg). "canvas" renders the orbital alone in compact
   * sizing — no detail panel, no stepper — for tight slots like the solution
   * heroes; the caller owns responsive visibility.
   */
  variant?: "full" | "canvas";
  /**
   * Stage href (e.g. "/solutions/discovery") the canvas variant locks onto:
   * it never auto-advances and hover/focus never moves the highlight, so the
   * current page's stage stays lit in the inverted (brand-red) theme.
   */
  defaultStageHref?: string;
};

/**
 * The interactive "creator lifecycle" orbital: a faceted core with four
 * stations orbiting it, animated circuit routing, and a live detail panel.
 * Rendered on the home page (under a heading), inside the Why Hatchet
 * accordion's fifth point, on pricing, and (canvas variant) in the solution
 * heroes. Owns no section chrome — the caller supplies layout.
 */
export function CreatorLifecycleOrbital({
  className,
  variant = "full",
  defaultStageHref,
}: CreatorLifecycleOrbitalProps) {
  const reduceMotion = useHydratedReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });
  const defaultIndex = Math.max(
    0,
    STAGES.findIndex((stage) => stage.href === defaultStageHref),
  );
  const [active, setActive] = useState(defaultIndex);
  const [interacted, setInteracted] = useState(false);
  const gradientId = useId().replace(/:/g, "");
  const panelId = `${gradientId}-panel`;
  const isCanvas = variant === "canvas";

  // Demo itself on a gentle interval; hand control to the user on first
  // interaction and never auto-advance again. Paused while offscreen. The
  // canvas variant holds its default stage instead of demoing.
  useEffect(() => {
    if (reduceMotion || interacted || !inView || isCanvas) {
      return;
    }
    const id = window.setInterval(() => {
      setActive((index) => (index + 1) % STAGES.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, interacted, inView, isCanvas]);

  const activate = (index: number) => {
    setInteracted(true);
    setActive(index);
  };

  const activeStage = STAGES[active];
  const animateRouting = !reduceMotion && inView;

  if (isCanvas) {
    return (
      <div className={cn("relative", className)} ref={rootRef}>
        <OrbitalCanvas
          activate={activate}
          active={defaultIndex}
          animateRouting={animateRouting}
          compact
          gradientId={gradientId}
          locked
          reduceMotion={reduceMotion}
        />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} ref={rootRef}>
      {/* ── Desktop: orbital (~70%) + fixed detail panel on the right ── */}
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-center lg:gap-10">
        <OrbitalCanvas
          activate={activate}
          active={active}
          animateRouting={animateRouting}
          gradientId={gradientId}
          reduceMotion={reduceMotion}
        />

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
      <div className="lg:hidden">
        <div className="relative mx-auto mb-7 w-fit">
          {!reduceMotion ? (
            <span
              aria-hidden="true"
              className="bg-brand/25 absolute inset-2 rounded-full blur-2xl"
            />
          ) : null}
          <Image
            alt="Hatchet"
            className="relative h-auto w-24 object-contain"
            height={721}
            src="/brand/hatchet_shield_redFin.png"
            width={763}
          />
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

        {/* Detail panel below the stepper on small screens. Fixed floor sized
            to the tallest tagline so it doesn't jump between stages. */}
        <DetailPanel
          className="mt-8 min-h-[17rem] sm:min-h-[15rem]"
          motionKey={active}
          panelId={`${panelId}-mobile`}
          reduceMotion={reduceMotion}
          stage={activeStage}
        />
      </div>
    </div>
  );
}
