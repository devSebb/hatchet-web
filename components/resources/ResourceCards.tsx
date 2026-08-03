import Image from "next/image";
import Link from "next/link";

import type {
  CustomerStory,
  Guide,
  Post,
  PressItem,
} from "@/lib/content/types";
import { StoryLogo } from "@/components/resources/StoryLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatContentDate } from "@/lib/content/format";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      // `flex h-full flex-col` is load-bearing twice over. An <a> is inline by
      // default, and an inline box with a border fragments into one piece per
      // line box — as a direct grid child it would be blockified, but <Stagger>
      // wraps each card in a motion div, so the card is no longer the grid item.
      // That same wrapper is what stretches to the row, so `h-full` is what
      // makes every card fill its row rather than shrink to its own content.
      className="group border-border bg-card hover:border-signal/60 focus-visible:ring-ring/50 flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-[border-color,transform] duration-(--dur-base) outline-none hover:-translate-y-1 focus-visible:ring-3"
      href={`/blog/${post.slug}`}
    >
      {post.coverImage ? (
        <div className="border-border relative aspect-[16/9] shrink-0 border-b">
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            src={post.coverImage}
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5">
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
          <span className="small text-muted shrink-0">
            {formatContentDate(post.publishedAt)}
          </span>
        </div>
        {/* Clamped so a long title or excerpt cannot push one row taller than
            the rest — the grid sizes every row to its tallest card. */}
        <h2 className="h3 mt-4 line-clamp-2 min-h-[2lh] group-hover:underline group-hover:underline-offset-4">
          {post.title}
        </h2>
        <p className="body text-muted mt-4 line-clamp-3 min-h-[3lh]">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}

export function CustomerStoryCard({ story }: { story: CustomerStory }) {
  const [metricFigure, ...metricLabelParts] = story.metric
    ? story.metric.trim().split(/\s+/)
    : [];
  const metricLabel = metricLabelParts.join(" ");

  return (
    <Link
      className="group border-border bg-card hover:border-signal/60 focus-visible:ring-ring/50 flex h-full min-h-80 flex-col justify-between rounded-xl border p-6 shadow-sm transition-[border-color,transform] duration-(--dur-base) outline-none hover:-translate-y-1 focus-visible:ring-3"
      href={`/resources/customer-stories/${story.slug}`}
    >
      <div>
        <StoryLogo className="h-10 w-36" sizes="144px" story={story} />
        {story.metric ? (
          <div className="mt-8">
            <p className="stat-figure text-foreground text-[clamp(2.5rem,5vw,4rem)] break-words">
              {metricFigure}
            </p>
            {metricLabel ? (
              <p className="font-display text-foreground mt-2 text-lg leading-snug font-semibold text-balance">
                {metricLabel}
              </p>
            ) : null}
          </div>
        ) : null}
        {story.quote ? (
          <blockquote className="body text-muted mt-6 line-clamp-4">
            &ldquo;{story.quote}&rdquo;
          </blockquote>
        ) : (
          <p className="body text-muted mt-6 line-clamp-4">{story.summary}</p>
        )}
      </div>
      <span className="text-foreground mt-8 text-sm font-semibold underline-offset-4 group-hover:underline">
        Read {story.company} story
      </span>
    </Link>
  );
}

export function GuideCard({ guide }: { guide: Guide }) {
  const ctaHref = guide.gated
    ? `/resources/guides/${guide.slug}#hubspot-form`
    : `/resources/guides/${guide.slug}`;

  return (
    <article className="border-border bg-card flex h-full flex-col overflow-hidden rounded-xl border shadow-sm">
      {guide.coverImage ? (
        <div className="border-border relative aspect-[16/9] shrink-0 border-b">
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            src={guide.coverImage}
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <Badge
          className="self-start"
          variant={guide.gated ? "default" : "outline"}
        >
          {guide.gated ? "Gated guide" : "Open guide"}
        </Badge>
        {/* Clamped so every card in the grid resolves to the same height. */}
        <h2 className="h3 mt-4 line-clamp-2 min-h-[2lh]">{guide.title}</h2>
        <p className="body text-muted mt-4 line-clamp-3 min-h-[3lh]">
          {guide.summary}
        </p>
        {/* `mt-auto` absorbs the leftover space so the CTA sits on the bottom
            edge and lines up across the row; `pt-6` keeps a gap when the
            summary runs to its full three lines and there is none left. */}
        <div className="mt-auto pt-6">
          <Button asChild variant={guide.gated ? "default" : "outline"}>
            <Link href={ctaHref}>
              {guide.gated ? "Request the guide" : "Read the guide"}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function PressCard({ item }: { item: PressItem }) {
  // Coverage published elsewhere links straight to the article; a detail page
  // would only restate the headline it already shows.
  const isExternal = Boolean(item.url);

  return (
    <Link
      // See PostCard for why `flex h-full flex-col` rather than a bare block.
      className="group border-border bg-card hover:border-signal/60 focus-visible:ring-ring/50 flex h-full flex-col rounded-xl border p-6 shadow-sm transition-[border-color,transform] duration-(--dur-base) outline-none hover:-translate-y-1 focus-visible:ring-3"
      href={item.url ?? `/resources/press/${item.slug}`}
      rel={isExternal ? "noopener noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      {/* See PostCard: one fixed line so a long outlet name cannot make this
          card taller than its neighbours. */}
      <div className="flex min-h-11 items-center gap-2">
        {item.outlet ? (
          // See PostCard: the ellipsis has to sit on an inner span.
          <Badge className="min-w-0 shrink" variant="outline">
            <span className="truncate">{item.outlet}</span>
          </Badge>
        ) : null}
        <span className="small text-muted shrink-0">
          {formatContentDate(item.date)}
        </span>
      </div>
      {/* Clamped so every card in the grid resolves to the same height. */}
      <h2 className="h3 mt-5 line-clamp-3 min-h-[3lh] group-hover:underline group-hover:underline-offset-4">
        {item.title}
      </h2>
      {item.excerpt ? (
        <p className="body text-muted mt-4 line-clamp-3 min-h-[3lh]">
          {item.excerpt}
        </p>
      ) : null}
      {/* One line: a long outlet name ("Sports Business Journal") would
          otherwise wrap at narrow widths and make this card taller. */}
      <span className="text-foreground mt-auto line-clamp-1 pt-6 text-sm font-semibold underline-offset-4 group-hover:underline">
        {isExternal ? `Read on ${item.outlet ?? "the publisher"}` : "Read more"}
        <span aria-hidden="true"> &rarr;</span>
      </span>
    </Link>
  );
}
