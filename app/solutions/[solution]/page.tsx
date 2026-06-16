import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CTASection } from "@/components/sections/CTASection";
import { FeatureBlock } from "@/components/sections/FeatureBlock";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { Badge } from "@/components/ui/badge";
import { getSolution, solutions } from "@/lib/config/marketing";
import { createMetadata } from "@/lib/seo";

type SolutionPageProps = {
  params: Promise<{
    solution: string;
  }>;
};

export function generateStaticParams() {
  return solutions.map((solution) => ({
    solution: solution.slug,
  }));
}

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const { solution: slug } = await params;
  const solution = getSolution(slug);

  if (!solution) {
    notFound();
  }

  return createMetadata({
    title: `${solution.label}: ${solution.title}`,
    description: solution.subtitle,
    path: solution.href,
  });
}

function SolutionProofCards({
  solution,
}: {
  solution: NonNullable<ReturnType<typeof getSolution>>;
}) {
  return (
    <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="max-w-3xl">
            <Badge variant="outline">{solution.capability}</Badge>
            <h2 className="h1 mt-5">
              The placeholder outcome this route will own.
            </h2>
            <p className="body-lg text-muted mt-5">{solution.proof}</p>
          </div>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
          {solution.bullets.map((bullet) => (
            <article
              className="border-border bg-card rounded-xl border p-6 shadow-sm"
              key={bullet}
            >
              <div className="bg-signal mb-6 h-1 w-10 rounded-full" />
              <p className="body text-muted">{bullet}</p>
            </article>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { solution: slug } = await params;
  const solution = getSolution(slug);

  if (!solution) {
    notFound();
  }

  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow={solution.label}
        signal
        subtitle={solution.subtitle}
        title={solution.title}
      />

      <SectionDivider surface="paper" />

      <SolutionProofCards solution={solution} />

      <SectionDivider />

      <FeatureBlock
        body={solution.body}
        bullets={[...solution.bullets]}
        className="bg-background py-18 lg:py-24"
        eyebrow={solution.capability}
        heading="Turn fragmented market movement into a focused workflow."
        link={{ label: "View pricing", href: "/pricing" }}
      />

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Next step"
        secondaryCta={{ label: "See all solutions", href: "/solutions" }}
        title={`Talk through ${solution.label.toLowerCase()} with Hatchet.`}
      />
    </main>
  );
}
