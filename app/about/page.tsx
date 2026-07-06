import type { Metadata } from "next";
import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { CircuitField } from "@/components/sections/CircuitField";
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

const storyStats = [
  { value: "2016", label: "Founded" },
  { value: "Barcelona", label: "Where it started" },
  { value: "10+ yrs", label: "Of live data" },
  { value: "55M+", label: "Creators tracked" },
] as const;

const values = [
  {
    number: "01",
    label: "Teamwork Makes the Dream Work",
    body: "We're only as good as the team behind the product. We invest in each other's growth, protect work-life balance, and build a place where creativity actually thrives.",
  },
  {
    number: "02",
    label: "Data Without Compromise",
    body: "We're obsessed with accuracy. From methodology to delivery, we build the most reliable data in gaming — because one wrong number costs real decisions.",
  },
  {
    number: "03",
    label: "Client-Focused, Always",
    body: "Our clients' success is our success. We listen, we adapt, and we build solutions that fit real workflows — not the other way around.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground">
      <PageHeader
        className="pb-10 lg:pb-12"
        eyebrow="Mission & Values"
        subtitle="We've spent nearly a decade building the tools that power creator marketing decisions for the world's biggest publishers, brands, and agencies."
        title="Built in gaming. Backed by data. Since 2016."
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
                their own audiences. It grew into something bigger — the
                leading creator marketing analytics platform for gaming.
              </p>
              <div className="mt-6">
                <Badge variant="outline">Part of GameSquare</Badge>
              </div>
              <p className="body text-muted mt-6">
                Trusted by{" "}
                <span className="text-foreground font-medium">Riot</span>,{" "}
                <span className="text-foreground font-medium">EA</span>,{" "}
                <span className="text-foreground font-medium">Ubisoft</span>,{" "}
                <span className="text-foreground font-medium">Capcom</span> and
                hundreds more.
              </p>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-2 gap-4" step={0.09}>
            {storyStats.map((stat) => (
              <div
                className="border-border bg-card rounded-xl border p-5 shadow-sm"
                key={stat.label}
              >
                <div className="bg-signal mb-5 h-1 w-10 rounded-full" />
                <p className="font-display text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
                  {stat.value}
                </p>
                <p className="small text-muted mt-2">{stat.label}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="surface-paper bg-background text-foreground relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <CircuitField density="quiet" />
        <Reveal className="mx-auto w-full max-w-4xl text-center">
          <div>
            <p className="eyebrow text-muted">Our mission</p>
            <h2 className="h1 mt-4">
              We make creator marketing decisions easier to make and harder to
              get wrong.
            </h2>
            <p className="body-lg text-muted mx-auto mt-6 max-w-2xl">
              From the first creator search to the final report. We&apos;re
              here to make sure the data is always there when you need it.
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
                An ambitious team with a shared mission — here&apos;s what
                keeps us aligned.
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
                <div className="flex items-center gap-4">
                  <span className="font-mono text-muted text-sm font-semibold tabular-nums">
                    {value.number}
                  </span>
                  <div className="bg-signal h-1 w-10 rounded-full" />
                </div>
                <h3 className="h3 mt-6">{value.label}</h3>
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
