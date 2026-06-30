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
      <BrandLogo alt="" className="h-10" priority variant="red" />
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
        "sticky top-0 z-40 mt-3 border-b transition-[background-color,box-shadow,border-color] duration-(--dur-fast)",
        isElevated
          ? "border-white/20 bg-background/92 shadow-[0_8px_28px_-8px_rgba(255,255,255,0.22)] backdrop-blur-xl"
          : "border-white/15 bg-background/82 shadow-[0_4px_20px_-8px_rgba(255,255,255,0.15)] backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-18 w-full max-w-[96rem] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-6">
          <Logo />
          <Nav
            className="hidden shrink-0 min-[1400px]:flex"
            items={primaryNav}
          />
        </div>

        <div className="hidden shrink-0 items-center gap-3 min-[1400px]:flex">
          <Button asChild className="px-3">
            <Link href={siteConfig.bookDemoUrl}>Book a demo</Link>
          </Button>
          <Button asChild className="px-3" variant="secondary">
            <Link href={siteConfig.appLoginUrl}>Log in</Link>
          </Button>
        </div>

        <MobileNav className="min-[1400px]:hidden" />
      </div>
    </header>
  );
}
