import type { Metadata } from "next";

import { BlogExplorer } from "@/components/resources/BlogExplorer";
import type { PostCardPost } from "@/components/resources/PostCard";
import { CTASection } from "@/components/sections/CTASection";
import { content } from "@/lib/content";
import type { Post } from "@/lib/content/types";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Blog & Trends",
    description:
      "Read Hatchet analysis on gaming, esports, creators, audience movement, and live-streaming market intelligence.",
    path: "/blog",
  });
}

/**
 * Drops `contentHtml` before the list crosses into the browser. The full posts
 * are ~840KB of article markup; what a card paints is ~32KB.
 */
function toCard(post: Post) {
  const card: PostCardPost = {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags,
    coverImage: post.coverImage,
    coverImageAlt: post.coverImageAlt,
    publishedAt: post.publishedAt,
    readingMinutes: post.readingMinutes,
    author: post.author,
  };

  return card;
}

export default async function BlogPage() {
  const posts = [...(await content.getPosts())].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  // Alphabetical, not first-appearance: derived from a date-sorted list, the
  // chip order otherwise reshuffles itself on every content sync and gives a
  // reader no way to predict where a topic sits.
  const categories = Array.from(
    new Set(posts.map((post) => post.category)),
  ).sort((a, b) => a.localeCompare(b));

  return (
    <main className="bg-background text-foreground">
      {/* Deliberately shorter than the shared PageHeader the other routes use.
          An index is a place to start scanning, so the header states what the
          page is and gets out of the way — the first cards are on screen
          without a scroll. It stays on the dark scope so the sticky site header
          keeps the backdrop its contrast was set against. */}
      <section className="w-full px-4 pt-6 pb-6 sm:px-6 lg:px-8 lg:pt-8 lg:pb-8">
        {/* Two columns from lg, so the subtitle fills the space a single
            left-aligned column leaves empty instead of adding two more lines of
            height to the band above the grid. */}
        <div className="mx-auto grid w-full max-w-7xl gap-x-10 gap-y-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="eyebrow text-muted">Blog and trends</p>
            {/* Set at h2 scale: this is an index, and the display size the other
                routes use costs a third of the fold before a reader sees a
                single article. */}
            <h1 className="h2 mt-3">
              Analysis for the teams reading gaming in motion.
            </h1>
          </div>
          <p className="body-lg text-muted lg:pb-1">
            Market reads on creator velocity, game launches, esports audiences,
            brand planning, and the platform shifts shaping live streaming.
          </p>
        </div>
      </section>

      <section className="surface-paper bg-background text-foreground px-4 pt-[40px] pb-16 sm:px-6 lg:px-8 lg:pt-[48px] lg:pb-24">
        <div className="mx-auto w-full max-w-7xl">
          <BlogExplorer categories={categories} posts={posts.map(toCard)} />
        </div>
      </section>

      <CTASection
        body="Creator, audience, and campaign intelligence for gaming teams, in one place."
        className="py-18 lg:py-24"
        eyebrow="Keep reading the market"
        title="Use Hatchet analysis as the start of a sharper live-streaming read."
      />
    </main>
  );
}
