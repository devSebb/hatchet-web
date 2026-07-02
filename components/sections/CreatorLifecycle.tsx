import { CreatorLifecycleOrbital } from "@/components/sections/CreatorLifecycleOrbital";
import { cn } from "@/lib/utils";

export function CreatorLifecycle({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "bg-background text-foreground relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="cta-grid pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="cta-grain pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <p className="eyebrow text-muted">How Hatchet Works</p>
          <h2 className="h1 mt-4">The full creator lifecycle. One platform.</h2>
          <p className="body-lg text-muted mt-5">
            From first search to final report — without switching tools.
          </p>
        </div>

        <CreatorLifecycleOrbital className="mt-8" />
      </div>
    </section>
  );
}
