import { Counter } from "hatchet-web";

// Counter uses --foreground (white) for text; wrap in bg-card so it's visible.

export function Millions() {
  return (
    <div className="bg-card inline-block rounded-xl p-6">
      <Counter to={1200000} suffix="+" />
    </div>
  );
}

export function WithPrefix() {
  return (
    <div className="bg-card inline-block rounded-xl p-6">
      <Counter to={99} prefix="$" suffix="M" />
    </div>
  );
}

export function Percentage() {
  return (
    <div className="bg-card inline-block rounded-xl p-6">
      <Counter to={94} suffix="%" />
    </div>
  );
}

export function Decimal() {
  return (
    <div className="bg-card inline-block rounded-xl p-6">
      <Counter to={3.7} suffix="B hrs" decimals={1} />
    </div>
  );
}
