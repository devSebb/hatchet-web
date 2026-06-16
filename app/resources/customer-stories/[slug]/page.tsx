import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ArticleProse } from "@/components/resources/ArticleProse";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { Badge } from "@/components/ui/badge";
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

      <SectionDivider surface="paper" />

      <article className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.75fr_1fr] lg:items-start">
          <aside className="border-border bg-card rounded-xl border p-6 shadow-sm lg:sticky lg:top-28">
            <div className="relative h-12 w-44">
              <Image
                alt={`${story.company} logo`}
                className="object-contain object-left"
                fill
                priority
                sizes="176px"
                src={story.logo}
              />
            </div>
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
            <blockquote className="body-lg text-muted mt-8">
              &ldquo;{story.quote}&rdquo;
            </blockquote>
          </aside>

          <div className="border-border bg-card rounded-xl border p-6 shadow-sm lg:p-10">
            <p className="eyebrow text-muted">Readout</p>
            <h2 className="h1 mt-4">The business problem and live signal.</h2>
            <ArticleProse className="mt-8" html={story.contentHtml} />
          </div>
        </div>
      </article>

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Build the next story"
        secondaryCta={{
          label: "All customer stories",
          href: "/resources/customer-stories",
        }}
        title="Turn your live-streaming data into a story stakeholders can use."
      />
    </main>
  );
}
