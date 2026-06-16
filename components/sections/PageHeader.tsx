import { Sparkline } from "@/components/signal/Sparkline";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  signal?: boolean;
  className?: string;
};

const accentData = [12, 18, 16, 29, 25, 42, 38, 54, 51, 68];

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  signal = false,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24",
        className,
      )}
    >
      <div className="max-w-4xl">
        {eyebrow ? <p className="eyebrow text-muted">{eyebrow}</p> : null}
        <h1 className="display mt-4">{title}</h1>
        {subtitle ? (
          <p className="body-lg text-muted mt-5 max-w-3xl">{subtitle}</p>
        ) : null}
      </div>
      {signal ? (
        <Sparkline
          className="mt-10 max-w-xl opacity-80"
          data={accentData}
          height={40}
        />
      ) : null}
    </section>
  );
}
