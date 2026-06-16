import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ArticleProse } from "@/components/resources/ArticleProse";
import { formatContentDate } from "@/components/resources/ResourceCards";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { Badge } from "@/components/ui/badge";
import { content } from "@/lib/content";
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

  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow={post.category}
        signal
        subtitle={post.excerpt}
        title={post.title}
      />

      <SectionDivider surface="paper" />

      <article className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">{post.category}</Badge>
            <span className="small text-muted">
              {formatContentDate(post.publishedAt)}
            </span>
            {post.author ? (
              <span className="small text-muted">By {post.author.name}</span>
            ) : null}
          </div>

          {post.coverImage ? (
            <div className="border-border relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border shadow-sm">
              <Image
                alt=""
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
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </article>

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Read the next signal"
        secondaryCta={{ label: "All posts", href: "/blog" }}
        title="Bring live-streaming analysis into the next planning meeting."
      />
    </main>
  );
}
