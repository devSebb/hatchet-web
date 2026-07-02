import Image from "next/image";
import Link from "next/link";

import type {
  CustomerStory,
  Guide,
  Post,
  PressItem,
} from "@/lib/content/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function formatContentDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      className="group border-border bg-card hover:border-signal/60 focus-visible:ring-ring/50 overflow-hidden rounded-xl border shadow-sm transition-[border-color,transform] duration-(--dur-base) outline-none hover:-translate-y-1 focus-visible:ring-3"
      href={`/blog/${post.slug}`}
    >
      {post.coverImage ? (
        <div className="border-border relative aspect-[16/9] border-b">
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            src={post.coverImage}
          />
        </div>
      ) : null}
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{post.category}</Badge>
          <span className="small text-muted">
            {formatContentDate(post.publishedAt)}
          </span>
        </div>
        <h2 className="h3 mt-4 group-hover:underline group-hover:underline-offset-4">
          {post.title}
        </h2>
        <p className="body text-muted mt-4">{post.excerpt}</p>
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
      className="group border-border bg-card hover:border-signal/60 focus-visible:ring-ring/50 flex min-h-80 flex-col justify-between rounded-xl border p-6 shadow-sm transition-[border-color,transform] duration-(--dur-base) outline-none hover:-translate-y-1 focus-visible:ring-3"
      href={`/resources/customer-stories/${story.slug}`}
    >
      <div>
        <div className="relative h-10 w-36">
          <Image
            alt={`${story.company} logo`}
            className="object-contain object-left"
            fill
            sizes="144px"
            src={story.logo}
          />
        </div>
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
        <blockquote className="body text-muted mt-6">
          &ldquo;{story.quote}&rdquo;
        </blockquote>
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
    <article className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      {guide.coverImage ? (
        <div className="border-border relative aspect-[16/9] border-b">
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            src={guide.coverImage}
          />
        </div>
      ) : null}
      <div className="p-5">
        <Badge variant={guide.gated ? "default" : "outline"}>
          {guide.gated ? "Gated guide" : "Open guide"}
        </Badge>
        <h2 className="h3 mt-4">{guide.title}</h2>
        <p className="body text-muted mt-4">{guide.summary}</p>
        <Button
          asChild
          className="mt-6"
          variant={guide.gated ? "default" : "outline"}
        >
          <Link href={ctaHref}>
            {guide.gated ? "Request the guide" : "Read the guide"}
          </Link>
        </Button>
      </div>
    </article>
  );
}

export function PressCard({ item }: { item: PressItem }) {
  return (
    <Link
      className="group border-border bg-card hover:border-signal/60 focus-visible:ring-ring/50 rounded-xl border p-6 shadow-sm transition-[border-color,transform] duration-(--dur-base) outline-none hover:-translate-y-1 focus-visible:ring-3"
      href={`/resources/press/${item.slug}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        {item.outlet ? <Badge variant="outline">{item.outlet}</Badge> : null}
        <span className="small text-muted">{formatContentDate(item.date)}</span>
      </div>
      <h2 className="h3 mt-5 group-hover:underline group-hover:underline-offset-4">
        {item.title}
      </h2>
      <p className="body text-muted mt-4">{item.excerpt}</p>
    </Link>
  );
}
