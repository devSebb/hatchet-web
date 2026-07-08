/**
 * Canonical option lists for the book-a-demo screening questions. Shared by the
 * client form (renders them) and the server validation (enforces membership) so
 * the two can never drift.
 */

/** "What would you like to cover?" — grounded in the site's solution areas. */
export const TOPIC_OPTIONS = [
  "Full platform walkthrough",
  "Creator discovery & vetting",
  "Campaign intelligence & tracking",
  "Creator community management",
  "Reporting & measurement",
  "Pricing & plans",
  "Something else",
] as const;

/** "How did you hear about us?" — single choice. */
export const REFERRAL_OPTIONS = [
  "Referral from a colleague",
  "Referral from someone in the industry",
  "I've used Hatchet before",
  "My own research",
  "LinkedIn",
  "Hatchet newsletter",
  "Blog or press article",
  "Industry event or conference",
  "Gaming community (Discord, Reddit, Twitter/X)",
  "Other",
] as const;

export const REFERRAL_OTHER = "Other";

export type TopicOption = (typeof TOPIC_OPTIONS)[number];
export type ReferralOption = (typeof REFERRAL_OPTIONS)[number];
