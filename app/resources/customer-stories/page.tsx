import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CustomerStoryCard } from "@/components/resources/ResourceCards";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { content } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Customer Stories",
    description:
      "See placeholder customer stories showing how teams use Hatchet live-streaming intelligence.",
    path: "/resources/customer-stories",
  });
}

export default async function CustomerStoriesPage() {
  const stories = await content.getCustomerStories();

  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Customer stories"
        subtitle="Customer story templates show the metric, quote, and use-case framing each story will carry when final copy lands."
        title="How teams turn live signal into decisions."
      />

      <SectionDivider surface="paper" />

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow text-muted">Stories</p>
              <h2 className="h1 mt-4">
                Proof points, quotes, and market context.
              </h2>
            </div>
          </Reveal>

          {stories.length ? (
            <Stagger className="mt-10 grid gap-4 lg:grid-cols-3">
              {stories.map((story) => (
                <CustomerStoryCard key={story.slug} story={story} />
              ))}
            </Stagger>
          ) : (
            <div className="border-border bg-card mt-10 rounded-xl border p-6 text-center shadow-sm">
              <p className="font-display text-lg font-semibold">
                The proof library is ready
              </p>
              <p className="body text-muted mt-3">
                This library is ready for the first customer proof point.
              </p>
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Your signal story"
        title="Show what live-streaming intelligence could prove for your team."
      />
    </main>
  );
}
