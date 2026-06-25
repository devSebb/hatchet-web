import { Counter } from "@/components/motion/Counter";
import { Sparkline } from "@/components/signal/Sparkline";
import { cn } from "@/lib/utils";

export type StatItem = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description: string;
  sparkline: number[];
};

type StatCountersProps = {
  eyebrow?: string;
  title?: string;
  stats?: StatItem[];
  className?: string;
};

const defaultStats: StatItem[] = [
  {
    label: "Live platforms tracked",
    value: 20,
    suffix: "+",
    description:
      "Twitch, YouTube, Kick, and more — major and emerging platforms in one normalized view.",
    sparkline: [9, 11, 12, 14, 16, 18, 21],
  },
  {
    label: "History since 2016",
    value: 10,
    suffix: "+ yrs",
    description:
      "Minute-level viewership data going back to 2016, ready for trend and benchmark analysis.",
    sparkline: [3, 4, 5, 6, 7, 8, 10],
  },
  {
    label: "Data granularity",
    value: 1,
    suffix: "-min",
    description:
      "Every stream measured at one-minute resolution — the industry's highest standard.",
    sparkline: [12, 14, 13, 15, 16, 18, 20],
  },
  {
    label: "Core metrics tracked",
    value: 10,
    suffix: "+",
    description:
      "Hours watched, concurrent viewers, airtime, EMV, CPM, logo presence share, and more.",
    sparkline: [4, 5, 5, 7, 8, 9, 11],
  },
];

export function StatCounters({
  eyebrow = "Proof at signal scale",
  title = "Numbers that make market movement easier to trust.",
  stats = defaultStats,
  className,
}: StatCountersProps) {
  return (
    <section className={cn("px-4 py-16 sm:px-6 lg:px-8", className)}>
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <p className="eyebrow text-muted">{eyebrow}</p>
          <h2 className="h2 mt-3">{title}</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              className="border-border bg-surface rounded-xl border p-5 shadow-sm"
              key={stat.label}
            >
              <Sparkline
                color="var(--brand-highlight)"
                data={stat.sparkline}
                height={28}
                strokeWidth={1.25}
              />
              <p className="eyebrow text-muted mt-5">{stat.label}</p>
              <Counter
                className="text-foreground mt-3 block"
                decimals={Number.isInteger(stat.value) ? 0 : 1}
                prefix={stat.prefix}
                suffix={stat.suffix}
                to={stat.value}
              />
              <p className="small text-muted mt-4">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
