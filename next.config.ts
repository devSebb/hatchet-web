import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

  async redirects() {
    // Retired solution slugs → closest lifecycle stage (see lib/config/solutions.ts).
    return [
      {
        source: "/solutions/web-dashboard",
        destination: "/solutions/intelligence",
        permanent: true,
      },
      {
        source: "/solutions/custom-reports",
        destination: "/solutions/reporting",
        permanent: true,
      },
      {
        source: "/solutions/api-data-integrations",
        destination: "/solutions/reporting",
        permanent: true,
      },
      // Vertical renamed Esports Teams → Esports Organizers with the 2026 copy
      // deck, then relabelled "Esports Teams & Organizers" — the slug stays
      // /esports-organizers, so this redirect still covers the old URL.
      {
        source: "/who-we-serve/esports-teams",
        destination: "/who-we-serve/esports-organizers",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
