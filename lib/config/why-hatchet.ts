/**
 * Copy and data for /why-hatchet.
 *
 * Extracted from components/sections/WhyHatchetPoints.tsx, which is 869 lines
 * of rendering with the page's entire copy deck buried in the first 180. The
 * page file itself (app/why-hatchet/page.tsx) is 42 lines and contains none of
 * its own words — so "change the wording on Why Hatchet" previously meant
 * finding it inside a component nobody would think to open.
 *
 * ── For editors ───────────────────────────────────────────────────────────
 * POINTS      the five numbered sections, top to bottom. `eyebrow`,
 *             `headline` and `body` are free to edit. `id` is the displayed
 *             number and `visual` selects which graphic renders beside the
 *             text — neither is copy, and changing `visual` needs a developer.
 *
 * PLATFORMS   the platform roster behind point 01. Adding one is safe. The
 *             headline count below updates itself.
 *
 * Copy is Title Case for headlines, sentence case for body, matching the rest
 * of the site as shipped.
 */

export type PointVisual =
  | { kind: "platforms" }
  | { kind: "history" }
  | { kind: "logos" }
  | { kind: "intelligence" }
  | { kind: "lifecycle" };

export type Point = {
  id: string;
  eyebrow: string;
  headline: string;
  body: string;
  visual: PointVisual;
};

export const POINTS: Point[] = [
  {
    id: "01",
    eyebrow: "Platform coverage",
    headline: "Name a Platform, Any Platform...",
    body: "Twitch, YouTube, TikTok, Instagram, and many more. That's socials and streaming all connected without a single gap in coverage.",
    visual: { kind: "platforms" },
  },
  {
    id: "02",
    eyebrow: "Verified data, longest history",
    headline: "Solid bedrock of vetted viewership over 10+ years.",
    body: "Build your benchmarks based on real data. Hatchet flags fake and suspicious channels so you can safely navigate past inflated audiences and botted viewership.",
    visual: { kind: "history" },
  },
  {
    id: "03",
    eyebrow: "Experience with global gaming brands",
    headline: "The teams running gaming depend on Hatchet's guidance.",
    body: "Riot, EA, Ubisoft, Capcom and dozens more use Hatchet's insights to make campaign decisions with confidence, from game launches to esports tournaments.",
    visual: { kind: "logos" },
  },
  {
    id: "04",
    eyebrow: "Stay ahead of the industry",
    headline:
      "Get the inside track on emerging trends in gaming & online culture.",
    body: "Analyst-written reports, expert insights, and market intelligence parse public sentiment so you can act before competitors.",
    visual: { kind: "intelligence" },
  },
  {
    id: "05",
    eyebrow: "One platform, built for you",
    headline: "Everything your team needs in one place.",
    body: "Find, analyze, execute, report: Do it all from a single, customized space that fits seamlessly into your style and workflow.",
    visual: { kind: "lifecycle" },
  },
];

// ── 01 · Platform coverage ─────────────────────────────────────────────────

export type PlatformCategory = "live" | "social";

export type Platform = {
  /** Canonical name. Doubles as the PLATFORM_ICONS lookup key. */
  name: string;
  categories: PlatformCategory[];
  /**
   * Per-tab display override, for platforms the industry names differently
   * depending on the surface: TikTok and Facebook are "TikTok Live" and
   * "Facebook Live" under Live Streaming, but keep their plain names under Social.
   */
  labels?: Partial<Record<PlatformCategory, string>>;
  /**
   * Borrow another entry's glyph, for platforms that share a brand mark with a
   * sibling: the retired global SOOP is the same brand as SOOP Korea.
   */
  icon?: string;
  /**
   * Archived: Hatchet still holds this platform's history and it stays queryable,
   * but no new data is collected. Rendered in a muted grey and sorted to the end
   * of whichever list it appears in.
   */
  legacy?: boolean;
};

export const PLATFORM_CATEGORIES: {
  id: "all" | PlatformCategory;
  label: string;
}[] = [
  { id: "all", label: "All Platforms" },
  { id: "live", label: "Live Streaming" },
  { id: "social", label: "Social" },
];

export const PLATFORMS: Platform[] = [
  { name: "Twitch", categories: ["live", "social"] },
  { name: "YouTube Gaming", categories: ["live"] },
  { name: "YouTube", categories: ["live", "social"] },
  {
    name: "TikTok",
    categories: ["live", "social"],
    labels: { live: "TikTok Live" },
  },
  { name: "Kick", categories: ["live", "social"] },
  { name: "Instagram", categories: ["social"] },
  {
    name: "Facebook",
    categories: ["live", "social"],
    labels: { live: "Facebook Live" },
  },
  { name: "X", categories: ["social"] },
  { name: "Discord", categories: ["social"] },
  { name: "Reddit", categories: ["social"] },
  { name: "Snapchat", categories: ["social"] },
  { name: "LinkedIn", categories: ["social"] },
  { name: "Steam", categories: ["live"] },
  { name: "Bilibili", categories: ["live"] },
  { name: "Huya", categories: ["live"] },
  { name: "Douyu", categories: ["live"] },
  { name: "SOOP Korea", categories: ["live"] },
  { name: "SOOP", categories: ["live"], icon: "SOOP Korea", legacy: true },
  { name: "Chzzk", categories: ["live"] },
  { name: "NimoTV", categories: ["live"] },
  { name: "Zhanqi", categories: ["live"] },
  { name: "Bigo Live", categories: ["live"] },
  { name: "Rumble", categories: ["live"] },
  { name: "Trovo", categories: ["live"], legacy: true },
  { name: "DLive", categories: ["live"], legacy: true },
  { name: "KakaoTV", categories: ["live"], legacy: true },
  { name: "NaverTV", categories: ["live"], legacy: true },
  { name: "Loco", categories: ["live"], legacy: true },
  { name: "Rooter", categories: ["live"] },
  { name: "VK", categories: ["live"] },
  { name: "Mildom", categories: ["live"], legacy: true },
  { name: "Nonolive", categories: ["live"], legacy: true },
  { name: "Booyah", categories: ["live"], legacy: true },
  { name: "Smashcast", categories: ["live"], legacy: true },
  { name: "Garena LIVE", categories: ["live"], legacy: true },
  { name: "Mixer", categories: ["live"], legacy: true },
  { name: "CubeTV", categories: ["live"], legacy: true },
  { name: "Openrec", categories: ["live"] },
  { name: "Spotify", categories: ["social"] },
  { name: "SoundCloud", categories: ["social"] },
  { name: "Pinterest", categories: ["social"] },
  { name: "Tumblr", categories: ["social"] },
  { name: "Medium", categories: ["social"] },
  { name: "Patreon", categories: ["social"] },
  { name: "Website", categories: ["social"] },
  { name: "Blog", categories: ["social"] },
  { name: "Yelp", categories: ["social"] },
  { name: "Foursquare", categories: ["social"] },
  { name: "Hudl", categories: ["social"] },
  { name: "MLG", categories: ["social"] },
  { name: "Flickr", categories: ["social"] },
  { name: "Dribbble", categories: ["social"] },
  { name: "500px", categories: ["social"] },
  { name: "VSCO", categories: ["social"] },
  { name: "Reverb Nation", categories: ["social"] },
  { name: "about.me", categories: ["social"] },
];

// Rounded down to the nearest ten so the headline figure stays honest as the
// roster shifts, rather than drifting away from a hardcoded string.
export const TRACKED_PLATFORM_COUNT = PLATFORMS.filter((p) => !p.legacy).length;
export const TRACKED_PLATFORM_STAT = `${Math.floor(TRACKED_PLATFORM_COUNT / 10) * 10}+`;
