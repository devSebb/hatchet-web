export type HubSpotFormType = "bookDemo" | "signUp" | "newsletter" | "guide";

export type HubSpotFormConfig = {
  type: HubSpotFormType;
  title: string;
  description: string;
  eyebrow: string;
  submitLabel: string;
  portalId?: string;
  formId?: string;
};

const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;

const formIds = {
  bookDemo: process.env.NEXT_PUBLIC_HUBSPOT_BOOK_DEMO_FORM_ID,
  signUp: process.env.NEXT_PUBLIC_HUBSPOT_SIGN_UP_FORM_ID,
  newsletter: process.env.NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID,
  guide: process.env.NEXT_PUBLIC_HUBSPOT_GUIDE_FORM_ID,
} satisfies Record<HubSpotFormType, string | undefined>;

const formCopy = {
  bookDemo: {
    eyebrow: "Book a demo",
    title: "See Hatchet with your market questions.",
    description:
      "This shell will mount the HubSpot demo form once portal and form IDs are configured.",
    submitLabel: "Book a demo",
  },
  signUp: {
    eyebrow: "Sign up",
    title: "Start a Hatchet workspace request.",
    description:
      "This shell holds the future sign-up form without sending real submissions in this phase.",
    submitLabel: "Sign up",
  },
  newsletter: {
    eyebrow: "Streamlined",
    title: "Get a concise read on gaming and live-streaming movement.",
    description:
      "This footer shell will connect to the HubSpot newsletter form in a later phase.",
    submitLabel: "Notify me",
  },
  guide: {
    eyebrow: "Guide access",
    title: "Request the guide.",
    description:
      "This gated content shell will route through HubSpot when real form wiring lands.",
    submitLabel: "Request the guide",
  },
} satisfies Record<
  HubSpotFormType,
  Omit<HubSpotFormConfig, "type" | "portalId" | "formId">
>;

export function getHubSpotFormConfig(type: HubSpotFormType): HubSpotFormConfig {
  return {
    type,
    portalId,
    formId: formIds[type],
    ...formCopy[type],
  };
}
