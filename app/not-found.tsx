import Link from "next/link";

import { CTASection } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/button";

/**
 * Also serves every `notFound()` call in the content routes — a report, post,
 * or story slug that no longer exists in the WordPress snapshot lands here
 * rather than on Next's unstyled default.
 */
export default function NotFound() {
  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="404"
        subtitle="The page you are looking for has moved, been renamed, or never existed. The links below cover most of what people arrive looking for."
        title="That page is not here."
      />

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/resources/guides">Browse reports</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/blog">Read the blog</Link>
            </Button>
          </div>
        </div>
      </section>

      <CTASection
        className="py-18 lg:py-24"
        eyebrow="Still looking"
        title="Tell us what you needed to find."
      />
    </main>
  );
}
