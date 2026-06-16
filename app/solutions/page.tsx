import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CTASection } from "@/components/sections/CTASection";
import { FeatureBlock } from "@/components/sections/FeatureBlock";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { solutions } from "@/lib/config/marketing";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Solutions",
    description:
      "Explore Hatchet solutions for creator intelligence, game launch tracking, custom reports, and data integrations.",
    path: "/solutions",
  });
}

export default function SolutionsPage() {
  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Solutions"
        signal
        subtitle="Use live-streaming, creator, game, press, and community signals as a practical market intelligence layer for your team."
        title="One signal layer for gaming decisions."
      />

      <SectionDivider surface="paper" />

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow text-muted">Solution paths</p>
              <h2 className="h1 mt-4">
                Start with the decision, then follow the signal.
              </h2>
            </div>
          </Reveal>

          <Stagger className="mt-10 grid gap-4 lg:grid-cols-3">
            {solutions.map((solution) => (
              <Link
                className="group border-border bg-card hover:border-signal/60 focus-visible:ring-ring/50 flex min-h-72 flex-col justify-between rounded-xl border p-6 shadow-sm transition-[border-color,background-color,transform] duration-(--dur-base) outline-none hover:-translate-y-1 focus-visible:ring-3"
                href={solution.href}
                key={solution.slug}
              >
                <div>
                  <p className="eyebrow text-muted">{solution.label}</p>
                  <h2 className="h3 mt-4">{solution.title}</h2>
                  <p className="body text-muted mt-4">{solution.subtitle}</p>
                </div>
                <span className="text-foreground mt-8 text-sm font-semibold underline-offset-4 group-hover:underline">
                  Explore {solution.label}
                </span>
              </Link>
            ))}
          </Stagger>
        </div>
      </section>

      <SectionDivider />

      <FeatureBlock
        body="Hatchet keeps the public site pointed at the strategy problem, while the product app, rankings, live widgets, and reports stay in their own systems. These route templates link outward when real product workflows are needed."
        bullets={[
          "Route market-facing pages around outcomes instead of internal product modules.",
          "Keep marketing copy grounded in creators, games, viewership, press, and communities.",
          "Leave space for the next pass to swap placeholder labels for final positioning.",
        ]}
        className="bg-background py-18 lg:py-24"
        eyebrow="Built to evolve"
        heading="Flexible templates for the next design and copy pass."
        link={{ label: "See who we serve", href: "/who-we-serve" }}
      />

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Book a demo"
        secondaryCta={{ label: "Compare audiences", href: "/why-hatchet" }}
        title="Find the right Hatchet path for your team."
      />
    </main>
  );
}
