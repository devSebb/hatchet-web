import Link from "next/link";

import type { CustomerStory, PressItem } from "@/lib/content/types";
import { StoryLogo } from "@/components/resources/StoryLogo";
import { Badge } from "@/components/ui/badge";
import { formatContentDate } from "@/lib/content/format";

/** PostCard lives in ./PostCard — see the note at the top of that file. */
/** Reports are shelved by ./ReportCard, which leads with the cover art. */

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
