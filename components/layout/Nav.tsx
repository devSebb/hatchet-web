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
          <NavigationMenuItem key={item.label}>
            {"children" in item ? (
              <>
                <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-56 gap-1 p-2">
                    {item.children.map((child) => (
                      <NavigationMenuLink asChild key={child.href}>
                        <Link href={child.href}>
                          <span className="text-foreground block text-sm font-medium">
                            {child.label}
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    ))}
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
