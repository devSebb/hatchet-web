import Image from "next/image";
import Link from "next/link";

import type { Guide } from "@/lib/content/types";

/**
 * Cover-first, unlike GuideCard. Every report cover on WordPress is a designed
 * plate that already carries its own title, quarter, and year as artwork, so on
 * a shelf the cover *is* the card — a chrome-heavy card around it competes with
 * the thing it is presenting.
 *
 * The title still ships as text underneath. The covers are images: without it a
 * reader on a screen reader gets nothing, and neither does a crawler.
 */

/** Only what a shelf card paints. The index projects reports down to this. */
export type ReportCardGuide = Pick<
  Guide,
  "slug" | "title" | "coverImage" | "gated" | "year" | "quarter" | "series"
>;

export function ReportCard({ report }: { report: ReportCardGuide }) {
  // Matches GuideCard: a gated report jumps straight to its form rather than
  // landing the reader at the top of a page whose only purpose is that form.
  const href = report.gated
    ? `/resources/guides/${report.slug}#hubspot-form`
    : `/resources/guides/${report.slug}`;

  return (
    <Link
      className="group focus-visible:ring-ring/50 focus-visible:ring-offset-background flex h-full flex-col rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-offset-4"
      href={href}
    >
      {/* The lift and the glow sit on the cover, not the whole card: the title
          below is the label for the plate, and moving it with the artwork makes
          the two read as one floating slab rather than a picture being picked
          up. bg-muted holds the frame's shape while the image decodes. */}
      <div className="border-border bg-muted group-hover:border-brand/40 group-hover:shadow-glow-brand relative aspect-[16/9] shrink-0 overflow-hidden rounded-xl border shadow-sm transition-[transform,border-color,box-shadow] duration-(--dur-base) group-hover:-translate-y-1">
        {report.coverImage ? (
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 280px, (min-width: 640px) 46vw, 72vw"
            src={report.coverImage}
          />
        ) : null}
      </div>

      {/* Two fixed lines so every card in the track resolves to the same height
          and the action line below them stays on one baseline across the row. */}
      <p className="font-display text-foreground mt-4 line-clamp-2 min-h-[2lh] text-sm leading-snug font-semibold tracking-[-0.01em] group-hover:underline group-hover:underline-offset-4">
        {report.title}
      </p>
      {/* Carries the gate. Thirty-three of the thirty-five reports are gated, so
          a badge on the card face would be a constant rather than a signal —
          the two open ones are what this line is here to tell you apart. */}
      <span className="text-muted group-hover:text-foreground mt-1 text-xs font-semibold transition-colors duration-(--dur-base)">
        {report.gated ? "Request the report" : "Read the report"}
        <span aria-hidden="true"> &rarr;</span>
      </span>
    </Link>
  );
}
