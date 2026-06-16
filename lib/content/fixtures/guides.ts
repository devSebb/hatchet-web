import type { Guide } from "@/lib/content/types";

export const guides = [
  {
    slug: "launch-readout-template",
    title: "Game launch readout template",
    summary:
      "A practical framework for reporting launch performance across creators, categories, platforms, and audience retention.",
    coverImage: "/images/content/launch-readout-template.jpg",
    gated: true,
  },
  {
    slug: "creator-shortlist-scorecard",
    title: "Creator shortlist scorecard",
    summary:
      "A worksheet for evaluating gaming creators by audience quality, category fit, momentum, and sponsor risk.",
    coverImage: "/images/content/creator-scorecard.jpg",
    gated: false,
  },
  {
    slug: "esports-sponsor-measurement",
    title: "Esports sponsor measurement guide",
    summary:
      "How to compare official broadcasts, co-streams, watch parties, and long-tail clips in one sponsor readout.",
    coverImage: "/images/content/esports-sponsor-guide.jpg",
    gated: false,
  },
] satisfies Guide[];
