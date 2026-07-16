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
    <div className="border-brand/25 bg-surface/40 cta-panel-frame relative flex h-full w-full flex-col justify-center gap-2 overflow-hidden rounded-2xl border p-6 backdrop-blur-sm sm:p-7">
      {/* Brand-aware glow so the card reads as part of the brand system. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-12 -z-10 h-40 w-40 rounded-full bg-[var(--gradient-cta-glow)] blur-3xl"
      />

      <div>
        <p className="eyebrow text-brand">Newsletter</p>
        <p className="font-display text-foreground mt-2 text-base leading-snug font-semibold tracking-[-0.01em]">
          {config.title}
        </p>
      </div>

      <div>
        <form className="mt-1" noValidate onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor={`${fieldId}-email`}>
            Work email
          </label>
          {/* White field so the input pops off the navy footer; navy text inside. */}
          <div className="focus-within:ring-brand/40 flex h-8 items-center rounded-lg bg-white p-1 shadow-sm transition-shadow focus-within:ring-3">
            <input
              autoComplete="email"
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-[var(--bg)] outline-none placeholder:text-[color-mix(in_srgb,var(--bg)_45%,var(--white))]"
              id={`${fieldId}-email`}
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              type="email"
              value={email}
            />
            <button
              className="bg-brand text-primary-foreground focus-visible:ring-ring/50 inline-flex h-full shrink-0 items-center rounded-md px-4 text-sm font-medium transition-colors outline-none hover:bg-brand-strong focus-visible:ring-3"
              type="submit"
            >
              {config.submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
