import { Stagger } from "@/components/motion/Stagger";
import { cn } from "@/lib/utils";

type LogoWallProps = {
  eyebrow?: string;
  title?: string;
  logos?: string[];
  className?: string;
};

const defaultLogos = [
  "Riot",
  "Microsoft",
  "PlayStation",
  "Activision",
  "Ubisoft",
  "Capcom",
  "NASCAR",
  "YouTube",
];

export function LogoWall({
  eyebrow = "Trusted signal",
  title = "Used by teams that need the market read before it becomes obvious.",
  logos = defaultLogos,
  className,
}: LogoWallProps) {
  return (
    <section className={cn("px-4 py-14 sm:px-6 lg:px-8", className)}>
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <p className="eyebrow text-muted">{eyebrow}</p>
          <h2 className="h2 mt-3">{title}</h2>
        </div>
        <Stagger className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {logos.map((logo) => (
            <div
              className="border-border bg-surface/70 text-muted hover:border-signal/50 hover:bg-elevated hover:text-foreground font-display flex h-20 items-center justify-center rounded-lg border px-3 text-center text-sm font-semibold grayscale transition-[filter,color,border-color,background-color] duration-(--dur-base) hover:grayscale-0"
              key={logo}
            >
              {logo}
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
