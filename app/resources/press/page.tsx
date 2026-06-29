import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { EmptyState } from "@/components/resources/EmptyState";
import { PressCard } from "@/components/resources/ResourceCards";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { content } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Press",
    description:
      "Read Hatchet company announcements and media coverage about gaming and live-streaming intelligence.",
    path: "/resources/press",
  });
}

export default async function PressPage() {
  const pressItems = [...(await content.getPressItems())].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Press"
        subtitle="Company announcements and coverage related to Hatchet's live-streaming, gaming, and esports intelligence work."
        title="News from the signal layer."
      />

      <SectionDivider surface="paper" />

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow text-muted">Newsroom</p>
              <h2 className="h1 mt-4">
                Announcements and coverage with market context.
              </h2>
            </div>
          </Reveal>

          {pressItems.length ? (
            <Stagger className="mt-10 grid gap-4 lg:grid-cols-3">
              {pressItems.map((item) => (
                <PressCard item={item} key={item.slug} />
              ))}
            </Stagger>
          ) : (
            <div className="mt-10">
              <EmptyState
                body="The press room is ready for the next announcement."
                title="The press room is ready"
              />
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Press contact"
        title="Use Hatchet context in your next gaming market story."
      />
    </main>
  );
}
