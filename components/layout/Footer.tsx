import Link from "next/link";

import { footerColumns, legalNav } from "@/lib/config/nav";
import { siteConfig, type SocialLink } from "@/lib/config/site";
import { PulseDivider } from "@/components/signal/PulseDivider";
import { Button } from "@/components/ui/button";

function SocialMark({ label }: { label: SocialLink["label"] }) {
  return (
    <span aria-hidden="true" className="font-mono text-xs font-bold">
      {label === "LinkedIn" ? "IN" : label === "YouTube" ? "YT" : label[0]}
    </span>
  );
}

export function Footer() {
  return (
    <footer className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <PulseDivider />
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1.4fr] lg:px-8 lg:py-16">
        <div className="space-y-7">
          <div>
            <Link
              className="focus-visible:ring-ring/50 inline-flex items-center gap-3 rounded-lg outline-none focus-visible:ring-3"
              href="/"
            >
              <span
                aria-hidden="true"
                className="border-border bg-elevated relative grid size-10 place-items-center overflow-hidden rounded-lg border"
              >
                <span className="bg-signal absolute top-1/2 left-1/2 h-7 w-1 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full" />
                <span className="bg-signal-2 absolute top-1/2 left-1/2 h-7 w-1 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full" />
              </span>
              <span className="font-display text-2xl font-semibold tracking-[-0.015em]">
                Hatchet
              </span>
            </Link>
            <p className="body text-muted mt-4 max-w-md">
              Live-streaming, gaming, esports, creator, press, and community
              signals for teams that need market intelligence.
            </p>
          </div>

          <form className="border-border bg-surface grid max-w-md gap-3 rounded-lg border p-4">
            <div>
              <p className="eyebrow text-muted">Streamlined</p>
              <p className="text-foreground mt-2 text-sm font-medium">
                Get a concise read on gaming and live-streaming movement.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <label className="sr-only" htmlFor="footer-email">
                Email address
              </label>
              <input
                className="border-border bg-background focus-visible:ring-ring/50 h-9 rounded-lg border px-3 text-sm transition outline-none focus-visible:ring-3"
                id="footer-email"
                name="email"
                placeholder="name@company.com"
                type="email"
              />
              <Button type="button">Notify me</Button>
            </div>
            <p className="text-muted text-xs">
              Form shell only. HubSpot wiring lands in Phase 9.
            </p>
          </form>

          <div className="flex flex-wrap gap-2">
            {siteConfig.socials.map((social) => (
              <Button
                aria-label={social.label}
                asChild
                key={social.href}
                size="icon-sm"
                variant="outline"
              >
                <Link href={social.href}>
                  <SocialMark label={social.label} />
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <nav
          aria-label="Footer navigation"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {footerColumns.map((column) => (
            <div key={column.label}>
              <h2 className="eyebrow text-muted">{column.label}</h2>
              <ul className="mt-4 grid gap-3">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="hover:text-foreground focus-visible:ring-ring/50 text-muted rounded-sm text-sm transition-colors outline-none focus-visible:ring-3"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-border border-t">
        <div className="text-muted mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 text-sm sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-4">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link
                    className="hover:text-foreground focus-visible:ring-ring/50 rounded-sm transition-colors outline-none focus-visible:ring-3"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
