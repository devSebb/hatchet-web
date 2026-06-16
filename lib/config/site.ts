import type { Metadata } from "next";

export type SocialLink = {
  label: "X" | "LinkedIn" | "YouTube" | "Instagram";
  href: string;
};

export const siteConfig = {
  name: "Hatchet",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hatchet.com",
  description:
    "Hatchet measures live-streaming, gaming, esports, creator, press, and community signals for teams that need market intelligence.",
  appLoginUrl:
    process.env.NEXT_PUBLIC_APP_LOGIN_URL ?? "https://app.streamhatchet.com",
  bookDemoUrl: "https://insights.streamhatchet.com/get-a-demo",
  signUpUrl: "https://insights.streamhatchet.com/sign-up-free",
  socials: [
    { label: "X", href: "https://x.com/StreamHatchet" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/stream-hatchet/",
    },
    { label: "YouTube", href: "https://www.youtube.com/@StreamHatchet" },
    { label: "Instagram", href: "https://www.instagram.com/streamhatchet/" },
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
