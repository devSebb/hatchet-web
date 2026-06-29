"use client";

import { useId, useState } from "react";

import { getHubSpotFormConfig } from "@/lib/hubspot";

export function FooterNewsletter() {
  const config = getHubSpotFormConfig("newsletter");
  const fieldId = useId().replace(/:/g, "");
  const [email, setEmail] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO(hubspot): wire to the HubSpot newsletter form once
    // NEXT_PUBLIC_HUBSPOT_PORTAL_ID + NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID are
    // set (config.formId is currently empty → shell only, no submission).
    if (!config.formId) {
      return;
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* {{VERIFY}} eyebrow copy */}
      <p className="eyebrow text-muted">Newsletter</p>
      {/* config.title is the content-owned line; eyebrow/helper still {{VERIFY}} */}
      <p className="font-display text-foreground mt-2 text-lg font-semibold tracking-[-0.01em]">
        {config.title}
      </p>

      <form className="mt-4" noValidate onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor={`${fieldId}-email`}>
          Work email
        </label>
        {/* Single joined control: input + button share one height, button inset 4px. */}
        <div className="border-border bg-elevated focus-within:ring-ring/50 flex h-12 items-center rounded-lg border p-1 transition-shadow focus-within:ring-3">
          <input
            autoComplete="email"
            className="text-foreground placeholder:text-muted h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
            id={`${fieldId}-email`}
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            type="email"
            value={email}
          />
          <button
            className="bg-gradient-brand text-primary-foreground focus-visible:ring-ring/50 inline-flex h-full shrink-0 items-center rounded-md px-4 text-sm font-medium transition-[filter] outline-none hover:brightness-105 focus-visible:ring-3"
            type="submit"
          >
            {/* {{VERIFY}} button copy (from content config) */}
            {config.submitLabel}
          </button>
        </div>
        {/* {{VERIFY}} helper microcopy */}
        <p className="small text-muted mt-2">No spam. Unsubscribe anytime.</p>
      </form>
    </div>
  );
}
