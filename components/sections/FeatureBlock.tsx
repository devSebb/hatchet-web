import type { ReactNode } from "react";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FeatureBlockProps = {
  eyebrow?: string;
  heading: string;
  body: string;
  bullets?: string[];
  link?: {
    label: string;
    href: string;
  };
  media?: ReactNode;
  reverse?: boolean;
  className?: string;
};

function DefaultMedia() {
  return (
    <div className="border-border bg-surface relative min-h-80 overflow-hidden rounded-xl border p-5 shadow-md">
      <div className="grid gap-3">
        {[
          "Creator lift",
          "Game demand",
          "Press movement",
          "Community spike",
        ].map((label, index) => (
          <div
            className="border-border bg-background/70 grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg border p-3"
            key={label}
          >
            <span className="small text-muted">{label}</span>
            <span className="text-foreground font-mono text-sm font-bold tabular-nums">
              +{(index + 2) * 14}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeatureBlock({
  eyebrow,
  heading,
  body,
  bullets = [],
  link,
  media,
  reverse = false,
  className,
}: FeatureBlockProps) {
  return (
    <section className={cn("px-4 py-16 sm:px-6 lg:px-8", className)}>
      <div
        className={cn(
          "mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 lg:items-center",
          reverse && "lg:[&>*:first-child]:order-2",
        )}
      >
        <Reveal>
          <div>
            {eyebrow ? <p className="eyebrow text-muted">{eyebrow}</p> : null}
            <h2 className="h2 mt-3">{heading}</h2>
            <p className="body-lg text-muted mt-5">{body}</p>
            {bullets.length ? (
              <ul className="mt-6 grid gap-3">
                {bullets.map((bullet) => (
                  <li
                    className="text-foreground flex gap-3 text-sm"
                    key={bullet}
                  >
                    <span
                      aria-hidden="true"
                      className="bg-signal mt-2 size-1.5 shrink-0 rounded-full"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {link ? (
              <Button asChild className="mt-7" variant="outline">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ) : null}
          </div>
        </Reveal>
        <Reveal delay={0.08}>{media ?? <DefaultMedia />}</Reveal>
      </div>
    </section>
  );
}
