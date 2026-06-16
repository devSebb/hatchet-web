import Image from "next/image";

import { Stagger } from "@/components/motion/Stagger";
import { cn } from "@/lib/utils";

type LogoItem = {
  name: string;
  src?: string;
};

type LogoWallProps = {
  eyebrow?: string;
  title?: string;
  logos?: LogoItem[];
  className?: string;
};

const defaultLogos = [
  {
    name: "Riot Games",
    src: "/images/logos/riot-games.png",
  },
  {
    name: "Microsoft",
    src: "/images/logos/microsoft.png",
  },
  {
    name: "Blizzard",
    src: "/images/logos/blizzard.png",
  },
  {
    name: "Electronic Arts",
    src: "/images/logos/ea.png",
  },
  {
    name: "Google",
    src: "/images/logos/google.png",
  },
  {
    name: "NASCAR",
    src: "/images/logos/nascar.png",
  },
  {
    name: "YouTube",
    src: "/images/logos/youtube.png",
  },
] satisfies LogoItem[];

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
        <Stagger className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {logos.map((logo) => (
            <div
              className="group border-border bg-paper-surface hover:border-signal/50 flex h-24 items-center justify-center rounded-lg border p-4 shadow-sm transition-[border-color,transform,box-shadow] duration-(--dur-base) hover:-translate-y-0.5 hover:shadow-md"
              key={logo.name}
            >
              {logo.src ? (
                <div className="relative h-12 w-36 max-w-full">
                  <Image
                    alt={`${logo.name} logo`}
                    className="object-contain opacity-75 grayscale transition-[filter,opacity] duration-(--dur-base) group-hover:opacity-100 group-hover:grayscale-0"
                    fill
                    sizes="144px"
                    src={logo.src}
                  />
                </div>
              ) : (
                <span className="font-display text-paper-muted text-center text-lg font-semibold">
                  {logo.name}
                </span>
              )}
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
