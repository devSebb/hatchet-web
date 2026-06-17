import Image from "next/image";

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

function LogoTrack({
  logos,
  ariaHidden = false,
}: {
  logos: LogoItem[];
  ariaHidden?: boolean;
}) {
  return (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center"
    >
      {logos.map((logo) => (
        <div
          className="flex shrink-0 items-center justify-center px-8 sm:px-10 lg:px-14"
          key={`${ariaHidden ? "dup-" : ""}${logo.name}`}
        >
          {logo.src ? (
            <div className="relative h-12 w-44 sm:h-14 sm:w-48 lg:h-16 lg:w-56">
              <Image
                alt={`${logo.name} logo`}
                className="object-contain"
                fill
                sizes="224px"
                src={logo.src}
              />
            </div>
          ) : (
            <span className="font-display text-paper-muted text-center text-xl font-semibold">
              {logo.name}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function LogoWall({
  eyebrow = "Trusted signal",
  title = "Used by teams that need the market read before it becomes obvious.",
  logos = defaultLogos,
  className,
}: LogoWallProps) {
  return (
    <section className={cn("py-14", className)}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="eyebrow text-muted">{eyebrow}</p>
          <h2 className="h2 mt-3">{title}</h2>
        </div>
      </div>

      <div className="logo-marquee-mask group mt-10 w-full overflow-hidden">
        <div className="animate-logo-marquee flex w-max group-hover:[animation-play-state:paused]">
          <LogoTrack logos={logos} />
          <LogoTrack ariaHidden logos={logos} />
        </div>
      </div>
    </section>
  );
}
