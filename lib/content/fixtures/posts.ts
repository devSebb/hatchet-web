import type { Post } from "@/lib/content/types";

export const posts = [
  {
    slug: "creator-velocity-after-launch-week",
    title: "What creator velocity reveals after launch week",
    excerpt:
      "Launch-week viewership is only the first read. The stronger signal is how fast creators keep returning once paid beats and preview access settle.",
    contentHtml:
      "<p>Launch week gives teams the first public read on demand, but the sharper measure is creator velocity after the campaign window closes.</p><p>Hatchet teams track repeat creator coverage, category lift, and audience retention together so publishers can separate launch noise from durable market interest.</p>",
    category: "Game launches",
    tags: ["creators", "launches", "viewership"],
    coverImage: "/images/content/creator-velocity.svg",
    publishedAt: "2025-01-14T10:00:00.000Z",
    author: { name: "Hatchet Insights" },
  },
  {
    slug: "esports-co-streaming-audience-signal",
    title: "Co-streaming changed the esports audience signal",
    excerpt:
      "Co-streaming now shapes how fans discover matches, sponsors, and teams. Measurement needs to follow the audience across official and creator-led coverage.",
    contentHtml:
      "<p>Official broadcasts still matter, but esports audience behavior is increasingly distributed through creator-led coverage and watch-party formats.</p><p>That changes how teams evaluate event reach, sponsor visibility, and long-tail fan engagement.</p>",
    category: "Esports",
    tags: ["esports", "co-streaming", "sponsorship"],
    coverImage: "/images/content/esports-co-streaming.svg",
    publishedAt: "2025-02-06T10:00:00.000Z",
    author: { name: "Hatchet Insights" },
  },
  {
    slug: "hours-watched-is-not-enough",
    title: "Why hours watched is not enough for market reads",
    excerpt:
      "Hours watched is a useful headline number. It becomes decision-grade only when paired with creator mix, platform spread, chat movement, and press context.",
    contentHtml:
      "<p>Hours watched is a clean metric for reporting scale, but it does not explain why an audience moved or whether momentum is likely to continue.</p><p>Hatchet combines watch time with creator mix, game taxonomy, press coverage, and community signals to build a clearer market read.</p>",
    category: "Analytics",
    tags: ["measurement", "audience", "signals"],
    coverImage: "/images/content/hours-watched.svg",
    publishedAt: "2025-03-18T10:00:00.000Z",
    author: { name: "Hatchet Research" },
  },
  {
    slug: "brands-should-watch-community-spikes",
    title: "Brands should watch community spikes before media plans lock",
    excerpt:
      "Audience spikes around games, creators, and formats often appear before paid plans are finalized. Those signals can improve timing and partner selection.",
    contentHtml:
      "<p>Gaming audiences often move before a campaign brief is final. A creator challenge, patch cycle, tournament result, or community topic can shift attention quickly.</p><p>Teams that monitor these spikes can pick better partners, avoid stale categories, and time activations closer to real demand.</p>",
    category: "Brands",
    tags: ["brands", "community", "planning"],
    coverImage: "/images/content/community-spikes.svg",
    publishedAt: "2025-04-09T10:00:00.000Z",
    author: { name: "Hatchet Strategy" },
  },
  {
    slug: "platform-fragmentation-live-streaming",
    title: "Platform fragmentation is the new normal in live streaming",
    excerpt:
      "Gaming audiences are spread across Twitch, YouTube, TikTok, Kick, Steam, and regional platforms. Research teams need one normalized view.",
    contentHtml:
      "<p>Live-streaming discovery is no longer concentrated on one destination. Audiences move across global, regional, short-form, and game-native surfaces.</p><p>A normalized measurement layer helps research teams compare momentum without rebuilding platform logic for every readout.</p>",
    category: "Market research",
    tags: ["platforms", "research", "live streaming"],
    coverImage: "/images/content/platform-fragmentation.svg",
    publishedAt: "2025-05-21T10:00:00.000Z",
    author: { name: "Hatchet Research" },
  },
] satisfies Post[];
