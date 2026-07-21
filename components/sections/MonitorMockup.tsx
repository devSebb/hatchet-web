import Image from "next/image";

import { cn } from "@/lib/utils";

type MonitorMockupProps = {
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  className?: string;
};

/**
 * A flat, front-facing desktop-monitor frame — slim dark bezel, stand neck,
 * and a wide low base — with a real product screenshot as the screen. The
 * chrome is pure CSS (vector-crisp at any size) and the screenshot renders at
 * its natural aspect ratio, so it is never cropped and can be swapped without
 * re-compositing artwork.
 *
 * All chrome dimensions are width-relative (% + aspect-ratio) so the monitor
 * keeps its proportions from a hero column down to a mobile card.
 */
export function MonitorMockup({ image, className }: MonitorMockupProps) {
  return (
    <div
      aria-label={image.alt}
      className={cn("mx-auto w-full max-w-4xl", className)}
      role="img"
    >
      <div aria-hidden="true" className="flex flex-col items-center">
        {/* Panel: bezel + screen. The hairline ring separates the bezel from
            the (mostly white) screenshot the way a powered-on LCD edge does. */}
        <div
          className="w-full rounded-[clamp(8px,1.6%,16px)] p-[1.6%]"
          style={{
            background: "linear-gradient(180deg, #17181c 0%, #0b0c0f 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.09), 0 24px 60px -18px rgba(0,0,0,0.55)",
          }}
        >
          <div className="overflow-hidden rounded-[clamp(3px,0.5%,6px)] bg-black ring-1 ring-black/60">
            <Image
              alt={image.alt}
              className="h-auto w-full"
              height={image.height}
              sizes="(min-width: 1024px) 56rem, 100vw"
              src={image.src}
              width={image.width}
            />
          </div>
        </div>

        {/* Stand neck — a slight trapezoid, darker at the panel joint. */}
        <div
          className="aspect-[2.4/1] w-[12%]"
          style={{
            background: "linear-gradient(180deg, #0c0d10 0%, #1d1f24 100%)",
            clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0 100%)",
          }}
        />
        {/* Base — a wide, low slab with soft ends. */}
        <div
          className="aspect-[46/2] w-[46%] rounded-[999px]"
          style={{
            background: "linear-gradient(180deg, #26282d 0%, #101114 85%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
          }}
        />
        {/* Floor shadow anchoring the monitor to the ground plane. */}
        <div
          className="mt-[0.6%] h-[10px] w-[46%] rounded-[50%]"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.5) 0%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />
      </div>
    </div>
  );
}
