import type { Metadata } from "next";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { EmptyState } from "@/components/resources/EmptyState";
import { Pagination, resolvePage } from "@/components/resources/Pagination";
import { PressCard } from "@/components/resources/ResourceCards";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
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

type PressPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

/** Four rows of three on desktop — a full screen without an endless scroll. */
const PRESS_PER_PAGE = 12;

export default async function PressPage({ searchParams }: PressPageProps) {
  const params = await searchParams;
  const pressItems = [...(await content.getPressItems())].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const totalPages = Math.ceil(pressItems.length / PRESS_PER_PAGE);
  const currentPage = resolvePage(params?.page, totalPages);
  const firstIndex = (currentPage - 1) * PRESS_PER_PAGE;
  const visibleItems = pressItems.slice(
    firstIndex,
    firstIndex + PRESS_PER_PAGE,
  );

  const hrefForPage = (page: number) =>
    page > 1 ? `/resources/press?page=${page}` : "/resources/press";

  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Press"
        subtitle="Company announcements and coverage related to Hatchet's live-streaming, gaming, and esports intelligence work."
        title="News from the signal layer."
      />

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
            <>
              <p className="small text-muted mt-8">
                Showing {firstIndex + 1}&ndash;
                {firstIndex + visibleItems.length} of {pressItems.length}{" "}
                mentions
              </p>

              <Stagger
                className="mt-4 grid gap-4 lg:grid-cols-3"
                key={currentPage}
              >
                {visibleItems.map((item) => (
                  <PressCard item={item} key={item.slug} />
                ))}
              </Stagger>

              <Pagination
                className="mt-12"
                currentPage={currentPage}
                hrefForPage={hrefForPage}
                label="Press mentions"
                totalPages={totalPages}
              />
            </>
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

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Press contact"
        title="Use Hatchet context in your next gaming market story."
      />
    </main>
  );
}
