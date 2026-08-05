import { HeroStatVisual } from "hatchet-web";

export function Cluster() {
  return (
    <div className="surface-paper w-72 rounded-xl p-[20px]">
      <p className="stat-figure text-brand mb-4">1.2B+</p>
      <HeroStatVisual variant="cluster" />
    </div>
  );
}

export function Timeline() {
  return (
    <div className="surface-paper w-72 rounded-xl p-[20px]">
      <p className="stat-figure text-brand mb-4">10+ yrs</p>
      <HeroStatVisual variant="timeline" />
    </div>
  );
}

export function Density() {
  return (
    <div className="surface-paper w-72 rounded-xl p-[20px]">
      <p className="stat-figure text-brand mb-4">1.2M+</p>
      <HeroStatVisual variant="density" />
    </div>
  );
}
