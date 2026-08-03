import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { EmptyState } from "@/components/resources/EmptyState";
import { Pagination, resolvePage } from "@/components/resources/Pagination";
import { GuideCard } from "@/components/resources/ResourceCards";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { content } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Reports & Ebooks",
    description:
      "Download Hatchet guides and practical frameworks for gaming, creator, and live-streaming market intelligence.",
    path: "/resources/guides",
  });
}

type GuidesPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

/** Four rows of three on desktop — a full screen without an endless scroll. */
const GUIDES_PER_PAGE = 12;

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const params = await searchParams;
  const guides = await content.getGuides();

  const totalPages = Math.ceil(guides.length / GUIDES_PER_PAGE);
  const currentPage = resolvePage(params?.page, totalPages);
  const firstIndex = (currentPage - 1) * GUIDES_PER_PAGE;
  const visibleGuides = guides.slice(firstIndex, firstIndex + GUIDES_PER_PAGE);

  const hrefForPage = (page: number) =>
    page > 1 ? `/resources/guides?page=${page}` : "/resources/guides";

  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Reports and ebooks"
        subtitle="Templates, scorecards, and frameworks for teams turning gaming market movement into repeatable decisions."
        title="Practical ways to structure the signal."
      />

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
            <>
              <p className="small text-muted mt-8">
                Showing {firstIndex + 1}&ndash;
                {firstIndex + visibleGuides.length} of {guides.length} reports
              </p>

              <Stagger
                // Keyed by page so the reveal replays on navigation instead of
                // the new page inheriting the previous one's finished state.
                className="mt-4 grid gap-4 lg:grid-cols-3"
                key={currentPage}
              >
                {visibleGuides.map((guide) => (
                  <GuideCard guide={guide} key={guide.slug} />
                ))}
              </Stagger>

              <Pagination
                className="mt-12"
                currentPage={currentPage}
                hrefForPage={hrefForPage}
                label="Reports"
                totalPages={totalPages}
              />
            </>
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

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Need a custom readout"
        title="Build a reporting framework around the signal your team needs."
      />
    </main>
  );
}
