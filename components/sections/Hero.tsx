import type { ReactNode } from "react";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";

type HeroProps = {
  eyebrow?: string;
  title: string;
  emphasizedTitle: string;
  subtitle: string;
  stats?: string[];
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

export function Hero({
  eyebrow = "Gaming and live-streaming intelligence",
  title,
  emphasizedTitle,
  subtitle,
  stats,
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
      <div
        className={cn(
          "mx-auto grid w-full max-w-7xl gap-12",
          productGlimpse && "lg:grid-cols-[1fr_30rem] lg:items-center",
        )}
      >
        <Reveal>
          <div className="max-w-4xl">
            <p className="eyebrow text-muted">{eyebrow}</p>
            <h1 className="display mt-5">
              {title} <span className="text-brand-soft">{emphasizedTitle}</span>
            </h1>
            <p className="body-lg text-muted mt-6 max-w-2xl">{subtitle}</p>
            {stats?.length ? (
              <ul className="text-muted mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm">
                {stats.map((stat, index) => (
                  <li className="flex items-center gap-3" key={stat}>
                    {index > 0 ? (
                      <span aria-hidden className="text-border">
                        ·
                      </span>
                    ) : null}
                    <span className="text-foreground font-semibold tabular-nums">
                      {stat}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
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

        {productGlimpse ? <Reveal delay={0.08}>{productGlimpse}</Reveal> : null}
      </div>
    </section>
  );
}
