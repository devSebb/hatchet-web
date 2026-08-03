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

export interface Post extends Mirrored {
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  category: string;
  tags: string[];
  coverImage?: string;
  publishedAt: string;
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
}

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
