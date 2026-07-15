import { CreatorLifecycleOrbital } from "@/components/sections/CreatorLifecycleOrbital";
import { cn } from "@/lib/utils";

export function CreatorLifecycle({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "bg-background text-foreground relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24",
        // Clears the sticky header (~105px) when linked to via /#how-it-works.
        "scroll-mt-[120px]",
        className,
      )}
      id="how-it-works"
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
          <h2 className="h1">How Hatchet Works</h2>
        </div>

        <CreatorLifecycleOrbital className="mt-8" />
      </div>
    </section>
  );
}
