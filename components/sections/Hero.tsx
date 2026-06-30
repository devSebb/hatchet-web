import Image from "next/image";
import Link from "next/link";

import { CircuitField } from "@/components/sections/CircuitField";
import { Reveal } from "@/components/motion/Reveal";
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
  stats?: string[];
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
   */
  surface?: "dark" | "paper" | "gradient";
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
  const isPaper = surface === "paper";
  const isGradient = surface === "gradient";

  const headlineStyle = isPaper
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
          <p className={cn("eyebrow", isGradient ? "text-white/70" : "text-muted")}>
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
          <ul
            className={cn(
              "mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-sm",
              isGradient ? "text-white/70" : "text-muted",
            )}
          >
            {stats.map((stat, index) => (
              <li className="flex items-center gap-3" key={stat}>
                {index > 0 ? (
                  <span
                    aria-hidden
                    className={isGradient ? "text-white/30" : "text-border"}
                  >
                    ·
                  </span>
                ) : null}
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    isGradient ? "text-white" : "text-foreground",
                  )}
                >
                  {stat}
                </span>
              </li>
            ))}
          </ul>
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
        "relative isolate overflow-hidden px-4 pt-12 pb-16 sm:px-6 lg:px-8 lg:pt-18 lg:pb-20",
        // "gradient" stays transparent so the shared navy→white background that
        // bleeds across the hero + trusted-by sections shows through.
        isGradient ? "surface-paper" : "bg-background",
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
