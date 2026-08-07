import type { Metadata } from "next";

import { EmptyState } from "@/components/resources/EmptyState";
import type { ReportCardGuide } from "@/components/resources/ReportCard";
import {
  ReportShelves,
  type ReportShelf,
} from "@/components/resources/ReportShelves";
import { CTASection } from "@/components/sections/CTASection";
import { content } from "@/lib/content";
import type { Guide, GuideSeries } from "@/lib/content/types";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Reports & Ebooks",
    description:
      "Download Hatchet quarterly, yearly, and focused reports on gaming, creator, and live-streaming market intelligence.",
    path: "/resources/guides",
  });
}

/** The cross-section shelf: enough to fill a row and a half, no more. */
const LATEST_COUNT = 6;

const SHELF_COPY: Record<GuideSeries, { title: string; description: string }> =
  {
    quarterly: {
      title: "Industry Quarterly Report",
      description:
        "Every quarter's read on viewership, platforms, games, and the creators moving them — plus the regional editions.",
    },
    yearly: {
      title: "Industry Yearly Report",
      description:
        "The full-year picture: what shifted across live streaming, and what it set up for the year that followed.",
    },
    focused: {
      title: "Focused Report",
      description:
        "One subject at a time — a genre, a platform, a category, or a moment worth its own analysis.",
    },
  };

/** Shelf order, which is not the order the series happen to appear in. */
const SERIES_ORDER: GuideSeries[] = ["quarterly", "yearly", "focused"];

/**
 * Drops the fields a cover card never paints — summary, highlights, the form
 * id — before the list crosses into the browser.
 */
function toCard(guide: Guide) {
  const card: ReportCardGuide = {
    slug: guide.slug,
    title: guide.title,
    coverImage: guide.coverImage,
    gated: guide.gated,
    year: guide.year,
    quarter: guide.quarter,
    series: guide.series,
  };

  return card;
}

/**
 * Newest first, by what the report covers rather than when it went up. Sorting
 * by publication date alone interleaves a quarterly with the yearly that
 * summarises it, and files a January retrospective ahead of the Q4 it is about.
 */
function byRecency(a: Guide, b: Guide) {
  const year = (b.year ?? 0) - (a.year ?? 0);
  if (year !== 0) return year;

  const quarter = (b.quarter ?? 0) - (a.quarter ?? 0);
  if (quarter !== 0) return quarter;

  return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
}

export default async function GuidesPage() {
  const guides = [...(await content.getGuides())].sort(byRecency);

  const shelves: ReportShelf[] = [];

  if (guides.length) {
    shelves.push({
      id: "latest",
      title: "Latest Reports",
      description:
        "The most recent research to land, across every series. Start here if you are not looking for anything in particular.",
      reports: guides.slice(0, LATEST_COUNT).map(toCard),
    });
  }

  for (const series of SERIES_ORDER) {
    // Fixtures and any pre-classification sync carry no series; they shelve as
    // focused rather than vanishing from a page that is meant to be the archive.
    const reports = guides.filter(
      (guide) => (guide.series ?? "focused") === series,
    );

    if (!reports.length) {
      continue;
    }

    shelves.push({
      id: series,
      ...SHELF_COPY[series],
      reports: reports.map(toCard),
      filterByYear: true,
    });
  }

  return (
    <main className="bg-background text-foreground">
      {/* Deliberately shorter than the shared PageHeader the other routes use,
          and matching /blog: an archive is a place to start scanning, so the
          header says what the page is and gets out of the way. It stays on the
          dark scope so the sticky site header keeps the backdrop its contrast
          was set against. */}
      <section className="w-full px-4 pt-6 pb-6 sm:px-6 lg:px-8 lg:pt-8 lg:pb-8">
        <div className="mx-auto grid w-full max-w-7xl gap-x-10 gap-y-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="eyebrow text-muted">Reports and ebooks</p>
            <h1 className="h2 mt-3">Industry Reports</h1>
          </div>
          <p className="body-lg text-muted lg:pb-1">
            Quarterly and yearly reads on live streaming, plus focused research
            on the genres, platforms, and categories worth their own analysis.
          </p>
        </div>
      </section>

      <section className="surface-paper bg-background text-foreground px-4 pt-[40px] pb-16 sm:px-6 lg:px-8 lg:pt-[48px] lg:pb-24">
        <div className="mx-auto w-full max-w-7xl">
          {shelves.length ? (
            <ReportShelves shelves={shelves} />
          ) : (
            <EmptyState
              body="This shelf is ready for the first report."
              title="The report shelf is ready"
            />
          )}
        </div>
      </section>

      <CTASection
        body="Creator, audience, and campaign intelligence for gaming teams, in one place."
        className="py-18 lg:py-24"
        eyebrow="Need a custom readout"
        title="Build a reporting framework around the signal your team needs."
      />
    </main>
  );
}
