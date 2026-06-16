import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { EmptyState } from "@/components/resources/EmptyState";
import {
  CustomerStoryCard,
  GuideCard,
  PostCard,
  PressCard,
} from "@/components/resources/ResourceCards";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { Button } from "@/components/ui/button";
import { content } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Resources",
    description:
      "Explore Hatchet blog posts, customer stories, guides, and press built from the content adapter.",
    path: "/resources",
  });
}

function sortByDate<T extends { publishedAt?: string; date?: string }>(
  items: T[],
) {
  return [...items].sort((a, b) => {
    const aDate = a.publishedAt ?? a.date ?? "";
    const bDate = b.publishedAt ?? b.date ?? "";

    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });
}

export default async function ResourcesPage() {
  const [posts, stories, guides, pressItems] = await Promise.all([
    content.getPosts(),
    content.getCustomerStories(),
    content.getGuides(),
    content.getPressItems(),
  ]);

  const latestPosts = sortByDate(posts).slice(0, 3);
  const latestStories = stories.slice(0, 3);
  const latestGuides = guides.slice(0, 3);
  const latestPress = sortByDate(pressItems).slice(0, 3);

  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Resources"
        signal
        subtitle="Read market analysis, customer examples, practical guides, and company news from the Hatchet content adapter."
        title="The live-streaming market read, organized for teams."
      />

      <SectionDivider surface="paper" />

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow text-muted">Blog and trends</p>
                <h2 className="h1 mt-4">
                  Analysis for gaming, creator, and live-streaming decisions.
                </h2>
              </div>
              <Button asChild variant="outline">
                <Link href="/blog">View all posts</Link>
              </Button>
            </div>
          </Reveal>

          {latestPosts.length ? (
            <Stagger className="mt-10 grid gap-4 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </Stagger>
          ) : (
            <div className="mt-10">
              <EmptyState
                body="The blog stream is ready for the first market read."
                title="No posts yet"
              />
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow text-muted">Customer stories</p>
                <h2 className="h1 mt-4">
                  How teams frame the signal for their work.
                </h2>
              </div>
              <Button asChild variant="secondary">
                <Link href="/resources/customer-stories">View stories</Link>
              </Button>
            </div>
          </Reveal>

          {latestStories.length ? (
            <Stagger className="mt-10 grid gap-4 lg:grid-cols-3">
              {latestStories.map((story) => (
                <CustomerStoryCard key={story.slug} story={story} />
              ))}
            </Stagger>
          ) : (
            <div className="mt-10">
              <EmptyState
                body="This section is ready for the first customer readout."
                title="No customer stories yet"
              />
            </div>
          )}
        </div>
      </section>

      <SectionDivider surface="paper" />

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow text-muted">Guides</p>
                <h2 className="h1 mt-4">
                  Practical frameworks for repeatable market reads.
                </h2>
              </div>
              <Button asChild variant="outline">
                <Link href="/resources/guides">View guides</Link>
              </Button>
            </div>
          </Reveal>

          {latestGuides.length ? (
            <Stagger className="mt-10 grid gap-4 lg:grid-cols-3">
              {latestGuides.map((guide) => (
                <GuideCard guide={guide} key={guide.slug} />
              ))}
            </Stagger>
          ) : (
            <div className="mt-10">
              <EmptyState
                body="The guide library is ready for the first framework."
                title="No guides yet"
              />
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow text-muted">Press</p>
                <h2 className="h1 mt-4">
                  Company news and market coverage in one place.
                </h2>
              </div>
              <Button asChild variant="secondary">
                <Link href="/resources/press">View press</Link>
              </Button>
            </div>
          </Reveal>

          {latestPress.length ? (
            <Stagger className="mt-10 grid gap-4 lg:grid-cols-3">
              {latestPress.map((item) => (
                <PressCard item={item} key={item.slug} />
              ))}
            </Stagger>
          ) : (
            <div className="mt-10">
              <EmptyState
                body="The newsroom is ready for the next company signal."
                title="No press items yet"
              />
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Use the signal"
        secondaryCta={{ label: "Explore solutions", href: "/solutions" }}
        title="Turn the latest market read into your next decision."
      />
    </main>
  );
}
