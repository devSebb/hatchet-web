import Link from "next/link";

import { siteConfig, type SocialLink } from "@/lib/config/site";
import { cn } from "@/lib/utils";

// Brand glyphs as inline SVG paths (simple-icons). lucide-react no longer ships
// brand logos, so these are committed locally. All draw with currentColor.
const GLYPHS: Record<SocialLink["label"], string> = {
  X: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  LinkedIn:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
  Bluesky:
    "M5.202 2.857C7.954 4.922 10.913 9.11 12 11.358c1.087-2.247 4.046-6.436 6.798-8.501C20.783 1.366 24 .213 24 3.883c0 .732-.42 6.156-.667 7.037-.856 3.061-3.978 3.842-6.755 3.37 4.854.826 6.089 3.562 3.422 6.299-5.065 5.196-7.28-1.304-7.847-2.97-.104-.305-.152-.448-.153-.327 0-.121-.05.022-.153.327-.568 1.666-2.782 8.166-7.847 2.97-2.667-2.737-1.432-5.473 3.422-6.3-2.777.473-5.899-.308-6.755-3.369C.42 10.04 0 4.615 0 3.883c0-3.67 3.217-2.517 5.202-1.026",
};

export function FooterSocials({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {siteConfig.socials.map((social) => (
        <li key={social.href}>
          <Link
            aria-label={social.label}
            className="text-muted hover:text-foreground focus-visible:ring-ring/50 inline-flex size-9 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-3"
            href={social.href}
            rel="noreferrer"
            target="_blank"
          >
            <svg
              aria-hidden="true"
              className="size-4"
              fill="currentColor"
              role="img"
              viewBox="0 0 24 24"
            >
              <path d={GLYPHS[social.label]} />
            </svg>
          </Link>
        </li>
      ))}
    </ul>
  );
}
