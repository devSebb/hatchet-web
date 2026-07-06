export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

// A top-level nav entry is either a direct link or a dropdown group. Groups
// intentionally have no href of their own — the tab only opens the dropdown,
// there is no section-summary landing page.
export type NavItem = NavLink | { label: string; children: NavLink[] };

export type FooterColumn = {
  label: string;
  items: NavLink[];
};

export const primaryNav: NavItem[] = [
  {
    label: "Solutions",
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
    children: [
      {
        label: "Brands",
        href: "/who-we-serve/brands",
        description: "Track creator, audience, and sponsorship signals.",
      },
      {
        label: "Game Publishers",
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
];

export const legalNav: NavLink[] = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-of-service" },
  { label: "Cookies", href: "/cookie-policy" },
];

// Columns 1-3 reuse the Solutions / Who We Serve / Resources dropdown groups,
// listing their child links only (no section-root entry — those pages are gone).
const sectionFooterColumns: FooterColumn[] = [
  primaryNav[0],
  primaryNav[1],
  primaryNav[2],
].map((item) => ({
  label: item.label,
  items: "children" in item ? item.children : [item],
}));

export const footerColumns: FooterColumn[] = [
  ...sectionFooterColumns,
  {
    label: "Company",
    items: [
      { label: "Why Hatchet", href: "/why-hatchet" },
      { label: "Pricing", href: "/pricing" },
      { label: "Mission & Values", href: "/about" },
      { label: "Careers", href: "/about/careers" },
    ],
  },
];
