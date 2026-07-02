import Image from "next/image";
import Link from "next/link";

import { CircuitField } from "@/components/sections/CircuitField";
import {
  HeroStatVisual,
  type HeroStatVisualVariant,
} from "@/components/sections/HeroStatVisual";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";

type HeroImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type HeroProps = {
  eyebrow?: string;
  title: string;
  emphasizedTitle: string;
  subtitle: string;
  stats?: Array<{
    value: number;
    suffix?: string;
    label: string;
    visual?: HeroStatVisualVariant;
  }>;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  image?: HeroImage;
  /**
   * "dark" renders on a solid navy section background (interior pages).
   * "gradient" stays transparent so the shared navy→white background that
   * bleeds from the hero into the trusted-by band shows through — white text
   * rides the dark top.
   */
  surface?: "dark" | "gradient";
  className?: string;
};

export function Hero({
  eyebrow,
  title,
  emphasizedTitle,
  subtitle,
  stats,
  primaryCta = { label: "Book a demo", href: siteConfig.bookDemoUrl },
  secondaryCta = { label: "Sign up", href: siteConfig.signUpUrl },
  image,
  surface = "dark",
  className,
}: HeroProps) {
  const isGradient = surface === "gradient";

  const headlineStyle = isGradient ? { color: "var(--white)" } : undefined;

  // The headline/subtitle/stats sit on the dark navy top of the gradient, so
  // they need light treatments rather than the paper foreground tokens.
  const textBlock = (
    <Reveal>
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        {eyebrow ? (
          <p
            className={cn(
              "eyebrow",
              isGradient ? "text-white/70" : "text-muted",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1 className="display" style={headlineStyle}>
          {title} <span className="text-brand">{emphasizedTitle}</span>
        </h1>
        <p
          className={cn(
            "body-lg mt-4 max-w-2xl",
            isGradient ? "text-white/75" : "text-muted",
          )}
        >
          {subtitle}
        </p>
        {stats?.length ? (
          // "Data cards": dark glass tuned for the navy top of the gradient
          // hero. The fill is an opaque lifted-navy (a whisper of white over
          // --bg) rather than a near-transparent tint, so the faint circuit
          // traces behind the hero can't bleed through the card as uneven
          // banding. A low-opacity white rim and a soft top sheen read as glass,
          // and a brand-red bloom at the base ties into the chart. A gradient
          // hero number sits up top; its data graphic bleeds to the bottom edge.
          <Stagger
            childClassName="group relative flex flex-col overflow-hidden rounded-2xl bg-[color-mix(in_srgb,var(--white)_7%,var(--bg))] shadow-[0_18px_50px_-14px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/15 transition-[transform,background-color,box-shadow] duration-(--dur-base) hover:-translate-y-1 hover:bg-[color-mix(in_srgb,var(--white)_11%,var(--bg))] hover:shadow-glow-brand"
            className="mt-6 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {stats.map((stat) => (
              <div
                className="relative flex h-full flex-col pt-5 text-left"
                key={stat.label}
              >
                {/* Brand-red bloom at the base — warms the card into the chart
                    and echoes the headline against the navy. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(130% 82% at 50% 100%, color-mix(in srgb, var(--brand) 22%, transparent) 0%, transparent 62%)",
                  }}
                />
                {/* Soft top sheen — a faint light-catch on the top edge that
                    reads as glass without milking out the dark fill. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(160deg, color-mix(in srgb, var(--white) 12%, transparent) 0%, color-mix(in srgb, var(--white) 4%, transparent) 26%, transparent 52%)",
                  }}
                />
                <div className="relative px-5">
                  <span className="eyebrow whitespace-nowrap text-white/55">
                    {stat.label}
                  </span>
                  <span className="mt-1.5 flex items-baseline gap-0.5">
                    <Counter
                      className="text-gradient-brand"
                      style={{ fontSize: "clamp(2rem, 3.4vw, 2.75rem)" }}
                      to={stat.value}
                    />
                    {stat.suffix ? (
                      <span
                        className="text-gradient-brand font-extrabold"
                        style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.625rem)" }}
                      >
                        {stat.suffix}
                      </span>
                    ) : null}
                  </span>
                </div>
                {stat.visual ? (
                  // Full-bleed chart foundation; a hair of side padding keeps
                  // the marks off the rounded corners.
                  <div className="relative mt-5 flex flex-1 items-end px-2">
                    <HeroStatVisual
                      className="relative"
                      variant={stat.visual}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </Stagger>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link
              href={secondaryCta.href}
              {...(secondaryCta.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {secondaryCta.label}
            </Link>
          </Button>
        </div>
      </div>
    </Reveal>
  );

  const imageBlock = image ? (
    <Reveal delay={0.08}>
      <div className="border-border bg-surface/60 w-full max-w-5xl overflow-hidden rounded-2xl border p-2 shadow-xl">
        <Image
          alt={image.alt}
          className="h-auto w-full rounded-xl"
          height={image.height}
          priority
          sizes="(min-width: 1024px) 64rem, 100vw"
          src={image.src}
          width={image.width}
        />
      </div>
    </Reveal>
  ) : null;

  // Gradient surface: the text zone is a full-bleed block whose height tracks
  // its own content, so the navy→white fade is anchored to the headline rather
  // than the (much taller) section that also holds the dashboard image.
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden px-4 pt-4 pb-16 sm:px-6 lg:px-8 lg:pt-6 lg:pb-20",
        // "gradient" stays transparent so the shared background that bleeds
        // across the hero + trusted-by sections shows through.
        isGradient ? "surface-paper" : "bg-background",
        className,
      )}
    >
      <CircuitField density="quiet" />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">
        {textBlock}
        {imageBlock ? <div className="mt-8 lg:mt-10">{imageBlock}</div> : null}
      </div>
    </section>
  );
}
