import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  BarChart3Icon,
  Gamepad2Icon,
  LayoutGridIcon,
  MegaphoneIcon,
  RocketIcon,
  Share2Icon,
  ShieldCheckIcon,
  SwordsIcon,
  TrendingUpIcon,
  TrophyIcon,
  UsersIcon,
  WorkflowIcon,
} from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CircuitField } from "@/components/sections/CircuitField";
import { CreatorLifecycle } from "@/components/sections/CreatorLifecycle";
import { CTASection } from "@/components/sections/CTASection";
import { Hero } from "@/components/sections/Hero";
import { LogoWall } from "@/components/sections/LogoWall";
import { StatCounters } from "@/components/sections/StatCounters";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
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

const whyHatchetReasons = [
  {
    icon: Share2Icon,
    title: "Platform Coverage",
    tagline: "Name a platform. We probably track it.",
    body: "Twitch, YouTube, TikTok, Instagram, X and 25+ more. Where gaming lives, Hatchet is already there.",
  },
  {
    icon: BadgeCheckIcon,
    title: "Verified Data, Longest History",
    tagline: "10+ years of data. Zero tolerance for fake.",
    body: "The deepest verified dataset in gaming — streaming and social, no estimates, no inflated audiences, no shortcuts.",
  },
  {
    icon: TrophyIcon,
    title: "Industry Leader",
    tagline: "The teams running gaming trust Hatchet.",
    body: "Riot, EA, Ubisoft, Capcom and hundreds more use Hatchet to make every campaign decision with confidence.",
  },
  {
    icon: TrendingUpIcon,
    title: "Stay Ahead of the Industry",
    tagline: "Always know what's happening in gaming.",
    body: "Access analyst-written reports, trend data, and market intelligence — so you're never caught off guard.",
  },
  {
    icon: LayoutGridIcon,
    title: "One Platform, Built for You",
    tagline: "Everything your team needs. Nothing it doesn't.",
    body: "Discovery, execution, reporting — tailored to your workflow, not a generic tool you have to bend to fit.",
  },
];

const useCases = [
  {
    icon: MegaphoneIcon,
    label: "Brands",
    body: "Understand gaming before you commit a budget. Reach Gen Z the right way, with an expert beside you.",
    href: "/who-we-serve/brands",
  },
  {
    icon: RocketIcon,
    label: "Game Publishers",
    body: "Launch campaigns and always-on programs in one tool. Conversion, not just reach.",
    href: "/who-we-serve/games-publishers",
  },
  {
    icon: BarChart3Icon,
    label: "Market Research Agencies",
    body: "Competitor comparisons and trend data, built on verified, accurate numbers.",
    href: "/who-we-serve/market-research-agencies",
  },
  {
    icon: SwordsIcon,
    label: "Esports Orgs",
    body: "Viewership, sponsorship, and audience data in one repeatable read.",
    href: "/who-we-serve/esports-teams",
  },
  {
    icon: UsersIcon,
    label: "Marketing & Talent Agencies",
    body: "Run creator programs at scale for multiple clients, all from one workspace.",
    href: "/who-we-serve/marketing-and-talent-agencies",
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

function Pillars() {
  return (
    <section className="bg-background text-foreground relative isolate overflow-hidden px-4 py-18 sm:px-6 lg:px-8 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 -z-10 h-80 w-80 rounded-full bg-[var(--gradient-cta-glow)] blur-3xl"
      />
      <CircuitField density="quiet" />
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

function WhyHatchet() {
  return (
    <section className="bg-background text-foreground relative isolate overflow-hidden px-4 py-18 sm:px-6 lg:px-8 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-0 -z-10 h-80 w-80 rounded-full bg-[var(--gradient-cta-glow)] blur-3xl"
      />
      <CircuitField density="quiet" />
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow text-muted">Why Hatchet</p>
            <h2 className="h1 mt-4">
              Five reasons teams{" "}
              <span className="text-gradient-brand">bet on Hatchet.</span>
            </h2>
            <p className="body-lg text-muted mt-5">
              The broadest coverage, the deepest verified history, and the
              workflow gaming teams actually run on.
            </p>
          </div>
        </Reveal>

        <Stagger
          childClassName="border-border border-t"
          className="border-border border-b lg:col-span-8"
        >
          {whyHatchetReasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <article
                className="group flex gap-5 py-7 sm:gap-7 sm:py-8"
                key={reason.title}
              >
                <div className="flex shrink-0 flex-col items-center gap-3">
                  <span className="font-display text-brand-soft text-sm font-semibold tabular-nums">
                    {`0${index + 1}`}
                  </span>
                  <span className="bg-gradient-brand shadow-glow-brand flex size-11 items-center justify-center rounded-xl text-white transition-transform duration-(--dur-base) group-hover:-translate-y-0.5">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold tracking-[-0.01em]">
                    {reason.title}
                  </h3>
                  <p className="text-brand-soft mt-1 font-medium">
                    {reason.tagline}
                  </p>
                  <p className="body text-muted mt-3 max-w-2xl">{reason.body}</p>
                </div>
              </article>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

function BuiltForYourTeam() {
  return (
    <section className="surface-paper bg-background text-foreground px-4 py-18 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow text-muted">Use cases</p>
            <h2 className="h1 mt-4">Built for your team.</h2>
            <p className="body-lg text-muted mt-5">
              Whatever your role in gaming, Hatchet meets your workflow. Pick the
              path that fits how your team works.
            </p>
          </div>
        </Reveal>

        <Stagger
          childClassName="h-full"
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {useCases.map((useCase) => {
            const Icon = useCase.icon;

            return (
              <Link
                className="group border-border bg-card hover:border-brand/40 hover:shadow-glow-brand focus-visible:ring-ring/50 flex h-full flex-col rounded-2xl border p-7 shadow-sm transition-[transform,border-color,box-shadow] duration-(--dur-base) outline-none hover:-translate-y-1 focus-visible:ring-3"
                href={useCase.href}
                key={useCase.href}
              >
                <span className="bg-gradient-brand shadow-glow-brand flex size-12 items-center justify-center rounded-xl text-white">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <h3 className="font-display mt-6 text-xl font-semibold tracking-[-0.01em]">
                  {useCase.label}
                </h3>
                <p className="body text-muted mt-3 flex-1">{useCase.body}</p>
                <span className="text-foreground mt-6 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 group-hover:underline">
                  Explore
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="size-4 transition-transform duration-(--dur-base) group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            );
          })}

          <Link
            className="group bg-gradient-brand shadow-glow-brand focus-visible:ring-ring/50 flex h-full flex-col rounded-2xl p-7 text-white transition-transform duration-(--dur-base) outline-none hover:-translate-y-1 focus-visible:ring-3"
            href={siteConfig.bookDemoUrl}
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-white/15 text-white">
              <ArrowRightIcon aria-hidden="true" className="size-6" />
            </span>
            <h3 className="font-display mt-6 text-xl font-semibold tracking-[-0.01em]">
              Not sure where you fit?
            </h3>
            <p className="body mt-3 flex-1 text-white/85">
              Tell us about your team and we&apos;ll map the fastest path to
              value.
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
              Book a demo
              <ArrowRightIcon
                aria-hidden="true"
                className="size-4 transition-transform duration-(--dur-base) group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        </Stagger>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      {/* Shared navy→white background bleeds from the hero across the divider
          into the trusted-by section, so the blend resolves to white only once
          it reaches the logo wall. All three children stay transparent. */}
      <div className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ backgroundImage: "var(--hero-gradient)" }}
        />
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
          surface="gradient"
          title="Complete Gaming Intelligence"
        />

        <LogoWall
          className="surface-paper pb-18 lg:pb-24"
          title="Trusted by the teams running gaming's biggest campaigns"
        />
      </div>

      <Pillars />

      <CreatorLifecycle />

      <WhyHatchet />

      <BuiltForYourTeam />

      <StatCounters
        className="bg-background py-18 lg:py-24"
        eyebrow="Proof at signal scale"
        stats={proofStats}
        title="A measurement layer built for the scale of gaming culture."
      />

      <div className="surface-paper bg-background text-foreground">
        <TestimonialCarousel
          className="py-18 lg:py-24"
          eyebrow="Customer signal"
          testimonials={testimonials}
          title="Teams use Hatchet when the live audience read has to hold up."
        />
      </div>

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
