import Link from "next/link";

import { Button } from "@/components/ui/button";

type GuideGateProps = {
  title: string;
};

export function GuideGate({ title }: GuideGateProps) {
  return (
    <section
      className="border-border bg-card rounded-xl border p-6 shadow-sm lg:p-8"
      id="hubspot-form"
    >
      <p className="eyebrow text-muted">HubSpot form shell</p>
      <h2 className="h3 mt-4">Request access to {title}.</h2>
      <p className="body text-muted mt-4">
        Gated guides will route through the shared HubSpot form component in
        Phase 9. This shell keeps the content flow and anchor target in place
        without sending real submissions.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="sr-only" htmlFor="guide-email">
          Work email
        </label>
        <input
          className="border-border bg-background focus-visible:ring-ring/50 h-10 rounded-lg border px-3 text-sm outline-none focus-visible:ring-3"
          id="guide-email"
          name="email"
          placeholder="name@company.com"
          type="email"
        />
        <Button type="button">Request the guide</Button>
      </div>
      <Button asChild className="mt-4" variant="link">
        <Link href="/resources/guides">Back to guides</Link>
      </Button>
    </section>
  );
}
