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
  "Creator, audience, and campaign intelligence for gaming teams, in one place.";

function ProofBlock({ proof }: { proof: CTAProof }) {
  if (proof.kind === "stat") {
    return (
      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold text-white tabular-nums">
          {proof.value}
        </span>
        <span className="text-sm text-white/80">{proof.label}</span>
      </div>
    );
  }

  if (proof.kind === "logos") {
    return (
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-white/80">
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
          className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white/90"
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
}: {
  eyebrow?: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
  proof?: CTAProof;
  align: "center" | "start";
}) {
  return (
    <div className={cn("max-w-xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? <p className="eyebrow text-white/70">{eyebrow}</p> : null}
      <h2 className="h2 mt-3 text-white">{title}</h2>
      <p className="body-lg mt-5 text-white/85">{body}</p>
      <div
        className={cn(
          "mt-8 flex flex-col gap-5 sm:flex-row sm:items-center",
          align === "center" && "sm:justify-center",
        )}
      >
        <Button asChild variant="inverse">
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
        {proof ? <ProofBlock proof={proof} /> : null}
      </div>
    </div>
  );
}

function CTAMediaPanel({ media }: { media?: CTAMedia }) {
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
        <div className="flex aspect-[16/10] items-center justify-center rounded-2xl border border-dashed border-white/25 bg-white/5">
          <span className="text-sm text-white/60">Product preview</span>
        </div>
      )}
    </div>
  );
}

type CTAPanelProps = CTAContentProps & {
  className?: string;
};

/**
 * The gradient CTA panel itself, without the section wrapper. The gradient is
 * the site-wide "Ember red" treatment defined by --gradient-cta & friends in
 * globals.css — retune it there so every CTA stays in step.
 */
export function CTAPanel({
  variant = "default",
  eyebrow,
  title = DEFAULT_TITLE,
  body = DEFAULT_BODY,
  cta = { label: "Book a demo", href: siteConfig.bookDemoUrl },
  proof,
  media,
  className,
}: CTAPanelProps) {
  const isFeatured = variant === "featured";

  return (
    <div
      className={cn(
        "bg-gradient-cta cta-panel-frame relative mx-auto w-full max-w-7xl rounded-3xl px-6 py-8 sm:px-10 lg:px-16 lg:py-10",
        isFeatured ? "overflow-hidden md:overflow-visible" : "overflow-hidden",
        className,
      )}
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
      {isFeatured ? (
        <div className="relative z-10 grid items-center gap-10 md:grid-cols-[1.1fr_1fr] lg:gap-14">
          <Reveal className="order-last md:order-first">
            <CTAMediaPanel media={media} />
          </Reveal>
          <Reveal className="order-first md:order-last" delay={0.08}>
            <CTACopy
              align="start"
              body={body}
              cta={cta}
              eyebrow={eyebrow}
              proof={proof}
              title={title}
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
