import { mockProvider } from "@/lib/content/providers/mock";
import { wordpressProvider } from "@/lib/content/providers/wordpress";
import type { ContentProvider } from "@/lib/content/types";

export const content: ContentProvider =
  process.env.CONTENT_SOURCE === "wordpress" ? wordpressProvider : mockProvider;
