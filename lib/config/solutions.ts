import { normalizeBrand } from "@/lib/content/providers/wordpress";
import { siteConfig } from "@/lib/config/site";

export type SolutionSlug =
  | "discovery"
  | "intelligence"
  | "creator-community"
  | "reporting";

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

// NOTE: Solutions are framed as the four stages of the creator lifecycle
// (Find & Verify → Analyze → Execute → Report). Capabilities marked with a
// trailing {{VERIFY}} describe product behavior that has no prior source copy;
// content/product to confirm the claim before launch.
const rawSolutions = [
  {
    slug: "discovery",
    name: "Discovery",
    eyebrow: "Find & Verify",
    title: "Find the right creators and verify them before you commit.",
    subtitle:
      "Describe the creator you need and get a match. Hatchet's AI search surfaces the right channels, then scores audience quality so you know who is real before a dollar moves.",
    summary:
      "Search by what you actually need, then verify audience authenticity with fake-follower scoring and suspicious-channel flags.",
    bodyNote:
      "Discovery runs on the same live signal as the rest of Hatchet, so the creators you shortlist carry their full history straight into analysis and campaigns.",
    primaryCta: { label: "Book a demo", href: siteConfig.bookDemoUrl },
    secondaryCta: { label: "Start free trial", href: siteConfig.signUpUrl },
    capabilities: [
      {
        title: "AI Smart Search",
        description:
          "Describe the creator you need in plain language and get a ranked match across 20+ platforms, instead of filtering by hand. {{VERIFY}}",
      },
      {
        title: "Fake audience scoring",
        description:
          "Score follower and viewer authenticity to spot inflated or bot-driven audiences before you commit budget. {{VERIFY}}",
      },
      {
        title: "Suspicious channel flagging",
        description:
          "Automatic flags surface bought engagement, irregular growth, and risky channels while you shortlist. {{VERIFY}}",
      },
      {
        title: "Creator discovery across platforms",
        description:
          "Find creators making content on any topic, then track relevance across gaming and non-gaming YouTube VODs.",
      },
      {
        title: "Audience fit",
        description:
          "Understand viewer demographics, preferences, and behavior so the creators you pick match the audience you want to grow.",
      },
      {
        title: "Shortlist to roster",
        description:
          "Move verified creators straight into outreach and your roster. No spreadsheets, no copy-paste between tools.",
      },
    ],
    why: [
      {
        title: "Know before you commit",
        description:
          "Verify audience quality up front so spend goes to creators with real, engaged audiences.",
      },
      {
        title: "Describe it, don't filter it",
        description:
          "Natural-language search replaces hours of manual filtering with a ranked shortlist. {{VERIFY}}",
      },
      {
        title: "One connected workflow",
        description:
          "Verified creators carry into analysis, execution, and reporting without re-importing data.",
      },
    ],
    metaDescription:
      "Find and verify creators with Hatchet Discovery: AI smart search, fake-audience scoring, suspicious-channel flagging, and audience-fit analysis across 20+ platforms.",
  },
  {
    slug: "intelligence",
    name: "Intelligence",
    eyebrow: "Analyze",
    title: "Streaming and social campaign analytics in one view.",
    subtitle:
      "Measure live viewership, esports, and social performance side by side. Hatchet unifies cross-platform signal so your team reads the market from one place instead of stitching exports.",
    summary:
      "Track real-time and historical performance across streaming and social: viewership, esports, competitors, and audience, all in one workspace.",
    bodyNote:
      "Intelligence draws on minute-level data going back to 2016 across 20+ platforms, so every read is grounded in the same source the rest of your team uses.",
    primaryCta: { label: "Book a demo", href: siteConfig.bookDemoUrl },
    secondaryCta: { label: "Start free trial", href: siteConfig.signUpUrl },
    capabilities: [
      {
        title: "Live streaming viewership",
        description:
          "Track real-time and historical viewership at minute-level granularity across every major platform, with data going back to 2016.",
      },
      {
        title: "Esports measurement",
        description:
          "Measure tournaments, teams, player performances, engagement, and the global impact of esports events.",
      },
      {
        title: "Cross-platform campaign analytics",
        description:
          "See streaming and social performance for a campaign in one normalized view, instead of stitching platform exports. {{VERIFY}}",
      },
      {
        title: "Competitor analysis",
        description:
          "Benchmark your metrics against the market, spot strengths and gaps, and make the next move with evidence.",
      },
      {
        title: "Speech and logo recognition",
        description:
          "Use speech recognition, logo recognition, Twitch tags, and advanced tooling across 20+ platforms.",
      },
      {
        title: "Audience insights",
        description:
          "Understand viewer demographics, preferences, and behavior across the channels you track.",
      },
    ],
    why: [
      {
        title: "One unified read",
        description:
          "A single cross-platform view keeps every team aligned around the same market picture.",
      },
      {
        title: "Real-time and historical",
        description:
          "Live and historical data help teams move fast without losing the context behind the number.",
      },
      {
        title: "Built for gaming decisions",
        description:
          "Metrics fit launches, sponsorships, esports, and market sizing without translating generic media numbers.",
      },
    ],
    metaDescription:
      "Analyze streaming and social performance in one view with Hatchet Intelligence: live viewership, esports measurement, competitor analysis, and audience insight.",
  },
  {
    slug: "creator-community",
    name: "Creator Community",
    eyebrow: "Execute",
    title: "Run every creator relationship end to end.",
    subtitle:
      "My Creators is your roster and CRM in one. Manage outreach, contracts, payments, and deliverables for every creator and campaign. No spreadsheets, with attribution built in.",
    summary:
      "Manage your creator roster and campaigns end to end: outreach, contracts, payments, deliverables, and conversion-level attribution.",
    bodyNote:
      "Creator Community shares the same data as discovery and analytics, so verified creators and their performance flow straight into live campaigns.",
    primaryCta: { label: "Book a demo", href: siteConfig.bookDemoUrl },
    secondaryCta: { label: "Start free trial", href: siteConfig.signUpUrl },
    capabilities: [
      {
        title: "My Creators roster and CRM",
        description:
          "Keep every creator relationship in one roster: contacts, status, history, and notes in a single place. {{VERIFY}}",
      },
      {
        title: "End-to-end campaign management",
        description:
          "Run campaigns from outreach to delivery: manage contracts, payments, and deliverables in one place, no spreadsheets.",
      },
      {
        title: "Conversion-level attribution",
        description:
          "Attribute conversions to creators and campaigns so you know what actually drove results.",
      },
      {
        title: "Team and creator performance",
        description:
          "Track team and creator performance across campaigns and social platforms.",
      },
      {
        title: "Outreach and recruiting",
        description:
          "Discover, recruit, and onboard creators directly from your shortlist into active campaigns.",
      },
      {
        title: "Roster-wide visibility",
        description:
          "See status, deliverables, and spend across your whole roster at a glance. {{VERIFY}}",
      },
    ],
    why: [
      {
        title: "No more spreadsheets",
        description:
          "One system for roster, contracts, payments, and deliverables replaces scattered files.",
      },
      {
        title: "Verified to live in one flow",
        description:
          "Creators verified in discovery move straight into managed campaigns.",
      },
      {
        title: "Attribution by default",
        description:
          "Every campaign ties back to conversions, so ROI is built in, not bolted on.",
      },
    ],
    metaDescription:
      "Execute campaigns with Hatchet Creator Community: a My Creators roster and CRM for outreach, contracts, payments, deliverables, and conversion-level attribution.",
  },
  {
    slug: "reporting",
    name: "Reporting",
    eyebrow: "Report",
    title: "Campaign reporting that's ready to share.",
    subtitle:
      "Turn live signal into ready-to-use readouts: EMV, engagement, and per-creator breakdowns in a campaigns dashboard, plus analyst-built custom reports and clean exports.",
    summary:
      "Report on campaigns with EMV, engagement, and per-creator breakdowns, self-serve in the dashboard or analyst-built for strategic decisions.",
    bodyNote:
      "Reports can be delivered as PDFs, inside your Hatchet dashboard, or pushed to your stack via API, with first-party data connected for sharper attribution.",
    primaryCta: { label: "Get a custom quote", href: siteConfig.bookDemoUrl },
    secondaryCta: { label: "Book a demo", href: siteConfig.bookDemoUrl },
    capabilities: [
      {
        title: "Campaigns dashboard",
        description:
          "Track EMV, engagement, and per-creator breakdowns for every campaign in one dashboard. {{VERIFY}}",
      },
      {
        title: "Brand lift and sponsorship",
        description:
          "Measure campaigns with audience chat data, logo presence share, earned media value (EMV), CPM, speech recognition, and viewership data.",
      },
      {
        title: "Ready-to-use exports",
        description:
          "Export clean readouts to Excel, PDF, and Google Sheets, ready to share with stakeholders.",
      },
      {
        title: "Analyst-built custom reports",
        description:
          "Work one-on-one with Hatchet analysts to build the exact report your team needs. If you do not see it, we will build it.",
      },
      {
        title: "League, event, and team reporting",
        description:
          "Track viewer behavior, churn, and retention, then report team and event performance to support sponsorships.",
      },
      {
        title: "Attribution and first-party data",
        description:
          "Connect Shopify conversions, form fills, and clicks for sharper attribution, and push reports into your stack via API.",
      },
    ],
    why: [
      {
        title: "Ready to share",
        description:
          "Readouts are framed as evidence, formatted for stakeholders, and exportable on demand.",
      },
      {
        title: "Self-serve or analyst-built",
        description:
          "Pull your own dashboard report, or have Hatchet analysts build a tailored deliverable.",
      },
      {
        title: "Connected to your stack",
        description:
          "Attribution and API access tie reporting back to the systems your team already runs.",
      },
    ],
    metaDescription:
      "Report on campaigns with Hatchet: EMV, engagement, and per-creator breakdowns, brand-lift measurement, analyst-built custom reports, and ready-to-use exports.",
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
