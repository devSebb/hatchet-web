import Link from "next/link";

import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  /**
   * Builds the href for a page number. A callback rather than a base path so
   * callers keep whatever filters they already have in the query string.
   */
  hrefForPage: (page: number) => string;
  /** Describes what is being paged, e.g. "Reports". Used for the label. */
  label: string;
  className?: string;
};

/**
 * Condenses a long run of pages to first / last / a window around the current
 * page, with "…" standing in for the gaps: 1 … 4 5 6 … 20.
 */
function pageItems(currentPage: number, totalPages: number) {
  const window = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  const pages = [...window]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const items: (number | "gap")[] = [];
  let previous = 0;

  for (const page of pages) {
    if (previous && page - previous > 1) items.push("gap");
    items.push(page);
    previous = page;
  }

  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  hrefForPage,
  label,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = pageItems(currentPage, totalPages);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const stepClass =
    "border-border text-foreground hover:border-signal/60 hover:bg-muted-surface focus-visible:ring-ring/50 inline-flex h-10 items-center rounded-lg border px-4 text-sm font-medium no-underline transition-colors outline-none focus-visible:ring-3";
  const disabledClass =
    "border-border text-muted/50 inline-flex h-10 cursor-not-allowed items-center rounded-lg border px-4 text-sm font-medium";

  return (
    <nav
      aria-label={`${label} pagination`}
      className={cn(
        "flex flex-wrap items-center justify-center gap-2",
        className,
      )}
    >
      {hasPrevious ? (
        <Link
          aria-label="Go to previous page"
          className={stepClass}
          href={hrefForPage(currentPage - 1)}
          rel="prev"
        >
          Previous
        </Link>
      ) : (
        <span aria-hidden="true" className={disabledClass}>
          Previous
        </span>
      )}

      <ul className="flex flex-wrap items-center gap-1">
        {items.map((item, index) =>
          item === "gap" ? (
            <li
              aria-hidden="true"
              className="text-muted px-2 text-sm"
              key={`gap-${index}`}
            >
              &hellip;
            </li>
          ) : (
            <li key={item}>
              <Link
                aria-current={item === currentPage ? "page" : undefined}
                aria-label={`Go to page ${item}`}
                className={cn(
                  "focus-visible:ring-ring/50 inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium tabular-nums no-underline transition-colors outline-none focus-visible:ring-3",
                  item === currentPage
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground hover:border-signal/60 hover:bg-muted-surface",
                )}
                href={hrefForPage(item)}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ul>

      {hasNext ? (
        <Link
          aria-label="Go to next page"
          className={stepClass}
          href={hrefForPage(currentPage + 1)}
          rel="next"
        >
          Next
        </Link>
      ) : (
        <span aria-hidden="true" className={disabledClass}>
          Next
        </span>
      )}
    </nav>
  );
}

/**
 * Clamps a raw `?page=` value onto the available range, so a hand-edited or
 * stale URL lands on a real page instead of an empty grid.
 */
export function resolvePage(
  raw: string | string[] | undefined,
  totalPages: number,
) {
  const parsed = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isFinite(parsed)
    ? Math.min(Math.max(Math.trunc(parsed), 1), Math.max(totalPages, 1))
    : 1;
}
