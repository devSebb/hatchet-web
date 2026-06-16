import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CTASection } from "@/components/sections/CTASection";
import { FeatureBlock } from "@/components/sections/FeatureBlock";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { solutions } from "@/lib/config/solutions";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Solutions",
    description:
      "Explore Hatchet products for live streaming analytics, custom reporting, and API data integrations.",
    path: "/solutions",
  });
}

export default function SolutionsPage() {
  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Solutions"
        subtitle="Use Hatchet as your live-streaming intelligence layer: work in the dashboard, ask our analysts for custom reporting, or connect the data directly to your stack."
        title="Three ways to turn live signal into decisions."
      />

      <SectionDivider surface="paper" />

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow text-muted">Product paths</p>
              <h2 className="h1 mt-4">
                Choose the shape that fits how your team works.
              </h2>
              <p className="body-lg text-muted mt-5">
                Start with a shared web workspace, commission a focused analyst
                report, or move Hatchet data into the systems your team already
                uses.
              </p>
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
                  <p className="eyebrow text-muted">{solution.eyebrow}</p>
                  <h2 className="h3 mt-4">{solution.name}</h2>
                  <p className="body text-muted mt-4">{solution.summary}</p>
                  <ul className="mt-6 grid gap-2">
                    {solution.capabilities.slice(0, 3).map((capability) => (
                      <li
                        className="text-muted flex gap-3 text-sm"
                        key={capability.title}
                      >
                        <span
                          aria-hidden="true"
                          className="bg-signal mt-2 size-1.5 shrink-0 rounded-full"
                        />
                        <span>{capability.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="text-foreground mt-8 text-sm font-semibold underline-offset-4 group-hover:underline">
                  Explore {solution.name}
                </span>
              </Link>
            ))}
          </Stagger>
        </div>
      </section>

      <SectionDivider />

      <FeatureBlock
        body="Hatchet can serve a self-serve analyst, a strategy team that needs a polished readout, or a product group that needs normalized streaming data inside its own tools. The product path changes, but the signal stays consistent."
        bullets={[
          "Use the Web Dashboard for recurring discovery and shared analysis.",
          "Use Custom Reports when the question needs analyst context and a finished deliverable.",
          "Use API and Data Integrations when Hatchet data needs to power internal systems.",
        ]}
        className="bg-background py-18 lg:py-24"
        eyebrow="One data layer"
        heading="Pick the workflow. Keep the same market read."
        link={{ label: "Compare pricing", href: "/pricing" }}
      />

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Book a demo"
        secondaryCta={{ label: "Compare audiences", href: "/why-hatchet" }}
        title="Find the right Hatchet product path for your team."
      />
    </main>
  );
}
