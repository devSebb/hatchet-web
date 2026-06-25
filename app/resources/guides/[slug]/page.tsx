import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { GuideGate } from "@/components/resources/GuideGate";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionDivider } from "@/components/sections/SectionDivider";
import { Badge } from "@/components/ui/badge";
import { content } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

type GuidePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const guides = await content.getGuides();

  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await content.getGuide(slug);

  if (!guide) {
    notFound();
  }

  return createMetadata({
    title: guide.title,
    description: guide.summary,
    path: `/resources/guides/${guide.slug}`,
  });
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = await content.getGuide(slug);

  if (!guide) {
    notFound();
  }

  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow={guide.gated ? "Gated guide" : "Open guide"}
        subtitle={guide.summary}
        title={guide.title}
      />

      <SectionDivider surface="paper" />

      <article className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div>
            {guide.coverImage ? (
              <div className="border-border relative aspect-[16/9] overflow-hidden rounded-xl border shadow-sm">
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  priority
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  src={guide.coverImage}
                />
              </div>
            ) : null}

            <div className="border-border bg-card mt-6 rounded-xl border p-6 shadow-sm lg:p-8">
              <Badge variant={guide.gated ? "default" : "outline"}>
                {guide.gated ? "Form-gated" : "Open access"}
              </Badge>
              <h2 className="h1 mt-5">What this guide helps teams do.</h2>
              <p className="body-lg text-muted mt-5">{guide.summary}</p>
              <ul className="mt-8 grid gap-3">
                {[
                  "Frame the live-streaming market read around decisions.",
                  "Translate creator, game, and audience movement into proof.",
                  "Give stakeholders a repeatable structure for future readouts.",
                ].map((item) => (
                  <li className="flex gap-3 text-sm" key={item}>
                    <span
                      aria-hidden="true"
                      className="bg-signal mt-2 size-1.5 shrink-0 rounded-full"
                    />
                    <span className="text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {guide.gated ? (
            <GuideGate title={guide.title} />
          ) : (
            <aside className="border-border bg-card rounded-xl border p-6 shadow-sm lg:sticky lg:top-28">
              <p className="eyebrow text-muted">Open guide</p>
              <h2 className="h3 mt-4">Ready to read.</h2>
              <p className="body text-muted mt-4">
                This ungated guide renders directly. A future phase can replace
                this placeholder with the full guide body or a downloadable
                asset.
              </p>
            </aside>
          )}
        </div>
      </article>

      <SectionDivider />

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Keep building the framework"
        title="Use Hatchet data to make the next readout easier to defend."
      />
    </main>
  );
}
