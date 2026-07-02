import { Check, X } from "@phosphor-icons/react/ssr";

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

function IncludedMark() {
  return (
    <span className="inline-flex size-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
      <Check aria-hidden="true" className="size-4" weight="bold" />
      <span className="sr-only">Included</span>
    </span>
  );
}

function NotIncludedMark() {
  return (
    <span className="bg-brand/10 text-brand inline-flex size-7 items-center justify-center rounded-full">
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
      <div className="mx-auto w-full max-w-5xl">
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
          <table className="mt-12 w-full border-collapse">
            <thead>
              <tr>
                <th className="sr-only" scope="col">
                  Capability
                </th>
                <th className="w-24 pb-4 text-center sm:w-32" scope="col">
                  <span className="bg-bg inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-white">
                    Hatchet
                  </span>
                </th>
                <th
                  className="text-muted w-24 pb-4 text-center text-sm font-semibold sm:w-32"
                  scope="col"
                >
                  Other Tools
                </th>
              </tr>
            </thead>
            <tbody className="divide-border border-border divide-y border-y">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.title}>
                  <th className="py-5 pr-4 text-left align-top" scope="row">
                    <p className="text-foreground font-semibold">{row.title}</p>
                    <p className="small text-muted mt-1 font-normal">
                      {row.description}
                    </p>
                  </th>
                  <td className="bg-bg/5 py-5 text-center align-middle">
                    <IncludedMark />
                  </td>
                  <td className="py-5 text-center align-middle">
                    <NotIncludedMark />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
