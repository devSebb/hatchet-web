"use client";

import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { primaryNav } from "@/lib/config/nav";
import { siteConfig } from "@/lib/config/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Open navigation menu"
          className="lg:hidden"
          size="icon-lg"
          variant="ghost"
        >
          <MenuIcon aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="border-border bg-popover w-full max-w-[26rem] overflow-y-auto border-l p-0"
        side="right"
      >
        <SheetHeader className="border-border border-b p-5 pr-14">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            Explore Hatchet pages, resources, and account links.
          </SheetDescription>
        </SheetHeader>

        <nav aria-label="Mobile primary" className="px-5 py-4">
          <Accordion type="multiple">
            {primaryNav.map((item) =>
              item.children?.length ? (
                <AccordionItem key={item.href} value={item.href}>
                  <AccordionTrigger className="text-foreground">
                    {item.label}
                  </AccordionTrigger>
                  <AccordionContent className="grid gap-1 pb-4">
                    <SheetClose asChild>
                      <Link
                        className="hover:bg-muted-surface focus-visible:ring-ring/50 rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors outline-none focus-visible:ring-3"
                        href={item.href}
                      >
                        {item.label} overview
                      </Link>
                    </SheetClose>
                    {item.children.map((child) => (
                      <SheetClose asChild key={child.href}>
                        <Link
                          className="hover:bg-muted-surface focus-visible:ring-ring/50 rounded-lg px-3 py-2 no-underline transition-colors outline-none focus-visible:ring-3"
                          href={child.href}
                        >
                          <span className="text-foreground block text-sm font-medium">
                            {child.label}
                          </span>
                          {child.description ? (
                            <span className="text-muted mt-1 block text-xs leading-relaxed">
                              {child.description}
                            </span>
                          ) : null}
                        </Link>
                      </SheetClose>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <div className="border-border border-b py-1" key={item.href}>
                  <SheetClose asChild>
                    <Link
                      className="hover:bg-muted-surface focus-visible:ring-ring/50 block rounded-lg px-3 py-3 text-sm font-medium transition-colors outline-none focus-visible:ring-3"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                </div>
              ),
            )}
          </Accordion>
        </nav>

        <div className="border-border mt-auto grid gap-3 border-t p-5">
          <SheetClose asChild>
            <Button asChild>
              <Link href={siteConfig.bookDemoUrl}>Book a demo</Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button asChild variant="secondary">
              <Link href={siteConfig.signUpUrl}>Sign up</Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button asChild variant="link">
              <Link href={siteConfig.appLoginUrl}>Log in</Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
