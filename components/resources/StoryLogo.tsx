import Image from "next/image";

import { CompanyLogo } from "@/components/brand/CompanyLogo";
import { logoSlugForName } from "@/lib/brand/logos";
import type { CustomerStory } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type StoryLogoProps = {
  className?: string;
  /** Optical height for the vector mark, matched to the box it sits in. */
  height?: number;
  priority?: boolean;
  sizes: string;
  story: Pick<CustomerStory, "company" | "logo">;
};

/**
 * Stories mirrored from WordPress carry no logo asset — the landing pages ship
 * none — so the company name resolves a vector mark from lib/brand/logos.ts
 * instead, and falls back to the name set as text when the brand has no mark.
 *
 * A hand-authored `logo` path still wins, so existing fixtures render unchanged.
 */
export function StoryLogo({
  className,
  height = 28,
  priority,
  sizes,
  story,
}: StoryLogoProps) {
  const slug = logoSlugForName(story.company);

  return (
    <div className={cn("relative flex items-center", className)}>
      {story.logo ? (
        <Image
          alt={`${story.company} logo`}
          className="object-contain object-left"
          fill
          priority={priority}
          sizes={sizes}
          src={story.logo}
        />
      ) : slug ? (
        <CompanyLogo height={height} slug={slug} />
      ) : (
        <span className="font-display text-foreground text-xl leading-none font-semibold">
          {story.company}
        </span>
      )}
    </div>
  );
}
