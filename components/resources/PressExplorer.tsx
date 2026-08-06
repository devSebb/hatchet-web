"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { Stagger } from "@/components/motion/Stagger";
import { Pagination } from "@/components/resources/Pagination";
import { PressCard } from "@/components/resources/ResourceCards";
import type { PressItem } from "@/lib/content/types";

/**
 * The press grid, paged in the browser.
 *
 * `/resources/press` used to read `?page=` through the `searchParams` prop.
 * Under `output: "export"` that is a build error — a statically exported route
 * has no request to read a query string from — and the page-2 link the index
 * already renders would have died with it.
 *
 * So paging moves here, on the same terms as `BlogExplorer` and
 * `ReportShelves`: the whole list is small (24 items), the hrefs stay real so
 * the control still reads as links to a crawler and still works from a pasted
 * URL, and the click is intercepted rather than followed. The prerender is
 * page 1, byte for byte what the server rendered before.
 */

/** Four rows of three on desktop — a full screen without an endless scroll. */
const PRESS_PER_PAGE = 12;

/**
 * The query string is read as an external store rather than copied into state
 * by an effect — see the same note in `BlogExplorer`. The server snapshot is
 * empty, so the prerender is page 1, and React swaps in a deep-linked page
 * straight after hydrating.
 */
function subscribeToUrl(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

const readUrlSearch = () => window.location.search;
const readPrerenderSearch = () => "";

export function PressExplorer({ items }: { items: PressItem[] }) {
  const urlSearch = useSyncExternalStore(
    subscribeToUrl,
    readUrlSearch,
    readPrerenderSearch,
  );

  const fromUrl = useMemo(() => {
    const urlPage = Number(new URLSearchParams(urlSearch).get("page"));
    return Number.isFinite(urlPage) && urlPage > 1 ? Math.trunc(urlPage) : 1;
  }, [urlSearch]);

  // Null until the reader turns a page: up to that point the URL is the single
  // source of truth, and after it their choice is.
  const [chosen, setChosen] = useState<number | null>(null);
  const page = chosen ?? fromUrl;

  const totalPages = Math.max(Math.ceil(items.length / PRESS_PER_PAGE), 1);
  // Clamped rather than reset, so a stale or hand-edited `?page=` lands on the
  // last real page instead of an empty grid — what `resolvePage` did server-side.
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const firstIndex = (currentPage - 1) * PRESS_PER_PAGE;
  const visibleItems = items.slice(firstIndex, firstIndex + PRESS_PER_PAGE);

  useEffect(() => {
    // Only ever writes in response to a choice. Before the first one there is
    // nothing to record, and writing anyway would flatten a deep link during
    // the commit where the store still holds the empty prerender snapshot.
    if (chosen === null) return;

    const next = `${window.location.pathname}${
      currentPage > 1 ? `?page=${currentPage}` : ""
    }`;
    const now = `${window.location.pathname}${window.location.search}`;
    if (next !== now) window.history.replaceState(null, "", next);
  }, [chosen, currentPage]);

  const hrefForPage = (target: number) =>
    target > 1 ? `/resources/press/?page=${target}` : "/resources/press/";

  return (
    <>
      {/* prettier-ignore — the `{" "}` keeps React's text-node boundaries
          identical to the server-rendered markup this replaced. Collapsing it
          onto one line changes nothing visible, but it does change the comment
          markers React emits, and this page is diffed against that baseline. */}
      {/* prettier-ignore */}
      <p className="small text-muted mt-8">
        Showing {firstIndex + 1}&ndash;
        {firstIndex + visibleItems.length} of {items.length}{" "}
        mentions
      </p>

      <Stagger className="mt-4 grid gap-4 lg:grid-cols-3" key={currentPage}>
        {visibleItems.map((item) => (
          <PressCard item={item} key={item.slug} />
        ))}
      </Stagger>

      <Pagination
        className="mt-12"
        currentPage={currentPage}
        hrefForPage={hrefForPage}
        label="Press mentions"
        onPageChange={setChosen}
        totalPages={totalPages}
      />
    </>
  );
}
