import generatedGuides from "@/lib/content/generated/guides.json";
import generatedPosts from "@/lib/content/generated/posts.json";
import generatedPress from "@/lib/content/generated/press.json";
import generatedStories from "@/lib/content/generated/customer-stories.json";
import type {
  ContentProvider,
  CustomerStory,
  Guide,
  Post,
  PressItem,
} from "@/lib/content/types";

/**
 * Serves the WordPress snapshot committed under lib/content/generated/.
 *
 * The snapshot is produced by `pnpm sync:wp` (scripts/sync-wordpress.mjs), not
 * fetched at request time, so no page depends on WordPress being reachable and
 * an outage can never break a build. Refreshing content is a sync plus a commit.
 *
 * Every stream here is real source content — nothing falls back to the
 * hand-written fixtures in lib/content/fixtures/, which exist only for
 * CONTENT_SOURCE=mock.
 */

const guides = generatedGuides as Guide[];
const posts = generatedPosts as Post[];
const customerStories = generatedStories as CustomerStory[];
const pressItems = generatedPress as PressItem[];

function findBySlug<T extends { slug: string }>(
  items: readonly T[],
  slug: string,
): T | null {
  return items.find((item) => item.slug === slug) ?? null;
}

export const wordpressProvider: ContentProvider = {
  async getPosts(): Promise<Post[]> {
    return posts;
  },

  async getPost(slug: string): Promise<Post | null> {
    return findBySlug(posts, slug);
  },

  async getCustomerStories(): Promise<CustomerStory[]> {
    return customerStories;
  },

  async getCustomerStory(slug: string): Promise<CustomerStory | null> {
    return findBySlug(customerStories, slug);
  },

  async getGuides(): Promise<Guide[]> {
    return guides;
  },

  async getGuide(slug: string): Promise<Guide | null> {
    return findBySlug(guides, slug);
  },

  async getPressItems(): Promise<PressItem[]> {
    return pressItems;
  },

  async getPressItem(slug: string): Promise<PressItem | null> {
    return findBySlug(pressItems, slug);
  },
};
