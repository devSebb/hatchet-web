import { normalizeBrand } from "@/lib/content/providers/wordpress";
import { siteConfig } from "@/lib/config/site";

export type SolutionSlug =
  | "web-dashboard"
  | "custom-reports"
  | "api-data-integrations";

type SolutionCta = {
  label: string;
  href: string;
};

type SolutionTextPair = {
  title: string;
  description: string;
};

export type ProductSolution = {
  slug: SolutionSlug;
  name: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  summary: string;
  bodyNote: string;
  primaryCta: SolutionCta;
  secondaryCta?: SolutionCta;
  capabilities: SolutionTextPair[];
  why: SolutionTextPair[];
  metaDescription: string;
  href: `/solutions/${SolutionSlug}`;
};

const rawSolutions = [
  {
    slug: "web-dashboard",
    name: "Web Dashboard",
    eyebrow: "Web Dashboard",
    title: "All-in-one live streaming analytics",
    subtitle:
      "The Web Dashboard is the core of Hatchet, with real-time insights and comprehensive analytics across the live streaming universe in one intuitive interface.",
    summary:
      "Explore live viewership, esports, YouTube VODs, audience behavior, and competitive movement from one shared workspace.",
    bodyNote:
      "Share the same data across departments, then export clean readouts to Excel, PDF, and Google Sheets.",
    primaryCta: { label: "Book a demo", href: siteConfig.bookDemoUrl },
    secondaryCta: { label: "Start free trial", href: siteConfig.signUpUrl },
    capabilities: [
      {
        title: "Live streaming viewership",
        description:
          "Track real-time and historical viewership at minute-level granularity across every major platform — with data going back to 2016 — including top channels, games, and market trends.",
      },
      {
        title: "Esports measurement",
        description:
          "Measure tournaments, teams, player performances, engagement, and the global impact of esports events.",
      },
      {
        title: "YouTube VOD intelligence",
        description:
          "Find creators making content on any topic, then monitor brand mentions and relevance across gaming and non-gaming YouTube VODs.",
      },
      {
        title: "Competitor analysis",
        description:
          "Benchmark your metrics against the market, spot strengths and gaps, and make the next move with evidence.",
      },
      {
        title: "Audience insights",
        description:
          "Understand viewer demographics, preferences, and behavior so content and marketing decisions match the audience you want to grow.",
      },
      {
        title: "Influencer campaign management",
        description:
          "Discover and recruit creators, then run campaigns end to end — manage your roster, contracts, payments, and deliverables in one place, with no spreadsheets and conversion-level attribution.",
      },
      {
        title: "Speech and logo recognition",
        description:
          "Use speech recognition, logo recognition, Twitch tags, and advanced tooling across 20+ platforms.",
      },
    ],
    why: [
      {
        title: "Unparalleled insights",
        description:
          "Deep analytics on viewership, demographics, and engagement for teams that need more than surface metrics.",
      },
      {
        title: "Real-time analytics",
        description:
          "Live and historical data help teams move fast without losing the context behind the number.",
      },
      {
        title: "Cross-platform measurement",
        description:
          "One unified view across every major streaming platform keeps teams aligned around the same market read.",
      },
    ],
    metaDescription:
      "Use Hatchet's Web Dashboard for real-time live streaming analytics, esports measurement, YouTube VOD intelligence, competitor analysis, and audience insight.",
  },
  {
    slug: "custom-reports",
    name: "Custom Reports",
    eyebrow: "Custom Reports",
    title: "Custom reporting for strategic decisions",
    subtitle:
      "Work one-on-one with Hatchet analysts to build the exact report your team needs, with in-depth analytics and actionable insight for your use case. If you do not see the report you need, we will build it.",
    summary:
      "Turn custom questions into analyst-built reports for campaigns, leagues, teams, sponsorships, and market strategy.",
    bodyNote:
      "Reports can be delivered as PDFs or inside your Hatchet Web Dashboard. Custom report packages include Web App licenses so stakeholders can dig into the signal behind the readout.",
    primaryCta: { label: "Get a custom quote", href: siteConfig.bookDemoUrl },
    secondaryCta: { label: "Book a demo", href: siteConfig.bookDemoUrl },
    capabilities: [
      {
        title: "Influencer marketing measurement",
        description:
          "Find creators who fit your audience and goals, manage team performance, and analyze campaigns across social platforms.",
      },
      {
        title: "League and event reporting",
        description:
          "Track viewer behavior, churn, and retention; forecast and schedule events; and dig into match data for segment analysis.",
      },
      {
        title: "Team performance",
        description:
          "Track an esports team or organization's streaming and social performance, then report viewership to support brand sponsorships.",
      },
      {
        title: "Brand lift and sponsorship",
        description:
          "Measure campaigns with audience chat data, logo presence share, earned media value (EMV), CPM, speech recognition, and viewership data.",
      },
      {
        title: "Competitive and market analysis",
        description:
          "Understand the market through competitive analysis, industry trends, and practices your team can act on.",
      },
      {
        title: "Custom solutions",
        description:
          "Shape every report around the KPIs that matter to your team, your stakeholders, and your decision cycle.",
      },
    ],
    why: [
      {
        title: "Tailor-made insights",
        description:
          "Built with your team at every step, so the report answers the question you actually need to answer.",
      },
      {
        title: "Actionable recommendations",
        description:
          "Hatchet analysts turn raw data into strategy, content optimization, and next-step recommendations.",
      },
      {
        title: "Dedicated support",
        description:
          "Expert guidance across every plan keeps the reporting process clear from scope to delivery.",
      },
    ],
    metaDescription:
      "Work with Hatchet analysts on custom reports for influencer marketing, leagues, esports teams, sponsorships, brand lift, and market analysis.",
  },
  {
    slug: "api-data-integrations",
    name: "API & Data Integrations",
    eyebrow: "API & Data Integration",
    title: "Connect Hatchet data to your stack",
    subtitle:
      "Integrate our live streaming data into your product, or let us build custom dashboards for you. Use the data you need to power strategy and decisions in real time.",
    summary:
      "Push Hatchet's live streaming intelligence into your product, BI layer, attribution model, or custom dashboard.",
    bodyNote:
      "Bring Hatchet data into your systems, bring your first-party data into ours, or work with our team on a custom dashboard that fits how your organization already operates.",
    primaryCta: { label: "Talk to a specialist", href: siteConfig.bookDemoUrl },
    secondaryCta: { label: "Book a demo", href: siteConfig.bookDemoUrl },
    capabilities: [
      {
        title: "All major and minor platforms",
        description:
          "Access 20+ live streaming platforms, including Twitch, YouTube, Kick, Facebook Gaming, AfreecaTV, and more.",
      },
      {
        title: "Hundreds of endpoints",
        description:
          "Query viewership, engagement, stream metrics, and influencer performance with the detail your systems need.",
      },
      {
        title: "Attribution data",
        description:
          "Track campaign performance and conversions to understand the ROI of your streaming initiatives.",
      },
      {
        title: "First-party analytics",
        description:
          "Connect your own data, including Shopify conversions, form fills, and clicks, for more accurate attribution.",
      },
      {
        title: "Dedicated account management",
        description:
          "Get support to integrate, maintain, and run the API effectively for your business.",
      },
      {
        title: "Custom by design",
        description:
          "Tailor integrations and APIs to your team's needs, whether you are building one workflow or a full intelligence layer.",
      },
    ],
    why: [
      {
        title: "Flexible solutions",
        description:
          "Push our data into your systems, or bring your first-party data into Hatchet for richer analysis.",
      },
      {
        title: "The most accurate data on the market",
        description:
          "Minute-level granularity across 20+ platforms combines with demographics and social data for a sharper read.",
      },
      {
        title: "Dedicated support channels",
        description:
          "Get help building custom solutions, then keep them running with ongoing maintenance and support.",
      },
    ],
    metaDescription:
      "Connect Hatchet live streaming data to your stack with APIs, integrations, attribution data, first-party analytics, and custom dashboards.",
  },
] satisfies Omit<ProductSolution, "href">[];

function normalizeCta(cta: SolutionCta): SolutionCta {
  return {
    label: normalizeBrand(cta.label),
    href: cta.href,
  };
}

function normalizeTextPair(pair: SolutionTextPair): SolutionTextPair {
  return {
    title: normalizeBrand(pair.title),
    description: normalizeBrand(pair.description),
  };
}

function normalizeSolution(
  solution: Omit<ProductSolution, "href">,
): ProductSolution {
  return {
    ...solution,
    name: normalizeBrand(solution.name),
    eyebrow: normalizeBrand(solution.eyebrow),
    title: normalizeBrand(solution.title),
    subtitle: normalizeBrand(solution.subtitle),
    summary: normalizeBrand(solution.summary),
    bodyNote: normalizeBrand(solution.bodyNote),
    primaryCta: normalizeCta(solution.primaryCta),
    secondaryCta: solution.secondaryCta
      ? normalizeCta(solution.secondaryCta)
      : undefined,
    capabilities: solution.capabilities.map(normalizeTextPair),
    why: solution.why.map(normalizeTextPair),
    metaDescription: normalizeBrand(solution.metaDescription),
    href: `/solutions/${solution.slug}`,
  };
}

export const solutions = rawSolutions.map(normalizeSolution);

export const solutionsBySlug = Object.fromEntries(
  solutions.map((solution) => [solution.slug, solution]),
) as Record<SolutionSlug, ProductSolution>;

export function getSolution(slug: string): ProductSolution | undefined {
  return solutions.find((solution) => solution.slug === slug);
}
