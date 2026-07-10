import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type VisualShellProps = {
  /** Uppercase label in the chrome bar, e.g. "Channel leaderboard". */
  label: string;
  /** Right-aligned meta note in the chrome bar, e.g. "32 platforms". */
  meta?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

/**
 * Shared chrome for the product-mock visuals on the solutions pages: a paper
 * card with a labeled header bar, echoing the dashboard framing in the
 * content team's mockups. Keep inner data-viz compact — the theme's named
 * spacing steps are doubled (p-6 = 48px), so lean on arbitrary px values.
 */
export function VisualShell({
  label,
  meta,
  children,
  className,
  contentClassName,
}: VisualShellProps) {
  return (
    <figure
      className={cn(
        "border-border bg-card overflow-hidden rounded-xl border shadow-md",
        className,
      )}
    >
      <figcaption className="border-border flex items-center justify-between gap-4 border-b px-[20px] py-[12px]">
        <span className="eyebrow text-muted flex items-center gap-[10px]">
          <span aria-hidden="true" className="bg-signal h-[12px] w-[3px]" />
          {label}
        </span>
        {meta ? (
          <span className="text-muted font-mono text-[11px] tracking-[0.08em] uppercase">
            {meta}
          </span>
        ) : null}
      </figcaption>
      <div className={cn("p-[20px]", contentClassName)}>{children}</div>
    </figure>
  );
}
