"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FocusEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/ssr";

import { useHydratedReducedMotion } from "@/components/motion/use-hydrated-reduced-motion";
import { Button } from "@/components/ui/button";
import { formatContentDate } from "@/lib/content/format";
import type { Post } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type BlogCarouselProps = {
  posts: Post[];
  eyebrow?: string;
  title?: string;
  viewAllHref?: string;
  className?: string;
};

/**
 * Looping needs enough slides to fill the viewport twice over, otherwise Embla
 * quietly disables it and the track dead-ends against its last card. Between
 * three and four are visible at the widest breakpoint, so this clears that with
 * room to spare — and below it the carousel degrades to a plain draggable row
 * rather than drifting into a wall.
 */
const MIN_POSTS_FOR_LOOP = 9;

/** Pixels per frame. Slow enough to read a headline without chasing it. */
const SCROLL_SPEED = 1.1;

function CarouselCard({ post }: { post: Post }) {
  return (
    <Link
      // h-full so every card matches the tallest in the track: Embla sizes
      // slides by flex-basis but leaves their height to content, and a card
      // that stops short of its neighbours breaks the horizontal baseline.
      className="group border-border bg-card hover:border-brand/40 hover:shadow-glow-brand focus-visible:ring-ring/50 flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-[transform,border-color,box-shadow] duration-(--dur-base) outline-none hover:-translate-y-1 focus-visible:ring-3"
      href={`/blog/${post.slug}`}
    >
      <div className="border-border bg-muted relative aspect-[16/9] shrink-0 border-b">
        {post.coverImage ? (
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 320px, (min-width: 640px) 45vw, 80vw"
            src={post.coverImage}
          />
        ) : null}
        {/* The category rides the cover instead of sharing the meta line with
            the date. These cards are about half the width of the ones on /blog,
            and at 390px a category chip and a date side by side leave neither
            enough room to stay readable. Opaque, since it sits over cover art
            that can be any colour. */}
        <span className="border-border bg-card/90 text-foreground absolute top-[12px] left-[12px] max-w-[calc(100%-24px)] truncate rounded-lg border px-[10px] py-[5px] text-xs font-medium backdrop-blur-sm">
          {post.category}
        </span>
      </div>
      {/* Tighter padding below sm: the card is only ~250px there, so 40px of
          inset would cost the headline most of a line. */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <span className="small text-muted">
          {formatContentDate(post.publishedAt)}
        </span>
        {/* Three fixed lines. The card is deliberately narrower than the ones
            on /blog, so two lines cut most of these headlines mid-phrase; the
            fixed height is what keeps every card in the track level. */}
        <h3 className="font-display mt-3 line-clamp-3 min-h-[3lh] text-lg leading-snug font-semibold tracking-[-0.01em] group-hover:underline group-hover:underline-offset-4">
          {post.title}
        </h3>
        <span className="text-muted group-hover:text-foreground mt-auto pt-5 text-sm font-semibold transition-colors duration-(--dur-base)">
          Read article
          <span aria-hidden="true"> &rarr;</span>
        </span>
      </div>
    </Link>
  );
}

export function BlogCarousel({
  posts,
  eyebrow = "Insights",
  title = "Read the market while it is still moving.",
  viewAllHref = "/blog",
  className,
}: BlogCarouselProps) {
  const shouldReduceMotion = useHydratedReducedMotion();
  const canLoop = posts.length >= MIN_POSTS_FOR_LOOP;

  const plugins = useMemo(
    () =>
      canLoop
        ? [
            AutoScroll({
              speed: SCROLL_SPEED,
              startDelay: 0,
              // The track never parks: dragging or tapping an arrow only
              // redirects it, and it picks back up on mouse leave / blur.
              stopOnInteraction: false,
              stopOnMouseEnter: true,
              stopOnFocusIn: true,
            }),
          ]
        : [],
    [canLoop],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: canLoop,
      // Free scrolling reads as one continuous ribbon rather than a slideshow
      // snapping between positions, which is what the auto-scroll implies.
      dragFree: true,
    },
    plugins,
  );

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

  // The hook reports false until hydration settles, so the track can start
  // moving for a frame or two. Stopping it here — rather than never starting
  // it — keeps that window to the shortest it can be without a layout shift.
  useEffect(() => {
    if (shouldReduceMotion) {
      emblaApi?.plugins().autoScroll?.stop();
    }
  }, [emblaApi, shouldReduceMotion]);

  // The plugin's own stopOnFocusIn rides Embla's `slideFocusStart`, which only
  // fires when focusing a card actually scrolls the track. Tab to a card that
  // is already in view and nothing fires, so the card you just focused drifts
  // out from under you. Park it on any focus inside the track instead.
  const handleFocus = useCallback(() => {
    emblaApi?.plugins().autoScroll?.stop();
  }, [emblaApi]);

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      // Only resume once focus has genuinely left the track — not while it
      // steps from one card to the next — and never out from under a pointer
      // that is still resting on it.
      if (
        shouldReduceMotion ||
        event.currentTarget.contains(event.relatedTarget) ||
        event.currentTarget.matches(":hover")
      ) {
        return;
      }

      emblaApi?.plugins().autoScroll?.play();
    },
    [emblaApi, shouldReduceMotion],
  );

  if (!posts.length) {
    return null;
  }

  return (
    <section className={cn("py-14 lg:py-20", className)}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-muted">{eyebrow}</p>
            <h2 className="h1 mt-4">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild className="mr-2" variant="outline">
              <Link href={viewAllHref}>All articles</Link>
            </Button>
            <Button
              aria-label="Previous articles"
              disabled={!canScrollPrev}
              onClick={scrollPrev}
              size="icon"
              type="button"
              variant="outline"
            >
              <ArrowLeft aria-hidden="true" />
            </Button>
            <Button
              aria-label="Next articles"
              disabled={!canScrollNext}
              onClick={scrollNext}
              size="icon"
              type="button"
              variant="outline"
            >
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {/* The viewport shares the heading's gutter, so the first card lines up
          with the title and the rest run out under the container's right edge —
          the clip is what tells you the row keeps going. */}
      <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* `py-3 -my-3` opens room inside the clip for a card's hover lift and
            its glow, which the viewport's own overflow would otherwise shear
            off; the negative margin gives the space back to the layout. */}
        <div
          className="carousel-edge-fade -my-3 overflow-hidden py-3"
          onBlur={handleBlur}
          onFocus={handleFocus}
          ref={emblaRef}
        >
          <div className="flex touch-pan-y">
            {posts.map((post) => (
              // Fractional widths on purpose: the next card is always cut by
              // the container edge, which is what reads as "this keeps going"
              // before the track has moved at all.
              <article
                className="min-w-0 flex-[0_0_88%] pr-4 sm:flex-[0_0_54%] lg:flex-[0_0_37%] xl:flex-[0_0_29%]"
                key={post.slug}
              >
                <CarouselCard post={post} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
