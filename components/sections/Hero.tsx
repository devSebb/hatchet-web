import type { ReactNode } from "react";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { LiveDot } from "@/components/signal/LiveDot";
import { Sparkline } from "@/components/signal/Sparkline";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";

type HeroProps = {
  eyebrow?: string;
  title: string;
  emphasizedTitle: string;
  subtitle: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  productGlimpse?: ReactNode;
  className?: string;
};

const heroSignal = [18, 24, 20, 34, 31, 52, 45, 68, 62, 79, 74, 91];

function DefaultProductGlimpse() {
  return (
    <div className="border-border bg-surface/92 relative overflow-hidden rounded-xl border p-5 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <LiveDot className="eyebrow text-muted" label="Live read" />
        <span className="text-muted font-mono text-xs">Audience signal</span>
      </div>
      <div className="mt-6 grid gap-3">
        {[
          ["Creator velocity", "72%"],
          ["Game demand", "58%"],
          ["Community movement", "81%"],
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
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Creators", "40M+"],
          ["Games", "150K+"],
          ["Signals", "24/7"],
        ].map(([label, value]) => (
          <div
            className="border-border bg-background/60 rounded-lg border p-3"
            key={label}
          >
            <p className="eyebrow text-muted">{label}</p>
            <p className="mt-2 font-mono text-2xl font-bold tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero({
  eyebrow = "Gaming and live-streaming intelligence",
  title,
  emphasizedTitle,
  subtitle,
  primaryCta = { label: "Book a demo", href: siteConfig.bookDemoUrl },
  secondaryCta = { label: "Sign up", href: siteConfig.signUpUrl },
  productGlimpse,
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        "bg-background relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-10 -z-10 mx-auto w-full max-w-7xl opacity-35">
        <Sparkline data={heroSignal} height={160} strokeWidth={1.2} />
      </div>
      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1fr_30rem] lg:items-center">
        <Reveal>
          <div className="max-w-4xl">
            <p className="eyebrow text-muted">{eyebrow}</p>
            <h1 className="display mt-5">
              {title} <span className="text-brand-soft">{emphasizedTitle}</span>
            </h1>
            <p className="body-lg text-muted mt-6 max-w-2xl">{subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          {productGlimpse ?? <DefaultProductGlimpse />}
        </Reveal>
      </div>
    </section>
  );
}
