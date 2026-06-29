"use client";

import { useEffect, useId } from "react";

import { Button } from "@/components/ui/button";
import { getHubSpotFormConfig, type HubSpotFormType } from "@/lib/hubspot";
import { cn } from "@/lib/utils";

type HubSpotFormProps = {
  type: HubSpotFormType;
  id?: string;
  title?: string;
  description?: string;
  compact?: boolean;
  className?: string;
};

export function HubSpotForm({
  type,
  id,
  title,
  description,
  compact = false,
  className,
}: HubSpotFormProps) {
  const config = getHubSpotFormConfig(type);
  const hasPortal = Boolean(config.portalId);
  const hasFormId = Boolean(config.formId);
  const generatedId = useId().replace(/:/g, "");
  const fieldPrefix = `${type}-${generatedId}`;

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && (!hasPortal || !hasFormId)) {
      console.warn(
        `[HubSpotForm] "${type}" not wired: ${
          hasPortal ? "" : "portal id missing"
        }${!hasPortal && !hasFormId ? ", " : ""}${
          hasFormId ? "" : "form id missing"
        }. Set NEXT_PUBLIC_HUBSPOT_* env vars.`,
      );
    }
  }, [type, hasPortal, hasFormId]);

  return (
    <form
      className={cn(
        "border-border bg-card text-card-foreground grid gap-4 rounded-xl border p-5 shadow-sm",
        compact && "gap-3 rounded-lg p-4",
        className,
      )}
      id={id}
    >
      <div>
        <p className="eyebrow text-muted">{config.eyebrow}</p>
        <h2
          className={cn(
            "font-display text-foreground mt-3 font-semibold tracking-[-0.015em]",
            compact ? "text-base" : "text-2xl",
          )}
        >
          {title ?? config.title}
        </h2>
        <p className="small text-muted mt-2">
          {description ?? config.description}
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <label className="sr-only" htmlFor={`${fieldPrefix}-email`}>
          Work email
        </label>
        <input
          className="border-border bg-background focus-visible:ring-ring/50 h-10 rounded-lg border px-3 text-sm outline-none focus-visible:ring-3"
          id={`${fieldPrefix}-email`}
          name="email"
          placeholder="name@company.com"
          type="email"
        />
        <Button type="button">{config.submitLabel}</Button>
      </div>

      {type !== "newsletter" && !compact ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="sr-only" htmlFor={`${fieldPrefix}-company`}>
            Company
          </label>
          <input
            className="border-border bg-background focus-visible:ring-ring/50 h-10 rounded-lg border px-3 text-sm outline-none focus-visible:ring-3"
            id={`${fieldPrefix}-company`}
            name="company"
            placeholder="Company"
            type="text"
          />
          <label className="sr-only" htmlFor={`${fieldPrefix}-role`}>
            Role
          </label>
          <input
            className="border-border bg-background focus-visible:ring-ring/50 h-10 rounded-lg border px-3 text-sm outline-none focus-visible:ring-3"
            id={`${fieldPrefix}-role`}
            name="role"
            placeholder="Role"
            type="text"
          />
        </div>
      ) : null}

    </form>
  );
}
