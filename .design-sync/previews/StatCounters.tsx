import { StatCounters } from "hatchet-web";

export function Default() {
  return <StatCounters />;
}

export function WithHeading() {
  return (
    <StatCounters
      eyebrow="The data foundation"
      title={
        <>
          Every signal, every platform,{" "}
          <span className="text-brand">at a glance.</span>
        </>
      }
    />
  );
}
