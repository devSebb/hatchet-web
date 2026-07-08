import type { CSSProperties } from "react";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { footerColumns, legalNav } from "@/lib/config/nav";
import { siteConfig } from "@/lib/config/site";
import { BrandLogo } from "./BrandLogo";
import { FooterNewsletter } from "./FooterNewsletter";
import { FooterSocials } from "./FooterSocials";

// Whisper-faint blueprint dot grid (texture-class, static, no Signal slot).
// Uses the existing --grid-line token (white 7%) so it recedes on the charcoal.
const BLUEPRINT_GRID: CSSProperties = {
  backgroundImage: "radial-gradient(var(--grid-line) 1px, transparent 1.5px)",
  backgroundSize: "2rem 2rem",
  maskImage:
    "linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)",
  WebkitMaskImage:
    "linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)",
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background text-foreground relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={BLUEPRINT_GRID}
      />

      {/* Top hairline with a small registration tick aligned to the content edge. */}
      <div className="border-border relative border-t">
        <span
          aria-hidden="true"
          className="bg-brand absolute top-0 left-4 h-2 w-px -translate-y-1/2 sm:left-6 lg:left-8"
        />
      </div>

      {/* Band A — brand + newsletter */}
      <Reveal>
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pt-8 pb-6 sm:px-6 lg:grid-cols-[46fr_54fr] lg:items-stretch lg:px-8 lg:pt-10">
          <div className="flex flex-col">
            <Link
              aria-label="Hatchet home"
              className="focus-visible:ring-ring/50 -ml-1 inline-flex min-h-11 items-center self-start rounded-lg outline-none focus-visible:ring-3"
              href="/"
            >
              <BrandLogo alt="" className="h-16" variant="white" />
            </Link>
            <p className="body text-muted mt-4 max-w-md">
              Creator Marketing Analytics built for gaming: Creator discovery,
              campaign tracking, and ROI measurement across every social
              network.
            </p>
          </div>

          <div className="flex lg:justify-end">
            <FooterNewsletter />
          </div>
        </div>
      </Reveal>

      {/* Band B — navigation columns (audited real routes) */}
      <nav
        aria-label="Footer navigation"
        className="border-border/60 mx-auto grid w-full max-w-7xl gap-x-8 gap-y-10 border-t px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8"
      >
        {footerColumns.map((column) => (
          <div key={column.label}>
            <h2 className="eyebrow text-muted">{column.label}</h2>
            <ul className="mt-4 grid gap-1">
              {column.items.map((item) => (
                <li key={item.href}>
                  <Link
                    className="group text-muted hover:text-foreground focus-visible:ring-ring/50 inline-flex min-h-9 items-center gap-2 rounded-sm text-sm transition-colors outline-none focus-visible:ring-3"
                    href={item.href}
                  >
                    <span
                      aria-hidden="true"
                      className="bg-brand h-px w-0 transition-all duration-(--dur-base) group-hover:w-3"
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Band C — legal bar */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-border text-muted flex flex-col gap-4 border-t py-6 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p>
              &copy; {year} {siteConfig.name}
            </p>
            <nav aria-label="Legal">
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {legalNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="hover:text-foreground focus-visible:ring-ring/50 inline-flex min-h-9 items-center rounded-sm transition-colors outline-none focus-visible:ring-3"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <FooterSocials className="md:justify-self-end" />
        </div>
      </div>
    </footer>
  );
}
