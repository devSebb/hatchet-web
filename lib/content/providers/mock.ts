import { customerStories } from "@/lib/content/fixtures/customer-stories";
import { guides } from "@/lib/content/fixtures/guides";
import { posts } from "@/lib/content/fixtures/posts";
import { pressItems } from "@/lib/content/fixtures/press";
import type {
  ContentProvider,
  CustomerStory,
  Guide,
  Post,
  PressItem,
} from "@/lib/content/types";

function findBySlug<T extends { slug: string }>(
  items: readonly T[],
  slug: string,
): T | null {
  return items.find((item) => item.slug === slug) ?? null;
}

export const mockProvider: ContentProvider = {
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
