import type { MetadataRoute } from "next";

import { verticals } from "@/lib/config/marketing";
import { legalNav, primaryNav } from "@/lib/config/nav";
import { solutions } from "@/lib/config/solutions";
import { content } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

function route(
  path: string,
  lastModified = new Date(),
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified,
  };
}

const navPaths = primaryNav.flatMap((item) =>
  "children" in item ? item.children.map((child) => child.href) : [item.href],
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, customerStories, guides, pressItems] = await Promise.all([
    content.getPosts(),
    content.getCustomerStories(),
    content.getGuides(),
    content.getPressItems(),
  ]);

  const staticPaths = [
    "/",
    ...navPaths,
    ...legalNav.map((item) => item.href),
    "/resources/customer-stories",
    "/resources/guides",
    "/resources/press",
    ...solutions.map((solution) => solution.href),
    ...verticals.map((vertical) => vertical.href),
  ];

  return [
    ...Array.from(new Set(staticPaths)).map((path) => route(path)),
    ...posts.map((post) =>
      route(`/blog/${post.slug}`, new Date(post.publishedAt)),
    ),
    ...customerStories.map((story) =>
      route(`/resources/customer-stories/${story.slug}`),
    ),
    ...guides.map((guide) => route(`/resources/guides/${guide.slug}`)),
    ...pressItems.map((item) =>
      route(`/resources/press/${item.slug}`, new Date(item.date)),
    ),
  ];
}
