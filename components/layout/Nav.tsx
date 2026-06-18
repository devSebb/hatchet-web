import Link from "next/link";

import type { NavItem } from "@/lib/config/nav";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type NavProps = {
  items: NavItem[];
  className?: string;
};

export function Nav({ items, className }: NavProps) {
  return (
    <NavigationMenu
      className={cn(className ?? "hidden lg:flex")}
      viewport={false}
    >
      <NavigationMenuList className="gap-1">
        {items.map((item) => (
          <NavigationMenuItem key={item.href}>
            {item.children?.length ? (
              <>
                <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[28rem] gap-1 p-2">
                    <NavigationMenuLink asChild>
                      <Link
                        className="bg-muted-surface/60 block rounded-lg p-3 transition-colors outline-none"
                        href={item.href}
                      >
                        <span className="font-display text-foreground block text-base font-semibold">
                          {item.label}
                        </span>
                        <span className="small text-muted mt-1 block">
                          View the {item.label.toLowerCase()} overview.
                        </span>
                      </Link>
                    </NavigationMenuLink>

                    <div className="grid gap-1">
                      {item.children.map((child) => (
                        <NavigationMenuLink asChild key={child.href}>
                          <Link href={child.href}>
                            <span className="text-foreground block text-sm font-medium">
                              {child.label}
                            </span>
                            {child.description ? (
                              <span className="text-muted mt-1 block text-xs leading-relaxed">
                                {child.description}
                              </span>
                            ) : null}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <Link
                  className="hover:bg-muted-surface focus:bg-muted-surface focus-visible:ring-ring/50 inline-flex h-11 items-center rounded-lg px-2 text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-3"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
