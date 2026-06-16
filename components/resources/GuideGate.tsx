import Link from "next/link";

import { HubSpotForm } from "@/components/forms/HubSpotForm";
import { Button } from "@/components/ui/button";

type GuideGateProps = {
  title: string;
};

export function GuideGate({ title }: GuideGateProps) {
  return (
    <section id="hubspot-form">
      <HubSpotForm
        description="Gated guides route through this shared HubSpot shell. Real HubSpot submission wiring lands in a later phase."
        id="guide-access"
        title={`Request access to ${title}.`}
        type="guide"
      />
      <Button asChild className="mt-4" variant="link">
        <Link href="/resources/guides">Back to guides</Link>
      </Button>
    </section>
  );
}
