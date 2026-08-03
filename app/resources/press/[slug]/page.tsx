import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { content } from "@/lib/content";
import { formatContentDate } from "@/lib/content/format";
import { createMetadata } from "@/lib/seo";

type PressItemPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * Only items Hatchet publishes itself get a page here. Coverage that lives on
 * another site links straight out from the index, so generating a detail page
 * for it would produce a thin stub that just restates the headline.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const pressItems = await content.getPressItems();

  return pressItems
    .filter((item) => !item.url)
    .map((item) => ({
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
    description:
      item.excerpt ??
      `${item.title}${item.outlet ? ` — coverage in ${item.outlet}` : ""}.`,
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
          {item.excerpt ? (
            <p className="body-lg text-muted mt-5">{item.excerpt}</p>
          ) : null}
          {item.url ? (
            <Button asChild className="mt-8">
              <Link href={item.url} rel="noopener noreferrer" target="_blank">
                Read on {item.outlet ?? "the publisher"}
              </Link>
            </Button>
          ) : null}
        </div>
      </article>

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="More from Hatchet"
        title="Follow the company news behind the live signal."
      />
    </main>
  );
}
