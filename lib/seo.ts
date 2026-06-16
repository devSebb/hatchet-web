import type { Metadata } from "next";

import { siteConfig } from "@/lib/config/site";

type CreateMetadataInput = {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function createMetadata({
  title,
  description,
  path,
  noIndex = false,
}: CreateMetadataInput): Metadata {
  const url = path ? absoluteUrl(path) : siteConfig.url;

  return {
    title,
    description,
    alternates: path ? { canonical: url } : undefined,
    openGraph: {
      title,
      description,
      siteName: siteConfig.name,
      type: "website",
      url,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
