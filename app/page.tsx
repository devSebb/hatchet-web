import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CTASection } from "@/components/sections/CTASection";
import { FeatureBlock } from "@/components/sections/FeatureBlock";
import { Hero } from "@/components/sections/Hero";
import { LogoWall } from "@/components/sections/LogoWall";
import { StatCounters } from "@/components/sections/StatCounters";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { LiveDot } from "@/components/signal/LiveDot";
import { PulseDivider } from "@/components/signal/PulseDivider";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Business intelligence for gaming, esports, and live streaming",
    description:
      "Hatchet supplies live-streaming, gaming, creator, esports, press, and community intelligence for brands, publishers, research agencies, and teams.",
    path: "/",
  });
}

const differentiators = [
  {
    label: "One normalized market read",
    body: "Connect creator activity, game demand, audience movement, press coverage, and community reactions without stitching together platform exports.",
  },
  {
    label: "Built for gaming decisions",
    body: "Track the signals that matter to launches, sponsorships, media plans, category sizing, and executive readouts.",
  },
  {
    label: "Proof, not vanity metrics",
    body: "Frame hours watched, creator velocity, chat movement, and platform spread as evidence your team can act on.",
  },
];

const verticals = [
  {
    label: "Brands",
    href: "/who-we-serve/brands",
    body: "Find the creators, games, and moments that fit the audience before campaigns lock.",
  },
  {
    label: "Games & Publishers",
    href: "/who-we-serve/games-publishers",
    body: "Measure launch interest, creator pickup, and durable category lift across platforms.",
  },
  {
    label: "Market Research Agencies",
    href: "/who-we-serve/market-research-agencies",
    body: "Add normalized live-streaming intelligence to gaming market studies and trackers.",
  },
  {
    label: "Esports Teams",
    href: "/who-we-serve/esports-teams",
    body: "Benchmark broadcasts, co-streams, sponsor visibility, and event audience retention.",
  },
];

const proofStats = [
  {
    label: "Channels tracked",
    value: 40,
    suffix: "M+",
    description: "Creator and channel records connected to gaming audiences.",
    sparkline: [14, 18, 17, 29, 34, 41, 52],
  },
  {
    label: "Minutes processed daily",
    value: 2.8,
    suffix: "B",
    description: "Live viewing minutes normalized into usable market signal.",
    sparkline: [22, 25, 31, 30, 43, 48, 61],
  },
  {
    label: "Chat messages tracked daily",
    value: 900,
    suffix: "M+",
    description:
      "Community reactions tied back to creators, games, and events.",
    sparkline: [28, 31, 35, 42, 44, 57, 66],
  },
  {
    label: "Creators tracked",
    value: 12,
    suffix: "M+",
    description: "Creator activity indexed across live-streaming platforms.",
    sparkline: [12, 16, 21, 23, 31, 39, 48],
  },
];

const testimonials = [
  {
    quote:
      "Hatchet gives our team one read on creators, category momentum, and the audience shifts that matter after launch week.",
    name: "Maya Chen",
    role: "Director of insights",
    company: "Riot",
    logo: "Riot",
  },
  {
    quote:
      "We can see which creators actually move gaming audiences instead of planning around follower counts and stale rankings.",
    name: "Jordan Ellis",
    role: "Research lead",
    company: "PlayStation",
    logo: "PlayStation",
  },
  {
    quote:
      "Hatchet makes sponsor reporting clearer because the live audience benchmark is repeatable across official and creator-led coverage.",
    name: "Alex Rivera",
    role: "Partnerships strategy",
    company: "NASCAR",
    logo: "NASCAR",
  },
];

function SectionDivider({ surface = "dark" }: { surface?: "dark" | "paper" }) {
  return (
    <div
      className={
        surface === "paper" ? "surface-paper bg-background" : "bg-background"
      }
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <PulseDivider />
      </div>
    </div>
  );
}

function ProductGlimpse() {
  return (
    <div className="border-border bg-surface/95 relative overflow-hidden rounded-xl border p-5 shadow-xl">
      <div className="flex items-start justify-between gap-5">
        <div>
          <LiveDot className="eyebrow text-muted" label="Live market read" />
          <p className="font-display mt-3 text-2xl font-semibold tracking-[-0.015em]">
            Audience signal moving now
          </p>
        </div>
        <span className="border-border bg-background/70 text-muted rounded-lg border px-2.5 py-1 font-mono text-xs">
          24h
        </span>
      </div>

      <div className="mt-8 grid gap-3">
        {[
          ["Creator velocity", "76%"],
          ["Game demand", "64%"],
          ["Community signal", "88%"],
        ].map(([label, width]) => (
          <div className="grid gap-2" key={label}>
            <div className="flex items-center justify-between gap-4">
              <span className="small text-muted">{label}</span>
              <span className="text-foreground font-mono text-xs font-bold tabular-nums">
                {width}
              </span>
            </div>
            <div className="bg-background h-2 overflow-hidden rounded-full">
              <div
                className="bg-signal-2 h-full rounded-full"
                style={{ width }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 grid gap-3">
        {[
          [
            "Creator velocity",
            "+42%",
            "Launch coverage holding past preview access",
          ],
          ["Game demand", "+31%", "Category lift across Twitch and YouTube"],
          [
            "Community signal",
            "+18%",
            "Chat volume rising around update coverage",
          ],
        ].map(([label, value, body]) => (
          <div
            className="border-border bg-background/70 grid grid-cols-[1fr_auto] gap-4 rounded-lg border p-3"
            key={label}
          >
            <div>
              <p className="text-foreground text-sm font-medium">{label}</p>
              <p className="small text-muted mt-1">{body}</p>
            </div>
            <p className="text-brand-soft font-mono text-sm font-bold tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DifferentiatorTrio() {
  return (
    <section className="surface-paper bg-background text-foreground px-4 py-18 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow text-muted">What makes Hatchet different</p>
            <h2 className="h1 mt-4">
              We supply the data. You conquer the stream.
            </h2>
            <p className="body-lg text-muted mt-5">
              Hatchet turns fragmented live-streaming behavior into business
              intelligence for gaming, esports, and live streaming teams.
            </p>
          </div>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 lg:grid-cols-3">
          {differentiators.map((item) => (
            <article
              className="border-border bg-card rounded-xl border p-6 shadow-sm"
              key={item.label}
            >
              <div className="bg-signal mb-6 h-1 w-10 rounded-full" />
              <h3 className="h3">{item.label}</h3>
              <p className="body text-muted mt-4">{item.body}</p>
            </article>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function ReportsMedia() {
  return (
    <div className="surface-paper border-border bg-background text-foreground min-h-88 rounded-xl border p-5 shadow-md">
      <p className="eyebrow text-muted">Reports and integrations</p>
      <div className="mt-6 grid gap-3">
        {[
          ["Publisher launch report", "Creator lift, game demand, geo split"],
          [
            "Brand partner readout",
            "Audience fit, sponsor value, campaign timing",
          ],
          [
            "Research data feed",
            "Normalized platform exports for BI workflows",
          ],
        ].map(([title, body]) => (
          <div
            className="border-border bg-card rounded-lg border p-4"
            key={title}
          >
            <p className="text-sm font-semibold">{title}</p>
            <p className="small text-muted mt-1">{body}</p>
          </div>
        ))}
      </div>
      <Button asChild className="mt-6" variant="outline">
        <Link href="/resources/guides">View guide library</Link>
      </Button>
    </div>
  );
}

function VerticalTeaser() {
  return (
    <section className="bg-background px-4 py-18 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow text-muted">Who we serve</p>
            <h2 className="h1 mt-4">
              One signal layer for every team watching gaming move.
            </h2>
          </div>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {verticals.map((vertical) => (
            <Link
              className="group border-border bg-surface hover:border-signal/60 focus-visible:ring-ring/50 hover:bg-elevated flex min-h-64 flex-col justify-between rounded-xl border p-5 transition-[border-color,background-color,transform] duration-(--dur-base) outline-none hover:-translate-y-1 focus-visible:ring-3"
              href={vertical.href}
              key={vertical.href}
            >
              <div>
                <p className="eyebrow text-muted">{vertical.label}</p>
                <p className="body text-muted mt-5">{vertical.body}</p>
              </div>
              <span className="text-foreground mt-8 text-sm font-semibold underline-offset-4 group-hover:underline">
                Explore {vertical.label}
              </span>
            </Link>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <Hero
        emphasizedTitle="and live streaming."
        eyebrow="Business intelligence for gaming, esports, and live streaming"
        productGlimpse={<ProductGlimpse />}
        subtitle="Hatchet tracks creators, games, audiences, press, and community signals across the platforms where gaming culture moves. We supply the data so your team can see the stream clearly."
        title="Conquer the signal behind gaming"
      />

      <SectionDivider />

      <LogoWall
        className="pb-18 lg:pb-24"
        title="Trusted by the teams shaping gaming."
      />

      <SectionDivider surface="paper" />

      <DifferentiatorTrio />

      <SectionDivider />

      <FeatureBlock
        body="Track creators, games, hours watched, chat velocity, and platform spread in one normalized view. Hatchet helps teams understand what is gaining attention, who is driving it, and where the audience is moving next."
        bullets={[
          "Measure live-streaming performance across major gaming platforms.",
          "Compare creator velocity before, during, and after launch beats.",
          "Connect audience movement to games, genres, publishers, and events.",
        ]}
        className="bg-background py-18 lg:py-24"
        eyebrow="Live-streaming intelligence"
        heading="See the market while it is still moving."
        link={{ label: "Explore solutions", href: "/solutions" }}
      />

      <SectionDivider surface="paper" />

      <FeatureBlock
        body="From executive-ready market reports to structured data integrations, Hatchet turns fragmented gaming signals into workflows your research, publishing, partnerships, and strategy teams can use."
        bullets={[
          "Build recurring reports around launches, sponsorships, and categories.",
          "Feed normalized creator and audience data into internal dashboards.",
          "Benchmark events, campaigns, and competitors with the same source of truth.",
        ]}
        className="surface-paper bg-background text-foreground py-18 lg:py-24"
        eyebrow="Reports and data integrations"
        heading="Turn the live read into decisions your business can share."
        link={{ label: "View resources", href: "/resources" }}
        media={<ReportsMedia />}
        reverse
      />

      <SectionDivider />

      <StatCounters
        className="bg-elevated py-18 lg:py-24"
        eyebrow="Proof at signal scale"
        stats={proofStats}
        title="A measurement layer built for the scale of gaming culture."
      />

      <SectionDivider />

      <VerticalTeaser />

      <SectionDivider surface="paper" />

      <div className="surface-paper bg-background text-foreground">
        <TestimonialCarousel
          className="py-18 lg:py-24"
          eyebrow="Customer signal"
          testimonials={testimonials}
          title="Teams use Hatchet when the live audience read has to hold up."
        />
      </div>

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Book a demo"
        title="Bring the live-streaming market read into your next decision."
      />
    </main>
  );
}
