import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CTASection } from "@/components/sections/CTASection";
import { FeatureBlock } from "@/components/sections/FeatureBlock";
import { PageHeader } from "@/components/sections/PageHeader";
import { Badge } from "@/components/ui/badge";
import { getVertical, verticals } from "@/lib/config/marketing";
import { siteConfig } from "@/lib/config/site";
import { createMetadata } from "@/lib/seo";

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

// Verticals that suppress the generic framing headline (they read cleaner with
// just the "Audience, jobs, proof" label above the cards).
const HIDE_FRAMING_HEADING = new Set(["games-publishers", "market-research-agencies"]);

function VerticalFraming({
  vertical,
}: {
  vertical: NonNullable<ReturnType<typeof getVertical>>;
}) {
  return (
    <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow text-muted">Audience, jobs, proof</p>
            {HIDE_FRAMING_HEADING.has(vertical.slug) ? null : (
              <h2 className="h1 mt-4">
                Same signal, framed for the way your team works.
              </h2>
            )}
          </div>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 lg:grid-cols-3">
          <article className="border-border bg-card rounded-xl border p-6 shadow-sm">
            <Badge variant="outline">Audience</Badge>
            <h2 className="h3 mt-5">{vertical.audience}</h2>
            <p className="body text-muted mt-4">{vertical.subtitle}</p>
          </article>

          <article className="border-border bg-card rounded-xl border p-6 shadow-sm">
            <Badge variant="outline">Jobs to be done</Badge>
            <ul className="mt-5 grid gap-3">
              {vertical.jobs.map((job) => (
                <li className="flex gap-3 text-sm" key={job}>
                  <span
                    aria-hidden="true"
                    className="bg-signal mt-2 size-1.5 shrink-0 rounded-full"
                  />
                  <span className="text-muted">{job}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="border-border bg-card rounded-xl border p-6 shadow-sm">
            <Badge variant="outline">Proof</Badge>
            <h2 className="h3 mt-5">Evidence that can move across teams.</h2>
            <p className="body text-muted mt-4">{vertical.proof}</p>
          </article>
        </Stagger>
      </div>
    </section>
  );
}

// Brands-only proof panel: the headline lift metrics as a clean, container-less
// row sitting above a real product mockup.
const BRAND_PROOF_METRICS = [
  { label: "Creator lift", value: "+28%" },
  { label: "Game demand", value: "+42%" },
  { label: "Press movement", value: "+56%" },
] as const;

function BrandsProofMedia() {
  return (
    <div className="lg:scale-[1.08]">
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
      <Image
        alt="Hatchet dashboard tracking live creator and game audience movement"
        className="h-auto w-full rounded-xl shadow-[0_40px_80px_-24px_rgba(2,6,23,0.55)] ring-1 ring-border/40"
        height={1170}
        priority
        sizes="(min-width: 1024px) 42rem, 100vw"
        src="/images/product-mockup.png"
        width={2048}
      />
    </div>
  );
}

// The three numbered value points shown to brand teams. `takeaway` is the
// emphasized one-liner that closes a point (omitted where the copy has none).
const BRAND_POINTS = [
  {
    num: "01",
    title: "Know Your Audience Is There",
    body: "Pull audience overlap data showing how much of your target demo already watches gaming content, and which creators are already talking to them.",
    takeaway: "Lead with category-level data, not a hunch.",
  },
  {
    num: "02",
    title: "Vet Before You Spend",
    body: "Fake audience scoring flags inflated channels before a dollar of budget moves.",
    takeaway:
      "Brand safety and creator fit confirmed before outreach, not after the campaign underperforms.",
  },
  {
    num: "03",
    title: "Report In Language Leadership Trusts",
    body: "Translate a gaming activation into reach, brand lift, and sales correlation — not raw views or Twitch jargon.",
    takeaway: null,
  },
] as const;

// Brand names for the proof strip. Rendered as text — the repo only ships
// logos for a subset (NASCAR, Google, YouTube), so text keeps it consistent.
const BRAND_PROOF_NAMES = [
  "Nestlé",
  "NASCAR",
  "Google/YouTube",
  "Monumental Sports",
];

function BrandsVertical({
  vertical,
}: {
  vertical: NonNullable<ReturnType<typeof getVertical>>;
}) {
  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow={vertical.label}
        primaryCta={{ label: "Book a Demo", href: siteConfig.bookDemoUrl }}
        secondaryCta={{ label: "See It In Action", href: "/solutions/discovery" }}
        subtitle={vertical.subtitle}
        title={vertical.title}
      />

      {/* Numbered value points beside the live product mockup. */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Stagger className="grid gap-8">
            {BRAND_POINTS.map((point) => (
              <div className="flex gap-5" key={point.num}>
                <span className="border-border bg-card text-brand flex size-[44px] shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-semibold tabular-nums">
                  {point.num}
                </span>
                <div>
                  <h3 className="h3">{point.title}</h3>
                  <p className="body text-muted mt-3">{point.body}</p>
                  {point.takeaway ? (
                    <p className="body text-foreground mt-3 font-medium">
                      {point.takeaway}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </Stagger>

          <Reveal delay={0.08}>
            <BrandsProofMedia />
          </Reveal>
        </div>
      </section>

      {/* Proof — brands already entering gaming with Hatchet. */}
      <section className="border-border surface-paper bg-background border-y px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl text-center">
          <p className="eyebrow text-muted">Trusted by brands entering gaming</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
            {BRAND_PROOF_NAMES.map((name) => (
              <span
                className="font-display text-muted/70 text-xl font-semibold tracking-tight sm:text-2xl"
                key={name}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        body="Book a 30-minute demo — we'll pull the audience overlap data for your category."
        className="py-18 lg:py-24"
        cta={{ label: "Book a Demo", href: siteConfig.bookDemoUrl }}
        eyebrow="Get started"
        title="See if your audience is already here."
      />
    </main>
  );
}

export default async function VerticalPage({ params }: VerticalPageProps) {
  const { vertical: slug } = await params;
  const vertical = getVertical(slug);

  if (!vertical) {
    notFound();
  }

  // Brands gets a bespoke narrative (numbered points, brand proof strip, product
  // mockup); the other verticals share the generic framing template.
  if (vertical.slug === "brands") {
    return <BrandsVertical vertical={vertical} />;
  }

  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow={vertical.label}
        subtitle={vertical.subtitle}
        title={vertical.title}
      />

      <VerticalFraming vertical={vertical} />

      <FeatureBlock
        body={vertical.proof}
        bullets={[...vertical.jobs]}
        className="bg-background py-18 lg:py-24"
        eyebrow={vertical.audience}
        heading="Make the live audience read practical for the team in the room."
      />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Talk through the use case"
        title={`Bring Hatchet into the ${vertical.label.toLowerCase()} workflow.`}
      />
    </main>
  );
}
