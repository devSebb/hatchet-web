import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { EmptyState } from "@/components/resources/EmptyState";
import { PostCard } from "@/components/resources/ResourceCards";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { Badge } from "@/components/ui/badge";
import { content } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

type BlogPageProps = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Blog & Trends",
    description:
      "Read Hatchet analysis on gaming, esports, creators, audience movement, and live-streaming market intelligence.",
    path: "/blog",
  });
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const posts = [...(await content.getPosts())].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const categories = Array.from(new Set(posts.map((post) => post.category)));
  const activeCategory = params?.category;
  const filteredPosts = activeCategory
    ? posts.filter((post) => post.category === activeCategory)
    : posts;

  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Blog and trends"
        subtitle="Market reads on creator velocity, game launches, esports audiences, brand planning, and the platform shifts shaping live streaming."
        title="Analysis for the teams reading gaming in motion."
      />

      <SectionDivider surface="paper" />

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow text-muted">Filter by category</p>
                <h2 className="h1 mt-4">Find the signal by topic.</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  asChild
                  variant={!activeCategory ? "default" : "outline"}
                >
                  <Link href="/blog">All</Link>
                </Badge>
                {categories.map((category) => (
                  <Badge
                    asChild
                    key={category}
                    variant={
                      activeCategory === category ? "default" : "outline"
                    }
                  >
                    <Link
                      href={`/blog?category=${encodeURIComponent(category)}`}
                    >
                      {category}
                    </Link>
                  </Badge>
                ))}
              </div>
            </div>
          </Reveal>

          {filteredPosts.length ? (
            <Stagger className="mt-10 grid gap-4 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </Stagger>
          ) : (
            <div className="mt-10">
              <EmptyState
                body="This topic is ready for the first Hatchet market read."
                title="This topic is ready for a market read"
              />
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Keep reading the market"
        secondaryCta={{ label: "Resource hub", href: "/resources" }}
        title="Use Hatchet analysis as the start of a sharper live-streaming read."
      />
    </main>
  );
}
