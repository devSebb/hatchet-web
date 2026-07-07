import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";

type CTAProof =
  | { kind: "stat"; value: string; label: string }
  | { kind: "logos"; names: string[] }
  | { kind: "pills"; items: string[] };

type CTAMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * "dark" is the standard treatment (white copy on the deep gradient);
 * "light" flips the copy to ink for panels with a white/paper gradient.
 */
export type CTATone = "dark" | "light";

type CTAContentProps = {
  variant?: "default" | "featured";
  eyebrow?: string;
  title?: string;
  body?: string;
  cta?: { label: string; href: string };
  proof?: CTAProof;
  media?: CTAMedia;
};

type CTASectionProps = CTAContentProps & {
  className?: string;
};

// PROVISIONAL copy — pending content-team finalization (see PR summary).
const DEFAULT_TITLE = "Turn live signal into decisions.";
const DEFAULT_BODY =
  "Creator, audience, and campaign intelligence for gaming teams — in one place.";

function ProofBlock({ proof, tone }: { proof: CTAProof; tone: CTATone }) {
  const isLight = tone === "light";

  if (proof.kind === "stat") {
    return (
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "font-display text-2xl font-bold tabular-nums",
            isLight ? "text-black" : "text-white",
          )}
        >
          {proof.value}
        </span>
        <span className={cn("text-sm", isLight ? "text-black/70" : "text-white/80")}>
          {proof.label}
        </span>
      </div>
    );
  }

  if (proof.kind === "logos") {
    return (
      <ul
        className={cn(
          "flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium",
          isLight ? "text-black/70" : "text-white/80",
        )}
      >
        {proof.names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {proof.items.slice(0, 3).map((item) => (
        <li
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium",
            isLight
              ? "border-black/15 bg-black/5 text-black/80"
              : "border-white/25 bg-white/10 text-white/90",
          )}
          key={item}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function CTACopy({
  eyebrow,
  title,
  body,
  cta,
  proof,
  align,
  tone,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
  proof?: CTAProof;
  align: "center" | "start";
  tone: CTATone;
}) {
  const isLight = tone === "light";

  return (
    <div className={cn("max-w-xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className={cn("eyebrow", isLight ? "text-black/60" : "text-white/70")}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={cn("h2 mt-3", isLight ? "text-black" : "text-white")}>
        {title}
      </h2>
      <p className={cn("body-lg mt-5", isLight ? "text-black/70" : "text-white/85")}>
        {body}
      </p>
      <div
        className={cn(
          "mt-8 flex flex-col gap-5 sm:flex-row sm:items-center",
          align === "center" && "sm:justify-center",
        )}
      >
        <Button asChild variant={isLight ? "default" : "inverse"}>
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
        {proof ? <ProofBlock proof={proof} tone={tone} /> : null}
      </div>
    </div>
  );
}

function CTAMediaPanel({ media, tone }: { media?: CTAMedia; tone: CTATone }) {
  const isLight = tone === "light";

  return (
    <div className="relative md:-translate-y-3 lg:-translate-y-4">
      {media ? (
        <div className="relative md:-translate-x-4 md:scale-[1.07] lg:-translate-x-6 lg:scale-[1.12]">
          {/* Red under-glow so the image sits in the gradient, not on it. */}
          <div
            aria-hidden="true"
            className="bg-brand/25 absolute inset-x-8 top-1/3 -bottom-6 -z-10 rounded-[40%] blur-3xl"
          />
          <Image
            alt={media.alt}
            className="cta-media-elevation h-auto w-full"
            height={media.height}
            sizes="(min-width: 768px) 40rem, 100vw"
            src={media.src}
            width={media.width}
          />
        </div>
      ) : (
        <div
          className={cn(
            "flex aspect-[16/10] items-center justify-center rounded-2xl border border-dashed",
            isLight
              ? "border-black/20 bg-black/5"
              : "border-white/25 bg-white/5",
          )}
        >
          <span
            className={cn("text-sm", isLight ? "text-black/60" : "text-white/60")}
          >
            Product preview
          </span>
        </div>
      )}
    </div>
  );
}

type CTAPanelProps = CTAContentProps & {
  tone?: CTATone;
  /** 1-based card number, shown as a corner badge (carousel slides only). */
  index?: number;
  className?: string;
  /**
   * Per-panel overrides of the gradient system's CSS variables
   * (--gradient-cta, --gradient-cta-glow, --cta-bloom, --grid-line, …).
   */
  style?: CSSProperties;
};

/**
 * The gradient CTA panel itself, without the section wrapper — reused by
 * CTASection (single panel) and CTACarousel (one panel per slide).
 */
export function CTAPanel({
  variant = "default",
  eyebrow,
  title = DEFAULT_TITLE,
  body = DEFAULT_BODY,
  cta = { label: "Book a demo", href: siteConfig.bookDemoUrl },
  proof,
  media,
  tone = "dark",
  index,
  className,
  style,
}: CTAPanelProps) {
  const isFeatured = variant === "featured";
  const isLight = tone === "light";

  return (
    <div
      className={cn(
        "bg-gradient-cta relative mx-auto w-full max-w-7xl rounded-3xl px-6 py-8 sm:px-10 lg:px-16 lg:py-10",
        // The light panel swaps the white inner hairline for an ink one so
        // the frame stays visible on a white gradient.
        isLight ? "ring-1 ring-black/10 ring-inset" : "cta-panel-frame",
        isFeatured ? "overflow-hidden md:overflow-visible" : "overflow-hidden",
        className,
      )}
      style={style}
    >
      {/* Decorative "data substrate": grid (+ animated bloom on featured) + grain. */}
      <div
        aria-hidden="true"
        className="cta-grid pointer-events-none absolute inset-0 rounded-[inherit]"
      />
      {isFeatured ? (
        <div
          aria-hidden="true"
          className="cta-bloom pointer-events-none absolute inset-0 rounded-[inherit]"
        />
      ) : null}
      <div
        aria-hidden="true"
        className="cta-grain pointer-events-none absolute inset-0 rounded-[inherit]"
      />
      {typeof index === "number" ? (
        <span
          className={cn(
            "font-display absolute top-5 right-6 z-10 rounded-full border px-3 py-1 text-xs font-semibold tracking-widest tabular-nums",
            isLight
              ? "border-black/15 bg-black/5 text-black/60"
              : "border-white/20 bg-white/10 text-white/80",
          )}
        >
          {String(index).padStart(2, "0")}
        </span>
      ) : null}
      {isFeatured ? (
        <div className="relative z-10 grid items-center gap-10 md:grid-cols-[1.1fr_1fr] lg:gap-14">
          <Reveal className="order-last md:order-first">
            <CTAMediaPanel media={media} tone={tone} />
          </Reveal>
          <Reveal className="order-first md:order-last" delay={0.08}>
            <CTACopy
              align="start"
              body={body}
              cta={cta}
              eyebrow={eyebrow}
              proof={proof}
              title={title}
              tone={tone}
            />
          </Reveal>
        </div>
      ) : (
        <Reveal className="relative z-10 mx-auto w-full max-w-3xl">
          <CTACopy
            align="center"
            body={body}
            cta={cta}
            eyebrow={eyebrow}
            proof={proof}
            title={title}
            tone={tone}
          />
        </Reveal>
      )}
    </div>
  );
}

export function CTASection({ className, ...panelProps }: CTASectionProps) {
  return (
    <section
      className={cn(
        "bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-20",
        className,
      )}
    >
      <CTAPanel {...panelProps} />
    </section>
  );
}
