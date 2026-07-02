"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  FileTextIcon,
  LineChartIcon,
  type LucideIcon,
  PlusIcon,
  SearchCheckIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  WorkflowIcon,
} from "lucide-react";

import { Sparkline } from "@/components/signal/Sparkline";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";

type PointVisual =
  | { kind: "platforms" }
  | { kind: "history" }
  | { kind: "logos" }
  | { kind: "intelligence" }
  | { kind: "lifecycle" };

type Point = {
  id: string;
  eyebrow: string;
  headline: string;
  tagline: string;
  body: string;
  visual: PointVisual;
};

const POINTS: Point[] = [
  {
    id: "01",
    eyebrow: "Platform coverage",
    headline: "Name a platform. We probably track it.",
    tagline: "Where gaming lives, Hatchet is already there.",
    body: "Twitch, YouTube, TikTok, Instagram, X and 25+ more. Streaming and social in one view — no stitching, no gaps. Every platform your audience is on, tracked and verified.",
    visual: { kind: "platforms" },
  },
  {
    id: "02",
    eyebrow: "Verified data, longest history",
    headline: "10+ years of data. Zero tolerance for fake.",
    tagline: "Every campaign decision backed by a real number.",
    body: "The deepest verified dataset in gaming — plus fake audience and suspicious channel detection built in.",
    visual: { kind: "history" },
  },
  {
    id: "03",
    eyebrow: "Industry leader",
    headline: "The teams running gaming trust Hatchet.",
    tagline: "Not just used by the industry, built for it.",
    body: "Riot, EA, Ubisoft, Capcom and hundreds more use Hatchet to make every campaign decision with confidence.",
    visual: { kind: "logos" },
  },
  {
    id: "04",
    eyebrow: "Stay ahead of the industry",
    headline: "Always know what's happening in gaming.",
    tagline: "Never get caught off guard.",
    body: "Access analyst-written reports, trend data, and market intelligence so you always know what your competitors are doing before they announce it.",
    visual: { kind: "intelligence" },
  },
  {
    id: "05",
    eyebrow: "One platform, built for you",
    headline: "Everything your team needs. Nothing it doesn't.",
    tagline: "Tailored to your workflow, not the other way around.",
    body: "Discovery, execution, reporting. Find the creator, run the campaign, prove the ROI. Not a generic tool you have to bend to fit.",
    visual: { kind: "lifecycle" },
  },
];

// ── 01 · Platform coverage ─────────────────────────────────────────────────

type PlatformCategory = "live" | "short" | "social" | "esports";

const PLATFORM_CATEGORIES: { id: "all" | PlatformCategory; label: string }[] = [
  { id: "all", label: "All Platforms" },
  { id: "live", label: "Live Streaming" },
  { id: "short", label: "Short-form Video" },
  { id: "social", label: "Social" },
  { id: "esports", label: "Esports" },
];

const PLATFORMS: { name: string; categories: PlatformCategory[] }[] = [
  { name: "Twitch", categories: ["live"] },
  { name: "YouTube", categories: ["live", "short"] },
  { name: "TikTok", categories: ["short", "social"] },
  { name: "Instagram", categories: ["short", "social"] },
  { name: "Kick", categories: ["live"] },
  { name: "X / Twitter", categories: ["social"] },
  { name: "Facebook", categories: ["live", "social"] },
  { name: "Discord", categories: ["social"] },
  { name: "Afreeca TV", categories: ["live"] },
  { name: "Bilibili", categories: ["live"] },
  { name: "Nimo TV", categories: ["live"] },
  { name: "Trovo", categories: ["live"] },
  { name: "Snapchat", categories: ["short", "social"] },
  { name: "Reddit", categories: ["social"] },
  { name: "ESL / FACEIT", categories: ["esports"] },
];

function VisualCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border bg-card/70 cta-panel-frame rounded-2xl border p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

function StatLine({ value, label }: { value: string; label: string }) {
  return (
    <p className="flex items-baseline gap-2">
      <span className="font-display text-foreground text-5xl font-bold tracking-tight tabular-nums">
        {value}
      </span>
      <span className="text-muted text-sm">{label}</span>
    </p>
  );
}

function PlatformChip({ name }: { name: string }) {
  return (
    <span className="border-border bg-elevated/60 text-foreground inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium">
      <span aria-hidden="true" className="bg-brand size-1.5 rounded-full" />
      {name}
    </span>
  );
}

function PlatformStatCard() {
  return (
    <VisualCard>
      <StatLine label="platforms" value="32+" />
      <ul className="mt-4 flex flex-wrap gap-2">
        {["Twitch", "YouTube", "TikTok", "Instagram", "Kick", "X"].map(
          (name) => (
            <li key={name}>
              <PlatformChip name={name} />
            </li>
          ),
        )}
        <li>
          <span className="border-brand/50 bg-brand/10 text-brand-soft inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium">
            +26 more
          </span>
        </li>
      </ul>
    </VisualCard>
  );
}

function PlatformExplorer() {
  const [category, setCategory] = useState<"all" | PlatformCategory>("all");

  const visible =
    category === "all"
      ? PLATFORMS
      : PLATFORMS.filter((platform) => platform.categories.includes(category));

  return (
    <div className="mt-8">
      <div
        aria-label="Filter platforms by category"
        className="flex flex-wrap gap-2"
        role="group"
      >
        {PLATFORM_CATEGORIES.map((item) => {
          const isActive = category === item.id;
          return (
            <button
              aria-pressed={isActive}
              className={cn(
                "focus-visible:ring-ring/60 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors outline-none focus-visible:ring-3",
                isActive
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-card/60 text-muted hover:text-foreground",
              )}
              key={item.id}
              onClick={() => setCategory(item.id)}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
        {visible.map((platform) => (
          <li key={platform.name}>
            <span className="border-border bg-card/60 text-foreground flex items-center justify-center gap-2 rounded-lg border px-2 py-2.5 text-center text-xs font-medium">
              <span
                aria-hidden="true"
                className="bg-brand size-1.5 shrink-0 rounded-full"
              />
              {platform.name}
            </span>
          </li>
        ))}
        <li>
          <span className="border-brand/50 bg-brand/10 text-brand-soft flex items-center justify-center rounded-lg border px-2 py-2.5 text-xs font-semibold">
            + 17 more
          </span>
        </li>
      </ul>
    </div>
  );
}

// ── 02 · Verified data, longest history ────────────────────────────────────

function HistoryVisual() {
  return (
    <VisualCard>
      <StatLine label="years of history" value="10+" />
      <Sparkline className="mt-5" data={[3, 4, 4, 5, 6, 7, 8, 10]} />
      <ul className="mt-5 flex flex-wrap gap-2">
        {["Fake audience detection", "Suspicious channel flags"].map((item) => (
          <li
            className="border-border bg-elevated/60 text-foreground inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium"
            key={item}
          >
            <ShieldCheckIcon aria-hidden="true" className="text-brand size-3.5" />
            {item}
          </li>
        ))}
      </ul>
    </VisualCard>
  );
}

// ── 03 · Industry leader ───────────────────────────────────────────────────

const TRUST_LOGOS = [
  "Riot Games",
  "EA",
  "Ubisoft",
  "Capcom",
  "BLAST",
  "Kings League",
];

function TrustLogosVisual() {
  return (
    <VisualCard>
      <p className="eyebrow text-muted text-[0.65rem]">Trusted by</p>
      <ul className="mt-4 flex flex-wrap gap-2.5">
        {TRUST_LOGOS.map((name) => (
          <li
            className="border-border bg-elevated/60 font-display text-foreground rounded-lg border px-4 py-2.5 text-sm font-semibold"
            key={name}
          >
            {name}
          </li>
        ))}
      </ul>
    </VisualCard>
  );
}

// ── 04 · Stay ahead of the industry ────────────────────────────────────────

const INTELLIGENCE_ITEMS: { label: string; Icon: LucideIcon }[] = [
  { label: "Quarterly industry trend reports", Icon: FileTextIcon },
  { label: "Game launch benchmark trackers", Icon: TrendingUpIcon },
  { label: "Competitor campaign watch", Icon: LineChartIcon },
];

function IntelligenceVisual() {
  return (
    <VisualCard>
      <p className="eyebrow text-muted text-[0.65rem]">Market intelligence</p>
      <ul className="mt-4 grid gap-2">
        {INTELLIGENCE_ITEMS.map(({ label, Icon }) => (
          <li
            className="border-border bg-elevated/60 flex items-center gap-3 rounded-lg border px-3.5 py-2.5"
            key={label}
          >
            <Icon aria-hidden="true" className="text-brand size-4 shrink-0" />
            <span className="text-foreground text-sm font-medium">{label}</span>
          </li>
        ))}
      </ul>
    </VisualCard>
  );
}

// ── 05 · One platform, built for you ───────────────────────────────────────

const LIFECYCLE_STEPS: { label: string; Icon: LucideIcon }[] = [
  { label: "Find", Icon: SearchCheckIcon },
  { label: "Analyze", Icon: LineChartIcon },
  { label: "Execute", Icon: WorkflowIcon },
  { label: "Report", Icon: FileTextIcon },
];

function LifecycleVisual() {
  return (
    <VisualCard>
      <p className="eyebrow text-muted text-[0.65rem]">
        The full campaign lifecycle
      </p>
      <ol className="mt-5 flex items-center justify-between gap-1">
        {LIFECYCLE_STEPS.map(({ label, Icon }, index) => (
          <Fragment key={label}>
            <li className="flex flex-col items-center gap-2 text-center">
              <span className="border-border bg-elevated/60 flex size-11 items-center justify-center rounded-lg border">
                <Icon aria-hidden="true" className="text-brand size-4.5" />
              </span>
              <span className="text-foreground text-xs font-semibold">
                {label}
              </span>
            </li>
            {index < LIFECYCLE_STEPS.length - 1 ? (
              <ArrowRightIcon
                aria-hidden="true"
                className="text-muted size-3.5 shrink-0"
              />
            ) : null}
          </Fragment>
        ))}
      </ol>
    </VisualCard>
  );
}

function PointVisualBlock({ visual }: { visual: PointVisual }) {
  switch (visual.kind) {
    case "platforms":
      return <PlatformStatCard />;
    case "history":
      return <HistoryVisual />;
    case "logos":
      return <TrustLogosVisual />;
    case "intelligence":
      return <IntelligenceVisual />;
    case "lifecycle":
      return <LifecycleVisual />;
  }
}

// ── Section ────────────────────────────────────────────────────────────────

export function WhyHatchetPoints({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "bg-background text-foreground px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl">
        <AccordionPrimitive.Root
          className="border-border border-t"
          collapsible
          defaultValue="01"
          type="single"
        >
          {POINTS.map((point) => (
            <AccordionPrimitive.Item
              className="border-border border-b"
              key={point.id}
              value={point.id}
            >
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger className="group/point focus-visible:ring-ring/60 flex w-full items-center gap-5 rounded-lg py-6 text-left outline-none focus-visible:ring-3 sm:gap-8">
                  <span className="text-muted/80 font-mono text-xs font-semibold tracking-[0.18em] tabular-nums">
                    {point.id}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="eyebrow text-brand text-[0.65rem]">
                      {point.eyebrow}
                    </span>
                    <span className="text-foreground text-lg font-semibold sm:text-xl">
                      {point.headline}
                    </span>
                  </span>
                  <span className="border-border text-muted group-aria-expanded/point:border-brand group-aria-expanded/point:text-brand flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors">
                    <PlusIcon
                      aria-hidden="true"
                      className="size-4 transition-transform duration-300 group-aria-expanded/point:rotate-45"
                    />
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="data-open:animate-accordion-down data-closed:animate-accordion-up overflow-hidden">
                <div className="pb-8 sm:pl-14 lg:pb-10">
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
                    <div className="max-w-xl">
                      <p className="text-muted text-sm italic">
                        {point.tagline}
                      </p>
                      <p className="body text-foreground/90 mt-3">
                        {point.body}
                      </p>
                    </div>
                    <PointVisualBlock visual={point.visual} />
                  </div>
                  {point.visual.kind === "platforms" ? (
                    <PlatformExplorer />
                  ) : null}
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link href={siteConfig.bookDemoUrl}>Book a Demo</Link>
          </Button>
          <Button asChild variant="secondary">
            <a href="#comparison">
              See How We Compare
              <ArrowDownIcon aria-hidden="true" data-icon="inline-end" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
