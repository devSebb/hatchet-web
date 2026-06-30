import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CTASection } from "@/components/sections/CTASection";
import { FeatureBlock } from "@/components/sections/FeatureBlock";
import { PageHeader } from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Pricing",
    description:
      "Hatchet pricing is shaped around team needs, data scope, reporting workflows, and live-streaming intelligence use cases.",
    path: "/pricing",
  });
}

const pricingMode =
  process.env.NEXT_PUBLIC_PRICING_MODE === "tiers" ? "tiers" : "contact";

const tierCards = [
  {
    name: "Signal",
    body: "For teams starting with creator, game, and audience discovery.",
    inclusions: ["Market overview", "Creator shortlists", "Launch snapshots"],
  },
  {
    name: "Intelligence",
    body: "For teams running recurring planning, launch, and reporting workflows.",
    inclusions: ["Custom reporting", "Competitive benchmarks", "Team seats"],
  },
  {
    name: "Enterprise",
    body: "For organizations that need custom data access and deeper support.",
    inclusions: ["Data integrations", "Research support", "Custom scopes"],
  },
] as const;

function ContactSalesPricing() {
  return (
    <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <Reveal>
          <div>
            <p className="eyebrow text-muted">Contact sales</p>
            <h2 className="h1 mt-4">
              Pricing follows the scope of the signal.
            </h2>
            <p className="body-lg text-muted mt-5">
              Hatchet engagements can include platform coverage, custom
              reporting, research support, data integrations, and team-specific
              workflows. The pricing template starts with a conversation so the
              final model can match the work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/solutions">Explore solutions</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/who-we-serve">Find your team</Link>
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
            <p className="eyebrow text-muted">What shapes scope</p>
            <ul className="mt-6 grid gap-4">
              {[
                "Markets, platforms, games, and creator coverage.",
                "Recurring reports, custom studies, or data integration needs.",
                "Teams, stakeholders, and decision cycles supported.",
                "Launch, sponsorship, research, or esports workflows.",
              ].map((item) => (
                <li className="flex gap-3 text-sm" key={item}>
                  <span
                    aria-hidden="true"
                    className="bg-signal mt-2 size-1.5 shrink-0 rounded-full"
                  />
                  <span className="text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TierPricing() {
  return (
    <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <Stagger className="grid gap-4 lg:grid-cols-3">
          {tierCards.map((tier) => (
            <article
              className="border-border bg-card rounded-xl border p-6 shadow-sm"
              key={tier.name}
            >
              <p className="eyebrow text-muted">{tier.name}</p>
              <h2 className="h3 mt-4">{tier.body}</h2>
              <ul className="mt-6 grid gap-3">
                {tier.inclusions.map((item) => (
                  <li className="text-muted text-sm" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Pricing"
        subtitle="Hatchet pricing is built around the scope of the signal you need — the markets and platforms you track, the reporting you run, and the teams you support. Start with a conversation and we will shape it to fit."
        title="Pricing shaped around your market questions."
      />

      {pricingMode === "tiers" ? <TierPricing /> : <ContactSalesPricing />}

      <FeatureBlock
        body="A brand sponsorship team, a publisher launch team, and a research agency often need the same market signal in different shapes. Hatchet packages coverage, reporting, and data access around the way your team actually makes decisions."
        bullets={[
          "Start with the markets, platforms, and games you need to track.",
          "Scale from self-serve dashboards to analyst-built reports and data integrations.",
          "Add seats, research support, and custom scopes as your needs grow.",
        ]}
        className="bg-background py-18 lg:py-24"
        eyebrow="Flexible model"
        heading="Pricing that scales with the questions you're asking."
      />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Talk pricing"
        media={{
          src: "/images/hero-dashboard.png",
          alt: "Hatchet dashboard showing live-streaming analytics across platforms",
          width: 2000,
          height: 1143,
        }}
        proof={{
          kind: "pills",
          items: ["Creator discovery", "Campaign tracking", "ROI measurement"],
        }}
        title="Talk with Hatchet about the right market intelligence scope."
        variant="featured"
      />
    </main>
  );
}
