import { Sparkline } from "hatchet-web";

export function Rising() {
  return (
    <div className="bg-card rounded-xl p-6 w-64">
      <Sparkline data={[4, 6, 5, 9, 8, 12, 15, 14, 18, 22]} height={80} />
    </div>
  );
}

export function Flat() {
  return (
    <div className="bg-card rounded-xl p-6 w-64">
      <Sparkline data={[10, 11, 9, 10, 11, 10, 12, 10, 11, 10]} height={80} />
    </div>
  );
}

export function Declining() {
  return (
    <div className="bg-card rounded-xl p-6 w-64">
      <Sparkline data={[20, 18, 16, 17, 14, 12, 10, 9, 7, 5]} height={80} />
    </div>
  );
}
