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

export type SolutionGroupIntro = {
  headline: string;
  body: string;
};

export type SolutionFeature = {
  /** Group heading rendered once when it first appears (e.g. "Deep Analytics"). */
  group?: string;
  /**
   * Intro headline + body rendered alongside the group heading when the group
   * first appears (the PDF's "1. Brand & Audience Intelligence" section lead).
   */
  groupIntro?: SolutionGroupIntro;
  /** Section label shown in the numbered eyebrow (e.g. "Creator Discovery"). */
  name: string;
  headline: string;
  body: string[];
  /** Omit for copy-only sections; the copy then runs full-width. */
  visual?: SolutionVisualKey;
  /**
   * "stacked" puts the visual full-width under the copy (wide tables);
   * "split" is the default two-column layout, alternating sides.
   * Ignored when there's no visual.
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
    /** "Looking For One Tool That Does It All?" lifecycle cross-sell block. */
    crossSell?: {
      title: string;
      body: string;
      /**
       * `phrase` must appear verbatim in `body` — it's the run of text that
       * becomes the link. normalizeCrossSell throws at module load if it
       * doesn't match, so a copy edit fails the build instead of silently
       * rendering the sentence unlinked.
       */
      link: { phrase: string; href: string };
    };
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

/** Points at the home page's lifecycle orbital (CreatorLifecycle's anchor). */
const lifecycleCrossSellLink = {
  phrase: "Check out our other Solutions pages",
  href: "/#how-it-works",
};

// Copy source: "Hatchet Website (8)" doc from the content team (July 2026).
// Text is verbatim by request — do not paraphrase without a new copy doc.
const rawSolutions = [
  {
    slug: "discovery",
    name: "Discovery",
    eyebrow: "Find & Verify",
    title: "Find creators and games getting attention online.",
    subtitle:
      "Search 50M+ creators across 30+ platforms, filtering by what your partnership needs: Games played, audience makeup, language, and more.",
    primaryCta: bookDemoCta,
    secondaryCta: seeItInActionCta,
    heroIcon: "find",
    heroStats: [
      { value: "50M+", label: "Creators" },
      { value: "30+", label: "Platforms" },
      { value: "10+ yrs", label: "Verified data" },
    ],
    features: [
      {
        name: "Creator Discovery",
        headline: "Every creator across every platform.",
        body: [
          "Discover creators worth knowing about, ranked and ready to compare. Sort by hours watched, concurrent viewers, followers, chat activity, or social reach, then narrow things down by platform, game, language, and country, right through to niche filters like VTuber status and Twitch tags.",
          "Once you've decided someone's worth a closer look, their full profile is waiting: Demographics, stream history, audience overlap, even a minute-by-minute breakdown of their YouTube VODs.",
        ],
        visual: "discovery-leaderboard",
        layout: "stacked",
        subFeatures: [
          {
            name: "AI Smart Search",
            headline: "Describe the creator you need. Get a match.",
            body: "Tell Hatchet what you're looking for in plain language, and it sets the search up for you with all relevant filters.",
          },
          {
            name: "Fake Audience Scoring",
            headline: "Spot a fake before it costs you.",
            body: "Inflated followers and bot-built audiences get flagged and filtered out automatically, so nothing with a fake footprint makes it onto your shortlist.",
          },
        ],
      },
      {
        name: "Game Discovery",
        headline: "Every game at every level of detail.",
        body: [
          "The same depth, applied to games instead of channels. Rank games by streaming category, genre, or publisher across every platform, and see hours watched, concurrent viewers, and unique channels at a glance. From there, go deeper: Find out about audience overlap, top creators, and VOD performance for any title you're evaluating.",
        ],
        visual: "discovery-launch-intel",
        subFeatures: [
          {
            name: "Launch Comparison",
            headline: "Debut viewerships put in perspective.",
            body: "New releases get their own lens. Track first day, week or months performance and benchmark against historical averages and competitor launches.",
          },
        ],
      },
    ],
    closingCta: {
      headline: "See the shortlist for yourself.",
      subtitle:
        "Book a 30-minute demo. We'll run a search on your next campaign brief.",
      cta: bookDemoCta,
      crossSell: {
        title: "Looking For One Tool That Does It All?",
        body: "Discovering creators is just the first step in your full creator lifecycle. Check out our other Solutions pages to see how Hatchet can cut down your workload with full creator lifecycle management.",
        link: lifecycleCrossSellLink,
      },
    },
    metaDescription:
      "Find the right creators and the games that own streaming attention. Search 50M+ creators across 30+ platforms, with AI smart search and fake-audience scoring built in.",
  },
  {
    slug: "intelligence",
    name: "Intelligence",
    eyebrow: "Analyze",
    title: "Analyze streaming and social data in one view.",
    subtitle:
      "Audience insights from across the internet combined into a single place. Compare, benchmark, and understand what's driving performance.",
    primaryCta: bookDemoCta,
    secondaryCta: seeItInActionCta,
    heroIcon: "analyze",
    features: [
      {
        group: "Brand & Audience Intelligence",
        groupIntro: {
          headline: "Know who's watching and who's chatting.",
          body: "This is where audience and brand context come together in one place, uncovering the connection between communities and companies they can trust.",
        },
        name: "Chat Analysis and Stream Titles",
        headline: "Brand mentions and sentiment from real-time conversations.",
        body: [
          "Track every brand mentioned in stream titles and chat, across all platforms. Measure organic vs. campaign-driven presence, and find creators already talking about your brand before you've even reached out.",
        ],
        visual: "intelligence-mentions",
      },
      {
        group: "Brand & Audience Intelligence",
        name: "Groups",
        headline: "Aggregate any set of creators, instantly.",
        body: [
          "Bundle your roster, prospects, or competitors and roll up every stat as a collective unit for easier comparison. Track a curated shortlist together in one view, with all standard metrics and filters applied automatically.",
        ],
        visual: "intelligence-groups",
      },
      {
        group: "Deep Analytics",
        groupIntro: {
          headline: "Delve deeper than the headline numbers.",
          body: "Beyond the standard metrics, drill into video, esports, and cross-platform data at a granular level and in more unique areas of the online landscape.",
        },
        name: "YouTube VODs and Shorts",
        headline: "Go past live and get the full video picture.",
        body: [
          "Track views, likes, comments, and performance trends on VODs and Shorts, using the same filters as your live streaming data, so you can see how reach and engagement keep building long after the stream ends.",
        ],
        visual: "intelligence-vod",
      },
      {
        group: "Deep Analytics",
        name: "Esports",
        headline: "Validate every sponsorship.",
        body: [
          "Tournament viewership and team profiles, historical event editions, and co-streaming impact all custom pulled based on specific events and esports titles.",
        ],
        visual: "intelligence-esports",
      },
    ],
    closingCta: {
      headline: "See what's driving performance.",
      subtitle:
        "Book a demo and answer your toughest cross-platform questions.",
      cta: bookDemoCta,
      crossSell: {
        title: "Looking For One Tool That Does It All?",
        body: "Generating insights is just the second step in your full creator lifecycle. Check out our other Solutions pages to see how Hatchet can cut down your workload with full creator lifecycle management.",
        link: lifecycleCrossSellLink,
      },
    },
    metaDescription:
      "Streaming and social data in one place. Compare, benchmark, and understand what's actually driving performance with Hatchet Intelligence.",
  },
  {
    slug: "creator-community",
    name: "Creator Community",
    eyebrow: "Build",
    title: "Build communities, from outreach to activation.",
    subtitle:
      "Manage your entire creator roster from one place. Brief, track, and coordinate campaigns end-to-end via a single, customizable hub. Every step from outreach to activation happens right where you already manage your roster, so nothing needs tracking twice.",
    primaryCta: bookDemoCta,
    secondaryCta: seeItInActionCta,
    heroIcon: "execute",
    features: [
      {
        name: "My Creators",
        headline: "Your full roster across every platform.",
        body: [
          "Add creators from Twitch, YouTube, TikTok, Kick, Facebook, Instagram, X, Tumblr, and more. Organize with custom labels to suit your workflow (such as tier, region, vertical, and campaign), and see live metrics like followers, average viewers, engagement, and audience overlap.",
        ],
        visual: "creator-roster",
      },
      {
        name: "Messaging",
        headline: "Outreach at any scale.",
        body: [
          "Message 1:1 or broadcast to a group, straight from the same place you manage creators. Gmail integrates with Hatchet to track delivery status so nothing falls through the cracks.",
        ],
        visual: "creator-messaging",
      },
      {
        name: "Code Management",
        headline: "Codes that track themselves.",
        body: [
          "Create, assign, and track promo codes per creator. Live redemption stats and ROI per creator give you direct conversion attribution beyond simple impressions.",
        ],
        visual: "creator-codes",
      },
    ],
    closingCta: {
      headline: "See your next program run from one hub.",
      subtitle:
        "Book a demo and see how a full creator roster comes together in Hatchet.",
      cta: bookDemoCta,
      crossSell: {
        title: "Looking For One Tool That Does It All?",
        body: "Building your creator community is just the third step in your full creator lifecycle. Check out our other Solutions pages to see how Hatchet can cut down your workload with full creator lifecycle management.",
        link: lifecycleCrossSellLink,
      },
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
      {
        name: "Customer Success",
        headline: "Set up right. Never left on your own.",
        body: [
          "Every account starts with an onboarding call, so your team is live and confident from day one. From there, a Customer Success rep stays on as an open line — monthly check-ins, and adjustments as your reporting needs change.",
        ],
      },
    ],
    closingCta: {
      headline: "Prove it worked.",
      subtitle:
        "Book a demo and see a real campaign report, built the way yours will be.",
      cta: bookDemoCta,
      crossSell: {
        title: "Looking For One Tool That Does It All?",
        body: "Reporting results is just the fourth step in your full creator lifecycle. Check out our other Solutions pages to see how Hatchet can cut down your workload with full creator lifecycle management.",
        link: lifecycleCrossSellLink,
      },
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
    groupIntro: feature.groupIntro
      ? {
          headline: normalizeBrand(feature.groupIntro.headline),
          body: normalizeBrand(feature.groupIntro.body),
        }
      : undefined,
    name: normalizeBrand(feature.name),
    headline: normalizeBrand(feature.headline),
    body: feature.body.map(normalizeBrand),
    subFeatures: feature.subFeatures?.map(normalizeSubFeature),
  };
}

type CrossSell = NonNullable<ProductSolution["closingCta"]["crossSell"]>;

/** normalizeBrand rewrites the body, so the phrase is checked post-normalize —
 *  that's the string CrossSellNote actually splits on. */
function normalizeCrossSell(
  crossSell: CrossSell,
  slug: SolutionSlug,
): CrossSell {
  const body = normalizeBrand(crossSell.body);
  const phrase = normalizeBrand(crossSell.link.phrase);

  if (!body.includes(phrase)) {
    throw new Error(
      `[solutions:${slug}] crossSell.link.phrase ${JSON.stringify(phrase)} is not present in crossSell.body. ` +
        "The cross-sell link is rendered by splitting the body on that phrase — fix the phrase or the copy so they match.",
    );
  }

  return {
    title: normalizeBrand(crossSell.title),
    body,
    link: { phrase, href: crossSell.link.href },
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
      crossSell: solution.closingCta.crossSell
        ? normalizeCrossSell(solution.closingCta.crossSell, solution.slug)
        : undefined,
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
