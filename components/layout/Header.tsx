"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { primaryNav } from "@/lib/config/nav";
import { siteConfig } from "@/lib/config/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./BrandLogo";
import { MobileNav } from "./MobileNav";
import { Nav } from "./Nav";

function Logo() {
  return (
    <Link
      aria-label="Hatchet home"
      className="focus-visible:ring-ring/50 inline-flex min-h-11 items-center rounded-lg outline-none focus-visible:ring-3"
      href="/"
    >
      {/* Sized by width, not height. The wordmark is ~4.1:1, so height is a
          coarse handle — and h-* maps to --space-*, which only defines
          1-6/8/10/12/16. h-7 has no --space-7 and silently falls back to
          stock Tailwind's 1.75rem (28px), less than half of h-8's 64px.
          A width in px sidesteps both traps. 208px == 50.7px tall. */}
      <BrandLogo alt="" className="h-auto w-[208px]" priority variant="primary" />
    </Link>
  );
}

export function Header() {
  const [isElevated, setIsElevated] = useState(false);

  useEffect(() => {
    const updateElevation = () => setIsElevated(window.scrollY > 8);

    updateElevation();
    window.addEventListener("scroll", updateElevation, { passive: true });

    return () => window.removeEventListener("scroll", updateElevation);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b pt-2 pb-2 transition-[background-color,box-shadow,border-color] duration-(--dur-fast)",
        isElevated
          ? "border-white/10 bg-background/92 shadow-[0_8px_28px_-8px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          : "border-transparent bg-background/70 backdrop-blur-md",
      )}
    >
      {/* Logo, Nav and the button pair are three separate flex children so
          justify-between splits the free space evenly: the gap from the logo to
          the nav then always equals the gap from the nav to the buttons, at any
          width. Grouping the logo and nav together would make the left gap a
          fixed gap-* while the right one absorbed all the slack. gap-6 is only
          the floor for when free space runs out. */}
      <div className="mx-auto flex h-18 w-full max-w-[96rem] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />

        <Nav className="hidden shrink-0 min-[1400px]:flex" items={primaryNav} />

        <div className="hidden shrink-0 items-center gap-3 min-[1400px]:flex">
          <Button asChild className="px-3">
            <Link href={siteConfig.bookDemoUrl}>Book a demo</Link>
          </Button>
          <Button asChild className="px-3" variant="inverse">
            <Link href={siteConfig.appLoginUrl}>Log in</Link>
          </Button>
        </div>

        <MobileNav className="min-[1400px]:hidden" />
      </div>
    </header>
  );
}
