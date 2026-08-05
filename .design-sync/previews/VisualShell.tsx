import { VisualShell } from "hatchet-web";

export function Default() {
  return (
    <VisualShell label="Channel leaderboard" meta="32 platforms">
      <div className="text-muted py-[20px] text-center text-sm">
        Data visualization content
      </div>
    </VisualShell>
  );
}

export function WithoutMeta() {
  return (
    <VisualShell label="Viewership trends">
      <div className="text-muted py-[20px] text-center text-sm">
        Chart content
      </div>
    </VisualShell>
  );
}
