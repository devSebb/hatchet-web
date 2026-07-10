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
  external?: boolean;
};

/** Keys resolved by components/solutions/visuals — one mock per feature. */
export type SolutionVisualKey =
  | "discovery-leaderboard"
  | "discovery-launch-intel"
  | "intelligence-mentions"
  | "intelligence-groups"
  | "intelligence-vod"
  | "intelligence-esports"
  | "intelligence-dashboards"
  | "creator-roster"
  | "creator-messaging"
  | "creator-codes"
  | "reporting-campaigns"
  | "reporting-custom";

export type SolutionHeroIcon = "find" | "analyze" | "execute" | "report";

export type SolutionHeroStat = {
  value: string;
  label: string;
};

export type SolutionSubFeature = {
  name: string;
  headline: string;
  body: string;
};

export type SolutionFeature = {
  /** Group heading rendered once when it first appears (e.g. "Deep Analytics"). */
  group?: string;
  /** Section label shown in the numbered eyebrow (e.g. "Creator Discovery"). */
  name: string;
  headline: string;
  body: string[];
  visual: SolutionVisualKey;
  /**
   * "stacked" puts the visual full-width under the copy (wide tables);
   * "split" is the default two-column layout, alternating sides.
   */
  layout?: "stacked" | "split";
  subFeatures?: SolutionSubFeature[];
};

export type ProductSolution = {
  slug: SolutionSlug;
  name: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: SolutionCta;
  secondaryCta?: SolutionCta;
  heroIcon: SolutionHeroIcon;
  /** Optional stat strip under the hero CTAs (Discovery only, per copy doc). */
  heroStats?: SolutionHeroStat[];
  features: SolutionFeature[];
  closingCta: {
    headline: string;
    subtitle: string;
    cta: SolutionCta;
  };
  metaDescription: string;
  href: `/solutions/${SolutionSlug}`;
};

const bookDemoCta = { label: "Book a Demo", href: siteConfig.bookDemoUrl };

const seeItInActionCta = {
  label: "See It In Action",
  href: "https://www.youtube.com/watch?v=XtzwA_VLr1o",
  external: true,
};

// Copy source: "Hatchet Website (7)" doc from the content team (July 2026).
// Text is verbatim by request — do not paraphrase without a new copy doc.
const rawSolutions = [
  {
    slug: "discovery",
    name: "Discovery",
    eyebrow: "Find & Verify",
    title: "Know before you commit.",
    subtitle:
      "Find the right creators, and the games that own streaming attention. Search 55M+ creators across 32 platforms with filters that actually matter: game played, audience demographics, language, and more. Flag inauthentic audiences before you sign.",
    primaryCta: bookDemoCta,
    secondaryCta: seeItInActionCta,
    heroIcon: "find",
    heroStats: [
      { value: "55M+", label: "Creators" },
      { value: "32", label: "Platforms" },
      { value: "10+ yrs", label: "Verified data" },
    ],
    features: [
      {
        name: "Creator Discovery",
        headline: "The leaderboard of every channel, on every platform.",
        body: [
          "Rank by Hours Watched, Peak/Avg CCV, Followers, Chat, or Socials. Filter by platform, game, language, country, gender, VTuber status, Twitch tags, and more. Then go deep: full creator profiles with demographics, stream history, audience overlap, and YouTube VODs broken down minute-by-minute.",
        ],
        visual: "discovery-leaderboard",
        layout: "stacked",
        subFeatures: [
          {
            name: "AI Smart Search",
            headline: "Describe the creator you need. Get a match.",
            body: "No manual filter setup. Describe the type of creator you're looking for in plain language, and Hatchet sets the filters for you.",
          },
          {
            name: "Fake Audience Scoring",
            headline: "Know before you commit.",
            body: "Flag and exclude channels with inflated metrics before a dollar of budget moves. Bot-inflated followers and fake audiences don't make it past the shortlist.",
          },
        ],
      },
      {
        name: "Game Discovery",
        headline: "Every game. Every level of detail.",
        body: [
          "Leaderboards by title, streaming category, genre, and publisher, across every platform you track. See Hours Watched, Peak/Avg CCV, and unique channels at a glance, then drill into audience overlap, top creators, and VOD performance for any title.",
          "For new releases, Launch Intelligence benchmarks Day 1 against historical averages and competitor launches, tracks the 7-day viewership trajectory, and surfaces the channels driving the spike, so every partnership decision starts with data, not a hunch.",
        ],
        visual: "discovery-launch-intel",
      },
    ],
    closingCta: {
      headline: "See the shortlist for yourself.",
      subtitle:
        "Book a 30-minute demo — we'll run a search on your next campaign brief.",
      cta: bookDemoCta,
    },
    metaDescription:
      "Find the right creators and the games that own streaming attention. Search 55M+ creators across 32 platforms, with AI smart search and fake-audience scoring built in.",
  },
  {
    slug: "intelligence",
    name: "Intelligence",
    eyebrow: "Analyze",
    title: "Every platform. One view.",
    subtitle:
      "Streaming and social data in one place. Compare, benchmark, and understand what's actually driving performance.",
    primaryCta: bookDemoCta,
    secondaryCta: seeItInActionCta,
    heroIcon: "analyze",
    features: [
      {
        group: "Brand & Audience Intelligence",
        name: "Chat and Stream Titles",
        headline: "Brand mentions, captured live.",
        body: [
          "Track every brand mentioned in stream titles and chat, across all platforms. Measure organic vs. campaign-driven presence, and find creators already talking about your brand before you even brief them. 30-day trends by channel, game, and platform.",
        ],
        visual: "intelligence-mentions",
      },
      {
        group: "Brand & Audience Intelligence",
        name: "Groups",
        headline: "Aggregate any set of creators, instantly.",
        body: [
          "Bundle your roster, prospects, or competitors and roll up every stat as a collective unit. Track a curated shortlist together in one view, with all standard metrics and filters applied automatically.",
        ],
        visual: "intelligence-groups",
      },
      {
        group: "Deep Analytics",
        name: "YouTube VOD Deep Analytics",
        headline: "Beyond live. The full video picture.",
        body: [
          "Track any VOD or Short — live or uploaded — with views, likes, comments, and performance trends. Same filters as live streaming data, so nothing gets lost switching formats.",
        ],
        visual: "intelligence-vod",
      },
      {
        group: "Deep Analytics",
        name: "Esports",
        headline: "Validate every sponsorship.",
        body: [
          "Tournament viewership and team profiles, historical event editions, and sponsorship benchmarking — verified numbers, not estimates.",
        ],
        visual: "intelligence-esports",
      },
      {
        group: "Deep Analytics",
        name: "Comparison & Analytics",
        headline: "One view. No manual work.",
        body: [
          "Custom dashboards and rankings benchmark channels, games, and platforms side by side. Executive-ready comparative views, export-ready when you need them.",
        ],
        visual: "intelligence-dashboards",
      },
    ],
    closingCta: {
      headline: "See what's actually driving performance.",
      subtitle: "Book a demo and bring your toughest cross-platform question.",
      cta: bookDemoCta,
    },
    metaDescription:
      "Streaming and social data in one place. Compare, benchmark, and understand what's actually driving performance with Hatchet Intelligence.",
  },
  {
    slug: "creator-community",
    name: "Creator Community",
    eyebrow: "Execute",
    title: "From first outreach to activated creator without leaving the platform.",
    subtitle:
      "Manage your entire creator roster from one place. Brief, track, and coordinate campaigns end-to-end via a single, customizable hub. No manual tracking.",
    primaryCta: bookDemoCta,
    secondaryCta: seeItInActionCta,
    heroIcon: "execute",
    features: [
      {
        name: "My Creators",
        headline: "Your full roster, every platform.",
        body: [
          "Add creators from Twitch, YouTube, TikTok, Kick, Facebook, Instagram, X, Tumblr, and more. Organize with custom labels — tier, region, vertical, campaign — and see live metrics: followers, avg viewers, engagement, audience overlap.",
        ],
        visual: "creator-roster",
      },
      {
        name: "Messaging",
        headline: "Outreach at any scale.",
        body: [
          "Message 1:1 or broadcast to a group, straight from the same place you manage creators. Gmail integration tracks delivery status — sent, replied, failed — so nothing falls through the cracks.",
        ],
        visual: "creator-messaging",
      },
      {
        name: "Code Management",
        headline: "Codes that track themselves.",
        body: [
          "Create, assign, and track promo codes per creator. Live redemption stats and ROI per creator give you direct conversion attribution beyond impressions.",
        ],
        visual: "creator-codes",
      },
    ],
    closingCta: {
      headline: "Run your next program from one hub.",
      subtitle:
        "Book a demo and see how a full creator roster moves through Hatchet, start to finish.",
      cta: bookDemoCta,
    },
    metaDescription:
      "Manage your entire creator roster from one place. Brief, track, and coordinate campaigns end-to-end via a single, customizable hub. No manual tracking.",
  },
  {
    slug: "reporting",
    name: "Reporting",
    eyebrow: "Report",
    title: "Your campaign report, auto-built.",
    subtitle:
      "Every campaign metric in one dashboard. Per-creator breakdowns, engagement, and export-ready reports your clients or stakeholders can easily understand.",
    primaryCta: bookDemoCta,
    secondaryCta: seeItInActionCta,
    heroIcon: "report",
    features: [
      {
        name: "Campaigns",
        headline: "Campaigns that report themselves.",
        body: [
          "Set up with keywords and creator labels, and Hatchet auto-tracks every post, mention, hour, and viewer from there. One dashboard covers total reach, brand mentions, active creators, and video views, with a per-creator breakdown and platform drill-down. Export to Excel when you need it.",
        ],
        visual: "reporting-campaigns",
        layout: "stacked",
      },
      {
        name: "Custom Reports",
        headline: "Tailor-made by our analyst team.",
        body: [
          "PDF or custom Hatchet dashboard, built around what your team actually reports on: Influencer Marketing, League & Event, Team Performance, Brand Lift & Sponsorship, Competitive Analysis. Don't see what you need? We'll build it.",
        ],
        visual: "reporting-custom",
      },
    ],
    closingCta: {
      headline: "Prove it worked.",
      subtitle:
        "Book a demo and see a real campaign report, built the way yours will be.",
      cta: bookDemoCta,
    },
    metaDescription:
      "Every campaign metric in one dashboard. Per-creator breakdowns, engagement, and export-ready reports your clients or stakeholders can easily understand.",
  },
] satisfies Omit<ProductSolution, "href">[];

function normalizeCta(cta: SolutionCta): SolutionCta {
  return {
    ...cta,
    label: normalizeBrand(cta.label),
  };
}

function normalizeSubFeature(sub: SolutionSubFeature): SolutionSubFeature {
  return {
    name: normalizeBrand(sub.name),
    headline: normalizeBrand(sub.headline),
    body: normalizeBrand(sub.body),
  };
}

function normalizeFeature(feature: SolutionFeature): SolutionFeature {
  return {
    ...feature,
    group: feature.group ? normalizeBrand(feature.group) : undefined,
    name: normalizeBrand(feature.name),
    headline: normalizeBrand(feature.headline),
    body: feature.body.map(normalizeBrand),
    subFeatures: feature.subFeatures?.map(normalizeSubFeature),
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
    primaryCta: normalizeCta(solution.primaryCta),
    secondaryCta: solution.secondaryCta
      ? normalizeCta(solution.secondaryCta)
      : undefined,
    features: solution.features.map(normalizeFeature),
    closingCta: {
      headline: normalizeBrand(solution.closingCta.headline),
      subtitle: normalizeBrand(solution.closingCta.subtitle),
      cta: normalizeCta(solution.closingCta.cta),
    },
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
