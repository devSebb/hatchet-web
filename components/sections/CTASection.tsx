import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";

type CTASectionProps = {
  eyebrow?: string;
  title?: string;
  body?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  surface?: "dark" | "paper";
  className?: string;
};

export function CTASection({
  eyebrow = "Ready for the live read",
  title = "See the market signal behind creators, games, and audiences.",
  body = "Book a demo and we will show how Hatchet turns streaming, esports, press, and community movement into intelligence your team can use.",
  primaryCta = { label: "Book a demo", href: siteConfig.bookDemoUrl },
  secondaryCta = { label: "Sign up", href: siteConfig.signUpUrl },
  surface = "dark",
  className,
}: CTASectionProps) {
  const isPaper = surface === "paper";

  return (
    <section
      className={cn(
        isPaper && "surface-paper",
        "px-4 py-16 sm:px-6 lg:px-8",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto grid w-full max-w-7xl gap-8 rounded-xl border p-6 md:grid-cols-[1fr_auto] md:items-end lg:p-10",
          isPaper
            ? "border-border bg-card text-foreground"
            : "border-border bg-elevated text-foreground shadow-lg",
        )}
      >
        <div className="max-w-3xl">
          <p className="eyebrow text-muted">{eyebrow}</p>
          <h2 className="h2 mt-3">{title}</h2>
          <p className="body-lg text-muted mt-5">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
          <Button asChild variant={isPaper ? "outline" : "secondary"}>
            <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
