import type { Metadata } from "next";

import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { WhyHatchetPoints } from "@/components/sections/WhyHatchetPoints";
import { siteConfig } from "@/lib/config/site";
import { createMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Why Hatchet",
    description:
      "Most tools give you data or execution. Hatchet gives you both, with depth and coverage no other tools can match.",
    path: "/why-hatchet",
  });
}

export default function WhyHatchetPage() {
  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Why Hatchet"
        subtitle="Most tools give you data or execution. Hatchet gives you both, with depth and coverage no other tools can match."
        title="Built differently. Built for gaming."
      />

      <WhyHatchetPoints />

      <ComparisonTable />

      <CTASection
        body="Book a 30-min demo and we'll show you exactly what Hatchet can do for your team."
        className="py-18 lg:py-24"
        cta={{ label: "Book a Demo", href: siteConfig.bookDemoUrl }}
        title="See the full picture for yourself."
      />
    </main>
  );
}
