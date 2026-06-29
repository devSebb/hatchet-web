import Image, { type StaticImageData } from "next/image";

import navyLogo from "../../public/brand/hatchet_all_navy.png";
import redLogo from "../../public/brand/hatchet_all_red.png";
import whiteLogo from "../../public/brand/hatchet_all_white.png";
import { cn } from "@/lib/utils";

type BrandLogoVariant = "white" | "navy" | "red";

// Static imports so Next reads each asset's real width/height at build time.
// Swapping a file auto-updates its dimensions — no hardcoded numbers to drift
// out of sync, which is what would otherwise letterbox the image.
const logoSources: Record<BrandLogoVariant, StaticImageData> = {
  navy: navyLogo,
  red: redLogo,
  white: whiteLogo,
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
  return (
    <Image
      alt={alt}
      className={cn("block h-12 w-auto max-w-none", className)}
      priority={priority}
      src={logoSources[variant]}
    />
  );
}
