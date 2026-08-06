import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Static HTML export to S3 behind CloudFront. There is no Node server in
   * production, which is why `app/api/demo/*` is unmounted (see
   * lib/booking/server/README.md) and why `proxy.ts` is gone — middleware does
   * not run in an export, and it dies with only a build warning.
   */
  output: "export",

  /**
   * Emits `out/pricing/index.html` rather than `out/pricing.html`, and makes
   * `/pricing/` the canonical form.
   *
   * All 2,935 legacy streamhatchet.com URLs carry a trailing slash — 100 % of
   * them — so matching that shape removes a whole class of normalisation bugs
   * from the migration redirect table: sources scraped from the old sitemaps
   * and destinations on the new site now agree without a rewrite rule in the
   * middle. This reverses the recommendation in docs/static-export-spike.md
   * §3.1, which was made before that measurement existed.
   *
   * The no-slash form is not lost: the CloudFront viewer-request function
   * (infra/cloudfront-viewer-request.js) 301s `/pricing` to `/pricing/`.
   */
  trailingSlash: true,

  images: {
    /**
     * Serve the pre-generated WebP variants in public/_img (built by
     * `node scripts/optimize-images.mjs`) instead of the /_next/image route,
     * which does not exist in a static export. Keeps srcSet intact — the thing
     * `images.unoptimized: true` would discard. Anything without a variant
     * (SVGs, remote WordPress media) falls through to its original URL.
     */
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",

    /**
     * Report covers and post artwork are served from the Stream Hatchet
     * WordPress media library rather than copied into this repo — see the
     * header of scripts/sync-wordpress.mjs. Narrow to the uploads path so only
     * the media library is proxyable, not any arbitrary path on the host.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "streamhatchet.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.streamhatchet.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },

  /**
   * `redirects()` is NOT here on purpose.
   *
   * Next ignores it under `output: "export"` — it prints one warning line and
   * emits nothing — so leaving it would have looked like four working
   * redirects that silently 404. All four now live in
   * infra/cloudfront-viewer-request.js, as 301s.
   *
   * Those four map *this site's own* retired slugs. The real legacy
   * streamhatchet.com URLs (/products/*, /rankings/*, /company/*) still have
   * no redirects — see docs/seo-namespace.md §2.4. That table is Phase 7.
   */
};

export default nextConfig;
