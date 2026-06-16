import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { EmptyState } from "@/components/resources/EmptyState";
import { GuideCard } from "@/components/resources/ResourceCards";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { content } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Guides & E-books",
    description:
      "Download Hatchet guides and practical frameworks for gaming, creator, and live-streaming market intelligence.",
    path: "/resources/guides",
  });
}

export default async function GuidesPage() {
  const guides = await content.getGuides();

  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Guides and e-books"
        subtitle="Templates, scorecards, and frameworks for teams turning gaming market movement into repeatable decisions."
        title="Practical ways to structure the signal."
      />

      <SectionDivider surface="paper" />

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow text-muted">Guide library</p>
              <h2 className="h1 mt-4">
                Frameworks for launches, creators, sponsors, and categories.
              </h2>
            </div>
          </Reveal>

          {guides.length ? (
            <Stagger className="mt-10 grid gap-4 lg:grid-cols-3">
              {guides.map((guide) => (
                <GuideCard guide={guide} key={guide.slug} />
              ))}
            </Stagger>
          ) : (
            <div className="mt-10">
              <EmptyState
                body="This shelf is ready for the first guide or e-book."
                title="The guide shelf is ready"
              />
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Need a custom readout"
        secondaryCta={{ label: "View blog", href: "/blog" }}
        title="Build a reporting framework around the signal your team needs."
      />
    </main>
  );
}
