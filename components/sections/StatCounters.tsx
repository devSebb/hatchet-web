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
    label: "Channels tracked",
    value: 40,
    suffix: "M+",
    description: "Creator and channel records connected to gaming audiences.",
    sparkline: [12, 18, 17, 24, 31, 35, 44],
  },
  {
    label: "Minutes processed daily",
    value: 2.8,
    suffix: "B",
    description: "Live viewing minutes normalized into usable market signal.",
    sparkline: [20, 24, 27, 29, 34, 42, 51],
  },
  {
    label: "Chat messages tracked daily",
    value: 900,
    suffix: "M+",
    description:
      "Community reactions tied back to creators, games, and events.",
    sparkline: [30, 28, 34, 39, 46, 45, 58],
  },
  {
    label: "Creators tracked",
    value: 12,
    suffix: "M+",
    description: "Creator activity indexed across live-streaming platforms.",
    sparkline: [10, 15, 14, 22, 29, 34, 43],
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
              <Sparkline data={stat.sparkline} height={28} strokeWidth={1.25} />
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
