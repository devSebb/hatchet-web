import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CTASection } from "@/components/sections/CTASection";
import { FeatureBlock } from "@/components/sections/FeatureBlock";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { verticals } from "@/lib/config/marketing";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Who We Serve",
    description:
      "Hatchet helps brands, game publishers, market research agencies, and esports teams use live-streaming intelligence.",
    path: "/who-we-serve",
  });
}

export default function WhoWeServePage() {
  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Who we serve"
        signal
        subtitle="Different teams ask different questions of the live-streaming market. Hatchet gives each one a signal layer they can act on."
        title="Built for the teams watching gaming move."
      />

      <SectionDivider surface="paper" />

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow text-muted">Verticals</p>
              <h2 className="h1 mt-4">
                One market read, tuned to each team&apos;s job.
              </h2>
            </div>
          </Reveal>

          <Stagger className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {verticals.map((vertical) => (
              <Link
                className="group border-border bg-card hover:border-signal/60 focus-visible:ring-ring/50 flex min-h-72 flex-col justify-between rounded-xl border p-6 shadow-sm transition-[border-color,background-color,transform] duration-(--dur-base) outline-none hover:-translate-y-1 focus-visible:ring-3"
                href={vertical.href}
                key={vertical.slug}
              >
                <div>
                  <p className="eyebrow text-muted">{vertical.label}</p>
                  <h2 className="h3 mt-4">{vertical.title}</h2>
                  <p className="small text-muted mt-4">{vertical.audience}</p>
                </div>
                <span className="text-foreground mt-8 text-sm font-semibold underline-offset-4 group-hover:underline">
                  Explore {vertical.label}
                </span>
              </Link>
            ))}
          </Stagger>
        </div>
      </section>

      <SectionDivider />

      <FeatureBlock
        body="Hatchet keeps the same underlying market signal consistent, then frames it around the jobs each team needs to finish: planning, launch analysis, research delivery, sponsor reporting, and executive readouts."
        bullets={[
          "Audience framing for brand and sponsorship teams.",
          "Launch and category tracking for publishers and researchers.",
          "Event and broadcast benchmarking for esports teams.",
        ]}
        className="bg-background py-18 lg:py-24"
        eyebrow="Team-specific framing"
        heading="The same data becomes clearer when it speaks to the work."
        link={{ label: "Explore solutions", href: "/solutions" }}
      />

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Plan with signal"
        secondaryCta={{ label: "Why Hatchet", href: "/why-hatchet" }}
        title="Show Hatchet your team's market questions."
      />
    </main>
  );
}
