import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatContentDate } from "@/lib/content/format";
import type { Post } from "@/lib/content/types";

/**
 * The card lives apart from ResourceCards because the blog index renders it
 * from a client component. Importing it from there would drag that module's
 * whole graph — the brand logo registry behind StoryLogo, the button
 * primitives — into the browser bundle for no benefit.
 */

/**
 * Only what a card paints. The index projects every post down to this before
 * handing them to the client: the full Post carries `contentHtml`, and 60 of
 * those is ~840KB of article markup that would ship for a grid that never
 * renders a word of it.
 */
export type PostCardPost = Pick<
  Post,
  | "slug"
  | "title"
  | "excerpt"
  | "category"
  | "tags"
  | "coverImage"
  | "coverImageAlt"
  | "publishedAt"
  | "readingMinutes"
  | "author"
>;

export function PostCard({ post }: { post: PostCardPost }) {
  return (
    <Link
      // `flex h-full` is load-bearing twice over. An <a> is inline by default,
      // and an inline box with a border fragments into one piece per line box —
      // as a direct grid child it would be blockified, but <Stagger> wraps each
      // card in a motion div, so the card is no longer the grid item. That same
      // wrapper is what stretches to the row, so `h-full` is what makes every
      // card fill its row rather than shrink to its own content.
      className="group border-border bg-card hover:border-signal/60 focus-visible:ring-ring/50 flex h-full flex-col gap-4 overflow-hidden rounded-xl border p-4 shadow-sm transition-[border-color,transform] duration-(--dur-base) outline-none hover:-translate-y-1 focus-visible:ring-3 sm:flex-row"
      href={`/blog/${post.slug}`}
    >
      {post.coverImage ? (
        // Held at 16:9 inside the card's padding rather than stretched to fill a
        // full-height column. The source covers are captioned banners — every
        // one carries its headline as artwork — and a column crop shears the
        // words off both ends. Centred, so the leftover height either side of a
        // taller copy block reads as deliberate rather than as a gap.
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-lg sm:w-[44%] sm:max-w-[19rem] sm:self-center">
          <Image
            alt={post.coverImageAlt ?? ""}
            className="object-cover transition-transform duration-(--dur-base) group-hover:scale-[1.04]"
            fill
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 44vw, 100vw"
            src={post.coverImage}
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col">
        {/* One fixed line, never wrapped: at narrow widths a long category name
            plus the date exceeds the card, and wrapping it made those cards a
            row taller than the rest. The badge gives way with an ellipsis so
            the date — always short — stays intact. */}
        <div className="flex min-h-11 items-center gap-2">
          {/* The ellipsis lives on an inner span, not the badge: the badge
              centres its content, so an over-long label clipped by the badge
              itself loses characters off both ends rather than trailing off. */}
          <Badge className="min-w-0 shrink" variant="outline">
            <span className="truncate">{post.category}</span>
          </Badge>
          <time
            className="small text-muted shrink-0"
            dateTime={post.publishedAt}
          >
            {formatContentDate(post.publishedAt)}
          </time>
        </div>

        {/* Clamped, but with no reserved minimum: the byline below is pinned by
            `mt-auto` and the row equalises the cards, so a short title costs an
            empty line rather than buying anything. Three lines because the copy
            column is narrow beside the cover, and two cut most headlines
            mid-word. */}
        <h2 className="h3 mt-2 line-clamp-3 group-hover:underline group-hover:underline-offset-4">
          {post.title}
        </h2>
        <p className="body text-muted mt-2 line-clamp-2">{post.excerpt}</p>

        {/* `mt-auto` absorbs the leftover space so the byline sits on the bottom
            edge and lines up across the row. */}
        <div className="border-border/70 mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-t pt-[12px]">
          {post.author ? (
            <span className="small text-muted min-w-0 truncate">
              {post.author.name}
            </span>
          ) : null}
          {post.author && post.readingMinutes ? (
            <span aria-hidden="true" className="text-muted/50 text-xs">
              &bull;
            </span>
          ) : null}
          {post.readingMinutes ? (
            <span className="small text-muted shrink-0">
              {post.readingMinutes} min read
            </span>
          ) : null}
          <span className="text-foreground ml-auto shrink-0 text-sm font-semibold underline-offset-4 group-hover:underline">
            Read
            <span aria-hidden="true"> &rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
