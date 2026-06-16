import type { Metadata } from "next";

import { LegalPage } from "@/components/sections/LegalPage";
import { legalPages } from "@/lib/config/marketing";
import { createMetadata } from "@/lib/seo";

const page = legalPages.privacy;

export function generateMetadata(): Metadata {
  return createMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
  });
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      description={page.description}
      sections={page.sections}
      title={page.title}
    />
  );
}
