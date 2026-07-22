import Image from "next/image";
import Link from "next/link";

import { CircuitField } from "@/components/sections/CircuitField";
import { HeroVideo } from "@/components/sections/HeroVideo";
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

type HeroVideoConfig = {
  /** Public Mux playback ID. Empty falls back to the static `image`. */
  playbackId: string;
  /** Poster/fallback still; defaults to `image.src` when omitted. */
  poster?: string;
  /** Media-box dimensions — reserve space and set the frame's aspect ratio. */
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
   * When set (with a non-empty playbackId), an autoplay/muted/looping Mux clip
   * replaces `image` in the framed media slot. `image` stays as the fallback
   * when no playbackId is configured (e.g. env var not set).
   */
  video?: HeroVideoConfig;
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
  video,
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
          // "Data cards": clean white paper cards sitting on the navy top of the
          // gradient hero, so they read as bright, high-contrast panels against
          // the dark. An opaque white fill keeps the faint circuit traces behind
          // the hero from bleeding through; a light paper-border rim and a soft
          // drop shadow lift them off the navy, and a wide brand-red bloom at the
          // base makes the chart asset glow. A gradient hero number sits up top;
          // its data graphic bleeds to the bottom edge.
          <Stagger
            childClassName="group relative flex flex-col overflow-hidden rounded-2xl bg-[var(--paper-surface)] shadow-[0_18px_50px_-14px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-[var(--paper-border)] transition-[transform,background-color,box-shadow] duration-(--dur-base) hover:-translate-y-1 hover:bg-[color-mix(in_srgb,var(--bg)_3%,var(--white))] hover:shadow-glow-brand"
            className="mt-6 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {stats.map((stat) => (
              <div
                className="relative flex h-full flex-col pt-3 text-left"
                key={stat.label}
              >
                {/* Brand-red bloom at the base — a wide glow that warms the white
                    card into the chart asset and echoes the headline. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(150% 100% at 50% 100%, color-mix(in srgb, var(--brand) 20%, transparent) 0%, color-mix(in srgb, var(--brand) 8%, transparent) 40%, transparent 74%)",
                  }}
                />
                <div className="relative px-5">
                  <span className="eyebrow whitespace-nowrap text-[var(--paper-muted)]">
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
                  <div className="relative mt-3 flex flex-1 items-end px-2">
                    <HeroStatVisual
                      className="relative [filter:drop-shadow(0_1px_8px_color-mix(in_srgb,var(--brand)_50%,transparent))]"
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

  // A configured Mux clip wins the media slot; otherwise the static image
  // renders (also the fallback when the playback ID env var isn't set).
  const useVideo = Boolean(video?.playbackId);

  const mediaInner =
    useVideo && video ? (
      <HeroVideo
        className="block h-auto w-full rounded-xl object-cover"
        playbackId={video.playbackId}
        poster={video.poster ?? image?.src ?? ""}
        style={{ aspectRatio: `${video.width} / ${video.height}` }}
        title={image?.alt}
      />
    ) : image ? (
      <Image
        alt={image.alt}
        className="h-auto w-full rounded-xl"
        height={image.height}
        priority
        sizes="(min-width: 1024px) 64rem, 100vw"
        src={image.src}
        width={image.width}
      />
    ) : null;

  const mediaBlock = mediaInner ? (
    <Reveal delay={0.08}>
      <div className="border-border bg-surface/60 w-full max-w-5xl overflow-hidden rounded-2xl border p-2 shadow-xl">
        {mediaInner}
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
      {/* On the gradient surface the board fades out before the navy resolves
          to white — the circuit lives on dark backgrounds only. */}
      <CircuitField density="quiet" fadeBottom={isGradient} />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">
        {textBlock}
        {mediaBlock ? <div className="mt-8 lg:mt-10">{mediaBlock}</div> : null}
      </div>
    </section>
  );
}
