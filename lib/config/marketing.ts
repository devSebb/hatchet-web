export const verticals = [
  {
    slug: "brands",
    label: "Brands",
    href: "/who-we-serve/brands",
    title: "Plan gaming partnerships around live audience movement.",
    subtitle:
      "See which creators, games, communities, and moments can carry a brand message before media plans are already fixed.",
    audience: "Brand, sponsorship, influencer marketing, and media teams",
    jobs: [
      "Find creators whose live audiences match the campaign brief.",
      "Compare games and genres by momentum, not assumptions.",
      "Run campaigns end to end: recruit creators, manage contracts and payments, and track deliverables.",
      "Explain sponsorship choices with audience and community evidence.",
    ],
    proof:
      "Hatchet covers the full partnership workflow: discover creators, manage contracts and payments, and attribute results. All on one trusted read of hours watched, creator momentum, and chat movement.",
  },
  {
    slug: "games-publishers",
    label: "Game Publishers",
    href: "/who-we-serve/games-publishers",
    title: "Read game demand while the market is still moving.",
    subtitle:
      "Track launch lift, creator pickup, competitive categories, and platform spread from reveal to long-tail engagement.",
    audience: "Publishing, marketing, insights, and franchise teams",
    jobs: [
      "Measure pre-release and launch-week live-streaming demand.",
      "Spot creators and communities driving durable category lift.",
      "Benchmark your title against competitors, genres, and events.",
    ],
    proof:
      "Hatchet connects creator coverage, game audience movement, and platform performance into launch intelligence.",
  },
  {
    slug: "market-research-agencies",
    label: "Market Research Agencies",
    href: "/who-we-serve/market-research-agencies",
    title: "Add live-streaming intelligence to research deliverables.",
    subtitle:
      "Use normalized creator, game, and community data as a market layer for trackers, studies, and executive reporting.",
    audience: "Gaming, media, and entertainment research teams",
    jobs: [
      "Enrich studies with live audience and creator behavior.",
      "Build category reads with repeatable streaming benchmarks.",
      "Support custom reports without stitching exports by hand.",
    ],
    proof:
      "Hatchet supplies a structured signal layer agencies can turn into clear recommendations and defensible charts.",
  },
  {
    slug: "esports-teams",
    label: "Esports Teams",
    href: "/who-we-serve/esports-teams",
    title: "Benchmark events, broadcasts, and sponsor value.",
    subtitle:
      "Understand official coverage, co-streams, creator-led moments, and audience retention across the esports calendar.",
    audience: "Team, league, event, and partnerships teams",
    jobs: [
      "Compare event viewership across official and creator-led coverage.",
      "Frame sponsor value with consistent exposure metrics like earned media value and logo presence share.",
      "Track roster, creator, and event moments that move communities.",
    ],
    proof:
      "Hatchet gives esports organizations a repeatable read on live attention, sponsor context, and audience movement.",
  },
  {
    slug: "marketing-and-talent-agencies",
    label: "Marketing & Talent Agencies",
    href: "/who-we-serve/marketing-and-talent-agencies",
    title: "Run creator programs at scale across every client.",
    subtitle:
      "Manage discovery, campaigns, and reporting for multiple rosters and brands from one verified source of truth.",
    audience: "Creator, talent, influencer, and social agency teams",
    jobs: [
      "Source and verify creators against each client brief in minutes.",
      "Run multiple campaigns end to end: contracts, payments, and deliverables.",
      "Deliver client-ready reporting on one consistent set of metrics.",
    ],
    proof:
      "Hatchet gives agencies a single workspace to discover creators, run programs, and prove results across every client.",
  },
] as const;

export type Vertical = (typeof verticals)[number];
export type VerticalSlug = Vertical["slug"];

export function getVertical(slug: string) {
  return verticals.find((vertical) => vertical.slug === slug);
}

export const differentiators = [
  {
    label: "Live signal across the market",
    body: "Hatchet connects creators, games, platforms, press, and community movement instead of treating each source as a separate export.",
  },
  {
    label: "Built for gaming decisions",
    body: "The model fits launch planning, sponsorships, market sizing, esports reporting, and executive readouts without translating generic media metrics.",
  },
  {
    label: "Proof teams can reuse",
    body: "Numbers are framed as evidence: hours watched, creator velocity, platform spread, community movement, and category lift.",
  },
] as const;

export const proofStats = [
  {
    label: "Live platforms tracked",
    value: 20,
    suffix: "+",
    description:
      "Twitch, YouTube, Kick, and more: major and emerging platforms in one normalized view.",
    sparkline: [9, 11, 12, 14, 16, 18, 21],
  },
  {
    label: "History since 2016",
    value: 10,
    suffix: "+ yrs",
    description:
      "Minute-level viewership data going back to 2016, ready for trend and benchmark analysis.",
    sparkline: [3, 4, 5, 6, 7, 8, 10],
  },
  {
    label: "Data granularity",
    value: 1,
    suffix: "-min",
    description:
      "Every stream measured at one-minute resolution, the industry's highest standard.",
    sparkline: [12, 14, 13, 15, 16, 18, 20],
  },
  {
    label: "Core metrics tracked",
    value: 10,
    suffix: "+",
    description:
      "Hours watched, concurrent viewers, airtime, EMV, CPM, logo presence share, and more.",
    sparkline: [4, 5, 5, 7, 8, 9, 11],
  },
];

export const careersOpenings = [
  {
    title: "Product designer",
    team: "Product",
    location: "Remote / hybrid",
    description:
      "Shape clear workflows for teams turning gaming market signal into decisions.",
  },
  {
    title: "Data partnerships lead",
    team: "Growth",
    location: "Remote",
    description:
      "Build the partner relationships that expand Hatchet's live-streaming intelligence layer.",
  },
  {
    title: "Frontend engineer",
    team: "Engineering",
    location: "Remote / hybrid",
    description:
      "Build polished marketing and product surfaces for a data-heavy gaming intelligence company.",
  },
] as const;

export const legalPages = {
  privacy: {
    title: "Privacy Policy",
    description:
      "How Hatchet handles personal information for marketing, site, and business communications.",
    path: "/privacy-policy",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "This placeholder policy covers contact details, business communication records, site usage data, and form submissions shared with Hatchet.",
          "Product app, rankings, reports, and live data systems are separate systems and will be documented independently.",
        ],
      },
      {
        heading: "How we use information",
        body: [
          "We use information to respond to demo requests, manage business relationships, improve the public site, and understand what content is useful to visitors.",
          "We do not use this placeholder site to process real HubSpot submissions yet.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          "Future versions will include operational contact paths for access, correction, deletion, and marketing preference requests.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    description:
      "Placeholder terms for using the Hatchet public marketing website.",
    path: "/terms-of-service",
    sections: [
      {
        heading: "Marketing site use",
        body: [
          "These placeholder terms describe use of the public Hatchet marketing website only.",
          "Product app access, reports, rankings, and live data products are governed by separate agreements.",
        ],
      },
      {
        heading: "Content and links",
        body: [
          "The site may link to external systems for demos, sign-up, login, reports, rankings, and resources.",
          "Placeholder copy and mock data in this scaffold are not final legal, commercial, or product commitments.",
        ],
      },
      {
        heading: "Updates",
        body: [
          "These terms will be replaced with reviewed legal language before launch.",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    description:
      "Placeholder cookie policy for the Hatchet public marketing website.",
    path: "/cookie-policy",
    sections: [
      {
        heading: "Cookie use",
        body: [
          "This placeholder page describes the kinds of cookies and similar technologies the marketing site may use in a later phase.",
          "Analytics, advertising, and HubSpot tracking are not wired for real submissions in this scaffold.",
        ],
      },
      {
        heading: "Managing preferences",
        body: [
          "A future consent and preference experience will define how visitors manage optional cookies.",
        ],
      },
      {
        heading: "Product systems",
        body: [
          "Cookie behavior for the product app and data products is outside this public-site scaffold.",
        ],
      },
    ],
  },
} as const;
