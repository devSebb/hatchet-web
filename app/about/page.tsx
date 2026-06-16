import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CTASection } from "@/components/sections/CTASection";
import { FeatureBlock } from "@/components/sections/FeatureBlock";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "About",
    description:
      "Learn about Hatchet's mission to make gaming, esports, creator, and live-streaming market movement easier to measure.",
    path: "/about",
  });
}

const values = [
  {
    label: "Measure what moves",
    body: "Gaming culture is live, fragmented, and fast. Hatchet focuses on signals that help teams make decisions while the market is still changing.",
  },
  {
    label: "Make proof legible",
    body: "Data should hold up in a planning meeting, an executive readout, and a research deck without losing context.",
  },
  {
    label: "Respect the work",
    body: "Brands, publishers, agencies, and esports teams need different framing. Hatchet keeps the signal consistent while adapting to the job.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="About Hatchet"
        subtitle="Hatchet exists to make live-streaming, gaming, creator, esports, press, and community movement measurable for the teams building around it."
        title="We supply the data behind the stream."
      />

      <SectionDivider surface="paper" />

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow text-muted">Mission and values</p>
              <h2 className="h1 mt-4">
                Give every gaming business a clearer read on live attention.
              </h2>
            </div>
          </Reveal>

          <Stagger className="mt-10 grid gap-4 lg:grid-cols-3">
            {values.map((value) => (
              <article
                className="border-border bg-card rounded-xl border p-6 shadow-sm"
                key={value.label}
              >
                <div className="bg-signal mb-6 h-1 w-10 rounded-full" />
                <h2 className="h3">{value.label}</h2>
                <p className="body text-muted mt-4">{value.body}</p>
              </article>
            ))}
          </Stagger>
        </div>
      </section>

      <SectionDivider />

      <FeatureBlock
        body="The public site will tell the rebrand story, explain the market intelligence layer, and point teams to the right next step. Product app surfaces, rankings, reports, and live data systems remain separate."
        bullets={[
          "Public marketing pages stay focused on audiences and outcomes.",
          "Content-driven resources will read through the adapter in Phase 8.",
          "Careers and company pages stay lightweight until final copy lands.",
        ]}
        className="bg-background py-18 lg:py-24"
        eyebrow="Company"
        heading="A focused marketing foundation for a broader intelligence product."
        link={{ label: "View careers", href: "/about/careers" }}
      />

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Work with Hatchet"
        secondaryCta={{ label: "See careers", href: "/about/careers" }}
        title="Bring live-streaming intelligence into sharper focus."
      />
    </main>
  );
}
