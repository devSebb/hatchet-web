export interface Post {
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

export interface CustomerStory {
  slug: string;
  company: string;
  logo: string;
  quote: string;
  metric?: string;
  industry?: string;
  summary: string;
  contentHtml: string;
}

export interface Guide {
  slug: string;
  title: string;
  summary: string;
  coverImage?: string;
  gated: boolean;
}

export interface PressItem {
  slug: string;
  title: string;
  outlet?: string;
  date: string;
  url?: string;
  excerpt: string;
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
