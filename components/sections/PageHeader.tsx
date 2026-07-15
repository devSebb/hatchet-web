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
    external?: boolean;
  };
  /**
   * "gradient" stays transparent so a shared navy→white background painted by a
   * parent wrapper (see the home hero) shows through — white text rides the
   * dark top. "default" keeps the paper foreground tokens on a solid section.
   */
  surface?: "default" | "gradient";
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  surface = "default",
  className,
}: PageHeaderProps) {
  const isGradient = surface === "gradient";

  return (
    <section
      className={cn(
        "relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
        // Gradient headers ride the navy top: pull the text up and leave a tall
        // bottom gap so the navy→white fade has room to ease in gently before
        // the logo wall below.
        isGradient
          ? "pt-6 pb-32 lg:pt-8 lg:pb-44"
          : "py-16 lg:py-24",
        className,
      )}
    >
      <div className="max-w-4xl">
        {eyebrow ? (
          <p className={cn("eyebrow", isGradient ? "text-white/70" : "text-muted")}>
            {eyebrow}
          </p>
        ) : null}
        <h1
          className="display mt-4"
          style={isGradient ? { color: "var(--white)" } : undefined}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            className={cn(
              "body-lg mt-5 max-w-3xl",
              isGradient ? "text-white/75" : "text-muted",
            )}
          >
            {subtitle}
          </p>
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
                {secondaryCta.external ? (
                  <a
                    href={secondaryCta.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {secondaryCta.label}
                  </a>
                ) : (
                  <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                )}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
