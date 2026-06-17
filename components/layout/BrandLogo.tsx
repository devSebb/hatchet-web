import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandLogoVariant = "white" | "navy" | "red";

const logoSources: Record<BrandLogoVariant, string> = {
  navy: "/brand/hatchet_all_navy.png",
  red: "/brand/hatchet_all_red.png",
  white: "/brand/hatchet_all_white.png",
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
      className={cn("h-12 w-auto max-w-none object-contain", className)}
      height={754}
      priority={priority}
      src={logoSources[variant]}
      width={2102}
    />
  );
}
