type EmptyStateProps = {
  title: string;
  body: string;
};

export function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <div className="border-border bg-card rounded-xl border p-6 text-center shadow-sm">
      <p className="font-display text-foreground text-lg font-semibold">
        {title}
      </p>
      <p className="body text-muted mx-auto mt-3 max-w-2xl">{body}</p>
    </div>
  );
}
