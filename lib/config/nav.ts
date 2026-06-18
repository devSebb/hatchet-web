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
        label: "Web Dashboard",
        href: "/solutions/web-dashboard",
        description:
          "Use one interface for live viewership, creators, games, esports, VOD, and audience signal.",
      },
      {
        label: "Custom Reports",
        href: "/solutions/custom-reports",
        description:
          "Work with Hatchet analysts on strategic reports built around your KPIs.",
      },
      {
        label: "API & Data Integrations",
        href: "/solutions/api-data-integrations",
        description:
          "Connect live-streaming data to products, dashboards, BI, and attribution workflows.",
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
