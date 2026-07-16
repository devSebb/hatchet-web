"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/ssr";

import { CompanyLogo } from "@/components/brand/CompanyLogo";
import { useHydratedReducedMotion } from "@/components/motion/use-hydrated-reduced-motion";
import { Button } from "@/components/ui/button";
import { logoSlugForName } from "@/lib/brand/logos";
import { cn } from "@/lib/utils";

// `logo` doubles as the registry lookup key: a card shows the real mark once
// lib/brand/logos.ts carries one under that exact name, and the styled text tile
// until then. Nothing to wire per testimonial.
export type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  company: string;
  logo: string;
  headshot?: string;
};

type TestimonialCarouselProps = {
  eyebrow?: string;
  title?: string;
  testimonials?: TestimonialItem[];
  className?: string;
};

const defaultTestimonials: TestimonialItem[] = [
  {
    quote:
      "Hatchet gives our team a consistent read on creator pickup, audience quality, and the moments that actually move the market.",
    name: "Maya Chen",
    role: "Director of insights",
    company: "Riot Games",
    logo: "Riot Games",
  },
  {
    quote:
      "We can compare games, creators, and community movement in one place instead of stitching together platform exports.",
    name: "Jordan Ellis",
    role: "Research lead",
    company: "Microsoft",
    logo: "Microsoft",
  },
  {
    quote:
      "The clearest sponsor conversations start with a trusted audience benchmark. Hatchet makes that benchmark repeatable.",
    name: "Alex Rivera",
    role: "Partnerships strategy",
    company: "NASCAR",
    logo: "NASCAR",
  },
];

export function TestimonialCarousel({
  eyebrow,
  title = "Teams use Hatchet when live audience movement needs to be clear.",
  testimonials = defaultTestimonials,
  className,
}: TestimonialCarouselProps) {
  const shouldReduceMotion = useHydratedReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: testimonials.length > 1,
    align: "start",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const updateSelected = () =>
      setSelectedIndex(emblaApi.selectedScrollSnap());
    updateSelected();
    emblaApi.on("select", updateSelected);
    emblaApi.on("reInit", updateSelected);

    return () => {
      emblaApi.off("select", updateSelected);
      emblaApi.off("reInit", updateSelected);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (
      !emblaApi ||
      shouldReduceMotion ||
      isPaused ||
      testimonials.length <= 1
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 5200);

    return () => window.clearInterval(interval);
  }, [emblaApi, isPaused, shouldReduceMotion, testimonials.length]);

  return (
    <section className={cn("px-4 py-16 sm:px-6 lg:px-8", className)}>
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            {eyebrow ? <p className="eyebrow text-muted">{eyebrow}</p> : null}
            <h2 className="h2 mt-3">{title}</h2>
          </div>
          <div className="flex gap-2">
            <Button
              aria-label="Previous testimonial"
              onClick={scrollPrev}
              size="icon"
              type="button"
              variant="outline"
            >
              <ArrowLeft aria-hidden="true" />
            </Button>
            <Button
              aria-label="Next testimonial"
              onClick={scrollNext}
              size="icon"
              type="button"
              variant="outline"
            >
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div
          className="mt-8 overflow-hidden"
          onFocus={() => setIsPaused(true)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          ref={emblaRef}
        >
          <div className="flex touch-pan-y">
            {testimonials.map((testimonial) => {
              const logoSlug = logoSlugForName(testimonial.logo);

              return (
                <article
                  className="min-w-0 flex-[0_0_100%] pr-5 md:flex-[0_0_64%] lg:flex-[0_0_46%]"
                  key={`${testimonial.company}-${testimonial.name}`}
                >
                  <div className="border-paper-border bg-paper-surface flex h-[450px] flex-col justify-between overflow-hidden rounded-xl border-2 p-5">
                    <div>
                      {logoSlug ? (
                        <div className="border-paper-border bg-paper-surface flex h-12 w-40 items-center justify-center rounded-lg border p-2 shadow-sm">
                          <CompanyLogo
                            className="text-paper-ink"
                            height={20}
                            slug={logoSlug}
                          />
                        </div>
                      ) : (
                        <div className="border-paper-border bg-paper font-display text-paper-ink inline-flex h-10 items-center rounded-lg border px-3 text-sm font-semibold">
                          {testimonial.logo}
                        </div>
                      )}
                      <blockquote className="body text-paper-ink mt-6 line-clamp-5">
                        “{testimonial.quote}”
                      </blockquote>
                    </div>
                    <div className="mt-6">
                      <p className="text-paper-ink text-sm font-semibold">
                        {testimonial.name}
                      </p>
                      <p className="small text-paper-muted">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          {testimonials.map((testimonial, index) => (
            <button
              aria-label={`Show testimonial ${index + 1} from ${testimonial.company}`}
              aria-pressed={selectedIndex === index}
              className={cn(
                "focus-visible:ring-ring/50 group/dot inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg outline-none focus-visible:ring-3",
              )}
              key={`${testimonial.company}-${testimonial.name}-dot`}
              onClick={() => scrollTo(index)}
              type="button"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "h-2.5 rounded-full transition-all duration-(--dur-base)",
                  selectedIndex === index
                    ? "bg-signal w-8"
                    : "bg-signal-grid group-hover/dot:bg-muted w-2.5",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
