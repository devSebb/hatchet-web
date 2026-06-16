import type { CustomerStory } from "@/lib/content/types";

export const customerStories = [
  {
    slug: "riot-launch-readout",
    company: "Riot",
    logo: "/images/logos/riot.svg",
    quote:
      "Hatchet helped our team see creator pickup, regional lift, and audience quality in the same launch readout.",
    metric: "32% faster launch reporting",
    industry: "Games publisher",
    summary:
      "A publisher launch team used Hatchet to compare creator coverage, category movement, and post-launch retention across platforms.",
    contentHtml:
      "<p>Riot needed a fast read on creator coverage after a major game beat. Hatchet normalized the live-streaming signal across platforms and highlighted where audience attention held after launch-week spikes.</p>",
  },
  {
    slug: "playstation-creator-partnering",
    company: "PlayStation",
    logo: "/images/logos/playstation.svg",
    quote:
      "The team could compare creators by real audience movement instead of relying only on follower counts.",
    metric: "4 markets prioritized",
    industry: "Brand partnerships",
    summary:
      "A brand partnerships team used Hatchet to shortlist creator partners by audience movement, category fit, and market momentum.",
    contentHtml:
      "<p>PlayStation needed to understand which creators were moving conversation in priority markets. Hatchet combined viewership, creator activity, and game context to support a sharper partner shortlist.</p>",
  },
  {
    slug: "nascar-esports-broadcast-benchmark",
    company: "NASCAR",
    logo: "/images/logos/nascar.svg",
    quote:
      "Hatchet gave us a consistent benchmark for official broadcasts, creator coverage, and sponsor visibility.",
    metric: "18 events benchmarked",
    industry: "Esports and sports media",
    summary:
      "An esports media team used Hatchet to benchmark event performance, co-streaming lift, and audience retention across a season.",
    contentHtml:
      "<p>NASCAR tracked live event performance across official and creator-led coverage. Hatchet created a repeatable benchmark for audience scale, engagement patterns, and sponsor-facing reporting.</p>",
  },
] satisfies CustomerStory[];
