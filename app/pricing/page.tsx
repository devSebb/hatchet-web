import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "@phosphor-icons/react/ssr";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CreatorLifecycleOrbital } from "@/components/sections/CreatorLifecycleOrbital";
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
  features: PlanFeature[];
  recommended?: boolean;
  closer?: string;
};

const PLANS: Plan[] = [
  {
    name: "Hatchet Community",
    tagline: "Build and manage your creator roster, start to finish.",
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
        title: "Reporting",
        body: "Auto-tracked campaign dashboards, per-creator breakdowns, and custom reports built by our analyst team.",
      },
    ],
  },
  {
    name: "Hatchet Full License",
    tagline: "Everything Hatchet does. Every step of the lifecycle. One platform.",
    recommended: true,
    features: [
      {
        title: "Find",
        body: "Creator & Game Discovery, AI Smart Search, fake audience scoring.",
      },
      {
        title: "Analyze",
        body: "Brand & Audience Intelligence, Groups, YouTube VOD analytics, esports benchmarking.",
      },
      {
        title: "Build",
        body: "Full roster management, messaging, code tracking.",
      },
      {
        title: "Report",
        body: "Auto-tracked dashboards, per-creator breakdowns, custom reports.",
      },
    ],
    closer:
      "Other tools make you choose between data and execution. Full License means you never have to.",
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-xl border p-6",
        plan.recommended
          ? "border-brand bg-card shadow-signal"
          : "border-border bg-card shadow-sm",
      )}
    >
      {plan.recommended ? (
        <span className="bg-brand absolute -top-[14px] right-[24px] rounded-full px-[14px] py-[4px] text-xs font-semibold text-white shadow-sm">
          Recommended
        </span>
      ) : null}

      <h2 className="h3">{plan.name}</h2>
      <p className="text-brand-soft mt-2 text-sm font-medium">{plan.tagline}</p>

      <ul className="mt-6 grid gap-4">
        {plan.features.map((feature) => (
          <li key={feature.title}>
            <p className="text-foreground text-sm font-semibold">
              {feature.title}
            </p>
            <p className="text-muted mt-1 text-sm">{feature.body}</p>
          </li>
        ))}
      </ul>

      {plan.closer ? (
        <p className="text-muted mt-5 text-sm italic">{plan.closer}</p>
      ) : null}

      <div className="mt-auto pt-6">
        <Button
          asChild
          className="w-full"
          variant={plan.recommended ? "default" : "outline"}
        >
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
    title: "Find",
    description: "Creator & game discovery, AI Smart Search",
    community: false,
    dataLicense: true,
    fullLicense: true,
  },
  {
    title: "Analyze",
    description: "Brand & audience intelligence + deep analytics",
    community: false,
    dataLicense: true,
    fullLicense: true,
  },
  {
    title: "Build",
    description: "Creator community: roster, messaging, codes",
    community: true,
    dataLicense: false,
    fullLicense: true,
  },
  {
    title: "Reporting",
    description: "Auto-tracked dashboards & custom reports",
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
    <span className="inline-flex size-4 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_0_14px_color-mix(in_srgb,#22c55e_45%,transparent)]">
      <Check aria-hidden="true" className="size-[14px]" weight="bold" />
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
            <h2 className="h1 mt-4">Every module, side by side.</h2>
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
              className="border-border bg-elevated/10 absolute inset-0 rounded-2xl border"
            />

            {/* Elevated Full License pillar behind the last column */}
            <div
              aria-hidden="true"
              className={cn(
                "bg-bg cta-panel-frame absolute -inset-y-1 overflow-hidden rounded-xl shadow-[0_24px_48px_-20px_color-mix(in_srgb,var(--bg)_50%,transparent),0_8px_22px_-12px_color-mix(in_srgb,var(--bg)_38%,transparent)] sm:-inset-y-1.5",
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
                      "text-muted px-[4px] py-2.5 text-center align-middle text-[10px] font-semibold sm:text-sm",
                      VALUE_COL,
                    )}
                    scope="col"
                  >
                    Community
                  </th>
                  <th
                    className={cn(
                      "text-muted px-[4px] py-2.5 text-center align-middle text-[10px] font-semibold sm:text-sm",
                      VALUE_COL,
                    )}
                    scope="col"
                  >
                    Data License
                  </th>
                  <th
                    className={cn(
                      "px-[4px] py-2.5 text-center align-middle text-[10px] font-semibold text-white sm:text-sm",
                      VALUE_COL,
                    )}
                    scope="col"
                  >
                    Full License
                  </th>
                </tr>
              </thead>
              <tbody>
                {MODULE_ROWS.map((row) => (
                  <tr className="hover:bg-bg/3 transition-colors" key={row.title}>
                    <th
                      className="border-border border-t py-2 pr-[8px] pl-[16px] text-left align-middle sm:pr-4 sm:pl-6"
                      scope="row"
                    >
                      <p className="text-foreground text-sm font-semibold">
                        {row.title}
                      </p>
                      <p className="text-muted mt-0.5 hidden text-xs font-normal sm:block">
                        {row.description}
                      </p>
                    </th>
                    <td className="border-border border-t py-2 text-center align-middle">
                      <Mark included={row.community} />
                    </td>
                    <td className="border-border border-t py-2 text-center align-middle">
                      <Mark included={row.dataLicense} />
                    </td>
                    <td className="border-t border-white/10 py-2 text-center align-middle">
                      <Mark included={row.fullLicense} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ClosingCTA() {
  return (
    <section className="bg-background text-foreground relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div
        aria-hidden="true"
        className="cta-grid pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="cta-grain pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <Reveal>
          <h2 className="h1 text-center">Not sure which fits?</h2>
        </Reveal>

        <CreatorLifecycleOrbital className="mt-10" />

        <Reveal delay={0.08}>
          <div className="mx-auto mt-12 max-w-2xl text-center">
            <p className="body-lg text-muted">
              Book a 30-minute call and we&apos;ll match your team to the right
              plan.
            </p>
            <div className="mt-6 flex justify-center">
              <Button asChild>
                <Link href={siteConfig.bookDemoUrl}>Book a Demo</Link>
              </Button>
            </div>
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
        subtitle="Trusted by studios, agencies, and brands of all sizes. From creator discovery to full campaign execution — pick the plan that matches how your team runs a program."
        title="Find your fit."
      />

      <PlanGrid />

      <ComparePlans />

      <ClosingCTA />
    </main>
  );
}
