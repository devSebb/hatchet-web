"use client";

import { useEffect } from "react";
import Link from "next/link";

import { PageHeader } from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/button";

/**
 * Route-level boundary: catches render errors in any page below the root
 * layout, keeping the header, footer, and navigation intact so a broken
 * section never takes the whole site down.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Reaches the platform log (Vercel captures console output from the server
    // and the browser). Swap this for a Sentry/monitoring call when one exists.
    console.error("[route error]", error.digest ?? "", error);
  }, [error]);

  return (
    <main className="bg-background text-foreground">
      <PageHeader
        eyebrow="Something went wrong"
        subtitle="This section failed to render. The rest of the site is unaffected — retry, or head back and try another route."
        title="We hit an error loading this page."
      />

      <section className="surface-paper bg-background text-foreground px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-wrap gap-3">
            <Button onClick={reset}>Try again</Button>
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </div>

          {error.digest ? (
            <p className="small text-muted mt-6">
              Reference: <code className="font-mono">{error.digest}</code>
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
