import type { Metadata } from "next";

import { CTASection } from "@/components/sections/CTASection";
import { MonitorMockup } from "@/components/sections/MonitorMockup";
import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Monitor mockup preview",
    description: "Internal preview canvas for the monitor hardware mockup.",
    path: "/styleguide/monitor",
    noIndex: true,
  });
}

// Isolated canvas for reviewing/exporting the monitor mockup at full bleed.
export default function MonitorMockupPreviewPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-[48px] bg-[#0b0c0f] py-[64px]">
      <div className="w-full px-[64px]">
        <MonitorMockup
          image={{
            src: "/images/hero-dashboard.png",
            alt: "Hatchet Creator Discovery dashboard on a studio display",
            width: 3488,
            height: 2243,
          }}
        />
      </div>
      {/* Same wiring as the homepage featured CTA, for in-context review. */}
      <CTASection
        body="Book a demo and see how Hatchet runs your entire creator program, from first search to final report."
        className="w-full py-0"
        cta={{ label: "Book a Demo", href: siteConfig.bookDemoUrl }}
        eyebrow="Book a demo"
        media={{
          src: "/images/hero-dashboard.png",
          alt: "Hatchet dashboard on a studio display showing live-streaming analytics across platforms",
          width: 3488,
          height: 2243,
          frame: "monitor",
        }}
        title="Full picture. Verified data. Gaming expertise."
        variant="featured"
      />
    </main>
  );
}
