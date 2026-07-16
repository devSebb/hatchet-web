import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CircuitDivider } from "@/components/sections/CircuitDivider";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { getVertical, verticals } from "@/lib/config/marketing";
import { siteConfig } from "@/lib/config/site";
import { createMetadata } from "@/lib/seo";

type Vertical = NonNullable<ReturnType<typeof getVertical>>;

type VerticalPageProps = {
  params: Promise<{
    vertical: string;
  }>;
};

export function generateStaticParams() {
  return verticals.map((vertical) => ({
    vertical: vertical.slug,
  }));
}

export async function generateMetadata({
  params,
}: VerticalPageProps): Promise<Metadata> {
  const { vertical: slug } = await params;
  const vertical = getVertical(slug);

  if (!vertical) {
    notFound();
  }

  return createMetadata({
    title: vertical.label,
    description: vertical.subtitle,
    path: vertical.href,
  });
}

// Brands-only flourish: headline lift metrics as a clean, container-less row
// sitting above the product mockup.
const BRAND_PROOF_METRICS = [
  { label: "Creator lift", value: "+28%" },
  { label: "Game demand", value: "+42%" },
  { label: "Press movement", value: "+56%" },
] as const;

function VerticalMedia({ vertical }: { vertical: Vertical }) {
  return (
    <div className="lg:scale-[1.08]">
      {vertical.slug === "brands" ? (
        <div className="mb-3 flex flex-wrap justify-center gap-x-12 gap-y-6">
          {BRAND_PROOF_METRICS.map((metric) => (
            <div className="text-center" key={metric.label}>
              <p className="text-foreground font-mono text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                {metric.value}
              </p>
              <p className="small text-muted mt-1.5">{metric.label}</p>
            </div>
          ))}
        </div>
      ) : null}
      <Image
        alt={vertical.media.alt}
        className="h-auto w-full rounded-xl shadow-[0_40px_80px_-24px_rgba(2,6,23,0.55)] ring-1 ring-border/40"
        height={vertical.media.height}
        priority
        sizes="(min-width: 1024px) 42rem, 100vw"
        src={vertical.media.src}
        width={vertical.media.width}
      />
    </div>
  );
}

// Numbered value points beside the product visual — the core "why this vertical"
// read, straight from the approved copy deck.
function VerticalPoints({ vertical }: { vertical: Vertical }) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Stagger className="grid gap-8">
          {vertical.points.map((point, index) => (
            <div className="flex gap-5" key={point.title}>
              <span className="border-border bg-card text-brand flex size-[44px] shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-semibold tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="h3">{point.title}</h3>
                <p className="body text-muted mt-3">{point.body}</p>
              </div>
            </div>
          ))}
        </Stagger>

        <Reveal delay={0.08}>
          <VerticalMedia vertical={vertical} />
        </Reveal>
      </div>
    </section>
  );
}

// Proof band: the vertical's reference names plus (when we have one) the
// customer quote that carries the page. Names render as styled text — the repo
// only ships logo files for a subset, and mixing images with text reads uneven.
function VerticalProof({ vertical }: { vertical: Vertical }) {
  return (
    <section className="surface-paper bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-7xl text-center">
        <Reveal>
          <p className="eyebrow text-muted mx-auto max-w-3xl">
            {vertical.proof.eyebrow}
          </p>
          {vertical.proof.names.length > 0 ? (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
              {vertical.proof.names.map((name) => (
                <span
                  className="font-display text-muted/70 text-xl font-semibold tracking-tight sm:text-2xl"
                  key={name}
                >
                  {name}
                </span>
              ))}
            </div>
          ) : null}
        </Reveal>

        {vertical.testimonial ? (
          <Reveal delay={0.08}>
            <figure className="mx-auto mt-14 max-w-3xl">
              <span
                aria-hidden="true"
                className="font-display text-brand block text-5xl leading-none"
              >
                “
              </span>
              <blockquote className="font-display text-foreground mt-2 text-xl font-medium tracking-tight text-balance sm:text-2xl">
                {vertical.testimonial.quote}
              </blockquote>
              <figcaption className="mt-7">
                <p className="text-foreground text-sm font-semibold">
                  {vertical.testimonial.name}
                </p>
                <p className="small text-muted mt-1">
                  {vertical.testimonial.role}, {vertical.testimonial.company}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

export default async function VerticalPage({ params }: VerticalPageProps) {
  const { vertical: slug } = await params;
  const vertical = getVertical(slug);

  if (!vertical) {
    notFound();
  }

  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow={vertical.label}
        primaryCta={{ label: "Book a Demo", href: siteConfig.bookDemoUrl }}
        secondaryCta={{
          label: "See It In Action",
          href: "https://www.youtube.com/watch?v=XtzwA_VLr1o",
          external: true,
        }}
        subtitle={vertical.subtitle}
        title={vertical.title}
      />

      <VerticalPoints vertical={vertical} />

      <CircuitDivider />
      <VerticalProof vertical={vertical} />
      <CircuitDivider pulseDelaySeconds={-4.5} />

      <CTASection
        body={vertical.closingCta.body}
        className="py-18 lg:py-24"
        cta={{ label: "Book a Demo", href: siteConfig.bookDemoUrl }}
        eyebrow="Get started"
        title={vertical.closingCta.title}
      />
    </main>
  );
}
