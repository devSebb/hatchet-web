import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24",
        className,
      )}
    >
      <div className="max-w-4xl">
        {eyebrow ? <p className="eyebrow text-muted">{eyebrow}</p> : null}
        <h1 className="display mt-4">{title}</h1>
        {subtitle ? (
          <p className="body-lg text-muted mt-5 max-w-3xl">{subtitle}</p>
        ) : null}
        {primaryCta || secondaryCta ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryCta ? (
              <Button asChild>
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
            ) : null}
            {secondaryCta ? (
              <Button asChild variant="secondary">
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
