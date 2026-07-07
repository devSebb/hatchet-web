"use client";

import type { ComponentProps, CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/ssr";

import { CTAPanel, type CTATone } from "@/components/sections/CTASection";
import { cn } from "@/lib/utils";

type CTACarouselProps = Omit<
  ComponentProps<typeof CTAPanel>,
  "tone" | "style" | "className"
> & {
  className?: string;
};

// Eight takes on the same panel, drawn from the brand families (brand red,
// brand navy, the alternate steel blue, white). Each slide keeps the panel
// markup identical and only re-seeds the gradient system's CSS variables
// (base gradient, glow, breathing bloom), so the grid, grain, and frame
// treatments carry across every theme. Ordered so neighbours always contrast:
// red-led and blue-led cards alternate, with the near-black and white cards
// late in the loop as the two extremes.
const SLIDE_THEMES: {
  name: string;
  tone: CTATone;
  style?: CSSProperties;
}[] = [
  // 01 — The original ember panel: ink → navy → brand red. Untouched.
  { name: "Signal red", tone: "dark" },
  // 02 — Brand navy: the deep royal blue leads, with a cool accent glow.
  {
    name: "Brand navy",
    tone: "dark",
    style: {
      "--gradient-cta":
        "linear-gradient(135deg, var(--ink) 0%, color-mix(in srgb, var(--blue-transitional) 50%, var(--ink)) 30%, var(--blue-transitional) 70%, color-mix(in srgb, var(--blue-transitional) 70%, var(--hero-blue-accent)) 100%)",
      "--gradient-cta-glow":
        "radial-gradient(120% 120% at 100% 0%, color-mix(in srgb, var(--hero-blue-accent) 36%, transparent) 0%, transparent 55%)",
      "--cta-bloom":
        "radial-gradient(92% 78% at 86% 6%, color-mix(in srgb, var(--hero-blue-accent) 30%, transparent) 0%, transparent 60%)",
    } as CSSProperties,
  },
  // 03 — Ember red: all-red (no orange), matching the data-card gradient
  // treatment elsewhere on the site.
  {
    name: "Ember red",
    tone: "dark",
    style: {
      "--gradient-cta":
        "linear-gradient(135deg, var(--ink) 0%, var(--brand-lowlight) 36%, var(--brand) 74%, #e23c42 100%)",
      "--gradient-cta-glow":
        "radial-gradient(120% 120% at 100% 0%, color-mix(in srgb, var(--brand-soft) 40%, transparent) 0%, transparent 55%)",
      "--cta-bloom":
        "radial-gradient(92% 78% at 86% 6%, color-mix(in srgb, #e23c42 38%, transparent) 0%, transparent 60%)",
    } as CSSProperties,
  },
  // 04 — Steel: the alternate hero blue at the media corner, resolving to
  // ink under the copy.
  {
    name: "Steel blue",
    tone: "dark",
    style: {
      "--gradient-cta":
        "linear-gradient(135deg, var(--hero-blue-accent) 0%, var(--hero-steel) 38%, var(--blue-transitional) 76%, var(--ink) 100%)",
      "--gradient-cta-glow":
        "radial-gradient(120% 120% at 100% 0%, color-mix(in srgb, var(--hero-mist) 22%, transparent) 0%, transparent 55%)",
      "--cta-bloom":
        "radial-gradient(92% 78% at 86% 6%, color-mix(in srgb, var(--hero-blue-accent) 34%, transparent) 0%, transparent 60%)",
    } as CSSProperties,
  },
  // 05 — Split signal: the two lead brand colors meet on a soft diagonal
  // seam — navy holds the media half, red holds the copy half, and a faint
  // sheen lights the join.
  {
    name: "Split signal",
    tone: "dark",
    style: {
      "--gradient-cta":
        "linear-gradient(115deg, color-mix(in srgb, var(--blue-transitional) 80%, var(--ink)) 0%, var(--blue-transitional) 44%, var(--brand-strong) 56%, var(--brand) 100%)",
      "--gradient-cta-glow":
        "radial-gradient(50% 130% at 50% 50%, color-mix(in srgb, var(--white) 7%, transparent) 0%, transparent 60%)",
      "--cta-bloom":
        "radial-gradient(92% 78% at 86% 6%, color-mix(in srgb, var(--brand) 34%, transparent) 0%, transparent 60%)",
    } as CSSProperties,
  },
  // 06 — Navy eclipse: deep royal blue sinking toward a red glow rising off
  // the bottom edge, like light behind a horizon.
  {
    name: "Navy eclipse",
    tone: "dark",
    style: {
      "--gradient-cta":
        "linear-gradient(to bottom, color-mix(in srgb, var(--blue-transitional) 70%, var(--ink)) 0%, var(--blue-transitional) 52%, color-mix(in srgb, var(--brand-lowlight) 50%, var(--blue-transitional)) 82%, var(--brand-strong) 100%)",
      "--gradient-cta-glow":
        "radial-gradient(85% 60% at 50% 112%, color-mix(in srgb, var(--brand) 55%, transparent) 0%, transparent 62%)",
      "--cta-bloom":
        "radial-gradient(70% 55% at 50% 108%, color-mix(in srgb, #e23c42 38%, transparent) 0%, transparent 60%)",
    } as CSSProperties,
  },
  // 07 — Paper: white with a cool mist corner and a faint red warmth; copy
  // flips to ink and the grid dots to an ink hairline.
  {
    name: "Paper white",
    tone: "light",
    style: {
      "--gradient-cta":
        "linear-gradient(135deg, var(--white) 0%, var(--white) 42%, var(--hero-mist) 80%, color-mix(in srgb, var(--hero-blue-accent) 26%, var(--white)) 100%)",
      "--gradient-cta-glow":
        "radial-gradient(120% 120% at 100% 0%, color-mix(in srgb, var(--brand) 10%, transparent) 0%, transparent 55%)",
      "--cta-bloom":
        "radial-gradient(92% 78% at 86% 6%, color-mix(in srgb, var(--brand) 14%, transparent) 0%, transparent 60%)",
      "--grid-line": "color-mix(in srgb, var(--black) 10%, transparent)",
      "--cta-grain-opacity": "0.04",
    } as CSSProperties,
  },
  // 08 — Aurora duet: calm navy field with the two brand colors as opposing
  // corner glows — red over the copy, steel blue under the media.
  {
    name: "Aurora duet",
    tone: "dark",
    style: {
      "--gradient-cta":
        "linear-gradient(135deg, color-mix(in srgb, var(--bg) 70%, var(--ink)) 0%, color-mix(in srgb, var(--blue-transitional) 60%, var(--bg)) 52%, color-mix(in srgb, var(--bg) 80%, var(--ink)) 100%)",
      "--gradient-cta-glow":
        "radial-gradient(70% 85% at 92% 0%, color-mix(in srgb, var(--brand) 36%, transparent) 0%, transparent 58%), radial-gradient(70% 85% at 6% 100%, color-mix(in srgb, var(--hero-blue-accent) 38%, transparent) 0%, transparent 58%)",
      "--cta-bloom":
        "radial-gradient(92% 78% at 86% 6%, color-mix(in srgb, var(--brand) 28%, transparent) 0%, transparent 60%)",
    } as CSSProperties,
  },
];

export function CTACarousel({ className, ...panelProps }: CTACarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  // The side arrows straddle the active panel's edge (sm+ only — on mobile
  // they'd overlap the copy, so a pair next to the dots takes over), and
  // follow the panel's tone: ink-on-light for the paper slide, white-on-dark
  // otherwise.
  const isLightSlide = SLIDE_THEMES[selectedIndex].tone === "light";
  const sideArrowClass = cn(
    "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-sm transition-colors duration-(--dur-fast) outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex",
    isLightSlide
      ? "border-black/15 bg-black/5 text-black/70 hover:bg-black/10 hover:text-black"
      : "border-white/15 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white",
  );
  // The mobile pair sits on the navy section background, so its treatment is
  // tone-independent.
  const dotRowArrowClass =
    "flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 transition-colors duration-(--dur-fast) outline-none hover:bg-white/20 hover:text-white focus-visible:ring-3 focus-visible:ring-ring/50 sm:hidden";

  return (
    <section
      className={cn(
        "bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-20",
        className,
      )}
    >
      <div
        aria-roledescription="carousel"
        className="relative mx-auto w-full max-w-7xl"
        role="region"
        aria-label="Book a demo"
      >
        {/* The flex row carries vertical padding (cancelled by the negative
            margin) so the laptop's overflow and drop shadow survive the
            carousel viewport's overflow clipping. */}
        <div className="-my-12 overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y gap-8 py-12">
            {SLIDE_THEMES.map((theme, index) => (
              <div
                aria-label={theme.name}
                aria-roledescription="slide"
                className="min-w-0 flex-[0_0_100%]"
                key={theme.name}
                role="group"
              >
                <CTAPanel
                  {...panelProps}
                  index={index + 1}
                  style={theme.style}
                  tone={theme.tone}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          aria-label="Previous style"
          className={cn(sideArrowClass, "-left-5")}
          onClick={scrollPrev}
          type="button"
        >
          <CaretLeft aria-hidden="true" className="size-4" />
        </button>
        <button
          aria-label="Next style"
          className={cn(sideArrowClass, "-right-5")}
          onClick={scrollNext}
          type="button"
        >
          <CaretRight aria-hidden="true" className="size-4" />
        </button>

        {/* z-10 lifts the dots above the embla track: its transform creates a
            stacking context that would otherwise paint over (and swallow
            clicks meant for) anything inside the -my-12 bleed zone. */}
        <div className="relative z-10 mt-6 flex items-center justify-center gap-1.5 sm:gap-2">
          <button
            aria-label="Previous style"
            className={dotRowArrowClass}
            onClick={scrollPrev}
            type="button"
          >
            <CaretLeft aria-hidden="true" className="size-4" />
          </button>
          {SLIDE_THEMES.map((theme, index) => (
            <button
              aria-label={`Show the ${theme.name} style`}
              aria-pressed={selectedIndex === index}
              className="focus-visible:ring-ring/50 group/dot inline-flex min-h-11 min-w-[1.75rem] items-center justify-center rounded-lg outline-none focus-visible:ring-3 sm:min-w-11"
              key={theme.name}
              onClick={() => scrollTo(index)}
              type="button"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "h-2.5 rounded-full transition-all duration-(--dur-base)",
                  selectedIndex === index
                    ? "bg-signal w-6 sm:w-8"
                    : "bg-signal-grid group-hover/dot:bg-muted w-2.5",
                )}
              />
            </button>
          ))}
          <button
            aria-label="Next style"
            className={dotRowArrowClass}
            onClick={scrollNext}
            type="button"
          >
            <CaretRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
