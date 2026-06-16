import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="bg-background text-foreground flex min-h-screen items-center">
      <section className="mx-auto grid w-full max-w-5xl gap-8 px-6 py-24 md:grid-cols-[1fr_18rem] md:items-end md:px-10">
        <div className="space-y-6">
          <p className="eyebrow text-muted">Hatchet scaffold</p>
          <h1 className="display max-w-3xl">
            Live-streaming intelligence, ready for the marketing build.
          </h1>
          <p className="body-lg text-muted max-w-2xl">
            The design-token foundation is in place. Use the styleguide to
            review type, color, shadcn primitives, and the future Signal slots.
          </p>
          <Button asChild>
            <Link href="/styleguide">Review styleguide</Link>
          </Button>
        </div>

        <div className="border-border bg-surface rounded-lg border p-6 shadow-md">
          <p className="eyebrow text-muted">Proof placeholder</p>
          <p className="stat-figure text-foreground mt-4">40M+</p>
          <p className="small text-muted mt-3">
            Creator-scale figures will become product proof in the homepage
            pass.
          </p>
        </div>
      </section>
    </main>
  );
}
