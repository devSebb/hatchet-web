import type { MetadataRoute } from "next";

import { verticals } from "@/lib/config/marketing";
import { legalNav, primaryNav } from "@/lib/config/nav";
import { solutions } from "@/lib/config/solutions";
import { content } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

/**
 * Frozen at build time. `output: "export"` has no request-time hook, so Next
 * requires this to be explicit rather than inferring it. The URL list already
 * came from committed content and static config, so nothing is lost — but it
 * does mean a WordPress post published after the last `pnpm sync:wp` is absent
 * until the next build.
 */
export const dynamic = "force-static";

/**
 * Next applies `trailingSlash` to canonicals and to `<Link>` hrefs, but **not**
 * to sitemap entries — it hands them through verbatim. Without this the
 * sitemap would advertise `https://hatchet.gg/pricing` while the site serves
 * `https://hatchet.gg/pricing/` and the canonical on that page declares the
 * slashed form. A sitemap that disagrees with the canonical it points at is
 * worse than no sitemap: it tells a crawler the two are different URLs and
 * invites it to pick the wrong one.
 */
function withTrailingSlash(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

function route(
  path: string,
  lastModified = new Date(),
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(withTrailingSlash(path)),
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

  /**
   * Campaign landing pages under /lp/ that should be findable in search.
   *
   * Opt-in, and empty on purpose. A campaign page is usually built with
   * `noIndex: true` and deliberately kept out of the sitemap — it exists for
   * people arriving from an ad or an email, not for organic search.
   *
   * This array is the ONLY place to make one discoverable. The alternative
   * would be adding it to lib/config/nav.ts, and that file drives the header,
   * the footer AND this sitemap at once — so a campaign page added there ends
   * up in the site's main navigation, which is a decision for the technical
   * reviewer rather than a side effect of wanting it indexed.
   *
   * Add the path with its trailing slash, e.g. "/lp/summer-campaign".
   */
  const lpPaths: string[] = [];

  const staticPaths = [
    "/",
    ...navPaths,
    ...legalNav.map((item) => item.href),
    "/resources/customer-stories",
    "/resources/guides",
    "/resources/press",
    ...solutions.map((solution) => solution.href),
    ...verticals.map((vertical) => vertical.href),
    ...lpPaths,
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
    // Externally published coverage has no page of its own — see the
    // generateStaticParams filter in app/resources/press/[slug]/page.tsx.
    ...pressItems
      .filter((item) => !item.url)
      .map((item) =>
        route(`/resources/press/${item.slug}`, new Date(item.date)),
      ),
  ];
}
