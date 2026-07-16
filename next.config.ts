import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      // Vertical renamed Esports Teams → Esports Organizers with the 2026 copy deck.
      {
        source: "/who-we-serve/esports-teams",
        destination: "/who-we-serve/esports-organizers",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
