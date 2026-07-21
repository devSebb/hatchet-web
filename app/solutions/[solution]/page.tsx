import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CircuitDivider } from "@/components/sections/CircuitDivider";
import {
  CreatorLifecycleOrbital,
  LifecycleStationsRow,
} from "@/components/sections/CreatorLifecycleOrbital";
import { CTASection } from "@/components/sections/CTASection";
import { SolutionVisual } from "@/components/solutions/SolutionVisual";
import { Button } from "@/components/ui/button";
import {
  getSolution,
  type ProductSolution,
  type SolutionFeature,
  type SolutionGroupIntro,
  solutions,
} from "@/lib/config/solutions";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

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

function CtaLink({
  cta,
  variant,
}: {
  cta: NonNullable<ProductSolution["secondaryCta"]>;
  variant?: "default" | "secondary";
}) {
  return (
    <Button asChild variant={variant}>
      {cta.external ? (
        <a href={cta.href} rel="noopener noreferrer" target="_blank">
          {cta.label}
        </a>
      ) : (
        <Link href={cta.href}>{cta.label}</Link>
      )}
    </Button>
  );
}

/** Navy-gradient hero following the mockups: stage eyebrow with the route
 *  path, display title, sub, CTA pair, then a stat strip. The right column is
 *  the lifecycle orbital resting on this page's stage. */
function SolutionHero({ solution }: { solution: ProductSolution }) {
  // Bottom padding is the canvas for the gradient's blue→white tail; keep it
  // in sync with --hero-gradient-compact's stops. Kept modest so the first
  // feature section sits close under the hero rather than far down the page.
  return (
    <section className="relative w-full px-4 pt-6 pb-28 sm:px-6 lg:px-8 lg:pt-8 lg:pb-44">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="max-w-4xl">
          <p className="eyebrow text-white/70">{solution.eyebrow}</p>
          <h1 className="display mt-4" style={{ color: "var(--white)" }}>
            {solution.title}
          </h1>
          <p className="body-lg mt-5 max-w-3xl text-white/75">
            {solution.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink cta={solution.primaryCta} variant="default" />
            {solution.secondaryCta ? (
              <CtaLink cta={solution.secondaryCta} variant="secondary" />
            ) : null}
          </div>
          {solution.heroStats ? (
            <dl className="mt-12 flex flex-wrap gap-x-[40px] gap-y-[20px]">
              {solution.heroStats.map((stat) => (
                <div
                  className="border-signal border-l-2 pl-[14px]"
                  key={stat.label}
                >
                  <dd className="font-display text-3xl font-bold text-white tabular-nums">
                    {stat.value}
                  </dd>
                  <dt className="eyebrow mt-[4px] text-white/60">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        {/* Lifecycle orbital, resting on this page's stage. Interactive (the
            stations link across solutions), so not aria-hidden. */}
        <div className="hidden lg:block">
          <CreatorLifecycleOrbital
            defaultStageHref={solution.href}
            variant="canvas"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureHeader({
  feature,
  index,
}: {
  feature: SolutionFeature;
  index: number;
}) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow text-muted">
        <span className="text-signal font-mono">
          {String(index).padStart(2, "0")}
        </span>{" "}
        — {feature.name}
      </p>
      <h2 className="h1 mt-4">{feature.headline}</h2>
      {feature.body.map((paragraph) => (
        <p className="body-lg text-muted mt-5" key={paragraph.slice(0, 32)}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function SubFeatureGrid({ feature }: { feature: SolutionFeature }) {
  if (!feature.subFeatures?.length) {
    return null;
  }

  return (
    <>
      <Stagger className="mt-12 grid gap-10 md:grid-cols-2">
        {feature.subFeatures.map((sub) => (
          <article key={sub.name}>
            <p className="eyebrow text-muted">{sub.name}</p>
            <h3 className="h3 mt-3">{sub.headline}</h3>
            <p className="body text-muted mt-3">{sub.body}</p>
          </article>
        ))}
      </Stagger>
      <CircuitDivider className="mt-16" pulseDelaySeconds={-2.5} />
    </>
  );
}

/** One numbered feature section. "stacked" runs copy → full-width visual →
 *  sub-feature grid (wide tables); "split" is a two-column block whose visual
 *  alternates sides down the page. A feature with no visual is copy-only. */
function FeatureSection({
  feature,
  index,
  splitIndex,
}: {
  feature: SolutionFeature;
  index: number;
  splitIndex: number;
}) {
  const isStacked = feature.layout === "stacked";

  if (!feature.visual) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <FeatureHeader feature={feature} index={index} />
        </Reveal>
        <SubFeatureGrid feature={feature} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {isStacked ? (
        <>
          <Reveal>
            <FeatureHeader feature={feature} index={index} />
          </Reveal>
          <Reveal className="mt-10" delay={0.08}>
            <SolutionVisual visual={feature.visual} />
          </Reveal>
          <SubFeatureGrid feature={feature} />
        </>
      ) : (
        <>
          <div
            className={cn(
              "grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14",
              splitIndex % 2 === 1 && "lg:[&>*:first-child]:order-2",
            )}
          >
            <Reveal>
              <FeatureHeader feature={feature} index={index} />
            </Reveal>
            <Reveal delay={0.08}>
              <SolutionVisual visual={feature.visual} />
            </Reveal>
          </div>
          <SubFeatureGrid feature={feature} />
        </>
      )}
    </div>
  );
}

function GroupHeading({
  group,
  intro,
  withDivider = true,
}: {
  group: string;
  intro?: SolutionGroupIntro;
  /** Off for the first section — the hero gradient already separates it. */
  withDivider?: boolean;
}) {
  return (
    <Reveal className="mx-auto w-full max-w-7xl">
      {withDivider ? <CircuitDivider className="mb-8" /> : null}
      <div>
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="bg-signal h-[14px] w-[4px]" />
          <p className="eyebrow text-foreground">{group}</p>
        </div>
        {intro ? (
          <div className="mt-5 max-w-3xl">
            <h2 className="h2">{intro.headline}</h2>
            <p className="body-lg text-muted mt-4">{intro.body}</p>
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}

/** The PDF's "Looking For One Tool That Does It All?" lifecycle cross-sell,
 *  rendered under the closing CTA. In place of prose, it surfaces the four
 *  lifecycle stations from the home page's orbital as a row of links so each
 *  stage points straight at its solution page. */
function CrossSellNote({
  crossSell,
}: {
  crossSell: NonNullable<ProductSolution["closingCta"]["crossSell"]>;
}) {
  return (
    <section className="bg-background px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
      <Reveal className="mx-auto max-w-6xl text-center">
        <p className="h3 text-[1.875rem] text-signal">{crossSell.title}</p>
        <LifecycleStationsRow className="mt-5 text-left" />
      </Reveal>
    </section>
  );
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { solution: slug } = await params;
  const solution = getSolution(slug);

  if (!solution) {
    notFound();
  }

  // Split sections alternate their visual side; sections without a split visual
  // (stacked or copy-only) don't count.
  let splitCount = 0;

  return (
    <main className="bg-background text-foreground">
      {/* Same navy→white gradient treatment as the home hero; the fade
          resolves to paper before the first feature section. */}
      <div
        className="relative isolate overflow-hidden"
        style={{ backgroundImage: "var(--hero-gradient-compact)" }}
      >
        <SolutionHero solution={solution} />
      </div>

      {solution.features.map((feature, index) => {
        const previousGroup = solution.features[index - 1]?.group;
        const showGroup = feature.group && feature.group !== previousGroup;
        const splitIndex =
          feature.layout === "stacked" || !feature.visual ? 0 : splitCount++;

        return (
          <section
            className={cn(
              "surface-paper bg-background px-4 sm:px-6 lg:px-8",
              index === 0 ? "pt-8 pb-16 lg:pt-12 lg:pb-24" : "pb-16 lg:pb-24",
            )}
            key={feature.name}
          >
            {showGroup ? (
              <div className="mb-10">
                <GroupHeading
                  group={feature.group as string}
                  intro={feature.groupIntro}
                  withDivider={index !== 0}
                />
              </div>
            ) : null}
            <FeatureSection
              feature={feature}
              index={index + 1}
              splitIndex={splitIndex}
            />
          </section>
        );
      })}

      <CTASection
        body={solution.closingCta.subtitle}
        className={cn(
          "py-18 lg:py-24",
          solution.closingCta.crossSell && "pb-10 lg:pb-14",
        )}
        cta={solution.closingCta.cta}
        title={solution.closingCta.headline}
      />
      {solution.closingCta.crossSell ? (
        <CrossSellNote crossSell={solution.closingCta.crossSell} />
      ) : null}
    </main>
  );
}
