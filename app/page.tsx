import type { Metadata } from "next";
import Link from "next/link";
import { Gamepad2Icon, ShieldCheckIcon, WorkflowIcon } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CreatorLifecycle } from "@/components/sections/CreatorLifecycle";
import { CTASection } from "@/components/sections/CTASection";
import { FeatureBlock } from "@/components/sections/FeatureBlock";
import { Hero } from "@/components/sections/Hero";
import { LogoWall } from "@/components/sections/LogoWall";
import { StatCounters } from "@/components/sections/StatCounters";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { PulseDivider } from "@/components/signal/PulseDivider";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Business intelligence for gaming, esports, and live streaming",
    description:
      "Hatchet supplies live-streaming, gaming, creator, esports, press, and community intelligence for brands, publishers, research agencies, and teams.",
    path: "/",
  });
}

const pillars = [
  {
    icon: WorkflowIcon,
    kicker: "Data + execution",
    title: "One Platform, Full Lifecycle",
    body: "From discovery to reporting — find the creator, run the campaign, and prove the ROI. All in one tool, with nothing stitched together.",
  },
  {
    icon: ShieldCheckIcon,
    kicker: "Verified precision",
    title: "The Data Nobody Else Has",
    body: "10 years of verified data from streaming and social across 30+ platforms. No estimates. No fake audiences — every number is real.",
  },
  {
    icon: Gamepad2Icon,
    kicker: "Native, not retrofitted",
    title: "Built for Gaming from Day One",
    body: "This isn't a generic analytics tool with a gaming skin. Hatchet was built for gaming from the inside out — never retrofitted to it.",
  },
];

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
    label: "Live platforms tracked",
    value: 20,
    suffix: "+",
    description:
      "Twitch, YouTube, Kick, and more — major and emerging platforms in one normalized view.",
    sparkline: [9, 11, 12, 14, 16, 18, 21],
  },
  {
    label: "History since 2016",
    value: 10,
    suffix: "+ yrs",
    description:
      "Minute-level viewership data going back to 2016, ready for trend and benchmark analysis.",
    sparkline: [3, 4, 5, 6, 7, 8, 10],
  },
  {
    label: "Data granularity",
    value: 1,
    suffix: "-min",
    description:
      "Every stream measured at one-minute resolution — the industry's highest standard.",
    sparkline: [12, 14, 13, 15, 16, 18, 20],
  },
  {
    label: "Core metrics tracked",
    value: 10,
    suffix: "+",
    description:
      "Hours watched, concurrent viewers, airtime, EMV, CPM, logo presence share, and more.",
    sparkline: [4, 5, 5, 7, 8, 9, 11],
  },
];

const testimonials = [
  {
    quote:
      "Hatchet gives our team one read on creators, category momentum, and the audience shifts that matter after launch week.",
    name: "Maya Chen",
    role: "Director of insights",
    company: "Riot Games",
    logo: "Riot Games",
    logoSrc: "/images/logos/riot-games.png",
  },
  {
    quote:
      "We can see which creators actually move gaming audiences instead of planning around follower counts and stale rankings.",
    name: "Jordan Ellis",
    role: "Research lead",
    company: "Microsoft",
    logo: "Microsoft",
    logoSrc: "/images/logos/microsoft.png",
  },
  {
    quote:
      "Hatchet makes sponsor reporting clearer because the live audience benchmark is repeatable across official and creator-led coverage.",
    name: "Alex Rivera",
    role: "Partnerships strategy",
    company: "NASCAR",
    logo: "NASCAR",
    logoSrc: "/images/logos/nascar.png",
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

function Pillars() {
  return (
    <section className="bg-background text-foreground relative isolate overflow-hidden px-4 py-18 sm:px-6 lg:px-8 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 -z-10 h-80 w-80 rounded-full bg-[var(--gradient-cta-glow)] blur-3xl"
      />
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow text-muted">Why Hatchet</p>
            <h2 className="h1 mt-4">
              Other tools make you choose.{" "}
              <span className="text-gradient-brand">Hatchet doesn&apos;t.</span>
            </h2>
            <p className="body-lg text-muted mt-5">
              One platform for the entire creator-marketing lifecycle, powered by
              verified gaming data — and built for gaming from day one.
            </p>
          </div>
        </Reveal>

        <Stagger className="mt-12 grid gap-5 lg:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;

            return (
              <article
                className="group border-border bg-surface relative overflow-hidden rounded-2xl border p-7 shadow-sm transition-[transform,border-color,box-shadow] duration-(--dur-base) hover:-translate-y-1 hover:border-brand/40 hover:shadow-glow-brand"
                key={pillar.title}
              >
                <span
                  aria-hidden="true"
                  className="font-display pointer-events-none absolute -top-3 right-5 text-7xl font-extrabold text-white/[0.04] select-none"
                >
                  {`0${index + 1}`}
                </span>
                <div className="bg-gradient-brand shadow-glow-brand flex size-12 items-center justify-center rounded-xl text-white">
                  <Icon aria-hidden="true" className="size-6" />
                </div>
                <p className="eyebrow text-brand-soft mt-6">{pillar.kicker}</p>
                <h3 className="font-display mt-2 text-xl font-semibold tracking-[-0.01em]">
                  {pillar.title}
                </h3>
                <p className="body text-muted mt-3">{pillar.body}</p>
              </article>
            );
          })}
        </Stagger>
      </div>
    </section>
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
    <section className="surface-paper bg-background px-4 py-18 sm:px-6 lg:px-8 lg:py-24">
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
              className="group border-border bg-card hover:border-brand/60 focus-visible:ring-ring/50 hover:bg-muted-surface flex min-h-64 flex-col justify-between rounded-xl border p-5 transition-[border-color,background-color,transform] duration-(--dur-base) outline-none hover:-translate-y-1 focus-visible:ring-3"
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
        emphasizedTitle="Across Socials and Streaming"
        image={{
          src: "/images/hero-dashboard.png",
          alt: "Hatchet Creator Discovery dashboard showing live-streaming analytics across platforms",
          width: 2000,
          height: 1143,
        }}
        primaryCta={{ label: "Book a Demo", href: siteConfig.bookDemoUrl }}
        secondaryCta={{
          label: "See It In Action",
          href: "https://www.youtube.com/@StreamHatchet",
        }}
        stats={["30+ platforms", "10+ years of data", "55M+ creators"]}
        subtitle="The only Creator Marketing Analytics platform built for gaming. Covering creator discovery, campaign tracking, and ROI measurement in one place, across every social network."
        title="Complete Gaming Intelligence"
      />

      <SectionDivider surface="paper" />

      <LogoWall
        className="surface-paper bg-background pb-18 lg:pb-24"
        title="Trusted by the teams running gaming's biggest campaigns"
      />

      <SectionDivider />

      <Pillars />

      <SectionDivider />

      <CreatorLifecycle />

      <SectionDivider surface="paper" />

      <DifferentiatorTrio />

      <SectionDivider surface="paper" />

      <FeatureBlock
        body="Track creators, games, hours watched, chat velocity, and platform spread in one normalized view. Hatchet helps teams understand what is gaining attention, who is driving it, and where the audience is moving next."
        bullets={[
          "Measure live-streaming performance across major gaming platforms.",
          "Compare creator velocity before, during, and after launch beats.",
          "Connect audience movement to games, genres, publishers, and events.",
        ]}
        className="surface-paper bg-background py-18 lg:py-24"
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
        className="bg-background py-18 lg:py-24"
        eyebrow="Proof at signal scale"
        stats={proofStats}
        title="A measurement layer built for the scale of gaming culture."
      />

      <SectionDivider surface="paper" />

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
        media={{
          src: "/images/Laptop-Asset1.png",
          alt: "Hatchet dashboard on a laptop showing live-streaming analytics across platforms",
          width: 3488,
          height: 2243,
        }}
        proof={{ kind: "stat", value: "{{VERIFY}}", label: "creators tracked" }}
        title="Bring the live-streaming market read into your next decision."
        variant="featured"
      />
    </main>
  );
}
