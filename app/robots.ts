import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

/**
 * `robots.txt`, branched on which bucket the build is destined for.
 *
 * `DEPLOY_ENV` is read here rather than `NODE_ENV` — both deployments are
 * production builds, and the thing that differs is where the output is
 * uploaded, which `NODE_ENV` cannot express. `scripts/deploy.sh` sets it from
 * its target argument, so the value always matches the bucket being written to.
 *
 * **Only the literal string `production` allows indexing.** Unset, misspelt or
 * anything else is treated as staging and emits a blanket disallow. That
 * asymmetry is deliberate: a wrong guess in one direction puts the staging site
 * in Google's index competing with the real one, and in the other it produces a
 * robots.txt someone has to notice. Only one of those is recoverable on a
 * schedule you control.
 *
 * Frozen at build time — `force-static` below, and a static export has no
 * request-time hook anyway — so changing environment means a rebuild, and a
 * CloudFront invalidation before crawlers see the change.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (process.env.DEPLOY_ENV !== "production") {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/styleguide",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
