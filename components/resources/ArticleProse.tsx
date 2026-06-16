import { normalizeBrand } from "@/lib/content/providers/wordpress";
import { cn } from "@/lib/utils";

type ArticleProseProps = {
  html: string;
  className?: string;
};

export function ArticleProse({ html, className }: ArticleProseProps) {
  return (
    <div
      className={cn(
        "body text-muted [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&>p]:mb-5 [&>p:last-child]:mb-0",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: normalizeBrand(html) }}
    />
  );
}
