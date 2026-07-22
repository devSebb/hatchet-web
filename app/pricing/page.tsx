import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "@phosphor-icons/react/ssr";

import {
  type IsoIcon,
  PricingCommunity,
  PricingDataLicense,
  PricingFullLicense,
} from "@/components/icons/iso-icons";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Pricing",
    description:
      "From creator discovery to full campaign execution — pick the Hatchet plan that matches how your team runs a program.",
    path: "/pricing",
  });
}

type PlanFeature = {
  title: string;
  body: string;
};

type Plan = {
  name: string;
  tagline: string;
  // One iso-icon per plan, shown above the card title. Community is the Build
  // module; Data License is the data/intelligence bundle; Full License is the
  // whole platform.
  icon: IsoIcon;
  features: PlanFeature[];
  recommended?: boolean;
};

// Closes the whole plan set, so it lives under the grid rather than inside the
// Full License card.
const PLAN_CLOSER =
  "Other tools make you choose between data and execution. Full License means you never have to.";

const PLANS: Plan[] = [
  {
    name: "Hatchet Community",
    tagline: "Build and manage your creator roster, start to finish.",
    icon: PricingCommunity,
    features: [
      {
        title: "My Creators",
        body: "Build your full roster across Twitch, YouTube, TikTok, Kick, and more. Organize with custom labels and track live metrics as they update.",
      },
      {
        title: "Messaging",
        body: "Message 1:1 or broadcast to a group, with Gmail integration tracking delivery so nothing falls through the cracks.",
      },
      {
        title: "Code Management",
        body: "Create, assign, and track promo codes per creator, with live redemption stats and ROI attribution.",
      },
    ],
  },
  {
    name: "Hatchet Data License",
    tagline: "Every creator. Every game. Every number, verified.",
    icon: PricingDataLicense,
    features: [
      {
        title: "Find — Creator & Game Discovery",
        body: "AI Smart Search and fake audience scoring across 55M+ creators and 32 platforms, plus game-level leaderboards and launch comparisons.",
      },
      {
        title: "Analyze — Brand & Audience Intelligence",
        body: "Chat and stream-title mention tracking, Groups for instant roster comparisons, YouTube VOD analytics, and esports benchmarking.",
      },
      {
        title: "Report — Reporting & Custom Reports",
        body: "Auto-tracked campaign dashboards, per-creator breakdowns, and custom reports built by our analyst team.",
      },
    ],
  },
  {
    name: "Hatchet Full License",
    tagline: "Everything Hatchet does. Every step of the lifecycle. One platform.",
    icon: PricingFullLicense,
    recommended: true,
    features: [
      {
        title: "Find — Creator & Game Discovery",
        body: "Creator & Game Discovery, AI Smart Search, fake audience scoring.",
      },
      {
        title: "Analyze — Brand & Audience Intelligence",
        body: "Brand & Audience Intelligence, Groups, YouTube VOD analytics, esports benchmarking.",
      },
      {
        title: "Build — Creator Community (Roster, Messaging, Codes)",
        body: "Full roster management, messaging, code tracking.",
      },
      {
        title: "Report — Reporting & Custom Reports",
        body: "Auto-tracked dashboards, per-creator breakdowns, custom reports.",
      },
    ],
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  const Icon = plan.icon;

  return (
    <article
      className={cn(
        // White-paper card on the dark page: surface-paper flips the tokens so
        // border/text utilities resolve to their light-theme values inside.
        // Horizontal padding stays at 24px; vertical is tightened to 20px so the
        // pillars read shorter without shrinking any type or the icon.
        "surface-paper bg-paper relative flex h-full flex-col rounded-xl border px-6 py-5",
        plan.recommended
          ? // Emphasized, brand-framed pillar: doubled brand border, a soft brand
            // halo ring, and a layered elevation shadow (deep ambient drop + brand
            // glow) so it reads as a 3D pop-out. Same paper background as its
            // siblings, kept level so all three tops align.
            "border-2 border-brand ring-4 ring-brand/10 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.55),0_0_24px_color-mix(in_srgb,var(--brand)_28%,transparent)]"
          : "border-paper-border shadow-sm",
      )}
    >
      {plan.recommended ? (
        <span className="bg-brand absolute -top-[14px] right-[24px] rounded-full px-[14px] py-[4px] text-xs font-semibold text-white shadow-sm">
          Recommended
        </span>
      ) : null}

      <Icon aria-hidden="true" className="size-16" />
      <h2 className="h3 text-blue-transitional mt-2 text-[1.75rem]">
        {plan.name}
      </h2>
      <p className="text-brand mt-2 text-base font-medium">{plan.tagline}</p>

      <ul className="mt-5 grid gap-3">
        {plan.features.map((feature) => (
          <li key={feature.title}>
            <p className="text-blue-transitional text-sm font-semibold">
              {feature.title}
            </p>
            <p className="text-muted mt-1 text-sm">{feature.body}</p>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5">
        <Button asChild className="w-full">
          <Link href={siteConfig.bookDemoUrl}>Book a Demo</Link>
        </Button>
      </div>
    </article>
  );
}

function PlanGrid() {
  return (
    <section className="bg-background text-foreground px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <div className="mx-auto w-full max-w-7xl">
        <Stagger className="grid gap-4 pt-[14px] lg:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </Stagger>

        <Reveal>
          <p className="h3 text-foreground mx-auto mt-12 max-w-3xl text-center text-balance">
            {PLAN_CLOSER}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Compare plans ---------- */

type ModuleRow = {
  title: string;
  description: string;
  community: boolean;
  dataLicense: boolean;
  fullLicense: boolean;
};

const MODULE_ROWS: ModuleRow[] = [
  {
    title: "Find - Creator & Game Discovery",
    description: "",
    community: false,
    dataLicense: true,
    fullLicense: true,
  },
  {
    title: "Analyze - Brand & Audience Intelligence + Deep Analytics",
    description: "",
    community: false,
    dataLicense: true,
    fullLicense: true,
  },
  {
    title: "Build - Creator Community (Roster, Messaging, Codes)",
    description: "",
    community: true,
    dataLicense: false,
    fullLicense: true,
  },
  {
    title: "Report - Reporting & Custom Reports",
    description: "",
    community: false,
    dataLicense: true,
    fullLicense: true,
  },
];

// Value columns share fixed widths so the elevated Full License pillar (an
// absolutely positioned layer behind the last column) stays aligned with its
// cells at every viewport. Keep these two width pairs in sync.
const VALUE_COL = "w-[72px] sm:w-[110px]";
const PILLAR_POS = "-right-[4px] w-[76px] sm:-right-[6px] sm:w-[116px]";

function IncludedMark() {
  return (
    <span className="inline-flex size-5 items-center justify-center text-white">
      <Check
        aria-hidden="true"
        className="size-[18px]"
        stroke="currentColor"
        strokeWidth={20}
        weight="bold"
      />
      <span className="sr-only">Included</span>
    </span>
  );
}

function NotIncludedMark() {
  return (
    <span className="inline-flex size-5 items-center justify-center text-red-500">
      <X aria-hidden="true" className="size-[18px]" weight="bold" />
      <span className="sr-only">Not included</span>
    </span>
  );
}

function Mark({ included }: { included: boolean }) {
  return included ? <IncludedMark /> : <NotIncludedMark />;
}

function ComparePlans() {
  return (
    <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-4xl">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow text-muted">Compare plans</p>
            <h2 className="h1 mt-4">Select The Plan That Suits Your Needs.</h2>
            <p className="body-lg text-muted mt-3">
              Community runs your roster. Data License runs your intelligence.
              Full License runs the whole program.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative mt-6">
            {/* Frame around the whole table */}
            <div
              aria-hidden="true"
              className="bg-bg absolute inset-0 rounded-2xl border border-white/15"
            />

            {/* Elevated Full License pillar behind the last column */}
            <div
              aria-hidden="true"
              className={cn(
                "bg-brand cta-panel-frame absolute -inset-y-1 overflow-hidden rounded-xl shadow-[0_24px_48px_-20px_color-mix(in_srgb,var(--bg)_50%,transparent),0_8px_22px_-12px_color-mix(in_srgb,var(--bg)_38%,transparent)] sm:-inset-y-1.5",
                PILLAR_POS,
              )}
            />

            <table className="relative w-full border-collapse">
              <thead>
                <tr>
                  <th className="sr-only" scope="col">
                    Module
                  </th>
                  <th
                    className={cn(
                      "px-[4px] py-2.5 align-middle text-[10px] font-semibold text-white/70 sm:text-sm",
                      VALUE_COL,
                    )}
                    scope="col"
                  >
                    <span className="flex flex-col items-center gap-1.5">
                      <PricingCommunity aria-hidden="true" className="size-[40px] sm:size-[52px]" />
                      Community
                    </span>
                  </th>
                  <th
                    className={cn(
                      "px-[4px] py-2.5 align-middle text-[10px] font-semibold text-white/70 sm:text-sm",
                      VALUE_COL,
                    )}
                    scope="col"
                  >
                    <span className="flex flex-col items-center gap-1.5">
                      <PricingDataLicense
                        aria-hidden="true"
                        className="size-[40px] sm:size-[52px]"
                      />
                      Data License
                    </span>
                  </th>
                  <th
                    className={cn(
                      "px-[4px] py-2.5 align-middle text-[10px] font-semibold text-white sm:text-sm",
                      VALUE_COL,
                    )}
                    scope="col"
                  >
                    <span className="flex flex-col items-center gap-1.5">
                      <PricingFullLicense
                        aria-hidden="true"
                        className="size-[40px] sm:size-[52px]"
                      />
                      Full License
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {MODULE_ROWS.map((row) => {
                  return (
                    <tr
                      className="transition-colors hover:bg-white/5"
                      key={row.title}
                    >
                      <th
                        className="border-t border-white/15 py-2 pr-[8px] pl-[16px] text-left align-middle sm:pr-4 sm:pl-6"
                        scope="row"
                      >
                        <p className="text-sm font-semibold text-white">
                          {row.title}
                        </p>
                        {row.description ? (
                          <p className="mt-0.5 hidden text-xs font-normal text-white/65 sm:block">
                            {row.description}
                          </p>
                        ) : null}
                      </th>
                      <td className="border-t border-white/15 py-2 text-center align-middle">
                        <Mark included={row.community} />
                      </td>
                      <td className="border-t border-white/15 py-2 text-center align-middle">
                        <Mark included={row.dataLicense} />
                      </td>
                      <td className="border-t border-white/20 py-2 text-center align-middle">
                        <Mark included={row.fullLicense} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Pricing"
        primaryCta={{ label: "Book a Demo", href: siteConfig.bookDemoUrl }}
        subtitle="Trusted by studios, agencies, and brands of all sizes. From creator discovery to full campaign execution. Pick the plan that matches how your team runs a program."
        title="Find your fit."
      />

      <PlanGrid />

      <ComparePlans />

      <CTASection
        body="Book a 30-minute call and we'll match your team to the right plan."
        cta={{ label: "Book a Demo", href: siteConfig.bookDemoUrl }}
        subtitle="Let's talk it through."
        title="Not sure where you fit?"
        titleClassName="h1"
      />
    </main>
  );
}
