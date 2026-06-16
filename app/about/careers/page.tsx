import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { Badge } from "@/components/ui/badge";
import { careersOpenings } from "@/lib/config/marketing";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Careers",
    description:
      "Explore placeholder career openings for the Hatchet marketing site scaffold.",
    path: "/about/careers",
  });
}

export default function CareersPage() {
  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Careers"
        signal
        subtitle="This scaffold keeps careers lightweight: a clear company intro, placeholder openings, and a route that can grow when hiring copy is ready."
        title="Build the market intelligence layer for gaming."
      />

      <SectionDivider surface="paper" />

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow text-muted">Open roles</p>
              <h2 className="h1 mt-4">
                Placeholder openings with room for the real hiring system.
              </h2>
            </div>
          </Reveal>

          <Stagger className="mt-10 grid gap-4 lg:grid-cols-3">
            {careersOpenings.map((opening) => (
              <article
                className="border-border bg-card rounded-xl border p-6 shadow-sm"
                key={opening.title}
              >
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{opening.team}</Badge>
                  <Badge variant="secondary">{opening.location}</Badge>
                </div>
                <h2 className="h3 mt-5">{opening.title}</h2>
                <p className="body text-muted mt-4">{opening.description}</p>
              </article>
            ))}
          </Stagger>
        </div>
      </section>

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Stay close"
        secondaryCta={{ label: "About Hatchet", href: "/about" }}
        title="The final careers workflow will link to the hiring system."
      />
    </main>
  );
}
