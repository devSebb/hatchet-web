import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandLogoVariant = "white" | "navy" | "red";

// Served directly from /public (reliable across the app). Dimensions match each
// real asset so the height-constrained image renders at its true ratio with no
// object-fit/letterbox padding. Keep these in sync if a PNG is re-exported.
const logoSources: Record<
  BrandLogoVariant,
  { src: string; width: number; height: number }
> = {
  navy: { src: "/brand/hatchet_all_navy.png", width: 2102, height: 755 },
  red: { src: "/brand/hatchet_all_red.png", width: 2102, height: 754 },
  white: { src: "/brand/hatchet_all_white.png", width: 2275, height: 569 },
};

type BrandLogoProps = {
  alt?: string;
  className?: string;
  priority?: boolean;
  variant?: BrandLogoVariant;
};

export function BrandLogo({
  alt = "Hatchet",
  className,
  priority = false,
  variant = "white",
}: BrandLogoProps) {
  const logo = logoSources[variant];

  return (
    <Image
      alt={alt}
      className={cn("block h-12 w-auto max-w-none", className)}
      height={logo.height}
      priority={priority}
      src={logo.src}
      width={logo.width}
    />
  );
}
