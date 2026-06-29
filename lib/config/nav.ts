export type NavItem = {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
};

export type FooterColumn = {
  label: string;
  items: NavItem[];
};

export const primaryNav = [
  {
    label: "Solutions",
    href: "/solutions",
    children: [
      {
        label: "Discovery",
        href: "/solutions/discovery",
        description:
          "Search and verify creators with AI search and audience-quality scoring.",
      },
      {
        label: "Intelligence",
        href: "/solutions/intelligence",
        description:
          "Analyze streaming and social campaign performance in one cross-platform view.",
      },
      {
        label: "Creator Community",
        href: "/solutions/creator-community",
        description:
          "Manage your creator roster and campaigns end to end, with attribution built in.",
      },
      {
        label: "Reporting",
        href: "/solutions/reporting",
        description:
          "Report EMV, engagement, and per-creator results, ready to share.",
      },
    ],
  },
  {
    label: "Who We Serve",
    href: "/who-we-serve",
    children: [
      {
        label: "Brands",
        href: "/who-we-serve/brands",
        description: "Track creator, audience, and sponsorship signals.",
      },
      {
        label: "Games & Publishers",
        href: "/who-we-serve/games-publishers",
        description: "Measure launch demand, creator lift, and game momentum.",
      },
      {
        label: "Market Research Agencies",
        href: "/who-we-serve/market-research-agencies",
        description: "Add live-streaming intelligence to market research.",
      },
      {
        label: "Esports Teams",
        href: "/who-we-serve/esports-teams",
        description: "Benchmark live audiences, events, and sponsor value.",
      },
      {
        label: "Marketing & Talent Agencies",
        href: "/who-we-serve/marketing-and-talent-agencies",
        description: "Run creator programs at scale for multiple clients.",
      },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    children: [
      {
        label: "Customer Stories",
        href: "/resources/customer-stories",
        description: "See how teams use Hatchet intelligence.",
      },
      {
        label: "Blog & Trends",
        href: "/blog",
        description: "Read live-streaming and gaming market analysis.",
      },
      {
        label: "Guides & E-books",
        href: "/resources/guides",
        description: "Use practical guides for creator and game analytics.",
      },
      {
        label: "Press",
        href: "/resources/press",
        description: "Track company announcements and media coverage.",
      },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      {
        label: "Mission & Values",
        href: "/about",
        description: "Learn what Hatchet is building for the market.",
      },
      {
        label: "Careers",
        href: "/about/careers",
        description: "Join the team measuring live signal.",
      },
    ],
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Why Hatchet",
    href: "/why-hatchet",
  },
] satisfies NavItem[];

export const legalNav = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-of-service" },
  { label: "Cookies", href: "/cookie-policy" },
] satisfies NavItem[];

export const footerColumns = [
  primaryNav[0],
  primaryNav[1],
  primaryNav[2],
  {
    label: "Company",
    items: [
      { label: "Why Hatchet", href: "/why-hatchet" },
      { label: "Pricing", href: "/pricing" },
      { label: "Mission & Values", href: "/about" },
      { label: "Careers", href: "/about/careers" },
    ],
  },
].map((column) => ({
  label: column.label,
  items:
    "items" in column ? column.items : [column, ...(column.children ?? [])],
})) satisfies FooterColumn[];
