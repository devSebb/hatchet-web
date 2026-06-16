export const solutions = [
  {
    slug: "solution-a",
    label: "Solution A",
    href: "/solutions/solution-a",
    title: "Creator and audience intelligence",
    subtitle:
      "Track who is moving gaming audiences, which creators are gaining velocity, and where live attention is shifting before a plan locks.",
    capability: "Creator signal",
    body: "Hatchet gives teams a normalized read on creators, games, platforms, hours watched, and community reaction so campaign and partnership decisions can be defended with live evidence.",
    bullets: [
      "Benchmark creators by audience movement, game affinity, and platform spread.",
      "Watch creator velocity before, during, and after tentpole moments.",
      "Turn live-streaming behavior into shortlists your team can explain.",
    ],
    proof:
      "Move from follower-count planning to a repeatable view of creator impact across live-streaming platforms.",
  },
  {
    slug: "solution-b",
    label: "Solution B",
    href: "/solutions/solution-b",
    title: "Game launch and category tracking",
    subtitle:
      "Measure launch demand, competitive lift, creator pickup, and category movement across the live-streaming platforms where games break through.",
    capability: "Launch signal",
    body: "Hatchet helps publishing, research, and strategy teams see whether interest is concentrated, spreading, or cooling across creators, genres, communities, and platforms.",
    bullets: [
      "Compare pre-release, launch-week, and post-launch audience movement.",
      "Track category share and competitor movement around major beats.",
      "Connect creator coverage to durable viewership and community signal.",
    ],
    proof:
      "Give launch readouts a common source of truth across streaming, creator, and audience behavior.",
  },
  {
    slug: "solution-c",
    label: "Solution C",
    href: "/solutions/solution-c",
    title: "Reports and data integrations",
    subtitle:
      "Bring normalized streaming, esports, press, and community intelligence into recurring reports, executive readouts, and internal BI workflows.",
    capability: "Decision signal",
    body: "Hatchet turns fragmented market movement into repeatable deliverables, from custom studies to structured data that powers dashboards and planning cycles.",
    bullets: [
      "Build custom market reports for sponsorships, launches, and category sizing.",
      "Feed clean creator, game, and audience data into internal tools.",
      "Align teams around metrics that survive executive review.",
    ],
    proof:
      "Use the same market signal in research decks, publisher reviews, partnership reports, and BI systems.",
  },
] as const;

export type Solution = (typeof solutions)[number];
export type SolutionSlug = Solution["slug"];

export function getSolution(slug: string) {
  return solutions.find((solution) => solution.slug === slug);
}

export const verticals = [
  {
    slug: "brands",
    label: "Brands",
    href: "/who-we-serve/brands",
    title: "Plan gaming partnerships around live audience movement.",
    subtitle:
      "See which creators, games, communities, and moments can carry a brand message before media plans are already fixed.",
    audience: "Brand, sponsorship, and media teams",
    jobs: [
      "Find creators whose live audiences match the campaign brief.",
      "Compare games and genres by momentum, not assumptions.",
      "Explain sponsorship choices with audience and community evidence.",
    ],
    proof:
      "Hatchet turns creator velocity, hours watched, and chat movement into partnership signals your stakeholders can trust.",
  },
  {
    slug: "games-publishers",
    label: "Games & Publishers",
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
      "Frame sponsor value with consistent audience and exposure signals.",
      "Track roster, creator, and event moments that move communities.",
    ],
    proof:
      "Hatchet gives esports organizations a repeatable read on live attention, sponsor context, and audience movement.",
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
    label: "Channels tracked",
    value: 40,
    suffix: "M+",
    description: "Creator and channel records connected to gaming audiences.",
    sparkline: [14, 18, 17, 29, 34, 41, 52],
  },
  {
    label: "Games indexed",
    value: 150,
    suffix: "K+",
    description: "Game entities mapped to live viewership and creator signal.",
    sparkline: [15, 22, 28, 31, 43, 45, 59],
  },
  {
    label: "Minutes processed daily",
    value: 2.8,
    suffix: "B",
    description: "Live viewing minutes normalized into usable market signal.",
    sparkline: [22, 25, 31, 30, 43, 48, 61],
  },
  {
    label: "Chat messages tracked daily",
    value: 900,
    suffix: "M+",
    description:
      "Community reactions tied back to creators, games, and events.",
    sparkline: [28, 31, 35, 42, 44, 57, 66],
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
