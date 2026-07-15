import { VisualShell } from "hatchet-web";

export function Default() {
  return (
    <VisualShell label="Channel leaderboard" meta="32 platforms">
      <div className="text-muted text-sm py-[20px] text-center">
        Data visualization content
      </div>
    </VisualShell>
  );
}

export function WithoutMeta() {
  return (
    <VisualShell label="Viewership trends">
      <div className="text-muted text-sm py-[20px] text-center">
        Chart content
      </div>
    </VisualShell>
  );
}
