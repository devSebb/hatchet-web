/**
 * Legal page content — privacy, terms, cookies.
 *
 * Split out of lib/config/marketing.ts so the two can be governed differently.
 * marketing.ts holds vertical and careers copy that the marketing editors are
 * expected to change. This file holds text that carries legal weight, is
 * currently PLACEHOLDER pending review by an actual lawyer, and must not be
 * edited by anyone but that reviewer — .claude/settings.json denies writes here.
 *
 * The three pages that consume it (app/privacy-policy, app/terms-of-service,
 * app/cookie-policy) each read one key and render `sections` verbatim.
 */
export const legalPages = {
  privacy: {
    title: "Privacy Policy",
    description:
      "How Hatchet handles personal information for marketing, site, and business communications.",
    path: "/privacy-policy",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "This placeholder policy covers contact details, business communication records, site usage data, and form submissions shared with Hatchet.",
          "Product app, rankings, reports, and live data systems are separate systems and will be documented independently.",
        ],
      },
      {
        heading: "How we use information",
        body: [
          "We use information to respond to demo requests, manage business relationships, improve the public site, and understand what content is useful to visitors.",
          "We do not use this placeholder site to process real HubSpot submissions yet.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          "Future versions will include operational contact paths for access, correction, deletion, and marketing preference requests.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    description:
      "Placeholder terms for using the Hatchet public marketing website.",
    path: "/terms-of-service",
    sections: [
      {
        heading: "Marketing site use",
        body: [
          "These placeholder terms describe use of the public Hatchet marketing website only.",
          "Product app access, reports, rankings, and live data products are governed by separate agreements.",
        ],
      },
      {
        heading: "Content and links",
        body: [
          "The site may link to external systems for demos, sign-up, login, reports, rankings, and resources.",
          "Placeholder copy and mock data in this scaffold are not final legal, commercial, or product commitments.",
        ],
      },
      {
        heading: "Updates",
        body: [
          "These terms will be replaced with reviewed legal language before launch.",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    description:
      "Placeholder cookie policy for the Hatchet public marketing website.",
    path: "/cookie-policy",
    sections: [
      {
        heading: "Cookie use",
        body: [
          "This placeholder page describes the kinds of cookies and similar technologies the marketing site may use in a later phase.",
          "Analytics, advertising, and HubSpot tracking are not wired for real submissions in this scaffold.",
        ],
      },
      {
        heading: "Managing preferences",
        body: [
          "A future consent and preference experience will define how visitors manage optional cookies.",
        ],
      },
      {
        heading: "Product systems",
        body: [
          "Cookie behavior for the product app and data products is outside this public-site scaffold.",
        ],
      },
    ],
  },
} as const;
