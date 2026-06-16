import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatContentDate } from "@/components/resources/ResourceCards";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { content } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

type PressItemPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const pressItems = await content.getPressItems();

  return pressItems.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: PressItemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await content.getPressItem(slug);

  if (!item) {
    notFound();
  }

  return createMetadata({
    title: item.title,
    description: item.excerpt,
    path: `/resources/press/${item.slug}`,
  });
}

export default async function PressItemPage({ params }: PressItemPageProps) {
  const { slug } = await params;
  const item = await content.getPressItem(slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="bg-background text-foreground">
      <PageHeader eyebrow="Press" subtitle={item.excerpt} title={item.title} />

      <SectionDivider surface="paper" />

      <article className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="border-border bg-card mx-auto w-full max-w-4xl rounded-xl border p-6 shadow-sm lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            {item.outlet ? (
              <Badge variant="outline">{item.outlet}</Badge>
            ) : null}
            <span className="small text-muted">
              {formatContentDate(item.date)}
            </span>
          </div>
          <h2 className="h1 mt-8">Press summary</h2>
          <p className="body-lg text-muted mt-5">{item.excerpt}</p>
          <p className="body text-muted mt-6">
            This press detail route is rendered from the content adapter. It can
            later expand into full newsroom copy, partner coverage, or a
            canonical external publication link.
          </p>
          {item.url ? (
            <Button asChild className="mt-8">
              <Link href={item.url}>Open source article</Link>
            </Button>
          ) : null}
        </div>
      </article>

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="More from Hatchet"
        secondaryCta={{ label: "All press", href: "/resources/press" }}
        title="Follow the company news behind the live signal."
      />
    </main>
  );
}
