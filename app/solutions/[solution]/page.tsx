import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CTASection } from "@/components/sections/CTASection";
import { LogoWall } from "@/components/sections/LogoWall";
import { PageHeader } from "@/components/sections/PageHeader";
import {
  getSolution,
  type ProductSolution,
  solutions,
} from "@/lib/config/solutions";
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
    title: `${solution.name}: ${solution.title}`,
    description: solution.metaDescription,
    path: solution.href,
  });
}

const trustedLogos = [
  {
    name: "Riot Games",
    src: "/images/logos/riot-games.png",
  },
  {
    name: "YouTube",
    src: "/images/logos/youtube.png",
  },
  {
    name: "Microsoft",
    src: "/images/logos/microsoft.png",
  },
  {
    name: "NASCAR",
    src: "/images/logos/nascar.png",
  },
  {
    name: "Activision Blizzard",
    src: "/images/logos/blizzard.png",
  },
  {
    name: "PlayStation",
    src: "/images/logos/sony.png",
  },
] satisfies { name: string; src?: string }[];

function CapabilitiesSection({ solution }: { solution: ProductSolution }) {
  return (
    <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow text-muted">Capabilities</p>
            <h2 className="h1 mt-4">
              What {solution.name.toLowerCase()} helps your team do.
            </h2>
            <p className="body-lg text-muted mt-5">{solution.bodyNote}</p>
          </div>
        </Reveal>

        <Stagger
          childClassName="h-full"
          className="mt-10 grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {solution.capabilities.map((capability) => (
            <article
              className="border-border bg-card hover:border-signal/60 h-full rounded-xl border p-6 shadow-sm transition-[border-color,transform,box-shadow] duration-(--dur-base) hover:-translate-y-1 hover:shadow-md"
              key={capability.title}
            >
              <div className="bg-signal mb-6 h-1 w-10 rounded-full" />
              <h2 className="h3">{capability.title}</h2>
              <p className="body text-muted mt-4">{capability.description}</p>
            </article>
          ))}
        </Stagger>

        {solution.slug === "intelligence" ? (
          <Reveal>
            <div className="border-border bg-card mt-6 rounded-xl border p-6 shadow-sm">
              <p className="body text-muted">
                Looking for access levels?{" "}
                <Link
                  className="text-foreground font-semibold underline-offset-4 hover:underline"
                  href="/pricing"
                >
                  View pricing options
                </Link>{" "}
                instead of sorting tiers on the product page.
              </p>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

function WhySection({ solution }: { solution: ProductSolution }) {
  return (
    <section className="bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow text-muted">Why it works</p>
            <h2 className="h1 mt-4">
              Built for teams that need a defensible market read.
            </h2>
          </div>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
          {solution.why.map((item) => (
            <article
              className="border-border bg-elevated rounded-xl border p-6 shadow-sm"
              key={item.title}
            >
              <h2 className="h3">{item.title}</h2>
              <p className="body text-muted mt-4">{item.description}</p>
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
      {/* Shared navy→white background bleeds from the page header across into
          the trusted-by band, so the blend resolves to white only once it
          reaches the logo wall. Both stay transparent; this wrapper owns the
          gradient. Mirrors the home hero. */}
      <div
        className="relative isolate overflow-hidden"
        style={{ backgroundImage: "var(--hero-gradient-compact)" }}
      >
        <PageHeader
          eyebrow={solution.eyebrow}
          primaryCta={solution.primaryCta}
          secondaryCta={solution.secondaryCta}
          subtitle={solution.subtitle}
          surface="gradient"
          title={solution.title}
        />

        <LogoWall
          className="surface-paper pt-14 pb-16 lg:pt-24 lg:pb-20"
          eyebrow="Trusted by market leaders"
          logos={trustedLogos}
          title="Trusted by Riot, YouTube, Microsoft, NASCAR, Activision Blizzard, and PlayStation."
        />
      </div>

      <CapabilitiesSection solution={solution} />

      <WhySection solution={solution} />

      <CTASection
        className="py-18 lg:py-24"
        cta={solution.primaryCta}
        eyebrow="Book a demo"
        title={`See how ${solution.name.toLowerCase()} can fit your team.`}
      />
    </main>
  );
}
