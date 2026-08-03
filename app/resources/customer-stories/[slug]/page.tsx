import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleProse } from "@/components/resources/ArticleProse";
import { StoryLogo } from "@/components/resources/StoryLogo";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { content } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

type CustomerStoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const stories = await content.getCustomerStories();

  return stories.map((story) => ({
    slug: story.slug,
  }));
}

export async function generateMetadata({
  params,
}: CustomerStoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await content.getCustomerStory(slug);

  if (!story) {
    notFound();
  }

  return createMetadata({
    title: `${story.company} Customer Story`,
    description: story.summary,
    path: `/resources/customer-stories/${story.slug}`,
  });
}

export default async function CustomerStoryPage({
  params,
}: CustomerStoryPageProps) {
  const { slug } = await params;
  const story = await content.getCustomerStory(slug);

  if (!story) {
    notFound();
  }

  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Customer story"
        subtitle={story.summary}
        title={`${story.company} uses Hatchet to read the market signal.`}
      />

      <article className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.75fr_1fr] lg:items-start">
          <aside className="border-border bg-card rounded-xl border p-6 shadow-sm lg:sticky lg:top-28">
            <StoryLogo
              className="h-12 w-44"
              height={32}
              priority
              sizes="176px"
              story={story}
            />
            {story.industry ? (
              <Badge className="mt-8" variant="outline">
                {story.industry}
              </Badge>
            ) : null}
            {story.metric ? (
              <p className="text-foreground mt-8 font-mono text-4xl leading-none font-bold tracking-[-0.01em] tabular-nums">
                {story.metric}
              </p>
            ) : null}
            {story.quote ? (
              <blockquote className="body-lg text-muted mt-8">
                &ldquo;{story.quote}&rdquo;
              </blockquote>
            ) : null}
          </aside>

          <div className="border-border bg-card rounded-xl border p-6 shadow-sm lg:p-10">
            <p className="eyebrow text-muted">Readout</p>
            <h2 className="h1 mt-4">The business problem and live signal.</h2>

            {story.contentHtml ? (
              <ArticleProse className="mt-8" html={story.contentHtml} />
            ) : (
              // Stories mirrored from WordPress live in a gated PDF rather than
              // on the page, so there is no body to render — show the cover and
              // send the reader to the download instead of an empty column.
              <div className="mt-8">
                <p className="body-lg text-muted">{story.summary}</p>
                {story.coverImage ? (
                  <div className="border-border relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border shadow-sm">
                    <Image
                      alt=""
                      className="object-cover"
                      fill
                      sizes="(min-width: 1024px) 56vw, 100vw"
                      src={story.coverImage}
                    />
                  </div>
                ) : null}
                <Button asChild className="mt-8">
                  <Link href="/about/contact">Request the full case study</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </article>

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Build the next story"
        title="Turn your live-streaming data into a story stakeholders can use."
      />
    </main>
  );
}
