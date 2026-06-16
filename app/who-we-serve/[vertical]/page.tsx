import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CTASection } from "@/components/sections/CTASection";
import { FeatureBlock } from "@/components/sections/FeatureBlock";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { Badge } from "@/components/ui/badge";
import { getVertical, verticals } from "@/lib/config/marketing";
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
            <h2 className="h1 mt-4">
              The route template changes the framing, not the signal.
            </h2>
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
        subtitle={vertical.subtitle}
        title={vertical.title}
      />

      <SectionDivider surface="paper" />

      <VerticalFraming vertical={vertical} />

      <SectionDivider />

      <FeatureBlock
        body={vertical.proof}
        bullets={[...vertical.jobs]}
        className="bg-background py-18 lg:py-24"
        eyebrow={vertical.audience}
        heading="Make the live audience read practical for the team in the room."
        link={{ label: "See all verticals", href: "/who-we-serve" }}
      />

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Talk through the use case"
        secondaryCta={{ label: "View solutions", href: "/solutions" }}
        title={`Bring Hatchet into the ${vertical.label.toLowerCase()} workflow.`}
      />
    </main>
  );
}
