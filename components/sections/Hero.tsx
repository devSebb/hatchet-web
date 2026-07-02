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
  };
  image?: HeroImage;
  /**
   * "paper" flips the hero to a light surface (white bg, navy headline).
   * "gradient" blends navy (under the nav) down through a faint red-violet to
   * white where the trusted-signal band begins — white text rides the dark top.
   * "light" stays transparent like "gradient" but assumes a pale backdrop
   * (hero theme lab), so text takes the paper treatments instead of white.
   */
  surface?: "dark" | "paper" | "gradient" | "light";
  /**
   * "compact" swaps the glass stat modules for smaller light cards — a brand
   * rail, tighter number, and a miniature visual. Used by hero theme 3.
   */
  statStyle?: "default" | "compact";
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
  statStyle = "default",
  className,
}: HeroProps) {
  const isPaper = surface === "paper";
  const isGradient = surface === "gradient";
  const isLight = surface === "light";
  const hasVisuals = stats?.some((stat) => stat.visual);

  // When stats carry a bespoke visual, they render as glass "stat modules"
  // instead of a bare centered row.
  const statCardClass = cn(
    "flex flex-col rounded-2xl px-4 py-2.5 text-left",
    isGradient ? "bg-white/[0.03]" : "bg-surface/50",
  );

  const headlineStyle =
    isPaper || isLight
      ? { color: "var(--bg)" }
      : isGradient
        ? { color: "var(--white)" }
        : undefined;

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
          {title}{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--brand-highlight) 0%, var(--brand) 24%, var(--brand) 94%, var(--brand-lowlight) 100%)",
            }}
          >
            {emphasizedTitle}
          </span>
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
          statStyle === "compact" ? (
            // Light-hero "data cards": tinted frosted glass. A translucent fill
            // over heavy backdrop blur, a faint cool frost tint, a diagonal
            // light-catch sheen and a bright white rim make the glass read
            // clearly even on the pale surface (which gives the blur little to
            // refract). A gradient hero number sits up top; its data graphic
            // bleeds to the bottom edge. No hard border, no divider.
            <Stagger
              childClassName="group relative flex flex-col overflow-hidden rounded-2xl bg-white/25 shadow-[0_18px_50px_-14px_rgba(21,31,44,0.34)] ring-1 ring-inset ring-white/70 backdrop-blur-2xl transition-[transform,box-shadow] duration-(--dur-base) hover:-translate-y-1 hover:shadow-glow-brand"
              className="mt-6 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
            >
              {stats.map((stat) => (
                <div
                  className="relative flex h-full flex-col pt-5 text-left"
                  key={stat.label}
                >
                  {/* Cool frost tint — gives the glass a visible frosted body
                      instead of vanishing into the near-white backdrop. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(150deg, color-mix(in srgb, var(--hero-blue-accent) 20%, transparent) 0%, color-mix(in srgb, var(--hero-blue-accent) 6%, transparent) 45%, color-mix(in srgb, var(--brand) 7%, transparent) 100%)",
                    }}
                  />
                  {/* Full-card warm fade — spans the whole card (weighted to the
                      base where the graphic sits) so no white strips show
                      beside the chart. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(135% 78% at 50% 100%, color-mix(in srgb, var(--brand) 13%, transparent) 0%, transparent 60%)",
                    }}
                  />
                  {/* Diagonal light-catch sheen — the tell that reads as glass. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(130deg, color-mix(in srgb, var(--white) 78%, transparent) 0%, color-mix(in srgb, var(--white) 18%, transparent) 30%, transparent 58%)",
                    }}
                  />
                  <div className="relative px-5">
                    <span className="eyebrow text-muted whitespace-nowrap">
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
                        tone="light"
                        variant={stat.visual}
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </Stagger>
          ) : hasVisuals ? (
            <Stagger
              childClassName={statCardClass}
              className="mt-6 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
            >
              {stats.map((stat) => (
                <div className="flex h-full flex-col" key={stat.label}>
                  {stat.visual ? (
                    <HeroStatVisual
                      className={isGradient ? "text-white/70" : "text-muted"}
                      variant={stat.visual}
                    />
                  ) : null}
                  <div className="flex flex-col items-start pt-1">
                    <span className="flex items-baseline gap-0.5">
                      <Counter
                        className={
                          isGradient ? "text-white" : "text-foreground"
                        }
                        style={{ fontSize: "clamp(1.75rem, 3.8vw, 2.5rem)" }}
                        to={stat.value}
                      />
                      {stat.suffix ? (
                        <span
                          className="text-brand-soft font-extrabold"
                          style={{ fontSize: "clamp(1.125rem, 2.4vw, 1.5rem)" }}
                        >
                          {stat.suffix}
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={cn(
                        "eyebrow mt-0.5",
                        isGradient ? "text-white/55" : "text-muted",
                      )}
                    >
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </Stagger>
          ) : (
            <Stagger className="mt-8 flex items-stretch justify-center">
              {stats.map((stat) => (
                <div
                  className="flex flex-col items-center px-3 text-center sm:px-4"
                  key={stat.label}
                >
                  <span className="flex items-baseline gap-0.5">
                    <Counter
                      className={isGradient ? "text-white" : "text-foreground"}
                      style={{ fontSize: "clamp(1.875rem, 4vw, 2.75rem)" }}
                      to={stat.value}
                    />
                    {stat.suffix ? (
                      <span
                        className="text-brand-soft font-extrabold"
                        style={{ fontSize: "clamp(1.25rem, 2.6vw, 1.75rem)" }}
                      >
                        {stat.suffix}
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      "eyebrow mt-2",
                      isGradient ? "text-white/55" : "text-muted",
                    )}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </Stagger>
          )
        ) : null}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
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
        // "gradient" and "light" stay transparent so the shared background that
        // bleeds across the hero + trusted-by sections shows through.
        isGradient || isLight ? "surface-paper" : "bg-background",
        isPaper && "surface-paper",
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
