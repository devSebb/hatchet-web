"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react/ssr";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { Stagger } from "@/components/motion/Stagger";
import { EmptyState } from "@/components/resources/EmptyState";
import { Pagination } from "@/components/resources/Pagination";
import { PostCard, type PostCardPost } from "@/components/resources/PostCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BlogExplorerProps = {
  /** Every post, newest first. Projected to card fields by the page. */
  posts: PostCardPost[];
  /** Category names, already sorted. "All" is added here. */
  categories: string[];
};

/**
 * Searching and filtering happen in the browser over the whole post list rather
 * than through the server on every keystroke.
 *
 * The list is small — 60 posts project to ~32KB of card fields — so shipping it
 * whole buys instant results with no request per character, and it keeps /blog
 * a static prerender. Reading `?category=` through the `searchParams` prop, or
 * through `useSearchParams`, would opt the route back into dynamic rendering or
 * push the grid behind a Suspense boundary; deep links are applied on mount
 * from `window.location` instead, so the first paint is still real HTML with
 * real articles in it.
 */

/** Six rows of two on desktop — a full screen without an endless scroll. */
const POSTS_PER_PAGE = 12;

const ALL = "All";

/**
 * The query string is read as an external store rather than copied into state
 * by an effect. That is what it is — state owned outside React — and it gets
 * the hydration behaviour this page needs for free: the server snapshot is
 * empty, so the prerender is the unfiltered first page, and React swaps in the
 * real one straight after hydrating a deep link.
 */
function subscribeToUrl(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

const readUrlSearch = () => window.location.search;
const readPrerenderSearch = () => "";

type ExplorerState = {
  query: string;
  category: string;
  page: number;
};

/** Everything a query is matched against, lowercased once per post. */
function haystack(post: PostCardPost) {
  return [
    post.title,
    post.excerpt,
    post.category,
    post.author?.name ?? "",
    ...post.tags,
  ]
    .join(" ")
    .toLowerCase();
}

export function BlogExplorer({ posts, categories }: BlogExplorerProps) {
  const urlSearch = useSyncExternalStore(
    subscribeToUrl,
    readUrlSearch,
    readPrerenderSearch,
  );

  const fromUrl = useMemo<ExplorerState>(() => {
    const params = new URLSearchParams(urlSearch);
    const urlCategory = params.get("category");
    const urlPage = Number(params.get("page"));

    return {
      query: params.get("q") ?? "",
      // An unknown category is dropped rather than honoured, so a stale or
      // hand-edited link shows every article instead of an empty grid.
      category:
        urlCategory && categories.includes(urlCategory) ? urlCategory : ALL,
      page: Number.isFinite(urlPage) && urlPage > 1 ? Math.trunc(urlPage) : 1,
    };
  }, [urlSearch, categories]);

  // Null until the reader touches a control: up to that point the URL is the
  // single source of truth, and after it their choices are.
  const [chosen, setChosen] = useState<ExplorerState | null>(null);
  const { query, category, page } = chosen ?? fromUrl;

  const update = (patch: Partial<ExplorerState>) =>
    // Any change to the query or the category invalidates the page number —
    // page 4 of a search that now has one page of hits is nothing at all.
    setChosen({ ...(chosen ?? fromUrl), page: 1, ...patch });

  const index = useMemo(
    () => posts.map((post) => ({ post, text: haystack(post) })),
    [posts],
  );

  const terms = useMemo(
    () => query.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [query],
  );

  const filtered = useMemo(
    () =>
      index
        .filter(({ post }) => category === ALL || post.category === category)
        // Every term has to land somewhere, so "twitch 2026" narrows rather
        // than widening the way a single joined string would.
        .filter(({ text }) => terms.every((term) => text.includes(term)))
        .map(({ post }) => post),
    [index, category, terms],
  );

  const totalPages = Math.max(Math.ceil(filtered.length / POSTS_PER_PAGE), 1);
  // Clamped rather than reset: a stale `?page=` or a filter that just shrank
  // the list lands on the last real page instead of an empty grid.
  const currentPage = Math.min(page, totalPages);
  const firstIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const visiblePosts = filtered.slice(firstIndex, firstIndex + POSTS_PER_PAGE);

  useEffect(() => {
    // Only ever writes in response to a choice. Before the first one there is
    // nothing to record, and writing anyway would flatten a deep link during
    // the commit where the store still holds the empty prerender snapshot.
    if (!chosen) return;

    const params = new URLSearchParams();
    if (category !== ALL) params.set("category", category);
    if (query.trim()) params.set("q", query.trim());
    if (currentPage > 1) params.set("page", String(currentPage));

    const search = params.toString();
    const next = `${window.location.pathname}${search ? `?${search}` : ""}`;
    const now = `${window.location.pathname}${window.location.search}`;

    // replaceState, not push: a filter is a view of one page, and pushing would
    // bury the page the reader arrived from under one entry per keystroke.
    if (next !== now) window.history.replaceState(null, "", next);
  }, [chosen, category, query, currentPage]);

  const hrefForPage = (target: number) => {
    const params = new URLSearchParams();
    if (category !== ALL) params.set("category", category);
    if (query.trim()) params.set("q", query.trim());
    if (target > 1) params.set("page", String(target));
    const search = params.toString();
    return search ? `/blog?${search}` : "/blog";
  };

  const isFiltered = category !== ALL || terms.length > 0;

  return (
    <>
      <div className="flex flex-col gap-3">
        <div role="search">
          <div className="relative w-full max-w-xl">
            <MagnifyingGlass
              aria-hidden="true"
              className="text-muted pointer-events-none absolute top-1/2 left-[14px] size-[18px] -translate-y-1/2"
              weight="bold"
            />
            <input
              aria-label="Search articles"
              autoComplete="off"
              // The WebKit clear affordance is suppressed: it sits where our
              // own clear button does and only one of them is themed.
              className="border-border bg-card text-foreground placeholder:text-muted focus-visible:border-brand focus-visible:ring-brand/30 h-11 w-full rounded-lg border pr-[44px] pl-[42px] text-sm shadow-xs transition-[border-color,box-shadow] outline-none focus-visible:ring-3 [&::-webkit-search-cancel-button]:appearance-none"
              onChange={(event) => update({ query: event.target.value })}
              placeholder="Search articles, games, platforms…"
              type="search"
              value={query}
            />
            {query ? (
              <button
                aria-label="Clear search"
                className="text-muted hover:text-foreground focus-visible:ring-ring/50 absolute top-1/2 right-[8px] flex size-[28px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-3"
                onClick={() => update({ query: "" })}
                type="button"
              >
                <X className="size-[14px]" weight="bold" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Thirteen chips wrap to six rows on a phone and bury the grid, so
            below lg they scroll sideways in one row instead. The negative
            margin lets that row bleed to the screen edge — a chip clipped by
            the viewport is what tells a reader there are more of them — while
            the matching padding keeps the first one on the page's left edge. */}
        <div
          aria-label="Filter articles by category"
          className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
          role="group"
        >
          {[ALL, ...categories].map((name) => {
            const active = category === name;

            return (
              <Badge
                asChild
                key={name}
                variant={active ? "default" : "outline"}
              >
                <button
                  aria-pressed={active}
                  className={cn(
                    // The badge's own hover rules are scoped to `[a]`, so a
                    // button gets none of them — restate them here.
                    "cursor-pointer transition-colors",
                    active
                      ? "hover:bg-primary/80"
                      : "hover:bg-muted-surface hover:text-muted-foreground",
                  )}
                  onClick={() => update({ category: name })}
                  type="button"
                >
                  {name}
                </button>
              </Badge>
            );
          })}
        </div>
      </div>

      {filtered.length ? (
        <>
          <p aria-live="polite" className="small text-muted mt-6">
            Showing {firstIndex + 1}&ndash;{firstIndex + visiblePosts.length} of{" "}
            {filtered.length}
            {category === ALL ? " articles" : ` in ${category}`}
            {terms.length ? ` matching “${query.trim()}”` : ""}
          </p>

          <Stagger
            // Keyed by category and page so the cascade replays when the set is
            // swapped wholesale. Deliberately not keyed by the query: replaying
            // a staggered fade on every keystroke reads as a stutter.
            className="mt-4 grid gap-4 lg:grid-cols-2"
            key={`${category}-${currentPage}`}
          >
            {visiblePosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </Stagger>

          <Pagination
            className="mt-12"
            currentPage={currentPage}
            hrefForPage={hrefForPage}
            label="Articles"
            onPageChange={(next) => {
              update({ page: next });
              // Matches what the link navigation used to do. Easing is left to
              // the global `scroll-smooth`, which honours reduced motion.
              window.scrollTo({ top: 0 });
            }}
            totalPages={totalPages}
          />
        </>
      ) : (
        <div className="mt-10">
          <EmptyState
            body={
              isFiltered
                ? "Try a broader term, or clear the filters to see every article."
                : "This topic is ready for the first Hatchet market read."
            }
            title={
              isFiltered
                ? "No articles match that search"
                : "This topic is ready for a market read"
            }
          />
          {isFiltered ? (
            <div className="mt-6 flex justify-center">
              <button
                className="border-border text-foreground hover:border-signal/60 hover:bg-muted-surface focus-visible:ring-ring/50 inline-flex h-10 cursor-pointer items-center rounded-lg border px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-3"
                onClick={() => update({ category: ALL, query: "" })}
                type="button"
              >
                Clear filters
              </button>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
