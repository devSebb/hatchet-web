import type { ComponentType } from "react";

import type { SolutionVisualKey } from "@/lib/config/solutions";

import {
  RosterTable,
  MessagingInbox,
  PromoCodeDashboard,
} from "./visuals/CreatorCommunityVisuals";
import {
  ChannelLeaderboard,
  FakeAudienceScore,
  GameLeaderboard,
  GenreBenchmarks,
  LaunchIntelligence,
  SmartSearch,
} from "./visuals/DiscoveryVisuals";
import {
  DashboardBuilder,
  EsportsDashboard,
  GroupsTable,
  MentionTracker,
  VodTrend,
} from "./visuals/IntelligenceVisuals";
import {
  CampaignBreakdown,
  CustomReportGallery,
} from "./visuals/ReportingVisuals";

const registry: Record<SolutionVisualKey, ComponentType> = {
  "discovery-leaderboard": ChannelLeaderboard,
  "discovery-smart-search": SmartSearch,
  "discovery-fake-audience": FakeAudienceScore,
  "discovery-games": GameLeaderboard,
  "discovery-launch-intel": LaunchIntelligence,
  "discovery-genres": GenreBenchmarks,
  "intelligence-mentions": MentionTracker,
  "intelligence-groups": GroupsTable,
  "intelligence-vod": VodTrend,
  "intelligence-esports": EsportsDashboard,
  "intelligence-dashboards": DashboardBuilder,
  "creator-roster": RosterTable,
  "creator-messaging": MessagingInbox,
  "creator-codes": PromoCodeDashboard,
  "reporting-campaigns": CampaignBreakdown,
  "reporting-custom": CustomReportGallery,
};

export function SolutionVisual({ visual }: { visual: SolutionVisualKey }) {
  const Visual = registry[visual];
  return <Visual />;
}
