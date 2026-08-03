/**
 * Lives apart from components/resources/ResourceCards so a client component can
 * format a date without pulling that module's whole import graph (next/image,
 * the brand logo registry, the button primitives) into its bundle.
 */
export function formatContentDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
