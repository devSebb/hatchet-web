import { Check, X } from "@phosphor-icons/react/ssr";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

type ComparisonRow = {
  title: string;
  description: string;
};

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    title: "Creator-to-purchase attribution",
    description: "Tie creator spend to actual game sales & downloads.",
  },
  {
    title: "Fake audience & bot detection",
    description: "Flag inflated channels before you spend.",
  },
  {
    title: "Full campaign lifecycle in one platform",
    description:
      "Discovery, outreach, code management & reporting without leaving Hatchet.",
  },
  {
    title: "API-sourced, verified viewership data",
    description:
      "Real numbers from the source — not algorithmic estimates or browser-extension samples.",
  },
  {
    title: "Gaming-native intelligence",
    description:
      "Twitch drops, game launch benchmarking, Hours Watched — the metrics that matter for you.",
  },
  {
    title: "10+ years of historical streaming data",
    description: "Real benchmarks for real budget conversations.",
  },
  {
    title: "55M+ creators across 32 platforms",
    description: "Live streaming and social in one unified view.",
  },
  {
    title: "AI Smart Search",
    description: "Describe the creator you need, get a match.",
  },
];

// Value columns share fixed widths so the elevated Hatchet pillar (an
// absolutely positioned layer behind the middle column) stays aligned with
// its cells at every viewport. Keep these three width pairs in sync.
const VALUE_COL = "w-20 sm:w-28";
const PILLAR_POS = "right-20 w-20 sm:right-28 sm:w-28";

function IncludedMark() {
  return (
    <span className="inline-flex size-6 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_0_14px_color-mix(in_srgb,#22c55e_45%,transparent)]">
      <Check aria-hidden="true" className="size-3.5" weight="bold" />
      <span className="sr-only">Included</span>
    </span>
  );
}

function NotIncludedMark() {
  return (
    <span className="inline-flex size-6 items-center justify-center text-red-500">
      <X aria-hidden="true" className="size-4" weight="bold" />
      <span className="sr-only">Not included</span>
    </span>
  );
}

export function ComparisonTable({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "surface-paper bg-background text-foreground scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8 lg:py-24",
        className,
      )}
      id="comparison"
    >
      <div className="mx-auto w-full max-w-4xl">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow text-muted">Competitor comparison</p>
            <h2 className="h1 mt-4">The only platform that does it all.</h2>
            <p className="body-lg text-muted mt-5">
              Most tools give you data or execution, gaming or social, a
              snapshot or a workflow. Hatchet is the only platform that covers
              the full picture — built for gaming from day one.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative mt-6">
            {/* Frame around the whole table */}
            <div
              aria-hidden="true"
              className="border-border bg-elevated/10 absolute inset-0 rounded-2xl border"
            />

            {/* Elevated Hatchet pillar behind the middle column */}
            <div
              aria-hidden="true"
              className={cn(
                "bg-bg cta-panel-frame absolute -inset-y-1 overflow-hidden rounded-xl shadow-[0_24px_48px_-20px_color-mix(in_srgb,var(--bg)_50%,transparent),0_8px_22px_-12px_color-mix(in_srgb,var(--bg)_38%,transparent)] sm:-inset-y-1.5",
                PILLAR_POS,
              )}
            />

            <table className="relative w-full border-collapse">
              <thead>
                <tr>
                  <th className="sr-only" scope="col">
                    Capability
                  </th>
                  <th
                    className={cn("py-3.5 text-center align-middle", VALUE_COL)}
                    scope="col"
                  >
                    <BrandLogo
                      alt="Hatchet"
                      className="mx-auto h-3.5 w-auto max-w-[80%] object-contain object-center sm:h-4"
                      variant="white"
                    />
                  </th>
                  <th
                    className={cn(
                      "text-muted py-3.5 text-center align-middle text-xs font-semibold sm:text-sm",
                      VALUE_COL,
                    )}
                    scope="col"
                  >
                    Other Tools
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr
                    className="hover:bg-bg/3 transition-colors"
                    key={row.title}
                  >
                    <th
                      className="border-border border-t py-2 pr-4 pl-5 text-left align-middle sm:pl-6"
                      scope="row"
                    >
                      <p className="text-foreground text-sm font-semibold">
                        {row.title}
                      </p>
                      <p className="text-muted mt-0.5 hidden text-xs font-normal sm:block">
                        {row.description}
                      </p>
                    </th>
                    <td className="border-t border-white/10 py-2 text-center align-middle">
                      <IncludedMark />
                    </td>
                    <td className="border-border border-t py-2 text-center align-middle">
                      <NotIncludedMark />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
