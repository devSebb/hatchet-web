import type { Metadata } from "next";

/**
 * The site's own origin, and the one value here that must not be guessed.
 *
 * It backs `metadataBase`, so it decides every canonical, every OG `url`, and
 * every `sitemap.xml` entry. Under `output: "export"` it is inlined at build
 * time and then cached by CloudFront — there is no request-time chance to fix
 * it. A miss ships canonicals pointing at a domain the site does not occupy,
 * which is worse than emitting no canonical at all.
 *
 * So a production build fails here rather than shipping a wrong absolute URL.
 * `next dev` falls back to localhost with a warning, because nothing it
 * renders is ever published. `scripts/deploy.sh` checks the variable again
 * before it builds, so the failure surfaces before the build starts too.
 *
 * The previous fallback was `https://hatchet.com` — a domain that is not ours
 * — and because the variable was unset, that is what every canonical, OG URL
 * and sitemap entry actually resolved to.
 */
function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not set.\n" +
        "It is inlined at build time and decides every canonical, OG URL and " +
        "sitemap entry, so a production build cannot proceed without it.\n" +
        "Set it to https://hatchet.gg (see .env.example) and rebuild.",
    );
  }

  console.warn(
    "[site] NEXT_PUBLIC_SITE_URL is not set — falling back to " +
      "http://localhost:3000 for development. A production build will fail.",
  );
  return "http://localhost:3000";
}

export type SocialLink = {
  label: "X" | "LinkedIn" | "Bluesky";
  href: string;
};

export const siteConfig = {
  name: "Hatchet",
  url: resolveSiteUrl(),
  description:
    "Hatchet measures live-streaming, gaming, esports, creator, press, and community signals for teams that need market intelligence.",
  appLoginUrl:
    process.env.NEXT_PUBLIC_APP_LOGIN_URL ?? "https://app.streamhatchet.com",
  bookDemoUrl: "https://insights.streamhatchet.com/get-a-demo",
  signUpUrl: "https://insights.streamhatchet.com/sign-up-free",
  openPositionsUrl: "https://stream-hatchet.factorialhr.com/#jobs",
  hubspotPortalId: process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID ?? "",
  socials: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/stream-hatchet",
    },
    { label: "X", href: "https://x.com/StreamHatchet" },
    {
      label: "Bluesky",
      href: "https://bsky.app/profile/streamhatchet.bsky.social",
    },
  ] satisfies SocialLink[],
} as const;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    type: "website",
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};
