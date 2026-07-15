import { EmptyState } from "hatchet-web";

export function Default() {
  return (
    <EmptyState
      title="No data available"
      body="There is no data matching your current filters. Try adjusting your date range or platform selection."
    />
  );
}

export function ShortMessage() {
  return (
    <EmptyState
      title="No results found"
      body="Your search returned no matches. Check spelling or try a broader query."
    />
  );
}
