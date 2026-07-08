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
      "Other tools give you data or execution. Hatchet gives you both, with depth and coverage no other tool can match.",
    path: "/why-hatchet",
  });
}

export default function WhyHatchetPage() {
  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Why Hatchet"
        primaryCta={{ label: "Book a Demo", href: siteConfig.bookDemoUrl }}
        secondaryCta={{ label: "See How We Compare", href: "#comparison" }}
        subtitle="Other tools give you data or execution. Hatchet gives you both, with depth and coverage no other tool can match."
        title="Cut Through The Noise with Hatchet"
      />

      <WhyHatchetPoints />

      <ComparisonTable />

      <CTASection
        body="Book a 30-minute demo. We'll show you exactly what Hatchet can do for your team."
        className="py-18 lg:py-24"
        cta={{ label: "Book a Demo", href: siteConfig.bookDemoUrl }}
        title="Get Your Hands on Hatchet"
      />
    </main>
  );
}
