"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { primaryNav } from "@/lib/config/nav";
import { siteConfig } from "@/lib/config/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";
import { Nav } from "./Nav";

function Logo() {
  return (
    <Link
      aria-label="Hatchet home"
      className="focus-visible:ring-ring/50 group inline-flex min-h-11 items-center gap-3 rounded-lg pr-2 outline-none focus-visible:ring-3"
      href="/"
    >
      <span
        aria-hidden="true"
        className="border-border bg-elevated relative grid size-9 place-items-center overflow-hidden rounded-lg border shadow-sm"
      >
        <span className="bg-signal absolute top-1/2 left-1/2 h-6 w-1 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full" />
        <span className="bg-signal-2 absolute top-1/2 left-1/2 h-6 w-1 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full" />
      </span>
      <span className="font-display text-foreground text-xl font-semibold tracking-[-0.015em]">
        Hatchet
      </span>
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
        "sticky top-0 z-40 border-b transition-[background-color,box-shadow,border-color] duration-(--dur-fast)",
        isElevated
          ? "border-border bg-background/92 shadow-md backdrop-blur-xl"
          : "bg-background/82 border-transparent backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-8">
          <Logo />
          <Nav items={primaryNav} />
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild>
            <Link href={siteConfig.bookDemoUrl}>Book a demo</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={siteConfig.signUpUrl}>Sign up</Link>
          </Button>
          <Button asChild variant="link">
            <Link href={siteConfig.appLoginUrl}>Log in</Link>
          </Button>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
