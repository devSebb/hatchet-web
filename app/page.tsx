import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChartBar,
  Megaphone,
  RocketLaunch,
  SealCheck,
  ShareNetwork,
  SquaresFour,
  Sword,
  TrendUp,
  Trophy,
  Users,
} from "@phosphor-icons/react/ssr";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { Button } from "@/components/ui/button";
import { CircuitField } from "@/components/sections/CircuitField";
import { CreatorLifecycle } from "@/components/sections/CreatorLifecycle";
import { CTASection } from "@/components/sections/CTASection";
import { Hero } from "@/components/sections/Hero";
import { LogoWall } from "@/components/sections/LogoWall";
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
    image: "/images/content/data+execution.png",
    kicker: "Data + execution",
    title: "One Platform, Full Lifecycle",
    body: "Find creators. Run campaigns. Prove ROI. Other tools make you choose between data and execution, but Hatchet gives you both, all in one place, from first search to final report.",
  },
  {
    image: "/images/content/verified_precision.png",
    kicker: "Verified precision",
    title: "The Data Nobody Else Has",
    body: "Ten years of verified data from streaming and social, across 30+ platforms: Every number is real and confirmed. No estimates, no fake audiences, no shortcuts.",
  },
  {
    image: "/images/content/Native.png",
    kicker: "Native, not retrofitted",
    title: "Built for Gaming from Day One",
    body: "Hatchet wasn't retrofitted for gaming. It was built for it. That means every feature, every data point, and every workflow was designed around how gaming campaigns actually run.",
  },
];

const whyHatchetReasons = [
  {
    icon: ShareNetwork,
    title: "Platform Coverage",
    tagline: "Name a platform. We probably track it.",
    body: "Twitch, YouTube, TikTok, Instagram, X, and 25+ more. Where gaming lives, Hatchet is already there.",
  },
  {
    icon: SealCheck,
    title: "Verified Data, Longest History",
    tagline: "10+ years of data. Zero tolerance for fake.",
    body: "The deepest verified dataset in gaming, covering streaming and social with no estimates, no inflated audiences, and no shortcuts.",
  },
  {
    icon: Trophy,
    title: "Experience with Global Gaming Brands",
    tagline: "The teams running gaming trust Hatchet.",
    body: "Riot, EA, Ubisoft, Capcom, and hundreds more use Hatchet to make every campaign decision with confidence.",
  },
  {
    icon: TrendUp,
    title: "Stay Ahead of the Industry",
    tagline: "Always know what's happening in gaming.",
    body: "Always know what's happening in the social & streaming space with analyst-written reports, trend data, and market intelligence.",
  },
  {
    icon: SquaresFour,
    title: "One Platform, Built for You",
    tagline: "Everything your team needs. Nothing it doesn't.",
    body: "Discovery, execution, and reporting tailored to your workflow, not a generic tool you have to bend to fit.",
  },
];

const useCases = [
  {
    icon: Megaphone,
    label: "Brands",
    body: "Use data to discover creator partners that tap into your target audience, then call them to action.",
    href: "/who-we-serve/brands",
  },
  {
    icon: RocketLaunch,
    label: "Game Publishers",
    body: "Improve your reach and target players that are hyped about your specific genre and mechanics.",
    href: "/who-we-serve/games-publishers",
  },
  {
    icon: ChartBar,
    label: "Market Research Agencies",
    body: "Competitor comparisons, trend tracking, and verified data your clients can trust. No estimates, no guesswork.",
    href: "/who-we-serve/market-research-agencies",
  },
  {
    icon: Sword,
    label: "Esports Organizations",
    body: "Viewership, audience demographics, chat reactions: Get everything you need to show partners the value of what you've built.",
    href: "/who-we-serve/esports-teams",
  },
  {
    icon: Users,
    label: "Marketing & Talent Agencies",
    body: "Run creator programs at scale across multiple clients. One platform, every campaign, no chaos.",
    href: "/who-we-serve/marketing-and-talent-agencies",
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
    <section className="surface-paper bg-background text-foreground px-4 pt-10 pb-20 sm:px-6 lg:px-8 lg:pt-14 lg:pb-28">
      <div className="mx-auto w-full max-w-7xl">
        <Stagger className="grid gap-5 lg:grid-cols-3">
          {pillars.map((pillar) => {
            return (
              <article className="relative" key={pillar.title}>
                <div className="hover:shadow-glow-brand mx-auto w-fit overflow-hidden rounded-2xl transition-[transform,box-shadow] duration-(--dur-base) hover:-translate-y-1">
                  <Image
                    alt=""
                    className="size-80 object-contain"
                    height={1254}
                    src={pillar.image}
                    width={1254}
                  />
                </div>
                <p className="eyebrow text-brand mt-10">{pillar.kicker}</p>
                <h3 className="font-display mt-2 text-2xl font-bold tracking-[-0.01em] sm:text-3xl">
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
    <section className="bg-background text-foreground relative isolate overflow-hidden px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-0 -z-10 h-80 w-80 rounded-full bg-[var(--gradient-cta-glow)] blur-3xl"
      />
      <CircuitField density="quiet" />
      <div className="mx-auto w-full max-w-3xl">
        <Reveal>
          <div className="text-center">
            <p className="eyebrow text-muted">Why Hatchet</p>
            <h2 className="h1 mt-4">
              Reasons Why Hatchet is{" "}
              <span className="text-gradient-brand">
                The Sharpest Analytics Tool
              </span>
            </h2>
          </div>
        </Reveal>

        <Stagger
          childClassName="border-border border-t"
          className="border-border mt-12 border-b"
        >
          {whyHatchetReasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <article
                className="group flex gap-5 py-5 sm:gap-7 sm:py-6"
                key={reason.title}
              >
                <div className="flex shrink-0 flex-col items-center gap-3">
                  <span className="font-display text-brand-soft text-sm font-semibold tabular-nums">
                    {`0${index + 1}`}
                  </span>
                  <span
                    className="shadow-glow-brand flex items-center justify-center rounded-xl p-3.5 text-white transition-transform duration-(--dur-base) group-hover:-translate-y-0.5"
                    style={{
                      // All-red gradient (no brand orange), matching the data-card
                      // assets. Bright red #e23c42 stands in for the light end.
                      backgroundImage:
                        "linear-gradient(120deg, var(--brand-lowlight) 0%, var(--brand) 42%, var(--brand) 68%, #e23c42 100%)",
                    }}
                  >
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold tracking-[-0.01em]">
                    {reason.title}
                  </h3>
                  <p className="text-brand mt-1 font-medium">
                    {reason.tagline}
                  </p>
                  <p className="body text-muted mt-2">{reason.body}</p>
                </div>
              </article>
            );
          })}
        </Stagger>

        <Reveal>
          <div className="mt-12 flex justify-center">
            <Button asChild className="h-14 px-8 text-base" size="lg">
              <Link href={siteConfig.bookDemoUrl}>Book a Demo</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function BuiltForYourTeam() {
  return (
    <section className="surface-paper bg-background text-foreground px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="max-w-3xl">
            <h2 className="h1">
              Apply Our Data
              <br />
              To Suit Your Needs
            </h2>
          </div>
        </Reveal>

        <Stagger
          childClassName="h-full"
          className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {useCases.map((useCase) => {
            const Icon = useCase.icon;

            return (
              <Link
                className="group border-border bg-card hover:border-brand/40 hover:shadow-glow-brand focus-visible:ring-ring/50 flex h-full flex-col rounded-2xl border p-7 shadow-sm transition-[transform,border-color,box-shadow] duration-(--dur-base) outline-none hover:-translate-y-1 focus-visible:ring-3"
                href={useCase.href}
                key={useCase.href}
              >
                <span
                  className="shadow-glow-brand flex size-12 items-center justify-center rounded-xl text-white"
                  style={{
                    // All-red gradient (no brand orange), matching the
                    // "Why Hatchet" reason icons above.
                    backgroundImage:
                      "linear-gradient(120deg, var(--brand-lowlight) 0%, var(--brand) 42%, var(--brand) 68%, #e23c42 100%)",
                  }}
                >
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <h3 className="font-display mt-6 text-xl font-semibold tracking-[-0.01em]">
                  {useCase.label}
                </h3>
                <p className="body text-muted mt-3 flex-1">{useCase.body}</p>
                <span className="text-foreground mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                  <span
                    aria-hidden="true"
                    className="bg-brand h-px w-0 transition-all duration-(--dur-base) group-hover:w-3"
                  />
                  Explore
                </span>
              </Link>
            );
          })}

          <Link
            className="group bg-brand shadow-glow-brand focus-visible:ring-ring/50 flex h-full flex-col rounded-2xl p-7 text-white transition-transform duration-(--dur-base) outline-none hover:-translate-y-1 focus-visible:ring-3"
            href={siteConfig.bookDemoUrl}
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-white/15 text-white">
              <ArrowRight aria-hidden="true" className="size-6" />
            </span>
            <h3 className="font-display mt-6 text-xl font-semibold tracking-[-0.01em] text-white">
              Not sure where you fit?
            </h3>
            <p className="body mt-3 flex-1 text-white/85">
              Tell us about your team and we&apos;ll plot a course towards your
              online community.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
              <span
                aria-hidden="true"
                className="h-px w-0 bg-white transition-all duration-(--dur-base) group-hover:w-3"
              />
              Book a demo
            </span>
          </Link>
        </Stagger>
      </div>
    </section>
  );
}

function Plans() {
  return (
    <section className="bg-background text-foreground relative isolate overflow-hidden px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-[var(--gradient-cta-glow)] blur-3xl"
      />
      <CircuitField density="quiet" />
      <div className="mx-auto w-full max-w-3xl text-center">
        <Reveal>
          <p className="eyebrow text-muted">Plans</p>
          <h2 className="h1 mt-4">
            Find your <span className="text-gradient-brand">fit.</span>
          </h2>
          <p className="body-lg text-muted mt-5">
            Our data adapts to brands, studios, and agencies of all sizes. Find
            the plan that fits yours.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild>
              <Link href="/pricing">See Plans</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      {/* Shared navy→white background bleeds from the hero across the divider
          into the trusted-by section, so the blend resolves to white only once
          it reaches the logo wall. The hero and logo wall stay transparent; this
          wrapper owns the gradient. */}
      <div
        className="relative isolate overflow-hidden"
        style={{ backgroundImage: "var(--hero-gradient)" }}
      >
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
            href: "https://www.youtube.com/watch?v=XtzwA_VLr1o",
            external: true,
          }}
          stats={[
            { value: 30, suffix: "+", label: "Platforms", visual: "cluster" },
            {
              value: 10,
              suffix: "+",
              label: "Years of data",
              visual: "timeline",
            },
            { value: 50, suffix: "M+", label: "Creators", visual: "density" },
          ]}
          subtitle="Creator Marketing Analytics built for gaming: Creator discovery, campaign tracking, and ROI measurement across every social network."
          surface="gradient"
          title="Complete Gaming Intelligence"
        />
        <LogoWall
          className="surface-paper pb-14 lg:pb-20"
          title="Trusted by the biggest names in the gaming industry."
        />
      </div>

      <Pillars />

      <CreatorLifecycle />

      <WhyHatchet />

      <BuiltForYourTeam />

      <div className="surface-paper bg-background text-foreground">
        <TestimonialCarousel
          className="py-14 lg:py-20"
          testimonials={testimonials}
          title="Curious what our clients say about Hatchet?"
        />
      </div>

      <Plans />

      <CTASection
        body="Book a demo and see how Hatchet runs your entire creator program, from first search to final report."
        className="py-14 lg:py-20"
        cta={{ label: "Book a Demo", href: siteConfig.bookDemoUrl }}
        eyebrow="Book a demo"
        media={{
          src: "/images/Laptop-Asset1.png",
          alt: "Hatchet dashboard on a laptop showing live-streaming analytics across platforms",
          width: 3488,
          height: 2243,
        }}
        title="Full picture. Verified data. Gaming expertise."
        variant="featured"
      />
    </main>
  );
}
