import { mockProvider } from "@/lib/content/providers/mock";
import { wordpressProvider } from "@/lib/content/providers/wordpress";
import type { ContentProvider } from "@/lib/content/types";

/**
 * Real content is the default; the hand-written fixtures are opt-in via
 * CONTENT_SOURCE=mock.
 *
 * This used to be the other way round, which meant any environment that forgot
 * the env var (Vercel did) silently shipped fixture articles instead of the
 * WordPress snapshot. Defaulting the other way is safe: the snapshot is
 * committed under lib/content/generated/, so the real source needs no network
 * access and no configuration to build.
 */
export const content: ContentProvider =
  process.env.CONTENT_SOURCE === "mock" ? mockProvider : wordpressProvider;
