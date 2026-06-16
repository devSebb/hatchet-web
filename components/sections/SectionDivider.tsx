import { PulseDivider } from "@/components/signal/PulseDivider";
import { cn } from "@/lib/utils";

type SectionDividerProps = {
  surface?: "dark" | "paper";
  className?: string;
};

export function SectionDivider({
  surface = "dark",
  className,
}: SectionDividerProps) {
  return (
    <div
      className={cn(
        "bg-background",
        surface === "paper" && "surface-paper",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <PulseDivider />
      </div>
    </div>
  );
}
