"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/ssr";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ReportCard,
  type ReportCardGuide,
} from "@/components/resources/ReportCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The report archive as a stack of shelves rather than one paginated grid.
 *
 * Thirty-five reports in a flat grid is four pages of near-identical covers
 * with no way to tell a quarterly from a one-off, and the thing a reader
 * usually arrives wanting — "the latest quarterly", "the 2024 yearly" — takes a
 * page turn to reach. Split by series, each shelf is short enough to scan in
 * one pass, and the year chips get any of them to one click deep.
 *
 * Filtering runs in the browser over the whole list, which keeps the route a
 * static prerender: reading `?year=` through `searchParams` would opt it back
 * into dynamic rendering for a control that changes a dozen cards.
 */

export type ReportShelf = {
  id: string;
  title: string;
  description: string;
  /** Newest first. */
  reports: ReportCardGuide[];
  /** Off on the cross-section shelf, where a year would be a contradiction. */
  filterByYear?: boolean;
};

/**
 * Every year, and each shelf's default. Opening on the newest year instead was
 * the obvious reading of the design and it is wrong here: 2026 holds two
 * quarterlies and one focused report, so every shelf opened as a stub of a row
 * against a screen of empty space with its arrows dead. Showing the series
 * whole fills the rail, gives the arrows something to do, and leaves the year
 * chips as a way to narrow rather than a wall to click through — which also
 * puts every report in the prerendered HTML instead of seven of them.
 */
const ALL = "all";

type YearChoice = number | typeof ALL;

function Shelf({ shelf }: { shelf: ReportShelf }) {
  const years = useMemo(() => {
    if (!shelf.filterByYear) {
      return [];
    }

    return Array.from(
      new Set(
        shelf.reports
          .map((report) => report.year)
          .filter((year): year is number => typeof year === "number"),
      ),
    ).sort((a, b) => b - a);
  }, [shelf]);

  const [picked, setPicked] = useState<YearChoice>(ALL);
  const activeYear =
    typeof picked === "number" && years.includes(picked) ? picked : ALL;

  const visible = useMemo(
    () =>
      activeYear === ALL
        ? shelf.reports
        : shelf.reports.filter((report) => report.year === activeYear),
    [shelf.reports, activeYear],
  );

  // Chips only earn their space when a year actually groups something. The
  // yearly series is one report per year, so there they would just be a slower
  // way to reach a card already on screen.
  const showYears = years.length > 1 && shelf.reports.length > years.length;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    // Free scrolling: these are shelves to browse, not slides to step through,
    // and snapping would fight a drag that only wants to nudge the row along.
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const update = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);

    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  // Switching years swaps the whole track. React reuses the slide nodes, so
  // Embla keeps the old measurements and can leave the row scrolled past its
  // new end; re-measure and park it back at the first card. `true` jumps rather
  // than animating — nothing slid, the shelf was replaced.
  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    emblaApi.reInit();
    emblaApi.scrollTo(0, true);
  }, [emblaApi, visible]);

  return (
    // The rule between shelves is drawn by the next one's top border, with
    // equal padding either side of it — hence pb here rather than a gap on the
    // stack, which would land on top of this padding and double it.
    <section className="border-border/70 border-t pt-12 pb-12 first:border-t-0 first:pt-0 last:pb-0">
      <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10">
        <div>
          <h2 className="h3">{shelf.title}</h2>
          <p className="body text-muted mt-3">{shelf.description}</p>

          {showYears ? (
            <div
              aria-label={`Filter ${shelf.title} by year`}
              // Below lg the chips share the row's full width and can wrap; no
              // shelf has more than five chips, so this is two rows at worst.
              className="mt-5 flex flex-wrap gap-2"
              role="group"
            >
              {([ALL, ...years] as YearChoice[]).map((year) => {
                const active = year === activeYear;

                return (
                  <Badge
                    asChild
                    key={year}
                    variant={active ? "default" : "outline"}
                  >
                    <button
                      aria-pressed={active}
                      className={cn(
                        // The badge's hover rules are scoped to `[a]`, so a
                        // button gets none of them — restate them here.
                        "cursor-pointer transition-colors",
                        active
                          ? "hover:bg-primary/80"
                          : "hover:bg-muted-surface hover:text-muted-foreground",
                      )}
                      onClick={() => setPicked(year)}
                      type="button"
                    >
                      {year === ALL ? "All" : year}
                    </button>
                  </Badge>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* The track eats the page gutter on its right so the row runs out under
            the container edge — the half-cut card is what says it keeps going.
            `-my-3 py-3` opens room inside the clip for a cover's hover lift and
            glow, which the overflow would otherwise shear off. */}
        <div className="mt-6 min-w-0 lg:mt-0">
          {/* The arrows sit over the track rather than under the chips in the
              rail. Down there they made the rail taller than the covers beside
              it, and every shelf with a chip row ended in a band of empty paper
              that read as a rendering fault. Hidden below lg, where the rail
              stacks above the track and a pair of arrows would only push the
              covers further down the page for a gesture the reader has. */}
          <div className="mb-4 hidden justify-end gap-2 lg:flex">
            <Button
              aria-label={`Previous ${shelf.title.toLowerCase()}`}
              disabled={!canScrollPrev}
              onClick={scrollPrev}
              size="icon"
              type="button"
              variant="outline"
            >
              <ArrowLeft aria-hidden="true" />
            </Button>
            <Button
              aria-label={`More ${shelf.title.toLowerCase()}`}
              disabled={!canScrollNext}
              onClick={scrollNext}
              size="icon"
              type="button"
              variant="outline"
            >
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
          <div
            className="rail-edge-fade -my-3 -mr-4 overflow-hidden py-3 sm:-mr-6 lg:mr-0"
            ref={emblaRef}
          >
            <div className="flex touch-pan-y">
              {visible.map((report) => (
                // Fractional widths on purpose: the next cover is always cut by
                // the container edge, before the track has moved at all.
                <article
                  className="min-w-0 flex-[0_0_72%] pr-4 sm:flex-[0_0_46%] lg:flex-[0_0_44%] xl:flex-[0_0_33%]"
                  key={report.slug}
                >
                  <ReportCard report={report} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReportShelves({ shelves }: { shelves: ReportShelf[] }) {
  return (
    <div className="flex flex-col">
      {shelves.map((shelf) => (
        <Shelf key={shelf.id} shelf={shelf} />
      ))}
    </div>
  );
}
