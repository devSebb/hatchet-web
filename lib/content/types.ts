/**
 * Fields marked "mirrored" are populated by scripts/sync-wordpress.mjs from the
 * Stream Hatchet WordPress. They stay optional so the hand-written fixtures in
 * lib/content/fixtures/ remain valid without them.
 */

/** Where a mirrored item came from, for attribution and redirect mapping. */
interface Mirrored {
  /** mirrored — canonical URL on the source WordPress. */
  sourceUrl?: string;
}

/**
 * mirrored — the other renditions WordPress published for this cover, narrowest
 * first. Only same-aspect-ratio renditions are recorded; WordPress also
 * registers square and banner *crops*, which would make a browser swap in a
 * different framing of the picture at some viewport widths.
 *
 * Consumed by lib/image-loader.ts to build a srcSet. Absent when the upload has
 * only one size, or when the cover came from the og:image fallback.
 */
export type RemoteImageSize = {
  width: number;
  url: string;
};

export interface Post extends Mirrored {
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  category: string;
  tags: string[];
  coverImage?: string;
  coverImageSizes?: RemoteImageSize[];
  /** mirrored — alt text from the WordPress media library. */
  coverImageAlt?: string;
  publishedAt: string;
  /** mirrored — last edit on WordPress, ISO 8601. Absent when never edited. */
  updatedAt?: string;
  /** mirrored — Yoast's reading estimate, in whole minutes. */
  readingMinutes?: number;
  author?: {
    name: string;
  };
}

export interface CustomerStory extends Mirrored {
  slug: string;
  company: string;
  /**
   * Path to a logo image. Optional because mirrored stories have no logo asset
   * on WordPress — those resolve a vector mark from lib/brand/logos.ts by
   * company name instead, and fall back to the name as text.
   */
  logo?: string;
  /** Optional: mirrored landing pages carry no pull-quote. */
  quote?: string;
  metric?: string;
  industry?: string;
  summary: string;
  /** Empty when the story lives in a gated PDF rather than on the page. */
  contentHtml: string;
  /** mirrored — hero image for the story. */
  coverImage?: string;
  coverImageSizes?: RemoteImageSize[];
  /** mirrored — HubSpot form gating the full case study. */
  hubspotFormId?: string;
  /** mirrored — publication date, ISO 8601. */
  publishedAt?: string;
}

export interface Guide extends Mirrored {
  slug: string;
  title: string;
  summary: string;
  coverImage?: string;
  coverImageSizes?: RemoteImageSize[];
  gated: boolean;
  /**
   * mirrored — the HubSpot form gating this specific report. Reports each carry
   * their own form on WordPress, so this overrides the site-wide
   * NEXT_PUBLIC_HUBSPOT_GUIDE_FORM_ID when present.
   */
  hubspotFormId?: string;
  /** mirrored — section headings, used as "what's inside" bullets. */
  highlights?: string[];
  /** mirrored — publication date, ISO 8601. */
  publishedAt?: string;
  /**
   * mirrored — which shelf the report belongs to on the index. WordPress has no
   * taxonomy for this (reports are ordinary Pages), so the sync script reads it
   * off the title; see SERIES_OVERRIDES there for the exceptions. Absent on the
   * hand-written fixtures, which the index treats as "focused".
   */
  series?: GuideSeries;
  /**
   * mirrored — the year the report *covers*, which is not always the year it
   * shipped: the 2025 yearly report went up in January 2026.
   */
  year?: number;
  /** mirrored — 1-4 on the quarterly series, absent on every other. */
  quarter?: number;
}

export type GuideSeries = "quarterly" | "yearly" | "focused";

export interface PressItem {
  slug: string;
  title: string;
  outlet?: string;
  date: string;
  /**
   * Set when the item is coverage published elsewhere. Cards link straight out
   * to it rather than through a detail page, which would only restate the
   * headline. Absent for announcements Hatchet publishes itself.
   */
  url?: string;
  /** Optional: mirrored coverage is a headline and a link, with no summary. */
  excerpt?: string;
}

export interface ContentProvider {
  getPosts(): Promise<Post[]>;
  getPost(slug: string): Promise<Post | null>;
  getCustomerStories(): Promise<CustomerStory[]>;
  getCustomerStory(slug: string): Promise<CustomerStory | null>;
  getGuides(): Promise<Guide[]>;
  getGuide(slug: string): Promise<Guide | null>;
  getPressItems(): Promise<PressItem[]>;
  getPressItem(slug: string): Promise<PressItem | null>;
}
