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
      "Real numbers from the source, not algorithmic estimates or browser-extension samples.",
  },
  {
    title: "Gaming-native intelligence",
    description:
      "Twitch drops, game launch benchmarking, Hours Watched: the metrics that matter for you.",
  },
  {
    title: "10+ years of historical streaming data",
    description: "Real benchmarks for real budget conversations.",
  },
  {
    title: "50M+ creators across 30+ platforms",
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
const VALUE_COL = "w-24 sm:w-32";
const PILLAR_POS = "right-24 w-24 sm:right-32 sm:w-32";

function IncludedMark() {
  return (
    <span className="inline-flex size-4 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_0_14px_color-mix(in_srgb,#22c55e_45%,transparent)]">
      <Check aria-hidden="true" className="size-[14px]" weight="bold" />
      <span className="sr-only">Included</span>
    </span>
  );
}

function NotIncludedMark() {
  return (
    <span className="inline-flex size-5 items-center justify-center text-red-500">
      <X aria-hidden="true" className="size-[18px]" weight="bold" />
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
            <p className="body-lg text-muted mt-3">
              Hatchet is multi-purpose: no need to choose when you can have
              everything. Data AND execution. Socials AND streaming. Gaming
              AND lifestyle.
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
                    className={cn("py-2.5 text-center align-middle", VALUE_COL)}
                    scope="col"
                  >
                    <BrandLogo
                      alt="Hatchet"
                      className="mx-auto h-4 w-auto max-w-[80%] object-contain object-center sm:h-5"
                      variant="white"
                    />
                  </th>
                  <th
                    className={cn(
                      "text-muted py-2.5 text-center align-middle text-sm font-semibold sm:text-base",
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
                      className="border-border border-t py-1.5 pr-4 pl-5 text-left align-middle sm:pl-6"
                      scope="row"
                    >
                      <p className="text-foreground text-sm font-semibold">
                        {row.title}
                      </p>
                      <p className="text-muted mt-0.5 hidden text-xs font-normal sm:block">
                        {row.description}
                      </p>
                    </th>
                    <td className="border-t border-white/10 py-1.5 text-center align-middle">
                      <IncludedMark />
                    </td>
                    <td className="border-border border-t py-1.5 text-center align-middle">
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
