import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { CompanyLogo } from "@/components/brand/CompanyLogo";
import {
  Broadcast,
  ChartBar,
  type IsoIcon,
  RocketLaunch,
  Sword,
  Users,
} from "@/components/icons/iso-icons";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CircuitDivider } from "@/components/sections/CircuitDivider";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { resolveLogoSet } from "@/lib/brand/logos";
import { getVertical, verticals } from "@/lib/config/marketing";
import { siteConfig } from "@/lib/config/site";
import { createMetadata } from "@/lib/seo";

type Vertical = NonNullable<ReturnType<typeof getVertical>>;

// Same slug → iso-icon pairing as the home page's "Apply Our Data" use-case
// tiles, surfaced large in each vertical's hero.
const verticalIcons: Record<string, IsoIcon> = {
  brands: Broadcast,
  "games-publishers": RocketLaunch,
  "market-research-agencies": ChartBar,
  "esports-organizers": Sword,
  "marketing-and-talent-agencies": Users,
};

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

function VerticalMedia({
  vertical,
  className,
}: {
  vertical: Vertical;
  className?: string;
}) {
  return (
    <div className={className}>
      <Image
        alt={vertical.media.alt}
        className="ring-border/40 h-auto w-full rounded-xl shadow-[0_40px_80px_-24px_rgba(2,6,23,0.55)] ring-1"
        height={vertical.media.height}
        priority
        sizes="(min-width: 1280px) 80rem, 100vw"
        src={vertical.media.src}
        width={vertical.media.width}
      />
    </div>
  );
}

// Numbered value points as a card row — the core "why this vertical" read,
// straight from the approved copy deck. Same recipe as the home page's "Apply
// Our Data" use-case grid, and on paper like it: the hero gradient above
// resolves to paper at its bottom edge, so this section catches it.
function VerticalPoints({ vertical }: { vertical: Vertical }) {
  return (
    <section className="surface-paper bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <Stagger
          childClassName="h-full"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {vertical.points.map((point, index) => (
            <div
              className="border-border bg-card flex h-full flex-col rounded-2xl border p-7 shadow-sm"
              key={point.title}
            >
              <span
                className="shadow-glow-brand flex size-12 items-center justify-center rounded-xl font-mono text-2xl font-semibold text-white tabular-nums"
                style={{
                  // All-red gradient, matching the home page use-case tiles.
                  backgroundImage:
                    "linear-gradient(120deg, var(--brand-lowlight) 0%, var(--brand) 42%, var(--brand) 68%, #e23c42 100%)",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display mt-6 text-xl font-semibold tracking-[-0.01em]">
                {point.title}
              </h3>
              <p className="body text-muted mt-3 flex-1">{point.body}</p>
            </div>
          ))}
        </Stagger>

        <Reveal delay={0.08}>
          <VerticalMedia className="mt-12 lg:mt-16" vertical={vertical} />
        </Reveal>
      </div>
    </section>
  );
}

// Proof band: the vertical's reference names plus (when we have one) the
// customer quote that carries the page. A band renders as logos only once every
// name in it has a mark — mixing images with text reads uneven — so verticals
// still missing a brand kit stay text until lib/brand/logos.ts catches up.
function VerticalProof({ vertical }: { vertical: Vertical }) {
  const proofLogos = resolveLogoSet(vertical.proof.names);

  return (
    <section className="surface-paper bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-7xl text-center">
        <Reveal>
          <p className="eyebrow text-muted mx-auto max-w-3xl">
            {vertical.proof.eyebrow}
          </p>
          {vertical.proof.names.length > 0 ? (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
              {proofLogos
                ? proofLogos.map((slug) => (
                    <CompanyLogo
                      className="text-foreground"
                      key={slug}
                      slug={slug}
                    />
                  ))
                : vertical.proof.names.map((name) => (
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
      {/* Same navy→white gradient treatment as the solutions hero; the fade
          resolves to paper before the points section below. */}
      <div
        className="relative isolate overflow-hidden"
        style={{ backgroundImage: "var(--hero-gradient-compact)" }}
      >
        <PageHeader
          aside={(() => {
            const Icon = verticalIcons[vertical.slug];
            return Icon ? (
              <Icon
                aria-hidden="true"
                className="size-[280px] drop-shadow-[0_24px_48px_rgba(2,6,23,0.45)]"
              />
            ) : null;
          })()}
          eyebrow={vertical.label}
          primaryCta={{ label: "Book a Demo", href: siteConfig.bookDemoUrl }}
          secondaryCta={{
            label: "See It In Action",
            href: "https://www.youtube.com/watch?v=XtzwA_VLr1o",
            external: true,
          }}
          subtitle={vertical.subtitle}
          surface="gradient"
          title={vertical.title}
        />
      </div>

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
