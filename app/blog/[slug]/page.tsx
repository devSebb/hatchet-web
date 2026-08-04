import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ArticleProse } from "@/components/resources/ArticleProse";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { Badge } from "@/components/ui/badge";
import { content } from "@/lib/content";
import { formatContentDate } from "@/lib/content/format";
import { createMetadata } from "@/lib/seo";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = await content.getPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await content.getPost(slug);

  if (!post) {
    notFound();
  }

  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await content.getPost(slug);

  if (!post) {
    notFound();
  }

  // WordPress stamps `modified` on any edit, down to a typo fix minutes after
  // publishing, so showing it verbatim would put "updated" on almost every
  // article. Only a revision on a later day is worth telling a reader about.
  const revisedAt =
    post.updatedAt &&
    post.updatedAt.slice(0, 10) > post.publishedAt.slice(0, 10)
      ? post.updatedAt
      : null;

  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow={post.category}
        subtitle={post.excerpt}
        title={post.title}
      />

      <article className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-4xl">
          {/* The byline carries what the source article carries: who wrote it,
              when it ran, how long it takes, and — only when it is genuinely a
              later revision — when it was last revised. */}
          <div className="border-border flex flex-wrap items-center gap-x-3 gap-y-2 border-b pb-6">
            <Badge variant="outline">{post.category}</Badge>
            {post.author ? (
              <span className="small text-foreground font-semibold">
                {post.author.name}
              </span>
            ) : null}
            <time className="small text-muted" dateTime={post.publishedAt}>
              {formatContentDate(post.publishedAt)}
            </time>
            {post.readingMinutes ? (
              <>
                <span aria-hidden="true" className="text-muted/50 text-xs">
                  &bull;
                </span>
                <span className="small text-muted">
                  {post.readingMinutes} min read
                </span>
              </>
            ) : null}
            {revisedAt ? (
              <time className="small text-muted/80" dateTime={revisedAt}>
                (updated {formatContentDate(revisedAt)})
              </time>
            ) : null}
          </div>

          {post.coverImage ? (
            <div className="border-border relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border shadow-sm">
              <Image
                alt={post.coverImageAlt ?? ""}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 896px, 100vw"
                src={post.coverImage}
              />
            </div>
          ) : null}

          <ArticleProse className="mt-10" html={post.contentHtml} />

          {post.tags.length ? (
            <div className="border-border mt-10 border-t pt-6">
              <p className="eyebrow text-muted">Topics</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </article>

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Read the next signal"
        title="Bring live-streaming analysis into the next planning meeting."
      />
    </main>
  );
}
