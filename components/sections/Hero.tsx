import Image from "next/image";
import Link from "next/link";

import { CircuitField } from "@/components/sections/CircuitField";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";

type HeroImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

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
  image?: HeroImage;
  className?: string;
};

export function Hero({
  eyebrow,
  title,
  emphasizedTitle,
  subtitle,
  stats,
  primaryCta = { label: "Book a demo", href: siteConfig.bookDemoUrl },
  secondaryCta = { label: "Sign up", href: siteConfig.signUpUrl },
  image,
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        "bg-background relative isolate overflow-hidden px-4 pt-12 pb-16 sm:px-6 lg:px-8 lg:pt-18 lg:pb-20",
        className,
      )}
    >
      <CircuitField density="quiet" />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center">
            {eyebrow ? <p className="eyebrow text-muted">{eyebrow}</p> : null}
            <h1 className="display">
              {title}{" "}
              <span className="text-gradient-brand">{emphasizedTitle}</span>
            </h1>
            <p className="body-lg text-muted mt-4 max-w-2xl">{subtitle}</p>
            {stats?.length ? (
              <ul className="text-muted mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-sm">
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
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            </div>
          </div>
        </Reveal>

        {image ? (
          <Reveal delay={0.08}>
            <div className="border-border bg-surface/60 mt-8 w-full max-w-5xl overflow-hidden rounded-2xl border p-2 shadow-xl lg:mt-10">
              <Image
                alt={image.alt}
                className="h-auto w-full rounded-xl"
                height={image.height}
                priority
                sizes="(min-width: 1024px) 64rem, 100vw"
                src={image.src}
                width={image.width}
              />
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
