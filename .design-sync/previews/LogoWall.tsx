import { LogoWall } from "hatchet-web";

// Text-only logos since image paths don't resolve outside the Next.js app
const textLogos = [
  { name: "Riot Games" },
  { name: "Microsoft" },
  { name: "Blizzard" },
  { name: "Electronic Arts" },
  { name: "Google" },
  { name: "NASCAR" },
  { name: "YouTube" },
];

export function Default() {
  return (
    <div className="bg-bg">
      <LogoWall
        logos={textLogos}
        title="Used by teams that need the market read before it becomes obvious."
      />
    </div>
  );
}

export function WithEyebrow() {
  return (
    <div className="bg-bg">
      <LogoWall
        eyebrow="Trusted by"
        logos={textLogos}
        title="The teams behind the world's biggest gaming and streaming brands."
      />
    </div>
  );
}
