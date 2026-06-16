import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { StatCounters } from "@/components/sections/StatCounters";
import { differentiators, proofStats } from "@/lib/config/marketing";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Why Hatchet",
    description:
      "Hatchet turns live-streaming, gaming, creator, press, and community movement into market intelligence teams can defend.",
    path: "/why-hatchet",
  });
}

export default function WhyHatchetPage() {
  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Why Hatchet"
        subtitle="Gaming culture moves through creators, games, platforms, press, events, and communities. Hatchet measures that movement as one live signal."
        title="Market intelligence built for live gaming behavior."
      />

      <SectionDivider surface="paper" />

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow text-muted">Differentiators</p>
              <h2 className="h1 mt-4">
                Hatchet is designed around decisions, not dashboards.
              </h2>
            </div>
          </Reveal>

          <Stagger className="mt-10 grid gap-4 lg:grid-cols-3">
            {differentiators.map((item) => (
              <article
                className="border-border bg-card rounded-xl border p-6 shadow-sm"
                key={item.label}
              >
                <div className="bg-signal mb-6 h-1 w-10 rounded-full" />
                <h2 className="h3">{item.label}</h2>
                <p className="body text-muted mt-4">{item.body}</p>
              </article>
            ))}
          </Stagger>
        </div>
      </section>

      <SectionDivider />

      <StatCounters
        className="bg-elevated py-18 lg:py-24"
        eyebrow="Proof at signal scale"
        stats={proofStats}
        title="A measurement layer built for the scale of gaming culture."
      />

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="See the difference"
        secondaryCta={{ label: "Explore solutions", href: "/solutions" }}
        title="Use live signal when gaming market decisions need proof."
      />
    </main>
  );
}
