import type {
  ContentProvider,
  CustomerStory,
  Guide,
  Post,
  PressItem,
} from "@/lib/content/types";

const notImplementedMessage = "WordPress provider not yet implemented";

function notImplemented(): never {
  throw new Error(notImplementedMessage);
}

export function normalizeBrand(html: string): string {
  return html.replace(/Stream Hatchet/g, "Hatchet");
}

export const wordpressProvider: ContentProvider = {
  async getPosts(): Promise<Post[]> {
    notImplemented();
  },

  async getPost(): Promise<Post | null> {
    notImplemented();
  },

  async getCustomerStories(): Promise<CustomerStory[]> {
    notImplemented();
  },

  async getCustomerStory(): Promise<CustomerStory | null> {
    notImplemented();
  },

  async getGuides(): Promise<Guide[]> {
    notImplemented();
  },

  async getGuide(): Promise<Guide | null> {
    notImplemented();
  },

  async getPressItems(): Promise<PressItem[]> {
    notImplemented();
  },

  async getPressItem(): Promise<PressItem | null> {
    notImplemented();
  },
};
