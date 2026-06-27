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
      "The full creator lifecycle on one platform: find and verify creators, analyze performance, run campaigns, and report results.",
    path: "/solutions",
  });
}

export default function SolutionsPage() {
  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Solutions"
        subtitle="From first search to final report — find and verify creators, analyze performance, run campaigns, and report results without switching tools."
        title="The full creator lifecycle. One platform."
      />

      <SectionDivider surface="paper" />

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow text-muted">The creator lifecycle</p>
              <h2 className="h1 mt-4">
                Four stages. One connected workflow.
              </h2>
              <p className="body-lg text-muted mt-5">
                Find and verify the right creators, analyze how they perform,
                run campaigns end to end, and report the results — each stage
                built on the same live signal.
              </p>
            </div>
          </Reveal>

          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        body="Discovery, intelligence, campaign execution, and reporting all run on the same live signal. Move from finding a creator to reporting their results without re-importing data or switching tools."
        bullets={[
          "Start in Discovery to find and verify the right creators.",
          "Use Intelligence to analyze streaming and social performance in one view.",
          "Run campaigns end to end in Creator Community, then share results from Reporting.",
        ]}
        className="bg-background py-18 lg:py-24"
        eyebrow="One data layer"
        heading="One workflow, start to finish."
        link={{ label: "Compare pricing", href: "/pricing" }}
      />

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Book a demo"
        media={{
          src: "/images/hero-dashboard.png",
          alt: "Hatchet dashboard showing live-streaming analytics across platforms",
          width: 2000,
          height: 1143,
        }}
        proof={{
          kind: "pills",
          items: ["Creator discovery", "Campaign tracking", "ROI measurement"],
        }}
        title="See the full creator lifecycle in action."
        variant="featured"
      />
    </main>
  );
}
