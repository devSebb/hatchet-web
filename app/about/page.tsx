import type { Metadata } from "next";
import Image from "next/image";

import {
  ChartLine,
  Globe,
  type IsoIcon,
  RocketLaunch,
  SealCheck,
  ShareNetwork,
  Users,
} from "@/components/icons/iso-icons";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/config/site";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Mission & Values",
    description:
      "Built in gaming and backed by data since 2016. Learn about Hatchet's story, mission, and the values that keep the team aligned.",
    path: "/about",
  });
}

const storyStats: { value: string; label: string; Icon: IsoIcon }[] = [
  { value: "2016", label: "Founded", Icon: RocketLaunch },
  { value: "Barcelona", label: "Where it started", Icon: Globe },
  { value: "10+ yrs", label: "Of live data", Icon: ChartLine },
  { value: "50M+", label: "Creators tracked", Icon: Users },
];

const values: { label: string; body: string; Icon: IsoIcon }[] = [
  {
    label: "We Thrive As A Community, For Communities",
    body: "We're only as good as the team behind the product. We invest in each other's growth, protect work-life balance, and build a place where good ideas get heard.",
    Icon: Users,
  },
  {
    label: "Data Without Compromise",
    body: "We're obsessed with accuracy. From methodology to delivery, we build the most reliable data in gaming, because one wrong number costs real decisions.",
    Icon: SealCheck,
  },
  {
    label: "Client-Focused, Always",
    body: "We take pride in solving real problems for real teams. That means listening first, adapting fast, and building something that fits how people work, not the other way around.",
    Icon: ShareNetwork,
  },
];

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground">
      <PageHeader
        className="pb-10 lg:pb-12"
        eyebrow="Mission & Values"
        subtitle="We've spent a decade crafting tools that power creator marketing decisions for the world's biggest publishers, brands, and agencies."
        title="Connecting Data, Gaming, and Creators Since 2016."
      />

      {/* Full-width team photo riding directly under the header copy. */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal className="mx-auto w-full max-w-7xl">
          <div className="border-border relative h-64 overflow-hidden rounded-2xl border shadow-md sm:h-96 lg:h-[32rem]">
            <Image
              alt="The Hatchet team gathered on a rooftop terrace in Barcelona"
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1280px) 80rem, 100vw"
              src="/images/company/team-rooftop.jpg"
            />
          </div>
        </Reveal>
      </section>

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <p className="eyebrow text-muted">Our story</p>
              <h2 className="h2 mt-3">
                From passion project to industry standard.
              </h2>
              <p className="body-lg text-muted mt-5">
                Founded in Barcelona in 2016 by Eduard Montserrat and Albert
                Alemany, Hatchet started as a tool for streamers to understand
                their own audiences. Realizing just how opaque the online
                landscape could be, and how many people wanted to be a bigger
                part of it, Hatchet&apos;s ambitions began to expand. It grew
                from a streamer analytics tool into the leading creator
                marketing analytics provider for gaming, built for publishers,
                brands, and agencies.
              </p>
              <a
                className="border-border bg-background mt-8 inline-flex w-fit items-center gap-3 whitespace-nowrap rounded-xl border px-5 py-3 transition-opacity hover:opacity-80"
                href="https://www.gamesquare.com/"
                rel="noreferrer"
                target="_blank"
              >
                <span className="body text-muted shrink-0">Part of</span>
                <Image
                  alt="GameSquare"
                  className="h-5 w-auto shrink-0 sm:h-6"
                  height={450}
                  src="/images/logos/gamesquare_logo.png"
                  width={1000}
                />
              </a>
              <p className="body text-muted mt-6">
                Now part of GameSquare, Hatchet is trusted by industry leaders
                like <span className="text-foreground font-medium">Riot</span>,{" "}
                <span className="text-foreground font-medium">EA</span>,{" "}
                <span className="text-foreground font-medium">Ubisoft</span>,{" "}
                <span className="text-foreground font-medium">Capcom</span>, and
                hundreds more.
              </p>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-2 gap-4" step={0.09}>
            {storyStats.map((stat) => (
              <div
                className="border-border bg-card flex flex-col rounded-xl border p-5 shadow-sm transition-shadow duration-300 hover:shadow-md"
                key={stat.label}
              >
                <span className="bg-accent ring-border/60 flex size-[72px] items-center justify-center rounded-2xl ring-1 ring-inset">
                  <stat.Icon aria-hidden="true" className="size-[52px]" />
                </span>
                <p className="font-display text-foreground mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {stat.value}
                </p>
                <p className="small text-muted mt-2">{stat.label}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* White (surface-paper) section — the circuit board stays on navy
          backgrounds only. */}
      <section className="surface-paper bg-background text-foreground relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal className="mx-auto w-full max-w-4xl text-center">
          <div>
            <p className="eyebrow text-muted">Our mission</p>
            <h2 className="h1 mt-4">
              Cut through the noise of the online landscape, helping businesses
              to understand what communities really want.
            </h2>
            <p className="body-lg text-muted mx-auto mt-6 max-w-2xl">
              It&apos;s the question behind every dataset we tap into and every
              line of code we write: Is this making things easier to understand
              for the people who use it?
            </p>
          </div>
        </Reveal>
      </section>

      {/* Full-width team photo breaking up the mission and values sections. */}
      <section className="surface-paper bg-background text-foreground px-4 pb-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto w-full max-w-7xl">
          <div className="border-border relative h-64 overflow-hidden rounded-2xl border shadow-md sm:h-96 lg:h-[32rem]">
            <Image
              alt="The Hatchet team at a summer offsite by the sea"
              className="object-cover"
              fill
              sizes="(min-width: 1280px) 80rem, 100vw"
              src="/images/company/team-beach.jpg"
            />
          </div>
        </Reveal>
      </section>

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow text-muted">Values</p>
              <h2 className="h2 mt-4">What drives us.</h2>
              <p className="body-lg text-muted mt-5">
                What we build reflects who we are. Here&apos;s what we stand
                for, inside the team and out.
              </p>
            </div>
          </Reveal>

          <Stagger
            childClassName="h-full"
            className="mt-10 grid gap-4 lg:grid-cols-3"
          >
            {values.map((value) => (
              <article
                className="border-border bg-card h-full rounded-xl border p-6 shadow-sm"
                key={value.label}
              >
                <div className="flex items-start gap-4">
                  <span className="bg-accent ring-border/60 flex size-[52px] shrink-0 items-center justify-center rounded-xl ring-1 ring-inset">
                    <value.Icon aria-hidden="true" className="size-[36px]" />
                  </span>
                  <h3 className="h3">{value.label}</h3>
                </div>
                <p className="body text-muted mt-4">{value.body}</p>
              </article>
            ))}
          </Stagger>
        </div>
      </section>

      <CTASection
        body="An ambitious team, a shared mission, and a lot of data. If that sounds like your kind of place, we'd love to meet you."
        className="py-18 lg:py-24"
        cta={{
          label: "See our open positions",
          href: siteConfig.openPositionsUrl,
        }}
        eyebrow="Join the team"
        title="Help us build the data layer for gaming."
      />
    </main>
  );
}
