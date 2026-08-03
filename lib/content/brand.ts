/**
 * Lives apart from the content providers on purpose: this is imported by
 * rendering code (ArticleProse, the solutions config), and importing it from
 * the WordPress provider would pull that provider's ~870KB of snapshot JSON
 * into every module graph that needs nothing but this one string replacement.
 */

/**
 * The rebrand rename. The sync script already normalizes what it writes, so at
 * render time this is a safety net for fixture and hand-authored copy; the
 * replacement is idempotent.
 */
export function normalizeBrand(html: string): string {
  return html.replace(/Stream Hatchet/g, "Hatchet");
}
